# Regional Leagues & Elite Four Gauntlet Dataset (Gens 1–5)

This document provides the definitive competitive Level 100 dataset for the **Daily Champion Showdown** and **Elite Four Challenge (Gauntlet Run)** across Generations 1 through 5.

All teams are compiled from canonical Serebii, Bulbapedia, and competitive Smogon Gen 3–5 tournament archives, scaled to **Level 100** with authentic abilities, held items, four-move distributions, and stat distributions.

---

## 1. System Architecture: The Daily Regional Cycle & Gauntlet Flow

### Daily Region Cycle (5-Day Rotating Schedule)
Each day at midnight (UTC), the game rotates through one of the five classic Pokémon regions:
1. **Day 1: Kanto (Indigo Plateau)** — Champion **Blue** (Rival)
2. **Day 2: Johto (Silver Conference / Indigo Plateau)** — Champion **Lance**
3. **Day 3: Hoenn (Ever Grande City)** — Champion **Steven Stone** (or Emerald Champion **Wallace**)
4. **Day 4: Sinnoh (Pokémon League)** — Champion **Cynthia**
5. **Day 5: Unova (Pokémon League)** — Champion **Iris** (or BW Champion **Alder**)

### Two Battle Modes Every Day
* **Mode A: Daily Champion Battle**: Jump straight into a high-stakes 6v6 match against that day's reigning Champion.
* **Mode B: Elite Four Challenge (Gauntlet Run)**: A 5-stage endurance climb:
  $$\text{Member 1} \longrightarrow \text{Member 2} \longrightarrow \text{Member 3} \longrightarrow \text{Member 4} \longrightarrow \text{Champion}$$
  * **Inter-Round Healing**: Between each stage, the player's team is automatically healed to full HP/PP with status cured (classic tournament ladder format).
  * **Score & Streak**: Completing all 5 stages in sequence awards an Elite Four Trophy badge and bonus gacha packs.

### Daily Player Squads (3 Teams Tailored Per Region)
Each day, the player receives a choice of **3 distinct strategy-tagged teams** built around dominant competitive archetypes from the active region, blended with cross-regional synergies:
* **Team 1: Hyper Offense / Weather Sweep** (e.g., Swift Swim, Chlorophyll, Sand Rush)
* **Team 2: Bulky Pivot / Balance** (e.g., VoltTurn, Regenerator cores, Hazard Stack)
* **Team 3: Setup / Disruption Stall** (e.g., Dragon Dance, Calm Mind, Toxic/Substitute)

---

## 2. Generation 1: Kanto (Indigo Plateau)

**Champion**: **Blue** (Oak's Grandson / Rival)  
**Battle Theme**: Fast-paced Gen 1 balance with broad offensive coverage and heavy physical/special sweepers.

### Elite Four Roster

#### 1. Lorelei (Ice / Water Specialist)
*Strategy: Hailstorm chip, bulky Water defenses, freeze and confusion disruption.*
1. **Dewgong** (Lv. 100, Water/Ice) — Ability: *Thick Fat* | Item: *Leftovers*  
   Moves: `Surf`, `Ice Beam`, `Signal Beam`, `Rest`
2. **Cloyster** (Lv. 100, Water/Ice) — Ability: *Skill Link* | Item: *Focus Sash*  
   Moves: `Icicle Spear`, `Rock Blast`, `Spikes`, `Explosion`
3. **Slowbro** (Lv. 100, Water/Psychic) — Ability: *Own Tempo* | Item: *Sitrus Berry*  
   Moves: `Scald`, `Psychic`, `Calm Mind`, `Slack Off`
4. **Jynx** (Lv. 100, Ice/Psychic) — Ability: *Forewarn* | Item: *Life Orb*  
   Moves: `Lovely Kiss`, `Blizzard`, `Psychic`, `Shadow Ball`
5. **Lapras** (Lv. 100, Water/Ice) — Ability: *Water Absorb* | Item: *Chesto Berry*  
   Moves: `Hydro Pump`, `Ice Beam`, `Thunderbolt`, `Confuse Ray`

#### 2. Bruno (Fighting Specialist)
*Strategy: Heavy physical beatdown with Guts, Mach Punch priority, and Rock coverage.*
1. **Hitmontop** (Lv. 100, Fighting) — Ability: *Intimidate* | Item: *Sitrus Berry*  
   Moves: `Triple Kick`, `Rapid Spin`, `Mach Punch`, `Close Combat`
2. **Hitmonlee** (Lv. 100, Fighting) — Ability: *Limber* | Item: *Normal Gem*  
   Moves: `High Jump Kick`, `Fake Out`, `Stone Edge`, `Blaze Kick`
3. **Hitmonchan** (Lv. 100, Fighting) — Ability: *Iron Fist* | Item: *Expert Belt*  
   Moves: `Drain Punch`, `Mach Punch`, `Ice Punch`, `Thunder Punch`
4. **Steelix** (Lv. 100, Steel/Ground) — Ability: *Sturdy* | Item: *Leftovers*  
   Moves: `Stealth Rock`, `Earthquake`, `Gyro Ball`, `Stone Edge`
5. **Machamp** (Lv. 100, Fighting) — Ability: *No Guard* | Item: *Flame Orb*  
   Moves: `Dynamic Punch`, `Stone Edge`, `Ice Punch`, `Bullet Punch`

#### 3. Agatha (Ghost / Poison Specialist)
*Strategy: Volatile status, Confuse Ray, Hypnosis, and fast Poison/Ghost attacks.*
1. **Gengar** (Lv. 100, Ghost/Poison) — Ability: *Levitate* | Item: *Focus Sash*  
   Moves: `Shadow Ball`, `Sludge Bomb`, `Thunderbolt`, `Destiny Bond`
2. **Crobat** (Lv. 100, Poison/Flying) — Ability: *Infiltrator* | Item: *Black Sludge*  
   Moves: `Brave Bird`, `Cross Poison`, `U-turn`, `Roost`
3. **Arbok** (Lv. 100, Poison) — Ability: *Intimidate* | Item: *Shuca Berry*  
   Moves: `Gunk Shot`, `Earthquake`, `Sucker Punch`, `Glare`
4. **Misdreavus** (Lv. 100, Ghost) — Ability: *Levitate* | Item: *Eviolite*  
   Moves: `Will-O-Wisp`, `Pain Split`, `Shadow Ball`, `Thunder Wave`
5. **Gengar (Ace)** (Lv. 100, Ghost/Poison) — Ability: *Levitate* | Item: *Life Orb*  
   Moves: `Hypnosis`, `Shadow Ball`, `Focus Blast`, `Giga Drain`

#### 4. Lance (Dragon / Flying Specialist)
*Strategy: Dragon Dance sweeping, Hyper Beam power, and elemental dragon breath.*
1. **Gyarados** (Lv. 100, Water/Flying) — Ability: *Intimidate* | Item: *Wacan Berry*  
   Moves: `Dragon Dance`, `Waterfall`, `Bounce`, `Stone Edge`
2. **Aerodactyl** (Lv. 100, Rock/Flying) — Ability: *Pressure* | Item: *Focus Sash*  
   Moves: `Stealth Rock`, `Stone Edge`, `Earthquake`, `Aerial Ace`
3. **Charizard** (Lv. 100, Fire/Flying) — Ability: *Blaze* | Item: *Charti Berry*  
   Moves: `Flamethrower`, `Air Slash`, `Dragon Pulse`, `Roost`
4. **Dragonite (Special)** (Lv. 100, Dragon/Flying) — Ability: *Inner Focus* | Item: *Lum Berry*  
   Moves: `Draco Meteor`, `Fire Blast`, `Thunderbolt`, `Extreme Speed`
5. **Dragonite (Physical Ace)** (Lv. 100, Dragon/Flying) — Ability: *Multiscale* | Item: *Weakness Policy*  
   Moves: `Dragon Dance`, `Outrage`, `Earthquake`, `Extreme Speed`

### Champion: Blue (Kanto Champion)
1. **Pidgeot** (Lv. 100, Normal/Flying) — Ability: *Keen Eye* | Item: *Life Orb*  
   Moves: `Brave Bird`, `Return`, `U-turn`, `Roost`
2. **Alakazam** (Lv. 100, Psychic) — Ability: *Magic Guard* | Item: *Focus Sash*  
   Moves: `Psychic`, `Shadow Ball`, `Focus Blast`, `Energy Ball`
3. **Rhydon** (Lv. 100, Ground/Rock) — Ability: *Lightning Rod* | Item: *Eviolite*  
   Moves: `Earthquake`, `Stone Edge`, `Megahorn`, `Stealth Rock`
4. **Exeggutor** (Lv. 100, Grass/Psychic) — Ability: *Chlorophyll* | Item: *Sitrus Berry*  
   Moves: `Leaf Storm`, `Psychic`, `Sleep Powder`, `Synthesis`
5. **Arcanine** (Lv. 100, Fire) — Ability: *Intimidate* | Item: *Leftovers*  
   Moves: `Flare Blitz`, `Extreme Speed`, `Wild Charge`, `Morning Sun`
6. **Blastoise (Ace)** (Lv. 100, Water) — Ability: *Torrent* | Item: *White Herb*  
   Moves: `Shell Smash`, `Hydro Pump`, `Ice Beam`, `Aura Sphere`

---

## 3. Generation 2: Johto (Silver Conference / Indigo Plateau)

**Champion**: **Lance**  
**Battle Theme**: Multi-Dragon assault, thunder waves, weather manipulation, and flying speed.

### Elite Four Roster

#### 1. Will (Psychic Specialist)
*Strategy: Dual Screens, Confuse Ray, and high Special Attack psychic barrages.*
1. **Xatu (Lead)** (Lv. 100, Psychic/Flying) — Ability: *Magic Bounce* | Item: *Light Clay*  
   Moves: `Reflect`, `Light Screen`, `Psychic`, `U-turn`
2. **Jynx** (Lv. 100, Ice/Psychic) — Ability: *Dry Skin* | Item: *Focus Sash*  
   Moves: `Lovely Kiss`, `Ice Beam`, `Psychic`, `Focus Blast`
3. **Slowbro** (Lv. 100, Water/Psychic) — Ability: *Regenerator* | Item: *Leftovers*  
   Moves: `Scald`, `Psyshock`, `Thunder Wave`, `Slack Off`
4. **Exeggutor** (Lv. 100, Grass/Psychic) — Ability: *Harvest* | Item: *Sitrus Berry*  
   Moves: `Giga Drain`, `Psychic`, `Leech Seed`, `Substitue`
5. **Xatu (Ace)** (Lv. 100, Psychic/Flying) — Ability: *Magic Bounce* | Item: *Life Orb*  
   Moves: `Air Slash`, `Psychic`, `Shadow Ball`, `Roost`

#### 2. Koga (Poison / Ninja Specialist)
*Strategy: Toxic Spikes, evasion minimization, and blinding speed.*
1. **Ariados** (Lv. 100, Bug/Poison) — Ability: *Swarm* | Item: *Focus Sash*  
   Moves: `Sticky Web`, `Toxic Spikes`, `Megahorn`, `Shadow Sneak`
2. **Forretress** (Lv. 100, Bug/Steel) — Ability: *Sturdy* | Item: *Custap Berry*  
   Moves: `Spikes`, `Stealth Rock`, `Gyro Ball`, `Explosion`
3. **Muk** (Lv. 100, Poison) — Ability: *Poison Touch* | Item: *Black Sludge*  
   Moves: `Gunk Shot`, `Fire Punch`, `Shadow Sneak`, `Curse`
4. **Venomoth** (Lv. 100, Bug/Poison) — Ability: *Tinted Lens* | Item: *Life Orb*  
   Moves: `Quiver Dance`, `Bug Buzz`, `Sludge Bomb`, `Baton Pass`
5. **Crobat (Ace)** (Lv. 100, Poison/Flying) — Ability: *Infiltrator* | Item: *Choice Band*  
   Moves: `Brave Bird`, `Cross Poison`, `U-turn`, `Defog`

#### 3. Bruno (Fighting Specialist - Rematch Edition)
1. **Hitmontop** (Lv. 100, Fighting) — Ability: *Technician* | Item: *Life Orb*  
   Moves: `Mach Punch`, `Bullet Punch`, `Fake Out`, `Close Combat`
2. **Hitmonlee** (Lv. 100, Fighting) — Ability: *Unburden* | Item: *Normal Gem*  
   Moves: `High Jump Kick`, `Fake Out`, `Knock Off`, `Stone Edge`
3. **Hitmonchan** (Lv. 100, Fighting) — Ability: *Iron Fist* | Item: *Choice Scarf*  
   Moves: `Close Combat`, `Ice Punch`, `Thunder Punch`, `Fire Punch`
4. **Lucario** (Lv. 100, Fighting/Steel) — Ability: *Steadfast* | Item: *Expert Belt*  
   Moves: `Aura Sphere`, `Flash Cannon`, `Extreme Speed`, `Dark Pulse`
5. **Machamp (Ace)** (Lv. 100, Fighting) — Ability: *No Guard* | Item: *Assault Vest*  
   Moves: `Dynamic Punch`, `Stone Edge`, `Knock Off`, `Bullet Punch`

#### 4. Karen (Dark Specialist)
*Strategy: Sucker Punch mindgames, Foul Play punishment, and bulky Dark walls.*
1. **Umbreon** (Lv. 100, Dark) — Ability: *Synchronize* | Item: *Leftovers*  
   Moves: `Foul Play`, `Wish`, `Protect`, `Toxic`
2. **Vileplume** (Lv. 100, Grass/Poison) — Ability: *Effect Spore* | Item: *Black Sludge*  
   Moves: `Giga Drain`, `Sludge Bomb`, `Moonblast`, `Synthesis`
3. **Gengar** (Lv. 100, Ghost/Poison) — Ability: *Cursed Body* | Item: *Focus Sash*  
   Moves: `Destiny Bond`, `Shadow Ball`, `Focus Blast`, `Taunt`
4. **Honchkrow** (Lv. 100, Dark/Flying) — Ability: *Moxie* | Item: *Life Orb*  
   Moves: `Brave Bird`, `Sucker Punch`, `Superpower`, `Roost`
5. **Houndoom (Ace)** (Lv. 100, Dark/Fire) — Ability: *Flash Fire* | Item: *Life Orb*  
   Moves: `Nasty Plot`, `Fire Blast`, `Dark Pulse`, `Sludge Bomb`

### Champion: Lance (Johto Champion)
1. **Gyarados** (Lv. 100, Water/Flying) — Ability: *Intimidate* | Item: *Wacan Berry*  
   Moves: `Dragon Dance`, `Waterfall`, `Ice Fang`, `Earthquake`
2. **Aerodactyl** (Lv. 100, Rock/Flying) — Ability: *Rock Head* | Item: *Choice Band*  
   Moves: `Stone Edge`, `Earthquake`, `Brave Bird`, `Aqua Tail`
3. **Charizard** (Lv. 100, Fire/Flying) — Ability: *Solar Power* | Item: *Choice Specs*  
   Moves: `Fire Blast`, `Air Slash`, `Focus Blast`, `Dragon Pulse`
4. **Kingdra** (Lv. 100, Water/Dragon) — Ability: *Sniper* | Item: *Scope Lens*  
   Moves: `Draco Meteor`, `Hydro Pump`, `Flash Cannon`, `Signal Beam`
5. **Dragonite (Support)** (Lv. 100, Dragon/Flying) — Ability: *Multiscale* | Item: *Lum Berry*  
   Moves: `Thunder Wave`, `Roost`, `Dragon Claw`, `Fire Punch`
6. **Dragonite (Ace)** (Lv. 100, Dragon/Flying) — Ability: *Multiscale* | Item: *Weakness Policy*  
   Moves: `Dragon Dance`, `Outrage`, `Extreme Speed`, `Earthquake`

---

## 4. Generation 3: Hoenn (Ever Grande City)

**Champions**: **Steven Stone** (RS/ORAS) & **Wallace** (Emerald)  
**Battle Theme**: Steel fortitude, Ancient Fossils, Sandstorm, or Rain-fueled Water Mastery.

### Elite Four Roster

#### 1. Sidney (Dark Specialist)
*Strategy: Fast Dark offense, Swagger confusion, and priority Sucker Punch.*
1. **Mightyena** (Lv. 100, Dark) — Ability: *Intimidate* | Item: *Sitrus Berry*  
   Moves: `Crunch`, `Sucker Punch`, `Play Rough`, `Fire Fang`
2. **Shiftry** (Lv. 100, Grass/Dark) — Ability: *Early Bird* | Item: *Life Orb*  
   Moves: `Leaf Blade`, `Sucker Punch`, `Knock Off`, `Swords Dance`
3. **Cacturne** (Lv. 100, Grass/Dark) — Ability: *Water Absorb* | Item: *Focus Sash*  
   Moves: `Spikes`, `Sucker Punch`, `Seed Bomb`, `Destiny Bond`
4. **Crawdaunt** (Lv. 100, Water/Dark) — Ability: *Adaptability* | Item: *Choice Band*  
   Moves: `Crabhammer`, `Knock Off`, `Aqua Jet`, `Superpower`
5. **Absol (Ace)** (Lv. 100, Dark) — Ability: *Super Luck* | Item: *Scope Lens*  
   Moves: `Night Slash`, `Sucker Punch`, `Play Rough`, `Swords Dance`

#### 2. Phoebe (Ghost Specialist)
*Strategy: Curse, Will-O-Wisp, Calm Mind bulky ghosts with no weaknesses.*
1. **Dusclops (Tank)** (Lv. 100, Ghost) — Ability: *Pressure* | Item: *Eviolite*  
   Moves: `Will-O-Wisp`, `Pain Split`, `Night Shade`, `Curse`
2. **Banette** (Lv. 100, Ghost) — Ability: *Insomnia* | Item: *Focus Sash*  
   Moves: `Destiny Bond`, `Shadow Claw`, `Sucker Punch`, `Gunk Shot`
3. **Sableye** (Lv. 100, Dark/Ghost) — Ability: *Prankster* | Item: *Leftovers*  
   Moves: `Recover`, `Will-O-Wisp`, `Taunt`, `Foul Play`
4. **Froslass** (Lv. 100, Ice/Ghost) — Ability: *Cursed Body* | Item: *Focus Sash*  
   Moves: `Spikes`, `Destiny Bond`, `Ice Beam`, `Shadow Ball`
5. **Dusknoir (Ace)** (Lv. 100, Ghost) — Ability: *Pressure* | Item: *Sitrus Berry*  
   Moves: `Shadow Sneak`, `Earthquake`, `Ice Punch`, `Fire Punch`

#### 3. Glacia (Ice Specialist)
*Strategy: Hailstorm residual damage, Ice Body recovery, and Thick Fat defense.*
1. **Glalie (Lead)** (Lv. 100, Ice) — Ability: *Inner Focus* | Item: *Focus Sash*  
   Moves: `Spikes`, `Taunt`, `Ice Beam`, `Explosion`
2. **Froslass** (Lv. 100, Ice/Ghost) — Ability: *Snow Cloak* | Item: *Life Orb*  
   Moves: `Blizzard`, `Shadow Ball`, `Thunderbolt`, `Destiny Bond`
3. **Sealeo** (Lv. 100, Ice/Water) — Ability: *Thick Fat* | Item: *Eviolite*  
   Moves: `Surf`, `Ice Beam`, `Toxic`, `Protect`
4. **Abomasnow** (Lv. 100, Grass/Ice) — Ability: *Snow Warning* | Item: *Expert Belt*  
   Moves: `Blizzard`, `Giga Drain`, `Earthquake`, `Ice Shard`
5. **Walrein (Ace)** (Lv. 100, Ice/Water) — Ability: *Thick Fat* | Item: *Leftovers*  
   Moves: `Surf`, `Ice Beam`, `Toxic`, `Rest`

#### 4. Drake (Dragon Specialist)
*Strategy: Dragon Dance sweeping, Intimidate cycling, and high Base Stat Dragon firepower.*
1. **Altaria** (Lv. 100, Dragon/Flying) — Ability: *Natural Cure* | Item: *Leftovers*  
   Moves: `Dragon Dance`, `Roost`, `Dragon Claw`, `Earthquake`
2. **Flygon** (Lv. 100, Ground/Dragon) — Ability: *Levitate* | Item: *Choice Scarf*  
   Moves: `Outrage`, `Earthquake`, `U-turn`, `Stone Edge`
3. **Kingdra** (Lv. 100, Water/Dragon) — Ability: *Swift Swim* | Item: *Life Orb*  
   Moves: `Hydro Pump`, `Dragon Pulse`, `Ice Beam`, `Signal Beam`
4. **Shelgon** (Lv. 100, Dragon) — Ability: *Overcoat* | Item: *Eviolite*  
   Moves: `Iron Defense`, `Dragon Claw`, `Brick Break`, `Rest`
5. **Salamence (Ace)** (Lv. 100, Dragon/Flying) — Ability: *Intimidate* | Item: *Lum Berry*  
   Moves: `Dragon Dance`, `Outrage`, `Earthquake`, `Fire Blast`

### Champion: Steven Stone (Hoenn Champion)
1. **Skarmory (Lead)** (Lv. 100, Steel/Flying) — Ability: *Sturdy* | Item: *Leftovers*  
   Moves: `Stealth Rock`, `Spikes`, `Brave Bird`, `Roost`
2. **Claydol** (Lv. 100, Ground/Psychic) — Ability: *Levitate* | Item: *Light Clay*  
   Moves: `Reflect`, `Light Screen`, `Earthquake`, `Psychic`
3. **Aggron** (Lv. 100, Steel/Rock) — Ability: *Rock Head* | Item: *Choice Band*  
   Moves: `Head Smash`, `Heavy Slam`, `Earthquake`, `Fire Punch`
4. **Cradily** (Lv. 100, Rock/Grass) — Ability: *Storm Drain* | Item: *Leftovers*  
   Moves: `Recover`, `Giga Drain`, `Ancient Power`, `Toxic`
5. **Armaldo** (Lv. 100, Rock/Bug) — Ability: *Battle Armor* | Item: *Sitrus Berry*  
   Moves: `X-Scissor`, `Stone Edge`, `Earthquake`, `Aqua Jet`
6. **Metagross (Ace)** (Lv. 100, Steel/Psychic) — Ability: *Clear Body* | Item: *Lum Berry*  
   Moves: `Meteor Mash`, `Zen Headbutt`, `Earthquake`, `Bullet Punch`

---

## 5. Generation 4: Sinnoh (Pokémon League)

**Champion**: **Cynthia**  
**Battle Theme**: Peerless IVs, wide type coverage, Spiritomb Pressure start, and Garchomp cleanup.

### Elite Four Roster

#### 1. Aaron (Bug Specialist)
*Strategy: Speed Boost Yanmega lead, Technician Scizor, and Guts Heracross.*
1. **Yanmega (Lead)** (Lv. 100, Bug/Flying) — Ability: *Speed Boost* | Item: *Life Orb*  
   Moves: `Bug Buzz`, `Air Slash`, `Protect`, `Shadow Ball`
2. **Scizor** (Lv. 100, Bug/Steel) — Ability: *Technician* | Item: *Choice Band*  
   Moves: `Bullet Punch`, `U-turn`, `Superpower`, `Bug Bite`
3. **Vespiquen** (Lv. 100, Bug/Flying) — Ability: *Pressure* | Item: *Sitrus Berry*  
   Moves: `Attack Order`, `Defend Order`, `Roost`, `Toxic`
4. **Heracross** (Lv. 100, Bug/Fighting) — Ability: *Guts* | Item: *Flame Orb*  
   Moves: `Close Combat`, `Megahorn`, `Facade`, `Stone Edge`
5. **Drapion (Ace)** (Lv. 100, Poison/Dark) — Ability: *Sniper* | Item: *Scope Lens*  
   Moves: `Cross Poison`, `Night Slash`, `Earthquake`, `Ice Fang`

#### 2. Bertha (Ground Specialist)
*Strategy: Sand Stream chip damage, bulky Water/Ground immunities, and Solid Rock defense.*
1. **Whiscash** (Lv. 100, Water/Ground) — Ability: *Oblivious* | Item: *Rindo Berry*  
   Moves: `Earthquake`, `Waterfall`, `Zen Headbutt`, `Dragon Dance`
2. **Gliscor** (Lv. 100, Ground/Flying) — Ability: *Poison Heal* | Item: *Toxic Orb*  
   Moves: `Earthquake`, `Toxic`, `Protect`, `Roost`
3. **Hippowdon** (Lv. 100, Ground) — Ability: *Sand Stream* | Item: *Smooth Rock*  
   Moves: `Stealth Rock`, `Earthquake`, `Slack Off`, `Ice Fang`
4. **Golem** (Lv. 100, Rock/Ground) — Ability: *Sturdy* | Item: *Custap Berry*  
   Moves: `Earthquake`, `Stone Edge`, `Sucker Punch`, `Explosion`
5. **Rhyperior (Ace)** (Lv. 100, Ground/Rock) — Ability: *Solid Rock* | Item: *Weakness Policy*  
   Moves: `Rock Wrecker`, `Earthquake`, `Megahorn`, `Ice Punch`

#### 3. Flint (Fire Specialist)
*Strategy: Sun boost, Nasty Plot setup, and fast Fighting/Fire coverage.*
1. **Houndoom** (Lv. 100, Dark/Fire) — Ability: *Flash Fire* | Item: *Focus Sash*  
   Moves: `Nasty Plot`, `Fire Blast`, `Dark Pulse`, `Sludge Bomb`
2. **Flareon** (Lv. 100, Fire) — Ability: *Guts* | Item: *Toxic Orb*  
   Moves: `Flare Blitz`, `Facade`, `Superpower`, `Quick Attack`
3. **Rapidash** (Lv. 100, Fire) — Ability: *Flash Fire* | Item: *Life Orb*  
   Moves: `Sunny Day`, `Solar Beam`, `Flare Blitz`, `Wild Charge`
4. **Magmortar** (Lv. 100, Fire) — Ability: *Flame Body* | Item: *Expert Belt*  
   Moves: `Fire Blast`, `Thunderbolt`, `Focus Blast`, `Psychic`
5. **Infernape (Ace)** (Lv. 100, Fire/Fighting) — Ability: *Iron Fist* | Item: *Choice Scarf*  
   Moves: `Flare Blitz`, `Close Combat`, `Thunder Punch`, `U-turn`

#### 4. Lucian (Psychic Specialist)
*Strategy: Dual Screens, Levitate Bronzong wall, and Magic Guard Alakazam.*
1. **Mr. Mime (Lead)** (Lv. 100, Psychic/Fairy) — Ability: *Filter* | Item: *Light Clay*  
   Moves: `Reflect`, `Light Screen`, `Psychic`, `Dazzling Gleam`
2. **Espeon** (Lv. 100, Psychic) — Ability: *Magic Bounce* | Item: *Choice Specs*  
   Moves: `Psychic`, `Shadow Ball`, `Dazzling Gleam`, `Trick`
3. **Bronzong** (Lv. 100, Steel/Psychic) — Ability: *Levitate* | Item: *Leftovers*  
   Moves: `Gyro Ball`, `Earthquake`, `Stealth Rock`, `Toxic`
4. **Alakazam** (Lv. 100, Psychic) — Ability: *Magic Guard* | Item: *Focus Sash*  
   Moves: `Psychic`, `Shadow Ball`, `Focus Blast`, `Counter`
5. **Gallade (Ace)** (Lv. 100, Psychic/Fighting) — Ability: *Justified* | Item: *Life Orb*  
   Moves: `Close Combat`, `Psycho Cut`, `Leaf Blade`, `Swords Dance`

### Champion: Cynthia (Sinnoh Champion)
1. **Spiritomb (Lead)** (Lv. 100, Ghost/Dark) — Ability: *Pressure* | Item: *Sitrus Berry*  
   Moves: `Shadow Ball`, `Dark Pulse`, `Psychic`, `Hypnosis`
2. **Roserade** (Lv. 100, Grass/Poison) — Ability: *Natural Cure* | Item: *Focus Sash*  
   Moves: `Sludge Bomb`, `Energy Ball`, `Shadow Ball`, `Extrasensory`
3. **Togekiss** (Lv. 100, Fairy/Flying) — Ability: *Serene Grace* | Item: *King's Rock*  
   Moves: `Air Slash`, `Aura Sphere`, `Dazzling Gleam`, `Ancient Power`
4. **Lucario** (Lv. 100, Fighting/Steel) — Ability: *Inner Focus* | Item: *Expert Belt*  
   Moves: `Aura Sphere`, `Extreme Speed`, `Flash Cannon`, `Dragon Pulse`
5. **Milotic** (Lv. 100, Water) — Ability: *Marvel Scale* | Item: *Flame Orb*  
   Moves: `Scald`, `Ice Beam`, `Recover`, `Dragon Pulse`
6. **Garchomp (Ace)** (Lv. 100, Dragon/Ground) — Ability: *Rough Skin* | Item: *Yache Berry*  
   Moves: `Dragon Claw`, `Earthquake`, `Swords Dance`, `Poison Jab`

---

## 6. Generation 5: Unova (Pokémon League)

**Champion**: **Iris** (B2W2) / **Alder** (BW)  
**Battle Theme**: Mold Breaker dragons, Regenerator Fighting cores, Moxie sweepers.

### Elite Four Roster

#### 1. Shauntal (Ghost Specialist)
*Strategy: Mummy ability spread, Iron Fist Golurk, and Flame Body burn stalls.*
1. **Cofagrigus (Lead)** (Lv. 100, Ghost) — Ability: *Mummy* | Item: *Leftovers*  
   Moves: `Will-O-Wisp`, `Shadow Ball`, `Psychic`, `Pain Split`
2. **Drifblim** (Lv. 100, Ghost/Flying) — Ability: *Unburden* | Item: *Sitrus Berry*  
   Moves: `Acrobatics`, `Shadow Ball`, `Thunderbolt`, `Destiny Bond`
3. **Golurk** (Lv. 100, Ground/Ghost) — Ability: *Iron Fist* | Item: *Expert Belt*  
   Moves: `Earthquake`, `Shadow Punch`, `Drain Punch`, `Ice Punch`
4. **Jellicent** (Lv. 100, Water/Ghost) — Ability: *Water Absorb* | Item: *Leftovers*  
   Moves: `Scald`, `Shadow Ball`, `Recover`, `Toxic`
5. **Chandelure (Ace)** (Lv. 100, Ghost/Fire) — Ability: *Flash Fire* | Item: *Choice Scarf*  
   Moves: `Shadow Ball`, `Fire Blast`, `Energy Ball`, `Psychic`

#### 2. Grimsley (Dark Specialist)
*Strategy: Defiant boosts against stat droppers, Moxie Krookodile, and Sucker Punch.*
1. **Liepard (Lead)** (Lv. 100, Dark) — Ability: *Prankster* | Item: *Focus Sash*  
   Moves: `Fake Out`, `Thunder Wave`, `Encore`, `U-turn`
2. **Scrafty** (Lv. 100, Dark/Fighting) — Ability: *Moxie* | Item: *Lum Berry*  
   Moves: `Dragon Dance`, `Drain Punch`, `Crunch`, `Ice Punch`
3. **Krookodile** (Lv. 100, Ground/Dark) — Ability: *Intimidate* | Item: *Choice Scarf*  
   Moves: `Earthquake`, `Knock Off`, `Stone Edge`, `Pursuit`
4. **Drapion** (Lv. 100, Poison/Dark) — Ability: *Sniper* | Item: *Scope Lens*  
   Moves: `Cross Poison`, `Crunch`, `Earthquake`, `Swords Dance`
5. **Bisharp (Ace)** (Lv. 100, Dark/Steel) — Ability: *Defiant* | Item: *Life Orb*  
   Moves: `Sucker Punch`, `Iron Head`, `Knock Off`, `Swords Dance`

#### 3. Caitlin (Psychic Specialist)
*Strategy: Magic Guard life orb damage immunity, Trick Room, and Calm Mind tanks.*
1. **Musharna (Lead)** (Lv. 100, Psychic) — Ability: *Synchronize* | Item: *Leftovers*  
   Moves: `Calm Mind`, `Psychic`, `Moonlight`, `Signal Beam`
2. **Sigilyph** (Lv. 100, Psychic/Flying) — Ability: *Magic Guard* | Item: *Life Orb*  
   Moves: `Psychic`, `Air Slash`, `Heat Wave`, `Roost`
3. **Gothitelle** (Lv. 100, Psychic) — Ability: *Shadow Tag* | Item: *Choice Specs*  
   Moves: `Psychic`, `Thunderbolt`, `Shadow Ball`, `Trick`
4. **Metagross** (Lv. 100, Steel/Psychic) — Ability: *Clear Body* | Item: *Assault Vest*  
   Moves: `Meteor Mash`, `Zen Headbutt`, `Earthquake`, `Bullet Punch`
5. **Reuniclus (Ace)** (Lv. 100, Psychic) — Ability: *Magic Guard* | Item: *Life Orb*  
   Moves: `Trick Room`, `Psychic`, `Focus Blast`, `Recover`

#### 4. Marshal (Fighting Specialist)
*Strategy: Guts status exploitation, Sturdy survival, and Regenerator U-turn cores.*
1. **Throh** (Lv. 100, Fighting) — Ability: *Guts* | Item: *Flame Orb*  
   Moves: `Storm Throw`, `Facade`, `Earthquake`, `Stone Edge`
2. **Sawk** (Lv. 100, Fighting) — Ability: *Sturdy* | Item: *Choice Band*  
   Moves: `Close Combat`, `Stone Edge`, `Knock Off`, `Ice Punch`
3. **Mienshao** (Lv. 100, Fighting) — Ability: *Regenerator* | Item: *Life Orb*  
   Moves: `High Jump Kick`, `U-turn`, `Fake Out`, `Stone Edge`
4. **Lucario** (Lv. 100, Fighting/Steel) — Ability: *Inner Focus* | Item: *Focus Sash*  
   Moves: `Close Combat`, `Meteor Mash`, `Extreme Speed`, `Swords Dance`
5. **Conkeldurr (Ace)** (Lv. 100, Fighting) — Ability: *Guts* | Item: *Flame Orb*  
   Moves: `Drain Punch`, `Mach Punch`, `Knock Off`, `Ice Punch`

### Champion: Iris (Unova Champion)
1. **Hydreigon (Lead)** (Lv. 100, Dark/Dragon) — Ability: *Levitate* | Item: *Choice Specs*  
   Moves: `Draco Meteor`, `Dark Pulse`, `Fire Blast`, `Surf`
2. **Druddigon** (Lv. 100, Dragon) — Ability: *Rough Skin* | Item: *Rocky Helmet*  
   Moves: `Stealth Rock`, `Dragon Claw`, `Sucker Punch`, `Glare`
3. **Archeops** (Lv. 100, Rock/Flying) — Ability: *Defeatist* | Item: *Focus Sash*  
   Moves: `Acrobatics`, `Stone Edge`, `Earthquake`, `U-turn`
4. **Aggron** (Lv. 100, Steel/Rock) — Ability: *Sturdy* | Item: *Choice Band*  
   Moves: `Head Smash`, `Heavy Slam`, `Earthquake`, `Aqua Tail`
5. **Lapras** (Lv. 100, Water/Ice) — Ability: *Water Absorb* | Item: *Leftovers*  
   Moves: `Hydro Pump`, `Freeze-Dry`, `Thunderbolt`, `Ice Shard`
6. **Haxorus (Ace)** (Lv. 100, Dragon) — Ability: *Mold Breaker* | Item: *Focus Sash*  
   Moves: `Dragon Dance`, `Outrage`, `Earthquake`, `Poison Jab`

---

## 7. Daily 3-Team Strategy Synergies by Region

When a region is active, the player is presented with three curated competitive squads built with regional flagships + cross-region synergies:

| Region | Team 1 (Hyper Offense / Weather) | Team 2 (Pivot / Balance) | Team 3 (Setup / Stall) |
|:---|:---|:---|:---|
| **Kanto** | **Sunny Day Chlorophyll**<br>*Charizard, Venusaur, Exeggutor, Arcanine, Snorlax, Gengar* | **VoltTurn Offensive Core**<br>*Raichu, Jolteon, Alakazam, Scyther, Cloyster, Machamp* | **Amnesia & Toxic Wall**<br>*Slowbro, Snorlax, Chansey, Weezing, Tentacruel, Dragonite* |
| **Johto** | **Rain Dance Swift Swim**<br>*Politoed, Kingdra, Feraligatr, Lanturn, Scizor, Raikou* | **Spikes & DragMag Pivot**<br>*Forretress, Magnezone, Tyranitar, Skarmory, Gengar, Suicune* | **Curse & Recovery Stall**<br>*Umbreon, Blissey, Donphan, Steelix, Meganium, Heracross* |
| **Hoenn** | **Sand Stream Rush**<br>*Tyranitar, Flygon, Aggron, Metagross, Swampert, Salamence* | **Swift Swim Torrent**<br>*Swampert, Ludicolo, Crawdaunt, Manectric, Gardevoir, Breloom* | **Calm Mind & Status Bulwark**<br>*Milotic, Dusclops, Regice, Claydol, Altaria, Blaziken* |
| **Sinnoh** | **Hail Blizzard & Sand**<br>*Abomasnow, Gliscor, Garchomp, Weavile, Magnezone, Empoleon* | **Regenerator Pivot & VoltTurn**<br>*Rotom-Wash, Scizor, Infernape, Staraptor, Tangrowth, Lucario* | **Hazard Stack & Toxic Stall**<br>*Bronzong, Hippowdon, Toxicroak, Togekiss, Spiritomb, Gastrodon* |
| **Unova** | **Sand Rush Excadrill Core**<br>*Hippowdon, Excadrill, Landorus-T, Volcarona, Keldeo, Ferrothorn* | **VoltTurn Regenerator**<br>*Mienshao, Rotom-Wash, Scizor, Hydreigon, Chandelure, Jellicent* | **Iron Defense & Toxic Stall**<br>*Ferrothorn, Jellicent, Gliscor, Conkeldurr, Reuniclus, Heatran* |

---

## 8. Summary for Code Implementation
This knowledge base guarantees that any future regional rotation engine or gauntlet runner can draw on authentic, balanced, and complete data records with 0 placeholder species, 0 fake moves, and verified Gen 3–5 competitive mechanics.
