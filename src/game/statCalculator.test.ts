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

test('getPokemonStatDisplayList calculates held item stat boosts (Choice Band, Specs, Scarf, Vest, Eviolite)', () => {
  // Choice Band
  const bandMon = createDummyMon({ heldItem: 'Choice Band' });
  const bandStats = getPokemonStatDisplayList(bandMon);
  const bandAtk = bandStats.find((s) => s.key === 'attack')!;
  assert.equal(bandAtk.effectiveVal, Math.floor(130 * 1.5));
  assert.equal(bandAtk.isBoosted, true);
  assert.ok(bandAtk.multiplierText.includes('Band ×1.5'));

  // Choice Specs
  const specsMon = createDummyMon({ heldItem: 'Choice Specs' });
  const specsStats = getPokemonStatDisplayList(specsMon);
  const specsSpA = specsStats.find((s) => s.key === 'spAtk')!;
  assert.equal(specsSpA.effectiveVal, Math.floor(80 * 1.5));
  assert.equal(specsSpA.isBoosted, true);
  assert.ok(specsSpA.multiplierText.includes('Specs ×1.5'));

  // Choice Scarf
  const scarfMon = createDummyMon({ heldItem: 'Choice Scarf' });
  const scarfStats = getPokemonStatDisplayList(scarfMon);
  const scarfSpe = scarfStats.find((s) => s.key === 'speed')!;
  assert.equal(scarfSpe.effectiveVal, Math.floor(102 * 1.5));
  assert.equal(scarfSpe.isBoosted, true);
  assert.ok(scarfSpe.multiplierText.includes('Scarf ×1.5'));

  // Assault Vest
  const vestMon = createDummyMon({ heldItem: 'Assault Vest' });
  const vestStats = getPokemonStatDisplayList(vestMon);
  const vestSpD = vestStats.find((s) => s.key === 'spDef')!;
  assert.equal(vestSpD.effectiveVal, Math.floor(85 * 1.5));
  assert.equal(vestSpD.isBoosted, true);
  assert.ok(vestSpD.multiplierText.includes('Vest ×1.5'));

  // Eviolite
  const evioliteMon = createDummyMon({ heldItem: 'Eviolite' });
  const evioliteStats = getPokemonStatDisplayList(evioliteMon);
  const evDef = evioliteStats.find((s) => s.key === 'defense')!;
  const evSpD = evioliteStats.find((s) => s.key === 'spDef')!;
  assert.equal(evDef.effectiveVal, Math.floor(95 * 1.5));
  assert.equal(evSpD.effectiveVal, Math.floor(85 * 1.5));
  assert.ok(evDef.multiplierText.includes('Eviolite ×1.5'));
  assert.ok(evSpD.multiplierText.includes('Eviolite ×1.5'));
});
