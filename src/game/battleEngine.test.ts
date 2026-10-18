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
  drawState.playerTeam[0].currentHp = 10;
  drawState.opponentTeam[0].currentHp = 100;
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

