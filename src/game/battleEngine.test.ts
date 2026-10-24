/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTypeEffectiveness,
  calculateDamage,
  calculateEffectiveSpeed,
  calculateEffectiveStat,
  getStatStageMultiplier,
  applyStatStageChange,
  executeBattleTurn,
  initializeBattle,
} from './battleEngine.ts';
import {
  getDailyPackCooldown,
  openBoosterPack,
  DEFAULT_USER_INVENTORY,
  equipCosmetic,
  equipTrainerBase,
} from './gachaEngine.ts';
import { BEGINNER_TEAMS, CHAMPION_RED_TEAM } from './constants.ts';
import { Pokemon, PokemonType } from './types.ts';
import { enrichMoveWithMechanics } from './data/moveMechanicsKB.ts';

test('type effectiveness accurately matches Pokémon mechanics', () => {
  assert.equal(calculateTypeEffectiveness('Fire', ['Grass']), 2);
  assert.equal(calculateTypeEffectiveness('Water', ['Fire']), 2);
  assert.equal(calculateTypeEffectiveness('Electric', ['Ground']), 0);
  assert.equal(calculateTypeEffectiveness('Normal', ['Ghost']), 0);
  assert.equal(calculateTypeEffectiveness('Water', ['Fire', 'Flying']), 2);
  assert.equal(calculateTypeEffectiveness('Rock', ['Fire', 'Flying']), 4);
});

test('damage calculation applies STAB, type multiplier, and defense ratio', () => {
  const charizard = CHAMPION_RED_TEAM.find((p) => p.species === 'Charizard')!;
  const venusaur = CHAMPION_RED_TEAM.find((p) => p.species === 'Venusaur')!;
  const flamethrower = charizard.moves.find((m) => m.id === 'flamethrower')!;

  const result = calculateDamage(charizard, venusaur, flamethrower, { rngVariance: 1.0, forceCrit: false });
  assert.ok(result.damage > 200, `Damage ${result.damage} should exceed 200 for STAB 2x special fire blast`);
  assert.equal(result.effectiveness, 2);

  const calmMind = CHAMPION_RED_TEAM.find((p) => p.species === 'Espeon')!.moves.find((m) => m.id === 'calm_mind')!;
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

  state.opponentTeam[0].currentHp = 1;
  const playerInitialHp = state.playerTeam[0].currentHp;

  const nextState = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.1 }
  );

  assert.equal(nextState.opponentTeam[0].fainted, true);
  assert.equal(nextState.opponentTeam[0].currentHp, 0);

  const hailDmg = Math.floor(state.playerTeam[0].maxHp / 16);
  const recoilDmg = state.playerTeam[0].moves[0].recoil ? 1 : 0;
  assert.equal(nextState.playerTeam[0].currentHp, playerInitialHp - recoilDmg - hailDmg);

  assert.ok(nextState.protocolLog?.some((l) => l.startsWith('|faint|p2a:')));
  const faintIndex = nextState.protocolLog!.findIndex((l) => l.startsWith('|faint|p2a:'));
  const oppMoveAfterFaint = nextState.protocolLog!.slice(faintIndex + 1).some((l) => l.startsWith('|move|p2a:'));
  assert.equal(oppMoveAfterFaint, false, 'Opponent must not attack after fainting');
});

test('priority brackets resolve before Speed and speed ties use fair 50/50 resolution', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  // Make player slow (Speed 50) but give priority +1 move; opponent fast (Speed 400) with priority 0 move
  state.playerTeam[0].baseStats.speed = 50;
  state.playerTeam[0].moves[0] = {
    id: 'quick_attack',
    name: 'Quick Attack',
    type: 'Normal',
    category: 'Physical',
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPp: 30,
    priority: 1,
    description: 'Priority +1 strike.',
  };
  state.opponentTeam[0].baseStats.speed = 400;
  state.opponentTeam[0].moves[0].priority = 0;

  const afterPriority = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  const p1MoveIdx = afterPriority.protocolLog!.findIndex((l) => l.startsWith('|move|p1a:'));
  const p2MoveIdx = afterPriority.protocolLog!.findIndex((l) => l.startsWith('|move|p2a:'));
  assert.ok(p1MoveIdx < p2MoveIdx, 'Priority +1 move must execute before faster Priority 0 move');

  // Exact speed & priority tie: rng < 0.5 vs rng >= 0.5 should flip order
  state.playerTeam[0].baseStats.speed = 250;
  state.opponentTeam[0].baseStats.speed = 250;
  state.playerTeam[0].moves[0].priority = 0;
  state.opponentTeam[0].moves[0].priority = 0;

  const tieLowRng = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.2 }
  );
  const tieHighRng = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.8 }
  );

  const firstActorLow = tieLowRng.protocolLog!.find((l) => l.startsWith('|move|'));
  const firstActorHigh = tieHighRng.protocolLog!.find((l) => l.startsWith('|move|'));
  assert.notEqual(firstActorLow, firstActorHigh, '50/50 speed tie must resolve to opposite sides across RNG branches');
});

test('stat stages (-6 to +6) clamp properly and apply Gen 3 multipliers across all six stats', () => {
  const mon = initializeBattle(BEGINNER_TEAMS[0].team).playerTeam[0];
  assert.equal(getStatStageMultiplier(0), 1);
  assert.equal(getStatStageMultiplier(2), 2);
  assert.equal(getStatStageMultiplier(6), 4);
  assert.equal(getStatStageMultiplier(-2), 0.5);
  assert.equal(getStatStageMultiplier(-6), 0.25);

  applyStatStageChange(mon, 'attack', 8);
  assert.equal(mon.statStages?.attack, 6, 'Stage must clamp at +6');
  assert.equal(calculateEffectiveStat(mon, 'attack'), mon.baseStats.attack * 4);

  applyStatStageChange(mon, 'defense', -10);
  assert.equal(mon.statStages?.defense, -6, 'Stage must clamp at -6');
  assert.equal(calculateEffectiveStat(mon, 'defense'), Math.floor(mon.baseStats.defense * 0.25));

  applyStatStageChange(mon, 'speed', 2);
  mon.statusCondition = 'paralysis';
  assert.equal(
    calculateEffectiveSpeed(mon),
    Math.floor(Math.floor(mon.baseStats.speed * 2) * 0.5),
    'Effective speed must combine stage boost and paralysis 0.5x reduction'
  );
});

test('Substitute creation, damage absorption, status blocking, and breaking', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';
  const p1 = state.playerTeam[0];
  p1.maxHp = 280;
  p1.currentHp = 280;
  p1.moves[0] = {
    id: 'substitute',
    name: 'Substitute',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPp: 10,
    isSubstitute: true,
    description: 'Creates a decoy using 1/4 max HP.',
  };

  // Opponent uses status move (Thunder Wave / paralysis) against Substitute
  state.opponentTeam[0].baseStats.speed = 50; // slower than player
  state.opponentTeam[0].moves[0] = {
    id: 'thunder_wave',
    name: 'Thunder Wave',
    type: 'Electric',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    statusEffect: 'paralysis',
    description: 'Paralyzes foe.',
  };

  const turn1 = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.1 }
  );

  // Player spent 70 HP (280 / 4) to create a 70 HP Substitute, and blocked Thunder Wave
  assert.equal(turn1.playerTeam[0].currentHp, 210);
  assert.equal(turn1.playerTeam[0].substituteHp, 70);
  assert.equal(turn1.playerTeam[0].statusCondition, null, 'Substitute must block opponent status move');

  // Next turn: opponent hits player with a damaging move that breaks the 70 HP Substitute without damaging player's 210 HP
  turn1.playerTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };
  turn1.opponentTeam[0].moves[0] = {
    id: 'iron_tail',
    name: 'Iron Tail',
    type: 'Steel',
    category: 'Physical',
    power: 200,
    accuracy: 100,
    pp: 15,
    maxPp: 15,
    description: 'Heavy steel strike.',
  };

  const turn2 = executeBattleTurn(
    turn1,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.1 }
  );

  assert.equal(turn2.playerTeam[0].substituteHp, 0, 'Substitute should break from heavy hit');
  assert.equal(turn2.playerTeam[0].currentHp, 210, 'Player real HP must remain untouched when Substitute absorbs the hit');
});

test('Weather (Hail, Sand, Rain, Sun) residuals, immunities, and move multipliers', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Sand';
  state.weatherTurnsRemaining = 5;
  // Make player Rock-type (immune to Sandstorm) and opponent Electric-type (takes 1/16 Sandstorm damage)
  state.playerTeam[0].types = ['Rock'];
  state.opponentTeam[0].types = ['Electric'];
  state.playerTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'No effect.',
  };
  state.opponentTeam[0].moves[0] = state.playerTeam[0].moves[0];

  const afterSand = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 }
  );

  assert.equal(afterSand.playerTeam[0].currentHp, state.playerTeam[0].maxHp, 'Rock type is immune to Sandstorm');
  assert.equal(
    afterSand.opponentTeam[0].currentHp,
    state.opponentTeam[0].maxHp - Math.floor(state.opponentTeam[0].maxHp / 16),
    'Non-immune type takes 1/16 max HP in Sandstorm'
  );

  // Rain boosts Water 1.5x and weakens Fire 0.5x
  const waterMove = {
    id: 'surf',
    name: 'Surf',
    type: 'Water' as const,
    category: 'Special' as const,
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPp: 15,
    description: 'Water wave.',
  };
  const clearDmg = calculateDamage(state.playerTeam[0], state.opponentTeam[0], waterMove, {
    weather: 'Clear',
    rngVariance: 1.0,
    forceCrit: false,
  }).damage;
  const rainDmg = calculateDamage(state.playerTeam[0], state.opponentTeam[0], waterMove, {
    weather: 'Rain',
    rngVariance: 1.0,
    forceCrit: false,
  }).damage;
  const sunDmg = calculateDamage(state.playerTeam[0], state.opponentTeam[0], waterMove, {
    weather: 'Sun',
    rngVariance: 1.0,
    forceCrit: false,
  }).damage;

  assert.ok(rainDmg > clearDmg, 'Rain must boost Water move damage');
  assert.ok(sunDmg < clearDmg, 'Sun must weaken Water move damage');
});

test('Status conditions: burn physical reduction, toxic escalation, sleep countdown, and freeze thaw', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';
  const attacker = state.playerTeam[0];
  const defender = state.opponentTeam[0];
  const physMove = {
    id: 'slash',
    name: 'Slash',
    type: 'Normal' as const,
    category: 'Physical' as const,
    power: 70,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'Physical slash.',
  };

  const healthyDmg = calculateDamage(attacker, defender, physMove, { rngVariance: 1.0, forceCrit: false }).damage;
  attacker.statusCondition = 'burn';
  const burnedDmg = calculateDamage(attacker, defender, physMove, { rngVariance: 1.0, forceCrit: false }).damage;
  assert.ok(burnedDmg < healthyDmg, 'Burn must halve physical attack damage');

  // Toxic escalating damage (1/16 on turn 1, 2/16 on turn 2)
  attacker.statusCondition = null;
  defender.statusCondition = 'toxic';
  defender.toxicCounter = 0;
  defender.maxHp = 320;
  defender.currentHp = 320;
  attacker.moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'No effect.',
  };
  defender.moves[0] = attacker.moves[0];

  const t1 = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 });
  assert.equal(t1.opponentTeam[0].currentHp, 300, 'Turn 1 Toxic deals 1/16 (20) HP');
  const t2 = executeBattleTurn(t1, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 });
  assert.equal(t2.opponentTeam[0].currentHp, 260, 'Turn 2 Toxic deals 2/16 (40) HP');
});

test('Protect blocks attacks, Recoil/Drain adjust attacker HP, and double faint triggers draw', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // Protect test
  state.playerTeam[0].moves[0] = {
    id: 'protect',
    name: 'Protect',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPp: 10,
    isProtect: true,
    description: 'Blocks all attacks this turn.',
  };
  const initialHp = state.playerTeam[0].currentHp;
  const afterProtect = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.1 }
  );
  assert.equal(afterProtect.playerTeam[0].currentHp, initialHp, 'Protect must block opponent attack completely');

  // Double faint edge case -> Draw (winner === null)
  const drawState = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  drawState.weather = 'Clear';
  drawState.playerTeam.forEach((p, idx) => {
    if (idx > 0) {
      p.fainted = true;
      p.currentHp = 0;
    }
  });
  drawState.opponentTeam.forEach((p, idx) => {
    if (idx > 0) {
      p.fainted = true;
      p.currentHp = 0;
    }
  });
  drawState.playerTeam[0].currentHp = 5;
  drawState.opponentTeam[0].currentHp = 20;
  drawState.playerTeam[0].moves[0] = {
    id: 'volt_tackle',
    name: 'Volt Tackle',
    type: 'Electric',
    category: 'Physical',
    power: 150,
    accuracy: 100,
    pp: 15,
    maxPp: 15,
    recoil: 0.33,
    description: 'Heavy recoil move.',
  };

  const afterDoubleKO = executeBattleTurn(
    drawState,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.equal(afterDoubleKO.phase, 'battle_over');
  assert.equal(afterDoubleKO.winner, null, 'Both last Pokemon fainting from recoil on the same turn must result in a draw');
});

test('daily pack cooldown calculates properly', () => {
  const justNow = Date.now();
  const res1 = getDailyPackCooldown(justNow);
  assert.equal(res1.isAvailable, false);
  assert.ok(res1.remainingMs > 0);

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

test('post-faint replacement switch is a free replacement action where opponent does NOT attack incoming Pokemon', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  // Make opponent outspeed and KO player's lead on Turn 1
  state.playerTeam[0].currentHp = 1;
  state.playerTeam[0].baseStats.speed = 50;
  state.opponentTeam[0].baseStats.speed = 400;

  const afterFaintTurn = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(afterFaintTurn.playerTeam[0].fainted, true);
  assert.equal(afterFaintTurn.phase, 'faint_switch_player');
  const turnAfterFaint = afterFaintTurn.turnNumber;
  const replacementMaxHp = afterFaintTurn.playerTeam[1].maxHp;

  // Player selects Pokemon #1 to replace the fainted lead; even if opponentAction is a damaging move,
  // the incoming Pokemon MUST NOT be attacked or take Hail residual damage on the replacement switch!
  const afterReplacement = executeBattleTurn(
    afterFaintTurn,
    { type: 'switch', targetPokemonIndex: 1 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(afterReplacement.playerActiveIndex, 1);
  assert.equal(afterReplacement.phase, 'action_select');
  assert.equal(
    afterReplacement.turnNumber,
    turnAfterFaint,
    'Post-faint replacement switch must not advance turnNumber'
  );
  assert.equal(
    afterReplacement.playerTeam[1].currentHp,
    replacementMaxHp,
    'Incoming replacement Pokemon must remain at 100% HP and not get hit on switch-in'
  );
  assert.equal(
    afterReplacement.turnMoves?.length ?? 0,
    0,
    'No attacking moves may execute during a post-faint replacement switch'
  );
});

test('move secondary effects KB: percent stat drops, self stat boosts, drawback drops, multi-stat setup, Serene Grace, and Clear Body', () => {
  const state = initializeBattle(BEGINNER_TEAMS[1].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // 1. Shadow Ball (20% chance to lower opponent Sp. Def by 1 stage)
  const gengar = state.playerTeam.find((p) => p.species === 'Gengar')!;
  const gengarIdx = state.playerTeam.indexOf(gengar);
  state.playerActiveIndex = gengarIdx;
  state.opponentTeam[0].maxHp = 999;
  state.opponentTeam[0].currentHp = 999;
  state.opponentTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'No effect.',
  };

  const shadowBallIdx = gengar.moves.findIndex((m) => m.id === 'shadow_ball');
  assert.ok(shadowBallIdx !== -1, 'Gengar should have Shadow Ball');

  const afterShadowBall = executeBattleTurn(
    state,
    { type: 'move', moveIndex: shadowBallIdx },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.05 } // 5% roll < 20% Shadow Ball chance
  );
  assert.equal(
    afterShadowBall.opponentTeam[0].statStages?.spDef,
    -1,
    'Shadow Ball must lower defender Sp. Def by 1 stage when secondary effect triggers'
  );

  // 2. Clear Body blocks opponent-caused stat drops (e.g. Shadow Ball)
  afterShadowBall.opponentTeam[0].ability = 'Clear Body';
  afterShadowBall.opponentTeam[0].statStages!.spDef = 0;
  const afterClearBody = executeBattleTurn(
    afterShadowBall,
    { type: 'move', moveIndex: shadowBallIdx },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.05 }
  );
  assert.equal(
    afterClearBody.opponentTeam[0].statStages?.spDef,
    0,
    'Clear Body must prevent opponent-inflicted stat stage reductions'
  );

  // 3. Ancient Power (10% base -> 20% with Serene Grace) boosts all 5 combat stats by +1
  afterClearBody.playerTeam[gengarIdx].ability = 'Serene Grace';
  afterClearBody.playerTeam[gengarIdx].moves[0] = {
    id: 'ancient_power',
    name: 'Ancient Power',
    type: 'Rock',
    category: 'Special',
    power: 60,
    accuracy: 100,
    pp: 10,
    maxPp: 10,
    description: 'May raise all stats.',
  };
  const afterAncientPower = executeBattleTurn(
    afterClearBody,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.15 } // 15% roll fails 10% base, but succeeds under 20% Serene Grace!
  );
  const stages = afterAncientPower.playerTeam[gengarIdx].statStages!;
  assert.equal(stages.attack, 1, 'Ancient Power + Serene Grace must boost Attack +1');
  assert.equal(stages.defense, 1, 'Ancient Power + Serene Grace must boost Defense +1');
  assert.equal(stages.spAtk, 1, 'Ancient Power + Serene Grace must boost Sp. Atk +1');
  assert.equal(stages.spDef, 1, 'Ancient Power + Serene Grace must boost Sp. Def +1');
  assert.equal(stages.speed, 1, 'Ancient Power + Serene Grace must boost Speed +1');

  // 4. Close Combat (100% self Defense -1 and Sp. Def -1 on hit, even when KOing defender)
  afterAncientPower.playerTeam[gengarIdx].statStages = {
    hp: 0,
    attack: 0,
    defense: 0,
    spAtk: 0,
    spDef: 0,
    speed: 0,
  };
  afterAncientPower.playerTeam[gengarIdx].moves[0] = {
    id: 'close_combat',
    name: 'Close Combat',
    type: 'Fighting',
    category: 'Physical',
    power: 120,
    accuracy: 100,
    pp: 5,
    maxPp: 5,
    description: 'Lowers user Defense and Sp. Def.',
  };
  afterAncientPower.opponentTeam[0].currentHp = 10; // Will faint from Close Combat
  const afterCloseCombat = executeBattleTurn(
    afterAncientPower,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.equal(
    afterCloseCombat.playerTeam[gengarIdx].statStages?.defense,
    -1,
    'Close Combat must lower user Defense by 1 stage'
  );
  assert.equal(
    afterCloseCombat.playerTeam[gengarIdx].statStages?.spDef,
    -1,
    'Close Combat must lower user Sp. Def by 1 stage'
  );

  // 5. Calm Mind status move boosts both Sp. Atk (+1) and Sp. Def (+1)
  afterCloseCombat.playerTeam[gengarIdx].statStages = {
    hp: 0,
    attack: 0,
    defense: 0,
    spAtk: 0,
    spDef: 0,
    speed: 0,
  };
  afterCloseCombat.playerTeam[gengarIdx].moves[0] = {
    id: 'calm_mind',
    name: 'Calm Mind',
    type: 'Psychic',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'Raises Sp. Atk and Sp. Def.',
  };
  afterCloseCombat.opponentTeam[afterCloseCombat.opponentActiveIndex].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'No effect.',
  };
  const afterCalmMind = executeBattleTurn(
    afterCloseCombat,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.equal(afterCalmMind.playerTeam[gengarIdx].statStages?.spAtk, 1, 'Calm Mind must boost Sp. Atk +1');
  assert.equal(afterCalmMind.playerTeam[gengarIdx].statStages?.spDef, 1, 'Calm Mind must boost Sp. Def +1');
});

test('pivot moves (Volt Switch, U-turn) deal damage and switch out attacker safely', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // Give player Mon Volt Switch (enriched from KB)
  const pMon = state.playerTeam[0];
  pMon.moves[0] = {
    id: 'volt_switch',
    name: 'Volt Switch',
    type: 'Electric',
    category: 'Special',
    power: 70,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'After making its attack, the user rushes back to switch places with a party Pokémon in waiting.',
  };

  const oppMon = state.opponentTeam[0];
  oppMon.moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  const initialOppHp = oppMon.currentHp;

  // Turn 1: Player uses Volt Switch
  const afterVoltSwitch = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  // Check that damage was dealt to opponent
  assert.ok(afterVoltSwitch.opponentTeam[0].currentHp < initialOppHp, 'Volt Switch must deal damage to opponent');
  // Check that player entered pivot switch phase
  assert.equal(afterVoltSwitch.pendingPivot, true, 'pendingPivot must be true after Volt Switch connects');
  assert.equal(afterVoltSwitch.phase, 'faint_switch_player', 'phase must be faint_switch_player for replacement selection');

  // Turn 1b: Player selects replacement from bench (index 1)
  const afterSwitch = executeBattleTurn(
    afterVoltSwitch,
    { type: 'switch', targetPokemonIndex: 1 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(afterSwitch.playerActiveIndex, 1, 'Player active index must now be 1');
  assert.equal(afterSwitch.pendingPivot, false, 'pendingPivot must be cleared after switch');
  assert.equal(afterSwitch.phase, 'action_select', 'Phase must return to action_select');

  // Opponent using Volt Switch
  const oppState = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  oppState.weather = 'Clear';
  oppState.opponentTeam[0].moves[0] = {
    id: 'volt_switch',
    name: 'Volt Switch',
    type: 'Electric',
    category: 'Special',
    power: 70,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'After making its attack, the user rushes back to switch places with a party Pokémon in waiting.',
  };
  oppState.playerTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  const initialPlayerHp = oppState.playerTeam[0].currentHp;
  const initialOppActiveIdx = oppState.opponentActiveIndex;

  const afterOppVoltSwitch = executeBattleTurn(
    oppState,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.ok(afterOppVoltSwitch.playerTeam[0].currentHp < initialPlayerHp, 'Opponent Volt Switch must deal damage to player');
  assert.notEqual(afterOppVoltSwitch.opponentActiveIndex, initialOppActiveIdx, 'Opponent must switch to a bench teammate');
});

test('fast Volt Switch switches player mon, and opponent queued attack hits the incoming replacement Pokémon', () => {
  const p1 = createTestMon('p1', 'Jolteon', ['Electric'], { hp: 250, attack: 150, defense: 150, spAtk: 300, spDef: 200, speed: 350 });
  const p2 = createTestMon('p2', 'Snorlax', ['Normal'], { hp: 500, attack: 250, defense: 200, spAtk: 150, spDef: 200, speed: 100 });
  const benchMon = createTestMon('p_bench', 'Alakazam', ['Psychic'], { hp: 300, attack: 150, defense: 150, spAtk: 300, spDef: 150, speed: 300 });

  const voltSwitch = { id: 'volt_switch', name: 'Volt Switch', type: 'Electric' as const, category: 'Special' as const, power: 70, accuracy: 100, pp: 20, maxPp: 20, description: '' };
  const bodySlam = { id: 'body_slam', name: 'Body Slam', type: 'Normal' as const, category: 'Physical' as const, power: 85, accuracy: 100, pp: 15, maxPp: 15, description: '' };

  const state = initializeBattle([p1, benchMon], [p2]);
  state.playerTeam[0].moves = [voltSwitch];
  state.opponentTeam[0].moves = [bodySlam];

  // Turn 1: Fast Volt Switch deals damage to Snorlax, player must pivot out
  const afterVolt = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterVolt.pendingPivot, true, 'pendingPivot is true');
  assert.ok(afterVolt.pendingOpponentAction !== undefined, 'Opponent queued action is preserved');
  assert.ok(afterVolt.opponentTeam[0].currentHp < 500, 'Snorlax took damage from Volt Switch');

  // Turn 1b: Player sends out Alakazam. Snorlax Body Slam MUST hit Alakazam!
  const fullBenchHp = afterVolt.playerTeam[1].currentHp;
  const afterSwitch = executeBattleTurn(afterVolt, { type: 'switch', targetPokemonIndex: 1 }, { type: 'switch', targetPokemonIndex: 0 }, { rng: () => 0.5 });

  assert.equal(afterSwitch.playerActiveIndex, 1, 'Alakazam is now active');
  assert.ok(afterSwitch.playerTeam[1].currentHp < fullBenchHp, 'Incoming Alakazam took damage from Snorlax Body Slam');
  assert.equal(afterSwitch.turnMoves?.[0]?.moveName, 'Body Slam', 'Opponent move was executed against incoming Pokémon');
  assert.equal(afterSwitch.pendingPivot, false, 'pendingPivot is cleared');

  // Slow Volt Switch: Snorlax outspeeds, attacks Jolteon first. Incoming Alakazam takes no hit!
  p1.baseStats.speed = 50; // Slower than Snorlax
  const slowState = initializeBattle([p1, benchMon], [p2]);
  slowState.playerTeam[0].moves = [voltSwitch];
  slowState.opponentTeam[0].moves = [bodySlam];

  const afterSlowVolt = executeBattleTurn(slowState, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.ok(afterSlowVolt.playerTeam[0].currentHp < 250, 'Jolteon took Body Slam before moving');
  assert.equal(afterSlowVolt.pendingOpponentAction, undefined, 'No pending action because Snorlax already moved');

  const afterSlowSwitch = executeBattleTurn(afterSlowVolt, { type: 'switch', targetPokemonIndex: 1 }, { type: 'switch', targetPokemonIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterSlowSwitch.playerTeam[1].currentHp, fullBenchHp, 'Alakazam enters safely with zero damage on slow pivot');
});

test('infallible accuracy moves (Aura Sphere) bypass accuracy checks', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // Aura Sphere has accuracy: 100 (infallible in mechanics KB)
  state.playerTeam[0].moves[0] = {
    id: 'aura_sphere',
    name: 'Aura Sphere',
    type: 'Fighting',
    category: 'Special',
    power: 80,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'Never misses.',
  };
  state.opponentTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  const initialOppHp = state.opponentTeam[0].currentHp;

  // With hitRoll = 99 (rng = 0.99), normal moves with accuracy 100 would miss if accuracy was lowered,
  // but infallible moves never miss regardless of hit roll
  const afterAuraSphere = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.99 }
  );

  assert.ok(afterAuraSphere.opponentTeam[0].currentHp < initialOppHp, 'Aura Sphere must hit regardless of roll');
});

test('recharge moves (Blast Burn, Frenzy Plant, Hydro Cannon) force a recharge turn', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  state.playerTeam[0].moves[0] = {
    id: 'blast_burn',
    name: 'Blast Burn',
    type: 'Fire',
    category: 'Special',
    power: 150,
    accuracy: 90,
    pp: 5,
    maxPp: 5,
    description: 'User must recharge next turn.',
  };
  state.opponentTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  // Turn 1: Blast Burn executes
  const turn1 = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(turn1.playerTeam[0].mustRecharge, true, 'Attacker must be flagged for recharge');

  const oppHpAfterTurn1 = turn1.opponentTeam[0].currentHp;

  // Turn 2: Attempt another Blast Burn - should be forced to recharge
  const turn2 = executeBattleTurn(
    turn1,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(turn2.opponentTeam[0].currentHp, oppHpAfterTurn1, 'Opponent took no damage because user had to recharge');
  assert.equal(turn2.playerTeam[0].mustRecharge, false, 'mustRecharge flag is cleared after recharging');
});

test('Baton Pass transfers stat stages and Substitute to switch-in teammate', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // Setup Dragon Dance stat stages and substitute on player Mon
  const pMon = state.playerTeam[0];
  pMon.statStages = {
    hp: 0,
    attack: 2,
    defense: 0,
    spAtk: 0,
    spDef: 0,
    speed: 2,
  };
  pMon.substituteHp = 30;

  pMon.moves[0] = {
    id: 'baton_pass',
    name: 'Baton Pass',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'Passes boosts to teammate.',
  };
  state.opponentTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  // Turn 1: Player uses Baton Pass
  const afterBatonPass = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(afterBatonPass.pendingPivot, true, 'pendingPivot must be true');
  assert.equal(afterBatonPass.pendingBatonPass, true, 'pendingBatonPass must be true');

  // Turn 1b: Switch to teammate at index 1
  const afterSwitch = executeBattleTurn(
    afterBatonPass,
    { type: 'switch', targetPokemonIndex: 1 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  const newActive = afterSwitch.playerTeam[1];
  assert.equal(newActive.statStages?.attack, 2, 'Incoming Pokemon inherits +2 Attack from Baton Pass');
  assert.equal(newActive.statStages?.speed, 2, 'Incoming Pokemon inherits +2 Speed from Baton Pass');
  assert.equal(newActive.substituteHp, 30, 'Incoming Pokemon inherits Substitute HP from Baton Pass');
});

test('confusion: status and secondary application, self-hit damage, snap out, and clearing on switch', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // 1. Confuse Ray inflicts confusion
  state.playerTeam[0].moves[0] = {
    id: 'confuse_ray',
    name: 'Confuse Ray',
    type: 'Ghost',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 10,
    maxPp: 10,
    description: 'Causes confusion.',
  };
  state.opponentTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  const afterConfuseRay = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  const oppMon = afterConfuseRay.opponentTeam[0];
  assert.equal(oppMon.isConfused, true, 'Opponent must become confused by Confuse Ray');
  assert.ok((oppMon.confusionTurns ?? 0) >= 1, 'Opponent must have positive confusion turns remaining');

  // 2. Confused Pokemon rolls self-hit damage (< 0.33)
  const oppInitialHp = oppMon.currentHp;
  afterConfuseRay.playerTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };
  // rng returns 0.1 for confusion self-hit roll
  const afterSelfHarm = executeBattleTurn(
    afterConfuseRay,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.1 }
  );

  assert.ok(
    afterSelfHarm.opponentTeam[0].currentHp < oppInitialHp,
    'Opponent must take self-harm damage when confusion roll triggers'
  );

  // 3. Snapping out of confusion when turns reach 0
  afterSelfHarm.opponentTeam[0].confusionTurns = 1;
  const afterSnapOut = executeBattleTurn(
    afterSelfHarm,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.equal(afterSnapOut.opponentTeam[0].isConfused, false, 'Opponent must snap out of confusion when turns expire');

  // 4. Switching out clears confusion
  afterSnapOut.playerTeam[0].isConfused = true;
  afterSnapOut.playerTeam[0].confusionTurns = 3;
  const afterPlayerSwitch = executeBattleTurn(
    afterSnapOut,
    { type: 'switch', targetPokemonIndex: 1 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.equal(
    afterPlayerSwitch.playerTeam[0].isConfused,
    false,
    'Benched Pokémon must have confusion cleared on switch out'
  );
});

test('entry hazards: Stealth Rock, Spikes, Toxic Spikes, Sticky Web, and Hazard Clearing', () => {
  const state = initializeBattle(BEGINNER_TEAMS[0].team, CHAMPION_RED_TEAM);
  state.weather = 'Clear';

  // 1. Player sets up Stealth Rock
  state.playerTeam[0].moves[0] = {
    id: 'stealth_rock',
    name: 'Stealth Rock',
    type: 'Rock',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'Sets Stealth Rock.',
  };
  state.opponentTeam[0].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };

  const afterSR = executeBattleTurn(
    state,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );

  assert.equal(afterSR.opponentSideConditions?.stealthRock, true, 'Opponent side must have Stealth Rock active');

  // 2. Opponent switches into Stealth Rock and takes damage based on Rock type effectiveness
  const benchMon = afterSR.opponentTeam[1];
  const initialBenchHp = benchMon.currentHp;
  const afterOppSwitch = executeBattleTurn(
    afterSR,
    { type: 'move', moveIndex: 0 },
    { type: 'switch', targetPokemonIndex: 1 },
    { rng: () => 0.5 }
  );

  const activeOppAfterSwitch = afterOppSwitch.opponentTeam[1];
  assert.ok(
    activeOppAfterSwitch.currentHp < initialBenchHp,
    'Incoming opponent Pokemon must take damage from Stealth Rock upon entry'
  );

  // 3. Spikes and Toxic Spikes stacking
  afterOppSwitch.opponentTeam[1].moves[0] = {
    id: 'splash',
    name: 'Splash',
    type: 'Normal',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'No effect.',
  };
  afterOppSwitch.playerTeam[0].moves[0] = {
    id: 'spikes',
    name: 'Spikes',
    type: 'Ground',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    maxPp: 20,
    description: 'Scatters Spikes.',
  };
  const afterSpikes = executeBattleTurn(
    afterOppSwitch,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.equal(afterSpikes.opponentSideConditions?.spikes, 1, 'Spikes layer 1 active');

  // 4. Hazard Removal with Rapid Spin
  afterSpikes.opponentSideConditions = {
    stealthRock: true,
    spikes: 2,
    toxicSpikes: 1,
    stickyWeb: true,
  };
  afterSpikes.playerSideConditions = {
    stealthRock: true,
    spikes: 1,
  };

  // Player uses Rapid Spin (damaging move that clears hazards on user side)
  afterSpikes.playerTeam[0].moves[0] = {
    id: 'rapid_spin',
    name: 'Rapid Spin',
    type: 'Normal',
    category: 'Physical',
    power: 50,
    accuracy: 100,
    pp: 40,
    maxPp: 40,
    description: 'Clears hazards.',
  };
  const afterRapidSpin = executeBattleTurn(
    afterSpikes,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.deepEqual(afterRapidSpin.playerSideConditions, {}, 'Rapid Spin clears all hazards on player side');
  assert.equal(afterRapidSpin.opponentSideConditions?.stealthRock, true, 'Opponent hazards remain intact after Rapid Spin');

  // 5. Defog clears hazards on both sides
  afterRapidSpin.playerTeam[0].moves[0] = {
    id: 'defog',
    name: 'Defog',
    type: 'Flying',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 15,
    maxPp: 15,
    description: 'Clears all hazards on field.',
  };
  const afterDefog = executeBattleTurn(
    afterRapidSpin,
    { type: 'move', moveIndex: 0 },
    { type: 'move', moveIndex: 0 },
    { rng: () => 0.5 }
  );
  assert.deepEqual(afterDefog.opponentSideConditions, {}, 'Defog clears all hazards on opponent side');
  assert.deepEqual(afterDefog.playerSideConditions, {}, 'Defog clears all hazards on player side');
});

/* ============================================================================
 * EXPANDED BATTLE ENGINE MECHANICS SUITE: HELD ITEMS & COMPETITIVE MOVES
 * ============================================================================ */

function createTestMon(
  id: string,
  species: string,
  types: PokemonType[],
  baseStats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number },
  overrides?: Partial<Pokemon>
): Pokemon {
  return {
    id,
    species,
    nationalDex: 1,
    types,
    level: 100,
    baseStats,
    currentHp: baseStats.hp,
    maxHp: baseStats.hp,
    ability: 'Synchronize',
    abilityDescription: '',
    moves: [],
    spriteFront: '',
    spriteBack: '',
    fainted: false,
    ...overrides,
  };
}

test('Held Items: Life Orb boosts damage by 1.3x and inflicts 10% recoil', () => {
  const p1 = createTestMon('p1', 'Lucario', ['Fighting', 'Steel'], { hp: 300, attack: 300, defense: 200, spAtk: 300, spDef: 200, speed: 250 });
  const p2 = createTestMon('p2', 'Blissey', ['Normal'], { hp: 600, attack: 100, defense: 200, spAtk: 100, spDef: 300, speed: 100 });
  const move = { id: 'close_combat', name: 'Close Combat', type: 'Fighting' as const, category: 'Physical' as const, power: 120, accuracy: 100, pp: 5, maxPp: 5, description: '' };

  const normDmg = calculateDamage(p1, p2, move, { rngVariance: 1.0, forceCrit: false });
  p1.heldItem = 'Life Orb';
  const loDmg = calculateDamage(p1, p2, move, { rngVariance: 1.0, forceCrit: false });
  assert.ok(Math.abs(loDmg.damage - Math.floor(normDmg.damage * 1.3)) <= 1);

  // In turn execution, attacker loses 10% max HP
  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].heldItem = 'Life Orb';
  state.playerTeam[0].moves = [move];
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];
  const startHp = state.playerTeam[0].currentHp;
  const next = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(next.playerTeam[0].currentHp, startHp - Math.floor(p1.maxHp * 0.1));
});

test('Held Items: Choice Band, Choice Specs, and Choice Scarf boosts', () => {
  const p1 = createTestMon('p1', 'Garchomp', ['Dragon', 'Ground'], { hp: 350, attack: 300, defense: 200, spAtk: 200, spDef: 200, speed: 200 });
  const p2 = createTestMon('p2', 'Snorlax', ['Normal'], { hp: 450, attack: 200, defense: 200, spAtk: 200, spDef: 200, speed: 100 });
  const physMove = { id: 'earthquake', name: 'Earthquake', type: 'Ground' as const, category: 'Physical' as const, power: 100, accuracy: 100, pp: 10, maxPp: 10, description: '' };
  const specMove = { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon' as const, category: 'Special' as const, power: 85, accuracy: 100, pp: 10, maxPp: 10, description: '' };

  // Choice Band
  const unboostedPhys = calculateDamage(p1, p2, physMove, { rngVariance: 1.0, forceCrit: false });
  p1.heldItem = 'Choice Band';
  const boostedPhys = calculateDamage(p1, p2, physMove, { rngVariance: 1.0, forceCrit: false });
  assert.ok(boostedPhys.damage > unboostedPhys.damage);

  // Choice Specs
  p1.heldItem = undefined;
  const unboostedSpec = calculateDamage(p1, p2, specMove, { rngVariance: 1.0, forceCrit: false });
  p1.heldItem = 'Choice Specs';
  const boostedSpec = calculateDamage(p1, p2, specMove, { rngVariance: 1.0, forceCrit: false });
  assert.ok(boostedSpec.damage > unboostedSpec.damage);

  // Choice Scarf
  p1.heldItem = undefined;
  assert.equal(calculateEffectiveSpeed(p1), 200);
  p1.heldItem = 'Choice Scarf';
  assert.equal(calculateEffectiveSpeed(p1), 300);
});

test('Held Items: Assault Vest and Eviolite bolster defensive calculations', () => {
  const p1 = createTestMon('p1', 'Alakazam', ['Psychic'], { hp: 250, attack: 150, defense: 150, spAtk: 350, spDef: 200, speed: 300 });
  const p2 = createTestMon('p2', 'Rhydon', ['Ground', 'Rock'], { hp: 350, attack: 300, defense: 300, spAtk: 100, spDef: 150, speed: 100 });
  const specMove = { id: 'psychic', name: 'Psychic', type: 'Psychic' as const, category: 'Special' as const, power: 90, accuracy: 100, pp: 10, maxPp: 10, description: '' };

  const normDmg = calculateDamage(p1, p2, specMove, { rngVariance: 1.0, forceCrit: false });
  p2.heldItem = 'Assault Vest';
  const avDmg = calculateDamage(p1, p2, specMove, { rngVariance: 1.0, forceCrit: false });
  assert.ok(avDmg.damage < normDmg.damage, 'Assault Vest reduces special damage taken');

  p2.heldItem = 'Eviolite';
  const evDmg = calculateDamage(p1, p2, specMove, { rngVariance: 1.0, forceCrit: false });
  assert.ok(evDmg.damage < normDmg.damage, 'Eviolite reduces damage taken on unevolved Pokémon');
});

test('Held Items: Focus Sash and Sturdy survive 1-hit lethal knockout with 1 HP', () => {
  const p1 = createTestMon('p1', 'Charizard', ['Fire'], { hp: 300, attack: 300, defense: 200, spAtk: 300, spDef: 200, speed: 300 });
  const p2 = createTestMon('p2', 'Shedinja', ['Ghost'], { hp: 100, attack: 100, defense: 50, spAtk: 100, spDef: 50, speed: 100 });
  const move = { id: 'flamethrower', name: 'Flamethrower', type: 'Fire' as const, category: 'Special' as const, power: 150, accuracy: 100, pp: 5, maxPp: 5, description: '' };

  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].moves = [move];
  state.opponentTeam[0].heldItem = 'Focus Sash';
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  const next = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(next.opponentTeam[0].currentHp, 1, 'Focus Sash holder survives lethal hit with 1 HP');
  assert.equal(next.opponentTeam[0].heldItemConsumed, true);
  assert.equal(next.opponentTeam[0].fainted, false);
});

test('Held Items: Air Balloon grants Ground immunity and pops when damaged', () => {
  const p1 = createTestMon('p1', 'Garchomp', ['Dragon', 'Ground'], { hp: 300, attack: 300, defense: 200, spAtk: 200, spDef: 200, speed: 300 });
  const p2 = createTestMon('p2', 'Lucario', ['Steel', 'Fighting'], { hp: 300, attack: 300, defense: 200, spAtk: 200, spDef: 200, speed: 200 });
  p2.heldItem = 'Air Balloon';
  const eq = { id: 'earthquake', name: 'Earthquake', type: 'Ground' as const, category: 'Physical' as const, power: 100, accuracy: 100, pp: 10, maxPp: 10, description: '' };

  const res = calculateDamage(p1, p2, eq);
  assert.equal(res.damage, 0, 'Air Balloon makes holder completely immune to Ground moves');
  assert.equal(res.effectiveness, 0);

  // When hit by a non-Ground attack, Air Balloon pops
  const rockSlide = { id: 'rock_slide', name: 'Rock Slide', type: 'Rock' as const, category: 'Physical' as const, power: 75, accuracy: 100, pp: 10, maxPp: 10, description: '' };
  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].moves = [rockSlide];
  state.opponentTeam[0].heldItem = 'Air Balloon';
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  const next = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(next.opponentTeam[0].heldItemConsumed, true, 'Air Balloon is consumed after being hit');
});

test('Held Items: Type Resist Berries (Yache Berry) halve super effective damage', () => {
  const p1 = createTestMon('p1', 'Glaceon', ['Ice'], { hp: 300, attack: 150, defense: 200, spAtk: 350, spDef: 200, speed: 200 });
  const p2 = createTestMon('p2', 'Garchomp', ['Dragon', 'Ground'], { hp: 350, attack: 300, defense: 200, spAtk: 200, spDef: 200, speed: 250 });
  const iceBeam = { id: 'ice_beam', name: 'Ice Beam', type: 'Ice' as const, category: 'Special' as const, power: 90, accuracy: 100, pp: 10, maxPp: 10, description: '' };

  const normDmg = calculateDamage(p1, p2, iceBeam, { rngVariance: 1.0, forceCrit: false });
  p2.heldItem = 'Yache Berry';
  const yacheDmg = calculateDamage(p1, p2, iceBeam, { rngVariance: 1.0, forceCrit: false });
  assert.equal(yacheDmg.damage, Math.floor(normDmg.damage * 0.5), 'Yache Berry halves incoming 4x super effective Ice damage');
});

test('Held Items: Weakness Policy raises Attack and Sp. Atk by +2 on super effective hit', () => {
  const p1 = createTestMon('p1', 'Glaceon', ['Ice'], { hp: 300, attack: 150, defense: 200, spAtk: 200, spDef: 200, speed: 250 });
  const p2 = createTestMon('p2', 'Dragonite', ['Dragon', 'Flying'], { hp: 500, attack: 300, defense: 250, spAtk: 250, spDef: 250, speed: 200 });
  p2.heldItem = 'Weakness Policy';
  const iceBeam = { id: 'ice_beam', name: 'Ice Beam', type: 'Ice' as const, category: 'Special' as const, power: 40, accuracy: 100, pp: 10, maxPp: 10, description: '' };

  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].moves = [iceBeam];
  state.opponentTeam[0].heldItem = 'Weakness Policy';
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  const next = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(next.opponentTeam[0].statStages?.attack, 2);
  assert.equal(next.opponentTeam[0].statStages?.spAtk, 2);
  assert.equal(next.opponentTeam[0].heldItemConsumed, true);
});

test('Held Items: Leftovers, Black Sludge, Sitrus Berry, and Status Orbs end-of-turn residuals', () => {
  const p1 = createTestMon('p1', 'Gengar', ['Ghost', 'Poison'], { hp: 300, attack: 200, defense: 200, spAtk: 300, spDef: 200, speed: 300 });
  const p2 = createTestMon('p2', 'Snorlax', ['Normal'], { hp: 400, attack: 200, defense: 200, spAtk: 200, spDef: 200, speed: 100 });

  // 1. Leftovers heal 1/16 max HP
  const state = initializeBattle([p1], [p2]);
  state.opponentTeam[0].currentHp = 300;
  state.opponentTeam[0].heldItem = 'Leftovers';
  state.playerTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];
  const afterLeftovers = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterLeftovers.opponentTeam[0].currentHp, 300 + Math.floor(400 / 16));

  // 2. Sitrus Berry triggers at <= 50% HP
  afterLeftovers.opponentTeam[0].currentHp = 150;
  afterLeftovers.opponentTeam[0].heldItem = 'Sitrus Berry';
  afterLeftovers.opponentTeam[0].heldItemConsumed = false;
  const afterSitrus = executeBattleTurn(afterLeftovers, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterSitrus.opponentTeam[0].currentHp, 150 + Math.floor(400 * 0.25));
  assert.equal(afterSitrus.opponentTeam[0].heldItemConsumed, true);

  // 3. Flame Orb burns holder
  afterSitrus.opponentTeam[0].heldItem = 'Flame Orb';
  afterSitrus.opponentTeam[0].heldItemConsumed = false;
  afterSitrus.opponentTeam[0].statusCondition = null;
  const afterFlame = executeBattleTurn(afterSitrus, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterFlame.opponentTeam[0].statusCondition, 'burn');
});

test('Held Items: Rocky Helmet, Rough Skin, and Knock Off', () => {
  const p1 = createTestMon('p1', 'Lucario', ['Fighting'], { hp: 300, attack: 300, defense: 200, spAtk: 200, spDef: 200, speed: 300 });
  const p2 = createTestMon('p2', 'Ferrothorn', ['Grass', 'Steel'], { hp: 1000, attack: 200, defense: 300, spAtk: 100, spDef: 300, speed: 50 }, { ability: 'Iron Barbs', heldItem: 'Rocky Helmet' });
  const closeCombat = { id: 'close_combat', name: 'Close Combat', type: 'Fighting' as const, category: 'Physical' as const, power: 120, accuracy: 100, pp: 5, maxPp: 5, description: '' };

  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].moves = [closeCombat];
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  const next = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  // Attacker takes 1/6 (Rocky Helmet) + 1/8 (Iron Barbs) of 300 HP = 50 + 37 = 87 damage
  const expectedRecoil = Math.floor(300 / 6) + Math.floor(300 / 8);
  assert.equal(next.playerTeam[0].currentHp, 300 - expectedRecoil);

  // Knock Off removes Rocky Helmet
  const knockOff = { id: 'knock_off', name: 'Knock Off', type: 'Dark' as const, category: 'Physical' as const, power: 65, accuracy: 100, pp: 20, maxPp: 20, description: '' };
  next.playerTeam[0].moves[0] = knockOff;
  const afterKnockOff = executeBattleTurn(next, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterKnockOff.opponentTeam[0].heldItemConsumed, true, 'Knock Off consumed and removed defender item');
});

test('Move Mechanics: Facade, Psyshock, Sucker Punch, and Dual Screens', () => {
  const p1 = createTestMon('p1', 'Snorlax', ['Normal'], { hp: 400, attack: 300, defense: 200, spAtk: 150, spDef: 250, speed: 100 });
  const p2 = createTestMon('p2', 'Blissey', ['Normal'], { hp: 600, attack: 100, defense: 50, spAtk: 200, spDef: 350, speed: 150 });
  const facade = { id: 'facade', name: 'Facade', type: 'Normal' as const, category: 'Physical' as const, power: 70, accuracy: 100, pp: 20, maxPp: 20, description: '' };
  const psyshock = { id: 'psyshock', name: 'Psyshock', type: 'Psychic' as const, category: 'Special' as const, power: 80, accuracy: 100, pp: 10, maxPp: 10, description: '' };

  // 1. Facade doubles power to 140 when burned and ignores burn physical cut
  const normFacade = calculateDamage(p1, p2, facade, { rngVariance: 1.0, forceCrit: false });
  p1.statusCondition = 'burn';
  const burnedFacade = calculateDamage(p1, p2, facade, { rngVariance: 1.0, forceCrit: false });
  assert.ok(Math.abs(burnedFacade.damage - (normFacade.damage * 2 - 3)) <= 1, 'Burned Facade deals 2x damage and ignores burn penalty');

  // 2. Psyshock targets physical Defense (Blissey has 50 def vs 350 spDef)
  p1.statusCondition = null;
  const psyshockDmg = calculateDamage(p1, p2, psyshock, { rngVariance: 1.0, forceCrit: false });
  assert.ok(psyshockDmg.damage > 200, 'Psyshock shreds low physical defense targets');

  // 3. Dual Screens (Reflect halves physical damage, Light Screen halves special damage)
  const screenPhys = calculateDamage(p1, p2, facade, { rngVariance: 1.0, forceCrit: false, defenderSideConditions: { reflectTurns: 5 } });
  assert.equal(screenPhys.damage, Math.floor(normFacade.damage * 0.5), 'Reflect halves incoming physical damage');

  // 4. Sucker Punch succeeds against attacks and fails against status
  const suckerPunch = { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark' as const, category: 'Physical' as const, power: 70, accuracy: 100, pp: 5, maxPp: 5, description: '' };
  const tackle = { id: 'tackle', name: 'Tackle', type: 'Normal' as const, category: 'Physical' as const, power: 40, accuracy: 100, pp: 35, maxPp: 35, description: '' };
  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].moves = [suckerPunch];
  state.opponentTeam[0].moves = [tackle];

  const suckerSuccess = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.ok(suckerSuccess.lastMoveUsed?.moveName === 'Tackle');
  assert.ok(suckerSuccess.turnMoves?.some((tm) => tm.moveName === 'Sucker Punch' && tm.damageDealt > 0));

  // Against Status move, Sucker Punch fails
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];
  const suckerFail = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.ok(suckerFail.combatLog.some((cl) => cl.message.includes('But it failed!')));
});

test('Move Mechanics: Haze, Taunt, Perish Song, and Trick Room field dynamics', () => {
  const p1 = createTestMon('p1', 'Spiritomb', ['Ghost', 'Dark'], { hp: 300, attack: 200, defense: 200, spAtk: 200, spDef: 200, speed: 50 });
  const p2 = createTestMon('p2', 'Jolteon', ['Electric'], { hp: 300, attack: 150, defense: 150, spAtk: 300, spDef: 200, speed: 350 });

  // 1. Haze resets all stat boosts on both sides
  p1.statStages = { hp: 0, attack: 3, defense: 2, spAtk: 0, spDef: 0, speed: 0 };
  p2.statStages = { hp: 0, attack: -2, defense: 0, spAtk: 4, spDef: 0, speed: 0 };
  const state = initializeBattle([p1], [p2]);
  state.playerTeam[0].moves = [{ id: 'haze', name: 'Haze', type: 'Ice', category: 'Status', power: 0, accuracy: 100, pp: 30, maxPp: 30, description: '' }];
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];
  const afterHaze = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterHaze.playerTeam[0].statStages?.attack, 0);
  assert.equal(afterHaze.opponentTeam[0].statStages?.spAtk, 0);

  // 2. Taunt disables status moves for 3 turns
  afterHaze.playerTeam[0].moves[0] = { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, maxPp: 20, description: '' };
  const afterTaunt = executeBattleTurn(afterHaze, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterTaunt.opponentTeam[0].isTaunted, true);
  assert.equal(afterTaunt.opponentTeam[0].tauntTurns, 2);

  // 3. Trick Room reverses speed order
  assert.ok(calculateEffectiveSpeed(p2) > calculateEffectiveSpeed(p1), 'Jolteon normally outspeeds Spiritomb');
  afterTaunt.playerTeam[0].moves[0] = { id: 'trick_room', name: 'Trick Room', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 5, maxPp: 5, description: '' };
  const afterTR = executeBattleTurn(afterTaunt, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterTR.trickRoomTurns, 4); // Set to 5 and decremented at end of turn
});
test('Move Mechanics: Skill Link guarantees max multi-hit strikes (Icicle Spear / Rock Blast)', () => {
  const cloyster = createTestMon('cloyster', 'Cloyster', ['Water', 'Ice'], { hp: 300, attack: 300, defense: 400, spAtk: 200, spDef: 150, speed: 200 }, { ability: 'Skill Link' });
  const snorlax = createTestMon('snorlax', 'Snorlax', ['Normal'], { hp: 1000, attack: 200, defense: 200, spAtk: 150, spDef: 250, speed: 100 });
  const icicleSpear = enrichMoveWithMechanics({ id: 'icicle_spear', name: 'Icicle Spear', type: 'Ice', category: 'Physical', power: 25, accuracy: 100, pp: 30, maxPp: 30, description: '' });

  const state = initializeBattle([cloyster], [snorlax]);
  state.playerTeam[0].moves = [icicleSpear];
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  const afterTurn = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.1 });
  assert.ok(afterTurn.combatLog.some((cl) => cl.message.includes('Hit 5 time(s)!')), 'Skill Link Cloyster hits exactly 5 times with Icicle Spear');
});

test('Move Mechanics: Brick Break shatters opponent Reflect and Light Screen', () => {
  const lucario = createTestMon('lucario', 'Lucario', ['Fighting', 'Steel'], { hp: 300, attack: 300, defense: 200, spAtk: 300, spDef: 200, speed: 250 });
  const defender = createTestMon('def', 'Chansey', ['Normal'], { hp: 600, attack: 50, defense: 50, spAtk: 100, spDef: 300, speed: 100 });
  const brickBreak = enrichMoveWithMechanics({ id: 'brick_break', name: 'Brick Break', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 15, maxPp: 15, description: '' });

  const state = initializeBattle([lucario], [defender]);
  state.opponentSideConditions = { reflectTurns: 5, lightScreenTurns: 5 };
  state.playerTeam[0].moves = [brickBreak];
  state.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  const afterBreak = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterBreak.opponentSideConditions?.reflectTurns, 0, 'Reflect shattered');
  assert.equal(afterBreak.opponentSideConditions?.lightScreenTurns, 0, 'Light Screen shattered');
  assert.ok(afterBreak.combatLog.some((cl) => cl.message.includes('shattered the foe\'s Reflect and Light Screen')));
});

test('Move Mechanics: High Jump Kick crashes for 50% max HP recoil on Protect or Miss', () => {
  const hitmonlee = createTestMon('hitmonlee', 'Hitmonlee', ['Fighting'], { hp: 300, attack: 350, defense: 150, spAtk: 100, spDef: 250, speed: 250 });
  const defender = createTestMon('def', 'Snorlax', ['Normal'], { hp: 600, attack: 200, defense: 200, spAtk: 150, spDef: 250, speed: 100 });
  const hjk = enrichMoveWithMechanics({ id: 'high_jump_kick', name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 130, accuracy: 90, pp: 10, maxPp: 10, description: '' });
  const protect = { id: 'protect', name: 'Protect', type: 'Normal' as const, category: 'Status' as const, power: 0, accuracy: 100, pp: 10, maxPp: 10, priority: 4, description: '', isProtect: true };

  // 1. Crash on Protect
  const state = initializeBattle([hitmonlee], [defender]);
  state.playerTeam[0].moves = [hjk];
  state.opponentTeam[0].moves = [protect];

  const afterProtectCrash = executeBattleTurn(state, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.5 });
  assert.equal(afterProtectCrash.playerTeam[0].currentHp, 300 - 150, 'Attacker loses 50% max HP upon crashing into Protect');
  assert.ok(afterProtectCrash.combatLog.some((cl) => cl.message.includes('kept going and crashed')));

  // 2. Crash on Miss
  const stateMiss = initializeBattle([hitmonlee], [defender]);
  stateMiss.playerTeam[0].moves = [hjk];
  stateMiss.opponentTeam[0].moves = [{ id: 'splash', name: 'Splash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, maxPp: 40, description: '' }];

  // Force miss with high rng roll > 90
  const afterMissCrash = executeBattleTurn(stateMiss, { type: 'move', moveIndex: 0 }, { type: 'move', moveIndex: 0 }, { rng: () => 0.95 });
  assert.equal(afterMissCrash.playerTeam[0].currentHp, 300 - 150, 'Attacker loses 50% max HP upon missing High Jump Kick');
});

test('Move Mechanics: Fixed Damage moves (Night Shade / Seismic Toss) deal exact flat HP with immunity checks', () => {
  const gengar = createTestMon('gengar', 'Gengar', ['Ghost', 'Poison'], { hp: 300, attack: 150, defense: 150, spAtk: 350, spDef: 200, speed: 300 });
  const snorlax = createTestMon('snorlax', 'Snorlax', ['Normal'], { hp: 500, attack: 200, defense: 200, spAtk: 150, spDef: 250, speed: 100 });
  const alakazam = createTestMon('alakazam', 'Alakazam', ['Psychic'], { hp: 300, attack: 100, defense: 100, spAtk: 350, spDef: 250, speed: 300 });

  const nightShade = enrichMoveWithMechanics({ id: 'night_shade', name: 'Night Shade', type: 'Ghost', category: 'Special', power: 0, accuracy: 100, pp: 15, maxPp: 15, description: '' });

  // 1. Ghost vs Normal is Immune (0 damage)
  const dmgImmune = calculateDamage(gengar, snorlax, nightShade, { rngVariance: 1.0 });
  assert.equal(dmgImmune.damage, 0);
  assert.equal(dmgImmune.effectiveness, 0);

  // 2. Ghost vs Psychic deals flat 100 HP
  const dmgNeutral = calculateDamage(gengar, alakazam, nightShade, { rngVariance: 1.0 });
  assert.equal(dmgNeutral.damage, 100, 'Night Shade deals exact flat 100 HP damage');
});

test('Move Mechanics: Storm Throw always lands a guaranteed critical hit', () => {
  const throh = createTestMon('throh', 'Throh', ['Fighting'], { hp: 400, attack: 300, defense: 250, spAtk: 100, spDef: 250, speed: 150 });
  const snorlax = createTestMon('snorlax', 'Snorlax', ['Normal'], { hp: 500, attack: 200, defense: 200, spAtk: 150, spDef: 250, speed: 100 });
  const stormThrow = enrichMoveWithMechanics({ id: 'storm_throw', name: 'Storm Throw', type: 'Fighting', category: 'Physical', power: 60, accuracy: 100, pp: 10, maxPp: 10, description: '' });

  const res = calculateDamage(throh, snorlax, stormThrow, { rngVariance: 1.0 });
  assert.equal(res.isCrit, true, 'Storm Throw with critRatioBonus: 3 always crits');
});

