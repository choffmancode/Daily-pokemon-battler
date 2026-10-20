import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Pokemon, Move, PokemonType } from './types';
import {
  scoreAIMoves,
  selectBestRevengeSwitch,
  selectAdvancedAIMoveOrSwitch,
  isSetupMove,
  isRecoveryMove,
  isHazardMove,
  isPivotMove,
} from './advancedAI';

const createDummyPokemon = (overrides?: Partial<Pokemon>): Pokemon => ({
  id: 'dummy_mon',
  species: 'DummyMon',
  nationalDex: 1,
  types: ['Normal'],
  level: 50,
  maxHp: 200,
  currentHp: 200,
  baseStats: { hp: 100, attack: 100, defense: 100, spAtk: 100, spDef: 100, speed: 100 },
  statStages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
  moves: [],
  spriteFront: '',
  spriteBack: '',
  ability: 'Neutralizing Gas',
  abilityDescription: 'Neutralizes abilities.',
  fainted: false,
  ...overrides,
});

const createDamagingMove = (
  id: string,
  name: string,
  type: PokemonType,
  power: number,
  category: 'Physical' | 'Special' = 'Physical',
  overrides?: Partial<Move>
): Move => ({
  id,
  name,
  type,
  category,
  power,
  accuracy: 100,
  pp: 15,
  maxPp: 15,
  description: `${name} attack move.`,
  ...overrides,
});

const createStatusMove = (
  id: string,
  name: string,
  type: PokemonType,
  accuracy: number = 100,
  pp: number = 20,
  overrides?: Partial<Move>
): Move => ({
  id,
  name,
  type,
  category: 'Status',
  power: 0,
  accuracy,
  pp,
  maxPp: pp,
  description: `${name} status move.`,
  ...overrides,
});

describe('Advanced Battle AI Decision Engine (8-Layer CFRU Matrix)', () => {
  it('helper classification functions recognize setup, recovery, hazard, and pivot moves', () => {
    assert.strictEqual(isSetupMove('swords_dance'), true);
    assert.strictEqual(isSetupMove('calm_mind'), true);
    assert.strictEqual(isSetupMove('cotton_guard'), true);
    assert.strictEqual(isSetupMove('growth'), true);
    assert.strictEqual(isSetupMove('tackle'), false);

    assert.strictEqual(isRecoveryMove('recover'), true);
    assert.strictEqual(isRecoveryMove('roost'), true);
    assert.strictEqual(isRecoveryMove('flamethrower'), false);

    assert.strictEqual(isHazardMove('stealth_rock'), true);
    assert.strictEqual(isHazardMove('spikes'), true);
    assert.strictEqual(isHazardMove('toxic_spikes'), true);

    assert.strictEqual(isPivotMove('volt_switch'), true);
    assert.strictEqual(isPivotMove('u_turn'), true);
  });

  describe('Layer 1: Hard Invalidation Filter', () => {
    it('invalidates Ground moves against Flying types and Levitate ability', () => {
      const aiMon = createDummyPokemon({
        moves: [
          createDamagingMove('earthquake', 'Earthquake', 'Ground', 100),
          createDamagingMove('slash', 'Slash', 'Normal', 70),
        ],
      });
      const flyingPlayer = createDummyPokemon({ types: ['Flying'] });
      const levitatePlayer = createDummyPokemon({ types: ['Poison'], ability: 'Levitate' });

      const scoresFlying = scoreAIMoves(aiMon, flyingPlayer, [aiMon]);
      assert.strictEqual(scoresFlying[0].score, 0);
      assert.ok(scoresFlying[0].reasons.includes('TYPE_IMMUNITY_ZERO'));
      assert.ok(scoresFlying[1].score > 0);

      const scoresLevitate = scoreAIMoves(aiMon, levitatePlayer, [aiMon]);
      assert.strictEqual(scoresLevitate[0].score, 0);
      assert.ok(scoresLevitate[0].reasons.includes('TYPE_IMMUNITY_ZERO'));
    });

    it('invalidates status moves against already statused targets or behind Substitute', () => {
      const aiMon = createDummyPokemon({
        moves: [
          createStatusMove('hypnosis', 'Hypnosis', 'Psychic', 60),
          createStatusMove('thunder_wave', 'Thunder Wave', 'Electric', 90),
          createDamagingMove('tackle', 'Tackle', 'Normal', 40),
        ],
      });

      const sleepingPlayer = createDummyPokemon({ statusCondition: 'sleep' });
      const scoresSleep = scoreAIMoves(aiMon, sleepingPlayer, [aiMon]);
      assert.strictEqual(scoresSleep[0].score, 0);
      assert.ok(scoresSleep[0].reasons.includes('SLEEP_ON_STATUSED'));

      const subPlayer = createDummyPokemon({ substituteHp: 50 });
      const scoresSub = scoreAIMoves(aiMon, subPlayer, [aiMon]);
      assert.strictEqual(scoresSub[0].score, 0);
      assert.strictEqual(scoresSub[1].score, 0);
    });

    it('invalidates stat boosting when already maxed at +6 and Substitute with insufficient HP', () => {
      const aiMaxBoost = createDummyPokemon({
        currentHp: 40,
        maxHp: 200, // 20% HP (<= 25%)
        statStages: { attack: 6, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
        moves: [
          createStatusMove('swords_dance', 'Swords Dance', 'Normal', 100),
          createStatusMove('substitute', 'Substitute', 'Normal', 100, 10),
        ],
      });
      const player = createDummyPokemon();

      const scores = scoreAIMoves(aiMaxBoost, player, [aiMaxBoost]);
      assert.strictEqual(scores[0].score, 0);
      assert.ok(scores[0].reasons.includes('STAT_AT_MAX'));
      assert.strictEqual(scores[1].score, 0);
      assert.ok(scores[1].reasons.includes('SUBSTITUTE_INVALID'));
    });

    it('invalidates moves according to held items, taunt, and choice lock', () => {
      // 1. Air Balloon Ground immunity
      const aiEarthquake = createDummyPokemon({
        moves: [
          createDamagingMove('earthquake', 'Earthquake', 'Ground', 100),
          createDamagingMove('rock_slide', 'Rock Slide', 'Rock', 75),
        ],
      });
      const balloonPlayer = createDummyPokemon({ heldItem: 'Air Balloon' });
      const balloonScores = scoreAIMoves(aiEarthquake, balloonPlayer, [aiEarthquake]);
      assert.strictEqual(balloonScores[0].score, 0);
      assert.ok(balloonScores[0].reasons.includes('AIR_BALLOON_IMMUNITY'));
      assert.ok(balloonScores[1].score > 0);

      // 2. Taunted AI cannot use status moves
      const tauntedAI = createDummyPokemon({
        isTaunted: true,
        tauntTurns: 3,
        moves: [
          createStatusMove('toxic', 'Toxic', 'Poison'),
          createDamagingMove('sludge_bomb', 'Sludge Bomb', 'Poison', 90, 'Special'),
        ],
      });
      const player = createDummyPokemon();
      const tauntScores = scoreAIMoves(tauntedAI, player, [tauntedAI]);
      assert.strictEqual(tauntScores[0].score, 0);
      assert.ok(tauntScores[0].reasons.includes('TAUNTED_STATUS'));
      assert.ok(tauntScores[1].score > 0);

      // 3. Assault Vest AI cannot use status moves
      const vestAI = createDummyPokemon({
        heldItem: 'Assault Vest',
        moves: [
          createStatusMove('recover', 'Recover', 'Normal'),
          createDamagingMove('surf', 'Surf', 'Water', 90, 'Special'),
        ],
      });
      const vestScores = scoreAIMoves(vestAI, player, [vestAI]);
      assert.strictEqual(vestScores[0].score, 0);
      assert.ok(vestScores[0].reasons.includes('ASSAULT_VEST_STATUS'));
      assert.ok(vestScores[1].score > 0);

      // 4. Choice locked AI must choose only locked move
      const choiceAI = createDummyPokemon({
        heldItem: 'Choice Band',
        choiceLockedMove: 'outrage',
        moves: [
          createDamagingMove('earthquake', 'Earthquake', 'Ground', 100),
          createDamagingMove('outrage', 'Outrage', 'Dragon', 120),
        ],
      });
      const choiceScores = scoreAIMoves(choiceAI, player, [choiceAI]);
      assert.strictEqual(choiceScores[0].score, -999);
      assert.ok(choiceScores[0].reasons.includes('CHOICE_LOCKED'));
      assert.ok(choiceScores[1].score > 0);
    });
  });

  describe('Layer 2: Lethal Knockout & Speed Tier Evaluation', () => {
    it('prioritizes guaranteed lethal move when AI outspeeds', () => {
      const aiMon = createDummyPokemon({
        baseStats: { hp: 100, attack: 130, defense: 100, spAtk: 60, spDef: 100, speed: 120 },
        moves: [
          createDamagingMove('earthquake', 'Earthquake', 'Ground', 100),
          createDamagingMove('quick_attack', 'Quick Attack', 'Normal', 40, 'Physical', { priority: 1 }),
        ],
      });
      const lowHpPlayer = createDummyPokemon({
        currentHp: 50,
        maxHp: 200,
        baseStats: { hp: 100, attack: 80, defense: 80, spAtk: 80, spDef: 80, speed: 80 },
      });

      const scores = scoreAIMoves(aiMon, lowHpPlayer, [aiMon]);
      const eqScore = scores.find((s) => s.move.id === 'earthquake')!;
      assert.ok(eqScore.reasons.includes('GUARANTEED_LETHAL_FAST'));
      assert.ok(eqScore.score >= 135);
    });

    it('favors priority revenge move when AI is slower and faces lethal player damage', () => {
      const slowAIMon = createDummyPokemon({
        currentHp: 30,
        maxHp: 200,
        baseStats: { hp: 100, attack: 120, defense: 60, spAtk: 60, spDef: 60, speed: 40 },
        moves: [
          createDamagingMove('stone_edge', 'Stone Edge', 'Rock', 100, 'Physical', { accuracy: 80 }),
          createDamagingMove('mach_punch', 'Mach Punch', 'Fighting', 40, 'Physical', { priority: 1 }),
        ],
      });
      const fastThreateningPlayer = createDummyPokemon({
        currentHp: 20, // Low enough for Mach Punch to kill
        maxHp: 200,
        baseStats: { hp: 100, attack: 150, defense: 70, spAtk: 70, spDef: 70, speed: 130 },
        moves: [createDamagingMove('close_combat', 'Close Combat', 'Fighting', 120)],
      });

      const scores = scoreAIMoves(slowAIMon, fastThreateningPlayer, [slowAIMon]);
      const machPunch = scores.find((s) => s.move.id === 'mach_punch')!;
      const stoneEdge = scores.find((s) => s.move.id === 'stone_edge')!;

      assert.ok(machPunch.reasons.includes('LETHAL_PRIORITY_REVENGE'));
      assert.ok(machPunch.score > stoneEdge.score);
    });

    it('awards accuracy reliability bonus for 100% accurate lethal moves over inaccurate moves', () => {
      const aiMon = createDummyPokemon({
        moves: [
          createDamagingMove('hyper_voice', 'Hyper Voice', 'Normal', 90, 'Special', { accuracy: 100 }),
          createDamagingMove('focus_blast', 'Focus Blast', 'Fighting', 120, 'Special', { accuracy: 70 }),
        ],
      });
      const player = createDummyPokemon({ currentHp: 40 });

      const scores = scoreAIMoves(aiMon, player, [aiMon]);
      const hv = scores.find((s) => s.move.id === 'hyper_voice')!;
      const fb = scores.find((s) => s.move.id === 'focus_blast')!;

      assert.ok(hv.reasons.includes('ACCURACY_RELIABILITY_BONUS'));
      assert.ok(fb.reasons.includes('INACCURATE_RISK_PENALTY'));
      assert.ok(hv.score > fb.score);
    });
  });

  describe('Layer 3: Setup Sweeper Windows', () => {
    it('penalizes setup when AI already has a guaranteed lethal move ready', () => {
      const aiMon = createDummyPokemon({
        moves: [
          createDamagingMove('surf', 'Surf', 'Water', 90, 'Special'),
          createStatusMove('swords_dance', 'Swords Dance', 'Normal', 100),
        ],
      });
      const criticallyLowPlayer = createDummyPokemon({ currentHp: 15, maxHp: 200 });

      const scores = scoreAIMoves(aiMon, criticallyLowPlayer, [aiMon]);
      const sdScore = scores.find((s) => s.move.id === 'swords_dance')!;

      assert.ok(sdScore.reasons.includes('FORGO_SETUP_FOR_LETHAL'));
      assert.ok(sdScore.score <= 50);
    });

    it('rewards setup during a safe window against an asleep/passive player', () => {
      const aiMon = createDummyPokemon({
        currentHp: 190,
        maxHp: 200,
        moves: [
          createDamagingMove('water_gun', 'Water Gun', 'Water', 40, 'Special'),
          createStatusMove('calm_mind', 'Calm Mind', 'Psychic', 100),
        ],
      });
      const sleepingPlayer = createDummyPokemon({
        statusCondition: 'sleep',
        currentHp: 200,
        maxHp: 200,
      });

      const scores = scoreAIMoves(aiMon, sleepingPlayer, [aiMon]);
      const cmScore = scores.find((s) => s.move.id === 'calm_mind')!;

      assert.ok(cmScore.reasons.includes('SAFE_SETUP_SWEEPER_WINDOW'));
      assert.ok(cmScore.score >= 125);
    });
  });

  describe('Layer 4: Recovery & Sustained Stall Logic', () => {
    it('zeros out recovery move when AI is above 70% HP (overheal penalty)', () => {
      const aiMon = createDummyPokemon({
        currentHp: 180,
        maxHp: 200, // 90% HP
        moves: [
          createStatusMove('recover', 'Recover', 'Normal', 100, 10),
          createDamagingMove('tackle', 'Tackle', 'Normal', 40),
        ],
      });
      const player = createDummyPokemon();

      const scores = scoreAIMoves(aiMon, player, [aiMon]);
      const rec = scores.find((s) => s.move.id === 'recover')!;

      assert.strictEqual(rec.score, 0);
      assert.ok(rec.reasons.includes('OVERHEAL_PENALTY'));
    });

    it('boosts recovery in the sweet spot (25-50% HP) when taking manageable damage', () => {
      const aiMon = createDummyPokemon({
        currentHp: 80,
        maxHp: 200, // 40% HP
        moves: [
          createStatusMove('roost', 'Roost', 'Flying', 100, 10),
          createDamagingMove('air_slash', 'Air Slash', 'Flying', 75, 'Special'),
        ],
      });
      const weakPlayer = createDummyPokemon({
        moves: [createDamagingMove('scratch', 'Scratch', 'Normal', 40)],
      });

      const scores = scoreAIMoves(aiMon, weakPlayer, [aiMon]);
      const roost = scores.find((s) => s.move.id === 'roost')!;

      assert.ok(roost.reasons.includes('RECOVERY_SWEET_SPOT'));
      assert.ok(roost.score >= 125);
    });

    it('discards recovery in the danger zone (< 25% HP) if slower mon is facing lethal damage', () => {
      const slowMon = createDummyPokemon({
        currentHp: 25,
        maxHp: 200, // 12.5% HP
        baseStats: { hp: 100, attack: 100, defense: 60, spAtk: 100, spDef: 60, speed: 40 },
        moves: [
          createStatusMove('recover', 'Recover', 'Normal', 100, 10),
          createDamagingMove('flamethrower', 'Flamethrower', 'Fire', 90, 'Special'),
        ],
      });
      const lethalFastPlayer = createDummyPokemon({
        baseStats: { hp: 100, attack: 120, defense: 80, spAtk: 120, spDef: 80, speed: 100 },
        moves: [createDamagingMove('hydro_pump', 'Hydro Pump', 'Water', 110, 'Special')],
      });

      const scores = scoreAIMoves(slowMon, lethalFastPlayer, [slowMon]);
      const rec = scores.find((s) => s.move.id === 'recover')!;

      assert.strictEqual(rec.score, 0);
      assert.ok(rec.reasons.includes('RECOVERY_DANGER_ATTACK_INSTEAD'));
    });
  });

  describe('Layer 5 & 6: Status & Entry Hazards', () => {
    it('boosts Will-O-Wisp against dangerous physical threats', () => {
      const aiMon = createDummyPokemon({
        moves: [
          createStatusMove('will_o_wisp', 'Will-O-Wisp', 'Fire', 85, 15),
        ],
      });
      const physicalMonster = createDummyPokemon({
        baseStats: { hp: 100, attack: 140, defense: 100, spAtk: 50, spDef: 80, speed: 90 },
        moves: [createDamagingMove('earthquake', 'Earthquake', 'Ground', 100)],
      });

      const scores = scoreAIMoves(aiMon, physicalMonster, [aiMon]);
      assert.ok(scores[0].reasons.includes('BURN_PHYSICAL_THREAT'));
      assert.strictEqual(scores[0].score, 122);
    });

    it('zeros out entry hazards if already active on player side or in late game', () => {
      const aiMon = createDummyPokemon({
        moves: [
          createStatusMove('stealth_rock', 'Stealth Rock', 'Rock', 100, 20),
        ],
      });
      const player = createDummyPokemon();

      // Stealth Rock already up
      const scoresAlreadyUp = scoreAIMoves(
        aiMon,
        player,
        [aiMon, createDummyPokemon(), createDummyPokemon()],
        { stealthRock: true }
      );
      assert.strictEqual(scoresAlreadyUp[0].score, 0);
      assert.ok(scoresAlreadyUp[0].reasons.includes('STEALTH_ROCK_ALREADY_UP'));

      // Late game: only 1 mon left
      const scoresLateGame = scoreAIMoves(aiMon, player, [aiMon]);
      assert.strictEqual(scoresLateGame[0].score, 0);
      assert.ok(scoresLateGame[0].reasons.includes('LATE_GAME_HAZARDS_USELESS'));
    });
  });

  describe('Layer 7: Pivot Momentum', () => {
    it('boosts pivot moves when facing an unfavorable type matchup', () => {
      const waterMon = createDummyPokemon({
        types: ['Water'],
        moves: [
          createDamagingMove('flip_turn', 'Flip Turn', 'Water', 60),
          createDamagingMove('tackle', 'Tackle', 'Normal', 40),
        ],
      });
      const electricThreat = createDummyPokemon({ types: ['Electric'] });

      const scores = scoreAIMoves(waterMon, electricThreat, [waterMon]);
      const pivotScore = scores.find((s) => s.move.id === 'flip_turn')!;

      assert.ok(pivotScore.reasons.includes('MOMENTUM_PIVOT_AWAY'));
      assert.ok(pivotScore.score > 100);
    });
  });

  describe('Layer 8: Smart Bench Replacement & Revenge Killing', () => {
    it('selects the ideal revenge killer with STAB resistance/immunity and lethal damage over a vulnerable mon', () => {
      const activeFainted = createDummyPokemon({ currentHp: 0, fainted: true });

      // Mon 1: Fire type taking 2x from Water
      const fireMon = createDummyPokemon({
        id: 'fire_mon',
        species: 'FireMon',
        types: ['Fire'],
        currentHp: 200,
        maxHp: 200,
        moves: [createDamagingMove('flamethrower', 'Flamethrower', 'Fire', 90, 'Special')],
      });

      // Mon 2: Grass/Electric mon that resists Water, outspeeds, and OHKOs player Water mon
      const electricRevengeMon = createDummyPokemon({
        id: 'electric_mon',
        species: 'ElectricMon',
        types: ['Electric'],
        currentHp: 200,
        maxHp: 200,
        baseStats: { hp: 100, attack: 100, defense: 80, spAtk: 130, spDef: 80, speed: 125 },
        moves: [createDamagingMove('thunderbolt', 'Thunderbolt', 'Electric', 90, 'Special')],
      });

      const team = [activeFainted, fireMon, electricRevengeMon];

      const playerWaterMon = createDummyPokemon({
        types: ['Water'],
        currentHp: 90,
        maxHp: 200,
        baseStats: { hp: 100, attack: 80, defense: 80, spAtk: 100, spDef: 80, speed: 90 },
      });

      const bestIdx = selectBestRevengeSwitch(team, playerWaterMon, 0);
      assert.strictEqual(bestIdx, 2); // ElectricMon chosen over FireMon
    });

    it('selectAdvancedAIMoveOrSwitch switches to revenge candidate if active is fainted', () => {
      const activeFainted = createDummyPokemon({ currentHp: 0, fainted: true });
      const healthyBenchMon = createDummyPokemon({
        currentHp: 200,
        maxHp: 200,
        moves: [createDamagingMove('tackle', 'Tackle', 'Normal', 40)],
      });
      const team = [activeFainted, healthyBenchMon];
      const player = createDummyPokemon();

      const action = selectAdvancedAIMoveOrSwitch(activeFainted, player, team);
      assert.strictEqual(action.type, 'switch');
      assert.strictEqual(action.targetPokemonIndex, 1);
    });
  });
});
