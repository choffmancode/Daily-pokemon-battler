/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ShowdownProtocolParser,
  parseShowdownChoice,
  formatShowdownChoice,
  generateShowdownRequest,
} from './showdownProtocol';
import { ShowdownHeuristicAgent } from './showdownAgent';
import {
  calculateEffectiveSpeed,
  executeBattleTurnWithShowdownChoice,
  initializeBattle,
} from '../battleEngine';
import { BEGINNER_TEAMS, CHAMPION_RED_TEAM } from '../constants';

const SAMPLE_6V6_SHOWDOWN_LOG = `|start
|gen|9
|tier|[Gen 9] OU
|gametype|singles
|player|p1|Agent_Alpha|avatar|1|
|player|p2|Agent_Beta|avatar|2|
|teamsize|p1|6
|teamsize|p2|6
|teampreview

|start

|switch|p1a: Great Tusk|Great Tusk, L100|100/100
|switch|p2a: Glimmora|Glimmora, L100, F|100/100
|-ability|p1a: Great Tusk|Protosynthesis|[silent]

|turn|1
|move|p1a: Great Tusk|Earthquake|p2a: Glimmora
|-supereffective|p2a: Glimmora
|-damage|p2a: Glimmora|0 Faint
|-ability|p2a: Glimmora|Toxic Debris|[from] move: Earthquake
|-sidestart|p1: Agent_Alpha|Spikes
|faint|p2a: Glimmora

|upkeep

|switch|p2a: Dragapult|Dragapult, L100, M|100/100

|turn|2
|switch|p1a: Kingambit|Kingambit, L100, M|100/100
|-damage|p1a: Kingambit|88/100|[from] Spikes
|move|p2a: Dragapult|Draco Meteor|p1a: Kingambit
|-resisted|p1a: Kingambit
|-damage|p1a: Kingambit|64/100
|-unboost|p2a: Dragapult|spa|2

|turn|3
|move|p2a: Dragapult|U-turn|p1a: Kingambit
|-damage|p1a: Kingambit|52/100
|switch|p2a: Great Tusk|Great Tusk, L100|100/100|[from] U-turn
|move|p1a: Kingambit|Kowtow Cleave|p2a: Great Tusk
|-resisted|p2a: Great Tusk
|-damage|p2a: Great Tusk|81/100

|turn|4
|move|p2a: Great Tusk|Close Combat|p1a: Kingambit
|-supereffective|p1a: Kingambit
|-damage|p1a: Kingambit|0 Faint
|-unboost|p2a: Great Tusk|def|1
|-unboost|p2a: Great Tusk|spd|1
|faint|p1a: Kingambit
|-ability|p1a: Kingambit|Supreme Overlord|[silent]

|upkeep

|switch|p1a: Iron Valiant|Iron Valiant, L100|100/100
|-damage|p1a: Iron Valiant|88/100|[from] Spikes
|-enditem|p1a: Iron Valiant|Booster Energy
|-activate|p1a: Iron Valiant|ability: Quark Drive|[fromitem]
|-start|p1a: Iron Valiant|quarkdriveactive|spe

|turn|5
|move|p1a: Iron Valiant|Moonblast|p2a: Great Tusk
|-supereffective|p2a: Great Tusk
|-damage|p2a: Great Tusk|0 Faint
|faint|p2a: Great Tusk

|upkeep

|switch|p2a: Gholdengo|Gholdengo, L100|100/100

|turn|6
|switch|p1a: Zarel_Test_1|Volcarona, L100, F|100/100
|-damage|p1a: Zarel_Test_1|88/100|[from] Spikes
|move|p2a: Gholdengo|Make It Rain|p1a: Zarel_Test_1
|-resisted|p1a: Zarel_Test_1
|-damage|p1a: Zarel_Test_1|62/100
|-unboost|p2a: Gholdengo|spa|1

|turn|7
|move|p1a: Zarel_Test_1|Quiver Dance|p1a: Zarel_Test_1
|-boost|p1a: Zarel_Test_1|spa|1
|-boost|p1a: Zarel_Test_1|spd|1
|-boost|p1a: Zarel_Test_1|spe|1
|move|p2a: Gholdengo|Shadow Ball|p1a: Zarel_Test_1
|-damage|p1a: Zarel_Test_1|41/100

|turn|8
|move|p1a: Zarel_Test_1|Fiery Dance|p2a: Gholdengo
|-supereffective|p2a: Gholdengo
|-damage|p2a: Gholdengo|0 Faint
|faint|p2a: Gholdengo

|upkeep

|switch|p2a: Cinderace|Cinderace, L100, M|100/100

|turn|9
|move|p1a: Zarel_Test_1|Fiery Dance|p2a: Cinderace
|-resisted|p2a: Cinderace
|-damage|p2a: Cinderace|54/100
|move|p2a: Cinderace|Pyro Ball|p1a: Zarel_Test_1
|-damage|p1a: Zarel_Test_1|0 Faint
|faint|p1a: Zarel_Test_1

|upkeep

|switch|p1a: Roaring Moon|Roaring Moon, L100|100/100
|-damage|p1a: Roaring Moon|88/100|[from] Spikes

|turn|10
|move|p1a: Roaring Moon|Knock Off|p2a: Cinderace
|-damage|p2a: Cinderace|0 Faint
|-enditem|p2a: Cinderace|Heavy-Duty Boots|[from] move: Knock Off
|faint|p2a: Cinderace

|upkeep

|switch|p2a: Rillaboom|Rillaboom, L100, F|100/100
|-fieldstart|move: Grassy Terrain

|turn|11
|move|p1a: Roaring Moon|Acrobatics|p2a: Rillaboom
|-supereffective|p2a: Rillaboom
|-damage|p2a: Rillaboom|12/100
|move|p2a: Rillaboom|U-turn|p1a: Roaring Moon
|-supereffective|p1a: Roaring Moon
|-damage|p1a: Roaring Moon|38/100
|switch|p2a: Dragapult|Dragapult, L100, M|100/100|[from] U-turn
|-heal|p1a: Roaring Moon|44/100|[from] Grassy Terrain

|turn|12
|move|p2a: Dragapult|Draco Meteor|p1a: Roaring Moon
|-supereffective|p1a: Roaring Moon
|-damage|p1a: Roaring Moon|0 Faint
|-unboost|p2a: Dragapult|spa|2
|faint|p1a: Roaring Moon

|upkeep

|switch|p1a: Iron Valiant|Iron Valiant, L100|88/100
|-damage|p1a: Iron Valiant|76/100|[from] Spikes

|turn|13
|move|p1a: Iron Valiant|Moonblast|p2a: Dragapult
|-supereffective|p2a: Dragapult
|-damage|p2a: Dragapult|0 Faint
|faint|p2a: Dragapult

|upkeep

|switch|p2a: Rillaboom|Rillaboom, L100, F|12/100

|turn|14
|move|p1a: Iron Valiant|Moonblast|p2a: Rillaboom
|-damage|p2a: Rillaboom|0 Faint
|faint|p2a: Rillaboom

|win|p1`;

test('Showdown parser reconstructs state from comprehensive 6v6 protocol log', () => {
  const parser = new ShowdownProtocolParser();
  parser.parseStream(SAMPLE_6V6_SHOWDOWN_LOG);
  const state = parser.getState();

  assert.equal(state.gen, 9);
  assert.equal(state.tier, '[Gen 9] OU');
  assert.equal(state.p1.name, 'Agent_Alpha');
  assert.equal(state.p2.name, 'Agent_Beta');
  assert.equal(state.turn, 14);
  assert.equal(state.p1.hazards.spikes, 1);
  assert.equal(state.terrain, 'Grassy Terrain');
  assert.equal(state.winner, 'p1');

  // Verify active Pokemon is Iron Valiant with accurate remaining HP
  assert.ok(state.p1.active);
  assert.equal(state.p1.active?.species, 'Iron Valiant');
  assert.equal(state.p1.active?.currentHp, 76);

  // Verify Rillaboom is fainted
  assert.ok(state.p2.active);
  assert.equal(state.p2.active?.species, 'Rillaboom');
  assert.equal(state.p2.active?.fainted, true);
});

test('Showdown choice parser and formatter handle move and switch commands', () => {
  assert.deepEqual(parseShowdownChoice('/choose move 1'), { type: 'move', index: 0 });
  assert.deepEqual(parseShowdownChoice('/choose switch 4'), { type: 'switch', index: 3 });
  assert.deepEqual(parseShowdownChoice('move 2'), { type: 'move', index: 1 });
  assert.deepEqual(parseShowdownChoice('switch 3'), { type: 'switch', index: 2 });

  assert.equal(formatShowdownChoice('move', 0), '/choose move 1');
  assert.equal(formatShowdownChoice('switch', 2), '/choose switch 3');
});

test('Showdown request generator builds schema-compliant JSON', () => {
  const team = BEGINNER_TEAMS[0].team;
  const request = generateShowdownRequest('p1', 'Player 1', team[0], team, 1);

  assert.equal(request.rqid, 1);
  assert.equal(request.side.id, 'p1');
  assert.equal(request.side.pokemon.length, 6);
  assert.ok(request.active);
  assert.equal(request.active[0].moves.length, 4);
});

test('Showdown heuristic agent selects valid /choose actions', () => {
  const team = BEGINNER_TEAMS[0].team;
  const request = generateShowdownRequest('p1', 'Player 1', team[0], team, 1);
  const agent = new ShowdownHeuristicAgent('TestAgent');

  const action = agent.chooseAction(request);
  assert.ok(action.startsWith('/choose move ') || action.startsWith('/choose switch '));
});

test('In-engine turn execution with Showdown choices updates protocol stream and state', () => {
  const team = BEGINNER_TEAMS[0].team;
  const state = initializeBattle(team, CHAMPION_RED_TEAM);

  assert.ok(state.protocolLog && state.protocolLog.length > 5);
  assert.ok(state.protocolLog.includes('|start'));
  assert.ok(state.protocolLog.includes('|-weather|Hail'));

  const nextState = executeBattleTurnWithShowdownChoice(state, '/choose move 1', '/choose move 1');

  assert.equal(nextState.turnNumber, 2);
  assert.ok(nextState.protocolLog?.some((l) => l.startsWith('|turn|2')));
  assert.ok(nextState.protocolLog?.some((l) => l.startsWith('|move|')));
});

test('Effective speed respects stat stages and status conditions', () => {
  const baseMon = BEGINNER_TEAMS[0].team[0];
  const regularSpeed = calculateEffectiveSpeed(baseMon);
  assert.equal(regularSpeed, baseMon.baseStats.speed);

  // +1 speed stage (1.5x)
  const boostedMon = {
    ...baseMon,
    statStages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 1 },
  };
  assert.equal(calculateEffectiveSpeed(boostedMon), Math.floor(baseMon.baseStats.speed * 1.5));

  // Paralysis (0.5x)
  const paralyzedMon = {
    ...baseMon,
    statusCondition: 'paralysis' as const,
  };
  assert.equal(calculateEffectiveSpeed(paralyzedMon), Math.floor(baseMon.baseStats.speed * 0.5));
});

test('GeminiBattleAgent operates with Showdown requests and structured fallback', async () => {
  const { GeminiBattleAgent } = await import('./geminiBattleAgent');
  const agent = new GeminiBattleAgent();

  const team = BEGINNER_TEAMS[0].team;
  const request = generateShowdownRequest('p1', 'Player 1', team[0], team, 1);

  // Synchronous ShowdownAgent interface
  const syncAction = agent.chooseAction(request);
  assert.ok(syncAction.startsWith('/choose move ') || syncAction.startsWith('/choose switch '));

  // Asynchronous decision with tactical reasoning
  const asyncDecision = await agent.chooseActionWithGemini(request, ['|turn|1']);
  assert.ok(asyncDecision.choice.startsWith('/choose '));
  assert.ok(asyncDecision.tacticalReasoning.length > 0);
  assert.ok(asyncDecision.winConditionPath.length > 0);
});
