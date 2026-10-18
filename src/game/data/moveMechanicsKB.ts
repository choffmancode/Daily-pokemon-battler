/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Canonical Pokémon Gen 3 / Gen 4 Move Mechanics & Secondary Effects Knowledge Base.
 * Single Source of Truth for:
 * 1. Attacking Move Secondary Stat Stage Changes (% chance to raise user stats or lower opponent stats)
 * 2. Attacking Move Self-Drawback Stat Drops (100% self stat reductions on hit, e.g., Close Combat, Superpower, Overheat)
 * 3. Attacking Move Secondary Status Inflictions (% chance to inflict Burn, Freeze, Paralysis, Poison, Toxic)
 * 4. Attacking Move Flinch Chances (% chance to flinch slower targets, doubled by Serene Grace)
 * 5. Recoil, HP Drain, Priority Brackets, Multi-Hit Ranges, and High Critical-Hit Ratios
 * 6. Status Move Stat Stage Boosts/Drops (Single-stat and Multi-stat setup moves like Swords Dance, Calm Mind, Dragon Dance)
 */

import { Move, SecondaryEffectSpec, StatChangeSpec, StatusCondition, WeatherType } from '../types';

export interface MoveMechanicsEntry {
  id: string;
  name: string;
  priority?: number;
  statusEffect?: StatusCondition;
  statChange?: StatChangeSpec;
  statChanges?: StatChangeSpec[];
  secondaryEffect?: SecondaryEffectSpec;
  recoil?: number;
  drain?: number;
  multiHit?: [number, number];
  critRatioBonus?: number;
  isProtect?: boolean;
  isSubstitute?: boolean;
  weatherEffect?: WeatherType;
  healFraction?: number;
  isPivot?: boolean;
  isBatonPass?: boolean;
  infallible?: boolean;
  rechargeTurn?: boolean;
  causesConfusion?: boolean;
  entryHazard?: 'stealth_rock' | 'spikes' | 'toxic_spikes' | 'sticky_web';
  clearsHazards?: boolean;
}

const ALL_COMBAT_STATS_BOOST_1: StatChangeSpec[] = [
  { stat: 'attack', stages: 1, target: 'self' },
  { stat: 'defense', stages: 1, target: 'self' },
  { stat: 'spAtk', stages: 1, target: 'self' },
  { stat: 'spDef', stages: 1, target: 'self' },
  { stat: 'speed', stages: 1, target: 'self' },
];

export const MOVE_MECHANICS_KB: Record<string, MoveMechanicsEntry> = {
  /* ============================================================================
   * 1. ATTACKING MOVES — % CHANCE TO LOWER OPPONENT'S STATS
   * ============================================================================ */
  psychic: {
    id: 'psychic',
    name: 'Psychic',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  shadow_ball: {
    id: 'shadow_ball',
    name: 'Shadow Ball',
    secondaryEffect: {
      chance: 20,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  energy_ball: {
    id: 'energy_ball',
    name: 'Energy Ball',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  flash_cannon: {
    id: 'flash_cannon',
    name: 'Flash Cannon',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  focus_blast: {
    id: 'focus_blast',
    name: 'Focus Blast',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  earth_power: {
    id: 'earth_power',
    name: 'Earth Power',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  bug_buzz: {
    id: 'bug_buzz',
    name: 'Bug Buzz',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'spDef', stages: -1, target: 'opponent' },
    },
  },
  acid_spray: {
    id: 'acid_spray',
    name: 'Acid Spray',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'spDef', stages: -2, target: 'opponent' },
    },
  },
  crunch: {
    id: 'crunch',
    name: 'Crunch',
    secondaryEffect: {
      chance: 20,
      statChange: { stat: 'defense', stages: -1, target: 'opponent' },
    },
  },
  iron_tail: {
    id: 'iron_tail',
    name: 'Iron Tail',
    secondaryEffect: {
      chance: 30,
      statChange: { stat: 'defense', stages: -1, target: 'opponent' },
    },
  },
  rock_smash: {
    id: 'rock_smash',
    name: 'Rock Smash',
    secondaryEffect: {
      chance: 50,
      statChange: { stat: 'defense', stages: -1, target: 'opponent' },
    },
  },
  liquidation: {
    id: 'liquidation',
    name: 'Liquidation',
    secondaryEffect: {
      chance: 20,
      statChange: { stat: 'defense', stages: -1, target: 'opponent' },
    },
  },
  moonblast: {
    id: 'moonblast',
    name: 'Moonblast',
    secondaryEffect: {
      chance: 30,
      statChange: { stat: 'spAtk', stages: -1, target: 'opponent' },
    },
  },
  mist_ball: {
    id: 'mist_ball',
    name: 'Mist Ball',
    secondaryEffect: {
      chance: 50,
      statChange: { stat: 'spAtk', stages: -1, target: 'opponent' },
    },
  },
  snarl: {
    id: 'snarl',
    name: 'Snarl',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'spAtk', stages: -1, target: 'opponent' },
    },
  },
  play_rough: {
    id: 'play_rough',
    name: 'Play Rough',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'attack', stages: -1, target: 'opponent' },
    },
  },
  aurora_beam: {
    id: 'aurora_beam',
    name: 'Aurora Beam',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'attack', stages: -1, target: 'opponent' },
    },
  },
  icy_wind: {
    id: 'icy_wind',
    name: 'Icy Wind',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: -1, target: 'opponent' },
    },
  },
  rock_tomb: {
    id: 'rock_tomb',
    name: 'Rock Tomb',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: -1, target: 'opponent' },
    },
  },
  mud_shot: {
    id: 'mud_shot',
    name: 'Mud Shot',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: -1, target: 'opponent' },
    },
  },
  bulldoze: {
    id: 'bulldoze',
    name: 'Bulldoze',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: -1, target: 'opponent' },
    },
  },
  low_sweep: {
    id: 'low_sweep',
    name: 'Low Sweep',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: -1, target: 'opponent' },
    },
  },
  bubble_beam: {
    id: 'bubble_beam',
    name: 'Bubble Beam',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'speed', stages: -1, target: 'opponent' },
    },
  },

  /* ============================================================================
   * 2. ATTACKING MOVES — % CHANCE TO RAISE USER'S OWN STATS
   * ============================================================================ */
  meteor_mash: {
    id: 'meteor_mash',
    name: 'Meteor Mash',
    secondaryEffect: {
      chance: 20,
      statChange: { stat: 'attack', stages: 1, target: 'self' },
    },
  },
  ancient_power: {
    id: 'ancient_power',
    name: 'Ancient Power',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'attack', stages: 1, target: 'self' },
      statChanges: ALL_COMBAT_STATS_BOOST_1,
    },
  },
  silver_wind: {
    id: 'silver_wind',
    name: 'Silver Wind',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'attack', stages: 1, target: 'self' },
      statChanges: ALL_COMBAT_STATS_BOOST_1,
    },
  },
  ominous_wind: {
    id: 'ominous_wind',
    name: 'Ominous Wind',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'attack', stages: 1, target: 'self' },
      statChanges: ALL_COMBAT_STATS_BOOST_1,
    },
  },
  charge_beam: {
    id: 'charge_beam',
    name: 'Charge Beam',
    secondaryEffect: {
      chance: 70,
      statChange: { stat: 'spAtk', stages: 1, target: 'self' },
    },
  },
  fiery_dance: {
    id: 'fiery_dance',
    name: 'Fiery Dance',
    secondaryEffect: {
      chance: 50,
      statChange: { stat: 'spAtk', stages: 1, target: 'self' },
    },
  },
  flame_charge: {
    id: 'flame_charge',
    name: 'Flame Charge',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: 1, target: 'self' },
    },
  },
  power_up_punch: {
    id: 'power_up_punch',
    name: 'Power-Up Punch',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'attack', stages: 1, target: 'self' },
    },
  },
  metal_claw: {
    id: 'metal_claw',
    name: 'Metal Claw',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'attack', stages: 1, target: 'self' },
    },
  },
  steel_wing: {
    id: 'steel_wing',
    name: 'Steel Wing',
    secondaryEffect: {
      chance: 10,
      statChange: { stat: 'defense', stages: 1, target: 'self' },
    },
  },

  /* ============================================================================
   * 3. ATTACKING MOVES — 100% SELF STAT DROP DRAWBACKS ON HIT
   * ============================================================================ */
  close_combat: {
    id: 'close_combat',
    name: 'Close Combat',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'defense', stages: -1, target: 'self' },
      statChanges: [
        { stat: 'defense', stages: -1, target: 'self' },
        { stat: 'spDef', stages: -1, target: 'self' },
      ],
    },
  },
  superpower: {
    id: 'superpower',
    name: 'Superpower',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'attack', stages: -1, target: 'self' },
      statChanges: [
        { stat: 'attack', stages: -1, target: 'self' },
        { stat: 'defense', stages: -1, target: 'self' },
      ],
    },
  },
  overheat: {
    id: 'overheat',
    name: 'Overheat',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'spAtk', stages: -2, target: 'self' },
    },
  },
  draco_meteor: {
    id: 'draco_meteor',
    name: 'Draco Meteor',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'spAtk', stages: -2, target: 'self' },
    },
  },
  leaf_storm: {
    id: 'leaf_storm',
    name: 'Leaf Storm',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'spAtk', stages: -2, target: 'self' },
    },
  },
  psycho_boost: {
    id: 'psycho_boost',
    name: 'Psycho Boost',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'spAtk', stages: -2, target: 'self' },
    },
  },
  hammer_arm: {
    id: 'hammer_arm',
    name: 'Hammer Arm',
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: -1, target: 'self' },
    },
  },

  /* ============================================================================
   * 4. ATTACKING MOVES — % CHANCE TO INFLICT STATUS CONDITIONS (+ RECOIL/FLINCH)
   * ============================================================================ */
  flamethrower: {
    id: 'flamethrower',
    name: 'Flamethrower',
    secondaryEffect: { chance: 10, statusEffect: 'burn' },
  },
  fire_blast: {
    id: 'fire_blast',
    name: 'Fire Blast',
    secondaryEffect: { chance: 10, statusEffect: 'burn' },
  },
  fire_punch: {
    id: 'fire_punch',
    name: 'Fire Punch',
    secondaryEffect: { chance: 10, statusEffect: 'burn' },
  },
  flame_wheel: {
    id: 'flame_wheel',
    name: 'Flame Wheel',
    secondaryEffect: { chance: 10, statusEffect: 'burn' },
  },
  heat_wave: {
    id: 'heat_wave',
    name: 'Heat Wave',
    secondaryEffect: { chance: 10, statusEffect: 'burn' },
  },
  flare_blitz: {
    id: 'flare_blitz',
    name: 'Flare Blitz',
    recoil: 0.33,
    secondaryEffect: { chance: 10, statusEffect: 'burn' },
  },
  scald: {
    id: 'scald',
    name: 'Scald',
    secondaryEffect: { chance: 30, statusEffect: 'burn' },
  },
  lava_plume: {
    id: 'lava_plume',
    name: 'Lava Plume',
    secondaryEffect: { chance: 30, statusEffect: 'burn' },
  },
  sacred_fire: {
    id: 'sacred_fire',
    name: 'Sacred Fire',
    secondaryEffect: { chance: 50, statusEffect: 'burn' },
  },
  ice_beam: {
    id: 'ice_beam',
    name: 'Ice Beam',
    secondaryEffect: { chance: 10, statusEffect: 'freeze' },
  },
  blizzard: {
    id: 'blizzard',
    name: 'Blizzard',
    secondaryEffect: { chance: 10, statusEffect: 'freeze' },
  },
  ice_punch: {
    id: 'ice_punch',
    name: 'Ice Punch',
    secondaryEffect: { chance: 10, statusEffect: 'freeze' },
  },
  powder_snow: {
    id: 'powder_snow',
    name: 'Powder Snow',
    secondaryEffect: { chance: 10, statusEffect: 'freeze' },
  },
  freeze_dry: {
    id: 'freeze_dry',
    name: 'Freeze-Dry',
    secondaryEffect: { chance: 10, statusEffect: 'freeze' },
  },
  ice_fang: {
    id: 'ice_fang',
    name: 'Ice Fang',
    secondaryEffect: { chance: 10, statusEffect: 'freeze', flinchChance: 10 },
  },
  fire_fang: {
    id: 'fire_fang',
    name: 'Fire Fang',
    secondaryEffect: { chance: 10, statusEffect: 'burn', flinchChance: 10 },
  },
  thunder_fang: {
    id: 'thunder_fang',
    name: 'Thunder Fang',
    secondaryEffect: { chance: 10, statusEffect: 'paralysis', flinchChance: 10 },
  },
  thunderbolt: {
    id: 'thunderbolt',
    name: 'Thunderbolt',
    secondaryEffect: { chance: 10, statusEffect: 'paralysis' },
  },
  thunder_punch: {
    id: 'thunder_punch',
    name: 'Thunder Punch',
    secondaryEffect: { chance: 10, statusEffect: 'paralysis' },
  },
  volt_tackle: {
    id: 'volt_tackle',
    name: 'Volt Tackle',
    recoil: 0.33,
    secondaryEffect: { chance: 10, statusEffect: 'paralysis' },
  },
  thunder: {
    id: 'thunder',
    name: 'Thunder',
    secondaryEffect: { chance: 30, statusEffect: 'paralysis' },
  },
  discharge: {
    id: 'discharge',
    name: 'Discharge',
    secondaryEffect: { chance: 30, statusEffect: 'paralysis' },
  },
  spark: {
    id: 'spark',
    name: 'Spark',
    secondaryEffect: { chance: 30, statusEffect: 'paralysis' },
  },
  body_slam: {
    id: 'body_slam',
    name: 'Body Slam',
    secondaryEffect: { chance: 30, statusEffect: 'paralysis' },
  },
  dragon_breath: {
    id: 'dragon_breath',
    name: 'Dragon Breath',
    secondaryEffect: { chance: 30, statusEffect: 'paralysis' },
  },
  sludge_bomb: {
    id: 'sludge_bomb',
    name: 'Sludge Bomb',
    secondaryEffect: { chance: 30, statusEffect: 'poison' },
  },
  poison_jab: {
    id: 'poison_jab',
    name: 'Poison Jab',
    secondaryEffect: { chance: 30, statusEffect: 'poison' },
  },
  gunk_shot: {
    id: 'gunk_shot',
    name: 'Gunk Shot',
    secondaryEffect: { chance: 30, statusEffect: 'poison' },
  },
  sludge_wave: {
    id: 'sludge_wave',
    name: 'Sludge Wave',
    secondaryEffect: { chance: 10, statusEffect: 'poison' },
  },
  poison_fang: {
    id: 'poison_fang',
    name: 'Poison Fang',
    secondaryEffect: { chance: 50, statusEffect: 'toxic' },
  },

  /* ============================================================================
   * 5. ATTACKING MOVES — FLINCH CHANCE / RECOIL / DRAIN / PRIORITY / HIGH CRIT
   * ============================================================================ */
  air_slash: {
    id: 'air_slash',
    name: 'Air Slash',
    secondaryEffect: { chance: 30, flinchChance: 30 },
  },
  icicle_crash: {
    id: 'icicle_crash',
    name: 'Icicle Crash',
    secondaryEffect: { chance: 30, flinchChance: 30 },
  },
  iron_head: {
    id: 'iron_head',
    name: 'Iron Head',
    secondaryEffect: { chance: 30, flinchChance: 30 },
  },
  rock_slide: {
    id: 'rock_slide',
    name: 'Rock Slide',
    secondaryEffect: { chance: 30, flinchChance: 30 },
  },
  dark_pulse: {
    id: 'dark_pulse',
    name: 'Dark Pulse',
    secondaryEffect: { chance: 20, flinchChance: 20 },
  },
  waterfall: {
    id: 'waterfall',
    name: 'Waterfall',
    secondaryEffect: { chance: 20, flinchChance: 20 },
  },
  zen_headbutt: {
    id: 'zen_headbutt',
    name: 'Zen Headbutt',
    secondaryEffect: { chance: 20, flinchChance: 20 },
  },
  extrasensory: {
    id: 'extrasensory',
    name: 'Extrasensory',
    secondaryEffect: { chance: 10, flinchChance: 10 },
  },
  double_edge: {
    id: 'double_edge',
    name: 'Double-Edge',
    recoil: 0.33,
  },
  brave_bird: {
    id: 'brave_bird',
    name: 'Brave Bird',
    recoil: 0.33,
  },
  wood_hammer: {
    id: 'wood_hammer',
    name: 'Wood Hammer',
    recoil: 0.33,
  },
  wild_charge: {
    id: 'wild_charge',
    name: 'Wild Charge',
    recoil: 0.25,
  },
  giga_drain: {
    id: 'giga_drain',
    name: 'Giga Drain',
    drain: 0.5,
  },
  drain_punch: {
    id: 'drain_punch',
    name: 'Drain Punch',
    drain: 0.5,
  },
  leech_life: {
    id: 'leech_life',
    name: 'Leech Life',
    drain: 0.5,
  },
  quick_attack: {
    id: 'quick_attack',
    name: 'Quick Attack',
    priority: 1,
  },
  ice_shard: {
    id: 'ice_shard',
    name: 'Ice Shard',
    priority: 1,
  },
  bullet_punch: {
    id: 'bullet_punch',
    name: 'Bullet Punch',
    priority: 1,
  },
  mach_punch: {
    id: 'mach_punch',
    name: 'Mach Punch',
    priority: 1,
  },
  aqua_jet: {
    id: 'aqua_jet',
    name: 'Aqua Jet',
    priority: 1,
  },
  shadow_sneak: {
    id: 'shadow_sneak',
    name: 'Shadow Sneak',
    priority: 1,
  },
  extreme_speed: {
    id: 'extreme_speed',
    name: 'Extreme Speed',
    priority: 2,
  },
  night_slash: {
    id: 'night_slash',
    name: 'Night Slash',
    critRatioBonus: 1,
  },
  stone_edge: {
    id: 'stone_edge',
    name: 'Stone Edge',
    critRatioBonus: 1,
  },
  shadow_claw: {
    id: 'shadow_claw',
    name: 'Shadow Claw',
    critRatioBonus: 1,
  },
  leaf_blade: {
    id: 'leaf_blade',
    name: 'Leaf Blade',
    critRatioBonus: 1,
  },
  slash: {
    id: 'slash',
    name: 'Slash',
    critRatioBonus: 1,
  },

  /* ============================================================================
   * 6. STATUS MOVES — STAT STAGE SETUP, DEBUFFS, STATUS, RECOVERY, PROTECTION
   * ============================================================================ */
  swords_dance: {
    id: 'swords_dance',
    name: 'Swords Dance',
    statChange: { stat: 'attack', stages: 2, target: 'self' },
    statChanges: [{ stat: 'attack', stages: 2, target: 'self' }],
  },
  nasty_plot: {
    id: 'nasty_plot',
    name: 'Nasty Plot',
    statChange: { stat: 'spAtk', stages: 2, target: 'self' },
    statChanges: [{ stat: 'spAtk', stages: 2, target: 'self' }],
  },
  iron_defense: {
    id: 'iron_defense',
    name: 'Iron Defense',
    statChange: { stat: 'defense', stages: 2, target: 'self' },
    statChanges: [{ stat: 'defense', stages: 2, target: 'self' }],
  },
  acid_armor: {
    id: 'acid_armor',
    name: 'Acid Armor',
    statChange: { stat: 'defense', stages: 2, target: 'self' },
    statChanges: [{ stat: 'defense', stages: 2, target: 'self' }],
  },
  amnesia: {
    id: 'amnesia',
    name: 'Amnesia',
    statChange: { stat: 'spDef', stages: 2, target: 'self' },
    statChanges: [{ stat: 'spDef', stages: 2, target: 'self' }],
  },
  agility: {
    id: 'agility',
    name: 'Agility',
    statChange: { stat: 'speed', stages: 2, target: 'self' },
    statChanges: [{ stat: 'speed', stages: 2, target: 'self' }],
  },
  rock_polish: {
    id: 'rock_polish',
    name: 'Rock Polish',
    statChange: { stat: 'speed', stages: 2, target: 'self' },
    statChanges: [{ stat: 'speed', stages: 2, target: 'self' }],
  },
  calm_mind: {
    id: 'calm_mind',
    name: 'Calm Mind',
    statChange: { stat: 'spAtk', stages: 1, target: 'self' },
    statChanges: [
      { stat: 'spAtk', stages: 1, target: 'self' },
      { stat: 'spDef', stages: 1, target: 'self' },
    ],
  },
  dragon_dance: {
    id: 'dragon_dance',
    name: 'Dragon Dance',
    statChange: { stat: 'attack', stages: 1, target: 'self' },
    statChanges: [
      { stat: 'attack', stages: 1, target: 'self' },
      { stat: 'speed', stages: 1, target: 'self' },
    ],
  },
  bulk_up: {
    id: 'bulk_up',
    name: 'Bulk Up',
    statChange: { stat: 'attack', stages: 1, target: 'self' },
    statChanges: [
      { stat: 'attack', stages: 1, target: 'self' },
      { stat: 'defense', stages: 1, target: 'self' },
    ],
  },
  quiver_dance: {
    id: 'quiver_dance',
    name: 'Quiver Dance',
    statChange: { stat: 'spAtk', stages: 1, target: 'self' },
    statChanges: [
      { stat: 'spAtk', stages: 1, target: 'self' },
      { stat: 'spDef', stages: 1, target: 'self' },
      { stat: 'speed', stages: 1, target: 'self' },
    ],
  },
  shell_smash: {
    id: 'shell_smash',
    name: 'Shell Smash',
    statChange: { stat: 'attack', stages: 2, target: 'self' },
    statChanges: [
      { stat: 'defense', stages: -1, target: 'self' },
      { stat: 'spDef', stages: -1, target: 'self' },
      { stat: 'attack', stages: 2, target: 'self' },
      { stat: 'spAtk', stages: 2, target: 'self' },
      { stat: 'speed', stages: 2, target: 'self' },
    ],
  },
  charm: {
    id: 'charm',
    name: 'Charm',
    statChange: { stat: 'attack', stages: -2, target: 'opponent' },
    statChanges: [{ stat: 'attack', stages: -2, target: 'opponent' }],
  },
  screech: {
    id: 'screech',
    name: 'Screech',
    statChange: { stat: 'defense', stages: -2, target: 'opponent' },
    statChanges: [{ stat: 'defense', stages: -2, target: 'opponent' }],
  },
  fake_tears: {
    id: 'fake_tears',
    name: 'Fake Tears',
    statChange: { stat: 'spDef', stages: -2, target: 'opponent' },
    statChanges: [{ stat: 'spDef', stages: -2, target: 'opponent' }],
  },
  scary_face: {
    id: 'scary_face',
    name: 'Scary Face',
    statChange: { stat: 'speed', stages: -2, target: 'opponent' },
    statChanges: [{ stat: 'speed', stages: -2, target: 'opponent' }],
  },
  growl: {
    id: 'growl',
    name: 'Growl',
    statChange: { stat: 'attack', stages: -1, target: 'opponent' },
    statChanges: [{ stat: 'attack', stages: -1, target: 'opponent' }],
  },
  leer: {
    id: 'leer',
    name: 'Leer',
    statChange: { stat: 'defense', stages: -1, target: 'opponent' },
    statChanges: [{ stat: 'defense', stages: -1, target: 'opponent' }],
  },
  tail_whip: {
    id: 'tail_whip',
    name: 'Tail Whip',
    statChange: { stat: 'defense', stages: -1, target: 'opponent' },
    statChanges: [{ stat: 'defense', stages: -1, target: 'opponent' }],
  },
  thunder_wave: {
    id: 'thunder_wave',
    name: 'Thunder Wave',
    statusEffect: 'paralysis',
  },
  glare: {
    id: 'glare',
    name: 'Glare',
    statusEffect: 'paralysis',
  },
  stun_spore: {
    id: 'stun_spore',
    name: 'Stun Spore',
    statusEffect: 'paralysis',
  },
  will_o_wisp: {
    id: 'will_o_wisp',
    name: 'Will-O-Wisp',
    statusEffect: 'burn',
  },
  toxic: {
    id: 'toxic',
    name: 'Toxic',
    statusEffect: 'toxic',
  },
  sleep_powder: {
    id: 'sleep_powder',
    name: 'Sleep Powder',
    statusEffect: 'sleep',
  },
  hypnosis: {
    id: 'hypnosis',
    name: 'Hypnosis',
    statusEffect: 'sleep',
  },
  spore: {
    id: 'spore',
    name: 'Spore',
    statusEffect: 'sleep',
  },
  recover: {
    id: 'recover',
    name: 'Recover',
    healFraction: 0.5,
  },
  roost: {
    id: 'roost',
    name: 'Roost',
    healFraction: 0.5,
  },
  morning_sun: {
    id: 'morning_sun',
    name: 'Morning Sun',
    healFraction: 0.5,
  },
  synthesis: {
    id: 'synthesis',
    name: 'Synthesis',
    healFraction: 0.5,
  },
  moonlight: {
    id: 'moonlight',
    name: 'Moonlight',
    healFraction: 0.5,
  },
  slack_off: {
    id: 'slack_off',
    name: 'Slack Off',
    healFraction: 0.5,
  },
  soft_boiled: {
    id: 'soft_boiled',
    name: 'Soft-Boiled',
    healFraction: 0.5,
  },
  rest: {
    id: 'rest',
    name: 'Rest',
    healFraction: 1.0,
  },
  protect: {
    id: 'protect',
    name: 'Protect',
    priority: 4,
    isProtect: true,
  },
  detect: {
    id: 'detect',
    name: 'Detect',
    priority: 4,
    isProtect: true,
  },
  substitute: {
    id: 'substitute',
    name: 'Substitute',
    isSubstitute: true,
  },
  hail: {
    id: 'hail',
    name: 'Hail',
    weatherEffect: 'Hail',
  },
  rain_dance: {
    id: 'rain_dance',
    name: 'Rain Dance',
    weatherEffect: 'Rain',
  },
  sunny_day: {
    id: 'sunny_day',
    name: 'Sunny Day',
    weatherEffect: 'Sun',
  },
  sandstorm: {
    id: 'sandstorm',
    name: 'Sandstorm',
    weatherEffect: 'Sand',
  },

  /* ============================================================================
   * 9. PIVOT & SWITCHOUT MOVES
   * ============================================================================ */
  volt_switch: {
    id: 'volt_switch',
    name: 'Volt Switch',
    isPivot: true,
  },
  u_turn: {
    id: 'u_turn',
    name: 'U-turn',
    isPivot: true,
  },
  flip_turn: {
    id: 'flip_turn',
    name: 'Flip Turn',
    isPivot: true,
  },
  parting_shot: {
    id: 'parting_shot',
    name: 'Parting Shot',
    isPivot: true,
    statChanges: [
      { stat: 'attack', stages: -1, target: 'opponent' },
      { stat: 'spAtk', stages: -1, target: 'opponent' },
    ],
  },
  baton_pass: {
    id: 'baton_pass',
    name: 'Baton Pass',
    isPivot: true,
    isBatonPass: true,
  },
  teleport: {
    id: 'teleport',
    name: 'Teleport',
    priority: -6,
    isPivot: true,
  },
  chilly_reception: {
    id: 'chilly_reception',
    name: 'Chilly Reception',
    weatherEffect: 'Hail',
    isPivot: true,
  },

  /* ============================================================================
   * 10. INFALLIBLE ACCURACY MOVES (NEVER MISS)
   * ============================================================================ */
  aura_sphere: {
    id: 'aura_sphere',
    name: 'Aura Sphere',
    infallible: true,
  },
  aerial_ace: {
    id: 'aerial_ace',
    name: 'Aerial Ace',
    infallible: true,
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    infallible: true,
  },
  shock_wave: {
    id: 'shock_wave',
    name: 'Shock Wave',
    infallible: true,
  },
  magical_leaf: {
    id: 'magical_leaf',
    name: 'Magical Leaf',
    infallible: true,
  },
  shadow_punch: {
    id: 'shadow_punch',
    name: 'Shadow Punch',
    infallible: true,
  },

  /* ============================================================================
   * 11. RECHARGE TURN MOVES (USER MUST REST NEXT TURN)
   * ============================================================================ */
  blast_burn: {
    id: 'blast_burn',
    name: 'Blast Burn',
    rechargeTurn: true,
  },
  frenzy_plant: {
    id: 'frenzy_plant',
    name: 'Frenzy Plant',
    rechargeTurn: true,
  },
  hydro_cannon: {
    id: 'hydro_cannon',
    name: 'Hydro Cannon',
    rechargeTurn: true,
  },
  hyper_beam: {
    id: 'hyper_beam',
    name: 'Hyper Beam',
    rechargeTurn: true,
  },
  giga_impact: {
    id: 'giga_impact',
    name: 'Giga Impact',
    rechargeTurn: true,
  },

  /* ============================================================================
   * 12. GENERAL COMPETITIVE OFFENSIVE & COVERAGE MOVES
   * ============================================================================ */
  dazzling_gleam: {
    id: 'dazzling_gleam',
    name: 'Dazzling Gleam',
  },
  earthquake: {
    id: 'earthquake',
    name: 'Earthquake',
  },
  surf: {
    id: 'surf',
    name: 'Surf',
  },
  hydro_pump: {
    id: 'hydro_pump',
    name: 'Hydro Pump',
  },
  dragon_claw: {
    id: 'dragon_claw',
    name: 'Dragon Claw',
  },
  dragon_pulse: {
    id: 'dragon_pulse',
    name: 'Dragon Pulse',
  },
  grass_knot: {
    id: 'grass_knot',
    name: 'Grass Knot',
  },
  hidden_power: {
    id: 'hidden_power',
    name: 'Hidden Power',
  },
  x_scissor: {
    id: 'x_scissor',
    name: 'X-Scissor',
  },
  dynamic_punch: {
    id: 'dynamic_punch',
    name: 'Dynamic Punch',
    secondaryEffect: { chance: 100, confusionChance: 100 },
  },
  signal_beam: {
    id: 'signal_beam',
    name: 'Signal Beam',
    secondaryEffect: { chance: 10, confusionChance: 10 },
  },
  outrage: {
    id: 'outrage',
    name: 'Outrage',
  },

  /* ============================================================================
   * 13. ENTRY HAZARDS & HAZARD REMOVAL
   * ============================================================================ */
  stealth_rock: {
    id: 'stealth_rock',
    name: 'Stealth Rock',
    entryHazard: 'stealth_rock',
  },
  spikes: {
    id: 'spikes',
    name: 'Spikes',
    entryHazard: 'spikes',
  },
  toxic_spikes: {
    id: 'toxic_spikes',
    name: 'Toxic Spikes',
    entryHazard: 'toxic_spikes',
  },
  sticky_web: {
    id: 'sticky_web',
    name: 'Sticky Web',
    entryHazard: 'sticky_web',
  },
  rapid_spin: {
    id: 'rapid_spin',
    name: 'Rapid Spin',
    clearsHazards: true,
    secondaryEffect: {
      chance: 100,
      statChange: { stat: 'speed', stages: 1, target: 'self' },
    },
  },
  defog: {
    id: 'defog',
    name: 'Defog',
    clearsHazards: true,
    statChange: { stat: 'evasion', stages: -1, target: 'opponent' },
  },

  /* ============================================================================
   * 14. CONFUSION INFLICTING MOVES
   * ============================================================================ */
  confuse_ray: {
    id: 'confuse_ray',
    name: 'Confuse Ray',
    causesConfusion: true,
  },
  sweet_kiss: {
    id: 'sweet_kiss',
    name: 'Sweet Kiss',
    causesConfusion: true,
  },
  supersonic: {
    id: 'supersonic',
    name: 'Supersonic',
    causesConfusion: true,
  },
  teeter_dance: {
    id: 'teeter_dance',
    name: 'Teeter Dance',
    causesConfusion: true,
  },
  swagger: {
    id: 'swagger',
    name: 'Swagger',
    causesConfusion: true,
    statChange: { stat: 'attack', stages: 2, target: 'opponent' },
  },
  flatter: {
    id: 'flatter',
    name: 'Flatter',
    causesConfusion: true,
    statChange: { stat: 'spAtk', stages: 1, target: 'opponent' },
  },
  water_pulse: {
    id: 'water_pulse',
    name: 'Water Pulse',
    secondaryEffect: { chance: 20, confusionChance: 20 },
  },
  confusion: {
    id: 'confusion',
    name: 'Confusion',
    secondaryEffect: { chance: 10, confusionChance: 10 },
  },
  psybeam: {
    id: 'psybeam',
    name: 'Psybeam',
    secondaryEffect: { chance: 10, confusionChance: 10 },
  },
  hurricane: {
    id: 'hurricane',
    name: 'Hurricane',
    secondaryEffect: { chance: 30, confusionChance: 30 },
  },
  dizzy_punch: {
    id: 'dizzy_punch',
    name: 'Dizzy Punch',
    secondaryEffect: { chance: 20, confusionChance: 20 },
  },
  rock_climb: {
    id: 'rock_climb',
    name: 'Rock Climb',
    secondaryEffect: { chance: 20, confusionChance: 20 },
  },
};

export function normalizeMoveKey(idOrName: string): string {
  return idOrName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function getMoveMechanics(idOrName: string): MoveMechanicsEntry | undefined {
  const key = normalizeMoveKey(idOrName);
  return MOVE_MECHANICS_KB[key];
}

/**
 * Enriches a Move object with canonical secondary effects, stat stage changes,
 * status effects, recoil, drain, priority, and crit ratios from MOVE_MECHANICS_KB.
 */
export function enrichMoveWithMechanics(move: Move): Move {
  const spec = getMoveMechanics(move.id) || getMoveMechanics(move.name);
  if (!spec) return move;

  return {
    ...move,
    priority: move.priority ?? spec.priority,
    statusEffect: move.statusEffect ?? spec.statusEffect,
    statChange: move.statChange
      ? { ...move.statChange }
      : spec.statChange
      ? { ...spec.statChange }
      : undefined,
    statChanges: move.statChanges
      ? move.statChanges.map((sc) => ({ ...sc }))
      : spec.statChanges
      ? spec.statChanges.map((sc) => ({ ...sc }))
      : undefined,
    secondaryEffect: move.secondaryEffect
      ? {
          ...move.secondaryEffect,
          confusionChance: move.secondaryEffect.confusionChance ?? spec.secondaryEffect?.confusionChance,
          statChange: move.secondaryEffect.statChange ? { ...move.secondaryEffect.statChange } : undefined,
          statChanges: move.secondaryEffect.statChanges
            ? move.secondaryEffect.statChanges.map((sc) => ({ ...sc }))
            : undefined,
        }
      : spec.secondaryEffect
      ? {
          ...spec.secondaryEffect,
          statChange: spec.secondaryEffect.statChange ? { ...spec.secondaryEffect.statChange } : undefined,
          statChanges: spec.secondaryEffect.statChanges
            ? spec.secondaryEffect.statChanges.map((sc) => ({ ...sc }))
            : undefined,
        }
      : undefined,
    recoil: move.recoil ?? spec.recoil,
    drain: move.drain ?? spec.drain,
    multiHit: move.multiHit
      ? [move.multiHit[0], move.multiHit[1]]
      : spec.multiHit
      ? [spec.multiHit[0], spec.multiHit[1]]
      : undefined,
    critRatioBonus: move.critRatioBonus ?? spec.critRatioBonus,
    isProtect: move.isProtect ?? spec.isProtect,
    isSubstitute: move.isSubstitute ?? spec.isSubstitute,
    weatherEffect: move.weatherEffect ?? spec.weatherEffect,
    isPivot: move.isPivot ?? spec.isPivot,
    isBatonPass: move.isBatonPass ?? spec.isBatonPass,
    infallible: move.infallible ?? spec.infallible,
    rechargeTurn: move.rechargeTurn ?? spec.rechargeTurn,
    causesConfusion: move.causesConfusion ?? spec.causesConfusion,
    entryHazard: move.entryHazard ?? spec.entryHazard,
    clearsHazards: move.clearsHazards ?? spec.clearsHazards,
  };
}
