/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Sinnoh Regional League (Pokémon League)
 * Champion: Cynthia
 * Elite Four: Aaron, Bertha, Flint, Lucian
 * Daily Player Squads: 3 Archetypes with Held Items
 */

import { Pokemon, EliteFourMember, RegionalLeagueConfig, createLvl100Mon } from './types';

export const SINNOH_ELITE_FOUR: EliteFourMember[] = [
  {
    id: 'sinnoh_aaron',
    name: 'Aaron',
    title: 'Elite Four Aaron',
    specialty: 'Bug Specialist',
    roster: [
      createLvl100Mon('aaron_yanmega_lead', 'Yanmega', 469, ['Bug', 'Flying'], { hp: 376, attack: 251, defense: 271, spAtk: 331, spDef: 211, speed: 289 }, 'Speed Boost', 'Boosts Speed by 1 stage at the end of each turn.', [
        { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Vibrating sound wave.' },
        { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Wind blades with flinch.' },
        { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Guarantees free Speed Boost.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers SpDef.' },
      ], 'Life Orb'),
      createLvl100Mon('aaron_scizor', 'Scizor', 212, ['Bug', 'Steel'], { hp: 344, attack: 359, defense: 299, spAtk: 209, spDef: 259, speed: 229 }, 'Technician', 'Boosts priority moves by 50%.', [
        { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority metallic punch.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
        { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'High power fighting strike.' },
        { id: 'bug_bite', name: 'Bug Bite', type: 'Bug', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Technician boosted Bug Bite.' },
      ], 'Choice Band'),
      createLvl100Mon('aaron_vespiquen', 'Vespiquen', 416, ['Bug', 'Flying'], { hp: 344, attack: 259, defense: 303, spAtk: 259, spDef: 303, speed: 179 }, 'Pressure', 'Forces foe to expend double PP.', [
        { id: 'attack_order', name: 'Attack Order', type: 'Bug', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'High critical strike call.' },
        { id: 'defend_order', name: 'Defend Order', type: 'Bug', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Boosts Defense and SpDef by 1 stage.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
      ], 'Sitrus Berry'),
      createLvl100Mon('aaron_heracross', 'Heracross', 214, ['Bug', 'Fighting'], { hp: 364, attack: 379, defense: 249, spAtk: 179, spDef: 289, speed: 269 }, 'Guts', 'Boosts Attack by 50% when burned.', [
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating punch barrage.' },
        { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Huge horn ramming charge.' },
        { id: 'facade', name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Doubles to 140 power with Guts burn.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
      ], 'Flame Orb'),
      createLvl100Mon('aaron_drapion_ace', 'Drapion', 452, ['Poison', 'Dark'], { hp: 344, attack: 279, defense: 319, spAtk: 219, spDef: 249, speed: 289 }, 'Sniper', 'Powers up critical hits to 2.25x damage.', [
        { id: 'cross_poison', name: 'Cross Poison', type: 'Poison', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Poison slash with high critical.' },
        { id: 'night_slash', name: 'Night Slash', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'Dark slash with high critical.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'ice_fang', name: 'Ice Fang', type: 'Ice', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Freezing bite.' },
      ], 'Scope Lens'),
    ],
  },
  {
    id: 'sinnoh_bertha',
    name: 'Bertha',
    title: 'Elite Four Bertha',
    specialty: 'Ground Specialist',
    roster: [
      createLvl100Mon('bertha_whiscash', 'Whiscash', 340, ['Water', 'Ground'], { hp: 424, attack: 255, defense: 245, spAtk: 249, spDef: 241, speed: 219 }, 'Oblivious', 'Immune to infatuation and taunt.', [
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading water rush.' },
        { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Psychic headbutt.' },
        { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
      ], 'Rindo Berry'),
      createLvl100Mon('bertha_gliscor', 'Gliscor', 472, ['Ground', 'Flying'], { hp: 354, attack: 289, defense: 349, spAtk: 189, spDef: 249, speed: 289 }, 'Poison Heal', 'Restores 1/8 max HP every turn when poisoned.', [
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
        { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks all damage.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Toxic Orb'),
      createLvl100Mon('bertha_hippowdon', 'Hippowdon', 450, ['Ground'], { hp: 420, attack: 323, defense: 335, spAtk: 235, spDef: 243, speed: 193 }, 'Sand Stream', 'Summons lasting sandstorm on entry.', [
        { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers 50% HP.' },
        { id: 'ice_fang', name: 'Ice Fang', type: 'Ice', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Frigid bite.' },
      ], 'Smooth Rock'),
      createLvl100Mon('bertha_golem', 'Golem', 76, ['Rock', 'Ground'], { hp: 364, attack: 339, defense: 359, spAtk: 209, spDef: 229, speed: 189 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
        { id: 'explosion', name: 'Explosion', type: 'Normal', category: 'Physical', power: 250, accuracy: 100, pp: 5, description: 'Massive blast that faints user.' },
      ], 'Custap Berry'),
      createLvl100Mon('bertha_rhyperior_ace', 'Rhyperior', 464, ['Ground', 'Rock'], { hp: 434, attack: 379, defense: 359, spAtk: 209, spDef: 209, speed: 179 }, 'Solid Rock', 'Reduces super-effective damage taken by 25%.', [
        { id: 'rock_wrecker', name: 'Rock Wrecker', type: 'Rock', category: 'Physical', power: 150, accuracy: 90, pp: 5, description: 'Tremendous rock boulder.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating seismic tremor.' },
        { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Horn ramming charge.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
      ], 'Weakness Policy'),
    ],
  },
  {
    id: 'sinnoh_flint',
    name: 'Flint',
    title: 'Elite Four Flint',
    specialty: 'Fire Specialist',
    roster: [
      createLvl100Mon('flint_houndoom', 'Houndoom', 229, ['Dark', 'Fire'], { hp: 354, attack: 279, defense: 200, spAtk: 319, spDef: 259, speed: 289 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
        { id: 'nasty_plot', name: 'Nasty Plot', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk by 2 stages.' },
        { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
        { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast.' },
        { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge.' },
      ], 'Focus Sash'),
      createLvl100Mon('flint_flareon', 'Flareon', 136, ['Fire'], { hp: 334, attack: 359, defense: 219, spAtk: 289, spDef: 319, speed: 229 }, 'Guts', 'Boosts Attack by 50% when poisoned.', [
        { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Recoil flame strike.' },
        { id: 'facade', name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Doubles power to 140 when afflicted by status.' },
        { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'High power fighting strike.' },
        { id: 'quick_attack', name: 'Quick Attack', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority strike.' },
      ], 'Toxic Orb'),
      createLvl100Mon('flint_rapidash', 'Rapidash', 78, ['Fire'], { hp: 334, attack: 299, defense: 239, spAtk: 259, spDef: 259, speed: 309 }, 'Flash Fire', 'Immune to Fire, boosts Fire attacks.', [
        { id: 'sunny_day', name: 'Sunny Day', type: 'Fire', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Summons blazing sunshine.' },
        { id: 'solar_beam', name: 'Solar Beam', type: 'Grass', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Instant solar beam in sun.' },
        { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Blazing charge with recoil.' },
        { id: 'wild_charge', name: 'Wild Charge', type: 'Electric', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Electrified tackle.' },
      ], 'Life Orb'),
      createLvl100Mon('flint_magmortar', 'Magmortar', 467, ['Fire'], { hp: 354, attack: 289, defense: 233, spAtk: 349, spDef: 289, speed: 265 }, 'Flame Body', 'Contact has 30% chance to burn attacker.', [
        { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Inferno blast.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
        { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic assault.' },
      ], 'Expert Belt'),
      createLvl100Mon('flint_infernape_ace', 'Infernape', 392, ['Fire', 'Fighting'], { hp: 356, attack: 307, defense: 241, spAtk: 307, spDef: 241, speed: 315 }, 'Iron Fist', 'Boosts punching moves by 20%.', [
        { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Searing recoil tackle.' },
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Punch barrage.' },
        { id: 'thunder_punch', name: 'Thunder Punch', type: 'Electric', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Electrified punch.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
      ], 'Choice Scarf'),
    ],
  },
  {
    id: 'sinnoh_lucian',
    name: 'Lucian',
    title: 'Elite Four Lucian',
    specialty: 'Psychic Specialist',
    roster: [
      createLvl100Mon('lucian_mr_mime', 'Mr. Mime', 122, ['Psychic', 'Fairy'], { hp: 284, attack: 189, defense: 229, spAtk: 299, spDef: 339, speed: 279 }, 'Filter', 'Reduces super-effective damage by 25%.', [
        { id: 'reflect', name: 'Reflect', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Halves physical damage for 8 turns.' },
        { id: 'light_screen', name: 'Light Screen', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Halves special damage for 8 turns.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'dazzling_gleam', name: 'Dazzling Gleam', type: 'Fairy', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Fairy flash.' },
      ], 'Light Clay'),
      createLvl100Mon('lucian_espeon', 'Espeon', 196, ['Psychic'], { hp: 334, attack: 229, defense: 219, spAtk: 359, spDef: 289, speed: 319 }, 'Magic Bounce', 'Reflects non-damaging and hazard moves back at user.', [
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        { id: 'dazzling_gleam', name: 'Dazzling Gleam', type: 'Fairy', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Fairy flash.' },
        { id: 'trick', name: 'Trick', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Swaps Choice Specs onto foe.' },
      ], 'Choice Specs'),
      createLvl100Mon('lucian_bronzong', 'Bronzong', 437, ['Steel', 'Psychic'], { hp: 338, attack: 277, defense: 331, spAtk: 257, spDef: 331, speed: 165 }, 'Levitate', 'Immune to Ground attacks and hazards.', [
        { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Heavy steel strike.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays stealth rocks.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
      ], 'Leftovers'),
      createLvl100Mon('lucian_alakazam', 'Alakazam', 65, ['Psychic'], { hp: 314, attack: 199, defense: 189, spAtk: 369, spDef: 289, speed: 339 }, 'Magic Guard', 'Only takes direct attack damage.', [
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
        { id: 'counter', name: 'Counter', type: 'Fighting', category: 'Physical', power: 0, accuracy: 100, pp: 20, priority: -5, description: 'Reflects double physical damage taken.' },
      ], 'Focus Sash'),
      createLvl100Mon('lucian_gallade_ace', 'Gallade', 475, ['Psychic', 'Fighting'], { hp: 340, attack: 349, defense: 229, spAtk: 229, spDef: 329, speed: 259 }, 'Justified', 'Boosts Attack when hit by Dark attacks.', [
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Punch barrage.' },
        { id: 'psycho_cut', name: 'Psycho Cut', type: 'Psychic', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'High critical psychic slash.' },
        { id: 'leaf_blade', name: 'Leaf Blade', type: 'Grass', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'High critical leaf blade.' },
        { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
      ], 'Life Orb'),
    ],
  },
];

export const SINNOH_CHAMPION_CYNTHIA: Pokemon[] = [
  createLvl100Mon('cynthia_spiritomb', 'Spiritomb', 442, ['Ghost', 'Dark'], { hp: 304, attack: 283, defense: 315, spAtk: 283, spDef: 315, speed: 169 }, 'Pressure', 'Forces foe to expend double PP.', [
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Fires a shadowy sphere that may lower Sp. Def.' },
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Releases a horrible dark aura that may flinch.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Strong telekinetic force that can lower Sp. Def.' },
    { id: 'hypnosis', name: 'Hypnosis', type: 'Psychic', category: 'Status', power: 0, accuracy: 70, pp: 20, description: 'Emits hypnotic suggestion to induce sleep.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('cynthia_roserade', 'Roserade', 407, ['Grass', 'Poison'], { hp: 324, attack: 239, defense: 229, spAtk: 349, spDef: 309, speed: 279 }, 'Natural Cure', 'All status conditions heal upon switching out.', [
    { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Hurls unsanitary toxic sludge with 30% poison chance.' },
    { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Concentrated nature power that lowers Sp. Def.' },
    { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob dealing reliable special damage.' },
    { id: 'extrasensory', name: 'Extrasensory', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Mysterious psychic power that can cause flinching.' },
  ], 'Focus Sash'),
  createLvl100Mon('cynthia_togekiss', 'Togekiss', 468, ['Fairy', 'Flying'], { hp: 374, attack: 199, defense: 289, spAtk: 339, spDef: 329, speed: 259 }, 'Serene Grace', 'Doubles the chance of move secondary effects triggering (60% flinch Air Slash).', [
    { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Slices with sky wind that causes flinching 60% with Serene Grace.' },
    { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Fires a blast of aura power that never misses.' },
    { id: 'dazzling_gleam', name: 'Dazzling Gleam', type: 'Fairy', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Emits a powerful flash of light that damages foes.' },
    { id: 'ancient_power', name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'Attacks with prehistoric power, 20% chance to boost all stats.' },
  ], 'King\'s Rock'),
  createLvl100Mon('cynthia_lucario', 'Lucario', 448, ['Fighting', 'Steel'], { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 }, 'Inner Focus', 'Prevents flinching from opposing attacks.', [
    { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Blasts an infallible blast of internal aura power.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Strikes at blinding, supersonic speed ahead of ordinary priority.' },
    { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Gathers light energy and unleashes a metal cannon.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Generates a shock wave of draconic energy.' },
  ], 'Expert Belt'),
  createLvl100Mon('cynthia_milotic', 'Milotic', 350, ['Water'], { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 }, 'Marvel Scale', 'Boosts Defense by 50% when burned by Flame Orb.', [
    { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shoots boiling water with a 30% chance to burn.' },
    { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Frigid blast that can freeze targets solid.' },
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores up to half of max HP.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Draconic shockwave providing crucial neutral coverage.' },
  ], 'Flame Orb'),
  createLvl100Mon('cynthia_garchomp_ace', 'Garchomp', 445, ['Dragon', 'Ground'], { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 }, 'Rough Skin', 'Inflicts 1/8 damage to attackers making contact.', [
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Slashes violently with huge, sharp dragon claws.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Tremendous tremor that hits all adjacent combatants.' },
    { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Frantic battle dance that drastically boosts Attack by +2.' },
    { id: 'poison_jab', name: 'Poison Jab', type: 'Poison', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Poisonous strike targeting incoming Fairy switch-ins.' },
  ], 'Yache Berry'),
];

export const SINNOH_LEAGUE: RegionalLeagueConfig = {
  regionId: 'sinnoh',
  regionName: 'Sinnoh',
  leagueName: 'Pokémon League',
  championName: 'Cynthia',
  championTitle: 'Sinnoh Champion',
  championRoster: SINNOH_CHAMPION_CYNTHIA,
  eliteFour: SINNOH_ELITE_FOUR,
  dailyPlayerTeams: [
    {
      id: 'sinnoh_hail_sand',
      name: 'Hail Blizzard & Sand Offense',
      tagline: 'Permafrost Chill & Sand Shredder',
      strategyTag: 'SWEEP',
      difficulty: 'Beginner Friendly',
      description: 'Abomasnow Blizzard spam, Weavile Ice Shard priority, and Garchomp Swords Dance sweep.',
      recommendedLead: 'Abomasnow',
      colorTheme: '#38bdf8',
      team: [
        createLvl100Mon('s_abomasnow', 'Abomasnow', 460, ['Grass', 'Ice'], { hp: 384, attack: 283, defense: 249, spAtk: 283, spDef: 269, speed: 219 }, 'Snow Warning', 'Summons Hailstorm on entry.', [
          { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 100, pp: 5, description: '100% accurate Blizzard in hail.' },
          { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice shard.' },
        ], 'Icy Rock'),
        createLvl100Mon('s_gliscor', 'Gliscor', 472, ['Ground', 'Flying'], { hp: 354, attack: 289, defense: 349, spAtk: 189, spDef: 249, speed: 289 }, 'Poison Heal', 'Heals 1/8 max HP every turn when poisoned.', [
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks attacks.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
        ], 'Toxic Orb'),
        createLvl100Mon('s_garchomp', 'Garchomp', 445, ['Dragon', 'Ground'], { hp: 420, attack: 359, defense: 289, spAtk: 259, spDef: 269, speed: 303 }, 'Rough Skin', 'Damages contact attackers.', [
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
          { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Dragon outrage.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
        ], 'Yache Berry'),
        createLvl100Mon('s_weavile', 'Weavile', 461, ['Dark', 'Ice'], { hp: 344, attack: 339, defense: 229, spAtk: 189, spDef: 249, speed: 349 }, 'Pressure', 'Forces foe to expend double PP.', [
          { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice strike.' },
          { id: 'night_slash', name: 'Night Slash', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'High critical dark slash.' },
          { id: 'low_kick', name: 'Low Kick', type: 'Fighting', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Damages heavier foes.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
        ], 'Life Orb'),
        createLvl100Mon('s_magnezone', 'Magnezone', 462, ['Electric', 'Steel'], { hp: 344, attack: 239, defense: 329, spAtk: 359, spDef: 279, speed: 219 }, 'Magnet Pull', 'Traps opposing Steel types.', [
          { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
          { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Flash cannon.' },
          { id: 'hidden_power_fire', name: 'Hidden Power Fire', type: 'Fire', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'Hidden Power Fire.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt switch.' },
        ], 'Choice Specs'),
        createLvl100Mon('s_empoleon', 'Empoleon', 395, ['Water', 'Steel'], { hp: 372, attack: 269, defense: 275, spAtk: 321, spDef: 301, speed: 219 }, 'Torrent', 'Stealth rock setter with steel resistance.', [
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays stealth rocks.' },
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro pump.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
          { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Flash cannon.' },
        ], 'Leftovers'),
      ],
    },
    {
      id: 'sinnoh_regenerator_pivot',
      name: 'Regenerator Pivot & VoltTurn',
      tagline: 'Momentum Mastery & Unbreakable Cores',
      strategyTag: 'BALANCE',
      difficulty: 'Intermediate',
      description: 'Rotom-Wash and Scizor VoltTurn cycle into Intimidate Staraptor and Tangrowth.',
      recommendedLead: 'Rotom-Wash',
      colorTheme: '#4f46e5',
      team: [
        createLvl100Mon('s_rotom_wash', 'Rotom-Wash', 479, ['Electric', 'Water'], { hp: 304, attack: 229, defense: 313, spAtk: 309, spDef: 313, speed: 271 }, 'Levitate', 'Immune to Ground-type attacks and hazards.', [
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro blast.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt pivot.' },
          { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns foe.' },
          { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Equalizes HP.' },
        ], 'Leftovers'),
        createLvl100Mon('s_scizor_pivot', 'Scizor', 212, ['Bug', 'Steel'], { hp: 344, attack: 359, defense: 299, spAtk: 209, spDef: 259, speed: 229 }, 'Technician', 'Boosts priority moves by 50%.', [
          { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn pivot.' },
          { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
        ], 'Choice Band'),
        createLvl100Mon('s_infernape', 'Infernape', 392, ['Fire', 'Fighting'], { hp: 356, attack: 307, defense: 241, spAtk: 307, spDef: 241, speed: 315 }, 'Blaze', 'Powers up Fire moves in a pinch.', [
          { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Close combat.' },
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
          { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
        ], 'Life Orb'),
        createLvl100Mon('s_staraptor', 'Staraptor', 398, ['Normal', 'Flying'], { hp: 374, attack: 339, defense: 239, spAtk: 209, spDef: 219, speed: 299 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
          { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Brave bird.' },
          { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Close combat.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
          { id: 'double_edge', name: 'Return', type: 'Normal', category: 'Physical', power: 102, accuracy: 100, pp: 20, description: 'Return.' },
        ], 'Choice Scarf'),
        createLvl100Mon('s_tangrowth', 'Tangrowth', 465, ['Grass'], { hp: 404, attack: 299, defense: 349, spAtk: 319, spDef: 219, speed: 199 }, 'Regenerator', 'Restores 1/3 max HP on switch-out.', [
          { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
          { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off item.' },
          { id: 'sleep_powder', name: 'Sleep Powder', type: 'Grass', category: 'Status', power: 0, accuracy: 75, pp: 15, description: 'Sleep powder.' },
        ], 'Assault Vest'),
        createLvl100Mon('s_lucario', 'Lucario', 448, ['Fighting', 'Steel'], { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 }, 'Inner Focus', 'Prevents flinching.', [
          { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Close combat.' },
          { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Extreme speed.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
          { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
        ], 'Life Orb'),
      ],
    },
    {
      id: 'sinnoh_hazard_stall',
      name: 'Hazard Stack & Toxic Stall',
      tagline: 'Fortified Bulwark & Gradual Ruin',
      strategyTag: 'STALL',
      difficulty: 'Strategic',
      description: 'Stealth Rock Bronzong, Slack Off Hippowdon, and Storm Drain Gastrodon.',
      recommendedLead: 'Bronzong',
      colorTheme: '#166534',
      team: [
        createLvl100Mon('s_bronzong_stall', 'Bronzong', 437, ['Steel', 'Psychic'], { hp: 338, attack: 277, defense: 331, spAtk: 257, spDef: 331, speed: 165 }, 'Levitate', 'Immune to Ground attacks.', [
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays stealth rocks.' },
          { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Heavy steel strike.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        ], 'Leftovers'),
        createLvl100Mon('s_hippowdon_stall', 'Hippowdon', 450, ['Ground'], { hp: 420, attack: 323, defense: 335, spAtk: 235, spDef: 243, speed: 193 }, 'Sand Stream', 'Summons sandstorm.', [
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
          { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers 50% HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Blows away foe.' },
        ], 'Leftovers'),
        createLvl100Mon('s_toxicroak', 'Toxicroak', 454, ['Poison', 'Fighting'], { hp: 370, attack: 311, defense: 229, spAtk: 251, spDef: 229, speed: 269 }, 'Dry Skin', 'Heals in rain and absorbs water moves.', [
          { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
          { id: 'gunk_shot', name: 'Gunk Shot', type: 'Poison', category: 'Physical', power: 120, accuracy: 80, pp: 5, description: 'Gunk shot.' },
          { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
        ], 'Black Sludge'),
        createLvl100Mon('s_togekiss_stall', 'Togekiss', 468, ['Fairy', 'Flying'], { hp: 374, attack: 199, defense: 289, spAtk: 339, spDef: 329, speed: 259 }, 'Serene Grace', 'Doubles secondary effect chances.', [
          { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: '60% flinch rate.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
          { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes foe.' },
          { id: 'dazzling_gleam', name: 'Dazzling Gleam', type: 'Fairy', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Fairy flash.' },
        ], 'Leftovers'),
        createLvl100Mon('s_spiritomb_stall', 'Spiritomb', 442, ['Ghost', 'Dark'], { hp: 304, attack: 283, defense: 315, spAtk: 283, spDef: 315, speed: 169 }, 'Pressure', 'Forces double PP expenditure.', [
          { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns foe.' },
          { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Shares HP.' },
          { id: 'shadow_sneak', name: 'Shadow Sneak', type: 'Ghost', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority shadow strike.' },
          { id: 'foul_play', name: 'Foul Play', type: 'Dark', category: 'Physical', power: 95, accuracy: 100, pp: 15, description: 'Punishes attack.' },
        ], 'Leftovers'),
        createLvl100Mon('s_gastrodon', 'Gastrodon', 423, ['Water', 'Ground'], { hp: 426, attack: 245, defense: 235, spAtk: 283, spDef: 263, speed: 177 }, 'Storm Drain', 'Draws Water moves and grants immunity.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Earth power.' },
          { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        ], 'Leftovers'),
      ],
    },
  ],
};
