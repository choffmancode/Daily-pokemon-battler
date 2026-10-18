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
} from './types';
import { TYPE_CHART, CHAMPION_CYNTHIA_TEAM } from './constants';
import { enrichMoveWithMechanics, getMoveMechanics } from './data/moveMechanicsKB';

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
  const base = mon.baseStats[stat];
  const stage = mon.statStages?.[stat] ?? 0;
  const mult = getStatStageMultiplier(stage);
  return Math.max(1, Math.floor(base * mult));
}

/**
 * Calculates in-battle effective Speed considering stat stages and paralysis (Gen 3 standard)
 */
export function calculateEffectiveSpeed(mon: Pokemon): number {
  let speed = mon.baseStats.speed;
  const stage = mon.statStages?.speed || 0;
  speed = Math.floor(speed * getStatStageMultiplier(stage));
  // Paralysis reduction: 0.5x speed
  if (mon.statusCondition === 'paralysis') {
    speed = Math.floor(speed * 0.5);
  }
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
export function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  options?: {
    rngVariance?: number;
    forceCrit?: boolean;
    weather?: WeatherType;
    isHail?: boolean;
  }
): { damage: number; isCrit: boolean; effectiveness: number } {
  if (move.category === 'Status' || move.power === 0) {
    return { damage: 0, isCrit: false, effectiveness: 1 };
  }

  const effectiveness = calculateTypeEffectiveness(move.type, defender.types);
  if (effectiveness === 0) {
    return { damage: 0, isCrit: false, effectiveness: 0 };
  }

  const weather: WeatherType = options?.weather ?? (options?.isHail ? 'Hail' : 'Clear');
  const isCrit = options?.forceCrit ?? Math.random() < 0.0625;
  const variance = options?.rngVariance ?? 0.85 + Math.random() * 0.15;

  const atkStage = attacker.statStages
    ? (move.category === 'Physical' ? attacker.statStages.attack : attacker.statStages.spAtk) || 0
    : 0;
  const defStage = defender.statStages
    ? (move.category === 'Physical' ? defender.statStages.defense : defender.statStages.spDef) || 0
    : 0;

  // Check deterministic base damage cache
  const cacheKey = `${attacker.level}:${move.power}:${move.type}:${move.category}:${
    move.category === 'Physical' ? attacker.baseStats.attack : attacker.baseStats.spAtk
  }:${atkStage}:${attacker.statusCondition || 'none'}:${attacker.ability}:${
    move.category === 'Physical' ? defender.baseStats.defense : defender.baseStats.spDef
  }:${defStage}:${defender.types.join(',')}:${defender.ability}:${weather}:${isCrit ? 1 : 0}`;

  let unvariedDamage = DAMAGE_LOOKUP_CACHE.get(cacheKey);

  if (unvariedDamage === undefined) {
    // Level factor: (2 * Level / 5) + 2
    const levelFactor = Math.floor((2 * attacker.level) / 5) + 2;

    // In Gen 3, critical hits ignore negative attack stages and positive defense stages
    const effectiveAtkStage = isCrit && atkStage < 0 ? 0 : atkStage;
    const effectiveDefStage = isCrit && defStage > 0 ? 0 : defStage;

    let atk =
      (move.category === 'Physical' ? attacker.baseStats.attack : attacker.baseStats.spAtk) *
      getStatStageMultiplier(effectiveAtkStage);
    let def =
      (move.category === 'Physical' ? defender.baseStats.defense : defender.baseStats.spDef) *
      getStatStageMultiplier(effectiveDefStage);

    // Sandstorm boosts Rock-type Sp. Def by 1.5x
    if (weather === 'Sand' && move.category === 'Special' && defender.types.includes('Rock')) {
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

    let baseDamage = (levelFactor * move.power * (atk / def)) / 50 + 2;

    // Burn halves physical damage (unless Guts)
    if (
      attacker.statusCondition === 'burn' &&
      move.category === 'Physical' &&
      attacker.ability !== 'Guts'
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

    unvariedDamage = baseDamage * stabMultiplier * effectiveness * critMultiplier;

    if (DAMAGE_LOOKUP_CACHE.size >= MAX_DAMAGE_CACHE_SIZE) {
      const oldestKey = DAMAGE_LOOKUP_CACHE.keys().next().value;
      if (oldestKey) DAMAGE_LOOKUP_CACHE.delete(oldestKey);
    }
    DAMAGE_LOOKUP_CACHE.set(cacheKey, unvariedDamage);
  }

  const finalDamage = Math.max(1, Math.floor(unvariedDamage * variance));
  return { damage: finalDamage, isCrit, effectiveness };
}

/**
 * Intelligent AI Move and Switch Choice (Champion Cynthia / Red behavior)
 */
export function selectAIMoveOrSwitch(
  aiActive: Pokemon,
  playerActive: Pokemon,
  aiTeam: Pokemon[]
): BattleAction {
  if (aiActive.fainted || aiActive.currentHp <= 0) {
    const nextIdx = aiTeam.findIndex((p) => !p.fainted && p.currentHp > 0);
    return { type: 'switch', targetPokemonIndex: Math.max(0, nextIdx) };
  }

  let bestMoveIndex = 0;
  let highestDamageScore = -1;

  for (let i = 0; i < aiActive.moves.length; i++) {
    const move = aiActive.moves[i];
    if (move.pp <= 0) continue;

    if (move.category === 'Status') {
      if (aiActive.currentHp > aiActive.maxHp * 0.6 && !playerActive.statusCondition && !playerActive.substituteHp) {
        if ((move.id === 'sleep_powder' || move.id === 'hypnosis' || move.statusEffect) && Math.random() < 0.6) {
          return { type: 'move', moveIndex: i };
        }
        if ((move.id === 'calm_mind' || move.statChange) && Math.random() < 0.4) {
          return { type: 'move', moveIndex: i };
        }
      }
      continue;
    }

    const { damage, effectiveness } = calculateDamage(aiActive, playerActive, move, { rngVariance: 0.95 });

    let score = damage;
    if (damage >= playerActive.currentHp) {
      score += 1000;
    }
    if ((move.priority || 0) > 0 && playerActive.currentHp < 70) {
      score += 300;
    }
    score *= effectiveness;

    if (score > highestDamageScore) {
      highestDamageScore = score;
      bestMoveIndex = i;
    }
  }

  const playerCounterPotential = playerActive.moves.some(
    (m) => calculateTypeEffectiveness(m.type, aiActive.types) >= 2
  );
  if (aiActive.currentHp < aiActive.maxHp * 0.25 && playerCounterPotential && Math.random() < 0.35) {
    const alternativeIdx = aiTeam.findIndex(
      (p, idx) => idx !== aiTeam.indexOf(aiActive) && !p.fainted && p.currentHp > p.maxHp * 0.5
    );
    if (alternativeIdx !== -1) {
      return { type: 'switch', targetPokemonIndex: alternativeIdx };
    }
  }

  return { type: 'move', moveIndex: bestMoveIndex };
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

  const playerWantsSwitch = playerAction.type === 'switch' && playerAction.targetPokemonIndex !== undefined;
  const opponentWantsSwitch = opponentAction.type === 'switch' && opponentAction.targetPokemonIndex !== undefined;

  // CRITICAL INVARIANT: Free Post-Faint Replacement Switch
  // When the player's active Pokémon has fainted, sending out its replacement fills the empty slot
  // between turns. The opponent MUST NOT attack the incoming Pokémon, weather/status residuals MUST NOT
  // tick a second time, and turnNumber does not advance until the next combat turn's action selection.
  const isPostFaintPlayerSwitch =
    (currentState.phase === 'faint_switch_player' || playerMon.fainted || playerMon.currentHp <= 0) &&
    playerWantsSwitch;

  if (isPostFaintPlayerSwitch) {
    const targetIdx = playerAction.targetPokemonIndex!;
    const target = nextState.playerTeam[targetIdx];
    if (target && !target.fainted && target.currentHp > 0 && targetIdx !== nextState.playerActiveIndex) {
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
        }
      }

      triggerSwitchInAbilities(target, currentOpp, 'player');
      nextState.phase = 'action_select';
      nextState.isPlayerTurn = true;
      nextState.lastMoveUsed = undefined;
      nextState.turnMoves = [];
      nextState.combatLog = [...nextState.combatLog, ...newLogs].slice(-50);
    }
    return nextState;
  }

  // Standard Full Combat Turn
  nextState.turnNumber += 1;
  nextState.protocolLog.push(`|turn|${nextState.turnNumber}`);

  // Reset single-turn protection flags at the start of the turn
  nextState.playerTeam.forEach((p) => {
    p.isProtected = false;
  });
  nextState.opponentTeam.forEach((p) => {
    p.isProtected = false;
  });

  // Phase 1: Handle Voluntary Mid-Battle Switches First (Ordered by Speed if both switch)
  let playerSwitched = false;
  let opponentSwitched = false;

  const executePlayerSwitch = () => {
    if (!playerWantsSwitch) return;
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

  const curPlayerMon = nextState.playerTeam[nextState.playerActiveIndex];
  const curOpponentMon = nextState.opponentTeam[nextState.opponentActiveIndex];

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
      speed: calculateEffectiveSpeed(curPlayerMon),
    });
  }

  if (!opponentSwitched && opponentAction.type === 'move' && opponentAction.moveIndex !== undefined) {
    const move = curOpponentMon.moves[opponentAction.moveIndex];
    participants.push({
      side: 'opponent',
      mon: curOpponentMon,
      action: opponentAction,
      priority: getMovePriority(move),
      speed: calculateEffectiveSpeed(curOpponentMon),
    });
  }

  participants.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (b.speed !== a.speed) return b.speed - a.speed;
    return rng() < 0.5 ? 1 : -1;
  });

  // Helper to apply status effects
  const applyStatusEffect = (
    target: Pokemon,
    targetSlot: string,
    status: StatusCondition,
    actorSide: 'player' | 'opponent'
  ) => {
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

  const flinchedSides = new Set<'player' | 'opponent'>();

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
      continue;
    }

    const rawMove = attacker.moves[p.action.moveIndex ?? 0];
    if (!rawMove) continue;
    const move = enrichMoveWithMechanics(rawMove);

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
      continue;
    }

    // Check accuracy (No Guard bypasses accuracy checks)
    const hasNoGuard = attacker.ability === 'No Guard' || defender.ability === 'No Guard';
    if (!hasNoGuard && !isSelfMove) {
      const hitRoll = rng() * 100;
      if (hitRoll > move.accuracy) {
        log('system', `${attacker.species}'s attack missed!`);
        nextState.protocolLog!.push(`|-miss|${actorSlot}: ${attacker.species}|${targetSlot}: ${defender.species}`);
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
      continue;
    }

    // Damaging Move Execution (supports single-hit and multi-hit moves + Substitute absorption)
    const minHits = move.multiHit ? move.multiHit[0] : 1;
    const maxHits = move.multiHit ? move.multiHit[1] : 1;
    const hitCount =
      minHits === maxHits
        ? minHits
        : minHits + Math.floor(rng() * (maxHits - minHits + 1));

    let totalDamageDealt = 0;
    let anyCrit = false;
    let finalEffectiveness = 1;
    let hitSubstituteOnly = false;

    for (let hitIdx = 0; hitIdx < hitCount; hitIdx++) {
      if (defender.fainted || defender.currentHp <= 0) break;

      const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, move, {
        weather: nextState.weather,
        forceCrit: options?.forceCrit,
        rngVariance: 0.85 + rng() * 0.15,
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
        defender.currentHp = Math.max(0, defender.currentHp - damage);
        totalDamageDealt += actualHpLost;
        if (defender.currentHp <= 0) {
          defender.currentHp = 0;
          defender.fainted = true;
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
      }
    }

    // If player's active Pokémon fainted, enter free post-faint replacement phase
    if (curP.fainted || curP.currentHp <= 0) {
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
