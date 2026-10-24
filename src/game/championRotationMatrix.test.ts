/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Champion Rotation Matrix & Daily 3-Team Player Presets Test Suite
 * Reference: docs/CHAMPIONS_AND_E4_ROTATING_TEAMS_KB.md
 *            docs/REGIONAL_LEAGUES_GAUNTLET_KB.md (Section 7)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAMPION_ROTATION_MATRIX,
  getMonthlyChampionConfig,
  getDailyPlayerTeams,
  ChampionId,
  ConfigLetter,
} from './data/championRotationMatrix';
import { RegionId } from './data/regional/types';
import { initializeBattle } from './battleEngine';

const CHAMPION_IDS: ChampionId[] = ['cynthia', 'blue', 'lance', 'steven', 'iris'];
const EXPECTED_CONFIG_LETTERS: ConfigLetter[] = ['A', 'B', 'C', 'D', 'E'];
const REGIONS: RegionId[] = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova'];

test('Champion Rotation Matrix: 5 Champions have 5 canonical configurations each (25 total Level 100 teams)', () => {
  for (const champId of CHAMPION_IDS) {
    const configs = CHAMPION_ROTATION_MATRIX[champId];
    assert.ok(configs, `Champion matrix must contain entry for ${champId}`);
    assert.equal(configs.length, 5, `Champion ${champId} must have exactly 5 configurations`);

    const letters = configs.map((c) => c.configId);
    assert.deepEqual(letters, EXPECTED_CONFIG_LETTERS, `Champion ${champId} must have configs A through E in order`);

    for (const config of configs) {
      assert.ok(config.name.length > 0, `Config ${config.configId} of ${champId} must have a name`);
      assert.ok(config.seasonLabel.length > 0, `Config ${config.configId} of ${champId} must have a seasonLabel`);
      assert.ok(config.theme.length > 0, `Config ${config.configId} of ${champId} must have a theme`);
      assert.ok(config.playstyle.length > 0, `Config ${config.configId} of ${champId} must have a playstyle`);
      assert.equal(config.team.length, 6, `Config ${config.configId} of ${champId} must contain exactly 6 Pokémon`);
    }
  }
});

test('Champion Rotation Matrix: Every Pokémon across all 25 teams is fully validated with Level 100, held items, and 4 moves', () => {
  let totalMonsChecked = 0;

  for (const champId of CHAMPION_IDS) {
    for (const config of CHAMPION_ROTATION_MATRIX[champId]) {
      for (const mon of config.team) {
        totalMonsChecked++;
        assert.equal(mon.level, 100, `${mon.species} (${mon.id}) must be Level 100`);
        assert.ok(mon.maxHp > 0, `${mon.species} must have positive maxHp`);
        assert.ok(mon.baseStats.attack > 0, `${mon.species} must have positive attack`);
        assert.ok(mon.baseStats.defense > 0, `${mon.species} must have positive defense`);
        assert.ok(mon.baseStats.spAtk > 0, `${mon.species} must have positive spAtk`);
        assert.ok(mon.baseStats.spDef > 0, `${mon.species} must have positive spDef`);
        assert.ok(mon.baseStats.speed > 0, `${mon.species} must have positive speed`);

        assert.ok(mon.ability && mon.ability.length > 0, `${mon.species} must have an ability`);
        assert.ok(
          mon.heldItem && mon.heldItem.trim().length > 0,
          `${mon.species} in ${champId} config ${config.configId} must have a competitive held item`
        );
        assert.equal(mon.moves.length, 4, `${mon.species} (${mon.id}) must have exactly 4 moves`);

        for (const move of mon.moves) {
          assert.ok(move.name && move.name.length > 0, `Move on ${mon.species} must have a name`);
          assert.ok(move.pp > 0, `Move ${move.name} must have positive PP`);
          assert.ok(move.type, `Move ${move.name} must have a type`);
          assert.ok(move.category, `Move ${move.name} must have a category`);
        }
      }
    }
  }

  assert.equal(totalMonsChecked, 25 * 6, 'Total monsters validated across rotation matrix must be exactly 150');
});

test('Champion Rotation Matrix: getMonthlyChampionConfig returns deterministic configurations for date, month, and explicit letter', () => {
  for (const champId of CHAMPION_IDS) {
    // Explicit letter query
    for (const letter of EXPECTED_CONFIG_LETTERS) {
      const config = getMonthlyChampionConfig(champId, letter);
      assert.equal(config.configId, letter, `Explicit query '${letter}' must return Config ${letter} for ${champId}`);
    }

    // Explicit lowercase letter query
    const lowerConfig = getMonthlyChampionConfig(champId, 'b');
    assert.equal(lowerConfig.configId, 'B', 'Lowercase letter query must resolve case-insensitively');

    // Calendar month mapping
    // Month 0 (Jan) -> A
    // Month 1 (Feb) -> B
    // Month 2 (Mar) -> C
    // Month 3 (Apr) -> D
    // Month 4 (May) -> E
    // Month 5 (Jun) -> A
    const janDate = new Date(Date.UTC(2026, 0, 15));
    assert.equal(getMonthlyChampionConfig(champId, janDate).configId, 'A');

    const febDate = new Date(Date.UTC(2026, 1, 15));
    assert.equal(getMonthlyChampionConfig(champId, febDate).configId, 'B');

    const junDate = new Date(Date.UTC(2026, 5, 15));
    assert.equal(getMonthlyChampionConfig(champId, junDate).configId, 'A');

    // Seeded string query
    const seededConfig = getMonthlyChampionConfig(champId, '2026-10-20');
    assert.ok(EXPECTED_CONFIG_LETTERS.includes(seededConfig.configId));
  }
});

test('Daily 3-Team Player Presets: getDailyPlayerTeams returns exactly 3 strategy-tagged teams for every region', () => {
  for (const region of REGIONS) {
    const teams = getDailyPlayerTeams(region);
    assert.equal(teams.length, 3, `Region ${region} must have exactly 3 daily player presets`);

    const tags = teams.map((t) => t.strategyTag);
    assert.ok(tags.includes('SWEEP'), `${region} must feature a SWEEP preset`);
    assert.ok(tags.includes('BALANCE'), `${region} must feature a BALANCE preset`);
    assert.ok(tags.includes('STALL'), `${region} must feature a STALL preset`);

    for (const preset of teams) {
      assert.ok(preset.id.length > 0, `Preset must have an id`);
      assert.ok(preset.name.length > 0, `Preset ${preset.id} must have a name`);
      assert.ok(preset.tagline.length > 0, `Preset ${preset.id} must have a tagline`);
      assert.equal(preset.team.length, 6, `Preset ${preset.id} must have exactly 6 Pokémon`);

      for (const mon of preset.team) {
        assert.equal(mon.level, 100, `Player mon ${mon.species} in ${preset.id} must be Level 100`);
        assert.ok(
          mon.heldItem && mon.heldItem.trim().length > 0,
          `Player mon ${mon.species} in ${preset.id} must have a held item`
        );
        assert.equal(mon.moves.length, 4, `Player mon ${mon.species} in ${preset.id} must have 4 moves`);
      }
    }
  }
});

test('Battle Engine Integration: initializeBattle initializes matches against rotated Champion configurations and player presets', () => {
  // Test Blue Config A vs Kanto Player Team 1 (SWEEP)
  const kantoTeams = getDailyPlayerTeams('kanto');
  const blueConfigA = getMonthlyChampionConfig('blue', 'A');
  const stateKanto = initializeBattle(kantoTeams[0].team, blueConfigA.team);

  assert.equal(stateKanto.phase, 'action_select');
  assert.equal(stateKanto.turnNumber, 1);
  assert.equal(stateKanto.playerTeam.length, 6);
  assert.equal(stateKanto.opponentTeam.length, 6);
  assert.equal(stateKanto.playerActiveIndex, 0);
  assert.equal(stateKanto.opponentActiveIndex, 0);
  assert.ok(stateKanto.playerTeam[0].currentHp > 0);
  assert.ok(stateKanto.opponentTeam[0].currentHp > 0);

  // Test Lance Config B vs Johto Player Team 2 (BALANCE)
  const johtoTeams = getDailyPlayerTeams('johto');
  const lanceConfigB = getMonthlyChampionConfig('lance', 'B');
  const stateJohto = initializeBattle(johtoTeams[1].team, lanceConfigB.team);

  assert.equal(stateJohto.phase, 'action_select');
  assert.equal(stateJohto.playerTeam[0].moves.length, 4);
  assert.equal(stateJohto.opponentTeam[0].moves.length, 4);

  // Test Steven Config C vs Hoenn Player Team 3 (STALL)
  const hoennTeams = getDailyPlayerTeams('hoenn');
  const stevenConfigC = getMonthlyChampionConfig('steven', 'C');
  const stateHoenn = initializeBattle(hoennTeams[2].team, stevenConfigC.team);

  assert.equal(stateHoenn.phase, 'action_select');
  assert.equal(stateHoenn.opponentTeam[0].species, 'Archeops');

  // Test Cynthia Config D vs Sinnoh Player Team 1 (SWEEP)
  const sinnohTeams = getDailyPlayerTeams('sinnoh');
  const cynthiaConfigD = getMonthlyChampionConfig('cynthia', 'D');
  const stateSinnoh = initializeBattle(sinnohTeams[0].team, cynthiaConfigD.team);

  assert.equal(stateSinnoh.phase, 'action_select');
  assert.equal(stateSinnoh.opponentTeam[0].species, 'Glaceon');

  // Test Iris Config E vs Unova Player Team 2 (BALANCE)
  const unovaTeams = getDailyPlayerTeams('unova');
  const irisConfigE = getMonthlyChampionConfig('iris', 'E');
  const stateUnova = initializeBattle(unovaTeams[1].team, irisConfigE.team);

  assert.equal(stateUnova.phase, 'action_select');
  assert.equal(stateUnova.opponentTeam[0].species, 'Hydreigon');
});
