/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Kanto Regional League (Indigo Plateau)
 * Champion: Blue
 * Elite Four: Lorelei, Bruno, Agatha, Lance
 * Daily Player Squads: 3 Archetypes with Held Items
 */

import { Pokemon, EliteFourMember, RegionalLeagueConfig, createLvl100Mon } from './types';

export const KANTO_ELITE_FOUR: EliteFourMember[] = [
  {
    id: 'kanto_lorelei',
    name: 'Lorelei',
    title: 'Elite Four Lorelei',
    specialty: 'Ice & Bulky Water Specialist',
    roster: [
      createLvl100Mon('lorelei_dewgong', 'Dewgong', 87, ['Water', 'Ice'], { hp: 384, attack: 239, defense: 259, spAtk: 239, spDef: 319, speed: 239 }, 'Thick Fat', 'Halves damage taken from Fire and Ice attacks.', [
        { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Waves crash down on foe.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing blast of subzero ice.' },
        { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Fires sinister light beam.' },
        { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Sleeps for 2 turns to recover HP and status.' },
      ], 'Leftovers'),
      createLvl100Mon('lorelei_cloyster', 'Cloyster', 91, ['Water', 'Ice'], { hp: 304, attack: 289, defense: 459, spAtk: 269, spDef: 189, speed: 239 }, 'Skill Link', 'Multi-strike moves always hit the maximum 5 times.', [
        { id: 'icicle_spear', name: 'Icicle Spear', type: 'Ice', category: 'Physical', power: 25, accuracy: 100, pp: 30, description: 'Launches 5 sharp icicles.' },
        { id: 'rock_blast', name: 'Rock Blast', type: 'Rock', category: 'Physical', power: 25, accuracy: 90, pp: 10, description: 'Fires 5 hard boulders.' },
        { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Scatters entry spikes.' },
        { id: 'shell_smash', name: 'Shell Smash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Lowers defenses, drastically boosts Atk, SpAtk, Spe.' },
      ], 'Focus Sash'),
      createLvl100Mon('lorelei_slowbro', 'Slowbro', 80, ['Water', 'Psychic'], { hp: 394, attack: 249, defense: 319, spAtk: 299, spDef: 259, speed: 159 }, 'Own Tempo', 'Prevents confusion.', [
        { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn rate.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Strong telekinetic force.' },
        { id: 'calm_mind', name: 'Calm Mind', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Sp. Atk and Sp. Def.' },
        { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers 50% HP.' },
      ], 'Sitrus Berry'),
      createLvl100Mon('lorelei_jynx', 'Jynx', 124, ['Ice', 'Psychic'], { hp: 334, attack: 199, defense: 169, spAtk: 329, spDef: 289, speed: 289 }, 'Forewarn', 'Reveals the opponent’s strongest move.', [
        { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 70, pp: 5, description: 'Howling sub-zero blizzard.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic psychic assault.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob dealing damage.' },
        { id: 'lovely_kiss', name: 'Lovely Kiss', type: 'Normal', category: 'Status', power: 0, accuracy: 75, pp: 10, description: 'Induces soothing sleep.' },
      ], 'Life Orb'),
      createLvl100Mon('lorelei_lapras', 'Lapras', 131, ['Water', 'Ice'], { hp: 464, attack: 269, defense: 259, spAtk: 269, spDef: 289, speed: 219 }, 'Water Absorb', 'Restores HP if struck by Water-type attacks.', [
        { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Blasts a massive volume of water.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Frigid beam with freeze chance.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Jolt of electric voltage.' },
        { id: 'confuse_ray', name: 'Confuse Ray', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Inflicts confusing rays.' },
      ], 'Chesto Berry'),
    ],
  },
  {
    id: 'kanto_bruno',
    name: 'Bruno',
    title: 'Elite Four Bruno',
    specialty: 'Fighting & Physical Power Specialist',
    roster: [
      createLvl100Mon('bruno_hitmontop', 'Hitmontop', 237, ['Fighting'], { hp: 304, attack: 289, defense: 289, spAtk: 169, spDef: 319, speed: 239 }, 'Intimidate', 'Lowers the foe\'s Attack stage on entry.', [
        { id: 'triple_kick', name: 'Triple Kick', type: 'Fighting', category: 'Physical', power: 20, accuracy: 90, pp: 10, description: 'Strikes up to 3 times with increasing force.' },
        { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards and boosts Speed.' },
        { id: 'mach_punch', name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating punch barrage.' },
      ], 'Sitrus Berry'),
      createLvl100Mon('bruno_hitmonlee', 'Hitmonlee', 106, ['Fighting'], { hp: 304, attack: 339, defense: 205, spAtk: 169, spDef: 319, speed: 273 }, 'Limber', 'Immune to paralysis.', [
        { id: 'high_jump_kick', name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 130, accuracy: 90, pp: 10, description: 'Devastating jump kick that crashes on miss.' },
        { id: 'fake_out', name: 'Fake Out', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 10, priority: 3, description: 'Guaranteed flinch on first turn out.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stabs with jagged stones.' },
        { id: 'blaze_kick', name: 'Blaze Kick', type: 'Fire', category: 'Physical', power: 85, accuracy: 90, pp: 10, description: 'Fiery kick with high critical hit ratio.' },
      ], 'Expert Belt'),
      createLvl100Mon('bruno_hitmonchan', 'Hitmonchan', 107, ['Fighting'], { hp: 304, attack: 309, defense: 257, spAtk: 169, spDef: 319, speed: 251 }, 'Iron Fist', 'Boosts the power of punching moves by 20%.', [
        { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Restores HP equal to half damage.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Sub-zero freezing punch.' },
        { id: 'thunder_punch', name: 'Thunder Punch', type: 'Electric', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Electrified punch.' },
        { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority metallic punch.' },
      ], 'Life Orb'),
      createLvl100Mon('bruno_steelix', 'Steelix', 208, ['Steel', 'Ground'], { hp: 354, attack: 269, defense: 499, spAtk: 199, spDef: 229, speed: 159 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
        { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic ground tremor.' },
        { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Crushes with high metallic weight.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Jagged stone eruption.' },
      ], 'Leftovers'),
      createLvl100Mon('bruno_machamp', 'Machamp', 68, ['Fighting'], { hp: 384, attack: 359, defense: 259, spAtk: 229, spDef: 269, speed: 209 }, 'No Guard', 'All moves used by and against this Pokémon bypass accuracy.', [
        { id: 'dynamic_punch', name: 'Dynamic Punch', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: 'Guaranteed confusion on hit.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: 'Critical rock blow.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
        { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
      ], 'Flame Orb'),
    ],
  },
  {
    id: 'kanto_agatha',
    name: 'Agatha',
    title: 'Elite Four Agatha',
    specialty: 'Ghost & Poison Hex Specialist',
    roster: [
      createLvl100Mon('agatha_gengar_lead', 'Gengar', 94, ['Ghost', 'Poison'], { hp: 324, attack: 229, defense: 219, spAtk: 359, spDef: 249, speed: 319 }, 'Levitate', 'Immune to Ground-type attacks.', [
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow sphere.' },
        { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Hurls unsanitary sludge.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric shock.' },
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Takes the foe down with it.' },
      ], 'Focus Sash'),
      createLvl100Mon('agatha_crobat', 'Crobat', 169, ['Poison', 'Flying'], { hp: 374, attack: 279, defense: 259, spAtk: 239, spDef: 259, speed: 359 }, 'Infiltrator', 'Passes through barriers like Substitute and Reflect.', [
        { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Reckless diving attack.' },
        { id: 'cross_poison', name: 'Cross Poison', type: 'Poison', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Poison slash with high critical.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches out.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Black Sludge'),
      createLvl100Mon('agatha_arbok', 'Arbok', 24, ['Poison'], { hp: 324, attack: 289, defense: 237, spAtk: 229, spDef: 257, speed: 259 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
        { id: 'gunk_shot', name: 'Gunk Shot', type: 'Poison', category: 'Physical', power: 120, accuracy: 80, pp: 5, description: 'Filthy garbage strike.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Strikes first if foe attacks.' },
        { id: 'glare', name: 'Glare', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Paralyzes the target with an intimidating stare.' },
      ], 'Shuca Berry'),
      createLvl100Mon('agatha_misdreavus', 'Misdreavus', 200, ['Ghost'], { hp: 324, attack: 219, defense: 219, spAtk: 269, spDef: 269, speed: 269 }, 'Levitate', 'Immune to Ground moves.', [
        { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Inflicts painful burn.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Ghostly shadowy blast.' },
        { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzing electric zap.' },
        { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Shares HP equally with foe.' },
      ], 'Eviolite'),
      createLvl100Mon('agatha_gengar_ace', 'Gengar', 94, ['Ghost', 'Poison'], { hp: 324, attack: 229, defense: 219, spAtk: 359, spDef: 249, speed: 319 }, 'Levitate', 'Levitates above ground tremors.', [
        { id: 'hypnosis', name: 'Hypnosis', type: 'Psychic', category: 'Status', power: 0, accuracy: 60, pp: 20, description: 'Induces deep sleep.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blast.' },
        { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Heightened focus blast.' },
        { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
      ], 'Life Orb'),
    ],
  },
  {
    id: 'kanto_lance',
    name: 'Lance',
    title: 'Elite Four Lance',
    specialty: 'Dragon & Flying Specialist',
    roster: [
      createLvl100Mon('lance_gyarados', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
        { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack and Speed.' },
        { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading rush with flinch.' },
        { id: 'bounce', name: 'Bounce', type: 'Flying', category: 'Physical', power: 85, accuracy: 85, pp: 5, description: 'Springs into the air then dives.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
      ], 'Wacan Berry'),
      createLvl100Mon('lance_aerodactyl', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Pressure', 'Doubles opponent PP consumption.', [
        { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Scatters floating stones.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth shaking shockwave.' },
        { id: 'aerial_ace', name: 'Aerial Ace', type: 'Flying', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Infallible air strike.' },
      ], 'Focus Sash'),
      createLvl100Mon('lance_charizard', 'Charizard', 6, ['Fire', 'Flying'], { hp: 360, attack: 267, defense: 255, spAtk: 317, spDef: 269, speed: 299 }, 'Blaze', 'Powers up Fire moves in a pinch.', [
        { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Intense searing flame.' },
        { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Wind blades with flinch.' },
        { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Shockwave of draconic power.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Leftovers'),
      createLvl100Mon('lance_dragonite_sp', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 367, defense: 289, spAtk: 299, spDef: 299, speed: 259 }, 'Inner Focus', 'Prevents flinching.', [
        { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Summons comets from the sky.' },
        { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'All-consuming inferno.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Strong electric shock.' },
        { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Blinding priority tackle.' },
      ], 'Lum Berry'),
      createLvl100Mon('lance_dragonite_ace', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 367, defense: 289, spAtk: 299, spDef: 299, speed: 259 }, 'Multiscale', 'Halves damage taken when at full HP.', [
        { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
        { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Frenzied rampage for 2-3 turns.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating seismic tremor.' },
        { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Blinding speed attack.' },
      ], 'Weakness Policy'),
    ],
  },
];

export const KANTO_CHAMPION_BLUE: Pokemon[] = [
  createLvl100Mon('blue_pidgeot', 'Pidgeot', 18, ['Normal', 'Flying'], { hp: 370, attack: 259, defense: 249, spAtk: 239, spDef: 239, speed: 301 }, 'Keen Eye', 'Prevents accuracy loss.', [
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Full-power dive with recoil.' },
    { id: 'return', name: 'Return', type: 'Normal', category: 'Physical', power: 102, accuracy: 100, pp: 20, description: 'Full-power friendship blow.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Strikes and switches to bench.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
  ], 'Life Orb'),
  createLvl100Mon('blue_alakazam', 'Alakazam', 65, ['Psychic'], { hp: 314, attack: 199, defense: 189, spAtk: 369, spDef: 289, speed: 339 }, 'Magic Guard', 'Only takes damage from direct attacks.', [
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Powerful psychic blast.' },
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers SpDef.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'High power fighting burst.' },
    { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Nature energy sphere.' },
  ], 'Focus Sash'),
  createLvl100Mon('blue_rhydon', 'Rhydon', 112, ['Ground', 'Rock'], { hp: 414, attack: 359, defense: 339, spAtk: 189, spDef: 189, speed: 179 }, 'Lightning Rod', 'Draws and neutralizes Electric attacks.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Floats sharp stones on enemy field.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground shattering strike.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
    { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Huge horn ramming charge.' },
  ], 'Eviolite'),
  createLvl100Mon('blue_exeggutor', 'Exeggutor', 103, ['Grass', 'Psychic'], { hp: 394, attack: 289, defense: 269, spAtk: 349, spDef: 249, speed: 209 }, 'Chlorophyll', 'Doubles Speed in sunny weather.', [
    { id: 'leaf_storm', name: 'Leaf Storm', type: 'Grass', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Storm of leaves, lowers SpAtk.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic psychic assault.' },
    { id: 'sleep_powder', name: 'Sleep Powder', type: 'Grass', category: 'Status', power: 0, accuracy: 75, pp: 15, description: 'Scatters sleeping spores.' },
    { id: 'synthesis', name: 'Synthesis', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP using solar power.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('blue_arcanine', 'Arcanine', 59, ['Fire'], { hp: 384, attack: 319, defense: 259, spAtk: 299, spDef: 259, speed: 289 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Blazing charge with recoil.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Blinding priority strike.' },
    { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electrified tackle with recoil.' },
    { id: 'morning_sun', name: 'Morning Sun', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP.' },
  ], 'Leftovers'),
  createLvl100Mon('blue_blastoise_ace', 'Blastoise', 9, ['Water'], { hp: 362, attack: 265, defense: 299, spAtk: 269, spDef: 309, speed: 255 }, 'Torrent', 'Boosts Water moves in a pinch.', [
    { id: 'shell_smash', name: 'Shell Smash', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Drastically boosts Atk, SpAtk, Spe.' },
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Blasts high-pressure water.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Sub-zero arctic ice beam.' },
    { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Infallible aura strike.' },
  ], 'White Herb'),
];

export const KANTO_LEAGUE: RegionalLeagueConfig = {
  regionId: 'kanto',
  regionName: 'Kanto',
  leagueName: 'Indigo Plateau',
  championName: 'Blue',
  championTitle: 'Kanto Champion',
  championRoster: KANTO_CHAMPION_BLUE,
  eliteFour: KANTO_ELITE_FOUR,
  dailyPlayerTeams: [
    {
      id: 'kanto_sunny_chlorophyll',
      name: 'Sunny Day Chlorophyll',
      tagline: 'Solar Fire & Doubled Speed',
      strategyTag: 'SWEEP',
      difficulty: 'Beginner Friendly',
      description: 'Sun-boosted Fire Blitz and doubled Chlorophyll speed.',
      recommendedLead: 'Charizard',
      colorTheme: '#ef4444',
      team: [
        createLvl100Mon('k_charizard', 'Charizard', 6, ['Fire', 'Flying'], { hp: 360, attack: 267, defense: 255, spAtk: 317, spDef: 269, speed: 299 }, 'Solar Power', 'Boosts SpAtk in sunshine.', [
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Inferno blast.' },
          { id: 'solar_beam', name: 'Solar Beam', type: 'Grass', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Instant solar beam in sun.' },
          { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Air blades.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
        ], 'Choice Specs'),
        createLvl100Mon('k_venusaur', 'Venusaur', 3, ['Grass', 'Poison'], { hp: 364, attack: 263, defense: 265, spAtk: 299, spDef: 299, speed: 259 }, 'Chlorophyll', 'Doubles Speed in sun.', [
          { id: 'growth', name: 'Growth', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and SpAtk by 2 in sun.' },
          { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
          { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge.' },
          { id: 'weather_ball', name: 'Weather Ball', type: 'Normal', category: 'Special', power: 100, accuracy: 100, pp: 10, description: 'Fire Weather Ball in sun.' },
        ], 'Life Orb'),
        createLvl100Mon('k_arcanine', 'Arcanine', 59, ['Fire'], { hp: 384, attack: 319, defense: 259, spAtk: 299, spDef: 259, speed: 289 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
          { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Searing recoil tackle.' },
          { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Priority strike.' },
          { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electric blow.' },
          { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Punch barrage.' },
        ], 'Choice Band'),
        createLvl100Mon('k_snorlax', 'Snorlax', 143, ['Normal'], { hp: 524, attack: 319, defense: 229, spAtk: 229, spDef: 319, speed: 159 }, 'Thick Fat', 'Halves Fire and Ice damage.', [
          { id: 'body_slam', name: 'Body Slam', type: 'Normal', category: 'Physical', power: 85, accuracy: 100, pp: 15, description: 'Crushing slam with 30% paralysis.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Seismic shock.' },
          { id: 'curse', name: 'Curse', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Boosts Atk and Def, lowers Spe.' },
          { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers HP and cures status.' },
        ], 'Chesto Berry'),
        createLvl100Mon('k_ninetales', 'Ninetales', 38, ['Fire'], { hp: 350, attack: 251, defense: 249, spAtk: 261, spDef: 299, speed: 299 }, 'Drought', 'Summons radiant sunshine on entry.', [
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Sun inferno.' },
          { id: 'solar_beam', name: 'Solar Beam', type: 'Grass', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Instant solar beam.' },
          { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Inflicts burn.' },
          { id: 'nasty_plot', name: 'Nasty Plot', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk by 2 stages.' },
        ], 'Heat Rock'),
        createLvl100Mon('k_gengar', 'Gengar', 94, ['Ghost', 'Poison'], { hp: 324, attack: 229, defense: 219, spAtk: 359, spDef: 249, speed: 319 }, 'Levitate', 'Immune to ground attacks.', [
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blast.' },
          { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Poison sludge.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Fighting strike.' },
          { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Mutual KO trap.' },
        ], 'Focus Sash'),
      ],
    },
    {
      id: 'kanto_volt_turn_pivot',
      name: 'VoltTurn Offensive Pivot',
      tagline: 'High Speed Momentum Core',
      strategyTag: 'BALANCE',
      difficulty: 'Intermediate',
      description: 'Relentless momentum cycling with Raichu, Scyther, and Jolteon.',
      recommendedLead: 'Raichu',
      colorTheme: '#3b82f6',
      team: [
        createLvl100Mon('k_raichu', 'Raichu', 26, ['Electric'], { hp: 324, attack: 279, defense: 209, spAtk: 279, spDef: 259, speed: 319 }, 'Lightning Rod', 'Draws electric attacks to boost SpAtk.', [
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches.' },
          { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Water wave.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Fighting burst.' },
          { id: 'nasty_plot', name: 'Nasty Plot', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk by 2 stages.' },
        ], 'Life Orb'),
        createLvl100Mon('k_scyther', 'Scyther', 123, ['Bug', 'Flying'], { hp: 344, attack: 319, defense: 259, spAtk: 209, spDef: 259, speed: 309 }, 'Technician', 'Boosts moves with power 60 or less by 50%.', [
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches.' },
          { id: 'aerial_ace', name: 'Aerial Ace', type: 'Flying', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Technician boosted infallible strike.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
          { id: 'quick_attack', name: 'Quick Attack', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority strike.' },
        ], 'Eviolite'),
        createLvl100Mon('k_jolteon', 'Jolteon', 135, ['Electric'], { hp: 334, attack: 229, defense: 219, spAtk: 319, spDef: 289, speed: 359 }, 'Volt Absorb', 'Restores HP if struck by Electric attacks.', [
          { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt pivot.' },
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
          { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Signal beam.' },
        ], 'Choice Specs'),
        createLvl100Mon('k_starmie', 'Starmie', 121, ['Water', 'Psychic'], { hp: 324, attack: 239, defense: 269, spAtk: 299, spDef: 269, speed: 329 }, 'Natural Cure', 'Cures status conditions on switch-out.', [
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro blast.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
          { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
          { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
        ], 'Life Orb'),
        createLvl100Mon('k_nidoking', 'Nidoking', 34, ['Poison', 'Ground'], { hp: 366, attack: 303, defense: 253, spAtk: 269, spDef: 249, speed: 269 }, 'Sheer Force', 'Strengthens moves with secondary effects.', [
          { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ground eruption.' },
          { id: 'sludge_wave', name: 'Sludge Wave', type: 'Poison', category: 'Special', power: 95, accuracy: 100, pp: 10, description: 'Poison wave.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
          { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Flamethrower.' },
        ], 'Life Orb'),
        createLvl100Mon('k_snorlax_pivot', 'Snorlax', 143, ['Normal'], { hp: 524, attack: 319, defense: 229, spAtk: 229, spDef: 319, speed: 159 }, 'Immunity', 'Immune to poison.', [
          { id: 'return', name: 'Return', type: 'Normal', category: 'Physical', power: 102, accuracy: 100, pp: 20, description: 'Friendship strike.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
          { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fire punch.' },
          { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Forces opponent switch.' },
        ], 'Leftovers'),
      ],
    },
    {
      id: 'kanto_amnesia_toxic_wall',
      name: 'Amnesia & Toxic Bulwark',
      tagline: 'Impenetrable Stall & Sustain',
      strategyTag: 'STALL',
      difficulty: 'Strategic',
      description: 'Impenetrable defensive walls, Toxic stall, and Soft-Boiled sustain.',
      recommendedLead: 'Chansey',
      colorTheme: '#10b981',
      team: [
        createLvl100Mon('k_chansey', 'Chansey', 113, ['Normal'], { hp: 704, attack: 109, defense: 109, spAtk: 169, spDef: 309, speed: 199 }, 'Natural Cure', 'All status heals upon switching.', [
          { id: 'softboiled', name: 'Soft-Boiled', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'seismic_toss', name: 'Seismic Toss', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 20, description: 'Inflicts damage equal to level (100 HP).' },
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Sets stealth rocks.' },
        ], 'Eviolite'),
        createLvl100Mon('k_slowbro_wall', 'Slowbro', 80, ['Water', 'Psychic'], { hp: 394, attack: 249, defense: 319, spAtk: 299, spDef: 259, speed: 159 }, 'Regenerator', 'Restores 1/3 max HP upon switching.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
          { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes foe.' },
          { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic strike.' },
        ], 'Leftovers'),
        createLvl100Mon('k_weezing', 'Weezing', 110, ['Poison'], { hp: 334, attack: 279, defense: 339, spAtk: 269, spDef: 239, speed: 219 }, 'Levitate', 'Immune to ground attacks and spikes.', [
          { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge.' },
          { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns foe to halve physical attack.' },
          { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Equalizes HP.' },
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
        ], 'Black Sludge'),
        createLvl100Mon('k_tentacruel', 'Tentacruel', 73, ['Water', 'Poison'], { hp: 364, attack: 239, defense: 229, spAtk: 259, spDef: 339, speed: 299 }, 'Liquid Ooze', 'Damages foes that try to leech HP.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Hot water.' },
          { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
          { id: 'toxic_spikes', name: 'Toxic Spikes', type: 'Poison', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays poison spikes.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks all damage.' },
        ], 'Black Sludge'),
        createLvl100Mon('k_cloyster_wall', 'Cloyster', 91, ['Water', 'Ice'], { hp: 304, attack: 289, defense: 459, spAtk: 269, spDef: 189, speed: 239 }, 'Skill Link', 'Max hits on multi-strike.', [
          { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays spikes.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'icicle_spear', name: 'Icicle Spear', type: 'Ice', category: 'Physical', power: 25, accuracy: 100, pp: 30, description: '5 icicle spears.' },
          { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
        ], 'Leftovers'),
        createLvl100Mon('k_dragonite_sub', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 367, defense: 289, spAtk: 299, spDef: 299, speed: 259 }, 'Multiscale', 'Halves incoming damage at full HP.', [
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
          { id: 'substitute', name: 'Substitute', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Creates substitute doll.' },
          { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon claw.' },
          { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes foe.' },
        ], 'Leftovers'),
      ],
    },
  ],
};
