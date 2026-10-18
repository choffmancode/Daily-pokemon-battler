/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pokemon, Move, PokemonType, BattleAction, BattleState, BattleTurnLog } from './types';
import { TYPE_CHART, CHAMPION_RED_TEAM, CHAMPION_CYNTHIA_TEAM } from './constants';

// High-speed lookup cache for type effectiveness
const TYPE_EFFECTIVENESS_CACHE = new Map<string, number>();

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
 * Calculates accurate Pokemon damage with STAB, type effectiveness, and critical hits
 */
export function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  options?: { rngVariance?: number; forceCrit?: boolean; isHail?: boolean }
): { damage: number; isCrit: boolean; effectiveness: number } {
  if (move.category === 'Status' || move.power === 0) {
    return { damage: 0, isCrit: false, effectiveness: 1 };
  }

  const effectiveness = calculateTypeEffectiveness(move.type, defender.types);
  if (effectiveness === 0) {
    return { damage: 0, isCrit: false, effectiveness: 0 };
  }

  // Level factor: (2 * 100 / 5) + 2 = 42
  const levelFactor = Math.floor((2 * attacker.level) / 5) + 2;

  // Stat stage multipliers
  const getStageMultiplier = (stage = 0) => {
    if (stage >= 0) return (2 + stage) / 2;
    return 2 / (2 - stage);
  };

  let atk = move.category === 'Physical' ? attacker.baseStats.attack : attacker.baseStats.spAtk;
  let def = move.category === 'Physical' ? defender.baseStats.defense : defender.baseStats.spDef;

  if (attacker.statStages) {
    const stage = move.category === 'Physical' ? attacker.statStages.attack : attacker.statStages.spAtk;
    atk *= getStageMultiplier(stage);
  }
  if (defender.statStages) {
    const stage = move.category === 'Physical' ? defender.statStages.defense : defender.statStages.spDef;
    def *= getStageMultiplier(stage);
  }

  // Avoid divide-by-zero
  def = Math.max(1, def);

  // Critical hit (approx 6.25% unless forced or tested)
  const isCrit = options?.forceCrit ?? Math.random() < 0.0625;
  const critMultiplier = isCrit ? 1.5 : 1.0;

  // STAB (Same-Type Attack Bonus)
  const isStab = attacker.types.includes(move.type);
  const stabMultiplier = isStab ? 1.5 : 1.0;

  // Base damage formula
  const baseDamage = ((levelFactor * move.power * (atk / def)) / 50) + 2;

  // Variance: default 0.85 - 1.00
  const variance = options?.rngVariance ?? (0.85 + Math.random() * 0.15);

  let finalDamage = Math.floor(baseDamage * stabMultiplier * effectiveness * critMultiplier * variance);
  finalDamage = Math.max(1, finalDamage);

  return { damage: finalDamage, isCrit, effectiveness };
}

/**
 * Calculates in-battle effective Speed considering stat stages and status conditions
 */
export function calculateEffectiveSpeed(mon: Pokemon): number {
  let speed = mon.baseStats.speed;
  const stage = mon.statStages?.speed || 0;
  if (stage > 0) {
    speed = Math.floor(speed * ((2 + stage) / 2));
  } else if (stage < 0) {
    speed = Math.floor(speed * (2 / (2 - stage)));
  }
  // Paralysis standard reduction: 0.5x speed
  if (mon.statusCondition === 'paralysis') {
    speed = Math.floor(speed * 0.5);
  }
  return Math.max(1, speed);
}

/**
 * Intelligent AI Move and Switch Choice (Champion Red behavior)
 */
export function selectAIMoveOrSwitch(
  aiActive: Pokemon,
  playerActive: Pokemon,
  aiTeam: Pokemon[]
): BattleAction {
  // If AI Pokemon has fainted, switch to first healthy Pokemon
  if (aiActive.fainted || aiActive.currentHp <= 0) {
    const nextIdx = aiTeam.findIndex(p => !p.fainted && p.currentHp > 0);
    return { type: 'switch', targetPokemonIndex: Math.max(0, nextIdx) };
  }

  // Evaluate each move
  let bestMoveIndex = 0;
  let highestDamageScore = -1;

  for (let i = 0; i < aiActive.moves.length; i++) {
    const move = aiActive.moves[i];
    if (move.pp <= 0) continue;

    if (move.category === 'Status') {
      // Use status move if AI is healthy and player doesn't already have status
      if (aiActive.currentHp > aiActive.maxHp * 0.6 && !playerActive.statusCondition) {
        if (move.id === 'sleep_powder' && Math.random() < 0.6) {
          return { type: 'move', moveIndex: i };
        }
        if (move.id === 'calm_mind' && Math.random() < 0.4) {
          return { type: 'move', moveIndex: i };
        }
      }
      continue;
    }

    const { damage, effectiveness } = calculateDamage(aiActive, playerActive, move, { rngVariance: 0.95 });

    let score = damage;
    // Massive bonus if it's lethal
    if (damage >= playerActive.currentHp) {
      score += 1000;
    }
    // Priority move score boost if player is low HP
    if ((move.priority || 0) > 0 && playerActive.currentHp < 70) {
      score += 300;
    }
    // High effectiveness multiplier
    score *= effectiveness;

    if (score > highestDamageScore) {
      highestDamageScore = score;
      bestMoveIndex = i;
    }
  }

  // Check if AI active is severely threatened (4x weakness or under 20% HP) and has a clean pivot
  const playerCounterPotential = playerActive.moves.some(m => calculateTypeEffectiveness(m.type, aiActive.types) >= 2);
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

/**
 * Resolves a full turn in the battle between Player and Opponent
 */
export function executeBattleTurn(
  currentState: BattleState,
  playerAction: BattleAction,
  opponentAction: BattleAction
): BattleState {
  // Deep clone state to ensure immutability
  const nextState: BattleState = JSON.parse(JSON.stringify(currentState));
  const newLogs: BattleTurnLog[] = [];
  nextState.turnNumber += 1;
  nextState.protocolLog = nextState.protocolLog || [];
  nextState.protocolLog.push(`|turn|${nextState.turnNumber}`);
  nextState.turnMoves = [];

  const playerMon = nextState.playerTeam[nextState.playerActiveIndex];
  const opponentMon = nextState.opponentTeam[nextState.opponentActiveIndex];

  // Helper for adding combat logs
  const log = (actor: 'player' | 'opponent' | 'system' | 'weather', message: string, type?: BattleTurnLog['type'], eff?: number) => {
    newLogs.push({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      turn: nextState.turnNumber,
      actor,
      message,
      type,
      effectiveness: eff,
    });
  };

  // Phase 1: Handle Switches First (Ordered by Speed if both switch)
  let playerSwitched = false;
  let opponentSwitched = false;

  const playerWantsSwitch = playerAction.type === 'switch' && playerAction.targetPokemonIndex !== undefined;
  const opponentWantsSwitch = opponentAction.type === 'switch' && opponentAction.targetPokemonIndex !== undefined;

  const executePlayerSwitch = () => {
    if (!playerWantsSwitch) return;
    const target = nextState.playerTeam[playerAction.targetPokemonIndex!];
    if (target && !target.fainted && playerAction.targetPokemonIndex !== nextState.playerActiveIndex) {
      log('player', `You withdrew ${playerMon.species} and sent out ${target.species}!`, 'switch');
      nextState.protocolLog!.push(`|switch|p1a: ${target.species}|${target.species}, L${target.level}|${target.currentHp}/${target.maxHp}`);
      nextState.playerActiveIndex = playerAction.targetPokemonIndex!;
      playerSwitched = true;
    }
  };

  const executeOpponentSwitch = () => {
    if (!opponentWantsSwitch) return;
    const target = nextState.opponentTeam[opponentAction.targetPokemonIndex!];
    if (target && !target.fainted && opponentAction.targetPokemonIndex !== nextState.opponentActiveIndex) {
      const oppName = nextState.opponentTeam.some(p => p.id.startsWith('cynthia_')) ? 'Cynthia' : 'Red';
      log('opponent', `${oppName} called back ${opponentMon.species} and sent out ${target.species}!`, 'switch');
      nextState.protocolLog!.push(`|switch|p2a: ${target.species}|${target.species}, L${target.level}|${target.currentHp}/${target.maxHp}`);
      nextState.opponentActiveIndex = opponentAction.targetPokemonIndex!;
      opponentSwitched = true;
    }
  };

  if (playerWantsSwitch && opponentWantsSwitch) {
    const playerSpeed = calculateEffectiveSpeed(playerMon);
    const opponentSpeed = calculateEffectiveSpeed(opponentMon);
    if (playerSpeed > opponentSpeed || (playerSpeed === opponentSpeed && Math.random() < 0.5)) {
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

  // Update references to current active Pokémon after potential switches
  const curPlayerMon = nextState.playerTeam[nextState.playerActiveIndex];
  const curOpponentMon = nextState.opponentTeam[nextState.opponentActiveIndex];

  // Phase 2: Resolve Attacks if sides didn't switch
  interface TurnParticipant {
    side: 'player' | 'opponent';
    mon: Pokemon;
    action: BattleAction;
    priority: number;
    speed: number;
  }

  const participants: TurnParticipant[] = [];

  if (!playerSwitched && playerAction.type === 'move' && playerAction.moveIndex !== undefined) {
    const move = curPlayerMon.moves[playerAction.moveIndex];
    participants.push({
      side: 'player',
      mon: curPlayerMon,
      action: playerAction,
      priority: move?.priority || 0,
      speed: calculateEffectiveSpeed(curPlayerMon),
    });
  }

  if (!opponentSwitched && opponentAction.type === 'move' && opponentAction.moveIndex !== undefined) {
    const move = curOpponentMon.moves[opponentAction.moveIndex];
    participants.push({
      side: 'opponent',
      mon: curOpponentMon,
      action: opponentAction,
      priority: move?.priority || 0,
      speed: calculateEffectiveSpeed(curOpponentMon),
    });
  }

  // Sort by priority first (highest first), then by speed (highest first), random tie-break
  participants.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (b.speed !== a.speed) return b.speed - a.speed;
    return Math.random() < 0.5 ? 1 : -1;
  });

  // Execute participants in turn order
  for (const p of participants) {
    // If the attacker fainted earlier this turn, they cannot move
    if (p.mon.fainted || p.mon.currentHp <= 0) continue;

    const isPlayer = p.side === 'player';
    const attacker = isPlayer ? curPlayerMon : curOpponentMon;
    const defender = isPlayer ? curOpponentMon : curPlayerMon;
    const actorSlot = isPlayer ? 'p1a' : 'p2a';
    const targetSlot = isPlayer ? 'p2a' : 'p1a';

    // Check if target is already fainted
    if (defender.fainted || defender.currentHp <= 0) continue;

    const move = attacker.moves[p.action.moveIndex ?? 0];
    if (!move) continue;

    // PP consumption
    if (move.pp > 0) move.pp -= 1;

    log(p.side, `${attacker.species} used ${move.name}!`);
    nextState.protocolLog!.push(`|move|${actorSlot}: ${attacker.species}|${move.name}|${targetSlot}: ${defender.species}`);

    // Check accuracy
    const hitRoll = Math.random() * 100;
    if (hitRoll > move.accuracy) {
      log('system', `${attacker.species}'s attack missed!`);
      continue;
    }

    if (move.category === 'Status') {
      if (move.statChange) {
        log('system', `${attacker.species}'s ${move.statChange.stat} rose!`, 'status');
        nextState.protocolLog!.push(`|-boost|${actorSlot}: ${attacker.species}|${move.statChange.stat.slice(0, 3)}|${move.statChange.stages}`);
      } else if (move.statusEffect && !defender.statusCondition) {
        defender.statusCondition = move.statusEffect;
        log(p.side, `${defender.species} was afflicted with ${move.statusEffect}!`, 'status');
        nextState.protocolLog!.push(`|-status|${targetSlot}: ${defender.species}|${move.statusEffect.slice(0, 3)}`);
      } else if (move.id === 'rest') {
        attacker.currentHp = attacker.maxHp;
        attacker.statusCondition = 'sleep';
        log(p.side, `${attacker.species} fell asleep and recovered full health!`, 'status');
        nextState.protocolLog!.push(`|-status|${actorSlot}: ${attacker.species}|slp`);
        nextState.protocolLog!.push(`|-heal|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}`);
      } else if (move.id === 'roost') {
        const heal = Math.floor(attacker.maxHp * 0.5);
        attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
        log(p.side, `${attacker.species} restored ${heal} HP!`, 'status');
        nextState.protocolLog!.push(`|-heal|${actorSlot}: ${attacker.species}|${attacker.currentHp}/${attacker.maxHp}`);
      }
      continue;
    }

    // Damage move execution
    const { damage, isCrit, effectiveness } = calculateDamage(attacker, defender, move);
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    const defenderDied = defender.currentHp <= 0;
    if (defenderDied) {
      defender.currentHp = 0;
      defender.fainted = true;
    }

    const moveExec = {
      moveName: move.name,
      moveType: move.type,
      moveCategory: move.category,
      userSide: isPlayer ? ('player' as const) : ('opponent' as const),
      targetSide: isPlayer ? ('opponent' as const) : ('player' as const),
      damageDealt: damage,
      isCrit,
      effectiveness,
      defenderHpRemaining: defender.currentHp,
      defenderFainted: defenderDied,
    };
    nextState.lastMoveUsed = moveExec;
    nextState.turnMoves!.push(moveExec);

    if (effectiveness > 1) {
      log(p.side, `It's super effective! (${effectiveness}x)`, 'effectiveness', effectiveness);
      nextState.protocolLog!.push(`|-supereffective|${targetSlot}: ${defender.species}`);
    } else if (effectiveness === 0) {
      log(p.side, `It doesn't affect ${defender.species}... (Immune)`, 'effectiveness', 0);
      nextState.protocolLog!.push(`|-immune|${targetSlot}: ${defender.species}`);
    } else if (effectiveness < 1) {
      log(p.side, `It's not very effective... (${effectiveness}x)`, 'effectiveness', effectiveness);
      nextState.protocolLog!.push(`|-resisted|${targetSlot}: ${defender.species}`);
    }

    if (isCrit) {
      log(p.side, `A critical hit!`, 'crit');
      nextState.protocolLog!.push(`|-crit|${targetSlot}: ${defender.species}`);
    }

    nextState.protocolLog!.push(`|-damage|${targetSlot}: ${defender.species}|${defender.currentHp}/${defender.maxHp}`);

    // Check faint: A knocked out Pokemon CANNOT attack back or execute their action
    if (defenderDied) {
      log('system', `${defender.species} fainted!`, 'faint');
      nextState.protocolLog!.push(`|faint|${targetSlot}: ${defender.species}`);
      break; // Immediately exit turn loop; defender's pending action is cancelled!
    }
  }

  // Phase 3: Weather Effects (Mt. Silver sub-zero Hailstorm)
  if (nextState.weather === 'Hail') {
    const applyHailChip = (mon: Pokemon, sideName: string) => {
      // Fainted Pokemon, Ice types, and specific abilities are immune to Hail damage
      const isImmune =
        mon.fainted ||
        mon.currentHp <= 0 ||
        mon.types.includes('Ice') ||
        ['Magic Guard', 'Overcoat', 'Snow Cloak', 'Ice Body'].includes(mon.ability);

      if (!isImmune) {
        // Standard competitive Showdown / Gen 3-8: strictly 1/16th (6.25%) max HP
        const hailDmg = Math.max(1, Math.floor(mon.maxHp / 16));
        mon.currentHp = Math.max(0, mon.currentHp - hailDmg);
        log('weather', `The hail buffets ${sideName}'s ${mon.species}! (-${hailDmg} HP)`, 'weather');
        nextState.protocolLog!.push(`|-damage|${sideName === 'your' ? 'p1a' : 'p2a'}: ${mon.species}|${mon.currentHp}/${mon.maxHp}|[from] Hail`);
        if (mon.currentHp <= 0) {
          mon.fainted = true;
          log('system', `${mon.species} fainted from the hail!`, 'faint');
          nextState.protocolLog!.push(`|faint|${sideName === 'your' ? 'p1a' : 'p2a'}: ${mon.species}`);
        }
      }
    };

    applyHailChip(nextState.playerTeam[nextState.playerActiveIndex], 'your');
    applyHailChip(nextState.opponentTeam[nextState.opponentActiveIndex], "Red's");

    // Weather duration decrement (competitive standard 5 turns)
    nextState.weatherTurnsRemaining -= 1;
    if (nextState.weatherTurnsRemaining <= 0) {
      log('weather', 'The hail stopped.');
      nextState.protocolLog!.push('|-weather|none');
      nextState.weather = 'Clear';
    }
  }

  // Phase 4: Check Game Over / Victory Conditions
  const playerAllFainted = nextState.playerTeam.every(p => p.fainted || p.currentHp <= 0);
  const opponentAllFainted = nextState.opponentTeam.every(p => p.fainted || p.currentHp <= 0);

  const oppName = nextState.opponentTeam.some(p => p.id.startsWith('cynthia_')) ? 'Cynthia' : 'Red';

  if (playerAllFainted && opponentAllFainted) {
    nextState.phase = 'battle_over';
    nextState.winner = null; // Draw
    log('system', 'Both trainers are out of usable Pokémon! It is a draw!');
    nextState.protocolLog!.push('|tie');
  } else if (opponentAllFainted) {
    nextState.phase = 'battle_over';
    nextState.winner = 'player';
    log('system', `Champion ${oppName} was defeated! You conquered the Pokémon League!`);
    nextState.protocolLog!.push('|win|p1');
  } else if (playerAllFainted) {
    nextState.phase = 'battle_over';
    nextState.winner = 'opponent';
    log('system', `You were defeated by Champion ${oppName}... Her reign remains unbroken.`);
    nextState.protocolLog!.push('|win|p2');
  } else {
    // Check if current active fainted and needs switch
    const curP = nextState.playerTeam[nextState.playerActiveIndex];
    const curO = nextState.opponentTeam[nextState.opponentActiveIndex];

    if (curP.fainted) {
      nextState.phase = 'faint_switch_player';
    } else if (curO.fainted) {
      // Auto-switch opponent to first available
      const nextOppIdx = nextState.opponentTeam.findIndex(p => !p.fainted && p.currentHp > 0);
      if (nextOppIdx !== -1) {
        nextState.opponentActiveIndex = nextOppIdx;
        const newMon = nextState.opponentTeam[nextOppIdx];
        log('opponent', `${oppName} sent out ${newMon.species}!`, 'switch');
        nextState.protocolLog!.push(`|switch|p2a: ${newMon.species}|${newMon.species}, L${newMon.level}|${newMon.currentHp}/${newMon.maxHp}`);
      }
      nextState.phase = 'action_select';
    } else {
      nextState.phase = 'action_select';
    }
  }

  // Append new logs to state history (limit to last 50)
  nextState.combatLog = [...nextState.combatLog, ...newLogs].slice(-50);
  return nextState;
}

/**
 * Executes a battle turn using standard Pokémon Showdown /choose command strings
 * e.g. "/choose move 1", "/choose switch 2"
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
  // Fresh copies so state starts at full HP
  const playerTeamCopy: Pokemon[] = JSON.parse(JSON.stringify(playerPokemonList));
  playerTeamCopy.forEach(p => {
    p.currentHp = p.maxHp;
    p.fainted = false;
    p.statusCondition = null;
    p.moves.forEach(m => (m.pp = m.maxPp));
  });

  const opponentBase = customOpponentList || CHAMPION_CYNTHIA_TEAM;
  const oppTeamCopy: Pokemon[] = JSON.parse(JSON.stringify(opponentBase));
  oppTeamCopy.forEach(p => {
    p.currentHp = p.maxHp;
    p.fainted = false;
    p.statusCondition = null;
    p.moves.forEach(m => (m.pp = m.maxPp));
  });

  const pLead = playerTeamCopy[0];
  const oLead = oppTeamCopy[0];
  const isCynthia = oppTeamCopy.some(p => p.id.startsWith('cynthia_'));

  const initialState: BattleState = {
    turnNumber: 1,
    weather: isCynthia ? 'Clear' : 'Hail',
    weatherTurnsRemaining: 5,
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
      ...(isCynthia ? [] : ['|-weather|Hail']),
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
    ],
  };

  return initialState;
}
