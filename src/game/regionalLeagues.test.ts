/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regional Leagues & Elite Four Gauntlet Dataset Test Suite
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REGIONAL_LEAGUES,
  getRegionalLeague,
  RegionId,
  KANTO_LEAGUE,
  JOHTO_LEAGUE,
  HOENN_LEAGUE,
  SINNOH_LEAGUE,
  UNOVA_LEAGUE,
} from './data/regionalLeaguesKB';
import {
  CYNTHIA_ROTATING_CONFIGS,
  getCynthiaRotatingTeam,
  CynthiaConfigId,
  DAILY_ROSTER_POOL,
  BEGINNER_TEAMS,
} from './data/teams';

const REGIONS: RegionId[] = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova'];

test('Regional Leagues: All 5 regions are fully populated and accessible', () => {
  for (const region of REGIONS) {
    const league = REGIONAL_LEAGUES[region];
    assert.ok(league, `Region ${region} must be defined in REGIONAL_LEAGUES`);
    assert.equal(league.regionId, region);
    assert.ok(league.regionName.length > 0);
    assert.ok(league.leagueName.length > 0);
    assert.ok(league.championName.length > 0);
    assert.ok(league.championTitle.length > 0);
  }
});

test('Regional Leagues: getRegionalLeague returns requested region and safely falls back', () => {
  const kanto = getRegionalLeague('kanto');
  assert.equal(kanto.championName, 'Blue');

  const sinnoh = getRegionalLeague('sinnoh');
  assert.equal(sinnoh.championName, 'Cynthia');

  const fallback = getRegionalLeague('unknown_region' as any);
  assert.ok(fallback.championName === 'Cynthia' || fallback.championName === 'Blue');
});

test('Regional Leagues: Every region has exactly 4 Elite Four members with 5-mon Level 100 rosters', () => {
  for (const region of REGIONS) {
    const league = REGIONAL_LEAGUES[region];
    assert.equal(league.eliteFour.length, 4, `${region} must have exactly 4 Elite Four members`);

    for (const e4 of league.eliteFour) {
      assert.ok(e4.id.length > 0, 'E4 member must have id');
      assert.ok(e4.name.length > 0, 'E4 member must have name');
      assert.ok(e4.specialty.length > 0, 'E4 member must have specialty');
      assert.equal(e4.roster.length, 5, `${e4.name} in ${region} must have exactly 5 Pokémon`);

      for (const mon of e4.roster) {
        assert.equal(mon.level, 100, `${mon.species} must be Level 100`);
        assert.ok(mon.nationalDex >= 1 && mon.nationalDex <= 649, `${mon.species} must have valid Dex (1-649)`);
        assert.equal(mon.moves.length, 4, `${mon.species} must have exactly 4 moves`);
        assert.ok(mon.ability.length > 0, `${mon.species} must have an ability`);
        assert.ok(mon.heldItem && mon.heldItem.length > 0, `${mon.species} (${e4.name}) must have a held item`);
        assert.ok(mon.maxHp > 200, `${mon.species} HP must be calculated`);
        assert.ok(mon.spriteFront.includes('.gif'), `${mon.species} front sprite must be animated GIF`);
        assert.ok(mon.spriteBack.includes('.gif'), `${mon.species} back sprite must be animated GIF`);
      }
    }
  }
});

test('Regional Leagues: Every Champion has a 6-mon competitive Level 100 roster with held items', () => {
  const expectedChampions: Record<RegionId, string> = {
    kanto: 'Blue',
    johto: 'Lance',
    hoenn: 'Steven Stone',
    sinnoh: 'Cynthia',
    unova: 'Iris',
  };

  for (const region of REGIONS) {
    const league = REGIONAL_LEAGUES[region];
    assert.equal(league.championName, expectedChampions[region]);
    assert.equal(league.championRoster.length, 6, `${league.championName} must have exactly 6 Pokémon`);

    for (const mon of league.championRoster) {
      assert.equal(mon.level, 100, `${mon.species} must be Level 100`);
      assert.ok(mon.nationalDex >= 1 && mon.nationalDex <= 649, `${mon.species} must have valid Dex (1-649)`);
      assert.equal(mon.moves.length, 4, `${mon.species} must have 4 moves`);
      assert.ok(mon.ability.length > 0, `${mon.species} must have an ability`);
      assert.ok(mon.heldItem && mon.heldItem.length > 0, `${mon.species} (${league.championName}) must have a held item`);
      assert.ok(mon.maxHp > 200);
    }
  }
});

test('Regional Leagues: Daily Player Teams have exactly 3 strategy-tagged 6-mon teams per region with held items', () => {
  const expectedTags = ['SWEEP', 'BALANCE', 'STALL'];

  for (const region of REGIONS) {
    const league = REGIONAL_LEAGUES[region];
    assert.equal(league.dailyPlayerTeams.length, 3, `${region} must have exactly 3 daily player teams`);

    const tags = league.dailyPlayerTeams.map((t) => t.strategyTag);
    assert.deepEqual(tags.sort(), expectedTags.slice().sort(), `${region} must feature SWEEP, BALANCE, and STALL teams`);

    for (const team of league.dailyPlayerTeams) {
      assert.equal(team.team.length, 6, `${team.name} must have 6 Pokémon`);
      assert.ok(team.recommendedLead.length > 0, `${team.name} must designate a recommended lead`);
      assert.ok(team.description.length > 0);

      for (const mon of team.team) {
        assert.equal(mon.level, 100);
        assert.equal(mon.moves.length, 4);
        assert.ok(mon.heldItem && mon.heldItem.length > 0, `${mon.species} on ${team.name} must have a held item`);
      }
    }
  }
});

test('Regional Leagues: Move mechanics enrichment correctly maps PP and secondary effects across rosters', () => {
  const garchomp = SINNOH_LEAGUE.championRoster.find((m) => m.species === 'Garchomp');
  assert.ok(garchomp);
  const swordsDance = garchomp.moves.find((m) => m.id === 'swords_dance');
  assert.ok(swordsDance);
  assert.equal(swordsDance.statChange?.stages, 2, 'Swords Dance must boost Attack by +2');

  const cloyster = KANTO_LEAGUE.eliteFour[0].roster.find((m) => m.species === 'Cloyster');
  assert.ok(cloyster);
  const icicleSpear = cloyster.moves.find((m) => m.id === 'icicle_spear');
  assert.ok(icicleSpear);
  assert.deepEqual(icicleSpear.multiHit, [2, 5], 'Icicle Spear must have multiHit [2, 5]');

  const throh = UNOVA_LEAGUE.eliteFour[3].roster.find((m) => m.species === 'Throh');
  assert.ok(throh);
  const stormThrow = throh.moves.find((m) => m.id === 'storm_throw');
  assert.ok(stormThrow);
  assert.equal(stormThrow.critRatioBonus, 3, 'Storm Throw must have critRatioBonus: 3');
});

test('Champion Cynthia: All 5 canonical rotating team configurations are fully implemented and valid', () => {
  const expectedConfigs: CynthiaConfigId[] = ['config_a', 'config_b', 'config_c', 'config_d', 'config_e'];

  for (const configId of expectedConfigs) {
    const config = CYNTHIA_ROTATING_CONFIGS[configId];
    assert.ok(config, `Cynthia configuration ${configId} must exist`);
    assert.ok(config.name.length > 0);
    assert.ok(config.theme.length > 0);
    assert.ok(config.playstyle.length > 0);
    assert.equal(config.roster.length, 6, `${config.name} must have exactly 6 Pokémon`);

    for (const mon of config.roster) {
      assert.equal(mon.level, 100, `${mon.species} in ${config.name} must be Lv. 100`);
      assert.equal(mon.moves.length, 4, `${mon.species} in ${config.name} must have 4 moves`);
      assert.ok(mon.heldItem && mon.heldItem.length > 0, `${mon.species} in ${config.name} must have held item`);
      assert.ok(mon.ability.length > 0, `${mon.species} must have ability`);
      assert.ok(mon.maxHp > 200, `${mon.species} must have valid HP`);
    }
  }

  // Verify unique key species per canonical variant
  const dpClassic = CYNTHIA_ROTATING_CONFIGS.config_b.roster;
  assert.ok(dpClassic.some((m) => m.species === 'Gastrodon'), 'Config B must include Gastrodon');

  const undella = CYNTHIA_ROTATING_CONFIGS.config_c.roster;
  assert.ok(undella.some((m) => m.species === 'Eelektross'), 'Config C must include Eelektross');
  assert.ok(undella.some((m) => m.species === 'Braviary'), 'Config C must include Braviary');

  const pwt = CYNTHIA_ROTATING_CONFIGS.config_d.roster;
  assert.ok(pwt.some((m) => m.species === 'Glaceon'), 'Config D must include Glaceon lead');

  const sandVeil = CYNTHIA_ROTATING_CONFIGS.config_e.roster;
  assert.ok(sandVeil.some((m) => m.species === 'Hippowdon'), 'Config E must include Hippowdon lead');
});

test('Champion Cynthia: getCynthiaRotatingTeam safely resolves explicit configs and deterministic daily dates', () => {
  const configB = getCynthiaRotatingTeam('config_b');
  assert.ok(configB.some((m) => m.species === 'Gastrodon'));

  const dateTeam1 = getCynthiaRotatingTeam('2026-10-20');
  assert.equal(dateTeam1.length, 6);

  const dateTeam2 = getCynthiaRotatingTeam('2026-10-20');
  assert.equal(dateTeam1[0].species, dateTeam2[0].species, 'Same date must deterministically return identical team');

  const defaultTeam = getCynthiaRotatingTeam();
  assert.equal(defaultTeam.length, 6);
  assert.equal(defaultTeam[0].species, 'Spiritomb');
});

test('Daily Pool & Player Teams: Every Pokémon across all player pools has a competitive held item', () => {
  // 1. Daily Roster Pool
  assert.ok(DAILY_ROSTER_POOL.length >= 8, 'DAILY_ROSTER_POOL must have at least 8 candidates');
  for (const mon of DAILY_ROSTER_POOL) {
    assert.ok(
      mon.heldItem && mon.heldItem.length > 0,
      `DAILY_ROSTER_POOL ${mon.species} must have a held item`
    );
  }

  // 2. Beginner / Preset Teams
  assert.equal(BEGINNER_TEAMS.length, 4, 'BEGINNER_TEAMS must have daily six + 3 curated presets');
  for (const preset of BEGINNER_TEAMS) {
    assert.ok(
      preset.strategyTag === 'SWEEP' || preset.strategyTag === 'BALANCE' || preset.strategyTag === 'STALL',
      `${preset.name} must have valid strategyTag ('SWEEP' | 'BALANCE' | 'STALL')`
    );
    assert.equal(preset.team.length, 6, `${preset.name} must have 6 Pokémon`);
    for (const mon of preset.team) {
      assert.ok(
        mon.heldItem && mon.heldItem.length > 0,
        `${mon.species} on ${preset.name} must have a held item`
      );
    }
  }
});

