/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pokemon, StatKey } from './types';
import { getStatStageMultiplier, calculateEffectiveStat, calculateEffectiveSpeed } from './battleEngine';

export interface FormattedStatDisplay {
  key: StatKey;
  label: string;
  baseVal: number;
  effectiveVal: number;
  stage: number;
  multiplierText: string;
  isBoosted: boolean;
  isReduced: boolean;
  isParalyzed?: boolean;
}

export interface AccuracyEvasionDisplay {
  accuracyStage: number;
  accuracyMultiplierText: string;
  evasionStage: number;
  evasionMultiplierText: string;
  hasModifications: boolean;
}

/**
 * Calculates Gen 3 Accuracy/Evasion Multiplier
 * Positive: (3 + stage) / 3
 * Negative: 3 / (3 - stage)
 */
export function getAccuracyEvasionMultiplier(stage = 0): number {
  const clamped = Math.max(-6, Math.min(6, stage));
  if (clamped >= 0) return (3 + clamped) / 3;
  return 3 / (3 - clamped);
}

/**
 * Returns formatted stat display records for all 6 core Pokemon stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
 * reflecting active in-battle stage modifiers (-6 to +6) and status effects (paralysis).
 */
export function getPokemonStatDisplayList(mon: Pokemon): FormattedStatDisplay[] {
  const stages = mon.statStages || {
    attack: 0,
    defense: 0,
    spAtk: 0,
    spDef: 0,
    speed: 0,
  };

  const isPrz = mon.statusCondition === 'paralysis';

  // HP
  const hpDisplay: FormattedStatDisplay = {
    key: 'hp',
    label: 'HP',
    baseVal: mon.baseStats.hp,
    effectiveVal: mon.currentHp,
    stage: 0,
    multiplierText: `${mon.currentHp}/${mon.maxHp}`,
    isBoosted: false,
    isReduced: mon.currentHp < mon.maxHp * 0.2,
  };

  // 5 Combat stats
  const combatStats: Array<{ key: StatKey; label: string }> = [
    { key: 'attack', label: 'ATTACK' },
    { key: 'defense', label: 'DEFENSE' },
    { key: 'spAtk', label: 'SP. ATK' },
    { key: 'spDef', label: 'SP. DEF' },
    { key: 'speed', label: 'SPEED' },
  ];

  const results: FormattedStatDisplay[] = [hpDisplay];

  for (const item of combatStats) {
    const key = item.key;
    const base = mon.baseStats[key as 'attack' | 'defense' | 'spAtk' | 'spDef' | 'speed'];
    const stage = stages[key as 'attack' | 'defense' | 'spAtk' | 'spDef' | 'speed'] ?? 0;
    const mult = getStatStageMultiplier(stage);

    let effective = Math.max(1, Math.floor(base * mult));
    const isParalyzedSpeed = key === 'speed' && isPrz;

    if (isParalyzedSpeed) {
      effective = Math.max(1, Math.floor(effective * 0.5));
    }

    const isBoosted = stage > 0;
    const isReduced = stage < 0 || isParalyzedSpeed;

    let multiplierText = `Base: ${base}`;
    if (stage !== 0) {
      const multStr = mult.toFixed(mult % 1 === 0 ? 1 : 2);
      multiplierText = `Base: ${base} × ${multStr}`;
    }
    if (isParalyzedSpeed) {
      multiplierText += ' [PRZ ×0.5]';
    }

    results.push({
      key,
      label: item.label,
      baseVal: base,
      effectiveVal: effective,
      stage,
      multiplierText,
      isBoosted,
      isReduced,
      isParalyzed: isParalyzedSpeed,
    });
  }

  return results;
}

/**
 * Returns formatted accuracy and evasion stage modifiers if altered in battle
 */
export function getAccuracyEvasionDisplay(mon: Pokemon): AccuracyEvasionDisplay {
  const accStage = mon.statStages?.accuracy ?? 0;
  const evaStage = mon.statStages?.evasion ?? 0;

  const accMult = getAccuracyEvasionMultiplier(accStage);
  const evaMult = getAccuracyEvasionMultiplier(evaStage);

  const accPct = Math.round(accMult * 100);
  const evaPct = Math.round(evaMult * 100);

  return {
    accuracyStage: accStage,
    accuracyMultiplierText: accStage === 0 ? '100%' : `${accStage > 0 ? '+' : ''}${accStage} (${accPct}%)`,
    evasionStage: evaStage,
    evasionMultiplierText: evaStage === 0 ? '100%' : `${evaStage > 0 ? '+' : ''}${evaStage} (${evaPct}%)`,
    hasModifications: accStage !== 0 || evaStage !== 0,
  };
}
