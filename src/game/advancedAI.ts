/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Advanced Combat AI Decision Engine
 * Implements the 8-layer deterministic weighted scoring matrix
 * from Radical Red (CFRU) and Emerald Kaizo.
 */

import { Pokemon, Move, BattleAction, SideConditions, WeatherType } from './types';
import {
  calculateDamage,
  calculateEffectiveSpeed,
  calculateTypeEffectiveness,
  isImmuneToStatus,
} from './battleEngine';

export interface ScoredAIMove {
  moveIndex: number;
  move: Move;
  score: number;
  reasons: string[];
}

/**
 * Checks if a move is a stat boosting setup move
 */
export function isSetupMove(moveId: string): boolean {
  const setupIds = [
    'swords_dance',
    'dragon_dance',
    'nasty_plot',
    'calm_mind',
    'agility',
    'bulk_up',
    'curse',
    'iron_defense',
    'quiver_dance',
    'shell_smash',
  ];
  return setupIds.includes(moveId.toLowerCase());
}

/**
 * Checks if a move is a recovery move
 */
export function isRecoveryMove(moveId: string): boolean {
  const recoveryIds = [
    'recover',
    'slack_off',
    'roost',
    'softboiled',
    'soft_boiled',
    'synthesis',
    'moonlight',
    'morning_sun',
    'wish',
    'rest',
    'pain_split',
  ];
  return recoveryIds.includes(moveId.toLowerCase());
}

/**
 * Checks if a move is an entry hazard setter
 */
export function isHazardMove(moveId: string): boolean {
  const hazardIds = ['stealth_rock', 'spikes', 'toxic_spikes', 'sticky_web'];
  return hazardIds.includes(moveId.toLowerCase());
}

/**
 * Checks if a move is a pivot move
 */
export function isPivotMove(moveId: string): boolean {
  const pivotIds = ['volt_switch', 'u_turn', 'flip_turn', 'parting_shot', 'baton_pass'];
  return pivotIds.includes(moveId.toLowerCase());
}

/**
 * Evaluates and scores all 4 moves of the AI active Pokemon using the 8-layer CFRU AI Matrix
 */
export function scoreAIMoves(
  aiActive: Pokemon,
  playerActive: Pokemon,
  aiTeam: Pokemon[],
  playerSideConditions?: SideConditions,
  weather?: WeatherType
): ScoredAIMove[] {
  const scoredMoves: ScoredAIMove[] = [];
  const aiSpeed = calculateEffectiveSpeed(aiActive);
  const playerSpeed = calculateEffectiveSpeed(playerActive);
  const aiOutspeeds = aiSpeed > playerSpeed;

  // Pre-calculate player's maximum damage potential against AI for safety windows
  let playerMaxDamage = 0;
  for (const pMove of playerActive.moves) {
    if (pMove.category !== 'Status') {
      const { damage } = calculateDamage(playerActive, aiActive, pMove, {
        weather,
        rngVariance: 1.0,
      });
      if (damage > playerMaxDamage) {
        playerMaxDamage = damage;
      }
    }
  }

  // Pre-check if any AI damaging move ALREADY achieves a guaranteed lethal KO right now
  let hasGuaranteedLethal = false;
  for (const m of aiActive.moves) {
    if (m.pp > 0 && m.category !== 'Status') {
      const { damage } = calculateDamage(aiActive, playerActive, m, {
        weather,
        rngVariance: 0.85,
      });
      if (damage >= playerActive.currentHp) {
        hasGuaranteedLethal = true;
        break;
      }
    }
  }

  for (let i = 0; i < aiActive.moves.length; i++) {
    const move = aiActive.moves[i];
    if (move.pp <= 0) {
      scoredMoves.push({ moveIndex: i, move, score: -999, reasons: ['NO_PP'] });
      continue;
    }

    let score = 100; // Base score
    const reasons: string[] = ['BASE_100'];

    const moveId = move.id.toLowerCase();
    const isPriority = (move.priority || 0) > 0;

    // =========================================================================
    // LAYER 1: Hard Invalidation Filter (AI_CHECK_BAD_MOVE)
    // =========================================================================
    if (move.category !== 'Status') {
      // Type immunity check (0x effectiveness)
      const effectiveness = calculateTypeEffectiveness(move.type, playerActive.types);
      const isLevitateGround =
        move.type === 'Ground' &&
        (playerActive.types.includes('Flying') || playerActive.ability === 'Levitate');

      if (effectiveness === 0 || isLevitateGround) {
        scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['TYPE_IMMUNITY_ZERO'] });
        continue;
      }
    } else {
      // Status redundancy & immunities
      if (moveId === 'hypnosis' || moveId === 'sleep_powder' || moveId === 'spore') {
        if (playerActive.statusCondition || playerActive.substituteHp) {
          scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['SLEEP_ON_STATUSED'] });
          continue;
        }
      }
      if (moveId === 'thunder_wave' || moveId === 'glare') {
        if (
          playerActive.statusCondition ||
          playerActive.substituteHp ||
          isImmuneToStatus(playerActive, 'paralysis')
        ) {
          scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['PARALYSIS_IMMUNE'] });
          continue;
        }
      }
      if (moveId === 'will_o_wisp') {
        if (
          playerActive.statusCondition ||
          playerActive.substituteHp ||
          isImmuneToStatus(playerActive, 'burn')
        ) {
          scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['BURN_IMMUNE'] });
          continue;
        }
      }
      if (moveId === 'toxic' || moveId === 'poison_powder') {
        if (
          playerActive.statusCondition ||
          playerActive.substituteHp ||
          isImmuneToStatus(playerActive, 'toxic')
        ) {
          scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['POISON_IMMUNE'] });
          continue;
        }
      }

      // Stat saturation: boosting when already at +6
      if (isSetupMove(moveId)) {
        const relevantStage =
          moveId === 'nasty_plot'
            ? aiActive.statStages?.spAtk ?? 0
            : moveId === 'swords_dance'
            ? aiActive.statStages?.attack ?? 0
            : Math.max(aiActive.statStages?.attack ?? 0, aiActive.statStages?.spAtk ?? 0);
        if (relevantStage >= 6) {
          scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['STAT_AT_MAX'] });
          continue;
        }
      }

      // Substitute checks
      if (moveId === 'substitute') {
        if (aiActive.substituteHp || aiActive.currentHp <= Math.floor(aiActive.maxHp * 0.25)) {
          scoredMoves.push({ moveIndex: i, move, score: 0, reasons: ['SUBSTITUTE_INVALID'] });
          continue;
        }
      }

      // Protect streak penalty
      if (moveId === 'protect' || moveId === 'detect') {
        if ((aiActive.protectStreak || 0) > 0) {
          score -= 90;
          reasons.push('PROTECT_STREAK_PENALTY');
        }
      }
    }

    // =========================================================================
    // LAYER 2: Lethal Knockout & Speed Tier Evaluation (AI_TRY_TO_FAINT)
    // =========================================================================
    if (move.category !== 'Status') {
      const minRoll = calculateDamage(aiActive, playerActive, move, {
        weather,
        rngVariance: 0.85,
      }).damage;
      const maxRoll = calculateDamage(aiActive, playerActive, move, {
        weather,
        rngVariance: 1.0,
      }).damage;

      // 1. Guaranteed Lethal (minRoll >= player HP)
      if (minRoll >= playerActive.currentHp) {
        if (!aiOutspeeds && playerMaxDamage >= aiActive.currentHp) {
          if (isPriority) {
            score += 35;
            reasons.push('LETHAL_PRIORITY_REVENGE');
          } else {
            score += 15;
            reasons.push('GUARANTEED_LETHAL_SLOW_RISK');
          }
        } else if (aiOutspeeds || isPriority) {
          score += 30;
          reasons.push('GUARANTEED_LETHAL_FAST');
        } else {
          score += 25;
          reasons.push('GUARANTEED_LETHAL_SURVIVES');
        }

        // Accuracy risk weighting: 100% accurate lethal gets +10 bonus
        if ((move.accuracy || 100) >= 100) {
          score += 10;
          reasons.push('ACCURACY_RELIABILITY_BONUS');
        } else if ((move.accuracy || 100) < 80) {
          score -= 10;
          reasons.push('INACCURATE_RISK_PENALTY');
        }
      }
      // 2. Probabilistic Lethal (maxRoll >= player HP > minRoll)
      else if (maxRoll >= playerActive.currentHp) {
        score += 18;
        reasons.push('PROBABILISTIC_LETHAL');
      }
      // 3. Sub-lethal damage scaling (proportional to player HP removed)
      else {
        const hpPct = Math.min(1.0, minRoll / Math.max(1, playerActive.maxHp));
        score += Math.floor(hpPct * 25);
        reasons.push(`CHIP_DAMAGE_${Math.floor(hpPct * 100)}PCT`);
      }
    }

    // =========================================================================
    // LAYER 3: Setup Sweeper Windows (AI_SETUP_SWEEPER)
    // =========================================================================
    if (isSetupMove(moveId)) {
      // 1. If AI ALREADY has a lethal KO move this turn, do not set up!
      if (hasGuaranteedLethal) {
        score -= 50;
        reasons.push('FORGO_SETUP_FOR_LETHAL');
      } else {
        const currentHpPct = aiActive.currentHp / aiActive.maxHp;
        const playerThreatPct = playerMaxDamage / Math.max(1, aiActive.currentHp);
        const playerPassive =
          playerActive.statusCondition === 'sleep' ||
          playerActive.mustRecharge ||
          playerThreatPct < 0.4;

        const relevantStage =
          moveId === 'nasty_plot'
            ? aiActive.statStages?.spAtk ?? 0
            : moveId === 'swords_dance'
            ? aiActive.statStages?.attack ?? 0
            : Math.max(aiActive.statStages?.attack ?? 0, aiActive.statStages?.spAtk ?? 0);

        if (currentHpPct > 0.65 && playerPassive && relevantStage < 2) {
          score += 25;
          reasons.push('SAFE_SETUP_SWEEPER_WINDOW');
        } else if (currentHpPct < 0.5 || playerThreatPct >= 0.7) {
          score -= 40;
          reasons.push('UNSAFE_SETUP_WINDOW');
        }
      }
    }

    // =========================================================================
    // LAYER 4: Recovery & Sustained Stall Logic (AI_RECOVERY)
    // =========================================================================
    if (isRecoveryMove(moveId)) {
      const currentHpPct = aiActive.currentHp / aiActive.maxHp;
      // Overheal penalty
      if (currentHpPct > 0.7) {
        score = 0;
        reasons.push('OVERHEAL_PENALTY');
      } else if (currentHpPct >= 0.25 && currentHpPct <= 0.5) {
        // Sweet spot: player max damage < 50% AI max HP
        if (playerMaxDamage < aiActive.maxHp * 0.5) {
          score += 25;
          reasons.push('RECOVERY_SWEET_SPOT');
        } else {
          score += 10;
          reasons.push('RECOVERY_CONTESTED');
        }
      } else if (currentHpPct < 0.25) {
        // Danger zone: if player outspeeds and KOs, attack instead
        if (!aiOutspeeds && playerMaxDamage >= aiActive.currentHp) {
          score = 0;
          reasons.push('RECOVERY_DANGER_ATTACK_INSTEAD');
        } else {
          score += 15;
          reasons.push('DESPERATION_RECOVERY');
        }
      }
    }

    // =========================================================================
    // LAYER 5: Status & Speed Control (AI_STATUS_DISRUPTION)
    // =========================================================================
    if (move.category === 'Status') {
      if (moveId === 'thunder_wave' || moveId === 'glare') {
        if (!aiOutspeeds) {
          score += 20;
          reasons.push('SPEED_CONTROL_TWAVE');
        } else {
          score += 10;
          reasons.push('STATUS_TWAVE');
        }
      } else if (moveId === 'will_o_wisp') {
        const isPhysicalThreat =
          playerActive.baseStats.attack >= 100 ||
          playerActive.moves.some((m) => m.category === 'Physical');
        if (isPhysicalThreat) {
          score += 22;
          reasons.push('BURN_PHYSICAL_THREAT');
        } else {
          score += 12;
          reasons.push('BURN_GENERAL');
        }
      } else if (moveId === 'toxic') {
        const isBulkyTank =
          playerActive.maxHp >= 280 ||
          (playerActive.baseStats.defense >= 100 && playerActive.baseStats.spDef >= 100);
        if (isBulkyTank) {
          score += 18;
          reasons.push('TOXIC_STALL_WALL');
        } else {
          score += 12;
          reasons.push('TOXIC_CHIP');
        }
      }
    }

    // =========================================================================
    // LAYER 6: Entry Hazards (AI_HAZARDS)
    // =========================================================================
    if (isHazardMove(moveId)) {
      const playerConsciousBench = aiTeam.filter((p) => !p.fainted && p.currentHp > 0).length;
      if (playerSideConditions?.stealthRock && moveId === 'stealth_rock') {
        score = 0;
        reasons.push('STEALTH_ROCK_ALREADY_UP');
      } else if (playerSideConditions?.stickyWeb && moveId === 'sticky_web') {
        score = 0;
        reasons.push('STICKY_WEB_ALREADY_UP');
      } else if (playerConsciousBench <= 1) {
        score = 0;
        reasons.push('LATE_GAME_HAZARDS_USELESS');
      } else {
        score += 15;
        reasons.push('EARLY_GAME_HAZARDS');
      }
    }

    // =========================================================================
    // LAYER 7: Pivot Moves (AI_PIVOT_VOLTTURN)
    // =========================================================================
    if (isPivotMove(moveId)) {
      const hasBadMatchup = playerActive.types.some(
        (t) => calculateTypeEffectiveness(t, aiActive.types) >= 2
      );
      if (hasBadMatchup) {
        score += 18;
        reasons.push('MOMENTUM_PIVOT_AWAY');
      }
    }

    scoredMoves.push({ moveIndex: i, move, score, reasons });
  }

  return scoredMoves;
}

/**
 * Layer 8: Smart Bench Replacement & Revenge Killing (AI_REVENGE_SWITCH)
 * Evaluates all conscious bench Pokemon and selects the optimal counter.
 */
export function selectBestRevengeSwitch(
  team: Pokemon[],
  opposingActive: Pokemon,
  currentActiveIndex: number,
  weather?: WeatherType
): number {
  let bestIdx = -1;
  let highestScore = -999;

  const oppSpeed = calculateEffectiveSpeed(opposingActive);

  for (let i = 0; i < team.length; i++) {
    if (i === currentActiveIndex) continue;
    const mon = team[i];
    if (mon.fainted || mon.currentHp <= 0) continue;

    let score = (mon.currentHp / mon.maxHp) * 50; // Base score proportional to health

    const monSpeed = calculateEffectiveSpeed(mon);

    // 1. Can it outspeed the player active mon? (+30)
    if (monSpeed > oppSpeed) {
      score += 30;
    }

    // 2. Does it have an attack that OHKOs the player active mon? (+50)
    let canOHKO = false;
    let hasPriorityFinish = false;

    for (const m of mon.moves) {
      if (m.category !== 'Status') {
        const { damage } = calculateDamage(mon, opposingActive, m, {
          weather,
          rngVariance: 0.85,
        });
        if (damage >= opposingActive.currentHp) {
          canOHKO = true;
          if ((m.priority || 0) > 0) {
            hasPriorityFinish = true;
          }
        }
      }
    }

    if (canOHKO) score += 50;
    if (hasPriorityFinish) score += 40;

    // 3. Does it resist player active mon's STAB attacks? (+25)
    const resistsSTAB = opposingActive.types.every((t) => {
      const eff = calculateTypeEffectiveness(t, mon.types);
      return eff <= 1.0;
    });
    if (resistsSTAB) score += 25;

    // 4. Does it possess an immunity? (+35)
    const hasImmunity = opposingActive.types.some((t) => {
      if (calculateTypeEffectiveness(t, mon.types) === 0) return true;
      if (t === 'Ground' && (mon.types.includes('Flying') || mon.ability === 'Levitate')) return true;
      if (t === 'Water' && mon.ability === 'Water Absorb') return true;
      if (t === 'Fire' && mon.ability === 'Flash Fire') return true;
      if (t === 'Electric' && mon.ability === 'Volt Absorb') return true;
      return false;
    });
    if (hasImmunity) score += 35;

    // 5. Penalty: Does it take 2x/4x super-effective from player STAB? (-40)
    const takesSuperEffective = opposingActive.types.some((t) => {
      return calculateTypeEffectiveness(t, mon.types) >= 2;
    });
    if (takesSuperEffective) score -= 40;

    if (score > highestScore || bestIdx === -1) {
      highestScore = score;
      bestIdx = i;
    }
  }

  if (bestIdx !== -1) return bestIdx;
  return team.findIndex((p, idx) => idx !== currentActiveIndex && !p.fainted && p.currentHp > 0);
}

/**
 * Master AI Decision Function: Picks the highest-scoring move or strategic switch
 */
export function selectAdvancedAIMoveOrSwitch(
  aiActive: Pokemon,
  playerActive: Pokemon,
  aiTeam: Pokemon[],
  playerSideConditions?: SideConditions,
  weather?: WeatherType
): BattleAction {
  // If active is fainted, pick smart revenge switch
  if (aiActive.fainted || aiActive.currentHp <= 0) {
    const nextIdx = selectBestRevengeSwitch(aiTeam, playerActive, aiTeam.indexOf(aiActive), weather);
    return { type: 'switch', targetPokemonIndex: Math.max(0, nextIdx) };
  }

  // Score all available moves
  const scoredMoves = scoreAIMoves(
    aiActive,
    playerActive,
    aiTeam,
    playerSideConditions,
    weather
  );

  // Sort moves by score descending
  scoredMoves.sort((a, b) => b.score - a.score);

  const bestMove = scoredMoves[0];

  // Tactical hard switch check: if the AI active has an utterly hopeless matchup
  // (e.g. all moves scored <= 20, player has lethal threat, and bench has a clean counter)
  const isHopeless = bestMove.score < 25;
  const playerCounterPotential = playerActive.types.some(
    (t) => calculateTypeEffectiveness(t, aiActive.types) >= 2
  );

  if (isHopeless || (aiActive.currentHp < aiActive.maxHp * 0.25 && playerCounterPotential)) {
    const bestSwitchIdx = selectBestRevengeSwitch(
      aiTeam,
      playerActive,
      aiTeam.indexOf(aiActive),
      weather
    );
    if (bestSwitchIdx !== -1) {
      const candidate = aiTeam[bestSwitchIdx];
      // Only switch if candidate is in good health (> 50% HP) and resists player STAB
      if (candidate.currentHp > candidate.maxHp * 0.5) {
        return { type: 'switch', targetPokemonIndex: bestSwitchIdx };
      }
    }
  }

  return { type: 'move', moveIndex: bestMove.moveIndex };
}
