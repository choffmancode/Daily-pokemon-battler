/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Pokemon,
  Move,
  PokemonType,
  BattleAction,
  BattleState,
  BattleTurnLog,
  StatKey,
  StatChangeSpec,
  StatusCondition,
  WeatherType,
  SideConditions,
} from './types';
import { TYPE_CHART, CHAMPION_CYNTHIA_TEAM } from './constants';
import { enrichMoveWithMechanics, getMoveMechanics } from './data/moveMechanicsKB';
import { selectAdvancedAIMoveOrSwitch, selectBestRevengeSwitch } from './advancedAI';

// High-speed lookup caches for type effectiveness and deterministic damage
const TYPE_EFFECTIVENESS_CACHE = new Map<string, number>();
const DAMAGE_LOOKUP_CACHE = new Map<string, number>();
const MAX_DAMAGE_CACHE_SIZE = 512;

/**
 * Fast typed structural cloning (eliminates JSON.parse(JSON.stringify) overhead per CLEANUP_PLAN.md)
 */
export function cloneMove(m: Move): Move {
  return {
    ...m,
    statChange: m.statChange ? { ...m.statChange } : undefined,
    statChanges: m.statChanges ? m.statChanges.map((sc) => ({ ...sc })) : undefined,
    secondaryEffect: m.secondaryEffect
      ? {
          ...m.secondaryEffect,
          statChange: m.secondaryEffect.statChange ? { ...m.secondaryEffect.statChange } : undefined,
          statChanges: m.secondaryEffect.statChanges
            ? m.secondaryEffect.statChanges.map((sc) => ({ ...sc }))
            : undefined,
        }
      : undefined,
    multiHit: m.multiHit ? [m.multiHit[0], m.multiHit[1]] : undefined,
  };
}

export function clonePokemon(p: Pokemon): Pokemon {
  return {
    ...p,
    types: [...p.types],
    baseStats: { ...p.baseStats },
    moves: p.moves.map(cloneMove),
    statStages: p.statStages
      ? { ...p.statStages }
      : { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
    equippedCosmetics: p.equippedCosmetics ? { ...p.equippedCosmetics } : undefined,
  };
}

export function cloneBattleState(state: BattleState): BattleState {
  return {
    ...state,
    playerTeam: state.playerTeam.map(clonePokemon),
    opponentTeam: state.opponentTeam.map(clonePokemon),
    playerSideConditions: state.playerSideConditions ? { ...state.playerSideConditions } : undefined,
    opponentSideConditions: state.opponentSideConditions ? { ...state.opponentSideConditions } : undefined,
    combatLog: state.combatLog.slice(),
    protocolLog: state.protocolLog ? state.protocolLog.slice() : [],
    turnMoves: state.turnMoves ? state.turnMoves.map((tm) => ({ ...tm })) : [],
    lastMoveUsed: state.lastMoveUsed ? { ...state.lastMoveUsed } : undefined,
  };
}

/**
 * Computes type effectiveness multiplier against single or dual-type defender
 */
export function calculateTypeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  const key = `${moveType}:${defenderTypes.join(',')}`;
  const cached = TYPE_EFFECTIVENESS_CACHE.get(key);
  if (cached !== undefined) return cached;

  let multiplier = 1;
  const attackMap = TYPE_CHART[moveType];
  if (!attackMap) {
    TYPE_EFFECTIVENESS_CACHE.set(key, 1);
    return 1;
  }

  for (const defType of defenderTypes) {
    if (defType in attackMap) {
      const factor = attackMap[defType];
      if (factor !== undefined) {
        multiplier *= factor;
      }
    }
  }
  TYPE_EFFECTIVENESS_CACHE.set(key, multiplier);
  return multiplier;
}

/**
 * Gen 3 Emerald Stat Stage Multiplier (-6 to +6)
 */
export function getStatStageMultiplier(stage = 0): number {
  const clamped = Math.max(-6, Math.min(6, stage));
  if (clamped >= 0) return (2 + clamped) / 2;
  return 2 / (2 - clamped);
}

/**
 * Applies a stat stage delta (-6 to +6 clamping) and returns actual change
 */
export function applyStatStageChange(
  mon: Pokemon,
  stat: StatKey,
  delta: number
): { actualDelta: number; newStage: number } {
  if (!mon.statStages) {
    mon.statStages = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
  }
  const current = mon.statStages[stat] ?? 0;
  const clamped = Math.max(-6, Math.min(6, current + delta));
  mon.statStages[stat] = clamped;
  return { actualDelta: clamped - current, newStage: clamped };
}

/**
 * Calculates effective stat for any of the 6 stats considering stat stages (-6 to +6) and status
 */
export function calculateEffectiveStat(mon: Pokemon, stat: StatKey): number {
  if (stat === 'speed') {
    return calculateEffectiveSpeed(mon);
  }
  if (stat === 'accuracy' || stat === 'evasion') {
    const stage = mon.statStages?.[stat] ?? 0;
    return getStatStageMultiplier(stage);
  }
  const base = mon.baseStats[stat];
  const stage = mon.statStages?.[stat] ?? 0;
  const mult = getStatStageMultiplier(stage);
  return Math.max(1, Math.floor(base * mult));
}

/**
 * Calculates in-battle effective Speed considering stat stages and paralysis (Gen 3 standard)
 */
/**
 * Calculates in-battle effective Speed considering stat stages, status, items, abilities, and field effects
 */
export function calculateEffectiveSpeed(
  mon: Pokemon,
  weather?: WeatherType,
  sideConditions?: SideConditions
): number {
  let speed = mon.baseStats.speed;
  const stage = mon.statStages?.speed || 0;
  speed = Math.floor(speed * getStatStageMultiplier(stage));
  // Paralysis reduction: 0.5x speed
  if (mon.statusCondition === 'paralysis') {
    speed = Math.floor(speed * 0.5);
  }
  // Choice Scarf: 1.5x speed
  if (mon.heldItem === 'Choice Scarf' && !mon.heldItemConsumed) {
    speed = Math.floor(speed * 1.5);
  }
  // Unburden: 2x speed after held item is consumed
  if (mon.ability === 'Unburden' && mon.heldItemConsumed) {
    speed = Math.floor(speed * 2);
  }
  // Weather speed abilities
  if (weather === 'Rain' && mon.ability === 'Swift Swim') speed *= 2;
  if (weather === 'Sun' && mon.ability === 'Chlorophyll') speed *= 2;
  if (weather === 'Sand' && mon.ability === 'Sand Rush') speed *= 2;
  // Tailwind
  if (sideConditions?.tailwindTurns && sideConditions.tailwindTurns > 0) speed *= 2;
  return Math.max(1, speed);
}

/**
 * Checks whether a Pokemon is immune to a specific status condition by typing or ability
 */
export function isImmuneToStatus(mon: Pokemon, status: StatusCondition): boolean {
  if (status === 'burn' && mon.types.includes('Fire')) return true;
  if (status === 'paralysis' && (mon.types.includes('Electric') || mon.ability === 'Limber')) return true;
  if (
    (status === 'poison' || status === 'toxic') &&
    (mon.types.includes('Poison') || mon.types.includes('Steel') || mon.ability === 'Immunity')
  ) {
    return true;
  }
  if (status === 'freeze' && mon.types.includes('Ice')) return true;
  if (status === 'sleep' && (mon.ability === 'Insomnia' || mon.ability === 'Vital Spirit')) return true;
  return false;
}

/**
 * Calculates accurate Gen 3 Pokemon damage with STAB, type effectiveness, weather, burn, and critical hits
 */
export interface DamageCalculationOptions {
  rngVariance?: number;
  forceCrit?: boolean;
  weather?: WeatherType;
  isHail?: boolean;
  defenderSideConditions?: SideConditions;
}

const TYPE_BOOST_ITEMS: Record<string, PokemonType> = {
  'never-melt ice': 'Ice',
  'never_melt_ice': 'Ice',
  'nevermeltice': 'Ice',
  'magnet': 'Electric',
  'charcoal': 'Fire',
  'mystic water': 'Water',
  'mystic_water': 'Water',
  'miracle seed': 'Grass',
  'miracle_seed': 'Grass',
  'black belt': 'Fighting',
  'black_belt': 'Fighting',
  'soft sand': 'Ground',
  'soft_sand': 'Ground',
  'sharp beak': 'Flying',
  'sharp_beak': 'Flying',
  'twisted spoon': 'Psychic',
  'twisted_spoon': 'Psychic',
  'silver powder': 'Bug',
  'silver_powder': 'Bug',
  'hard stone': 'Rock',
  'hard_stone': 'Rock',
  'spell tag': 'Ghost',
  'spell_tag': 'Ghost',
  'dragon fang': 'Dragon',
  'dragon_fang': 'Dragon',
  'black glasses': 'Dark',
  'black_glasses': 'Dark',
  'metal coat': 'Steel',
  'metal_coat': 'Steel',
  'silk scarf': 'Normal',
  'silk_scarf': 'Normal',
  'poison barb': 'Poison',
  'poison_barb': 'Poison',
};

const RESIST_BERRIES: Record<string, PokemonType> = {
  'yache berry': 'Ice',
  'yache_berry': 'Ice',
  'rindo berry': 'Grass',
  'rindo_berry': 'Grass',
  'wacan berry': 'Electric',
  'wacan_berry': 'Electric',
  'charti berry': 'Rock',
  'charti_berry': 'Rock',
  'shuca berry': 'Ground',
  'shuca_berry': 'Ground',
  'colbur berry': 'Dark',
  'colbur_berry': 'Dark',
  'occa berry': 'Fire',
  'occa_berry': 'Fire',
  'passho berry': 'Water',
  'passho_berry': 'Water',
  'coba berry': 'Flying',
  'coba_berry': 'Flying',
  'payapa berry': 'Psychic',
  'payapa_berry': 'Psychic',
  'tanga berry': 'Bug',
  'tanga_berry': 'Bug',
  'haban berry': 'Dragon',
  'haban_berry': 'Dragon',
  'kasib berry': 'Ghost',
  'kasib_berry': 'Ghost',
  'babiri berry': 'Steel',
  'babiri_berry': 'Steel',
  'chople berry': 'Fighting',
  'chople_berry': 'Fighting',
  'roseli berry': 'Fairy',
  'roseli_berry': 'Fairy',
};

/**
 * Calculates accurate Gen 3-5 Pokemon damage with STAB, type effectiveness, weather, burn, items, and critical hits
 */
export function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  options?: DamageCalculationOptions
): { damage: number; isCrit: boolean; effectiveness: number } {
  if (move.category === 'Status' || (move.power === 0 && !move.fixedDamage)) {
    return { damage: 0, isCrit: false, effectiveness: 1 };
  }

  // Air Balloon Ground immunity
  const defenderItemKey = defender.heldItem?.toLowerCase().trim() || '';
  if (
    move.type === 'Ground' &&
    defender.heldItem &&
    !defender.heldItemConsumed &&
    defenderItemKey.includes('air balloon')
  ) {
    return { damage: 0, isCrit: false, effectiveness: 0 };
  }

  const effectiveness = calculateTypeEffectiveness(move.type, defender.types);
  if (effectiveness === 0) {
    return { damage: 0, isCrit: false, effectiveness: 0 };
  }

  if (move.fixedDamage) {
    return { damage: move.fixedDamage, isCrit: false, effectiveness };
  }

  const weather: WeatherType = options?.weather ?? (options?.isHail ? 'Hail' : 'Clear');
  let critChance = 0.0625;
  const critBonus = (move.critRatioBonus || 0) + (attacker.heldItem?.toLowerCase().includes('scope lens') ? 1 : 0);
  if (critBonus >= 3) {
    critChance = 1.0;
  } else if (critBonus === 2) {
    critChance = 0.25;
  } else if (critBonus === 1) {
    critChance = 0.125;
  }
  const isCrit = options?.forceCrit ?? Math.random() < critChance;
  const variance = options?.rngVariance ?? 0.85 + Math.random() * 0.15;

  const atkStage = attacker.statStages
    ? (move.category === 'Physical' ? attacker.statStages.attack : attacker.statStages.spAtk) || 0
    : 0;
  const defStage = defender.statStages
    ? (move.category === 'Physical' ? defender.statStages.defense : defender.statStages.spDef) || 0
    : 0;

  // Level factor: (2 * Level / 5) + 2
  const levelFactor = Math.floor((2 * attacker.level) / 5) + 2;

  // In Gen 3, critical hits ignore negative attack stages and positive defense stages
  const effectiveAtkStage = isCrit && atkStage < 0 ? 0 : atkStage;
  const effectiveDefStage = isCrit && defStage > 0 ? 0 : defStage;

  // Move Power adjustments (Facade, Knock Off, Technician)
  let movePower = move.power;
  const isFacade = Boolean(move.isFacade || move.id === 'facade');
  if (isFacade && attacker.statusCondition && ['burn', 'poison', 'toxic', 'paralysis'].includes(attacker.statusCondition)) {
    movePower = 140;
  }
  const isKnockOff = Boolean(move.isKnockOff || move.id === 'knock_off');
  if (isKnockOff && defender.heldItem && !defender.heldItemConsumed) {
    movePower = Math.floor(movePower * 1.5);
  }
  if (attacker.ability === 'Technician' && movePower > 0 && movePower <= 60) {
    movePower = Math.floor(movePower * 1.5);
  }

  // Calculate Base Attack
  let atk =
    (move.category === 'Physical' ? attacker.baseStats.attack : attacker.baseStats.spAtk) *
    getStatStageMultiplier(effectiveAtkStage);

  const attackerItemKey = attacker.heldItem?.toLowerCase().trim() || '';
  if (attacker.heldItem && !attacker.heldItemConsumed) {
    if (move.category === 'Physical' && attackerItemKey.includes('choice band')) {
      atk *= 1.5;
    } else if (move.category === 'Special' && attackerItemKey.includes('choice specs')) {
      atk *= 1.5;
    }
  }
  if (attacker.ability === 'Guts' && attacker.statusCondition && move.category === 'Physical') {
    atk *= 1.5;
  }

  // Calculate Base Defense (Psyshock hits physical defense!)
  const isPsyshock = Boolean(move.isPsyshock || move.id === 'psyshock' || move.id === 'psystrike');
  let def: number;
  if (isPsyshock) {
    const physDefStage = isCrit && (defender.statStages?.defense || 0) > 0 ? 0 : (defender.statStages?.defense || 0);
    def = defender.baseStats.defense * getStatStageMultiplier(physDefStage);
  } else {
    def =
      (move.category === 'Physical' ? defender.baseStats.defense : defender.baseStats.spDef) *
      getStatStageMultiplier(effectiveDefStage);
  }

  if (defender.heldItem && !defender.heldItemConsumed) {
    if (move.category === 'Special' && defenderItemKey.includes('assault vest')) {
      def *= 1.5;
    } else if (defenderItemKey.includes('eviolite')) {
      def *= 1.5;
    }
  }
  if (defender.ability === 'Marvel Scale' && defender.statusCondition && (move.category === 'Physical' || isPsyshock)) {
    def *= 1.5;
  }

  // Sandstorm boosts Rock-type Sp. Def by 1.5x
  if (weather === 'Sand' && move.category === 'Special' && !isPsyshock && defender.types.includes('Rock')) {
    def *= 1.5;
  }

  // Thick Fat halves Fire and Ice damage
  if (defender.ability === 'Thick Fat' && (move.type === 'Fire' || move.type === 'Ice')) {
    atk *= 0.5;
  }

  // Levitate grants immunity to Ground moves
  if (defender.ability === 'Levitate' && move.type === 'Ground') {
    return { damage: 0, isCrit: false, effectiveness: 0 };
  }

  def = Math.max(1, def);

  let baseDamage = (levelFactor * movePower * (atk / def)) / 50 + 2;

  // Burn halves physical damage (unless Guts or Facade)
  if (
    attacker.statusCondition === 'burn' &&
    move.category === 'Physical' &&
    attacker.ability !== 'Guts' &&
    !isFacade
  ) {
    baseDamage *= 0.5;
  }

  // Weather multipliers (Rain / Sun)
  if (weather === 'Rain') {
    if (move.type === 'Water') baseDamage *= 1.5;
    else if (move.type === 'Fire') baseDamage *= 0.5;
  } else if (weather === 'Sun') {
    if (move.type === 'Fire') baseDamage *= 1.5;
    else if (move.type === 'Water') baseDamage *= 0.5;
  }

  const critMultiplier = isCrit ? 1.5 : 1.0;
  const isStab = attacker.types.includes(move.type);
  const stabMultiplier = isStab ? 1.5 : 1.0;

  let unvariedDamage = baseDamage * stabMultiplier * effectiveness * critMultiplier;

  // Held Item damage modifiers
  if (attacker.heldItem && !attacker.heldItemConsumed) {
    if (attackerItemKey.includes('life orb')) {
      unvariedDamage *= 1.3;
    } else if (attackerItemKey.includes('expert belt') && effectiveness > 1) {
      unvariedDamage *= 1.2;
    } else if (TYPE_BOOST_ITEMS[attackerItemKey] === move.type) {
      unvariedDamage *= 1.2;
    }
  }

  // Type-Resist Berries
  if (defender.heldItem && !defender.heldItemConsumed && effectiveness > 1) {
    if (RESIST_BERRIES[defenderItemKey] === move.type) {
      unvariedDamage *= 0.5;
    }
  }

  // Dual Screens
  if (options?.defenderSideConditions?.reflectTurns && options.defenderSideConditions.reflectTurns > 0 && (move.category === 'Physical' || isPsyshock)) {
    unvariedDamage *= 0.5;
  }
  if (options?.defenderSideConditions?.lightScreenTurns && options.defenderSideConditions.lightScreenTurns > 0 && move.category === 'Special' && !isPsyshock) {
    unvariedDamage *= 0.5;
  }

  // Multiscale (halves damage from full health)
  if (defender.ability === 'Multiscale' && defender.currentHp >= defender.maxHp) {
    unvariedDamage *= 0.5;
  }

  // Solid Rock / Filter
  if ((defender.ability === 'Solid Rock' || defender.ability === 'Filter') && effectiveness > 1) {
    unvariedDamage *= 0.75;
  }

  const finalDamage = Math.max(1, Math.floor(unvariedDamage * variance));
  return { damage: finalDamage, isCrit, effectiveness };
}

/**
 * Intelligent AI Move and Switch Choice (Champion Cynthia / Red behavior)
 * Driven by the 8-Layer CFRU / Radical Red scoring engine in advancedAI.ts
 */
export function selectAIMoveOrSwitch(
  aiActive: Pokemon,
  playerActive: Pokemon,
  aiTeam: Pokemon[],
  playerSideConditions?: SideConditions,
  weather?: WeatherType
): BattleAction {
  return selectAdvancedAIMoveOrSwitch(
    aiActive,
    playerActive,
    aiTeam,
    playerSideConditions,
    weather
  );
}

/**
 * Selects the optimal conscious bench candidate to switch into (considers HP, immunities, and type matchups)
 */
export function selectBestSwitchCandidate(
  team: Pokemon[],
  opposingActive: Pokemon,
  currentActiveIndex: number,
  weather?: WeatherType
): number {
  return selectBestRevengeSwitch(team, opposingActive, currentActiveIndex, weather);
}

export interface TurnExecutionOptions {
  rng?: () => number;
  forceCrit?: boolean;
  forceFullParalysis?: boolean;
  forceThaw?: boolean;
}

/**
 * Resolves a full turn in the battle between Player and Opponent (Single Source of Truth per ADR-001)
 */
export function executeBattleTurn(
  currentState: BattleState,
  playerAction: BattleAction,
  opponentAction: BattleAction,
  options?: TurnExecutionOptions
): BattleState {
  const rng = options?.rng ?? Math.random;
  const nextState = cloneBattleState(currentState);
  const newLogs: BattleTurnLog[] = [];
  nextState.protocolLog = nextState.protocolLog || [];
  nextState.turnMoves = [];

  const playerMon = nextState.playerTeam[nextState.playerActiveIndex];
  const opponentMon = nextState.opponentTeam[nextState.opponentActiveIndex];
  const oppTrainerName = nextState.opponentTeam.some((p) => p.id.startsWith('cynthia_')) ? 'Cynthia' : 'Red';

  const log = (
    actor: 'player' | 'opponent' | 'system' | 'weather',
    message: string,
    type?: BattleTurnLog['type'],
    eff?: number
  ) => {
    newLogs.push({
      id: `log_${nextState.turnNumber}_${newLogs.length}_${Math.floor(rng() * 100000)}`,
      turn: nextState.turnNumber,
      actor,
      message,
      type,
      effectiveness: eff,
    });
  };

  const clearVolatileOnSwitch = (mon: Pokemon) => {
    // Natural Cure heals status on switch out
    if (mon.ability === 'Natural Cure') {
      mon.statusCondition = null;
      mon.sleepTurns = 0;
    }
    mon.toxicCounter = 0;
    mon.substituteHp = 0;
    mon.isProtected = false;
    mon.protectStreak = 0;
    mon.isConfused = false;
    mon.confusionTurns = 0;
    mon.choiceLockedMove = undefined;
    mon.isTaunted = false;
    mon.tauntTurns = 0;
    mon.perishCount = undefined;
    mon.statStages = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
  };

  const applySingleStatChange = (
    sc: StatChangeSpec,
    attacker: Pokemon,
    defender: Pokemon,
    actorSlot: string,
    targetSlot: string
  ): boolean => {
    const targetSide = sc.target ?? (sc.stages >= 0 ? 'self' : 'opponent');
    const statTarget = targetSide === 'self' ? attacker : defender;
    const statSlot = targetSide === 'self' ? actorSlot : targetSlot;

    if (statTarget.fainted || statTarget.currentHp <= 0) return false;

    if (targetSide === 'opponent' && sc.stages < 0) {
      if (statTarget.substituteHp && statTarget.substituteHp > 0) {
        log('system', `${statTarget.species}'s substitute blocked the stat drop!`, 'status');
        return false;
      }
      if (statTarget.ability === 'Clear Body' || statTarget.ability === 'White Smoke') {
        log('system', `${statTarget.species}'s ${statTarget.ability} prevents stat loss!`, 'status');
        nextState.protocolLog!.push(`|-fail|${statSlot}: ${statTarget.species}|unboost|[from] ability: ${statTarget.ability}`);
        return false;
      }
      if (statTarget.ability === 'Hyper Cutter' && sc.stat === 'attack') {
        log('system', `${statTarget.species}'s Hyper Cutter prevents Attack loss!`, 'status');
        nextState.protocolLog!.push(`|-fail|${statSlot}: ${statTarget.species}|unboost|Attack|[from] ability: Hyper Cutter`);
        return false;
      }
    }

    const { actualDelta } = applyStatStageChange(statTarget, sc.stat, sc.stages);
    if (actualDelta > 0) {
      const adverb = actualDelta >= 2 ? ' sharply' : '';
      log('system', `${statTarget.species}'s ${sc.stat}${adverb} rose!`, 'status');
      nextState.protocolLog!.push(
        `|-boost|${statSlot}: ${statTarget.species}|${sc.stat.slice(0, 3)}|${actualDelta}`
      );
      return true;
    } else if (actualDelta < 0) {
      const adverb = actualDelta <= -2 ? ' harshly' : '';
      log('system', `${statTarget.species}'s ${sc.stat}${adverb} fell!`, 'status');
      nextState.protocolLog!.push(
        `|-unboost|${statSlot}: ${statTarget.species}|${sc.stat.slice(0, 3)}|${Math.abs(actualDelta)}`
      );
      return true;
    } else {
      log(
        'system',
        `${statTarget.species}'s ${sc.stat} won't go any ${sc.stages >= 0 ? 'higher' : 'lower'}!`,
        'status'
      );
      return false;
    }
  };

  const triggerSwitchInAbilities = (incoming: Pokemon, opposing: Pokemon, incomingSide: 'player' | 'opponent') => {
    if (incoming.fainted || incoming.currentHp <= 0) return;
    const actorSlot = incomingSide === 'player' ? 'p1a' : 'p2a';
    const targetSlot = incomingSide === 'player' ? 'p2a' : 'p1a';

    if (incoming.ability === 'Intimidate' && !opposing.fainted && opposing.currentHp > 0) {
      log('system', `${incoming.species}'s Intimidate cuts ${opposing.species}'s Attack!`, 'status');
      applySingleStatChange(
        { stat: 'attack', stages: -1, target: 'opponent' },
        incoming,
        opposing,
        actorSlot,
        targetSlot
      );
    } else if (incoming.ability === 'Sand Stream' && nextState.weather !== 'Sand') {
      nextState.weather = 'Sand';
      nextState.weatherTurnsRemaining = 5;
      log('weather', `${incoming.species}'s Sand Stream whipped up a sandstorm!`, 'weather');
      nextState.protocolLog!.push('|-weather|Sand');
    } else if (incoming.ability === 'Drizzle' && nextState.weather !== 'Rain') {
      nextState.weather = 'Rain';
      nextState.weatherTurnsRemaining = 5;
      log('weather', `${incoming.species}'s Drizzle made it rain!`, 'weather');
      nextState.protocolLog!.push('|-weather|Rain');
    } else if (incoming.ability === 'Drought' && nextState.weather !== 'Sun') {
      nextState.weather = 'Sun';
      nextState.weatherTurnsRemaining = 5;
      log('weather', `${incoming.species}'s Drought intensified the sun's rays!`, 'weather');
      nextState.protocolLog!.push('|-weather|Sun');
    } else if (incoming.ability === 'Snow Warning' && nextState.weather !== 'Hail') {
      nextState.weather = 'Hail';
      nextState.weatherTurnsRemaining = 5;
      log('weather', `${incoming.species}'s Snow Warning whipped up a hailstorm!`, 'weather');
      nextState.protocolLog!.push('|-weather|Hail');
    }
  };

  // Helper to apply status effects
  const applyStatusEffect = (
    target: Pokemon,
    targetSlot: string,
    status: StatusCondition,
    actorSide: 'player' | 'opponent'
  ): boolean => {
    if (target.fainted || target.currentHp <= 0) return false;
    if (target.substituteHp && target.substituteHp > 0) {
      log('system', `${target.species}'s substitute blocked the status!`, 'status');
      return false;
    }
    if (target.statusCondition) return false;
    if (isImmuneToStatus(target, status)) {
      log('system', `It doesn't affect ${target.species}...`, 'status');
      return false;
    }
    target.statusCondition = status;
    if (status === 'sleep') {
      target.sleepTurns = target.sleepTurns ?? 2;
    } else if (status === 'toxic') {
      target.toxicCounter = 0;
    }
    log(actorSide, `${target.species} was afflicted with ${status}!`, 'status');
    nextState.protocolLog!.push(`|-status|${targetSlot}: ${target.species}|${status.slice(0, 3)}`);
    return true;
  };

  // Helper to apply confusion (volatile status)
  const applyConfusion = (
    target: Pokemon,
    targetSlot: string,
    actorSide: 'player' | 'opponent'
  ): boolean => {
    if (target.fainted || target.currentHp <= 0) return false;
    if (target.substituteHp && target.substituteHp > 0) {
      log('system', `${target.species}'s substitute blocked confusion!`, 'status');
      return false;
    }
    if (target.ability === 'Own Tempo') {
      log('system', `${target.species}'s Own Tempo prevents confusion!`, 'status');
      return false;
    }
    if (target.isConfused) {
      log('system', `${target.species} is already confused!`, 'status');
      return false;
    }
    target.isConfused = true;
    target.confusionTurns = 2 + Math.floor(rng() * 4); // 2 to 5 turns
    log(actorSide, `${target.species} became confused!`, 'status');
    nextState.protocolLog!.push(`|-start|${targetSlot}: ${target.species}|confusion`);
    return true;
  };

  // Helper to apply entry hazards when a Pokemon switches onto the field
  const applyEntryHazards = (
    incoming: Pokemon,
    side: 'player' | 'opponent',
    slot: string
  ): void => {
    if (incoming.fainted || incoming.currentHp <= 0) return;
    const sideConditions =
      side === 'player' ? nextState.playerSideConditions : nextState.opponentSideConditions;
    if (!sideConditions) return;

    const isFlying = incoming.types.includes('Flying');
    const isLevitating = incoming.ability === 'Levitate';
    const isGrounded = !isFlying && !isLevitating;

    // 1. Toxic Spikes: Grounded Poison-types absorb and clear Toxic Spikes!
    if (
      isGrounded &&
      incoming.types.includes('Poison') &&
      sideConditions.toxicSpikes &&
      sideConditions.toxicSpikes > 0
    ) {
      sideConditions.toxicSpikes = 0;
      log('system', `The poison spikes disappeared from around your team's feet!`, 'status');
      nextState.protocolLog!.push(
        `|-sideend|${side === 'player' ? 'p1' : 'p2'}|move: Toxic Spikes|[from] pokemon: ${incoming.species}`
      );
    }

    // 2. Stealth Rock (hits all Pokémon including Flying/Levitating)
    if (sideConditions.stealthRock) {
      const rockMult = calculateTypeEffectiveness('Rock', incoming.types);
      const srDamage = Math.max(1, Math.floor((incoming.maxHp * rockMult) / 8));
      incoming.currentHp = Math.max(0, incoming.currentHp - srDamage);
      log('system', `Pointed stones dug into ${incoming.species}!`, 'damage');
      nextState.protocolLog!.push(
        `|-damage|${slot}: ${incoming.species}|${incoming.currentHp}/${incoming.maxHp}|[from] Stealth Rock`
      );
      if (incoming.currentHp <= 0) {
        incoming.fainted = true;
        log('system', `${incoming.species} fainted!`, 'faint');
        nextState.protocolLog!.push(`|faint|${slot}: ${incoming.species}`);
        return;
      }
    }

    // 3. Spikes (Grounded only)
    if (isGrounded && sideConditions.spikes && sideConditions.spikes > 0) {
      const fraction = sideConditions.spikes === 1 ? 1 / 8 : sideConditions.spikes === 2 ? 1 / 6 : 1 / 4;
      const spikeDamage = Math.max(1, Math.floor(incoming.maxHp * fraction));
      incoming.currentHp = Math.max(0, incoming.currentHp - spikeDamage);
      log('system', `${incoming.species} was hurt by the spikes!`, 'damage');
      nextState.protocolLog!.push(
        `|-damage|${slot}: ${incoming.species}|${incoming.currentHp}/${incoming.maxHp}|[from] Spikes`
      );
      if (incoming.currentHp <= 0) {
        incoming.fainted = true;
        log('system', `${incoming.species} fainted!`, 'faint');
        nextState.protocolLog!.push(`|faint|${slot}: ${incoming.species}`);
        return;
      }
    }

    // 4. Toxic Spikes (Grounded only, non-Poison, non-Steel)
    if (isGrounded && sideConditions.toxicSpikes && sideConditions.toxicSpikes > 0) {
      if (!incoming.types.includes('Steel') && !incoming.types.includes('Poison') && !incoming.statusCondition) {
        if (sideConditions.toxicSpikes >= 2) {
          applyStatusEffect(incoming, slot, 'toxic', side === 'player' ? 'opponent' : 'player');
        } else {
          applyStatusEffect(incoming, slot, 'poison', side === 'player' ? 'opponent' : 'player');
        }
      }
    }

    // 5. Sticky Web (Grounded only)
    if (isGrounded && sideConditions.stickyWeb) {
      if (incoming.ability !== 'Clear Body') {
        applySingleStatChange(
          { stat: 'speed', stages: -1, target: 'self' },
          incoming,
          incoming,
          slot,
          slot
        );
        log('system', `${incoming.species} was caught in a Sticky Web!`, 'status');
        nextState.protocolLog!.push(`|-activate|${slot}: ${incoming.species}|move: Sticky Web`);
      }
    }
  };

  const playerWantsSwitch = playerAction.type === 'switch' && playerAction.targetPokemonIndex !== undefined;
  const opponentWantsSwitch = opponentAction.type === 'switch' && opponentAction.targetPokemonIndex !== undefined;

  // CRITICAL INVARIANT: Post-Faint & Pivot Replacement Switch
  // When the player's active Pokémon has fainted or pivoted out (Volt Switch / U-turn / Baton Pass),
  // sending out its replacement fills the empty slot.
  const isPostFaintPlayerSwitch =
    (currentState.phase === 'faint_switch_player' ||
      currentState.pendingPivot ||
      playerMon.fainted ||
      playerMon.currentHp <= 0) &&
    playerWantsSwitch;

  let playerSwitched = false;
  let opponentSwitched = false;

  if (isPostFaintPlayerSwitch) {
    const targetIdx = playerAction.targetPokemonIndex!;
    const target = nextState.playerTeam[targetIdx];
    if (target && !target.fainted && target.currentHp > 0 && targetIdx !== nextState.playerActiveIndex) {
      if (currentState.pendingBatonPass) {
        target.statStages = { ...playerMon.statStages! };
        target.substituteHp = playerMon.substituteHp || 0;
        log('system', `${playerMon.species} passed its stat boosts to ${target.species}!`, 'status');
      }
      clearVolatileOnSwitch(playerMon);
      nextState.playerActiveIndex = targetIdx;
      log('player', `Go! ${target.species}!`, 'switch');
      nextState.protocolLog.push(
        `|switch|p1a: ${target.species}|${target.species}, L${target.level}|${target.currentHp}/${target.maxHp}`
      );

      // If opponent's active Pokémon also fainted on the prior turn, ensure opponent's replacement is out
      let currentOpp = nextState.opponentTeam[nextState.opponentActiveIndex];
      if (currentOpp.fainted || currentOpp.currentHp <= 0) {
        const nextOppIdx = nextState.opponentTeam.findIndex((p) => !p.fainted && p.currentHp > 0);
        if (nextOppIdx !== -1) {
          clearVolatileOnSwitch(currentOpp);
          nextState.opponentActiveIndex = nextOppIdx;
          currentOpp = nextState.opponentTeam[nextOppIdx];
          log('opponent', `${oppTrainerName} sent out ${currentOpp.species}!`, 'switch');
          nextState.protocolLog.push(
            `|switch|p2a: ${currentOpp.species}|${currentOpp.species}, L${currentOpp.level}|${currentOpp.currentHp}/${currentOpp.maxHp}`
          );
          triggerSwitchInAbilities(currentOpp, target, 'opponent');
          applyEntryHazards(currentOpp, 'opponent', 'p2a');
        }
      }

      triggerSwitchInAbilities(target, currentOpp, 'player');
      applyEntryHazards(target, 'player', 'p1a');

      const pendingOppAction = currentState.pendingOpponentAction;
      nextState.pendingPivot = false;
      nextState.pendingBatonPass = false;
      nextState.pendingOpponentAction = undefined;

      // If the incoming target fainted from entry hazards (e.g. Spikes/Stealth Rock):
      if (target.fainted || target.currentHp <= 0) {
        nextState.phase = 'faint_switch_player';
        nextState.isPlayerTurn = true;
        nextState.turnMoves = [];
        nextState.combatLog = [...nextState.combatLog, ...newLogs].slice(-50);
        return nextState;
      }

      if (pendingOppAction && !currentOpp.fainted && currentOpp.currentHp > 0) {
        // FAST PIVOT COUNTER-ATTACK:
        // The opponent selected an action earlier this turn that has NOT yet executed.
        // It now attacks the incoming Pokémon!
        playerSwitched = true;
        opponentAction = pendingOppAction;
        // Do not increment turnNumber (finishing current turn)
      } else {
        // Clean free switch (post-faint or slow pivot where opponent already moved)
        nextState.phase = 'action_select';
        nextState.isPlayerTurn = true;
        nextState.lastMoveUsed = undefined;
        nextState.turnMoves = [];
        nextState.combatLog = [...nextState.combatLog, ...newLogs].slice(-50);
        return nextState;
      }
    } else {
      return nextState;
    }
  } else {
    // Standard Full Combat Turn
    nextState.turnNumber += 1;
    nextState.protocolLog.push(`|turn|${nextState.turnNumber}`);
  }

  // Reset single-turn protection flags at the start of the turn
  nextState.playerTeam.forEach((p) => {
    p.isProtected = false;
  });
  nextState.opponentTeam.forEach((p) => {
    p.isProtected = false;
  });

  // Phase 1: Handle Voluntary Mid-Battle Switches First (Ordered by Speed if both switch)
  const executePlayerSwitch = () => {
    if (!playerWantsSwitch || playerSwitched) return;
    const target = nextState.playerTeam[playerAction.targetPokemonIndex!];
    if (target && !target.fainted && playerAction.targetPokemonIndex !== nextState.playerActiveIndex) {
      clearVolatileOnSwitch(playerMon);
      log('player', `You withdrew ${playerMon.species} and sent out ${target.species}!`, 'switch');
      nextState.protocolLog!.push(
        `|switch|p1a: ${target.species}|${target.species}, L${target.level}|${target.currentHp}/${target.maxHp}`
      );
      nextState.playerActiveIndex = playerAction.targetPokemonIndex!;
      playerSwitched = true;
      triggerSwitchInAbilities(target, nextState.opponentTeam[nextState.opponentActiveIndex], 'player');
      applyEntryHazards(target, 'player', 'p1a');
    }
  };

  const executeOpponentSwitch = () => {
    if (!opponentWantsSwitch) return;
    const target = nextState.opponentTeam[opponentAction.targetPokemonIndex!];
    if (target && !target.fainted && opponentAction.targetPokemonIndex !== nextState.opponentActiveIndex) {
      clearVolatileOnSwitch(opponentMon);
      log('opponent', `${oppTrainerName} called back ${opponentMon.species} and sent out ${target.species}!`, 'switch');
      nextState.protocolLog!.push(
        `|switch|p2a: ${target.species}|${target.species}, L${target.level}|${target.currentHp}/${target.maxHp}`
      );
      nextState.opponentActiveIndex = opponentAction.targetPokemonIndex!;
      opponentSwitched = true;
      triggerSwitchInAbilities(target, nextState.playerTeam[nextState.playerActiveIndex], 'opponent');
      applyEntryHazards(target, 'opponent', 'p2a');
    }
  };

  if (playerWantsSwitch && opponentWantsSwitch) {
    const playerSpeed = calculateEffectiveSpeed(playerMon);
    const opponentSpeed = calculateEffectiveSpeed(opponentMon);
    if (playerSpeed > opponentSpeed || (playerSpeed === opponentSpeed && rng() < 0.5)) {
      executePlayerSwitch();
      executeOpponentSwitch();
    } else {
      executeOpponentSwitch();
      executePlayerSwitch();
    }
  } else {
    executePlayerSwitch();
    executeOpponentSwitch();
  }

  let curPlayerMon = nextState.playerTeam[nextState.playerActiveIndex];
  let curOpponentMon = nextState.opponentTeam[nextState.opponentActiveIndex];

  // Phase 2: Resolve Moves Sorted by Priority Bracket (+4, +2, +1, 0, -1), then Effective Speed, then 50/50 RNG
  interface TurnParticipant {
    side: 'player' | 'opponent';
    mon: Pokemon;
    action: BattleAction;
    priority: number;
    speed: number;
  }

  const getMovePriority = (rawMove?: Move): number => {
    if (!rawMove) return 0;
    const move = enrichMoveWithMechanics(rawMove);
    if (move.priority !== undefined) return move.priority;
    if (move.isProtect || move.id === 'protect' || move.id === 'detect') return 4;
    return 0;
  };

  const participants: TurnParticipant[] = [];

  if (!playerSwitched && playerAction.type === 'move' && playerAction.moveIndex !== undefined) {
    const move = curPlayerMon.moves[playerAction.moveIndex];
    participants.push({
      side: 'player',
      mon: curPlayerMon,
      action: playerAction,
      priority: getMovePriority(move),
      speed: calculateEffectiveSpeed(curPlayerMon, nextState.weather, nextState.playerSideConditions),
    });
  }

  if (!opponentSwitched && opponentAction.type === 'move' && opponentAction.moveIndex !== undefined) {
    const move = curOpponentMon.moves[opponentAction.moveIndex];
    participants.push({
      side: 'opponent',
      mon: curOpponentMon,
      action: opponentAction,
      priority: getMovePriority(move),
      speed: calculateEffectiveSpeed(curOpponentMon, nextState.weather, nextState.opponentSideConditions),
    });
  }

  const isTrickRoomActive = Boolean(nextState.trickRoomTurns && nextState.trickRoomTurns > 0);
  participants.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (b.speed !== a.speed) {
      return isTrickRoomActive ? a.speed - b.speed : b.speed - a.speed;
    }
    return rng() < 0.5 ? 1 : -1;
  });


  const triggerPivotSwitch = (side: 'player' | 'opponent', attacker: Pokemon, isBatonPass?: boolean) => {
    if (attacker.fainted || attacker.currentHp <= 0) return false;
    const isPlayer = side === 'player';
    const myTeam = isPlayer ? nextState.playerTeam : nextState.opponentTeam;
    const myActiveIdx = isPlayer ? nextState.playerActiveIndex : nextState.opponentActiveIndex;
    const hasBenchTeammates = myTeam.some(
      (mon, idx) => idx !== myActiveIdx && !mon.fainted && mon.currentHp > 0
    );

    if (!hasBenchTeammates) {
      log('system', `There is no Pokémon to switch with!`, 'status');
      return false;
    }

    if (side === 'opponent') {
      const nextOppIdx = selectBestSwitchCandidate(
        nextState.opponentTeam,
        curPlayerMon,
        nextState.opponentActiveIndex
      );
      if (nextOppIdx !== -1) {
        const incoming = nextState.opponentTeam[nextOppIdx];
        if (isBatonPass) {
          incoming.statStages = { ...attacker.statStages! };
          incoming.substituteHp = attacker.substituteHp || 0;
          log('system', `${attacker.species} passed its stat boosts to ${incoming.species}!`, 'status');
        }
        clearVolatileOnSwitch(attacker);
        nextState.opponentActiveIndex = nextOppIdx;
        curOpponentMon = incoming;
        log('opponent', `${oppTrainerName} withdrew ${attacker.species}!`, 'switch');
        log('opponent', `${oppTrainerName} sent out ${incoming.species}!`, 'switch');
        nextState.protocolLog!.push(
          `|switch|p2a: ${incoming.species}|${incoming.species}, L${incoming.level}|${incoming.currentHp}/${incoming.maxHp}`
        );
        triggerSwitchInAbilities(incoming, curPlayerMon, 'opponent');
        applyEntryHazards(incoming, 'opponent', 'p2a');
        return true;
      }
    } else {
      log('player', `${attacker.species} went back to its Trainer!`, 'switch');
      nextState.protocolLog!.push(`|-message|${attacker.species} went back to its Trainer!`);
      nextState.phase = 'faint_switch_player';
      nextState.pendingPivot = true;
      if (isBatonPass) {
        nextState.pendingBatonPass = true;
      }
      return true;
    }
    return false;
  };

  const flinchedSides = new Set<'player' | 'opponent'>();
  const hasMovedSides = new Set<'player' | 'opponent'>();

  // Execute participants one by one; one side fully resolves before the other begins
  for (const p of participants) {
    // Cardinal rule: A fainted Pokemon is immediately dropped from the action queue and cannot move
    if (p.mon.fainted || p.mon.currentHp <= 0) continue;

    const isPlayer = p.side === 'player';
    const attacker = isPlayer ? curPlayerMon : curOpponentMon;
    const defender = isPlayer ? curOpponentMon : curPlayerMon;
    const actorSlot = isPlayer ? 'p1a' : 'p2a';
    const targetSlot = isPlayer ? 'p2a' : 'p1a';

    if (defender.fainted || defender.currentHp <= 0) continue;

    // Check if faster attacker caused this Pokémon to flinch earlier this turn
    if (flinchedSides.has(p.side)) {
      log(p.side, `${attacker.species} flinched and couldn't move!`, 'status');
      nextState.protocolLog!.push(`|cant|${actorSlot}: ${attacker.species}|flinch`);
      hasMovedSides.add(p.side);
      continue;
    }

    const rawMove = attacker.moves[p.action.moveIndex ?? 0];
    if (!rawMove) continue;
    const move = enrichMoveWithMechanics(rawMove);

    // Taunt Status Move Invalidation
    if (attacker.isTaunted && move.category === 'Status') {
      log('system', `${attacker.species} can't use ${move.name} after being taunted!`, 'status');
      nextState.protocolLog!.push(`|-cant|${actorSlot}: ${attacker.species}|move: Taunt`);
      hasMovedSides.add(p.side);
      continue;
    }

    // Choice Item Move Lock
    const atkItemKey = attacker.heldItem?.toLowerCase() || '';
    if (
      attacker.heldItem &&
      !attacker.heldItemConsumed &&
      (atkItemKey.includes('choice band') || atkItemKey.includes('choice specs') || atkItemKey.includes('choice scarf'))
    ) {
      if (!attacker.choiceLockedMove) {
        attacker.choiceLockedMove = move.id;
      }
    }

    // Sucker Punch Check: Fails if defender chose status or switched or already moved
    if (move.isSuckerPunch || move.id === 'sucker_punch') {
      const opposingParticipant = participants.find((pt) => pt.side !== p.side);
      const opposingRawMove =
        opposingParticipant &&
        opposingParticipant.action.type === 'move' &&
        opposingParticipant.action.moveIndex !== undefined
          ? defender.moves[opposingParticipant.action.moveIndex]
          : undefined;
      const opposingEnriched = opposingRawMove ? enrichMoveWithMechanics(opposingRawMove) : undefined;
      const opposingAlreadyMoved = hasMovedSides.has(isPlayer ? 'opponent' : 'player');
      if (
        !opposingEnriched ||
        opposingEnriched.category === 'Status' ||
        opposingAlreadyMoved
      ) {
        log(p.side, `${attacker.species} used ${move.name}!`);
        log('system', `But it failed!`, 'status');
        nextState.protocolLog!.push(`|move|${actorSlot}: ${attacker.species}|${move.name}|${targetSlot}: ${defender.species}`);
        nextState.protocolLog!.push(`|-fail|${actorSlot}: ${attacker.species}`);
        hasMovedSides.add(p.side);
        continue;
      }
    }

    // Recharge Turn Check (e.g. after Blast Burn, Frenzy Plant, Hydro Cannon, Hyper Beam)
    if (attacker.mustRecharge) {
      attacker.mustRecharge = false;
      log(p.side, `${attacker.species} must recharge!`, 'status');
      nextState.protocolLog!.push(`|cant|${actorSlot}: ${attacker.species}|recharge`);
      continue;
    }

    // Pre-move Status Checks: Sleep, Freeze, Full Paralysis
    if (attacker.statusCondition === 'sleep') {
      const remaining = attacker.sleepTurns ?? 1;
      if (remaining > 0) {
        attacker.sleepTurns = remaining - 1;
        log(p.side, `${attacker.species} is fast asleep.`, 'status');
        nextState.protocolLog!.push(`|cant|${actorSlot}: ${attacker.species}|slp`);
        continue;
      } else {
        attacker.statusCondition = null;
        attacker.sleepTurns = 0;
        log(p.side, `${attacker.species} woke up!`, 'status');
        nextState.protocolLog!.push(`|-curestatus|${actorSlot}: ${attacker.species}|slp`);
      }
    } else if (attacker.statusCondition === 'freeze') {
      const thaws = move.type === 'Fire' || options?.forceThaw || rng() < 0.2;
      if (thaws) {
        attacker.statusCondition = null;
        log(p.side, `${attacker.species} thawed out!`, 'status');
        nextState.protocolLog!.push(`|-curestatus|${actorSlot}: ${attacker.species}|frz`);
      } else {
        log(p.side, `${attacker.species} is frozen solid!`, 'status');
        nextState.protocolLog!.push(`|cant|${actorSlot}: ${attacker.species}|frz`);
        continue;
      }
    } else if (attacker.statusCondition === 'paralysis') {
      const isParalyzedTurn = options?.forceFullParalysis ?? rng() < 0.25;
      if (isParalyzedTurn) {
        log(p.side, `${attacker.species} is paralyzed! It can't move!`, 'status');
        nextState.protocolLog!.push(`|cant|${actorSlot}: ${attacker.species}|par`);
        continue;
      }
    }

    // Confusion Check (Volatile status condition)
    if (attacker.isConfused) {
      log('system', `${attacker.species} is confused!`, 'status');
      nextState.protocolLog!.push(`|-activate|${actorSlot}: ${attacker.species}|confusion`);
      attacker.confusionTurns = (attacker.confusionTurns ?? 1) - 1;

      if (attacker.confusionTurns <= 0) {
        attacker.isConfused = false;
        attacker.confusionTurns = 0;
        log('system', `${attacker.species} snapped out of its confusion!`, 'status');
        nextState.protocolLog!.push(`|-end|${actorSlot}: ${attacker.species}|confusion`);
      } else {
        const confusionRoll = rng();
        if (confusionRoll < 0.33) {
          log('system', `It hurt itself in its confusion!`, 'damage');
          const atkStage = attacker.statStages?.attack ?? 0;
          const defStage = attacker.statStages?.defense ?? 0;
          const effectiveAtk = attacker.baseStats.attack * getStatStageMultiplier(atkStage);
          const effectiveDef = Math.max(1, attacker.baseStats.defense * getStatStageMultiplier(defStage));
          const levelFactor = Math.floor((2 * attacker.level) / 5) + 2;
          const selfDamage = Math.max(1, Math.floor((levelFactor * 40 * (effectiveAtk / effectiveDef)) / 50 + 2));
          attacker.currentHp = Math.max(0, attacker.currentHp - selfDamage);
          nextState.protocolLog!.push(
            `|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] confusion`
          );

          if (attacker.currentHp <= 0) {
            attacker.fainted = true;
            log('system', `${attacker.species} fainted!`, 'faint');
            nextState.protocolLog!.push(`|faint|${actorSlot}: ${attacker.species}`);
            break;
          }
          continue; // Hurt itself: skips chosen move this turn!
        }
      }
    }

    // PP consumption on the actual move object in attacker.moves (Pressure consumes 2 PP)
    const ppCost = defender.ability === 'Pressure' ? 2 : 1;
    if (rawMove.pp > 0) rawMove.pp = Math.max(0, rawMove.pp - ppCost);

    log(p.side, `${attacker.species} used ${move.name}!`);
    nextState.protocolLog!.push(`|move|${actorSlot}: ${attacker.species}|${move.name}|${targetSlot}: ${defender.species}`);

    const isProtectMove = Boolean(move.isProtect || move.id === 'protect' || move.id === 'detect');
    if (!isProtectMove) {
      attacker.protectStreak = 0;
    }

    // Handle Protect / Detect
    if (isProtectMove) {
      const streak = attacker.protectStreak || 0;
      const successChance = Math.pow(0.5, streak);
      if (rng() <= successChance) {
        attacker.isProtected = true;
        attacker.protectStreak = streak + 1;
        log(p.side, `${attacker.species} protected itself!`, 'status');
        nextState.protocolLog!.push(`|-singleturn|${actorSlot}: ${attacker.species}|Protect`);
      } else {
        attacker.protectStreak = 0;
        log('system', `But it failed!`, 'status');
        nextState.protocolLog!.push(`|-fail|${actorSlot}: ${attacker.species}`);
      }
      continue;
    }

    // Handle Substitute creation
    if (move.isSubstitute || move.id === 'substitute') {
      const subCost = Math.floor(attacker.maxHp / 4);
      if ((attacker.substituteHp && attacker.substituteHp > 0) || attacker.currentHp <= subCost || subCost <= 0) {
        log('system', `But it failed!`, 'status');
        nextState.protocolLog!.push(`|-fail|${actorSlot}: ${attacker.species}|move: Substitute`);
      } else {
        attacker.currentHp -= subCost;
        attacker.substituteHp = subCost;
        log(p.side, `${attacker.species} put in a substitute!`, 'status');
        nextState.protocolLog!.push(`|-start|${actorSlot}: ${attacker.species}|Substitute`);
      }
      continue;
    }

    // Handle Weather-setting moves
    if (move.weatherEffect) {
      nextState.weather = move.weatherEffect;
      nextState.weatherTurnsRemaining = 5;
      log('weather', `The weather changed to ${move.weatherEffect}!`, 'weather');
      nextState.protocolLog!.push(`|-weather|${move.weatherEffect}`);
      if (move.category === 'Status') continue;
    }

    const kbSpec = getMoveMechanics(move.id) || getMoveMechanics(move.name);
    const isHealMove = Boolean(
      kbSpec?.healFraction ||
        move.id === 'rest' ||
        move.id === 'roost' ||
        move.id === 'recover' ||
        move.id === 'morning_sun' ||
        move.id === 'synthesis' ||
        move.id === 'moonlight' ||
        move.id === 'slack_off' ||
        move.id === 'soft_boiled'
    );

    const statusStatChanges: StatChangeSpec[] =
      move.statChanges && move.statChanges.length > 0
        ? move.statChanges
        : move.statChange
        ? [move.statChange]
        : [];

    // Check if defender is Protected this turn (blocks opponent-targeted moves)
    const isSelfMove =
      move.category === 'Status' &&
      (isHealMove ||
        (statusStatChanges.length > 0 &&
          statusStatChanges.every((sc) => (sc.target ?? (sc.stages >= 0 ? 'self' : 'opponent')) === 'self')));

    if (!isSelfMove && defender.isProtected) {
      log('system', `${defender.species} protected itself!`, 'status');
      nextState.protocolLog!.push(`|-activate|${targetSlot}: ${defender.species}|move: Protect`);
      if (move.isCrashOnMiss || move.id === 'high_jump_kick' || move.id === 'jump_kick') {
        if (attacker.ability !== 'Magic Guard') {
          const crashDmg = Math.max(1, Math.floor(attacker.maxHp * 0.5));
          attacker.currentHp = Math.max(0, attacker.currentHp - crashDmg);
          log(p.side, `${attacker.species} kept going and crashed! (-${crashDmg} HP)`, 'damage');
          nextState.protocolLog!.push(`|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] crash`);
          if (attacker.currentHp <= 0) {
            attacker.fainted = true;
            log(p.side, `${attacker.species} fainted!`, 'faint');
            nextState.protocolLog!.push(`|-faint|${actorSlot}: ${attacker.species}`);
          }
        }
      }
      continue;
    }

    // Check accuracy (No Guard and infallible moves like Aura Sphere bypass accuracy checks)
    const hasNoGuard = attacker.ability === 'No Guard' || defender.ability === 'No Guard';
    const isAlwaysHit = hasNoGuard || Boolean(move.infallible);
    if (!isAlwaysHit && !isSelfMove) {
      const hitRoll = rng() * 100;
      if (hitRoll > move.accuracy) {
        log('system', `${attacker.species}'s attack missed!`);
        nextState.protocolLog!.push(`|-miss|${actorSlot}: ${attacker.species}|${targetSlot}: ${defender.species}`);
        if (move.isCrashOnMiss || move.id === 'high_jump_kick' || move.id === 'jump_kick') {
          if (attacker.ability !== 'Magic Guard') {
            const crashDmg = Math.max(1, Math.floor(attacker.maxHp * 0.5));
            attacker.currentHp = Math.max(0, attacker.currentHp - crashDmg);
            log(p.side, `${attacker.species} kept going and crashed! (-${crashDmg} HP)`, 'damage');
            nextState.protocolLog!.push(`|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] crash`);
            if (attacker.currentHp <= 0) {
              attacker.fainted = true;
              log(p.side, `${attacker.species} fainted!`, 'faint');
              nextState.protocolLog!.push(`|-faint|${actorSlot}: ${attacker.species}`);
            }
          }
        }
        continue;
      }
    }

    if (move.category === 'Status') {
      if (statusStatChanges.length > 0) {
        for (const sc of statusStatChanges) {
          applySingleStatChange(sc, attacker, defender, actorSlot, targetSlot);
        }
      } else if (move.statusEffect) {
        applyStatusEffect(defender, targetSlot, move.statusEffect, p.side);
      } else if (move.id === 'rest') {
        attacker.currentHp = attacker.maxHp;
        attacker.statusCondition = 'sleep';
        attacker.sleepTurns = 2;
        attacker.toxicCounter = 0;
        log(p.side, `${attacker.species} fell asleep and recovered full health!`, 'status');
        nextState.protocolLog!.push(`|-status|${actorSlot}: ${attacker.species}|slp`);
        nextState.protocolLog!.push(`|-heal|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}`);
      } else if (isHealMove) {
        const healFraction = kbSpec?.healFraction ?? 0.5;
        const heal = Math.floor(attacker.maxHp * healFraction);
        attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
        log(p.side, `${attacker.species} restored ${heal} HP!`, 'status');
        nextState.protocolLog!.push(`|-heal|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}`);
      }

      // Entry Hazards (Stealth Rock, Spikes, Toxic Spikes, Sticky Web)
      if (move.entryHazard) {
        const oppSide = p.side === 'player' ? 'opponent' : 'player';
        const oppSlot = p.side === 'player' ? 'p2' : 'p1';
        if (oppSide === 'player') {
          nextState.playerSideConditions = nextState.playerSideConditions || {};
        } else {
          nextState.opponentSideConditions = nextState.opponentSideConditions || {};
        }
        const targetSideCond = oppSide === 'player' ? nextState.playerSideConditions! : nextState.opponentSideConditions!;

        if (move.entryHazard === 'stealth_rock') {
          if (targetSideCond.stealthRock) {
            log('system', `Pointed stones are already set up around the opposing team!`, 'status');
          } else {
            targetSideCond.stealthRock = true;
            log(p.side, `Pointed stones float in the air around the opposing team!`, 'status');
            nextState.protocolLog!.push(`|-sidestart|${oppSlot}: move: Stealth Rock`);
          }
        } else if (move.entryHazard === 'spikes') {
          const currentSpikes = targetSideCond.spikes || 0;
          if (currentSpikes >= 3) {
            log('system', `Spikes cannot be scattered any deeper!`, 'status');
          } else {
            targetSideCond.spikes = currentSpikes + 1;
            log(p.side, `Spikes were scattered all around the opposing team!`, 'status');
            nextState.protocolLog!.push(`|-sidestart|${oppSlot}: move: Spikes`);
          }
        } else if (move.entryHazard === 'toxic_spikes') {
          const currentTSpikes = targetSideCond.toxicSpikes || 0;
          if (currentTSpikes >= 2) {
            log('system', `Poison spikes cannot be scattered any deeper!`, 'status');
          } else {
            targetSideCond.toxicSpikes = currentTSpikes + 1;
            log(p.side, `Poison spikes were scattered around the opposing team!`, 'status');
            nextState.protocolLog!.push(`|-sidestart|${oppSlot}: move: Toxic Spikes`);
          }
        } else if (move.entryHazard === 'sticky_web') {
          if (targetSideCond.stickyWeb) {
            log('system', `A sticky web is already woven beneath the opposing team!`, 'status');
          } else {
            targetSideCond.stickyWeb = true;
            log(p.side, `A sticky web has been laid out beneath the opposing team!`, 'status');
            nextState.protocolLog!.push(`|-sidestart|${oppSlot}: move: Sticky Web`);
          }
        }
      }

      // Hazard Clearing (Defog)
      if (move.clearsHazards) {
        nextState.playerSideConditions = {};
        nextState.opponentSideConditions = {};
        log(p.side, `${attacker.species} blew away entry hazards!`, 'status');
        nextState.protocolLog!.push(`|-sideend|p1: Stealth Rock`);
        nextState.protocolLog!.push(`|-sideend|p2: Stealth Rock`);
      }

      // Dual Screens (Reflect / Light Screen)
      if (move.isScreen === 'reflect' || move.id === 'reflect') {
        const sideCond = p.side === 'player'
          ? (nextState.playerSideConditions = nextState.playerSideConditions || {})
          : (nextState.opponentSideConditions = nextState.opponentSideConditions || {});
        sideCond.reflectTurns = attacker.heldItem?.toLowerCase().includes('light clay') ? 8 : 5;
        log(p.side, `Reflect raised ${p.side === 'player' ? 'your' : 'the opposing'} team's Defense!`, 'status');
        nextState.protocolLog!.push(`|-sidestart|${p.side === 'player' ? 'p1' : 'p2'}: move: Reflect`);
      } else if (move.isScreen === 'light_screen' || move.id === 'light_screen') {
        const sideCond = p.side === 'player'
          ? (nextState.playerSideConditions = nextState.playerSideConditions || {})
          : (nextState.opponentSideConditions = nextState.opponentSideConditions || {});
        sideCond.lightScreenTurns = attacker.heldItem?.toLowerCase().includes('light clay') ? 8 : 5;
        log(p.side, `Light Screen raised ${p.side === 'player' ? 'your' : 'the opposing'} team's Sp. Def!`, 'status');
        nextState.protocolLog!.push(`|-sidestart|${p.side === 'player' ? 'p1' : 'p2'}: move: Light Screen`);
      }

      // Haze
      if (move.isHaze || move.id === 'haze') {
        curPlayerMon.statStages = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
        curOpponentMon.statStages = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
        log(p.side, `All stat changes were eliminated!`, 'status');
        nextState.protocolLog!.push(`|-clearallboost`);
      }

      // Taunt
      if (move.isTaunt || move.id === 'taunt') {
        defender.isTaunted = true;
        defender.tauntTurns = 3;
        log(p.side, `${defender.species} fell for the taunt!`, 'status');
        nextState.protocolLog!.push(`|-start|${targetSlot}: ${defender.species}|move: Taunt`);
      }

      // Perish Song
      if (move.isPerishSong || move.id === 'perish_song') {
        if (!curPlayerMon.fainted && curPlayerMon.currentHp > 0) curPlayerMon.perishCount = 3;
        if (!curOpponentMon.fainted && curOpponentMon.currentHp > 0) curOpponentMon.perishCount = 3;
        log(p.side, `All Pokémon hearing the song will faint in three turns!`, 'status');
        nextState.protocolLog!.push(`|-fieldactivate|move: Perish Song`);
      }

      // Trick Room
      if (move.isTrickRoom || move.id === 'trick_room') {
        nextState.trickRoomTurns = nextState.trickRoomTurns && nextState.trickRoomTurns > 0 ? 0 : 5;
        if (nextState.trickRoomTurns > 0) {
          log(p.side, `${attacker.species} twisted the dimensions!`, 'status');
          nextState.protocolLog!.push(`|-fieldstart|move: Trick Room`);
        } else {
          log(p.side, `The dimensions returned to normal!`, 'status');
          nextState.protocolLog!.push(`|-fieldend|move: Trick Room`);
        }
      }

      // Status Confusion (Confuse Ray, Sweet Kiss, Supersonic, Swagger, Flatter)
      if (move.causesConfusion) {
        applyConfusion(defender, targetSlot, p.side);
      }

      // Status Pivot / Switch-out Move Resolution (Parting Shot, Baton Pass, Teleport, Chilly Reception)
      const isStatusPivot = Boolean(
        move.isPivot ||
          move.id === 'parting_shot' ||
          move.id === 'baton_pass' ||
          move.id === 'teleport' ||
          move.id === 'chilly_reception'
      );
      if (isStatusPivot && !attacker.fainted && attacker.currentHp > 0) {
        const switched = triggerPivotSwitch(p.side, attacker, move.isBatonPass);
        if (switched && p.side === 'player') {
          hasMovedSides.add(p.side);
          if (!hasMovedSides.has('opponent') && !defender.fainted && defender.currentHp > 0) {
            nextState.pendingOpponentAction = opponentAction;
          } else {
            nextState.pendingOpponentAction = undefined;
          }
          break;
        }
      }
      continue;
    }

    // Screen Shattering (Brick Break)
    if (move.breaksScreens || move.id === 'brick_break') {
      const defSideCond = isPlayer ? nextState.opponentSideConditions : nextState.playerSideConditions;
      if (defSideCond && (defSideCond.reflectTurns || defSideCond.lightScreenTurns)) {
        const broken: string[] = [];
        if (defSideCond.reflectTurns) {
          defSideCond.reflectTurns = 0;
          broken.push('Reflect');
        }
        if (defSideCond.lightScreenTurns) {
          defSideCond.lightScreenTurns = 0;
          broken.push('Light Screen');
        }
        log(p.side, `${attacker.species}'s ${move.name} shattered the foe's ${broken.join(' and ')}!`, 'effectiveness');
        nextState.protocolLog!.push(`|-sideend|${targetSlot.startsWith('p1') ? 'p1' : 'p2'}|Reflect`);
        nextState.protocolLog!.push(`|-sideend|${targetSlot.startsWith('p1') ? 'p1' : 'p2'}|LightScreen`);
      }
    }

    // Damaging Move Execution (supports single-hit and multi-hit moves + Substitute absorption)
    const minHits = move.multiHit ? move.multiHit[0] : 1;
    const maxHits = move.multiHit ? move.multiHit[1] : 1;
    const hasSkillLink = attacker.ability?.toLowerCase() === 'skill link';
    const hitCount =
      hasSkillLink && move.multiHit
        ? maxHits
        : minHits === maxHits
        ? minHits
        : minHits + Math.floor(rng() * (maxHits - minHits + 1));

    let totalDamageDealt = 0;
    let anyCrit = false;
    let finalEffectiveness = 1;
    let hitSubstituteOnly = false;

    for (let hitIdx = 0; hitIdx < hitCount; hitIdx++) {
      if (defender.fainted || defender.currentHp <= 0) break;

      const defenderWasFullHp = defender.currentHp >= defender.maxHp;

      const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, move, {
        weather: nextState.weather,
        forceCrit: options?.forceCrit,
        rngVariance: 0.85 + rng() * 0.15,
        defenderSideConditions: isPlayer ? nextState.opponentSideConditions : nextState.playerSideConditions,
      });

      finalEffectiveness = effectiveness;
      if (effectiveness === 0) {
        totalDamageDealt = 0;
        break;
      }

      if (isCrit) anyCrit = true;

      // Fire-type damaging moves thaw a frozen defender
      if (move.type === 'Fire' && defender.statusCondition === 'freeze') {
        defender.statusCondition = null;
        log('system', `${defender.species} was thawed out by ${move.name}!`, 'status');
      }

      if (defender.substituteHp && defender.substituteHp > 0) {
        const subAbsorbed = Math.min(defender.substituteHp, damage);
        defender.substituteHp -= subAbsorbed;
        totalDamageDealt += subAbsorbed;
        hitSubstituteOnly = true;
        if (defender.substituteHp <= 0) {
          defender.substituteHp = 0;
          log('system', `The substitute took damage for ${defender.species}! ${defender.species}'s substitute faded!`, 'status');
          nextState.protocolLog!.push(`|-end|${targetSlot}: ${defender.species}|Substitute`);
        } else {
          log('system', `The substitute took damage for ${defender.species}!`, 'status');
        }
      } else {
        hitSubstituteOnly = false;
        const actualHpLost = Math.min(defender.currentHp, damage);
        const wouldFaint = damage >= defender.currentHp;

        // Focus Sash & Sturdy check (survival with 1 HP from full health)
        const defenderItem = defender.heldItem?.toLowerCase() || '';
        if (wouldFaint && defenderWasFullHp && defender.heldItem && !defender.heldItemConsumed && defenderItem.includes('focus sash')) {
          defender.currentHp = 1;
          defender.heldItemConsumed = true;
          totalDamageDealt += Math.max(0, defender.maxHp - 1);
          log(p.side === 'player' ? 'opponent' : 'player', `${defender.species} hung on using its Focus Sash!`, 'status');
          nextState.protocolLog!.push(`|-enditem|${targetSlot}: ${defender.species}|Focus Sash`);
        } else if (wouldFaint && defenderWasFullHp && defender.ability === 'Sturdy') {
          defender.currentHp = 1;
          totalDamageDealt += Math.max(0, defender.maxHp - 1);
          log(p.side === 'player' ? 'opponent' : 'player', `${defender.species} endured the hit using Sturdy!`, 'status');
          nextState.protocolLog!.push(`|-activate|${targetSlot}: ${defender.species}|ability: Sturdy`);
        } else {
          defender.currentHp = Math.max(0, defender.currentHp - damage);
          totalDamageDealt += actualHpLost;
          if (defender.currentHp <= 0) {
            defender.currentHp = 0;
            defender.fainted = true;
          }
        }

        // Air Balloon pops on taking damaging hit
        if (defender.heldItem && !defender.heldItemConsumed && defenderItem.includes('air balloon')) {
          defender.heldItemConsumed = true;
          log(p.side === 'player' ? 'opponent' : 'player', `${defender.species}'s Air Balloon popped!`, 'status');
          nextState.protocolLog!.push(`|-enditem|${targetSlot}: ${defender.species}|Air Balloon`);
        }

        // Type Resist Berry consumption
        if (defender.heldItem && !defender.heldItemConsumed && finalEffectiveness > 1 && RESIST_BERRIES[defenderItem] === move.type) {
          const berry = defender.heldItem;
          defender.heldItemConsumed = true;
          log(p.side === 'player' ? 'opponent' : 'player', `${defender.species}'s ${berry} softened the blow!`, 'status');
          nextState.protocolLog!.push(`|-enditem|${targetSlot}: ${defender.species}|${berry}`);
        }

        // Weakness Policy trigger
        if (defender.heldItem && !defender.heldItemConsumed && defenderItem.includes('weakness policy') && finalEffectiveness > 1 && !defender.fainted) {
          defender.heldItemConsumed = true;
          applyStatStageChange(defender, 'attack', 2);
          applyStatStageChange(defender, 'spAtk', 2);
          log(p.side === 'player' ? 'opponent' : 'player', `${defender.species}'s Weakness Policy sharply raised its Attack and Sp. Atk!`, 'status');
          nextState.protocolLog!.push(`|-enditem|${targetSlot}: ${defender.species}|Weakness Policy`);
          nextState.protocolLog!.push(`|-boost|${targetSlot}: ${defender.species}|atk|2`);
          nextState.protocolLog!.push(`|-boost|${targetSlot}: ${defender.species}|spa|2`);
        }
      }
    }

    if (hitCount > 1 && totalDamageDealt > 0) {
      log('system', `Hit ${hitCount} time(s)!`);
    }

    const defenderDied = defender.fainted || defender.currentHp <= 0;

    const moveExec = {
      moveName: move.name,
      moveType: move.type,
      moveCategory: move.category,
      userSide: isPlayer ? ('player' as const) : ('opponent' as const),
      targetSide: isPlayer ? ('opponent' as const) : ('player' as const),
      damageDealt: totalDamageDealt,
      isCrit: anyCrit,
      effectiveness: finalEffectiveness,
      defenderHpRemaining: defender.currentHp,
      defenderFainted: defenderDied,
    };
    nextState.lastMoveUsed = moveExec;
    nextState.turnMoves!.push(moveExec);

    if (finalEffectiveness > 1) {
      log(p.side, `It's super effective! (${finalEffectiveness}x)`, 'effectiveness', finalEffectiveness);
      nextState.protocolLog!.push(`|-supereffective|${targetSlot}: ${defender.species}`);
    } else if (finalEffectiveness === 0) {
      log(p.side, `It doesn't affect ${defender.species}... (Immune)`, 'effectiveness', 0);
      nextState.protocolLog!.push(`|-immune|${targetSlot}: ${defender.species}`);
      continue;
    } else if (finalEffectiveness < 1) {
      log(p.side, `It's not very effective... (${finalEffectiveness}x)`, 'effectiveness', finalEffectiveness);
      nextState.protocolLog!.push(`|-resisted|${targetSlot}: ${defender.species}`);
    }

    if (anyCrit) {
      log(p.side, `A critical hit!`, 'crit');
      nextState.protocolLog!.push(`|-crit|${targetSlot}: ${defender.species}`);
    }

    nextState.protocolLog!.push(`|-damage|${targetSlot}: ${defender.species}|${defender.currentHp}/${defender.maxHp}`);

    // Drain moves (e.g. Giga Drain)
    const drainRatio = move.drain ?? (move.id === 'giga_drain' ? 0.5 : 0);
    if (drainRatio > 0 && totalDamageDealt > 0 && !attacker.fainted) {
      const healAmount = Math.max(1, Math.floor(totalDamageDealt * drainRatio));
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount);
      log(p.side, `${defender.species} had its energy drained! (+${healAmount} HP)`, 'status');
      nextState.protocolLog!.push(`|-heal|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}`);
    }

    // Recoil moves (e.g. Volt Tackle, Flare Blitz, Double-Edge, Wild Charge)
    const recoilRatio =
      move.recoil ?? (move.id === 'volt_tackle' || move.id === 'double_edge' || move.id === 'flare_blitz' ? 0.33 : 0);
    if (recoilRatio > 0 && totalDamageDealt > 0 && attacker.ability !== 'Rock Head' && attacker.ability !== 'Magic Guard') {
      const recoilDmg = Math.max(1, Math.floor(totalDamageDealt * recoilRatio));
      attacker.currentHp = Math.max(0, attacker.currentHp - recoilDmg);
      log(p.side, `${attacker.species} is damaged by recoil! (-${recoilDmg} HP)`, 'damage');
      nextState.protocolLog!.push(`|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] Recoil`);
      if (attacker.currentHp <= 0) {
        attacker.currentHp = 0;
        attacker.fainted = true;
        log('system', `${attacker.species} fainted from recoil!`, 'faint');
        nextState.protocolLog!.push(`|faint|${actorSlot}: ${attacker.species}`);
      }
    }

    // Secondary Effects on Damaging Moves:
    // - Self-targeted stat changes (e.g. Close Combat, Superpower, Overheat, Meteor Mash, Ancient Power)
    //   can trigger even if the defender fainted or had a Substitute.
    // - Opponent-targeted effects (status, stat drops, flinch) only trigger if !defenderDied && !hitSubstituteOnly.
    if (move.secondaryEffect && !attacker.fainted && attacker.currentHp > 0) {
      const sec = move.secondaryEffect;
      const secStatChanges: StatChangeSpec[] =
        sec.statChanges && sec.statChanges.length > 0
          ? sec.statChanges
          : sec.statChange
          ? [sec.statChange]
          : [];

      const hasSelfStatChange = secStatChanges.some(
        (sc) => (sc.target ?? (sc.stages >= 0 ? 'self' : 'opponent')) === 'self'
      );
      const hasOpponentEffect =
        Boolean(sec.statusEffect) ||
        Boolean(sec.flinchChance) ||
        secStatChanges.some((sc) => (sc.target ?? (sc.stages >= 0 ? 'self' : 'opponent')) === 'opponent');

      const canEvaluate = hasSelfStatChange || (hasOpponentEffect && !defenderDied && !hitSubstituteOnly);

      if (canEvaluate) {
        const serenityMult = attacker.ability === 'Serene Grace' && sec.chance < 100 ? 2 : 1;
        const effectiveChance = Math.min(100, sec.chance * serenityMult);

        if (rng() * 100 < effectiveChance) {
          if (sec.statusEffect && !defenderDied && !hitSubstituteOnly) {
            applyStatusEffect(defender, targetSlot, sec.statusEffect, p.side);
          }

          for (const sc of secStatChanges) {
            const targetSide = sc.target ?? (sc.stages >= 0 ? 'self' : 'opponent');
            if (targetSide === 'opponent' && (defenderDied || hitSubstituteOnly)) continue;
            applySingleStatChange(sc, attacker, defender, actorSlot, targetSlot);
          }

          if (sec.flinchChance && !defenderDied && !hitSubstituteOnly) {
            // If flinchChance equals sec.chance, it already succeeded on the main secondary roll;
            // if it's an independent secondary effect (e.g. Ice Fang 10% freeze + 10% flinch), check or apply.
            const flinchTriggered =
              sec.flinchChance === sec.chance
                ? true
                : rng() * 100 < Math.min(100, sec.flinchChance * (attacker.ability === 'Serene Grace' ? 2 : 1));
            if (flinchTriggered) {
              if (defender.ability === 'Inner Focus') {
                log('system', `${defender.species}'s Inner Focus prevents flinching!`, 'status');
              } else {
                flinchedSides.add(isPlayer ? 'opponent' : 'player');
              }
            }
          }
        }
      }
    }

    // Secondary Confusion on damaging moves (Dynamic Punch, Water Pulse, Signal Beam, etc.)
    const confusionChance = move.secondaryEffect?.confusionChance;
    if (confusionChance && totalDamageDealt > 0 && !defenderDied && !hitSubstituteOnly) {
      const sereneGraceMult = attacker.ability === 'Serene Grace' ? 2 : 1;
      const confRoll = rng() * 100;
      if (confRoll < confusionChance * sereneGraceMult) {
        applyConfusion(defender, targetSlot, p.side);
      }
    }

    // Hazard Removal on damaging moves (Rapid Spin)
    if (move.clearsHazards && totalDamageDealt > 0) {
      if (p.side === 'player') {
        nextState.playerSideConditions = {};
      } else {
        nextState.opponentSideConditions = {};
      }
      log(p.side, `${attacker.species} blew away entry hazards!`, 'status');
      nextState.protocolLog!.push(`|-sideend|${p.side === 'player' ? 'p1' : 'p2'}: move: Rapid Spin`);
    }

    // Outrage fatigue confusion
    if (move.id === 'outrage' && !attacker.fainted && attacker.currentHp > 0) {
      if (rng() < 0.5) {
        applyConfusion(attacker, actorSlot, p.side);
        log('system', `${attacker.species} became confused due to fatigue!`, 'status');
      }
    }

    // Recharge Turn Flag (Blast Burn, Frenzy Plant, Hydro Cannon, Hyper Beam)
    if (move.rechargeTurn && !attacker.fainted && attacker.currentHp > 0) {
      attacker.mustRecharge = true;
    }

    // Pivot / Switch-out Move Resolution (Volt Switch, U-turn, Flip Turn)
    const isPivotMove = Boolean(
      move.isPivot ||
        move.id === 'volt_switch' ||
        move.id === 'u_turn' ||
        move.id === 'flip_turn'
    );

    if (isPivotMove && totalDamageDealt > 0 && !attacker.fainted && attacker.currentHp > 0) {
      const switched = triggerPivotSwitch(p.side, attacker, move.isBatonPass);
      if (switched && p.side === 'player') {
        hasMovedSides.add(p.side);
        if (!hasMovedSides.has('opponent') && !defender.fainted && defender.currentHp > 0) {
          nextState.pendingOpponentAction = opponentAction;
        } else {
          nextState.pendingOpponentAction = undefined;
        }
        break;
      }
    }

    // Knock Off item removal
    if ((move.isKnockOff || move.id === 'knock_off') && defender.heldItem && !defender.heldItemConsumed && !defenderDied && !hitSubstituteOnly) {
      const removedItem = defender.heldItem;
      defender.heldItemConsumed = true;
      log(p.side, `${attacker.species} knocked off ${defender.species}'s ${removedItem}!`, 'status');
      nextState.protocolLog!.push(`|-enditem|${targetSlot}: ${defender.species}|${removedItem}|[from] move: Knock Off|[of] ${actorSlot}: ${attacker.species}`);
    }

    // Life Orb Recoil (10% max HP)
    const attackerItem = attacker.heldItem?.toLowerCase() || '';
    if (attacker.heldItem && !attacker.heldItemConsumed && attackerItem.includes('life orb') && totalDamageDealt > 0 && attacker.ability !== 'Magic Guard') {
      const loDmg = Math.max(1, Math.floor(attacker.maxHp * 0.1));
      attacker.currentHp = Math.max(0, attacker.currentHp - loDmg);
      log(p.side, `${attacker.species} lost some of its HP! (-${loDmg} HP)`, 'damage');
      nextState.protocolLog!.push(`|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] item: Life Orb`);
      if (attacker.currentHp <= 0) {
        attacker.currentHp = 0;
        attacker.fainted = true;
        log('system', `${attacker.species} fainted!`, 'faint');
        nextState.protocolLog!.push(`|faint|${actorSlot}: ${attacker.species}`);
      }
    }

    // Contact Abilities & Items (Physical contact attacks only)
    if (move.category === 'Physical' && totalDamageDealt > 0 && !hitSubstituteOnly) {
      const defItem = defender.heldItem?.toLowerCase() || '';
      // Rocky Helmet (1/6 max HP)
      if (defender.heldItem && !defender.heldItemConsumed && defItem.includes('rocky helmet') && attacker.ability !== 'Magic Guard' && !attacker.fainted) {
        const rhDmg = Math.max(1, Math.floor(attacker.maxHp / 6));
        attacker.currentHp = Math.max(0, attacker.currentHp - rhDmg);
        log(p.side === 'player' ? 'opponent' : 'player', `${attacker.species} was hurt by ${defender.species}'s Rocky Helmet! (-${rhDmg} HP)`, 'damage');
        nextState.protocolLog!.push(`|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] item: Rocky Helmet`);
        if (attacker.currentHp <= 0) {
          attacker.currentHp = 0;
          attacker.fainted = true;
          log('system', `${attacker.species} fainted!`, 'faint');
          nextState.protocolLog!.push(`|faint|${actorSlot}: ${attacker.species}`);
        }
      }

      // Rough Skin / Iron Barbs (1/8 max HP)
      if ((defender.ability === 'Rough Skin' || defender.ability === 'Iron Barbs') && attacker.ability !== 'Magic Guard' && !attacker.fainted) {
        const rsDmg = Math.max(1, Math.floor(attacker.maxHp / 8));
        attacker.currentHp = Math.max(0, attacker.currentHp - rsDmg);
        log(p.side === 'player' ? 'opponent' : 'player', `${attacker.species} was hurt by ${defender.species}'s ${defender.ability}! (-${rsDmg} HP)`, 'damage');
        nextState.protocolLog!.push(`|-damage|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}|[from] ability: ${defender.ability}`);
        if (attacker.currentHp <= 0) {
          attacker.currentHp = 0;
          attacker.fainted = true;
          log('system', `${attacker.species} fainted!`, 'faint');
          nextState.protocolLog!.push(`|faint|${actorSlot}: ${attacker.species}`);
        }
      }

      // Flame Body (30% burn on contact)
      if (defender.ability === 'Flame Body' && !attacker.statusCondition && !attacker.types.includes('Fire') && rng() < 0.3) {
        applyStatusEffect(attacker, actorSlot, 'burn', p.side === 'player' ? 'opponent' : 'player');
      }
    }

    // Self-Faint move (Explosion, Self-Destruct)
    if (move.isSelfFaint || move.id === 'explosion' || move.id === 'self_destruct') {
      attacker.currentHp = 0;
      attacker.fainted = true;
      log(p.side, `${attacker.species} fainted!`, 'faint');
      nextState.protocolLog!.push(`|faint|${actorSlot}: ${attacker.species}`);
    }

    // Phazing moves (Whirlwind, Roar, Dragon Tail)
    const isPhazingMove = Boolean(move.isPhazing || move.id === 'whirlwind' || move.id === 'roar' || move.id === 'dragon_tail');
    if (isPhazingMove && !defenderDied && !hitSubstituteOnly) {
      const defSide = isPlayer ? 'opponent' : 'player';
      const defTeam = defSide === 'player' ? nextState.playerTeam : nextState.opponentTeam;
      const defActiveIdx = defSide === 'player' ? nextState.playerActiveIndex : nextState.opponentActiveIndex;
      const validSwitchIndices: number[] = [];
      defTeam.forEach((m, idx) => {
        if (idx !== defActiveIdx && !m.fainted && m.currentHp > 0) validSwitchIndices.push(idx);
      });
      if (validSwitchIndices.length > 0) {
        const randIdx = validSwitchIndices[Math.floor(rng() * validSwitchIndices.length)];
        const incoming = defTeam[randIdx];
        clearVolatileOnSwitch(defender);
        if (defSide === 'player') {
          nextState.playerActiveIndex = randIdx;
          curPlayerMon = incoming;
        } else {
          nextState.opponentActiveIndex = randIdx;
          curOpponentMon = incoming;
        }
        log(p.side, `${defender.species} was blown away!`, 'switch');
        log(defSide, `${incoming.species} was dragged into battle!`, 'switch');
        nextState.protocolLog!.push(`|drag|${targetSlot}: ${incoming.species}|${incoming.species}, L${incoming.level}|${incoming.currentHp}/${incoming.maxHp}`);
        triggerSwitchInAbilities(incoming, attacker, defSide);
        applyEntryHazards(incoming, defSide, targetSlot);
      }
    }

    hasMovedSides.add(p.side);

    // Check faint: A knocked out Pokemon CANNOT attack back or execute their action
    if (defenderDied) {
      log('system', `${defender.species} fainted!`, 'faint');
      nextState.protocolLog!.push(`|faint|${targetSlot}: ${defender.species}`);
      break;
    }
  }

  // Phase 3: End-of-Turn Weather & Status Residuals
  if (nextState.weather === 'Hail' || nextState.weather === 'Sand') {
    const isHail = nextState.weather === 'Hail';
    const applyWeatherChip = (mon: Pokemon, sideLabel: string, slotId: string) => {
      if (mon.fainted || mon.currentHp <= 0) return;
      const isImmune = isHail
        ? mon.types.includes('Ice') ||
          ['Magic Guard', 'Overcoat', 'Snow Cloak', 'Ice Body'].includes(mon.ability)
        : mon.types.includes('Rock') ||
          mon.types.includes('Ground') ||
          mon.types.includes('Steel') ||
          ['Magic Guard', 'Overcoat', 'Sand Veil', 'Sand Rush', 'Sand Force'].includes(mon.ability);

      if (!isImmune) {
        const chipDmg = Math.max(1, Math.floor(mon.maxHp / 16));
        mon.currentHp = Math.max(0, mon.currentHp - chipDmg);
        const weatherNoun = isHail ? 'hail' : 'sandstorm';
        log('weather', `The ${weatherNoun} buffets ${sideLabel}'s ${mon.species}! (-${chipDmg} HP)`, 'weather');
        nextState.protocolLog!.push(
          `|-damage|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] ${nextState.weather}`
        );
        if (mon.currentHp <= 0) {
          mon.fainted = true;
          log('system', `${mon.species} fainted from the ${weatherNoun}!`, 'faint');
          nextState.protocolLog!.push(`|faint|${slotId}: ${mon.species}`);
        }
      }
    };

    applyWeatherChip(nextState.playerTeam[nextState.playerActiveIndex], 'your', 'p1a');
    applyWeatherChip(nextState.opponentTeam[nextState.opponentActiveIndex], `${oppTrainerName}'s`, 'p2a');
  }

  if (nextState.weather !== 'Clear') {
    nextState.weatherTurnsRemaining -= 1;
    if (nextState.weatherTurnsRemaining <= 0) {
      log('weather', `The ${nextState.weather.toLowerCase()} subsided.`);
      nextState.protocolLog!.push('|-weather|none');
      nextState.weather = 'Clear';
    }
  }

  // Status residual damage (Burn, Poison, Toxic)
  const applyStatusResiduals = (mon: Pokemon, slotId: string) => {
    if (mon.fainted || mon.currentHp <= 0 || !mon.statusCondition || mon.ability === 'Magic Guard') return;

    if (mon.statusCondition === 'burn') {
      const burnDmg = Math.max(1, Math.floor(mon.maxHp / 8));
      mon.currentHp = Math.max(0, mon.currentHp - burnDmg);
      log('system', `${mon.species} is hurt by its burn! (-${burnDmg} HP)`, 'status');
      nextState.protocolLog!.push(`|-damage|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] brn`);
    } else if (mon.statusCondition === 'poison') {
      const psnDmg = Math.max(1, Math.floor(mon.maxHp / 8));
      mon.currentHp = Math.max(0, mon.currentHp - psnDmg);
      log('system', `${mon.species} is hurt by poison! (-${psnDmg} HP)`, 'status');
      nextState.protocolLog!.push(`|-damage|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] psn`);
    } else if (mon.statusCondition === 'toxic') {
      mon.toxicCounter = (mon.toxicCounter || 0) + 1;
      const toxDmg = Math.max(1, Math.floor((mon.maxHp * mon.toxicCounter) / 16));
      mon.currentHp = Math.max(0, mon.currentHp - toxDmg);
      log('system', `${mon.species} is badly hurt by poison! (-${toxDmg} HP)`, 'status');
      nextState.protocolLog!.push(`|-damage|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] psn`);
    }

    if (mon.currentHp <= 0) {
      mon.currentHp = 0;
      mon.fainted = true;
      log('system', `${mon.species} fainted!`, 'faint');
      nextState.protocolLog!.push(`|faint|${slotId}: ${mon.species}`);
    }
  };

  applyStatusResiduals(nextState.playerTeam[nextState.playerActiveIndex], 'p1a');
  applyStatusResiduals(nextState.opponentTeam[nextState.opponentActiveIndex], 'p2a');

  // End-of-turn Held Items (Leftovers, Black Sludge, Sitrus Berry, Flame Orb, Lum Berry, Chesto Berry, White Herb)
  const checkEndTurnHeldItems = (mon: Pokemon, slotId: string, side: 'player' | 'opponent') => {
    if (mon.fainted || mon.currentHp <= 0) return;
    const itemKey = mon.heldItem?.toLowerCase() || '';

    // Sitrus Berry: <= 50% HP triggers 25% max HP restore
    if (itemKey.includes('sitrus berry') && !mon.heldItemConsumed && mon.currentHp <= Math.floor(mon.maxHp * 0.5)) {
      mon.heldItemConsumed = true;
      const heal = Math.max(1, Math.floor(mon.maxHp * 0.25));
      mon.currentHp = Math.min(mon.maxHp, mon.currentHp + heal);
      log(side, `${mon.species} restored HP using its Sitrus Berry! (+${heal} HP)`, 'status');
      nextState.protocolLog!.push(`|-heal|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] item: Sitrus Berry`);
      nextState.protocolLog!.push(`|-enditem|${slotId}: ${mon.species}|Sitrus Berry`);
    }

    // Leftovers: +1/16 max HP
    if (itemKey.includes('leftovers') && !mon.heldItemConsumed && mon.currentHp < mon.maxHp) {
      const heal = Math.max(1, Math.floor(mon.maxHp / 16));
      mon.currentHp = Math.min(mon.maxHp, mon.currentHp + heal);
      log(side, `${mon.species} restored a little HP using its Leftovers! (+${heal} HP)`, 'status');
      nextState.protocolLog!.push(`|-heal|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] item: Leftovers`);
    }

    // Black Sludge: Poison types heal 1/16, non-Poison lose 1/8
    if (itemKey.includes('black sludge') && !mon.heldItemConsumed) {
      if (mon.types.includes('Poison')) {
        if (mon.currentHp < mon.maxHp) {
          const heal = Math.max(1, Math.floor(mon.maxHp / 16));
          mon.currentHp = Math.min(mon.maxHp, mon.currentHp + heal);
          log(side, `${mon.species} restored HP using its Black Sludge! (+${heal} HP)`, 'status');
          nextState.protocolLog!.push(`|-heal|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] item: Black Sludge`);
        }
      } else if (mon.ability !== 'Magic Guard') {
        const sludgeDmg = Math.max(1, Math.floor(mon.maxHp / 8));
        mon.currentHp = Math.max(0, mon.currentHp - sludgeDmg);
        log(side, `${mon.species} was hurt by its Black Sludge! (-${sludgeDmg} HP)`, 'damage');
        nextState.protocolLog!.push(`|-damage|${slotId}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] item: Black Sludge`);
        if (mon.currentHp <= 0) {
          mon.fainted = true;
          log('system', `${mon.species} fainted!`, 'faint');
          nextState.protocolLog!.push(`|faint|${slotId}: ${mon.species}`);
        }
      }
    }

    // Flame Orb: burns holder
    if (itemKey.includes('flame orb') && !mon.heldItemConsumed && !mon.statusCondition && !mon.types.includes('Fire')) {
      applyStatusEffect(mon, slotId, 'burn', side);
    }

    // Lum Berry: cures status or confusion
    if (itemKey.includes('lum berry') && !mon.heldItemConsumed && (mon.statusCondition || mon.isConfused)) {
      mon.heldItemConsumed = true;
      mon.statusCondition = null;
      mon.isConfused = false;
      mon.confusionTurns = 0;
      log(side, `${mon.species} cured its status using its Lum Berry!`, 'status');
      nextState.protocolLog!.push(`|-curestatus|${slotId}: ${mon.species}`);
      nextState.protocolLog!.push(`|-enditem|${slotId}: ${mon.species}|Lum Berry`);
    }

    // Chesto Berry: cures sleep
    if (itemKey.includes('chesto berry') && !mon.heldItemConsumed && mon.statusCondition === 'sleep') {
      mon.heldItemConsumed = true;
      mon.statusCondition = null;
      mon.sleepTurns = 0;
      log(side, `${mon.species} woke up using its Chesto Berry!`, 'status');
      nextState.protocolLog!.push(`|-curestatus|${slotId}: ${mon.species}|slp`);
      nextState.protocolLog!.push(`|-enditem|${slotId}: ${mon.species}|Chesto Berry`);
    }

    // White Herb: resets negative stat stages to 0
    if (
      itemKey.includes('white herb') &&
      !mon.heldItemConsumed &&
      mon.statStages &&
      Object.values(mon.statStages).some((v) => (v || 0) < 0)
    ) {
      mon.heldItemConsumed = true;
      for (const k of Object.keys(mon.statStages) as StatKey[]) {
        if ((mon.statStages[k] || 0) < 0) {
          mon.statStages[k] = 0;
        }
      }
      log(side, `${mon.species} restored its lowered stats using its White Herb!`, 'status');
      nextState.protocolLog!.push(`|-clearnegativeboost|${slotId}: ${mon.species}|[from] item: White Herb`);
      nextState.protocolLog!.push(`|-enditem|${slotId}: ${mon.species}|White Herb`);
    }
  };

  checkEndTurnHeldItems(nextState.playerTeam[nextState.playerActiveIndex], 'p1a', 'player');
  checkEndTurnHeldItems(nextState.opponentTeam[nextState.opponentActiveIndex], 'p2a', 'opponent');

  // Decrement Screens (Reflect, Light Screen, Tailwind)
  const decrementScreens = (sideConditions?: SideConditions, sideName: string = 'Your') => {
    if (!sideConditions) return;
    if (sideConditions.reflectTurns && sideConditions.reflectTurns > 0) {
      sideConditions.reflectTurns -= 1;
      if (sideConditions.reflectTurns === 0) {
        log('system', `${sideName} team's Reflect wore off!`, 'status');
      }
    }
    if (sideConditions.lightScreenTurns && sideConditions.lightScreenTurns > 0) {
      sideConditions.lightScreenTurns -= 1;
      if (sideConditions.lightScreenTurns === 0) {
        log('system', `${sideName} team's Light Screen wore off!`, 'status');
      }
    }
    if (sideConditions.tailwindTurns && sideConditions.tailwindTurns > 0) {
      sideConditions.tailwindTurns -= 1;
      if (sideConditions.tailwindTurns === 0) {
        log('system', `${sideName} team's Tailwind petered out!`, 'status');
      }
    }
  };

  decrementScreens(nextState.playerSideConditions, 'Your');
  decrementScreens(nextState.opponentSideConditions, 'Opponent');

  // Decrement Volatiles (Taunt, Perish Count)
  const decrementVolatiles = (mon: Pokemon, slotId: string) => {
    if (mon.fainted || mon.currentHp <= 0) return;
    if (mon.isTaunted && mon.tauntTurns) {
      mon.tauntTurns -= 1;
      if (mon.tauntTurns <= 0) {
        mon.isTaunted = false;
        log('system', `${mon.species}'s taunt wore off!`, 'status');
        nextState.protocolLog!.push(`|-end|${slotId}: ${mon.species}|move: Taunt`);
      }
    }
    if (mon.perishCount !== undefined && mon.perishCount > 0) {
      mon.perishCount -= 1;
      log('system', `${mon.species}'s perish count fell to ${mon.perishCount}!`, 'status');
      nextState.protocolLog!.push(`|-start|${slotId}: ${mon.species}|perish${mon.perishCount}`);
      if (mon.perishCount <= 0) {
        mon.currentHp = 0;
        mon.fainted = true;
        log('system', `${mon.species} fainted from the Perish Song!`, 'faint');
        nextState.protocolLog!.push(`|faint|${slotId}: ${mon.species}`);
      }
    }
  };

  decrementVolatiles(nextState.playerTeam[nextState.playerActiveIndex], 'p1a');
  decrementVolatiles(nextState.opponentTeam[nextState.opponentActiveIndex], 'p2a');

  // Decrement Trick Room
  if (nextState.trickRoomTurns && nextState.trickRoomTurns > 0) {
    nextState.trickRoomTurns -= 1;
    if (nextState.trickRoomTurns === 0) {
      log('system', `The twisted dimensions returned to normal!`, 'status');
      nextState.protocolLog!.push(`|-fieldend|move: Trick Room`);
    }
  }

  // Phase 4: Check Game Over / Victory Conditions
  const playerAllFainted = nextState.playerTeam.every((p) => p.fainted || p.currentHp <= 0);
  const opponentAllFainted = nextState.opponentTeam.every((p) => p.fainted || p.currentHp <= 0);

  if (playerAllFainted && opponentAllFainted) {
    nextState.phase = 'battle_over';
    nextState.winner = null;
    log('system', 'Both trainers are out of usable Pokémon! It is a draw!');
    nextState.protocolLog!.push('|tie');
  } else if (opponentAllFainted) {
    nextState.phase = 'battle_over';
    nextState.winner = 'player';
    log('system', `Champion ${oppTrainerName} was defeated! You conquered the Pokémon League!`);
    nextState.protocolLog!.push('|win|p1');
  } else if (playerAllFainted) {
    nextState.phase = 'battle_over';
    nextState.winner = 'opponent';
    log('system', `You were defeated by Champion ${oppTrainerName}... Her reign remains unbroken.`);
    nextState.protocolLog!.push('|win|p2');
  } else {
    const curP = nextState.playerTeam[nextState.playerActiveIndex];
    const curO = nextState.opponentTeam[nextState.opponentActiveIndex];

    // If opponent's active Pokémon fainted, send out opponent's next healthy Pokémon
    if (curO.fainted || curO.currentHp <= 0) {
      const nextOppIdx = nextState.opponentTeam.findIndex((p) => !p.fainted && p.currentHp > 0);
      if (nextOppIdx !== -1) {
        clearVolatileOnSwitch(curO);
        nextState.opponentActiveIndex = nextOppIdx;
        const newMon = nextState.opponentTeam[nextOppIdx];
        log('opponent', `${oppTrainerName} sent out ${newMon.species}!`, 'switch');
        nextState.protocolLog!.push(
          `|switch|p2a: ${newMon.species}|${newMon.species}, L${newMon.level}|${newMon.currentHp}/${newMon.maxHp}`
        );
        if (!curP.fainted && curP.currentHp > 0) {
          triggerSwitchInAbilities(newMon, curP, 'opponent');
        }
        applyEntryHazards(newMon, 'opponent', 'p2a');
      }
    }

    // If player's active Pokémon fainted or pivoted out, enter free post-faint/pivot replacement phase
    if (curP.fainted || curP.currentHp <= 0 || nextState.pendingPivot) {
      nextState.phase = 'faint_switch_player';
    } else {
      nextState.phase = 'action_select';
    }
  }

  nextState.combatLog = [...nextState.combatLog, ...newLogs].slice(-50);
  return nextState;
}

/**
 * Executes a battle turn using standard Pokémon Showdown /choose command strings
 */
export function executeBattleTurnWithShowdownChoice(
  currentState: BattleState,
  playerChoice: string,
  opponentChoice: string
): BattleState {
  const parseAction = (choiceStr: string): BattleAction => {
    const clean = choiceStr.replace(/^\/choose\s+/i, '').trim().toLowerCase();
    const [action, numStr] = clean.split(/\s+/);
    const num = parseInt(numStr, 10);
    const index = isNaN(num) || num < 1 ? 0 : num - 1;
    if (action === 'switch') {
      return { type: 'switch', targetPokemonIndex: index };
    }
    return { type: 'move', moveIndex: index };
  };

  return executeBattleTurn(currentState, parseAction(playerChoice), parseAction(opponentChoice));
}

/**
 * Initializes a new battle with chosen player team against Champion Cynthia
 */
export function initializeBattle(playerPokemonList: Pokemon[], customOpponentList?: Pokemon[]): BattleState {
  const playerTeamCopy: Pokemon[] = playerPokemonList.map((raw) => {
    const p = clonePokemon(raw);
    p.currentHp = p.maxHp;
    p.fainted = false;
    p.statusCondition = null;
    p.sleepTurns = 0;
    p.toxicCounter = 0;
    p.substituteHp = 0;
    p.isProtected = false;
    p.protectStreak = 0;
    p.moves = p.moves.map((m) => {
      const enriched = enrichMoveWithMechanics(m);
      enriched.pp = enriched.maxPp;
      return enriched;
    });
    return p;
  });

  const opponentBase = customOpponentList || CHAMPION_CYNTHIA_TEAM;
  const oppTeamCopy: Pokemon[] = opponentBase.map((raw) => {
    const p = clonePokemon(raw);
    p.currentHp = p.maxHp;
    p.fainted = false;
    p.statusCondition = null;
    p.sleepTurns = 0;
    p.toxicCounter = 0;
    p.substituteHp = 0;
    p.isProtected = false;
    p.protectStreak = 0;
    p.moves = p.moves.map((m) => {
      const enriched = enrichMoveWithMechanics(m);
      enriched.pp = enriched.maxPp;
      return enriched;
    });
    return p;
  });

  const pLead = playerTeamCopy[0];
  const oLead = oppTeamCopy[0];
  const isMtSilverRed = oppTeamCopy.some((p) => p.id.startsWith('red_'));
  const isCynthia = !isMtSilverRed;

  const getAbilityWeather = (ability: string): { weather: WeatherType; msg: (species: string) => string } | null => {
    if (ability === 'Sand Stream') return { weather: 'Sand', msg: (s) => `${s}'s Sand Stream whipped up a sandstorm!` };
    if (ability === 'Drizzle') return { weather: 'Rain', msg: (s) => `${s}'s Drizzle made it rain!` };
    if (ability === 'Drought') return { weather: 'Sun', msg: (s) => `${s}'s Drought intensified the sun's rays!` };
    if (ability === 'Snow Warning') return { weather: 'Hail', msg: (s) => `${s}'s Snow Warning whipped up a hailstorm!` };
    return null;
  };

  const leadWeatherSpec = getAbilityWeather(pLead.ability) || getAbilityWeather(oLead.ability);
  const leadWeatherOwner = getAbilityWeather(pLead.ability) ? pLead : oLead;

  const initialWeather: WeatherType = leadWeatherSpec
    ? leadWeatherSpec.weather
    : isCynthia
    ? 'Clear'
    : 'Hail';

  return {
    turnNumber: 1,
    weather: initialWeather,
    weatherTurnsRemaining: initialWeather === 'Clear' ? 0 : 5,
    playerActiveIndex: 0,
    opponentActiveIndex: 0,
    playerTeam: playerTeamCopy,
    opponentTeam: oppTeamCopy,
    isPlayerTurn: true,
    phase: 'action_select',
    playerSideConditions: {},
    opponentSideConditions: {},
    protocolLog: [
      '|start',
      '|gen|4',
      `|tier|${isCynthia ? '[Gen 4] Sinnoh Champion Showdown' : '[Gen 3] Mt. Silver Showdown'}`,
      '|gametype|singles',
      '|player|p1|Player|avatar|1',
      `|player|p2|${isCynthia ? 'Champion Cynthia' : 'Champion Red'}|avatar|2`,
      '|teamsize|p1|6',
      '|teamsize|p2|6',
      `|switch|p1a: ${pLead.species}|${pLead.species}, L${pLead.level}|${pLead.currentHp}/${pLead.maxHp}`,
      `|switch|p2a: ${oLead.species}|${oLead.species}, L${oLead.level}|${oLead.currentHp}/${oLead.maxHp}`,
      ...(initialWeather === 'Clear' ? [] : [`|-weather|${initialWeather}`]),
    ],
    combatLog: [
      {
        id: 'init_1',
        turn: 1,
        actor: 'system',
        message: isCynthia
          ? 'Sinnoh Pokémon League — Champion Cynthia accepts your challenge!'
          : 'Mt. Silver Summit — Champion Red wants to battle!',
      },
      ...(isCynthia
        ? []
        : [
            {
              id: 'init_2',
              turn: 1,
              actor: 'weather' as const,
              message: 'A fierce hail storm is raging atop the mountain!',
              type: 'weather' as const,
            },
          ]),
      {
        id: 'init_3',
        turn: 1,
        actor: 'opponent',
        message: `${isCynthia ? 'Cynthia' : 'Red'} sent out ${oLead.species}!`,
        type: 'switch',
      },
      {
        id: 'init_4',
        turn: 1,
        actor: 'player',
        message: `Go! ${pLead.species}!`,
        type: 'switch',
      },
      ...(leadWeatherSpec
        ? [
            {
              id: 'init_5',
              turn: 1,
              actor: 'weather' as const,
              message: leadWeatherSpec.msg(leadWeatherOwner.species),
              type: 'weather' as const,
            },
          ]
        : []),
    ],
  };
}
