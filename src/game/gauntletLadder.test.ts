/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  KANTO_GAUNTLET_STAGES,
  getGauntletStage,
  DAILY_CYNTHIA_PREVIEW,
} from './data/gauntletLadder';
import { initializeBattle } from './battleEngine';
import { BEGINNER_TEAMS } from './constants';

describe('Gauntlet Run State Machine & Opponent Ladders', () => {
  test('Kanto Gauntlet has exactly 5 stages ending with Champion Blue', () => {
    assert.equal(KANTO_GAUNTLET_STAGES.length, 5);
    assert.equal(KANTO_GAUNTLET_STAGES[0].stageNumber, 1);
    assert.equal(KANTO_GAUNTLET_STAGES[0].preview.name, 'LORELEI');
    assert.equal(KANTO_GAUNTLET_STAGES[0].isFinalStage, false);

    assert.equal(KANTO_GAUNTLET_STAGES[1].stageNumber, 2);
    assert.equal(KANTO_GAUNTLET_STAGES[1].preview.name, 'BRUNO');
    assert.equal(KANTO_GAUNTLET_STAGES[1].isFinalStage, false);

    assert.equal(KANTO_GAUNTLET_STAGES[2].stageNumber, 3);
    assert.equal(KANTO_GAUNTLET_STAGES[2].preview.name, 'AGATHA');
    assert.equal(KANTO_GAUNTLET_STAGES[2].isFinalStage, false);

    assert.equal(KANTO_GAUNTLET_STAGES[3].stageNumber, 4);
    assert.equal(KANTO_GAUNTLET_STAGES[3].preview.name, 'LANCE');
    assert.equal(KANTO_GAUNTLET_STAGES[3].isFinalStage, false);

    assert.equal(KANTO_GAUNTLET_STAGES[4].stageNumber, 5);
    assert.equal(KANTO_GAUNTLET_STAGES[4].preview.name, 'CHAMPION BLUE');
    assert.equal(KANTO_GAUNTLET_STAGES[4].isFinalStage, true);
  });

  test('Every stage has verified sprites, lead Pokémon info, and competitive rosters', () => {
    KANTO_GAUNTLET_STAGES.forEach((stage, idx) => {
      assert.ok(stage.preview.name, `Stage ${idx + 1} has name`);
      assert.ok(stage.preview.spriteUrl, `Stage ${idx + 1} has spriteUrl`);
      assert.ok(stage.preview.quote, `Stage ${idx + 1} has quote`);
      assert.ok(stage.preview.leadPokemonName, `Stage ${idx + 1} has lead Pokemon`);
      assert.ok(stage.preview.leadPokemonDex > 0, `Stage ${idx + 1} has valid Dex`);
      assert.ok(stage.roster.length >= 5, `Stage ${idx + 1} has at least 5 Pokémon`);

      // Verify battle engine can cleanly initialize matches against this stage
      const battle = initializeBattle(BEGINNER_TEAMS[0].team, stage.roster);
      assert.equal(battle.opponentTeam.length, stage.roster.length);
      assert.equal(battle.phase, 'action_select');
      assert.equal(battle.winner, undefined);
    });
  });

  test('getGauntletStage safely clamps out-of-bounds indices', () => {
    const stage0 = getGauntletStage(0);
    assert.equal(stage0.preview.name, 'LORELEI');

    const stageNeg = getGauntletStage(-99);
    assert.equal(stageNeg.preview.name, 'LORELEI');

    const stage4 = getGauntletStage(4);
    assert.equal(stage4.preview.name, 'CHAMPION BLUE');

    const stageHuge = getGauntletStage(999);
    assert.equal(stageHuge.preview.name, 'CHAMPION BLUE');
  });

  test('Daily Cynthia preview is fully configured', () => {
    assert.equal(DAILY_CYNTHIA_PREVIEW.name, 'CYNTHIA');
    assert.equal(DAILY_CYNTHIA_PREVIEW.leadPokemonName, 'Spiritomb');
    assert.equal(DAILY_CYNTHIA_PREVIEW.leadPokemonDex, 442);
    assert.equal(DAILY_CYNTHIA_PREVIEW.spriteUrl, '/sprites/trainers/cynthia_battle.png');
  });
});
