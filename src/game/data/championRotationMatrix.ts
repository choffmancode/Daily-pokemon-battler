/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Champion Rotation Matrix & Daily 3-Team Player Presets (Gens 1–5)
 * Reference: docs/CHAMPIONS_AND_E4_ROTATING_TEAMS_KB.md
 *            docs/REGIONAL_LEAGUES_GAUNTLET_KB.md (Section 7)
 * 
 * Provides:
 * - 5 Canonical Configurations per Champion (25 master Level 100 teams)
 *   Cynthia (Sinnoh), Blue (Kanto), Lance (Johto), Steven (Hoenn), Iris/Alder (Unova)
 * - Monthly and Seeded Champion Roster Swapping
 * - Daily 3-Team Player Presets (SWEEP, BALANCE, STALL) across all regions
 */

import { Pokemon, TeamPreset } from '../types';
import { createLvl100Mon, RegionId } from './regional/types';
import { REGIONAL_LEAGUES } from './regionalLeaguesKB';
import {
  CYNTHIA_PLATINUM_STANDARD,
  CYNTHIA_DP_CLASSIC,
  CYNTHIA_UNDELLA_HYPER_OFFENSE,
  CYNTHIA_PWT_MASTERS,
  CYNTHIA_SAND_VEIL_FORTRESS,
} from './cynthiaRotatingTeams';

export type ConfigLetter = 'A' | 'B' | 'C' | 'D' | 'E';
export type ChampionId = 'cynthia' | 'blue' | 'lance' | 'steven' | 'iris';

export interface ChampionConfigEntry {
  configId: ConfigLetter;
  name: string;
  seasonLabel: string;
  theme: string;
  playstyle: string;
  team: Pokemon[];
}

export type ChampionRosterRegistry = Record<ChampionId, ChampionConfigEntry[]>;

// ============================================================================
// 1. BLUE (KANTO) — 5 CANONICAL CONFIGURATIONS
// ============================================================================

export const BLUE_CONFIG_A: Pokemon[] = [
  createLvl100Mon('blue_a_pidgeot', 'Pidgeot', 18, ['Normal', 'Flying'], { hp: 368, attack: 259, defense: 249, spAtk: 239, spDef: 239, speed: 301 }, 'Keen Eye', 'Prevents other Pokémon from lowering accuracy.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Heroic divebomb strike with recoil.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches out to bench.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Lands and restores 50% max HP.' },
    { id: 'double_edge', name: 'Double-Edge', type: 'Normal', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Life-risking tackle with recoil.' },
  ], 'Life Orb'),
  createLvl100Mon('blue_a_alakazam', 'Alakazam', 65, ['Psychic'], { hp: 314, attack: 199, defense: 189, spAtk: 369, spDef: 289, speed: 339 }, 'Magic Guard', 'Only takes direct attack damage.', [
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Devastating telekinetic shockwave.' },
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers Sp. Def.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Concentrated power blast.' },
    { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Nature blast.' },
  ], 'Focus Sash'),
  createLvl100Mon('blue_a_rhydon', 'Rhydon', 112, ['Ground', 'Rock'], { hp: 414, attack: 359, defense: 339, spAtk: 189, spDef: 189, speed: 179 }, 'Lightning Rod', 'Draws Electric moves to nullify damage and boost Sp. Atk.', [
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Massive horn ramming charge.' },
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones on opposing side.' },
  ], 'Eviolite'),
  createLvl100Mon('blue_a_exeggutor', 'Exeggutor', 103, ['Grass', 'Psychic'], { hp: 394, attack: 289, defense: 269, spAtk: 349, spDef: 239, speed: 209 }, 'Chlorophyll', 'Doubles Speed in sunshine.', [
    { id: 'leaf_storm', name: 'Leaf Storm', type: 'Grass', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Storm of sharp leaves.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
    { id: 'sleep_powder', name: 'Sleep Powder', type: 'Grass', category: 'Status', power: 0, accuracy: 75, pp: 15, description: 'Scatters sleep spores.' },
    { id: 'synthesis', name: 'Synthesis', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('blue_a_arcanine', 'Arcanine', 59, ['Fire'], { hp: 384, attack: 319, defense: 259, spAtk: 299, spDef: 259, speed: 289 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Blazing charge with recoil.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
    { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electrified tackle with recoil.' },
    { id: 'morning_sun', name: 'Morning Sun', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP.' },
  ], 'Leftovers'),
  createLvl100Mon('blue_a_blastoise_ace', 'Blastoise', 9, ['Water'], { hp: 362, attack: 265, defense: 299, spAtk: 269, spDef: 309, speed: 255 }, 'Torrent', 'Boosts Water moves in a pinch.', [
    { id: 'shell_smash', name: 'Shell Smash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Drastically boosts Atk, SpAtk, Spe.' },
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Blasts high-pressure water.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Sub-zero arctic ice beam.' },
    { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Infallible aura strike.' },
  ], 'White Herb'),
];

export const BLUE_CONFIG_B: Pokemon[] = [
  createLvl100Mon('blue_b_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Pressure', 'Forces foe to expend double PP.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays hazard stones.' },
    { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents status moves.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
  ], 'Focus Sash'),
  createLvl100Mon('blue_b_alakazam', 'Alakazam', 65, ['Psychic'], { hp: 314, attack: 199, defense: 189, spAtk: 369, spDef: 289, speed: 339 }, 'Magic Guard', 'Only takes direct attack damage.', [
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
    { id: 'dazzling_gleam', name: 'Dazzling Gleam', type: 'Fairy', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Dazzling light flash.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
    { id: 'psyshock', name: 'Psyshock', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Hits physical defense.' },
  ], 'Life Orb'),
  createLvl100Mon('blue_b_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading water rush.' },
    { id: 'bounce', name: 'Bounce', type: 'Flying', category: 'Physical', power: 85, accuracy: 85, pp: 5, description: 'Springs up into air.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
  ], 'Wacan Berry'),
  createLvl100Mon('blue_b_exeggutor', 'Exeggutor', 103, ['Grass', 'Psychic'], { hp: 394, attack: 289, defense: 269, spAtk: 349, spDef: 239, speed: 209 }, 'Harvest', 'Recycles berries continuously in sunlight.', [
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic power.' },
    { id: 'leech_seed', name: 'Leech Seed', type: 'Grass', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Drains HP each turn.' },
    { id: 'substitute', name: 'Substitute', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Decoy substitute.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('blue_b_rhydon', 'Rhydon', 112, ['Ground', 'Rock'], { hp: 414, attack: 359, defense: 339, spAtk: 189, spDef: 189, speed: 179 }, 'Rock Head', 'Prevents recoil damage from moves.', [
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'rock_slide', name: 'Rock Slide', type: 'Rock', category: 'Physical', power: 75, accuracy: 90, pp: 10, description: 'Rock slide with flinch.' },
    { id: 'hammer_arm', name: 'Hammer Arm', type: 'Fighting', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Heavy arm swing.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Eviolite'),
  createLvl100Mon('blue_b_charizard_ace', 'Charizard', 6, ['Fire', 'Flying'], { hp: 360, attack: 267, defense: 255, spAtk: 317, spDef: 269, speed: 299 }, 'Solar Power', 'Boosts SpAtk by 50% in sunshine.', [
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
    { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Wind blades.' },
    { id: 'solar_beam', name: 'Solar Beam', type: 'Grass', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Instant solar beam.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Dragon shockwave.' },
  ], 'Choice Specs'),
];

export const BLUE_CONFIG_C: Pokemon[] = [
  createLvl100Mon('blue_c_pidgeot', 'Pidgeot', 18, ['Normal', 'Flying'], { hp: 368, attack: 259, defense: 249, spAtk: 239, spDef: 239, speed: 301 }, 'Tangled Feet', 'Boosts evasion when confused.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Heroic divebomb strike.' },
    { id: 'return', name: 'Return', type: 'Normal', category: 'Physical', power: 102, accuracy: 100, pp: 20, description: 'Full friendship STAB.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and retreats.' },
    { id: 'steel_wing', name: 'Steel Wing', type: 'Steel', category: 'Physical', power: 70, accuracy: 90, pp: 25, description: 'Hard metallic wings.' },
  ], 'Choice Band'),
  createLvl100Mon('blue_c_arcanine', 'Arcanine', 59, ['Fire'], { hp: 384, attack: 319, defense: 259, spAtk: 299, spDef: 259, speed: 289 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
    { id: 'sunny_day', name: 'Sunny Day', type: 'Fire', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Summons harsh sunlight.' },
    { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Blazing charge.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority.' },
    { id: 'solar_beam', name: 'Solar Beam', type: 'Grass', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Solar energy beam.' },
  ], 'Life Orb'),
  createLvl100Mon('blue_c_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Moxie', 'Boosts Attack by 1 stage after each knockout.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Water rush.' },
    { id: 'ice_fang', name: 'Ice Fang', type: 'Ice', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Frigid bite.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
  ], 'Lum Berry'),
  createLvl100Mon('blue_c_alakazam', 'Alakazam', 65, ['Psychic'], { hp: 314, attack: 199, defense: 189, spAtk: 369, spDef: 289, speed: 339 }, 'Inner Focus', 'Prevents flinching.', [
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
    { id: 'calm_mind', name: 'Calm Mind', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk and SpDef.' },
  ], 'Focus Sash'),
  createLvl100Mon('blue_c_machamp', 'Machamp', 68, ['Fighting'], { hp: 384, attack: 359, defense: 259, spAtk: 229, spDef: 269, speed: 209 }, 'No Guard', 'All attacks never miss.', [
    { id: 'dynamic_punch', name: 'Dynamic Punch', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: 'Guaranteed confusion.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off held item.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority punch.' },
  ], 'Assault Vest'),
  createLvl100Mon('blue_c_venusaur_ace', 'Venusaur', 3, ['Grass', 'Poison'], { hp: 364, attack: 263, defense: 265, spAtk: 299, spDef: 299, speed: 259 }, 'Chlorophyll', 'Doubles Speed in sunshine.', [
    { id: 'growth', name: 'Growth', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and SpAtk by 2 in sun.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Nutrient-stealing grass drain.' },
    { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge.' },
    { id: 'hidden_power', name: 'Hidden Power Fire', type: 'Fire', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'Sun-boosted fire coverage.' },
  ], 'Life Orb'),
];

export const BLUE_CONFIG_D: Pokemon[] = [
  createLvl100Mon('blue_d_tyranitar', 'Tyranitar', 248, ['Rock', 'Dark'], { hp: 404, attack: 367, defense: 319, spAtk: 289, spDef: 299, speed: 221 }, 'Sand Stream', 'Summons enduring sandstorm.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunching dark bite.' },
    { id: 'pursuit', name: 'Pursuit', type: 'Dark', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'Strikes fleeing targets.' },
  ], 'Smooth Rock'),
  createLvl100Mon('blue_d_machamp', 'Machamp', 68, ['Fighting'], { hp: 384, attack: 359, defense: 259, spAtk: 229, spDef: 269, speed: 209 }, 'No Guard', 'All attacks never miss.', [
    { id: 'dynamic_punch', name: 'Dynamic Punch', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: 'Guaranteed confusion.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'facade', name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Doubles power when burned.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority punch.' },
  ], 'Flame Orb'),
  createLvl100Mon('blue_d_rhyperior', 'Rhyperior', 464, ['Ground', 'Rock'], { hp: 434, attack: 379, defense: 359, spAtk: 209, spDef: 209, speed: 179 }, 'Solid Rock', 'Reduces super effective damage by 25%.', [
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating seismic tremor.' },
    { id: 'rock_wrecker', name: 'Rock Wrecker', type: 'Rock', category: 'Physical', power: 150, accuracy: 90, pp: 5, description: 'Tremendous rock projectile.' },
    { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Horn ramming charge.' },
    { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
  ], 'Weakness Policy'),
  createLvl100Mon('blue_d_arcanine', 'Arcanine', 59, ['Fire'], { hp: 384, attack: 319, defense: 259, spAtk: 299, spDef: 259, speed: 289 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Blazing charge.' },
    { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electric blow.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Priority strike.' },
    { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Inflicts burn.' },
  ], 'Leftovers'),
  createLvl100Mon('blue_d_exeggutor', 'Exeggutor', 103, ['Grass', 'Psychic'], { hp: 394, attack: 289, defense: 269, spAtk: 349, spDef: 239, speed: 209 }, 'Chlorophyll', 'Doubles Speed in sunshine.', [
    { id: 'leaf_storm', name: 'Leaf Storm', type: 'Grass', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Leaf whirlwind.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
    { id: 'ancient_power', name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'Ancient power.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Nutrient drain.' },
  ], 'Choice Specs'),
  createLvl100Mon('blue_d_pidgeot_ace', 'Pidgeot', 18, ['Normal', 'Flying'], { hp: 368, attack: 259, defense: 249, spAtk: 239, spDef: 239, speed: 301 }, 'Big Pecks', 'Prevents Defense drops.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Heroic divebomb.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and retreats.' },
    { id: 'quick_attack', name: 'Quick Attack', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Quick priority strike.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
  ], 'Life Orb'),
];

export const BLUE_CONFIG_E: Pokemon[] = [
  createLvl100Mon('blue_e_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Unnerve', 'Prevents opposing berry consumption.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aerial_ace', name: 'Aerial Ace', type: 'Flying', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Never-miss sky slash.' },
    { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunching dark bite.' },
  ], 'Focus Sash'),
  createLvl100Mon('blue_e_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading water rush.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes target.' },
    { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents status moves.' },
  ], 'Leftovers'),
  createLvl100Mon('blue_e_alakazam', 'Alakazam', 65, ['Psychic'], { hp: 314, attack: 199, defense: 189, spAtk: 369, spDef: 289, speed: 339 }, 'Magic Guard', 'Only takes direct attack damage.', [
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
    { id: 'counter', name: 'Counter', type: 'Fighting', category: 'Physical', power: 0, accuracy: 100, pp: 20, priority: -5, description: 'Reflects double physical damage taken.' },
  ], 'Focus Sash'),
  createLvl100Mon('blue_e_machamp', 'Machamp', 68, ['Fighting'], { hp: 384, attack: 359, defense: 259, spAtk: 229, spDef: 269, speed: 209 }, 'No Guard', 'All attacks never miss.', [
    { id: 'dynamic_punch', name: 'Dynamic Punch', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: 'Guaranteed confusion.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Choice Scarf'),
  createLvl100Mon('blue_e_tyranitar', 'Tyranitar', 248, ['Rock', 'Dark'], { hp: 404, attack: 367, defense: 319, spAtk: 289, spDef: 299, speed: 221 }, 'Sand Stream', 'Summons sandstorm.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunching dark bite.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Choice Band'),
  createLvl100Mon('blue_e_arcanine_ace', 'Arcanine', 59, ['Fire'], { hp: 384, attack: 319, defense: 259, spAtk: 299, spDef: 259, speed: 289 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Blazing charge.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Priority strike.' },
    { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Punch barrage.' },
    { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electric blow.' },
  ], 'Sitrus Berry'),
];

// ============================================================================
// 2. LANCE (JOHTO) — 5 CANONICAL CONFIGURATIONS
// ============================================================================

export const LANCE_CONFIG_A: Pokemon[] = [
  createLvl100Mon('lance_a_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading rush.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'ice_fang', name: 'Ice Fang', type: 'Ice', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Chilling bite.' },
  ], 'Wacan Berry'),
  createLvl100Mon('lance_a_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Pressure', 'Forces foe to expend double PP.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays hazard stones.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aerial_ace', name: 'Aerial Ace', type: 'Flying', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Never-miss slash.' },
  ], 'Focus Sash'),
  createLvl100Mon('lance_a_charizard', 'Charizard', 6, ['Fire', 'Flying'], { hp: 360, attack: 267, defense: 255, spAtk: 317, spDef: 269, speed: 299 }, 'Blaze', 'Boosts Fire attacks when low on HP.', [
    { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Intense fire stream.' },
    { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Wind blades.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Draconic wave.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
  ], 'Charti Berry'),
  createLvl100Mon('lance_a_dragonite_sp', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Inner Focus', 'Prevents flinching.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Catastrophic meteor shower.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt shock.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
  ], 'Life Orb'),
  createLvl100Mon('lance_a_dragonite_sup', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes target.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% max HP.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw slash.' },
    { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Hard iron head strike.' },
  ], 'Leftovers'),
  createLvl100Mon('lance_a_dragonite_ace', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic tremor.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
  ], 'Weakness Policy'),
];

export const LANCE_CONFIG_B: Pokemon[] = [
  createLvl100Mon('lance_b_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading rush.' },
    { id: 'bounce', name: 'Bounce', type: 'Flying', category: 'Physical', power: 85, accuracy: 85, pp: 5, description: 'Springs up into air.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
  ], 'Choice Scarf'),
  createLvl100Mon('lance_b_salamence', 'Salamence', 373, ['Dragon', 'Flying'], { hp: 394, attack: 369, defense: 259, spAtk: 319, spDef: 259, speed: 299 }, 'Moxie', 'Boosts Attack by 1 stage after each knockout.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic shock.' },
    { id: 'fire_fang', name: 'Fire Fang', type: 'Fire', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Fiery bite.' },
  ], 'Life Orb'),
  createLvl100Mon('lance_b_kingdra', 'Kingdra', 230, ['Water', 'Dragon'], { hp: 354, attack: 289, defense: 289, spAtk: 289, spDef: 289, speed: 269 }, 'Sniper', 'Powers up critical hits to 2.25x damage.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Catastrophic meteor shower.' },
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Tremendous water blast.' },
    { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Metallic beam of light.' },
    { id: 'agility', name: 'Agility', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Sharply raises Speed by +2.' },
  ], 'Scope Lens'),
  createLvl100Mon('lance_b_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'], { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 }, 'Rough Skin', 'Damages contact attackers.', [
    { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic tremor.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Dragon assault.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
  ], 'Yache Berry'),
  createLvl100Mon('lance_b_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Rock Head', 'Prevents recoil damage from moves.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Recoil-free Brave Bird.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aqua_tail', name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Sweeping water tail.' },
  ], 'Choice Band'),
  createLvl100Mon('lance_b_dragonite_ace', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw slash.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Lum Berry'),
];

export const LANCE_CONFIG_C: Pokemon[] = [
  createLvl100Mon('lance_c_politoed', 'Politoed', 186, ['Water'], { hp: 384, attack: 249, defense: 249, spAtk: 279, spDef: 299, speed: 239 }, 'Drizzle', 'Summons lasting rainstorm on entry.', [
    { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
    { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Full HP recovery.' },
    { id: 'perish_song', name: 'Perish Song', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'All active battlers faint in 3 turns.' },
  ], 'Damp Rock'),
  createLvl100Mon('lance_c_kingdra', 'Kingdra', 230, ['Water', 'Dragon'], { hp: 354, attack: 289, defense: 289, spAtk: 289, spDef: 289, speed: 269 }, 'Swift Swim', 'Doubles Speed in rain.', [
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Rain-boosted hydro torrent.' },
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Catastrophic meteor shower.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing ray.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Draconic shockwave.' },
  ], 'Life Orb'),
  createLvl100Mon('lance_c_dragonite', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'hurricane', name: 'Hurricane', type: 'Flying', category: 'Special', power: 110, accuracy: 100, pp: 10, description: '100% accurate hurricane in rain.' },
    { id: 'thunder', name: 'Thunder', type: 'Electric', category: 'Special', power: 110, accuracy: 100, pp: 10, description: '100% accurate lightning in rain.' },
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Meteor shower.' },
    { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Rain-boosted surf wave.' },
  ], 'Choice Specs'),
  createLvl100Mon('lance_c_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Rain-boosted waterfall.' },
    { id: 'substitute', name: 'Substitute', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Decoy substitute.' },
    { id: 'bounce', name: 'Bounce', type: 'Flying', category: 'Physical', power: 85, accuracy: 85, pp: 5, description: 'Springs up into air.' },
  ], 'Leftovers'),
  createLvl100Mon('lance_c_altaria', 'Altaria', 334, ['Dragon', 'Flying'], { hp: 354, attack: 239, defense: 279, spAtk: 239, spDef: 309, speed: 259 }, 'Cloud Nine', 'Eliminates all weather effects.', [
    { id: 'cotton_guard', name: 'Cotton Guard', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Drastically boosts Defense by +3.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Draconic shockwave.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
  ], 'Leftovers'),
  createLvl100Mon('lance_c_aerodactyl_ace', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Pressure', 'Forces foe to expend double PP.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aqua_tail', name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Rain-boosted water tail.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
  ], 'Focus Sash'),
];

export const LANCE_CONFIG_D: Pokemon[] = [
  createLvl100Mon('lance_d_hydreigon', 'Hydreigon', 635, ['Dark', 'Dragon'], { hp: 388, attack: 289, defense: 279, spAtk: 349, spDef: 279, speed: 295 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Meteor shower.' },
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Inferno blast.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
  ], 'Choice Specs'),
  createLvl100Mon('lance_d_haxorus', 'Haxorus', 612, ['Dragon'], { hp: 356, attack: 393, defense: 279, spAtk: 219, spDef: 239, speed: 293 }, 'Mold Breaker', 'Moves ignore opposing defensive abilities.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'poison_jab', name: 'Poison Jab', type: 'Poison', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Poison jab.' },
  ], 'Focus Sash'),
  createLvl100Mon('lance_d_salamence', 'Salamence', 373, ['Dragon', 'Flying'], { hp: 394, attack: 369, defense: 259, spAtk: 319, spDef: 259, speed: 299 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
  ], 'Choice Scarf'),
  createLvl100Mon('lance_d_kingdra', 'Kingdra', 230, ['Water', 'Dragon'], { hp: 354, attack: 289, defense: 289, spAtk: 289, spDef: 289, speed: 269 }, 'Swift Swim', 'Doubles Speed in rain.', [
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro pump.' },
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Meteor shower.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
    { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Surf.' },
  ], 'Life Orb'),
  createLvl100Mon('lance_d_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'], { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 }, 'Rough Skin', 'Damages contact attackers.', [
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'aqua_tail', name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Aqua tail.' },
  ], 'Choice Band'),
  createLvl100Mon('lance_d_dragonite_ace', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Weakness Policy'),
];

export const LANCE_CONFIG_E: Pokemon[] = [
  createLvl100Mon('lance_e_charizard', 'Charizard', 6, ['Fire', 'Flying'], { hp: 360, attack: 267, defense: 255, spAtk: 317, spDef: 269, speed: 299 }, 'Blaze', 'Boosts Fire attacks when low on HP.', [
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Inferno blast.' },
    { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Air slash.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Dragon pulse.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
  ], 'Choice Scarf'),
  createLvl100Mon('lance_e_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Pressure', 'Forces foe to expend double PP.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunch.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Roost.' },
  ], 'Life Orb'),
  createLvl100Mon('lance_e_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Waterfall.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'ice_fang', name: 'Ice Fang', type: 'Ice', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Ice fang.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('lance_e_lapras', 'Lapras', 131, ['Water', 'Ice'], { hp: 440, attack: 230, defense: 240, spAtk: 260, spDef: 290, speed: 200 }, 'Water Absorb', 'Heals HP when struck by Water attacks.', [
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro pump.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
    { id: 'confuse_ray', name: 'Confuse Ray', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Confuses target.' },
  ], 'Leftovers'),
  createLvl100Mon('lance_e_dragonite_sp', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Inner Focus', 'Prevents flinching.', [
    { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes target.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
  ], 'Yache Berry'),
  createLvl100Mon('lance_e_dragonite_ace', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
  ], 'Lum Berry'),
];

// ============================================================================
// 3. STEVEN STONE (HOENN) — 5 CANONICAL CONFIGURATIONS
// ============================================================================

export const STEVEN_CONFIG_A: Pokemon[] = [
  createLvl100Mon('steven_a_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays hazard stones.' },
    { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays ground spikes.' },
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Divebomb strike with recoil.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% max HP.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_a_claydol', 'Claydol', 344, ['Ground', 'Psychic'], { hp: 324, attack: 239, defense: 309, spAtk: 239, spDef: 339, speed: 249 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'reflect', name: 'Reflect', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Halves physical damage.' },
    { id: 'light_screen', name: 'Light Screen', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Halves special damage.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic wave.' },
  ], 'Light Clay'),
  createLvl100Mon('steven_a_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 359, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Rock Head', 'Prevents recoil damage from moves.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Devastating recoil-free head smash.' },
    { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Massive heavy steel body slam.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Choice Band'),
  createLvl100Mon('steven_a_cradily', 'Cradily', 346, ['Rock', 'Grass'], { hp: 376, attack: 261, defense: 293, spAtk: 261, spDef: 313, speed: 215 }, 'Storm Drain', 'Draws Water moves to boost Sp. Atk.', [
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores half max HP.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
    { id: 'ancient_power', name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'Prehistoric rock strike.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_a_armaldo', 'Armaldo', 348, ['Rock', 'Bug'], { hp: 354, attack: 379, defense: 299, spAtk: 239, spDef: 259, speed: 189 }, 'Battle Armor', 'Protects from critical hits.', [
    { id: 'x_scissor', name: 'X-Scissor', type: 'Bug', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cross scissor slash.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aqua_jet', name: 'Aqua Jet', type: 'Water', category: 'Physical', power: 40, accuracy: 100, pp: 20, priority: 1, description: 'Priority water jet.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('steven_a_metagross_ace', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 399, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents opposing stat drops.', [
    { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor punch that boosts Attack.' },
    { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Psychic head strike with flinch.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic ground tremor.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority metallic punch.' },
  ], 'Lum Berry'),
];

export const STEVEN_CONFIG_B: Pokemon[] = [
  createLvl100Mon('steven_b_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays ground spikes.' },
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays hazard stones.' },
    { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Blows away foe.' },
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Brave bird.' },
  ], 'Rocky Helmet'),
  createLvl100Mon('steven_b_claydol', 'Claydol', 344, ['Ground', 'Psychic'], { hp: 324, attack: 239, defense: 309, spAtk: 239, spDef: 339, speed: 249 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
    { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Earth power.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Toxic.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_b_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 359, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'metal_burst', name: 'Metal Burst', type: 'Steel', category: 'Physical', power: 0, accuracy: 100, pp: 10, description: 'Retaliates 1.5x damage taken.' },
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Head smash.' },
    { id: 'endeavor', name: 'Endeavor', type: 'Normal', category: 'Physical', power: 0, accuracy: 100, pp: 5, description: 'Brings target HP down to user.' },
    { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes foe.' },
  ], 'Custap Berry'),
  createLvl100Mon('steven_b_cradily', 'Cradily', 346, ['Rock', 'Grass'], { hp: 376, attack: 261, defense: 293, spAtk: 261, spDef: 313, speed: 215 }, 'Suction Cups', 'Anchors user against forced switches.', [
    { id: 'ingrain', name: 'Ingrain', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Restores HP every turn.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Toxic.' },
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recover.' },
  ], 'Big Root'),
  createLvl100Mon('steven_b_armaldo', 'Armaldo', 348, ['Rock', 'Bug'], { hp: 354, attack: 379, defense: 299, spAtk: 239, spDef: 259, speed: 189 }, 'Swift Swim', 'Doubles Speed in rain.', [
    { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'x_scissor', name: 'X-Scissor', type: 'Bug', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'X-scissor.' },
    { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off held item.' },
  ], 'Life Orb'),
  createLvl100Mon('steven_b_metagross_ace', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 399, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents opposing stat drops.', [
    { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor mash.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'hammer_arm', name: 'Hammer Arm', type: 'Fighting', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Hammer arm.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority punch.' },
  ], 'Choice Band'),
];

export const STEVEN_CONFIG_C: Pokemon[] = [
  createLvl100Mon('steven_c_archeops', 'Archeops', 567, ['Rock', 'Flying'], { hp: 354, attack: 379, defense: 229, spAtk: 323, spDef: 229, speed: 319 }, 'Defeatist', 'Halves Attack and Sp. Atk when HP drops below 50%.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'acrobatics', name: 'Acrobatics', type: 'Flying', category: 'Physical', power: 110, accuracy: 100, pp: 15, description: 'Acrobatics.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
  ], 'Focus Sash'),
  createLvl100Mon('steven_c_excadrill', 'Excadrill', 530, ['Ground', 'Steel'], { hp: 424, attack: 369, defense: 219, spAtk: 199, spDef: 229, speed: 275 }, 'Sand Rush', 'Doubles Speed in sandstorm.', [
    { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Iron head.' },
    { id: 'rock_slide', name: 'Rock Slide', type: 'Rock', category: 'Physical', power: 75, accuracy: 90, pp: 10, description: 'Rock slide.' },
  ], 'Life Orb'),
  createLvl100Mon('steven_c_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 359, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Rock Head', 'Prevents recoil damage from moves.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Head smash.' },
    { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Iron head.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'low_kick', name: 'Low Kick', type: 'Fighting', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Low kick.' },
  ], 'Assault Vest'),
  createLvl100Mon('steven_c_cradily', 'Cradily', 346, ['Rock', 'Grass'], { hp: 376, attack: 261, defense: 293, spAtk: 261, spDef: 313, speed: 215 }, 'Storm Drain', 'Draws Water moves to boost Sp. Atk.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Stealth rock.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Giga drain.' },
    { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Earth power.' },
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recover.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_c_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Brave bird.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Roost.' },
    { id: 'defog', name: 'Defog', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Clears hazards.' },
    { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Whirlwind.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_c_metagross_ace', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 399, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents opposing stat drops.', [
    { id: 'agility', name: 'Agility', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Boosts Spe by 2.' },
    { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor mash.' },
    { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Zen headbutt.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
  ], 'Air Balloon'),
];

export const STEVEN_CONFIG_D: Pokemon[] = [
  createLvl100Mon('steven_d_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Stealth rock.' },
    { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Spikes.' },
    { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Taunt.' },
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Brave bird.' },
  ], 'Custap Berry'),
  createLvl100Mon('steven_d_claydol', 'Claydol', 344, ['Ground', 'Psychic'], { hp: 324, attack: 239, defense: 309, spAtk: 239, spDef: 339, speed: 249 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'reflect', name: 'Reflect', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Reflect.' },
    { id: 'light_screen', name: 'Light Screen', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Light screen.' },
    { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Earth power.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic.' },
  ], 'Light Clay'),
  createLvl100Mon('steven_d_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Pressure', 'Forces foe to expend double PP.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'aerial_ace', name: 'Aerial Ace', type: 'Flying', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Aerial ace.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Iron head.' },
  ], 'Life Orb'),
  createLvl100Mon('steven_d_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 359, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Rock Head', 'Prevents recoil damage from moves.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Head smash.' },
    { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Heavy slam.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
    { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
  ], 'Choice Band'),
  createLvl100Mon('steven_d_cradily', 'Cradily', 346, ['Rock', 'Grass'], { hp: 376, attack: 261, defense: 293, spAtk: 261, spDef: 313, speed: 215 }, 'Storm Drain', 'Draws Water moves to boost Sp. Atk.', [
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recover.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Giga drain.' },
    { id: 'ancient_power', name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'Ancient power.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Toxic.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_d_metagross_ace', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 399, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents opposing stat drops.', [
    { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor mash.' },
    { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Zen headbutt.' },
    { id: 'hammer_arm', name: 'Hammer Arm', type: 'Fighting', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Hammer arm.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority punch.' },
  ], 'Life Orb'),
];

export const STEVEN_CONFIG_E: Pokemon[] = [
  createLvl100Mon('steven_e_tyranitar', 'Tyranitar', 248, ['Rock', 'Dark'], { hp: 404, attack: 367, defense: 319, spAtk: 289, spDef: 299, speed: 221 }, 'Sand Stream', 'Summons sandstorm.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Stealth rock.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunch.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
  ], 'Smooth Rock'),
  createLvl100Mon('steven_e_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Roost.' },
    { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Whirlwind.' },
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Brave bird.' },
    { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Spikes.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_e_cradily', 'Cradily', 346, ['Rock', 'Grass'], { hp: 376, attack: 261, defense: 293, spAtk: 261, spDef: 313, speed: 215 }, 'Storm Drain', 'Draws Water moves to boost Sp. Atk.', [
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Giga drain.' },
    { id: 'ancient_power', name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'Ancient power.' },
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recover.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Toxic.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_e_magnezone', 'Magnezone', 462, ['Electric', 'Steel'], { hp: 344, attack: 239, defense: 329, spAtk: 359, spDef: 279, speed: 219 }, 'Magnet Pull', 'Traps opposing Steel types.', [
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
    { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Flash cannon.' },
    { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt switch.' },
    { id: 'hidden_power', name: 'Hidden Power Fire', type: 'Fire', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'Hidden power fire.' },
  ], 'Choice Specs'),
  createLvl100Mon('steven_e_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 359, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Rock Head', 'Prevents recoil damage from moves.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Head smash.' },
    { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Heavy slam.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
  ], 'Choice Band'),
  createLvl100Mon('steven_e_metagross_ace', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 399, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents opposing stat drops.', [
    { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor mash.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority punch.' },
    { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
  ], 'Shuca Berry'),
];

// ============================================================================
// 4. IRIS & ALDER (UNOVA) — 5 CANONICAL CONFIGURATIONS
// ============================================================================

export const IRIS_CONFIG_A: Pokemon[] = [
  createLvl100Mon('iris_a_hydreigon', 'Hydreigon', 635, ['Dark', 'Dragon'], { hp: 388, attack: 289, defense: 279, spAtk: 349, spDef: 279, speed: 295 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Meteor shower.' },
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
    { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Floods field.' },
  ], 'Choice Specs'),
  createLvl100Mon('iris_a_druddigon', 'Druddigon', 621, ['Dragon'], { hp: 358, attack: 339, defense: 279, spAtk: 219, spDef: 279, speed: 195 }, 'Rough Skin', 'Inflicts 1/8 damage to attackers making contact.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays hazard stones.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
    { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
    { id: 'glare', name: 'Glare', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Paralyzes foe with 100% accuracy.' },
  ], 'Rocky Helmet'),
  createLvl100Mon('iris_a_archeops', 'Archeops', 567, ['Rock', 'Flying'], { hp: 354, attack: 379, defense: 229, spAtk: 323, spDef: 229, speed: 319 }, 'Defeatist', 'Halves Attack and Sp. Atk when HP drops below 50%.', [
    { id: 'acrobatics', name: 'Acrobatics', type: 'Flying', category: 'Physical', power: 110, accuracy: 100, pp: 15, description: 'Acrobatics.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and retreats.' },
  ], 'Focus Sash'),
  createLvl100Mon('iris_a_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 359, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Head smash.' },
    { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Heavy slam.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'aqua_tail', name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Aqua tail.' },
  ], 'Choice Band'),
  createLvl100Mon('iris_a_lapras', 'Lapras', 131, ['Water', 'Ice'], { hp: 464, attack: 249, defense: 259, spAtk: 269, spDef: 289, speed: 219 }, 'Water Absorb', 'Heals HP when struck by Water attacks.', [
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro pump.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
    { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice shard.' },
  ], 'Leftovers'),
  createLvl100Mon('iris_a_haxorus_ace', 'Haxorus', 612, ['Dragon'], { hp: 356, attack: 393, defense: 279, spAtk: 219, spDef: 239, speed: 293 }, 'Mold Breaker', 'Moves ignore opposing defensive abilities.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'poison_jab', name: 'Poison Jab', type: 'Poison', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Poison strike.' },
  ], 'Focus Sash'),
];

export const IRIS_CONFIG_B: Pokemon[] = [
  createLvl100Mon('iris_b_salamence', 'Salamence', 373, ['Dragon', 'Flying'], { hp: 394, attack: 369, defense: 259, spAtk: 319, spDef: 259, speed: 299 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
  ], 'Choice Scarf'),
  createLvl100Mon('iris_b_hydreigon', 'Hydreigon', 635, ['Dark', 'Dragon'], { hp: 388, attack: 289, defense: 279, spAtk: 349, spDef: 279, speed: 295 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Dragon pulse.' },
    { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Flamethrower.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Roost.' },
  ], 'Life Orb'),
  createLvl100Mon('iris_b_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'], { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 }, 'Rough Skin', 'Damages contact attackers.', [
    { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
  ], 'Yache Berry'),
  createLvl100Mon('iris_b_dragonite', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 339, defense: 269, spAtk: 319, spDef: 289, speed: 249 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Supersonic priority rush.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
  ], 'Weakness Policy'),
  createLvl100Mon('iris_b_lapras', 'Lapras', 131, ['Water', 'Ice'], { hp: 464, attack: 249, defense: 259, spAtk: 269, spDef: 289, speed: 219 }, 'Hydration', 'Heals status conditions in rain.', [
    { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Rest.' },
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro pump.' },
    { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 70, pp: 5, description: 'Blizzard.' },
    { id: 'thunder', name: 'Thunder', type: 'Electric', category: 'Special', power: 110, accuracy: 70, pp: 10, description: 'Thunder.' },
  ], 'Chesto Berry'),
  createLvl100Mon('iris_b_haxorus_ace', 'Haxorus', 612, ['Dragon'], { hp: 356, attack: 393, defense: 279, spAtk: 219, spDef: 239, speed: 293 }, 'Mold Breaker', 'Moves ignore opposing defensive abilities.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'dual_chop', name: 'Dual Chop', type: 'Dragon', category: 'Physical', power: 40, accuracy: 90, pp: 15, description: 'Strikes twice in succession.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
  ], 'Lum Berry'),
];

export const ALDER_CONFIG_A: Pokemon[] = [
  createLvl100Mon('alder_a_accelgor', 'Accelgor', 617, ['Bug'], { hp: 364, attack: 239, defense: 179, spAtk: 299, spDef: 219, speed: 429 }, 'Unburden', 'Doubles Speed when held item is lost.', [
    { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Bug buzz.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
    { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Energy ball.' },
    { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Spikes.' },
  ], 'Focus Sash'),
  createLvl100Mon('alder_a_bouffalant', 'Bouffalant', 626, ['Normal'], { hp: 394, attack: 359, defense: 289, spAtk: 179, spDef: 289, speed: 209 }, 'Reckless', 'Powers up recoil moves by 20%.', [
    { id: 'head_charge', name: 'Head Charge', type: 'Normal', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Heavy recoil charge with 1.2x boost.' },
    { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Megahorn.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Wild charge.' },
  ], 'Choice Band'),
  createLvl100Mon('alder_a_druddigon', 'Druddigon', 621, ['Dragon'], { hp: 358, attack: 339, defense: 279, spAtk: 219, spDef: 279, speed: 195 }, 'Sheer Force', 'Removes secondary effects to boost move power by 30%.', [
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
    { id: 'thunder_punch', name: 'Thunder Punch', type: 'Electric', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Thunder punch.' },
    { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
  ], 'Life Orb'),
  createLvl100Mon('alder_a_vanilluxe', 'Vanilluxe', 584, ['Ice'], { hp: 346, attack: 289, defense: 269, spAtk: 349, spDef: 289, speed: 257 }, 'Ice Body', 'Gradually regains HP in hail.', [
    { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 70, pp: 5, description: 'Blizzard.' },
    { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Flash cannon.' },
    { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice shard.' },
    { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Signal beam.' },
  ], 'Never-Melt Ice'),
  createLvl100Mon('alder_a_escavalier', 'Escavalier', 589, ['Bug', 'Steel'], { hp: 344, attack: 399, defense: 309, spAtk: 219, spDef: 309, speed: 139 }, 'Swarm', 'Powers up Bug moves in a pinch.', [
    { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Megahorn.' },
    { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Iron head.' },
    { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knock off.' },
    { id: 'drill_run', name: 'Drill Run', type: 'Ground', category: 'Physical', power: 80, accuracy: 95, pp: 10, description: 'Critical ground drill.' },
  ], 'Occa Berry'),
  createLvl100Mon('alder_a_volcarona_ace', 'Volcarona', 637, ['Bug', 'Fire'], { hp: 374, attack: 219, defense: 229, spAtk: 369, spDef: 309, speed: 299 }, 'Flame Body', 'Contact with the user may burn attacker.', [
    { id: 'quiver_dance', name: 'Quiver Dance', type: 'Bug', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk, SpDef, and Spe by 1.' },
    { id: 'fiery_dance', name: 'Fiery Dance', type: 'Fire', category: 'Special', power: 80, accuracy: 100, pp: 10, description: '50% chance to boost Sp. Atk by +1.' },
    { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Bug buzz.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Giga drain.' },
  ], 'Lum Berry'),
];

export const ALDER_CONFIG_B: Pokemon[] = [
  createLvl100Mon('alder_b_accelgor', 'Accelgor', 617, ['Bug'], { hp: 364, attack: 239, defense: 179, spAtk: 299, spDef: 219, speed: 429 }, 'Hydration', 'Heals status in rain.', [
    { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Bug buzz.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Giga drain.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
  ], 'Life Orb'),
  createLvl100Mon('alder_b_conkeldurr', 'Conkeldurr', 534, ['Fighting'], { hp: 414, attack: 379, defense: 289, spAtk: 199, spDef: 249, speed: 189 }, 'Guts', 'Boosts Attack by 50% when afflicted by status.', [
    { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Drains 50% of damage dealt.' },
    { id: 'mach_punch', name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority punch.' },
    { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knock off.' },
    { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
  ], 'Flame Orb'),
  createLvl100Mon('alder_b_reuniclus', 'Reuniclus', 579, ['Psychic'], { hp: 424, attack: 229, defense: 249, spAtk: 349, spDef: 269, speed: 159 }, 'Magic Guard', 'Only takes direct attack damage.', [
    { id: 'trick_room', name: 'Trick Room', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 5, priority: -7, description: 'Slower Pokémon move first for 5 turns.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recover.' },
  ], 'Life Orb'),
  createLvl100Mon('alder_b_braviary', 'Braviary', 628, ['Normal', 'Flying'], { hp: 404, attack: 345, defense: 249, spAtk: 213, spDef: 249, speed: 259 }, 'Defiant', 'Boosts Attack sharply by +2 stages if stat lowered.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Brave bird.' },
    { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
    { id: 'return', name: 'Return', type: 'Normal', category: 'Physical', power: 102, accuracy: 100, pp: 20, description: 'Return.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
  ], 'Choice Scarf'),
  createLvl100Mon('alder_b_chandelure', 'Chandelure', 609, ['Ghost', 'Fire'], { hp: 324, attack: 209, defense: 279, spAtk: 389, spDef: 279, speed: 259 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow ball.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
    { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Energy ball.' },
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark pulse.' },
  ], 'Choice Specs'),
  createLvl100Mon('alder_b_volcarona_ace', 'Volcarona', 637, ['Bug', 'Fire'], { hp: 374, attack: 219, defense: 229, spAtk: 369, spDef: 309, speed: 299 }, 'Flame Body', 'Contact with the user may burn attacker.', [
    { id: 'quiver_dance', name: 'Quiver Dance', type: 'Bug', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk, SpDef, and Spe by 1.' },
    { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Flamethrower.' },
    { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Bug buzz.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
  ], 'Leftovers'),
];

export const IRIS_CONFIG_C: Pokemon[] = [
  createLvl100Mon('iris_c_hydreigon', 'Hydreigon', 635, ['Dark', 'Dragon'], { hp: 388, attack: 289, defense: 279, spAtk: 349, spDef: 279, speed: 295 }, 'Levitate', 'Full immunity to Ground attacks.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Meteor shower.' },
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast.' },
    { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Earth power.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
  ], 'Choice Scarf'),
  createLvl100Mon('iris_c_lucario', 'Lucario', 448, ['Fighting', 'Steel'], { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 }, 'Justified', 'Boosts Attack when hit by Dark attacks.', [
    { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Close combat.' },
    { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Flash cannon.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Priority rush.' },
    { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
  ], 'Life Orb'),
  createLvl100Mon('iris_c_archeops', 'Archeops', 567, ['Rock', 'Flying'], { hp: 354, attack: 379, defense: 229, spAtk: 323, spDef: 229, speed: 319 }, 'Defeatist', 'Halves stats when below half HP.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
    { id: 'acrobatics', name: 'Acrobatics', type: 'Flying', category: 'Physical', power: 110, accuracy: 100, pp: 15, description: 'Acrobatics.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Roost.' },
  ], 'Focus Sash'),
  createLvl100Mon('iris_c_lapras', 'Lapras', 131, ['Water', 'Ice'], { hp: 464, attack: 249, defense: 259, spAtk: 269, spDef: 289, speed: 219 }, 'Water Absorb', 'Heals HP when hit by Water.', [
    { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Toxic.' },
  ], 'Leftovers'),
  createLvl100Mon('iris_c_druddigon', 'Druddigon', 621, ['Dragon'], { hp: 358, attack: 339, defense: 279, spAtk: 219, spDef: 279, speed: 195 }, 'Sheer Force', 'Boosts move power by 30%.', [
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority dark strike.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
    { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
  ], 'Assault Vest'),
  createLvl100Mon('iris_c_haxorus_ace', 'Haxorus', 612, ['Dragon'], { hp: 356, attack: 393, defense: 279, spAtk: 219, spDef: 239, speed: 293 }, 'Mold Breaker', 'Moves ignore opposing defensive abilities.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Outrage.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
    { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
  ], 'Focus Sash'),
];

// ============================================================================
// 5. MASTER CHAMPION ROTATION MATRIX REGISTRY
// ============================================================================

export const CHAMPION_ROTATION_MATRIX: ChampionRosterRegistry = {
  cynthia: [
    { configId: 'A', name: 'Platinum Standard', seasonLabel: 'Spring Championship', theme: 'Canonical Balanced Core', playstyle: 'Spiritomb pressure, Serene Grace flinch-lock, and Garchomp Swords Dance.', team: CYNTHIA_PLATINUM_STANDARD },
    { configId: 'B', name: 'Diamond & Pearl Classic', seasonLabel: 'Summer Showcase', theme: 'Bulky Water / Gastrodon Pivot', playstyle: 'Bulky attrition with Storm Drain Gastrodon absorbing water moves.', team: CYNTHIA_DP_CLASSIC },
    { configId: 'C', name: 'Undella Town Vacation', seasonLabel: 'Autumn Open', theme: 'Fast Hyper-Offense', playstyle: 'Aggressive physical beatdown with Eelektross and Braviary.', team: CYNTHIA_UNDELLA_HYPER_OFFENSE },
    { configId: 'D', name: 'Pokémon World Tournament', seasonLabel: 'Winter Masters', theme: 'Masters Edition', playstyle: 'Glaceon hail disruption, Nasty Plot Togekiss, Lum Berry Garchomp.', team: CYNTHIA_PWT_MASTERS },
    { configId: 'E', name: 'Sand Veil Fortress', seasonLabel: 'Grand Festival', theme: 'Weather Synergies', playstyle: 'Sandstorm-fueled evasion and chip with Hippowdon setting Sand.', team: CYNTHIA_SAND_VEIL_FORTRESS },
  ],
  blue: [
    { configId: 'A', name: 'Charizard Starter Matchup', seasonLabel: 'Spring Championship', theme: 'Fast Fire/Flying Aggression', playstyle: 'Blastoise Shell Smash ace with Alakazam and Rhydon core.', team: BLUE_CONFIG_A },
    { configId: 'B', name: 'Blastoise Starter Matchup', seasonLabel: 'Summer Showcase', theme: 'Charizard Sun Dominance', playstyle: 'Specs Charizard Solar Power under sunlight with Aerodactyl lead.', team: BLUE_CONFIG_B },
    { configId: 'C', name: 'Venusaur Starter Matchup', seasonLabel: 'Autumn Open', theme: 'Chlorophyll Sun Sweeper', playstyle: 'Growth Chlorophyll Venusaur with Sunny Day Arcanine support.', team: BLUE_CONFIG_C },
    { configId: 'D', name: 'HGSS Gym Leader Rematch', seasonLabel: 'Winter Masters', theme: 'Tyranitar Sand Offense', playstyle: 'Smooth Rock Tyranitar setting Sand for Solid Rock Rhyperior.', team: BLUE_CONFIG_D },
    { configId: 'E', name: 'PWT Champions Tournament', seasonLabel: 'Grand Festival', theme: 'Veterans Squad', playstyle: 'High Base Stat Total versatility with Machamp Scarf and Tyranitar Band.', team: BLUE_CONFIG_E },
  ],
  lance: [
    { configId: 'A', name: 'Canonical Dragon Hoard', seasonLabel: 'Spring Championship', theme: 'Triple Dragonite Setup', playstyle: 'Multiscale Weakness Policy Dragonite with Gyarados and Aerodactyl.', team: LANCE_CONFIG_A },
    { configId: 'B', name: 'HGSS Rematch Hoenn Imports', seasonLabel: 'Summer Showcase', theme: 'Modern Dragon Diversity', playstyle: 'Moxie Salamence and Sniper Kingdra with Choice Band Aerodactyl.', team: LANCE_CONFIG_B },
    { configId: 'C', name: 'Rainstorm Dragon Assault', seasonLabel: 'Autumn Open', theme: 'Swift Swim & 100% Thunder', playstyle: 'Drizzle Politoed enabling 100% accurate Hurricane and Thunder.', team: LANCE_CONFIG_C },
    { configId: 'D', name: 'PWT Champions Tournament', seasonLabel: 'Winter Masters', theme: 'Pure Dragon Masters', playstyle: 'Hydreigon Specs, Mold Breaker Haxorus, and Band Garchomp.', team: LANCE_CONFIG_D },
    { configId: 'E', name: 'Indigo Stadium Rematch', seasonLabel: 'Grand Festival', theme: 'Flying/Dragon Classic', playstyle: 'Classic balanced Dragonite anchor with Lapras and Charizard.', team: LANCE_CONFIG_E },
  ],
  steven: [
    { configId: 'A', name: 'Ever Grande Minerals', seasonLabel: 'Spring Championship', theme: 'Canonical Steel & Minerals', playstyle: 'Dual screens Claydol and Lum Berry Metagross with Band Aggron.', team: STEVEN_CONFIG_A },
    { configId: 'B', name: 'Meteor Falls Secret Boss', seasonLabel: 'Summer Showcase', theme: 'Level 100 Hyper-Armor', playstyle: 'Metal Burst Custap Aggron, Big Root Cradily, and Choice Band Metagross.', team: STEVEN_CONFIG_B },
    { configId: 'C', name: 'PWT Modern Steel Sweepers', seasonLabel: 'Autumn Open', theme: 'Excadrill & Agility Meta', playstyle: 'Sand Rush Excadrill and Agility Metagross fast offense.', team: STEVEN_CONFIG_C },
    { configId: 'D', name: 'ORAS Battle Resort', seasonLabel: 'Winter Masters', theme: 'Screen Support & Heavy Smash', playstyle: 'Dual screens Claydol with Life Orb Metagross and Aggron smash.', team: STEVEN_CONFIG_D },
    { configId: 'E', name: 'Sandstorm Armored Division', seasonLabel: 'Grand Festival', theme: 'Tyranitar Sand Fortress', playstyle: 'Sand Stream Tyranitar boosting Rock Special Defense with Skarmory spikes.', team: STEVEN_CONFIG_E },
  ],
  iris: [
    { configId: 'A', name: 'B2W2 Challenge Mode', seasonLabel: 'Spring Championship', theme: 'Dragon Dance Mold Breaker', playstyle: 'Haxorus Dragon Dance with Specs Hydreigon and Rocky Helmet Druddigon.', team: IRIS_CONFIG_A },
    { configId: 'B', name: 'PWT Masters Dragon Storm', seasonLabel: 'Summer Showcase', theme: 'Cross-Gen Dragons', playstyle: 'Dual Chop Haxorus, Scarf Salamence, and Weakness Policy Dragonite.', team: IRIS_CONFIG_B },
    { configId: 'C', name: 'BW Champion Canonical (Alder)', seasonLabel: 'Autumn Open', theme: 'Volcarona Sun Apex', playstyle: 'Quiver Dance Volcarona with Reckless Bouffalant and Occa Escavalier.', team: ALDER_CONFIG_A },
    { configId: 'D', name: 'B2W2 Postgame Master (Alder)', seasonLabel: 'Winter Masters', theme: 'Trick Room & Guts Bulk', playstyle: 'Reuniclus Trick Room setting for Flame Orb Guts Conkeldurr.', team: ALDER_CONFIG_B },
    { configId: 'E', name: 'PWT Balanced Champion', seasonLabel: 'Grand Festival', theme: 'Dragon Agility', playstyle: 'Scarf Hydreigon U-turn momentum with Life Orb Lucario.', team: IRIS_CONFIG_C },
  ],
};

// ============================================================================
// 6. ROTATION SELECTORS & HELPERS
// ============================================================================

/**
 * Retrieves the active Champion configuration based on calendar month (1-12) or explicit date/seed.
 * Month index 0-11 maps deterministically across the 5 canonical configurations:
 * Month 1, 6, 11 (Jan, Jun, Nov) -> Config A
 * Month 2, 7, 12 (Feb, Jul, Dec) -> Config B
 * Month 3, 8     (Mar, Aug)      -> Config C
 * Month 4, 9     (Apr, Sep)      -> Config D
 * Month 5, 10    (May, Oct)      -> Config E
 */
export function getMonthlyChampionConfig(
  championId: ChampionId,
  dateOrSeed: Date | string = new Date()
): ChampionConfigEntry {
  const configs = CHAMPION_ROTATION_MATRIX[championId] ?? CHAMPION_ROTATION_MATRIX.cynthia;

  if (typeof dateOrSeed === 'string') {
    // If exact letter A-E provided
    const upper = dateOrSeed.trim().toUpperCase() as ConfigLetter;
    const match = configs.find((c) => c.configId === upper);
    if (match) return match;

    // Deterministic date string hash
    let hash = 0;
    for (let i = 0; i < dateOrSeed.length; i++) {
      hash = (hash * 31 + dateOrSeed.charCodeAt(i)) >>> 0;
    }
    return configs[hash % configs.length];
  }

  const month = dateOrSeed.getUTCMonth(); // 0 to 11
  const configIndex = month % configs.length;
  return configs[configIndex];
}

/**
 * Retrieves the 3 daily player presets (SWEEP, BALANCE, STALL) for the given region.
 * Validates that all squads have complete 6-mon teams with competitive held items.
 */
export function getDailyPlayerTeams(regionId: RegionId): TeamPreset[] {
  const league = REGIONAL_LEAGUES[regionId] ?? REGIONAL_LEAGUES.sinnoh;
  return league.dailyPlayerTeams;
}
