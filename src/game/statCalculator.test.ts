/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Pokemon } from './types';
import {
  getPokemonStatDisplayList,
  getAccuracyEvasionDisplay,
  getAccuracyEvasionMultiplier,
} from './statCalculator';

function createDummyMon(overrides?: Partial<Pokemon>): Pokemon {
  return {
    id: 'test_mon',
    species: 'Garchomp',
    nationalDex: 445,
    types: ['Dragon', 'Ground'],
    level: 100,
    currentHp: 357,
    maxHp: 357,
    baseStats: {
      hp: 357,
      attack: 130,
      defense: 95,
      spAtk: 80,
      spDef: 85,
      speed: 102,
    },
    spriteFront: '',
    spriteBack: '',
    ability: 'Rough Skin',
    abilityDescription: 'Inflicts damage to the attacker on contact.',
    moves: [],
    fainted: false,
    ...overrides,
  };
}

test('getPokemonStatDisplayList returns base stats when no stages are modified', () => {
  const mon = createDummyMon();
  const stats = getPokemonStatDisplayList(mon);

  assert.equal(stats.length, 6);
  assert.equal(stats[0].key, 'hp');
  assert.equal(stats[0].effectiveVal, 357);

  const atk = stats.find((s) => s.key === 'attack')!;
  assert.equal(atk.effectiveVal, 130);
  assert.equal(atk.stage, 0);
  assert.equal(atk.isBoosted, false);
  assert.equal(atk.isReduced, false);
});

test('getPokemonStatDisplayList calculates Swords Dance (+2) boost accurately', () => {
  const mon = createDummyMon({
    statStages: {
      attack: 2,
      defense: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0,
    },
  });
  const stats = getPokemonStatDisplayList(mon);
  const atk = stats.find((s) => s.key === 'attack')!;

  // Gen 3 formula: (2 + 2) / 2 = 2.0x -> 130 * 2 = 260
  assert.equal(atk.effectiveVal, 260);
  assert.equal(atk.stage, 2);
  assert.equal(atk.isBoosted, true);
  assert.equal(atk.isReduced, false);
  assert.ok(atk.multiplierText.includes('2.0'));
});

test('getPokemonStatDisplayList calculates stat drop (-1 stage) accurately', () => {
  const mon = createDummyMon({
    statStages: {
      attack: 0,
      defense: -1,
      spAtk: 0,
      spDef: 0,
      speed: 0,
    },
  });
  const stats = getPokemonStatDisplayList(mon);
  const def = stats.find((s) => s.key === 'defense')!;

  // Gen 3 formula: 2 / (2 - (-1)) = 2/3 = 0.67x -> floor(95 * (2/3)) = 63
  assert.equal(def.effectiveVal, 63);
  assert.equal(def.stage, -1);
  assert.equal(def.isBoosted, false);
  assert.equal(def.isReduced, true);
});

test('getPokemonStatDisplayList applies paralysis speed cut (0.5x)', () => {
  const mon = createDummyMon({
    statusCondition: 'paralysis',
    statStages: {
      attack: 0,
      defense: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0,
    },
  });
  const stats = getPokemonStatDisplayList(mon);
  const spd = stats.find((s) => s.key === 'speed')!;

  // 102 * 0.5 = 51
  assert.equal(spd.effectiveVal, 51);
  assert.equal(spd.isParalyzed, true);
  assert.equal(spd.isReduced, true);
  assert.ok(spd.multiplierText.includes('PRZ'));
});

test('getAccuracyEvasionDisplay detects battle modifiers', () => {
  const neutralMon = createDummyMon();
  const neutralDisplay = getAccuracyEvasionDisplay(neutralMon);
  assert.equal(neutralDisplay.hasModifications, false);

  const modifiedMon = createDummyMon({
    statStages: {
      attack: 0,
      defense: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0,
      accuracy: -1,
      evasion: 1,
    },
  });
  const modDisplay = getAccuracyEvasionDisplay(modifiedMon);
  assert.equal(modDisplay.hasModifications, true);
  assert.equal(modDisplay.accuracyStage, -1);
  assert.equal(modDisplay.evasionStage, 1);
  // -1 accuracy: 3 / 4 = 75%
  assert.ok(modDisplay.accuracyMultiplierText.includes('75%'));
  // +1 evasion: 4 / 3 = 133%
  assert.ok(modDisplay.evasionMultiplierText.includes('133%'));
});
