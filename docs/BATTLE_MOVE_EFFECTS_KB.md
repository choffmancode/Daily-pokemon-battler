# Pokémon Battle Move Secondary Effects & Stat-Change Knowledge Base (`MOVE_MECHANICS_KB`)

> **Single Source of Truth**: [`src/game/data/moveMechanicsKB.ts`](../src/game/data/moveMechanicsKB.ts) and [`src/game/battleEngine.ts`](../src/game/battleEngine.ts)

This document catalogs all move secondary effects, percent-chance stat stage changes on attacking moves, self-drawback stat reductions, status infliction rates, flinch chances, recoil/drain ratios, and ability interactions implemented in the **Daily Champion** Gen-3/Gen-4 battle engine.

---

## 1. Attacking Moves — % Chance to Lower Opponent's Stats

When a damaging move hits an active target (and is **not** absorbed by a `Substitute`), the move rolls its secondary effect chance (`rng() * 100 < effectiveChance`).
- **Ability Interaction (`Serene Grace`)**: If the attacker has `Serene Grace` (e.g., Cynthia's **Togekiss**), any secondary effect chance `< 100%` is **doubled**.
- **Ability Interaction (`Clear Body` / `White Smoke` / `Hyper Cutter`)**: If the defender has `Clear Body` (e.g., **Metagross**) or `White Smoke`, opponent-inflicted stat stage drops are completely blocked (`"[Pokemon]'s Clear Body prevents stat loss!"`). `Hyper Cutter` blocks opponent-inflicted `Attack` stage drops.

| Move | Type | Category | Base Power | Secondary Effect Chance | Target Stat Change |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Psychic** | `PSYC` | Special | 90 | **10%** (20% w/ Serene Grace) | Opponent `Sp. Def` **-1** |
| **Shadow Ball** | `GHST` | Special | 80 | **20%** (40% w/ Serene Grace) | Opponent `Sp. Def` **-1** |
| **Energy Ball** | `GRAS` | Special | 90 | **10%** | Opponent `Sp. Def` **-1** |
| **Flash Cannon** | `STEL` | Special | 80 | **10%** | Opponent `Sp. Def` **-1** |
| **Focus Blast** | `FGHT` | Special | 120 | **10%** | Opponent `Sp. Def` **-1** |
| **Earth Power** | `GRND` | Special | 90 | **10%** | Opponent `Sp. Def` **-1** |
| **Bug Buzz** | `BUG` | Special | 90 | **10%** | Opponent `Sp. Def` **-1** |
| **Acid Spray** | `POIS` | Special | 40 | **100%** | Opponent `Sp. Def` **-2** |
| **Crunch** | `DARK` | Physical | 80 | **20%** | Opponent `Defense` **-1** |
| **Iron Tail** | `STEL` | Physical | 100 | **30%** | Opponent `Defense` **-1** |
| **Liquidation** | `WATR` | Physical | 85 | **20%** | Opponent `Defense` **-1** |
| **Rock Smash** | `FGHT` | Physical | 40 | **50%** | Opponent `Defense` **-1** |
| **Moonblast** | `FAIR` | Special | 95 | **30%** | Opponent `Sp. Atk` **-1** |
| **Mist Ball** | `PSYC` | Special | 70 | **50%** | Opponent `Sp. Atk` **-1** |
| **Snarl** | `DARK` | Special | 55 | **100%** | Opponent `Sp. Atk` **-1** |
| **Play Rough** | `FAIR` | Physical | 90 | **10%** | Opponent `Attack` **-1** |
| **Aurora Beam** | `ICE` | Special | 65 | **10%** | Opponent `Attack` **-1** |
| **Icy Wind** | `ICE` | Special | 55 | **100%** | Opponent `Speed` **-1** |
| **Rock Tomb** | `ROCK` | Physical | 60 | **100%** | Opponent `Speed` **-1** |
| **Mud Shot** | `GRND` | Special | 55 | **100%** | Opponent `Speed` **-1** |
| **Bulldoze** | `GRND` | Physical | 60 | **100%** | Opponent `Speed` **-1** |
| **Low Sweep** | `FGHT` | Physical | 65 | **100%** | Opponent `Speed` **-1** |
| **Bubble Beam** | `WATR` | Special | 65 | **10%** | Opponent `Speed` **-1** |

---

## 2. Attacking Moves — % Chance to Raise User's Own Stats

Self-targeted stat boosts on damaging moves can trigger even if the attack hits a `Substitute`.

| Move | Type | Category | Base Power | Secondary Effect Chance | User Stat Change |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Meteor Mash** | `STEL` | Physical | 90 | **20%** (40% w/ Serene Grace) | User `Attack` **+1** |
| **Ancient Power** | `ROCK` | Special | 60 | **10%** (20% w/ Serene Grace) | User `Attack`, `Defense`, `Sp. Atk`, `Sp. Def`, `Speed` **+1** each |
| **Silver Wind** | `BUG` | Special | 60 | **10%** (20% w/ Serene Grace) | User `Attack`, `Defense`, `Sp. Atk`, `Sp. Def`, `Speed` **+1** each |
| **Ominous Wind** | `GHST` | Special | 60 | **10%** (20% w/ Serene Grace) | User `Attack`, `Defense`, `Sp. Atk`, `Sp. Def`, `Speed` **+1** each |
| **Charge Beam** | `ELEC` | Special | 50 | **70%** | User `Sp. Atk` **+1** |
| **Fiery Dance** | `FIRE` | Special | 80 | **50%** | User `Sp. Atk` **+1** |
| **Flame Charge** | `FIRE` | Physical | 50 | **100%** | User `Speed` **+1** |
| **Power-Up Punch** | `FGHT` | Physical | 40 | **100%** | User `Attack` **+1** |
| **Metal Claw** | `STEL` | Physical | 50 | **10%** | User `Attack` **+1** |
| **Steel Wing** | `STEL` | Physical | 70 | **10%** | User `Defense` **+1** |

---

## 3. Attacking Moves — 100% Self Stat Drop Drawbacks on Hit

Drawback moves apply their self stat drops **100% of the time on a successful hit**, even if the target faints from the attack or if the user has `Clear Body` (since `Clear Body` only blocks opponent-inflicted drops).

| Move | Type | Category | Base Power | Trigger Rate | User Stat Penalty |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Close Combat** | `FGHT` | Physical | 120 | **100%** on hit | User `Defense` **-1**, `Sp. Def` **-1** |
| **Superpower** | `FGHT` | Physical | 120 | **100%** on hit | User `Attack` **-1**, `Defense` **-1** |
| **Overheat** | `FIRE` | Special | 130 | **100%** on hit | User `Sp. Atk` **-2** |
| **Draco Meteor** | `DRGN` | Special | 130 | **100%** on hit | User `Sp. Atk` **-2** |
| **Leaf Storm** | `GRAS` | Special | 130 | **100%** on hit | User `Sp. Atk` **-2** |
| **Psycho Boost** | `PSYC` | Special | 140 | **100%** on hit | User `Sp. Atk` **-2** |
| **Hammer Arm** | `FGHT` | Physical | 100 | **100%** on hit | User `Speed` **-1** |

---

## 4. Attacking Moves — % Chance to Inflict Status & Flinch

| Move | Type | Category | Secondary Status / Flinch | Notes & Immunities |
| :--- | :--- | :--- | :--- | :--- |
| **Scald** / **Lava Plume** | `WATR` / `FIRE` | Special | **30% Burn** | Fire-types immune; thaws frozen targets |
| **Flamethrower** / **Fire Blast** / **Fire Punch** / **Heat Wave** | `FIRE` | Special / Phys | **10% Burn** | Fire-types immune; thaws frozen targets |
| **Flare Blitz** | `FIRE` | Physical | **10% Burn** + **33% Recoil** | Fire-types immune to burn |
| **Ice Beam** / **Blizzard** / **Ice Punch** | `ICE` | Special / Phys | **10% Freeze** | Ice-types immune |
| **Ice Fang** | `ICE` | Physical | **10% Freeze** + **10% Flinch** | Independent rolls |
| **Thunderbolt** / **Thunder Punch** | `ELEC` | Special / Phys | **10% Paralysis** | Electric-types & `Limber` immune |
| **Volt Tackle** | `ELEC` | Physical | **10% Paralysis** + **33% Recoil** | Signature Pikachu move |
| **Body Slam** / **Thunder** / **Discharge** / **Spark** | `NORM` / `ELEC` | Phys / Special | **30% Paralysis** | Electric-types & `Limber` immune |
| **Sludge Bomb** / **Poison Jab** / **Gunk Shot** | `POIS` | Special / Phys | **30% Poison** | Poison/Steel-types & `Immunity` immune |
| **Air Slash** / **Icicle Crash** / **Iron Head** / **Rock Slide** | Various | Special / Phys | **30% Flinch** (60% w/ Serene Grace) | Only triggers if attacker moves first; `Inner Focus` immune |
| **Dark Pulse** / **Waterfall** / **Zen Headbutt** | Various | Special / Phys | **20% Flinch** (40% w/ Serene Grace) | Only triggers if attacker moves first; `Inner Focus` immune |
| **Extrasensory** | `PSYC` | Special | **10% Flinch** (20% w/ Serene Grace) | Only triggers if attacker moves first |

---

## 5. Multi-Stat & Single-Stat Setup Status Moves

| Move | Target | Stat Changes Applied |
| :--- | :--- | :--- |
| **Swords Dance** | Self | `Attack` **+2** |
| **Calm Mind** | Self | `Sp. Atk` **+1**, `Sp. Def` **+1** |
| **Dragon Dance** | Self | `Attack` **+1**, `Speed` **+1** |
| **Bulk Up** | Self | `Attack` **+1**, `Defense` **+1** |
| **Nasty Plot** | Self | `Sp. Atk` **+2** |
| **Iron Defense** / **Acid Armor** | Self | `Defense` **+2** |
| **Amnesia** | Self | `Sp. Def` **+2** |
| **Agility** / **Rock Polish** | Self | `Speed` **+2** |
| **Quiver Dance** | Self | `Sp. Atk` **+1**, `Sp. Def` **+1**, `Speed` **+1** |
| **Shell Smash** | Self | `Defense` **-1**, `Sp. Def` **-1**, `Attack` **+2**, `Sp. Atk` **+2**, `Speed` **+2** |
