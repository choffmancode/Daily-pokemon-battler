/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTypeEffectiveness, calculateDamage, executeBattleTurn, initializeBattle } from './battleEngine.ts';
import { getDailyPackCooldown, openBoosterPack, DEFAULT_USER_INVENTORY, equipCosmetic, equipTrainerBase } from './gachaEngine.ts';
import { BEGINNER_TEAMS, CHAMPION_RED_TEAM, COSMETIC_CARDS_CATALOG } from './constants.ts';

test('type effectiveness accurately matches Pokémon mechanics', () => {
  // Fire vs Grass -> 2x
  assert.equal(calculateTypeEffectiveness('Fire', ['Grass']), 2);
  // Water vs Fire -> 2x
  assert.equal(calculateTypeEffectiveness('Water', ['Fire']), 2);
  // Electric vs Ground -> 0x (Immune)
  assert.equal(calculateTypeEffectiveness('Electric', ['Ground']), 0);
  // Normal vs Ghost -> 0x (Immune)
  assert.equal(calculateTypeEffectiveness('Normal', ['Ghost']), 0);
  // Water vs Fire/Flying (Charizard) -> 2x
  assert.equal(calculateTypeEffectiveness('Water', ['Fire', 'Flying']), 2);
  // Rock vs Fire/Flying (Charizard) -> 4x double weakness!
  assert.equal(calculateTypeEffectiveness('Rock', ['Fire', 'Flying']), 4);
});

test('damage calculation applies STAB, type multiplier, and defense ratio', () => {
  const charizard = CHAMPION_RED_TEAM.find(p => p.species === 'Charizard')!;
  const venusaur = CHAMPION_RED_TEAM.find(p => p.species === 'Venusaur')!;
  const flamethrower = charizard.moves.find(m => m.id === 'flamethrower')!;

  // Charizard using Flamethrower on Venusaur (STAB 1.5x, Super Effective 2x against Grass)
  const result = calculateDamage(charizard, venusaur, flamethrower, { rngVariance: 1.0, forceCrit: false });
  assert.ok(result.damage > 200, `Damage ${result.damage} should exceed 200 for STAB 2x special fire blast`);
  assert.equal(result.effectiveness, 2);

  // Status moves deal 0 damage
  const calmMind = CHAMPION_RED_TEAM.find(p => p.species === 'Espeon')!.moves.find(m => m.id === 'calm_mind')!;
  const statusResult = calculateDamage(charizard, venusaur, calmMind);
  assert.equal(statusResult.damage, 0);
});

test('battle turn execution updates HP and logs actions', () => {
  const kantoTeam = BEGINNER_TEAMS[0].team;
  const state = initializeBattle(kantoTeam, CHAMPION_RED_TEAM);

  assert.equal(state.turnNumber, 1);
  assert.equal(state.weather, 'Hail');
  assert.ok(state.playerTeam.length === 6);
  assert.ok(state.opponentTeam.length === 6);

  // Player attacks with Thunderbolt
  const nextState = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 }
  );

  assert.equal(nextState.turnNumber, 2);
  assert.ok(nextState.combatLog.length > 4);
});

test('fainted Pokemon cannot attack back on the same turn', () => {
  const kantoTeam = BEGINNER_TEAMS[0].team;
  const state = initializeBattle(kantoTeam, CHAMPION_RED_TEAM);

  // Set opponent active Pikachu HP to 1 so any attack knocks it out
  state.opponentTeam[0].currentHp = 1;
  const playerInitialHp = state.playerTeam[0].currentHp;

  // Player attacks and KOs opponent
  const nextState = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 }
  );

  // Opponent should be fainted
  assert.equal(nextState.opponentTeam[0].fainted, true);
  assert.equal(nextState.opponentTeam[0].currentHp, 0);

  // Player must NOT take damage from the opponent who fainted before moving
  const hailDmg = Math.floor(state.playerTeam[0].maxHp / 16);
  assert.equal(nextState.playerTeam[0].currentHp, playerInitialHp - hailDmg);

  // Protocol log should record faint before any opponent move
  assert.ok(nextState.protocolLog?.some((l) => l.startsWith('|faint|p2a:')));
  const faintIndex = nextState.protocolLog!.findIndex((l) => l.startsWith('|faint|p2a:'));
  const oppMoveAfterFaint = nextState.protocolLog!.slice(faintIndex + 1).some((l) => l.startsWith('|move|p2a:'));
  assert.equal(oppMoveAfterFaint, false, 'Opponent must not attack after fainting');
});

test('daily pack cooldown calculates properly', () => {
  // Claimed just now -> cooldown active
  const justNow = Date.now();
  const res1 = getDailyPackCooldown(justNow);
  assert.equal(res1.isAvailable, false);
  assert.ok(res1.remainingMs > 0);

  // Claimed 25 hours ago -> available
  const yesterday = Date.now() - 25 * 60 * 60 * 1000;
  const res2 = getDailyPackCooldown(yesterday);
  assert.equal(res2.isAvailable, true);
  assert.equal(res2.formattedTime, 'Ready Now!');
});

test('gacha booster pack opens 3 collectible cards and deducts 1 pack', () => {
  const testInv = {
    ...DEFAULT_USER_INVENTORY,
    availablePacks: 2,
    unlockedCardIds: ['card_red_vintage_cap'],
  };

  const packResult = openBoosterPack(testInv);
  assert.equal(packResult.success, true);
  assert.equal(packResult.pulls.length, 3);
  assert.equal(packResult.updatedInventory.availablePacks, 1);
});

test('equipping cosmetics updates trainer and pokemon gear', () => {
  const testInv = {
    ...DEFAULT_USER_INVENTORY,
    unlockedCardIds: ['card_red_vintage_cap', 'card_frame_prismatic'],
  };

  const equippedTrainer = equipCosmetic(testInv, 'card_red_vintage_cap');
  assert.equal(equippedTrainer.equippedTrainer.head, 'card_red_vintage_cap');

  const swappedBase = equipTrainerBase(equippedTrainer, 'leaf_lg');
  assert.equal(swappedBase.equippedTrainer.baseId, 'leaf_lg');

  const equippedPika = equipCosmetic(swappedBase, 'card_frame_prismatic', 'Pikachu');
  assert.equal(equippedPika.equippedPokemon['Pikachu']?.titleCard, 'card_frame_prismatic');
});
