/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Johto Regional League (Silver Conference / Indigo Plateau Gen 2)
 * Champion: Lance
 * Elite Four: Will, Koga, Bruno (Rematch), Karen
 * Daily Player Squads: 3 Archetypes with Held Items
 */

import { Pokemon, EliteFourMember, RegionalLeagueConfig, createLvl100Mon } from './types';

export const JOHTO_ELITE_FOUR: EliteFourMember[] = [
  {
    id: 'johto_will',
    name: 'Will',
    title: 'Elite Four Will',
    specialty: 'Psychic Specialist',
    roster: [
      createLvl100Mon('will_xatu_lead', 'Xatu', 178, ['Psychic', 'Flying'], { hp: 334, attack: 249, defense: 239, spAtk: 289, spDef: 239, speed: 289 }, 'Magic Bounce', 'Reflects non-damaging and hazard moves back at the user.', [
        { id: 'reflect', name: 'Reflect', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Halves incoming physical damage for 5-8 turns.' },
        { id: 'light_screen', name: 'Light Screen', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Halves incoming special damage for 5-8 turns.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'High-power psychic blast.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
      ], 'Light Clay'),
      createLvl100Mon('will_jynx', 'Jynx', 124, ['Ice', 'Psychic'], { hp: 334, attack: 199, defense: 169, spAtk: 329, spDef: 289, speed: 289 }, 'Dry Skin', 'Immune to Water attacks, recovers HP in Rain.', [
        { id: 'lovely_kiss', name: 'Lovely Kiss', type: 'Normal', category: 'Status', power: 0, accuracy: 75, pp: 10, description: 'Induces soothing sleep.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Frigid beam with freeze chance.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic psychic assault.' },
        { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'High power fighting blast.' },
      ], 'Focus Sash'),
      createLvl100Mon('will_slowbro', 'Slowbro', 80, ['Water', 'Psychic'], { hp: 394, attack: 249, defense: 319, spAtk: 299, spDef: 259, speed: 159 }, 'Regenerator', 'Restores 1/3 max HP upon switching out.', [
        { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Boiling water with 30% burn rate.' },
        { id: 'psyshock', name: 'Psyshock', type: 'Psychic', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Targets physical Defense instead of SpDef.' },
        { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes foe.' },
        { id: 'slack_off', name: 'Slack Off', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers 50% HP.' },
      ], 'Leftovers'),
      createLvl100Mon('will_exeggutor', 'Exeggutor', 103, ['Grass', 'Psychic'], { hp: 394, attack: 289, defense: 269, spAtk: 349, spDef: 249, speed: 209 }, 'Harvest', 'Can restore consumed berries each turn.', [
        { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic psychic assault.' },
        { id: 'leech_seed', name: 'Leech Seed', type: 'Grass', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Steals HP from foe every turn.' },
        { id: 'substitute', name: 'Substitute', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Creates decoy doll using 25% HP.' },
      ], 'Sitrus Berry'),
      createLvl100Mon('will_xatu_ace', 'Xatu', 178, ['Psychic', 'Flying'], { hp: 334, attack: 249, defense: 239, spAtk: 319, spDef: 239, speed: 309 }, 'Magic Bounce', 'Reflects hazard and status moves.', [
        { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Air blade with 30% flinch rate.' },
        { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic assault.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob that lowers SpDef.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Life Orb'),
    ],
  },
  {
    id: 'johto_koga',
    name: 'Koga',
    title: 'Elite Four Koga',
    specialty: 'Poison & Ninja Specialist',
    roster: [
      createLvl100Mon('koga_ariados', 'Ariados', 168, ['Bug', 'Poison'], { hp: 344, attack: 299, defense: 239, spAtk: 219, spDef: 239, speed: 179 }, 'Swarm', 'Boosts Bug moves in a pinch.', [
        { id: 'sticky_web', name: 'Sticky Web', type: 'Bug', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lowers speed of incoming grounded foes by 1 stage.' },
        { id: 'toxic_spikes', name: 'Toxic Spikes', type: 'Poison', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Poisons incoming opposing Pokemon.' },
        { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Huge horn ramming charge.' },
        { id: 'shadow_sneak', name: 'Shadow Sneak', type: 'Ghost', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority shadow strike.' },
      ], 'Focus Sash'),
      createLvl100Mon('koga_forretress', 'Forretress', 205, ['Bug', 'Steel'], { hp: 354, attack: 279, defense: 419, spAtk: 219, spDef: 219, speed: 179 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
        { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays damaging floor spikes.' },
        { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
        { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'High metallic damage against fast foes.' },
        { id: 'explosion', name: 'Explosion', type: 'Normal', category: 'Physical', power: 250, accuracy: 100, pp: 5, description: 'Massive blast that faints user.' },
      ], 'Custap Berry'),
      createLvl100Mon('koga_muk', 'Muk', 89, ['Poison'], { hp: 414, attack: 319, defense: 249, spAtk: 229, spDef: 319, speed: 199 }, 'Poison Touch', 'Contact moves have 30% chance to poison.', [
        { id: 'gunk_shot', name: 'Gunk Shot', type: 'Poison', category: 'Physical', power: 120, accuracy: 80, pp: 5, description: 'Filthy toxic debris strike.' },
        { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fiery punch with burn chance.' },
        { id: 'shadow_sneak', name: 'Shadow Sneak', type: 'Ghost', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority shadow strike.' },
        { id: 'curse', name: 'Curse', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Boosts Atk and Def, lowers Spe.' },
      ], 'Black Sludge'),
      createLvl100Mon('koga_venomoth', 'Venomoth', 49, ['Bug', 'Poison'], { hp: 344, attack: 229, defense: 219, spAtk: 279, spDef: 249, speed: 279 }, 'Tinted Lens', 'Powers up "not very effective" moves.', [
        { id: 'quiver_dance', name: 'Quiver Dance', type: 'Bug', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk, SpDef, and Speed.' },
        { id: 'bug_buzz', name: 'Bug Buzz', type: 'Bug', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Vibrating sound wave.' },
        { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge blast.' },
        { id: 'baton_pass', name: 'Baton Pass', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, description: 'Passes stat boosts to teammate.' },
      ], 'Life Orb'),
      createLvl100Mon('koga_crobat_ace', 'Crobat', 169, ['Poison', 'Flying'], { hp: 374, attack: 309, defense: 259, spAtk: 239, spDef: 259, speed: 379 }, 'Infiltrator', 'Bypasses screens and Substitute.', [
        { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Full-power diving dive with recoil.' },
        { id: 'cross_poison', name: 'Cross Poison', type: 'Poison', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Poison blade with high critical.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches back to bench.' },
        { id: 'defog', name: 'Defog', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Clears all entry hazards.' },
      ], 'Choice Band'),
    ],
  },
  {
    id: 'johto_bruno',
    name: 'Bruno',
    title: 'Elite Four Bruno (Rematch)',
    specialty: 'Fighting Specialist',
    roster: [
      createLvl100Mon('bruno_hitmontop_rematch', 'Hitmontop', 237, ['Fighting'], { hp: 304, attack: 289, defense: 289, spAtk: 169, spDef: 319, speed: 239 }, 'Technician', 'Boosts moves with power 60 or less by 50%.', [
        { id: 'mach_punch', name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Technician priority punch.' },
        { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Technician metallic punch.' },
        { id: 'fake_out', name: 'Fake Out', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 10, priority: 3, description: 'First turn flinch strike.' },
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating punch barrage.' },
      ], 'Life Orb'),
      createLvl100Mon('bruno_hitmonlee_rematch', 'Hitmonlee', 106, ['Fighting'], { hp: 304, attack: 359, defense: 205, spAtk: 169, spDef: 319, speed: 299 }, 'Unburden', 'Doubles speed when held item is lost.', [
        { id: 'high_jump_kick', name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 130, accuracy: 90, pp: 10, description: 'High jump knee strike.' },
        { id: 'fake_out', name: 'Fake Out', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 10, priority: 3, description: 'Priority flinch kick.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Removes target held item for 1.5x damage.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
      ], 'Normal Gem'),
      createLvl100Mon('bruno_hitmonchan_rematch', 'Hitmonchan', 107, ['Fighting'], { hp: 304, attack: 319, defense: 257, spAtk: 169, spDef: 319, speed: 269 }, 'Iron Fist', 'Boosts punching moves by 20%.', [
        { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'High power martial combo.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Sub-zero freezing punch.' },
        { id: 'thunder_punch', name: 'Thunder Punch', type: 'Electric', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Electric fist.' },
        { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fiery punch.' },
      ], 'Choice Scarf'),
      createLvl100Mon('bruno_lucario', 'Lucario', 448, ['Fighting', 'Steel'], { hp: 344, attack: 319, defense: 239, spAtk: 329, spDef: 239, speed: 279 }, 'Steadfast', 'Boosts Speed each time it flinches.', [
        { id: 'aura_sphere', name: 'Aura Sphere', type: 'Fighting', category: 'Special', power: 80, accuracy: 100, pp: 20, description: 'Infallible aura strike.' },
        { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Light cannon beam.' },
        { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Blinding speed strike.' },
        { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Dark aura blast.' },
      ], 'Expert Belt'),
      createLvl100Mon('bruno_machamp_rematch', 'Machamp', 68, ['Fighting'], { hp: 384, attack: 379, defense: 259, spAtk: 229, spDef: 299, speed: 209 }, 'No Guard', 'All moves bypass accuracy checks.', [
        { id: 'dynamic_punch', name: 'Dynamic Punch', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: '100% confusion on hit.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 100, pp: 5, description: 'Critical rock blow.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off enemy item.' },
        { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
      ], 'Assault Vest'),
    ],
  },
  {
    id: 'johto_karen',
    name: 'Karen',
    title: 'Elite Four Karen',
    specialty: 'Dark Specialist',
    roster: [
      createLvl100Mon('karen_umbreon', 'Umbreon', 197, ['Dark'], { hp: 394, attack: 229, defense: 319, spAtk: 219, spDef: 359, speed: 229 }, 'Synchronize', 'Passes Burn, Poison, and Paralysis to attacker.', [
        { id: 'foul_play', name: 'Foul Play', type: 'Dark', category: 'Physical', power: 95, accuracy: 100, pp: 15, description: 'Uses target Attack stat for damage.' },
        { id: 'wish', name: 'Wish', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP to user or switch-in.' },
        { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Evades all attacks.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
      ], 'Leftovers'),
      createLvl100Mon('karen_vileplume', 'Vileplume', 45, ['Grass', 'Poison'], { hp: 354, attack: 239, defense: 269, spAtk: 319, spDef: 279, speed: 199 }, 'Effect Spore', 'Contact has 30% chance of Poison, Sleep, or Paralysis.', [
        { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
        { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge blast.' },
        { id: 'moonblast', name: 'Moonblast', type: 'Fairy', category: 'Special', power: 95, accuracy: 100, pp: 15, description: 'Lunar beam that may lower SpAtk.' },
        { id: 'synthesis', name: 'Synthesis', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP using solar power.' },
      ], 'Black Sludge'),
      createLvl100Mon('karen_gengar', 'Gengar', 94, ['Ghost', 'Poison'], { hp: 324, attack: 229, defense: 219, spAtk: 359, spDef: 249, speed: 319 }, 'Cursed Body', '30% chance to disable attacker move upon contact.', [
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Takes the foe down with it.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow sphere blast.' },
        { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'High power fighting burst.' },
        { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents target from using status moves for 3 turns.' },
      ], 'Focus Sash'),
      createLvl100Mon('karen_honchkrow', 'Honchkrow', 430, ['Dark', 'Flying'], { hp: 404, attack: 349, defense: 203, spAtk: 309, spDef: 203, speed: 241 }, 'Moxie', 'Boosts Attack by 1 stage after knocking out a foe.', [
        { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Reckless diving attack.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Strikes first if foe attacks.' },
        { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Enormous strength, lowers Atk and Def.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
      ], 'Life Orb'),
      createLvl100Mon('karen_houndoom_ace', 'Houndoom', 229, ['Dark', 'Fire'], { hp: 354, attack: 279, defense: 200, spAtk: 319, spDef: 259, speed: 289 }, 'Flash Fire', 'Powers up Fire attacks when hit by fire.', [
        { id: 'nasty_plot', name: 'Nasty Plot', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk by 2 stages.' },
        { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
        { id: 'dark_pulse', name: 'Dark Pulse', type: 'Dark', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Horrible dark aura with flinch chance.' },
        { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Toxic sludge blast.' },
      ], 'Life Orb'),
    ],
  },
];

export const JOHTO_CHAMPION_LANCE: Pokemon[] = [
  createLvl100Mon('lance_gyarados_j', 'Gyarados', 130, ['Water', 'Flying'], { hp: 394, attack: 349, defense: 257, spAtk: 219, spDef: 299, speed: 261 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Attack and Speed.' },
    { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Cascading rush with flinch.' },
    { id: 'ice_fang', name: 'Ice Fang', type: 'Ice', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Frigid bite.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
  ], 'Wacan Berry'),
  createLvl100Mon('lance_aerodactyl_j', 'Aerodactyl', 142, ['Rock', 'Flying'], { hp: 364, attack: 309, defense: 229, spAtk: 219, spDef: 249, speed: 359 }, 'Rock Head', 'Protects from recoil damage.', [
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth shaking shockwave.' },
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Recoil-free diving attack.' },
    { id: 'aqua_tail', name: 'Aqua Tail', type: 'Water', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Slams with wave tail.' },
  ], 'Choice Band'),
  createLvl100Mon('lance_charizard_j', 'Charizard', 6, ['Fire', 'Flying'], { hp: 360, attack: 267, defense: 255, spAtk: 317, spDef: 269, speed: 299 }, 'Solar Power', 'Boosts SpAtk in sunshine.', [
    { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno.' },
    { id: 'air_slash', name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Wind blades with flinch.' },
    { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus energy blast.' },
    { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Shockwave of draconic power.' },
  ], 'Choice Specs'),
  createLvl100Mon('lance_kingdra', 'Kingdra', 230, ['Water', 'Dragon'], { hp: 354, attack: 289, defense: 289, spAtk: 289, spDef: 289, speed: 269 }, 'Sniper', 'Powers up critical hits to 2.25x.', [
    { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Summons comets from the sky.' },
    { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Blasts high pressure water.' },
    { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Metallic beam of light.' },
    { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Sinister light beam.' },
  ], 'Scope Lens'),
  createLvl100Mon('lance_dragonite_supp', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 367, defense: 289, spAtk: 299, spDef: 299, speed: 259 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'thunder_wave', name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Paralyzes foe.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
    { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Sharp dragon slash.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Electrified fiery punch.' },
  ], 'Lum Berry'),
  createLvl100Mon('lance_dragonite_ace_j', 'Dragonite', 149, ['Dragon', 'Flying'], { hp: 386, attack: 367, defense: 289, spAtk: 299, spDef: 299, speed: 259 }, 'Multiscale', 'Halves damage taken when at full HP.', [
    { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
    { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Frenzied rampage for 2-3 turns.' },
    { id: 'extreme_speed', name: 'Extreme Speed', type: 'Normal', category: 'Physical', power: 80, accuracy: 100, pp: 5, priority: 2, description: 'Blinding speed attack.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating seismic tremor.' },
  ], 'Weakness Policy'),
];

export const JOHTO_LEAGUE: RegionalLeagueConfig = {
  regionId: 'johto',
  regionName: 'Johto',
  leagueName: 'Silver Conference / Indigo Plateau',
  championName: 'Lance',
  championTitle: 'Johto Champion',
  championRoster: JOHTO_CHAMPION_LANCE,
  eliteFour: JOHTO_ELITE_FOUR,
  dailyPlayerTeams: [
    {
      id: 'johto_rain_dance',
      name: 'Rain Dance Swift Swim',
      tagline: 'Cascading Water & Drizzle Surge',
      strategyTag: 'SWEEP',
      difficulty: 'Beginner Friendly',
      description: 'Drizzle-fueled Kingdra sweep, Feraligatr Dragon Dance, and 100% accurate Thunders.',
      recommendedLead: 'Politoed',
      colorTheme: '#0284c7',
      team: [
        createLvl100Mon('j_politoed', 'Politoed', 186, ['Water'], { hp: 384, attack: 249, defense: 249, spAtk: 279, spDef: 299, speed: 239 }, 'Drizzle', 'Summons downpour of rain on entry.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Rain-boosted boiling water with burn.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Freezing sub-zero beam.' },
          { id: 'encore', name: 'Encore', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Forces foe to repeat move.' },
          { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers HP and cures status.' },
        ], 'Damp Rock'),
        createLvl100Mon('j_kingdra', 'Kingdra', 230, ['Water', 'Dragon'], { hp: 354, attack: 289, defense: 289, spAtk: 289, spDef: 289, speed: 269 }, 'Swift Swim', 'Doubles Speed in rain.', [
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Rain-boosted hydro pump.' },
          { id: 'draco_meteor', name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 90, pp: 5, description: 'Devastating meteor strike.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam coverage.' },
          { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Consistent dragon pulse.' },
        ], 'Life Orb'),
        createLvl100Mon('j_feraligatr', 'Feraligatr', 160, ['Water'], { hp: 374, attack: 339, defense: 299, spAtk: 257, spDef: 265, speed: 255 }, 'Sheer Force', 'Strengthens moves with secondary effects.', [
          { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Speed.' },
          { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Sheer force boosted rain waterfall.' },
          { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Sheer force boosted crunch.' },
          { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Sheer force boosted ice punch.' },
        ], 'Life Orb'),
        createLvl100Mon('j_lanturn', 'Lanturn', 171, ['Water', 'Electric'], { hp: 454, attack: 215, defense: 215, spAtk: 251, spDef: 251, speed: 233 }, 'Volt Absorb', 'Heals HP when struck by Electric attacks.', [
          { id: 'thunderbolt', name: 'Thunder', type: 'Electric', category: 'Special', power: 110, accuracy: 100, pp: 10, description: '100% accurate thunder in rain.' },
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Rain boosted scald.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt pivot.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
        ], 'Leftovers'),
        createLvl100Mon('j_scizor', 'Scizor', 212, ['Bug', 'Steel'], { hp: 344, attack: 359, defense: 299, spAtk: 209, spDef: 259, speed: 229 }, 'Technician', 'Boosts priority moves by 50%. Rain halves Fire weakness.', [
          { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority steel punch.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'U-turn pivot.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
        ], 'Choice Band'),
        createLvl100Mon('j_raikou', 'Raikou', 243, ['Electric'], { hp: 384, attack: 269, defense: 249, spAtk: 329, spDef: 299, speed: 329 }, 'Pressure', 'Doubles opponent PP consumption.', [
          { id: 'thunderbolt', name: 'Thunder', type: 'Electric', category: 'Special', power: 110, accuracy: 100, pp: 10, description: 'Infallible lightning in rain.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt pivot.' },
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
          { id: 'calm_mind', name: 'Calm Mind', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk and SpDef.' },
        ], 'Life Orb'),
      ],
    },
    {
      id: 'johto_dragmag_pivot',
      name: 'Spikes & DragMag Pivot',
      tagline: 'Steel Trapping & Dragon Dominance',
      strategyTag: 'BALANCE',
      difficulty: 'Intermediate',
      description: 'Magnezone traps opposing Steels, opening the field for Tyranitar and Suicune.',
      recommendedLead: 'Forretress',
      colorTheme: '#7c3aed',
      team: [
        createLvl100Mon('j_forretress_lead', 'Forretress', 205, ['Bug', 'Steel'], { hp: 354, attack: 279, defense: 419, spAtk: 219, spDef: 219, speed: 179 }, 'Sturdy', 'Survives lethal hit at full HP.', [
          { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Sets floor spikes.' },
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Sets stealth rocks.' },
          { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Slow pivot out.' },
        ], 'Leftovers'),
        createLvl100Mon('j_magnezone', 'Magnezone', 462, ['Electric', 'Steel'], { hp: 344, attack: 239, defense: 329, spAtk: 359, spDef: 279, speed: 219 }, 'Magnet Pull', 'Prevents opposing Steel-type Pokemon from escaping.', [
          { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
          { id: 'flash_cannon', name: 'Flash Cannon', type: 'Steel', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'Steel light beam.' },
          { id: 'hidden_power_fire', name: 'Hidden Power Fire', type: 'Fire', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'Super-effective against trapped Steels.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt switch.' },
        ], 'Choice Specs'),
        createLvl100Mon('j_tyranitar', 'Tyranitar', 248, ['Rock', 'Dark'], { hp: 404, attack: 367, defense: 319, spAtk: 289, spDef: 329, speed: 241 }, 'Sand Stream', 'Summons sandstorm on entry, boosting Rock SpDef by 50%.', [
          { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
          { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunch bite.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'pursuit', name: 'Pursuit', type: 'Dark', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'Deals double damage to switching foes.' },
        ], 'Choice Band'),
        createLvl100Mon('j_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
          { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Flying dive.' },
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers 50% HP.' },
          { id: 'whirlwind', name: 'Whirlwind', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, priority: -6, description: 'Blows away foe.' },
          { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays spikes.' },
        ], 'Rocky Helmet'),
        createLvl100Mon('j_gengar', 'Gengar', 94, ['Ghost', 'Poison'], { hp: 324, attack: 229, defense: 219, spAtk: 359, spDef: 249, speed: 319 }, 'Levitate', 'Immune to Ground attacks.', [
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
          { id: 'sludge_bomb', name: 'Sludge Bomb', type: 'Poison', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Sludge bomb.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
          { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Mutual KO trap.' },
        ], 'Focus Sash'),
        createLvl100Mon('j_suicune', 'Suicune', 245, ['Water'], { hp: 404, attack: 249, defense: 329, spAtk: 279, spDef: 329, speed: 269 }, 'Pressure', 'Forces foe to expend double PP.', [
          { id: 'calm_mind', name: 'Calm Mind', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts SpAtk and SpDef.' },
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Recovers HP and cures status.' },
          { id: 'sleep_talk', name: 'Sleep Talk', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Uses random move while asleep.' },
        ], 'Leftovers'),
      ],
    },
    {
      id: 'johto_curse_stall',
      name: 'Curse & Recovery Stall',
      tagline: 'Infinite Endurance & Status Drain',
      strategyTag: 'STALL',
      difficulty: 'Strategic',
      description: 'Curse Steelix, Umbreon Wish support, Blissey Aromatherapy, and Donphan Rapid Spin.',
      recommendedLead: 'Umbreon',
      colorTheme: '#15803d',
      team: [
        createLvl100Mon('j_umbreon_stall', 'Umbreon', 197, ['Dark'], { hp: 394, attack: 229, defense: 319, spAtk: 219, spDef: 359, speed: 229 }, 'Synchronize', 'Passes status ailments to attacker.', [
          { id: 'foul_play', name: 'Foul Play', type: 'Dark', category: 'Physical', power: 95, accuracy: 100, pp: 15, description: 'Punishes high physical attackers.' },
          { id: 'wish', name: 'Wish', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Heals self or teammate next turn.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks attacks.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons target.' },
        ], 'Leftovers'),
        createLvl100Mon('j_blissey', 'Blissey', 242, ['Normal'], { hp: 714, attack: 119, defense: 119, spAtk: 249, spDef: 369, speed: 209 }, 'Natural Cure', 'Heals all status upon switching.', [
          { id: 'softboiled', name: 'Soft-Boiled', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'seismic_toss', name: 'Seismic Toss', type: 'Fighting', category: 'Physical', power: 100, accuracy: 100, pp: 20, description: 'Deals flat 100 HP.' },
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Sets stealth rocks.' },
        ], 'Leftovers'),
        createLvl100Mon('j_donphan', 'Donphan', 232, ['Ground'], { hp: 384, attack: 339, defense: 339, spAtk: 219, spDef: 219, speed: 199 }, 'Sturdy', 'Survives lethal hit at full HP.', [
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
          { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice shard.' },
          { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knocks off enemy item.' },
        ], 'Leftovers'),
        createLvl100Mon('j_steelix_stall', 'Steelix', 208, ['Steel', 'Ground'], { hp: 354, attack: 269, defense: 499, spAtk: 199, spDef: 229, speed: 159 }, 'Sturdy', 'Survives lethal hit with 1 HP.', [
          { id: 'curse', name: 'Curse', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Boosts Atk and Def, lowers Spe.' },
          { id: 'gyro_ball', name: 'Gyro Ball', type: 'Steel', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Heavy steel strike.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP and clears status.' },
        ], 'Chesto Berry'),
        createLvl100Mon('j_meganium', 'Meganium', 154, ['Grass'], { hp: 364, attack: 263, defense: 299, spAtk: 265, spDef: 299, speed: 259 }, 'Overgrow', 'Boosts Grass moves in a pinch.', [
          { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
          { id: 'leech_seed', name: 'Leech Seed', type: 'Grass', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Leeches enemy HP.' },
          { id: 'synthesis', name: 'Synthesis', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Restores HP.' },
          { id: 'dragon_tail', name: 'Dragon Tail', type: 'Dragon', category: 'Physical', power: 60, accuracy: 90, pp: 10, priority: -6, description: 'Forces foe switch.' },
        ], 'Leftovers'),
        createLvl100Mon('j_heracross', 'Heracross', 214, ['Bug', 'Fighting'], { hp: 364, attack: 379, defense: 249, spAtk: 179, spDef: 289, speed: 269 }, 'Guts', 'Boosts Attack by 50% when afflicted by status.', [
          { id: 'close_combat', name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Punch barrage.' },
          { id: 'megahorn', name: 'Megahorn', type: 'Bug', category: 'Physical', power: 120, accuracy: 85, pp: 10, description: 'Horn charge.' },
          { id: 'facade', name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Doubles power to 140 when burned.' },
          { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
        ], 'Flame Orb'),
      ],
    },
  ],
};
