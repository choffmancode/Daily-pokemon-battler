/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Unova Regional League (Pokémon League Gen 5)
 * Champion: Iris
 * Elite Four: Shauntal, Grimsley, Caitlin, Marshal
 * Daily Player Squads: 3 Archetypes with Held Items
 */

import { Pokemon, EliteFourMember, RegionalLeagueConfig, createLvl100Mon } from './types';

export const UNOVA_ELITE_FOUR: EliteFourMember[] = [
  {
    id: 'unova_shauntal',
    name: 'Shauntal',
    title: 'Elite Four Shauntal',
    specialty: 'Ghost Specialist',
    roster: [
      createLvl100Mon('shauntal_cofagrigus', 'Cofagrigus', 563, ['Ghost'], { hp: 320, attack: 219, defense: 389, spAtk: 289, spDef: 309, speed: 159 }, 'Mummy', 'Contact changes attacker ability to Mummy.', [
        { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns foe to halve physical attack.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers SpDef.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic psychic assault.' },
        { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Shares HP equally with target.' },
      ], 'Leftovers'),
      createLvl100Mon('shauntal_drifblim', 'Drifblim', 426, ['Ghost', 'Flying'], { hp: 504, attack: 259, defense: 207, spAtk: 279, spDef: 207, speed: 259 }, 'Unburden', 'Doubles Speed when held item is consumed.', [
        { id: 'acrobatics', name: 'Acrobatics', type: 'Flying', category: 'Physical', power: 55, accuracy: 100, pp: 15, description: 'Doubles to 110 power after berry is eaten.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Takes the foe down with it.' },
      ], 'Sitrus Berry'),
      createLvl100Mon('shauntal_golurk', 'Golurk', 623, ['Ground', 'Ghost'], { hp: 382, attack: 347, defense: 259, spAtk: 209, spDef: 259, speed: 209 }, 'Iron Fist', 'Boosts punching moves by 20%.', [
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'shadow_punch', name: 'Shadow Punch', type: 'Ghost', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'Iron Fist boosted infallible punch.' },
        { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
      ], 'Expert Belt'),
      createLvl100Mon('shauntal_jellicent', 'Jellicent', 593, ['Water', 'Ghost'], { hp: 404, attack: 219, defense: 239, spAtk: 269, spDef: 309, speed: 219 }, 'Water Absorb', 'Heals HP when struck by Water attacks.', [
        { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding water with burn chance.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
      ], 'Leftovers'),
      createLvl100Mon('shauntal_chandelure_ace', 'Chandelure', 609, ['Ghost', 'Fire'], { hp: 324, attack: 209, defense: 279, spAtk: 389, spDef: 279, speed: 259 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers SpDef.' },
        { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
        { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Nature energy sphere.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
      ], 'Choice Scarf'),
    ],
  },
  {
    id: 'unova_grimsley',
    name: 'Grimsley',
    title: 'Elite Four Grimsley',
    specialty: 'Dark Specialist',
    roster: [
      createLvl100Mon('grimsley_liepard_lead', 'Liepard', 510, ['Dark'], { hp: 332, attack: 275, defense: 199, spAtk: 275, spDef: 199, speed: 311 }, 'Prankster', 'Gives priority to all status moves.', [
        { id: 'fake_out', name: 'Fake Out', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 10, priority: 3, description: 'Priority flinch strike on first turn.' },
        { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Priority paralysis.' },
        { id: 'encore', name: 'Encore', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Priority encore locks foe into move.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
      ], 'Focus Sash'),
      createLvl100Mon('grimsley_scrafty', 'Scrafty', 560, ['Dark', 'Fighting'], { hp: 334, attack: 279, defense: 329, spAtk: 189, spDef: 329, speed: 215 }, 'Moxie', 'Boosts Attack by 1 stage upon knocking out a foe.', [
        { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
        { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
        { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunch bite.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
      ], 'Lum Berry'),
      createLvl100Mon('grimsley_krookodile', 'Krookodile', 553, ['Ground', 'Dark'], { hp: 394, attack: 333, defense: 239, spAtk: 229, spDef: 239, speed: 283 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off enemy item.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
        { id: 'pursuit', name: 'Pursuit', type: 'Dark', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'Traps switching foes.' },
      ], 'Choice Scarf'),
      createLvl100Mon('grimsley_drapion', 'Drapion', 452, ['Poison', 'Dark'], { hp: 344, attack: 279, defense: 319, spAtk: 219, spDef: 249, speed: 289 }, 'Sniper', 'Powers up critical hits to 2.25x damage.', [
        { id: 'cross_poison', name: 'Cross Poison', type: 'Poison', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Poison slash with high critical.' },
        { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunch bite.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
      ], 'Scope Lens'),
      createLvl100Mon('grimsley_bisharp_ace', 'Bisharp', 625, ['Dark', 'Steel'], { hp: 334, attack: 349, defense: 299, spAtk: 219, spDef: 239, speed: 239 }, 'Defiant', 'Drastically boosts Attack by +2 if stats are lowered.', [
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Strikes first if foe attacks.' },
        { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Steel headbutt with flinch chance.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off enemy item.' },
        { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
      ], 'Life Orb'),
    ],
  },
  {
    id: 'unova_caitlin',
    name: 'Caitlin',
    title: 'Elite Four Caitlin',
    specialty: 'Psychic Specialist',
    roster: [
      createLvl100Mon('caitlin_musharna_lead', 'Musharna', 518, ['Psychic'], { hp: 436, attack: 209, defense: 269, spAtk: 313, spDef: 289, speed: 157 }, 'Synchronize', 'Passes status conditions to attacker.', [
        { id: 'calm_mind', name: 'Calm Mind', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk and SpDef.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'moonlight', name: 'Moonlight', type: 'Fairy', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP using lunar light.' },
        { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Sinister light beam.' },
      ], 'Leftovers'),
      createLvl100Mon('caitlin_sigilyph', 'Sigilyph', 561, ['Psychic', 'Flying'], { hp: 348, attack: 215, defense: 259, spAtk: 305, spDef: 259, speed: 293 }, 'Magic Guard', 'Only takes damage from direct attacks, negating Life Orb recoil.', [
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Air blade with flinch.' },
        { id: 'heat_wave', name: 'Heat Wave', type: 'Fire', category: 'Special', power: 95, accuracy: 90, pp: 10, description: 'Fiery breath that may burn.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Life Orb'),
      createLvl100Mon('caitlin_gothitelle', 'Gothitelle', 576, ['Psychic'], { hp: 344, attack: 209, defense: 289, spAtk: 289, spDef: 319, speed: 229 }, 'Shadow Tag', 'Prevents opposing Pokemon from escaping or switching.', [
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        { id: 'trick', name: 'Trick', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Locks foe into move by swapping Choice Specs.' },
      ], 'Choice Specs'),
      createLvl100Mon('caitlin_metagross', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 369, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents stat reductions.', [
        { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor punch that may raise Attack.' },
        { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Psychic headbutt.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
      ], 'Assault Vest'),
      createLvl100Mon('caitlin_reuniclus_ace', 'Reuniclus', 579, ['Psychic'], { hp: 424, attack: 229, defense: 249, spAtk: 349, spDef: 269, speed: 159 }, 'Magic Guard', 'Immune to passive damage and recoil.', [
        { id: 'trick_room', name: 'Trick Room', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 5, priority: -7, description: 'Reverses speed brackets for 5 turns.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic blast.' },
        { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
        { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Life Orb'),
    ],
  },
  {
    id: 'unova_marshal',
    name: 'Marshal',
    title: 'Elite Four Marshal',
    specialty: 'Fighting Specialist',
    roster: [
      createLvl100Mon('marshal_throh', 'Throh', 538, ['Fighting'], { hp: 444, attack: 299, defense: 269, spAtk: 159, spDef: 269, speed: 189 }, 'Guts', 'Boosts Attack by 50% when burned.', [
        { id: 'storm_throw', name: 'Storm Throw', type: 'Fighting', category: 'Physical', power: 60, accuracy: 100, pp: 10, description: 'Guaranteed 100% critical hit.' },
        { id: 'facade', name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Doubles to 140 power with burn.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
      ], 'Flame Orb'),
      createLvl100Mon('marshal_sawk', 'Sawk', 539, ['Fighting'], { hp: 354, attack: 349, defense: 249, spAtk: 159, spDef: 249, speed: 269 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating punch barrage.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off enemy item.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
      ], 'Choice Band'),
      createLvl100Mon('marshal_mienshao', 'Mienshao', 620, ['Fighting'], { hp: 334, attack: 349, defense: 219, spAtk: 289, spDef: 219, speed: 309 }, 'Regenerator', 'Restores 1/3 max HP on switch-out.', [
        { id: 'high_jump_kick', name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 130, accuracy: 90, pp: 10, description: 'Devastating high jump kick.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
        { id: 'fake_out', name: 'Fake Out', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 10, priority: 3, description: 'Priority flinch strike on first turn.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
      ], 'Life Orb'),
      createLvl100Mon('marshal_lucario', 'Lucario', 448, ['Fighting', 'Steel'], { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 }, 'Inner Focus', 'Prevents flinching.', [
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Close combat.' },
        { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor punch that raises Attack.' },
        { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Blinding priority strike.' },
        { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
      ], 'Focus Sash'),
      createLvl100Mon('marshal_conkeldurr_ace', 'Conkeldurr', 534, ['Fighting'], { hp: 414, attack: 379, defense: 289, spAtk: 209, spDef: 229, speed: 189 }, 'Guts', 'Boosts Attack by 50% when burned.', [
        { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Guts-boosted healing punch.' },
        { id: 'mach_punch', name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Guts-boosted priority fist.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off enemy item.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
      ], 'Flame Orb'),
    ],
  },
];

export const UNOVA_CHAMPION_IRIS: Pokemon[] = [
  createLvl100Mon('iris_hydreigon_lead', 'Hydreigon', 635, ['Dark', 'Dragon'], { hp: 388, attack: 289, defense: 279, spAtk: 349, spDef: 279, speed: 295 }, 'Levitate', 'Immune to Ground attacks and hazards.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Summons comets from the sky.' },
    { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Horrible dark aura with flinch.' },
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'All-consuming inferno.' },
    { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Water wave.' },
  ], 'Choice Specs'),
  createLvl100Mon('iris_druddigon', 'Druddigon', 621, ['Dragon'], { hp: 358, attack: 339, defense: 279, spAtk: 219, spDef: 279, speed: 195 }, 'Rough Skin', 'Inflicts 1/8 max HP damage on contact.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Sharp dragon slash.' },
    { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Strikes first if foe attacks.' },
    { id: 'glare', name: 'Glare', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Paralyzes foe with intimidating stare.' },
  ], 'Rocky Helmet'),
  createLvl100Mon('iris_archeops', 'Archeops', 567, ['Rock', 'Flying'], { hp: 354, attack: 379, defense: 229, spAtk: 323, spDef: 229, speed: 319 }, 'Defeatist', 'Halves Attack and SpAtk when below half HP.', [
    { id: 'acrobatics', name: 'Acrobatics', type: 'Flying', category: 'Physical', power: 110, accuracy: 100, pp: 15, description: 'Unburdened acrobatic dive.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches.' },
  ], 'Focus Sash'),
  createLvl100Mon('iris_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 339, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Massive rock crash.' },
    { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Heavy metallic slam.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aqua_tail', name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Water tail lash.' },
  ], 'Choice Band'),
  createLvl100Mon('iris_lapras', 'Lapras', 131, ['Water', 'Ice'], { hp: 464, attack: 269, defense: 259, spAtk: 269, spDef: 289, speed: 219 }, 'Water Absorb', 'Restores HP if struck by Water-type attacks.', [
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'High-pressure water blast.' },
    { id: 'freeze_dry', name: 'Freeze-Dry', type: 'Ice', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Super-effective against Water types.' },
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
    { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice strike.' },
  ], 'Leftovers'),
  createLvl100Mon('iris_haxorus_ace', 'Haxorus', 612, ['Dragon'], { hp: 356, attack: 393, defense: 279, spAtk: 219, spDef: 239, speed: 293 }, 'Mold Breaker', 'Moves can be used regardless of defender abilities.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Frenzied dragon rampage.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Hits through Levitate via Mold Breaker.' },
    { id: 'poison_jab', name: 'Poison Jab', type: 'Poison', category: 'Physical', power: 80, accuracy: 100, pp: 20, description: 'Poison strike against Fairy types.' },
  ], 'Focus Sash'),
];

export const UNOVA_LEAGUE: RegionalLeagueConfig = {
  regionId: 'unova',
  regionName: 'Unova',
  leagueName: 'Pokémon League',
  championName: 'Iris',
  championTitle: 'Unova Champion',
  championRoster: UNOVA_CHAMPION_IRIS,
  eliteFour: UNOVA_ELITE_FOUR,
  dailyPlayerTeams: [
    {
      id: 'unova_sand_rush',
      name: 'Sand Rush Excadrill Core',
      tagline: 'Desert Vortex & Blade Rush',
      strategyTag: 'SWEEP',
      difficulty: 'Beginner Friendly',
      description: 'Sandstorm Excadrill doubles Speed with Sand Rush, backed by Quiver Dance Volcarona.',
      recommendedLead: 'Hippowdon',
      colorTheme: '#b45309',
      team: [
        createLvl100Mon('u_hippowdon', 'Hippowdon', 450, ['Ground'], { hp: 420, attack: 323, defense: 335, spAtk: 235, spDef: 243, speed: 193 }, 'Sand Stream', 'Summons sandstorm.', [
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays stealth rocks.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers HP.' },
          { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Forces foe switch.' },
        ], 'Smooth Rock'),
        createLvl100Mon('u_excadrill', 'Excadrill', 530, ['Ground', 'Steel'], { hp: 424, attack: 369, defense: 219, spAtk: 199, spDef: 229, speed: 275 }, 'Sand Rush', 'Doubles Speed during a sandstorm.', [
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating earthquake.' },
          { id: 'iron_head', name: 'Iron Head', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Iron head with flinch.' },
          { id: 'rock_slide', name: 'Rock Slide', type: 'Rock', category: 'Physical', power: 75, accuracy: 90, pp: 10, description: 'Rock slide.' },
        ], 'Life Orb'),
        createLvl100Mon('u_landorus_t', 'Landorus', 645, ['Ground', 'Flying'], { hp: 382, attack: 389, defense: 279, spAtk: 269, spDef: 259, speed: 281 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn pivot.' },
          { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Stone edge.' },
          { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
        ], 'Choice Scarf'),
        createLvl100Mon('u_volcarona', 'Volcarona', 637, ['Bug', 'Fire'], { hp: 374, attack: 219, defense: 229, spAtk: 369, spDef: 309, speed: 299 }, 'Flame Body', 'Contact has 30% chance to burn.', [
          { id: 'quiver_dance', name: 'Quiver Dance', type: 'Bug', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk, SpDef, Spe.' },
          { id: 'fiery_dance', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Inferno blast.' },
          { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Bug buzz.' },
          { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
        ], 'Life Orb'),
        createLvl100Mon('u_keldeo', 'Keldeo', 647, ['Water', 'Fighting'], { hp: 386, attack: 243, defense: 279, spAtk: 357, spDef: 279, speed: 315 }, 'Justified', 'Boosts Attack when hit by Dark attacks.', [
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro pump.' },
          { id: 'secret_sword', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Infallible aura strike.' },
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'icy_wind', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
        ], 'Choice Specs'),
        createLvl100Mon('u_ferrothorn', 'Ferrothorn', 598, ['Grass', 'Steel'], { hp: 352, attack: 287, defense: 361, spAtk: 207, spDef: 331, speed: 139 }, 'Iron Barbs', 'Inflicts 1/8 max HP to contact attackers.', [
          { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays spikes.' },
          { id: 'leech_seed', name: 'Leech Seed', type: 'Grass', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Leeches enemy HP.' },
          { id: 'power_whip', name: 'Seed Bomb', type: 'Grass', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Seed bomb.' },
          { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Heavy steel strike.' },
        ], 'Leftovers'),
      ],
    },
    {
      id: 'unova_voltturn_pivot',
      name: 'VoltTurn Regenerator',
      tagline: 'High Octane Momentum',
      strategyTag: 'BALANCE',
      difficulty: 'Intermediate',
      description: 'Mienshao and Rotom-Wash cycle momentum into Choice Specs Hydreigon and Chandelure.',
      recommendedLead: 'Mienshao',
      colorTheme: '#7e22ce',
      team: [
        createLvl100Mon('u_mienshao_lead', 'Mienshao', 620, ['Fighting'], { hp: 334, attack: 349, defense: 219, spAtk: 289, spDef: 219, speed: 309 }, 'Regenerator', 'Restores 1/3 max HP on switch-out.', [
          { id: 'fake_out', name: 'Fake Out', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 10, priority: 3, description: 'Priority flinch strike.' },
          { id: 'high_jump_kick', name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 130, accuracy: 90, pp: 10, description: 'High jump kick.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn pivot.' },
          { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off item.' },
        ], 'Life Orb'),
        createLvl100Mon('u_rotom_wash', 'Rotom-Wash', 479, ['Electric', 'Water'], { hp: 304, attack: 229, defense: 313, spAtk: 309, spDef: 313, speed: 271 }, 'Levitate', 'Immune to Ground attacks.', [
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro blast.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt pivot.' },
          { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Burns foe.' },
          { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Equalizes HP.' },
        ], 'Leftovers'),
        createLvl100Mon('u_scizor', 'Scizor', 212, ['Bug', 'Steel'], { hp: 344, attack: 359, defense: 299, spAtk: 209, spDef: 259, speed: 229 }, 'Technician', 'Boosts priority moves by 50%.', [
          { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn pivot.' },
          { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
        ], 'Choice Band'),
        createLvl100Mon('u_hydreigon', 'Hydreigon', 635, ['Dark', 'Dragon'], { hp: 388, attack: 289, defense: 279, spAtk: 349, spDef: 279, speed: 295 }, 'Levitate', 'Immune to Ground attacks.', [
          { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Draco meteor.' },
          { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark pulse.' },
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn.' },
        ], 'Choice Specs'),
        createLvl100Mon('u_chandelure', 'Chandelure', 609, ['Ghost', 'Fire'], { hp: 324, attack: 209, defense: 279, spAtk: 389, spDef: 279, speed: 259 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
          { id: 'energy_ball', name: 'Energy Ball', type: 'Grass', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Energy ball.' },
          { id: 'trick', name: 'Trick', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Swaps Choice Scarf.' },
        ], 'Choice Scarf'),
        createLvl100Mon('u_jellicent', 'Jellicent', 593, ['Water', 'Ghost'], { hp: 404, attack: 219, defense: 239, spAtk: 269, spDef: 309, speed: 219 }, 'Water Absorb', 'Heals HP when hit by Water.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
          { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        ], 'Leftovers'),
      ],
    },
    {
      id: 'unova_iron_defense_stall',
      name: 'Iron Defense & Toxic Stall',
      tagline: 'Impenetrable Bastion & Leech Attrition',
      strategyTag: 'STALL',
      difficulty: 'Strategic',
      description: 'Leech Seed Ferrothorn, Poison Heal Gliscor, and Flash Fire Heatran wall all incoming damage.',
      recommendedLead: 'Ferrothorn',
      colorTheme: '#15803d',
      team: [
        createLvl100Mon('u_ferrothorn_stall', 'Ferrothorn', 598, ['Grass', 'Steel'], { hp: 352, attack: 287, defense: 361, spAtk: 207, spDef: 331, speed: 139 }, 'Iron Barbs', 'Inflicts 1/8 damage to contact attackers.', [
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays stealth rocks.' },
          { id: 'leech_seed', name: 'Leech Seed', type: 'Grass', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Leeches enemy HP.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks all damage.' },
          { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Heavy steel strike.' },
        ], 'Leftovers'),
        createLvl100Mon('u_jellicent_stall', 'Jellicent', 593, ['Water', 'Ghost'], { hp: 404, attack: 219, defense: 239, spAtk: 269, spDef: 309, speed: 219 }, 'Water Absorb', 'Absorbs water moves.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents status moves.' },
        ], 'Leftovers'),
        createLvl100Mon('u_gliscor', 'Gliscor', 472, ['Ground', 'Flying'], { hp: 354, attack: 289, defense: 349, spAtk: 189, spDef: 249, speed: 289 }, 'Poison Heal', 'Heals 1/8 max HP every turn when poisoned.', [
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks all damage.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
        ], 'Toxic Orb'),
        createLvl100Mon('u_conkeldurr', 'Conkeldurr', 534, ['Fighting'], { hp: 414, attack: 379, defense: 289, spAtk: 209, spDef: 229, speed: 189 }, 'Guts', 'Boosts Attack by 50% when burned.', [
          { id: 'drain_punch', name: 'Drain Punch', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
          { id: 'mach_punch', name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist.' },
          { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off item.' },
          { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
        ], 'Flame Orb'),
        createLvl100Mon('u_reuniclus', 'Reuniclus', 579, ['Psychic'], { hp: 424, attack: 229, defense: 249, spAtk: 349, spDef: 269, speed: 159 }, 'Magic Guard', 'Immune to passive damage.', [
          { id: 'calm_mind', name: 'Calm Mind', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk and SpDef.' },
          { id: 'psyshock', name: 'Psyshock', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Hits physical defense.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
          { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
        ], 'Leftovers'),
        createLvl100Mon('u_heatran', 'Heatran', 485, ['Fire', 'Steel'], { hp: 386, attack: 279, defense: 311, spAtk: 359, spDef: 311, speed: 253 }, 'Flash Fire', 'Immune to Fire, powers up Fire moves.', [
          { id: 'magma_storm', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Inferno blast.' },
          { id: 'earth_power', name: 'Earth Power', type: 'Ground', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Earth power.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks attacks.' },
        ], 'Leftovers'),
      ],
    },
  ],
};
