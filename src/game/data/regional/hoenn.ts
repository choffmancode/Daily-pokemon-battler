/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hoenn Regional League (Ever Grande City)
 * Champion: Steven Stone
 * Elite Four: Sidney, Phoebe, Glacia, Drake
 * Daily Player Squads: 3 Archetypes with Held Items
 */

import { Pokemon, EliteFourMember, RegionalLeagueConfig, createLvl100Mon } from './types';

export const HOENN_ELITE_FOUR: EliteFourMember[] = [
  {
    id: 'hoenn_sidney',
    name: 'Sidney',
    title: 'Elite Four Sidney',
    specialty: 'Dark Specialist',
    roster: [
      createLvl100Mon('sidney_mightyena', 'Mightyena', 262, ['Dark'], { hp: 344, attack: 279, defense: 239, spAtk: 219, spDef: 219, speed: 239 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
        { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crushes with sharp fangs.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Strikes first if foe attacks.' },
        { id: 'play_rough', name: 'Play Rough', type: 'Fairy', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Rough fairy tackle.' },
        { id: 'fire_fang', name: 'Fire Fang', type: 'Fire', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Flaming bite.' },
      ], 'Sitrus Berry'),
      createLvl100Mon('sidney_shiftry', 'Shiftry', 275, ['Grass', 'Dark'], { hp: 384, attack: 299, defense: 219, spAtk: 279, spDef: 219, speed: 259 }, 'Early Bird', 'Awakens from sleep twice as quickly.', [
        { id: 'leaf_blade', name: 'Leaf Blade', type: 'Grass', category: 'Physical', power: 90, accuracy: 100, pp: 15, description: 'Critical leaf slash.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Removes held item.' },
        { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
      ], 'Life Orb'),
      createLvl100Mon('sidney_cacturne', 'Cacturne', 332, ['Grass', 'Dark'], { hp: 344, attack: 329, defense: 219, spAtk: 329, spDef: 219, speed: 209 }, 'Water Absorb', 'Heals HP when struck by Water attacks.', [
        { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays floor spikes.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
        { id: 'seed_bomb', name: 'Seed Bomb', type: 'Grass', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Hard shell seed burst.' },
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Mutual KO trap.' },
      ], 'Focus Sash'),
      createLvl100Mon('sidney_crawdaunt', 'Crawdaunt', 342, ['Water', 'Dark'], { hp: 330, attack: 339, defense: 269, spAtk: 279, spDef: 209, speed: 209 }, 'Adaptability', 'Powers up moves of the same type to 2.0x.', [
        { id: 'crabhammer', name: 'Crabhammer', type: 'Water', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Pincer blow with high critical ratio.' },
        { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Adaptability boosted knock off.' },
        { id: 'aqua_jet', name: 'Aqua Jet', type: 'Water', category: 'Physical', power: 40, accuracy: 100, pp: 20, priority: 1, description: 'Adaptability priority water jet.' },
        { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Devastating physical strike.' },
      ], 'Choice Band'),
      createLvl100Mon('sidney_absol_ace', 'Absol', 359, ['Dark'], { hp: 334, attack: 359, defense: 219, spAtk: 249, spDef: 219, speed: 249 }, 'Super Luck', 'Heightens critical hit ratios.', [
        { id: 'night_slash', name: 'Night Slash', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'Dark slash with massive critical rate.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
        { id: 'play_rough', name: 'Play Rough', type: 'Fairy', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Fairy tackle.' },
        { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
      ], 'Scope Lens'),
    ],
  },
  {
    id: 'hoenn_phoebe',
    name: 'Phoebe',
    title: 'Elite Four Phoebe',
    specialty: 'Ghost Specialist',
    roster: [
      createLvl100Mon('phoebe_dusclops', 'Dusclops', 356, ['Ghost'], { hp: 284, attack: 239, defense: 359, spAtk: 219, spDef: 359, speed: 149 }, 'Pressure', 'Doubles opponent PP consumption.', [
        { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Inflicts burn to halve physical attack.' },
        { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Shares HP equally with foe.' },
        { id: 'night_shade', name: 'Night Shade', type: 'Ghost', category: 'Special', power: 100, accuracy: 100, pp: 15, description: 'Deals exact flat 100 HP damage.' },
        { id: 'curse', name: 'Curse', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Boosts Atk and Def, lowers Spe.' },
      ], 'Eviolite'),
      createLvl100Mon('phoebe_banette', 'Banette', 354, ['Ghost'], { hp: 332, attack: 329, defense: 229, spAtk: 265, spDef: 225, speed: 229 }, 'Insomnia', 'Prevents falling asleep.', [
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Takes the foe down with it.' },
        { id: 'shadow_claw', name: 'Shadow Claw', type: 'Ghost', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'High critical shadow slash.' },
        { id: 'sucker_punch', name: 'Sucker Punch', type: 'Dark', category: 'Physical', power: 70, accuracy: 100, pp: 5, priority: 1, description: 'Priority strike.' },
        { id: 'gunk_shot', name: 'Gunk Shot', type: 'Poison', category: 'Physical', power: 120, accuracy: 80, pp: 5, description: 'Toxic garbage blow.' },
      ], 'Focus Sash'),
      createLvl100Mon('phoebe_sableye', 'Sableye', 302, ['Dark', 'Ghost'], { hp: 304, attack: 249, defense: 249, spAtk: 229, spDef: 229, speed: 199 }, 'Prankster', 'Gives priority to all status moves.', [
        { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Priority 50% HP recovery.' },
        { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Priority burn.' },
        { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Priority taunt prevents status moves.' },
        { id: 'foul_play', name: 'Foul Play', type: 'Dark', category: 'Physical', power: 95, accuracy: 100, pp: 15, description: 'Uses target Attack stat.' },
      ], 'Leftovers'),
      createLvl100Mon('phoebe_froslass', 'Froslass', 478, ['Ice', 'Ghost'], { hp: 344, attack: 259, defense: 239, spAtk: 259, spDef: 239, speed: 319 }, 'Cursed Body', 'May disable attacker moves upon contact.', [
        { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays spikes.' },
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Mutual KO trap.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Sub-zero ice beam.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
      ], 'Focus Sash'),
      createLvl100Mon('phoebe_dusknoir_ace', 'Dusknoir', 477, ['Ghost'], { hp: 294, attack: 299, defense: 369, spAtk: 229, spDef: 369, speed: 189 }, 'Pressure', 'Forces foe to expend double PP.', [
        { id: 'shadow_sneak', name: 'Shadow Sneak', type: 'Ghost', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority shadow strike.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
        { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Freezing punch.' },
        { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fiery punch.' },
      ], 'Sitrus Berry'),
    ],
  },
  {
    id: 'hoenn_glacia',
    name: 'Glacia',
    title: 'Elite Four Glacia',
    specialty: 'Ice Specialist',
    roster: [
      createLvl100Mon('glacia_glalie_lead', 'Glalie', 362, ['Ice'], { hp: 364, attack: 259, defense: 259, spAtk: 259, spDef: 259, speed: 259 }, 'Inner Focus', 'Prevents flinching.', [
        { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Sets floor spikes.' },
        { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents enemy status moves.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Frigid ice beam.' },
        { id: 'explosion', name: 'Explosion', type: 'Normal', category: 'Physical', power: 250, accuracy: 100, pp: 5, description: 'Massive blast that faints user.' },
      ], 'Focus Sash'),
      createLvl100Mon('glacia_froslass', 'Froslass', 478, ['Ice', 'Ghost'], { hp: 344, attack: 259, defense: 239, spAtk: 259, spDef: 239, speed: 319 }, 'Snow Cloak', 'Increases evasion during Hail.', [
        { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 70, pp: 5, description: '100% accurate in hail.' },
        { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Electric blast.' },
        { id: 'destiny_bond', name: 'Destiny Bond', type: 'Ghost', category: 'Status', power: 0, accuracy: 100, pp: 5, description: 'Mutual KO trap.' },
      ], 'Life Orb'),
      createLvl100Mon('glacia_sealeo', 'Sealeo', 364, ['Ice', 'Water'], { hp: 384, attack: 219, defense: 239, spAtk: 249, spDef: 239, speed: 189 }, 'Thick Fat', 'Halves incoming Fire and Ice damage.', [
        { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Water wave.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks all damage.' },
      ], 'Eviolite'),
      createLvl100Mon('glacia_abomasnow', 'Abomasnow', 460, ['Grass', 'Ice'], { hp: 384, attack: 283, defense: 249, spAtk: 283, spDef: 269, speed: 219 }, 'Snow Warning', 'Summons Hailstorm on entry.', [
        { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'Special', power: 110, accuracy: 100, pp: 5, description: '100% accurate Blizzard in hail.' },
        { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
        { id: 'ice_shard', name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority ice shard.' },
      ], 'Expert Belt'),
      createLvl100Mon('glacia_walrein_ace', 'Walrein', 365, ['Ice', 'Water'], { hp: 424, attack: 259, defense: 279, spAtk: 289, spDef: 279, speed: 229 }, 'Thick Fat', 'Halves incoming Fire and Ice attacks.', [
        { id: 'surf', name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Water wave.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
        { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP and clears status.' },
      ], 'Leftovers'),
    ],
  },
  {
    id: 'hoenn_drake',
    name: 'Drake',
    title: 'Elite Four Drake',
    specialty: 'Dragon Specialist',
    roster: [
      createLvl100Mon('drake_altaria', 'Altaria', 334, ['Dragon', 'Flying'], { hp: 354, attack: 239, defense: 279, spAtk: 239, spDef: 309, speed: 259 }, 'Natural Cure', 'Heals status upon switching out.', [
        { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Speed.' },
        { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
        { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Sharp dragon slash.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
      ], 'Leftovers'),
      createLvl100Mon('drake_flygon', 'Flygon', 330, ['Ground', 'Dragon'], { hp: 364, attack: 299, defense: 259, spAtk: 259, spDef: 259, speed: 299 }, 'Levitate', 'Immune to Ground attacks and hazards.', [
        { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Rampaging dragon assault.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
        { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches.' },
        { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
      ], 'Choice Scarf'),
      createLvl100Mon('drake_kingdra', 'Kingdra', 230, ['Water', 'Dragon'], { hp: 354, attack: 289, defense: 289, spAtk: 289, spDef: 289, speed: 269 }, 'Swift Swim', 'Doubles Speed in rain.', [
        { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Water blast.' },
        { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Dragon pulse.' },
        { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
        { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Signal beam.' },
      ], 'Life Orb'),
      createLvl100Mon('drake_shelgon', 'Shelgon', 372, ['Dragon'], { hp: 334, attack: 289, defense: 299, spAtk: 219, spDef: 219, speed: 199 }, 'Overcoat', 'Immune to weather chip damage and powder moves.', [
        { id: 'iron_defense', name: 'Iron Defense', type: 'Steel', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Boosts Defense by 2 stages.' },
        { id: 'dragon_claw', name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Dragon slash.' },
        { id: 'brick_break', name: 'Brick Break', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Shatters Reflect and Light Screen.' },
        { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP and cures status.' },
      ], 'Eviolite'),
      createLvl100Mon('drake_salamence_ace', 'Salamence', 373, ['Dragon', 'Flying'], { hp: 394, attack: 369, defense: 259, spAtk: 319, spDef: 259, speed: 299 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
        { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
        { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Frenzied dragon rampage.' },
        { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating seismic tremor.' },
        { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Consuming inferno blast.' },
      ], 'Lum Berry'),
    ],
  },
];

export const HOENN_CHAMPION_STEVEN: Pokemon[] = [
  createLvl100Mon('steven_skarmory', 'Skarmory', 227, ['Steel', 'Flying'], { hp: 334, attack: 259, defense: 379, spAtk: 179, spDef: 239, speed: 239 }, 'Sturdy', 'Survives lethal KO hits with 1 HP.', [
    { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
    { id: 'spikes', name: 'Spikes', type: 'Ground', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays damaging floor spikes.' },
    { id: 'brave_bird', name: 'Brave Bird', type: 'Flying', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Reckless diving attack.' },
    { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_claydol', 'Claydol', 344, ['Ground', 'Psychic'], { hp: 324, attack: 239, defense: 309, spAtk: 239, spDef: 339, speed: 249 }, 'Levitate', 'Immune to Ground-type attacks and hazards.', [
    { id: 'reflect', name: 'Reflect', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Halves physical damage for 8 turns.' },
    { id: 'light_screen', name: 'Light Screen', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Halves special damage for 8 turns.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Telekinetic psychic assault.' },
  ], 'Light Clay'),
  createLvl100Mon('steven_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 339, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Rock Head', 'Protects from recoil damage.', [
    { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'No recoil Head Smash.' },
    { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Massive metallic crush.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fiery punch.' },
  ], 'Choice Band'),
  createLvl100Mon('steven_cradily', 'Cradily', 346, ['Rock', 'Grass'], { hp: 376, attack: 261, defense: 293, spAtk: 261, spDef: 313, speed: 215 }, 'Storm Drain', 'Draws Water moves to boost SpAtk and grants immunity.', [
    { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
    { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains nutrient HP.' },
    { id: 'ancient_power', name: 'Ancient Power', type: 'Rock', category: 'Special', power: 60, accuracy: 100, pp: 5, description: 'Ancient rock energy, may boost all stats.' },
    { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
  ], 'Leftovers'),
  createLvl100Mon('steven_armaldo', 'Armaldo', 348, ['Rock', 'Bug'], { hp: 354, attack: 349, defense: 299, spAtk: 239, spDef: 259, speed: 189 }, 'Battle Armor', 'Protects from critical hits.', [
    { id: 'x_scissor', name: 'X-Scissor', type: 'Bug', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crossed scissor slash.' },
    { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock stabs.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
    { id: 'aqua_jet', name: 'Aqua Jet', type: 'Water', category: 'Physical', power: 40, accuracy: 100, pp: 20, priority: 1, description: 'Priority water jet.' },
  ], 'Sitrus Berry'),
  createLvl100Mon('steven_metagross_ace', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 369, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents stat stage reductions.', [
    { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor punch that may raise Attack.' },
    { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Psychic headbutt with flinch chance.' },
    { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Devastating seismic tremor.' },
    { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority metallic punch.' },
  ], 'Lum Berry'),
];

export const HOENN_LEAGUE: RegionalLeagueConfig = {
  regionId: 'hoenn',
  regionName: 'Hoenn',
  leagueName: 'Ever Grande City',
  championName: 'Steven Stone',
  championTitle: 'Hoenn Champion',
  championRoster: HOENN_CHAMPION_STEVEN,
  eliteFour: HOENN_ELITE_FOUR,
  dailyPlayerTeams: [
    {
      id: 'hoenn_sand_rush',
      name: 'Sand Stream Rush',
      tagline: 'Desert Sand & Rock Fortitude',
      strategyTag: 'SWEEP',
      difficulty: 'Beginner Friendly',
      description: 'Sandstorm chip and boosted Rock special defense with Tyranitar, Metagross, and Swampert.',
      recommendedLead: 'Tyranitar',
      colorTheme: '#d97706',
      team: [
        createLvl100Mon('h_tyranitar', 'Tyranitar', 248, ['Rock', 'Dark'], { hp: 404, attack: 367, defense: 319, spAtk: 289, spDef: 329, speed: 241 }, 'Sand Stream', 'Summons sandstorm on entry.', [
          { id: 'stone_edge', name: 'Stone Edge', type: 'Rock', category: 'Physical', power: 100, accuracy: 80, pp: 5, description: 'Critical rock blow.' },
          { id: 'crunch', name: 'Crunch', type: 'Dark', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Crunch bite.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays pointed stones.' },
        ], 'Smooth Rock'),
        createLvl100Mon('h_flygon', 'Flygon', 330, ['Ground', 'Dragon'], { hp: 364, attack: 299, defense: 259, spAtk: 259, spDef: 259, speed: 299 }, 'Levitate', 'Immune to Ground attacks and hazards.', [
          { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Dragon outrage.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Ground tremor.' },
          { id: 'u_turn', name: 'U-turn', type: 'Bug', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'Attacks and switches.' },
          { id: 'fire_punch', name: 'Fire Punch', type: 'Fire', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Fiery punch.' },
        ], 'Choice Scarf'),
        createLvl100Mon('h_aggron', 'Aggron', 306, ['Steel', 'Rock'], { hp: 344, attack: 339, defense: 459, spAtk: 219, spDef: 219, speed: 199 }, 'Rock Head', 'No recoil damage.', [
          { id: 'head_smash', name: 'Head Smash', type: 'Rock', category: 'Physical', power: 150, accuracy: 80, pp: 5, description: 'Massive rock smash.' },
          { id: 'heavy_slam', name: 'Heavy Slam', type: 'Steel', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Heavy slam.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
          { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
        ], 'Choice Band'),
        createLvl100Mon('h_metagross', 'Metagross', 376, ['Steel', 'Psychic'], { hp: 364, attack: 369, defense: 359, spAtk: 289, spDef: 279, speed: 239 }, 'Clear Body', 'Prevents stat reductions.', [
          { id: 'meteor_mash', name: 'Meteor Mash', type: 'Steel', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'Meteor punch.' },
          { id: 'bullet_punch', name: 'Bullet Punch', type: 'Steel', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Priority fist strike.' },
          { id: 'zen_headbutt', name: 'Zen Headbutt', type: 'Psychic', category: 'Physical', power: 80, accuracy: 90, pp: 15, description: 'Zen headbutt.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earth tremor.' },
        ], 'Life Orb'),
        createLvl100Mon('h_swampert', 'Swampert', 260, ['Water', 'Ground'], { hp: 404, attack: 319, defense: 279, spAtk: 269, spDef: 279, speed: 219 }, 'Torrent', 'Immune to sandstorm and Electric.', [
          { id: 'waterfall', name: 'Waterfall', type: 'Water', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Waterfall.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
          { id: 'ice_punch', name: 'Ice Punch', type: 'Ice', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'Ice punch.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Blocks all damage.' },
        ], 'Leftovers'),
        createLvl100Mon('h_salamence', 'Salamence', 373, ['Dragon', 'Flying'], { hp: 394, attack: 369, defense: 259, spAtk: 319, spDef: 259, speed: 299 }, 'Intimidate', 'Lowers opposing Attack on entry.', [
          { id: 'dragon_dance', name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk and Spe.' },
          { id: 'outrage', name: 'Outrage', type: 'Dragon', category: 'Physical', power: 120, accuracy: 100, pp: 10, description: 'Dragon outrage.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
          { id: 'fire_blast', name: 'Fire Blast', type: 'Fire', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'Fire blast.' },
        ], 'Lum Berry'),
      ],
    },
    {
      id: 'hoenn_swift_swim',
      name: 'Swift Swim Torrent',
      tagline: 'Tropical Rain & Pincer Striking',
      strategyTag: 'BALANCE',
      difficulty: 'Intermediate',
      description: 'Ludicolo and Crawdaunt sweep in rain, while Breloom provides Spore control.',
      recommendedLead: 'Swampert',
      colorTheme: '#06b6d4',
      team: [
        createLvl100Mon('h_swampert_lead', 'Swampert', 260, ['Water', 'Ground'], { hp: 404, attack: 319, defense: 279, spAtk: 269, spDef: 279, speed: 219 }, 'Torrent', 'Sets stealth rocks and rain.', [
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lays stealth rocks.' },
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        ], 'Leftovers'),
        createLvl100Mon('h_ludicolo', 'Ludicolo', 272, ['Water', 'Grass'], { hp: 364, attack: 239, defense: 239, spAtk: 279, spDef: 299, speed: 239 }, 'Swift Swim', 'Doubles Speed in rain.', [
          { id: 'hydro_pump', name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Hydro blast.' },
          { id: 'giga_drain', name: 'Giga Drain', type: 'Grass', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Drains HP.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
        ], 'Life Orb'),
        createLvl100Mon('h_crawdaunt', 'Crawdaunt', 342, ['Water', 'Dark'], { hp: 330, attack: 339, defense: 269, spAtk: 279, spDef: 209, speed: 209 }, 'Adaptability', 'Powers up same-type attacks by 2.0x.', [
          { id: 'crabhammer', name: 'Crabhammer', type: 'Water', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Adaptability crabhammer.' },
          { id: 'knock_off', name: 'Knock Off', type: 'Dark', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Knock off.' },
          { id: 'aqua_jet', name: 'Aqua Jet', type: 'Water', category: 'Physical', power: 40, accuracy: 100, pp: 20, priority: 1, description: 'Adaptability aqua jet.' },
          { id: 'superpower', name: 'Superpower', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'Superpower.' },
        ], 'Choice Band'),
        createLvl100Mon('h_manectric', 'Manectric', 310, ['Electric'], { hp: 344, attack: 249, defense: 219, spAtk: 309, spDef: 219, speed: 309 }, 'Lightning Rod', 'Draws Electric moves to boost SpAtk.', [
          { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
          { id: 'volt_switch', name: 'Volt Switch', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 20, description: 'Volt pivot.' },
          { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Flamethrower.' },
          { id: 'signal_beam', name: 'Signal Beam', type: 'Bug', category: 'Special', power: 75, accuracy: 100, pp: 15, description: 'Signal beam.' },
        ], 'Choice Specs'),
        createLvl100Mon('h_gardevoir', 'Gardevoir', 282, ['Psychic', 'Fairy'], { hp: 340, attack: 229, defense: 229, spAtk: 349, spDef: 329, speed: 259 }, 'Trace', 'Copies opposing Pokemon ability on switch-in.', [
          { id: 'psychic', name: 'Psychic', type: 'Psychic', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Psychic assault.' },
          { id: 'moonblast', name: 'Moonblast', type: 'Fairy', category: 'Special', power: 95, accuracy: 100, pp: 15, description: 'Moonblast.' },
          { id: 'focus_blast', name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 120, accuracy: 70, pp: 5, description: 'Focus blast.' },
          { id: 'shadow_ball', name: 'Shadow Ball', type: 'Ghost', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Shadow blob.' },
        ], 'Choice Scarf'),
        createLvl100Mon('h_breloom', 'Breloom', 286, ['Grass', 'Fighting'], { hp: 324, attack: 359, defense: 259, spAtk: 219, spDef: 219, speed: 239 }, 'Technician', 'Boosts moves under 60 base power by 50%.', [
          { id: 'spore', name: 'Spore', type: 'Grass', category: 'Status', power: 0, accuracy: 100, pp: 15, description: '100% accurate sleep spore.' },
          { id: 'mach_punch', name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Technician priority punch.' },
          { id: 'bullet_seed', name: 'Bullet Seed', type: 'Grass', category: 'Physical', power: 25, accuracy: 100, pp: 30, description: 'Technician multi-hit seeds.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
        ], 'Focus Sash'),
      ],
    },
    {
      id: 'hoenn_calm_mind_stall',
      name: 'Calm Mind & Status Bulwark',
      tagline: 'Enduring Bulwark & Deep Defense',
      strategyTag: 'STALL',
      difficulty: 'Strategic',
      description: 'Marvel Scale Milotic, Eviolite Dusclops, and Ice Body Regice outlast every threat.',
      recommendedLead: 'Milotic',
      colorTheme: '#059669',
      team: [
        createLvl100Mon('h_milotic', 'Milotic', 350, ['Water'], { hp: 394, attack: 219, defense: 257, spAtk: 299, spDef: 349, speed: 261 }, 'Marvel Scale', 'Boosts Defense by 50% when afflicted with a status condition.', [
          { id: 'scald', name: 'Scald', type: 'Water', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Scalding burn.' },
          { id: 'recover', name: 'Recover', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores 50% HP.' },
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
          { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Dragon pulse.' },
        ], 'Flame Orb'),
        createLvl100Mon('h_dusclops', 'Dusclops', 356, ['Ghost'], { hp: 284, attack: 239, defense: 359, spAtk: 219, spDef: 359, speed: 149 }, 'Pressure', 'Forces foe to expend double PP.', [
          { id: 'will_o_wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'Inflicts burn.' },
          { id: 'pain_split', name: 'Pain Split', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Equalizes HP.' },
          { id: 'night_shade', name: 'Night Shade', type: 'Ghost', category: 'Special', power: 100, accuracy: 100, pp: 15, description: 'Flat 100 HP damage.' },
          { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Prevents status moves.' },
        ], 'Eviolite'),
        createLvl100Mon('h_regice', 'Regice', 378, ['Ice'], { hp: 364, attack: 219, defense: 299, spAtk: 299, spDef: 499, speed: 199 }, 'Clear Body', 'Prevents stat reductions.', [
          { id: 'ice_beam', name: 'Ice Beam', type: 'Ice', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Ice beam.' },
          { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Thunderbolt.' },
          { id: 'rest', name: 'Rest', type: 'Psychic', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP and clears status.' },
          { id: 'sleep_talk', name: 'Sleep Talk', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Sleep talk.' },
        ], 'Leftovers'),
        createLvl100Mon('h_claydol', 'Claydol', 344, ['Ground', 'Psychic'], { hp: 324, attack: 239, defense: 309, spAtk: 239, spDef: 339, speed: 249 }, 'Levitate', 'Immune to Ground attacks.', [
          { id: 'rapid_spin', name: 'Rapid Spin', type: 'Normal', category: 'Physical', power: 50, accuracy: 100, pp: 40, description: 'Clears hazards.' },
          { id: 'stealth_rock', name: 'Stealth Rock', type: 'Rock', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Stealth rocks.' },
          { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'Earthquake.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
        ], 'Leftovers'),
        createLvl100Mon('h_altaria', 'Altaria', 334, ['Dragon', 'Flying'], { hp: 354, attack: 239, defense: 279, spAtk: 239, spDef: 309, speed: 259 }, 'Natural Cure', 'Heals status upon switching out.', [
          { id: 'roost', name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores HP.' },
          { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'Status', power: 0, accuracy: 90, pp: 10, description: 'Badly poisons.' },
          { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'Flamethrower.' },
          { id: 'dragon_pulse', name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 85, accuracy: 100, pp: 10, description: 'Dragon pulse.' },
        ], 'Leftovers'),
        createLvl100Mon('h_blaziken', 'Blaziken', 257, ['Fire', 'Fighting'], { hp: 364, attack: 339, defense: 239, spAtk: 319, spDef: 239, speed: 259 }, 'Speed Boost', 'Boosts Speed by 1 stage at the end of each turn.', [
          { id: 'flare_blitz', name: 'Flare Blitz', type: 'Fire', category: 'Physical', power: 120, accuracy: 100, pp: 15, description: 'Recoil flame strike.' },
          { id: 'high_jump_kick', name: 'High Jump Kick', type: 'Fighting', category: 'Physical', power: 130, accuracy: 90, pp: 10, description: 'Devastating high jump kick.' },
          { id: 'protect', name: 'Protect', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, priority: 4, description: 'Guarantees free Speed Boost.' },
          { id: 'swords_dance', name: 'Swords Dance', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts Atk by 2.' },
        ], 'Life Orb'),
      ],
    },
  ],
};
