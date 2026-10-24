/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Champion Cynthia Rotating Team Configurations (Canon Gens 4–5)
 * Reference: docs/CHAMPIONS_AND_E4_ROTATING_TEAMS_KB.md
 * 
 * Provides 5 canonical/competitive Level 100 team configurations:
 * - Config A: Platinum Standard (Canonical Balanced Core)
 * - Config B: Diamond & Pearl Classic (Bulky Water / Gastrodon Pivot)
 * - Config C: Undella Town / B2W2 Vacation (Fast Hyper-Offense)
 * - Config D: Pokémon World Tournament (Masters Edition)
 * - Config E: Sand Veil Fortress (Weather Synergies)
 */

import { Pokemon } from '../types';
import { createLvl100Mon } from './regional/types';

export type CynthiaConfigId = 'config_a' | 'config_b' | 'config_c' | 'config_d' | 'config_e';

export interface CynthiaTeamConfig {
  id: CynthiaConfigId;
  name: string;
  theme: string;
  playstyle: string;
  roster: Pokemon[];
}

// ---------------------------------------------------------------------------
// Configuration A: Platinum Standard (Canonical Balanced Core)
// ---------------------------------------------------------------------------
export const CYNTHIA_PLATINUM_STANDARD: Pokemon[] = [
  createLvl100Mon(
    'cynthia_a_spiritomb', 'Spiritomb', 442, ['Ghost', 'Dark'],
    { hp: 304, attack: 283, defense: 315, spAtk: 283, spDef: 315, speed: 169 },
    'Pressure', 'Forces foe to expend double PP.',
    [
      { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that may lower Sp. Def.' },
      { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast with flinch chance.' },
      { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic force that lowers Sp. Def.' },
      { id: 'hypnosis', name: 'Hypnosis', type: 'Psychic', category: 'Status', power: 0, accuracy: 70, pp: 20, description: 'Hypnotic suggestion that induces sleep.' },
    ],
    'Sitrus Berry'
  ),
  createLvl100Mon(
    'cynthia_a_roserade', 'Roserade', 407, ['Grass', 'Poison'],
    { hp: 324, attack: 239, defense: 229, spAtk: 349, spDef: 309, speed: 279 },
    'Natural Cure', 'All status conditions heal upon switching out.',
    [
      { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge with 30% poison rate.' },
      { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Concentrated nature energy.' },
      { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob dealing reliable damage.' },
      { id: 'extrasensory', name: 'Extrasensory', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Psychic power with flinch chance.' },
    ],
    'Focus Sash'
  ),
  createLvl100Mon(
    'cynthia_a_togekiss', 'Togekiss', 468, ['Fairy', 'Flying'],
    { hp: 374, attack: 199, defense: 289, spAtk: 339, spDef: 329, speed: 259 },
    'Serene Grace', 'Doubles move secondary effect chance (60% flinch Air Slash).',
    [
      { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Sky wind causing 60% flinch with Serene Grace.' },
      { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Infallible blast of aura energy.' },
      { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes the target, cutting speed.' },
      { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Lands and restores 50% max HP.' },
    ],
    'King\'s Rock'
  ),
  createLvl100Mon(
    'cynthia_a_lucario', 'Lucario', 448, ['Fighting', 'Steel'],
    { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 },
    'Inner Focus', 'Prevents flinching from opposing attacks.',
    [
      { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating martial arts onslaught.' },
      { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
      { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Metallic beam of light energy.' },
      { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Draconic shockwave.' },
    ],
    'Life Orb'
  ),
  createLvl100Mon(
    'cynthia_a_milotic', 'Milotic', 350, ['Water'],
    { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 },
    'Marvel Scale', 'Boosts Defense by 50% when afflicted by status.',
    [
      { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn chance.' },
      { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Frigid beam with freeze chance.' },
      { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores up to half max HP.' },
      { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons the target.' },
    ],
    'Flame Orb'
  ),
  createLvl100Mon(
    'cynthia_a_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'],
    { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 },
    'Rough Skin', 'Inflicts 1/8 damage to attackers making contact.',
    [
      { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Slashes violently with dragon claws.' },
      { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Full battlefield seismic tremor.' },
      { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack sharply by +2 stages.' },
      { id: 'poison_jab', name: 'Poison Jab', type: 'Poison', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Poison strike targeting Fairy switch-ins.' },
    ],
    'Yache Berry'
  ),
];

// ---------------------------------------------------------------------------
// Configuration B: Diamond & Pearl Classic (Bulky Water / Gastrodon Pivot)
// ---------------------------------------------------------------------------
export const CYNTHIA_DP_CLASSIC: Pokemon[] = [
  createLvl100Mon(
    'cynthia_b_spiritomb', 'Spiritomb', 442, ['Ghost', 'Dark'],
    { hp: 304, attack: 283, defense: 315, spAtk: 283, spDef: 315, speed: 169 },
    'Pressure', 'Forces foe to expend double PP.',
    [
      { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast with flinch chance.' },
      { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers Sp. Def.' },
      { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Inflicts burn to halve opponent Attack.' },
      { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Shares HP with target equally.' },
    ],
    'Leftovers'
  ),
  createLvl100Mon(
    'cynthia_b_gastrodon', 'Gastrodon', 423, ['Water', 'Ground'],
    { hp: 426, attack: 247, defense: 235, spAtk: 283, spDef: 263, speed: 177 },
    'Storm Drain', 'Draws Water attacks to boost Special Attack and nullify damage.',
    [
      { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn chance.' },
      { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Erupts earth beneath target to lower Sp. Def.' },
      { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores up to half max HP.' },
      { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing ray.' },
    ],
    'Rindo Berry'
  ),
  createLvl100Mon(
    'cynthia_b_roserade', 'Roserade', 407, ['Grass', 'Poison'],
    { hp: 324, attack: 239, defense: 229, spAtk: 349, spDef: 309, speed: 279 },
    'Natural Cure', 'All status conditions heal upon switching out.',
    [
      { id: 'leaf_storm', name: 'Leaf Storm', type: 'Grass', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Violent leaf whirlwind that drops Sp. Atk.' },
      { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge with 30% poison rate.' },
      { id: 'extrasensory', name: 'Extrasensory', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Psychic power with flinch chance.' },
      { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Nutrient-stealing grass attack that heals.' },
    ],
    'Choice Specs'
  ),
  createLvl100Mon(
    'cynthia_b_lucario', 'Lucario', 448, ['Fighting', 'Steel'],
    { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 },
    'Steadfast', 'Boosts Speed by 1 stage upon flinching.',
    [
      { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Infallible blast of aura energy.' },
      { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
      { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers Sp. Def.' },
      { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    ],
    'Expert Belt'
  ),
  createLvl100Mon(
    'cynthia_b_milotic', 'Milotic', 350, ['Water'],
    { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 },
    'Competitive', 'Boosts Sp. Atk sharply if a stat is lowered by opponent.',
    [
      { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Tremendous torrent of water.' },
      { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing ray.' },
      { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores half max HP.' },
      { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Draconic shockwave.' },
    ],
    'Leftovers'
  ),
  createLvl100Mon(
    'cynthia_b_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'],
    { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 },
    'Rough Skin', 'Inflicts 1/8 damage to attackers making contact.',
    [
      { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
      { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Full field seismic tremor.' },
      { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
      { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming blast of fire.' },
    ],
    'Choice Scarf'
  ),
];

// ---------------------------------------------------------------------------
// Configuration C: Undella Town / B2W2 Vacation (Fast Hyper-Offense)
// ---------------------------------------------------------------------------
export const CYNTHIA_UNDELLA_HYPER_OFFENSE: Pokemon[] = [
  createLvl100Mon(
    'cynthia_c_spiritomb', 'Spiritomb', 442, ['Ghost', 'Dark'],
    { hp: 304, attack: 283, defense: 315, spAtk: 283, spDef: 315, speed: 169 },
    'Infiltrator', 'Passes through screens and Substitute.',
    [
      { id: 'shadow_sneak', name: 'Shadow Sneak', type: 'Ghost', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority shadow strike.' },
      { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike before attacking foe.' },
      { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns target to halve Attack.' },
      { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents target from using status moves.' },
    ],
    'Focus Sash'
  ),
  createLvl100Mon(
    'cynthia_c_eelektross', 'Eelektross', 604, ['Electric'],
    { hp: 374, attack: 329, defense: 259, spAtk: 309, spDef: 259, speed: 199 },
    'Levitate', 'Full immunity to Ground-type attacks and hazards (no weaknesses).',
    [
      { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electrified tackle with recoil.' },
      { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Intense fire stream.' },
      { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Nutrient-stealing grass attack.' },
      { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Crushing brute force strike.' },
    ],
    'Assault Vest'
  ),
  createLvl100Mon(
    'cynthia_c_braviary', 'Braviary', 628, ['Normal', 'Flying'],
    { hp: 404, attack: 345, defense: 249, spAtk: 213, spDef: 249, speed: 259 },
    'Defiant', 'Boosts Attack sharply by +2 stages if a stat is lowered.',
    [
      { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Heroic divebomb strike with recoil.' },
      { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Brute force punch.' },
      { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
      { id: 'return', name: 'Return', type: 'Normal', category: 'Physical', power: 102, accuracy: 100, pp: 20, description: 'Maximum friendship normal STAB.' },
    ],
    'Choice Band'
  ),
  createLvl100Mon(
    'cynthia_c_lucario', 'Lucario', 448, ['Fighting', 'Steel'],
    { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 },
    'Justified', 'Boosts Attack when hit by Dark attacks.',
    [
      { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack sharply by +2.' },
      { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating martial arts flurry.' },
      { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
      { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Speedy metallic punch.' },
    ],
    'Focus Sash'
  ),
  createLvl100Mon(
    'cynthia_c_milotic', 'Milotic', 350, ['Water'],
    { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 },
    'Marvel Scale', 'Boosts Defense by 50% when afflicted by status.',
    [
      { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Sleeps 2 turns for full HP recovery.' },
      { id: 'sleep_talk', name: 'Sleep Talk', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Uses random learned move while sleeping.' },
      { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn chance.' },
      { id: 'dragon_tail', name: 'Dragon Tail', type: 'Dragon', category: 'Physical', power: 60, accuracy: 90, pp: 10, priority: -6, description: 'Knocks away foe and forces switch.' },
    ],
    'Chesto Berry'
  ),
  createLvl100Mon(
    'cynthia_c_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'],
    { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 },
    'Rough Skin', 'Inflicts 1/8 damage to attackers making contact.',
    [
      { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Full field seismic tremor.' },
      { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Slashes with dragon claws.' },
      { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
      { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack by +2.' },
    ],
    'Life Orb'
  ),
];

// ---------------------------------------------------------------------------
// Configuration D: Pokémon World Tournament (Masters Edition)
// ---------------------------------------------------------------------------
export const CYNTHIA_PWT_MASTERS: Pokemon[] = [
  createLvl100Mon(
    'cynthia_d_glaceon', 'Glaceon', 471, ['Ice'],
    { hp: 334, attack: 219, defense: 319, spAtk: 359, spDef: 289, speed: 229 },
    'Snow Cloak', 'Boosts evasion in hail.',
    [
      { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 70, pp: 5, description: 'Fierce sub-zero snowstorm.' },
      { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers Sp. Def.' },
      { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice strike.' },
      { id: 'mirror_coat', name: 'Mirror Coat', type: 'Psychic', category: 'Special', power: 0, accuracy: 100, pp: 20, priority: -5, description: 'Reflects double special damage taken.' },
    ],
    'Focus Sash'
  ),
  createLvl100Mon(
    'cynthia_d_togekiss', 'Togekiss', 468, ['Fairy', 'Flying'],
    { hp: 374, attack: 199, defense: 289, spAtk: 339, spDef: 329, speed: 259 },
    'Serene Grace', 'Doubles move secondary effect chance.',
    [
      { id: 'nasty_plot', name: 'Nasty Plot', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Sharply raises Sp. Atk by +2 stages.' },
      { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Sky wind causing 60% flinch.' },
      { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Never-miss aura pulse.' },
      { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% max HP.' },
    ],
    'Leftovers'
  ),
  createLvl100Mon(
    'cynthia_d_spiritomb', 'Spiritomb', 442, ['Ghost', 'Dark'],
    { hp: 304, attack: 283, defense: 315, spAtk: 283, spDef: 315, speed: 169 },
    'Pressure', 'Forces foe to expend double PP.',
    [
      { id: 'foul_play', name: 'Foul Play', type: 'Dark', category: 'Physical', power: 95, accuracy: 100, pp: 15, description: 'Uses target Attack stat to calculate damage.' },
      { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns target to halve Attack.' },
      { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers Sp. Def.' },
      { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Sleeps to restore full HP.' },
    ],
    'Rocky Helmet'
  ),
  createLvl100Mon(
    'cynthia_d_lucario', 'Lucario', 448, ['Fighting', 'Steel'],
    { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 },
    'Inner Focus', 'Prevents flinching.',
    [
      { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating punch flurry.' },
      { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Speedy metallic punch.' },
      { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
      { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    ],
    'Life Orb'
  ),
  createLvl100Mon(
    'cynthia_d_milotic', 'Milotic', 350, ['Water'],
    { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 },
    'Marvel Scale', 'Boosts Defense by 50% when afflicted by status.',
    [
      { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn chance.' },
      { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing ray.' },
      { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores half max HP.' },
      { id: 'haze', name: 'Haze', type: 'Ice', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Eliminates all stat changes on field.' },
    ],
    'Leftovers'
  ),
  createLvl100Mon(
    'cynthia_d_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'],
    { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 },
    'Rough Skin', 'Inflicts 1/8 damage to attackers making contact.',
    [
      { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
      { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic tremor.' },
      { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack sharply by +2.' },
      { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    ],
    'Lum Berry'
  ),
];

// ---------------------------------------------------------------------------
// Configuration E: Sand Veil Fortress (Weather Synergies)
// ---------------------------------------------------------------------------
export const CYNTHIA_SAND_VEIL_FORTRESS: Pokemon[] = [
  createLvl100Mon(
    'cynthia_e_hippowdon', 'Hippowdon', 450, ['Ground'],
    { hp: 420, attack: 323, defense: 335, spAtk: 235, spDef: 243, speed: 193 },
    'Sand Stream', 'Summons permanent/lasting sandstorm on entry.',
    [
      { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones on opposing side.' },
      { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic tremor.' },
      { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers 50% max HP.' },
      { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Blows away target to force random switch.' },
    ],
    'Smooth Rock'
  ),
  createLvl100Mon(
    'cynthia_e_lucario', 'Lucario', 448, ['Fighting', 'Steel'],
    { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 },
    'Inner Focus', 'Prevents flinching; Steel type immune to sandstorm.',
    [
      { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating martial arts onslaught.' },
      { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Metallic light cannon.' },
      { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
      { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
    ],
    'Air Balloon'
  ),
  createLvl100Mon(
    'cynthia_e_togekiss', 'Togekiss', 468, ['Fairy', 'Flying'],
    { hp: 374, attack: 199, defense: 289, spAtk: 339, spDef: 329, speed: 259 },
    'Serene Grace', 'Doubles move secondary effect chance.',
    [
      { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Sky wind causing 60% flinch with Serene Grace.' },
      { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Never-miss aura pulse.' },
      { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Intense stream of fire.' },
      { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% max HP.' },
    ],
    'Leftovers'
  ),
  createLvl100Mon(
    'cynthia_e_milotic', 'Milotic', 350, ['Water'],
    { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 },
    'Marvel Scale', 'Boosts Defense by 50% when afflicted by status.',
    [
      { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn chance.' },
      { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores up to half max HP.' },
      { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing ray.' },
      { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
    ],
    'Leftovers'
  ),
  createLvl100Mon(
    'cynthia_e_roserade', 'Roserade', 407, ['Grass', 'Poison'],
    { hp: 324, attack: 239, defense: 229, spAtk: 349, spDef: 309, speed: 279 },
    'Natural Cure', 'Heals all status upon switching out.',
    [
      { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Nutrient-stealing grass attack.' },
      { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge with 30% poison rate.' },
      { id: 'synthesis', name: 'Synthesis', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP using solar power.' },
      { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays spiked hazards on opposing ground.' },
    ],
    'Black Sludge'
  ),
  createLvl100Mon(
    'cynthia_e_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'],
    { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 },
    'Sand Veil', 'Boosts evasion by 20% in sandstorm (immune to sand chip).',
    [
      { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack sharply by +2.' },
      { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic tremor.' },
      { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Sharp dragon claw slash.' },
      { id: 'substitute', name: 'Substitute', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Creates decoy with 25% max HP.' },
    ],
    'Bright Powder'
  ),
];

// ---------------------------------------------------------------------------
// MASTER ROTATING DICTIONARY
// ---------------------------------------------------------------------------
export const CYNTHIA_ROTATING_CONFIGS: Record<CynthiaConfigId, CynthiaTeamConfig> = {
  config_a: {
    id: 'config_a',
    name: 'Platinum Standard',
    theme: 'Canonical Balanced Core',
    playstyle: 'Well-rounded offensive balance, Spiritomb pressure, Serene Grace flinch-lock, and Garchomp cleanup.',
    roster: CYNTHIA_PLATINUM_STANDARD,
  },
  config_b: {
    id: 'config_b',
    name: 'Diamond & Pearl Classic',
    theme: 'Bulky Water / Gastrodon Pivot',
    playstyle: 'Bulky attrition with Storm Drain Gastrodon absorbing water moves targeted at Lucario/Garchomp.',
    roster: CYNTHIA_DP_CLASSIC,
  },
  config_c: {
    id: 'config_c',
    name: 'Undella Town Vacation',
    theme: 'Fast Hyper-Offense',
    playstyle: 'Aggressive physical beatdown featuring Unova imports Eelektross (no weaknesses) and Braviary.',
    roster: CYNTHIA_UNDELLA_HYPER_OFFENSE,
  },
  config_d: {
    id: 'config_d',
    name: 'Pokémon World Tournament',
    theme: 'Masters Edition',
    playstyle: 'High Base Stat Total synergy featuring Glaceon hail disruption, Nasty Plot Togekiss, and Lum Berry Garchomp.',
    roster: CYNTHIA_PWT_MASTERS,
  },
  config_e: {
    id: 'config_e',
    name: 'Sand Veil Fortress',
    theme: 'Weather Synergies',
    playstyle: 'Sandstorm-fueled evasion and chip with Hippowdon setting Sand for Garchomp and Lucario.',
    roster: CYNTHIA_SAND_VEIL_FORTRESS,
  },
};

/**
 * Deterministically retrieves Cynthia's rotating team for a given date or config ID.
 */
export function getCynthiaRotatingTeam(configOrDate?: string): Pokemon[] {
  if (!configOrDate) {
    return CYNTHIA_ROTATING_CONFIGS.config_a.roster;
  }
  if (configOrDate in CYNTHIA_ROTATING_CONFIGS) {
    return CYNTHIA_ROTATING_CONFIGS[configOrDate as CynthiaConfigId].roster;
  }
  // Deterministic daily hash
  const keys: CynthiaConfigId[] = ['config_a', 'config_b', 'config_c', 'config_d', 'config_e'];
  let hash = 0;
  for (let i = 0; i < configOrDate.length; i++) {
    hash = (hash * 31 + configOrDate.charCodeAt(i)) >>> 0;
  }
  const selectedKey = keys[hash % keys.length];
  return CYNTHIA_ROTATING_CONFIGS[selectedKey].roster;
}
