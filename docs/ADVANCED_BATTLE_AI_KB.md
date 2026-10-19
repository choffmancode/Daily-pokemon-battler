# Advanced Opponent Combat AI Knowledge Base
*Architecture & Decision Engine Patterns from Radical Red, Emerald Kaizo, and Competitive Pokémon*

---

## 1. Executive Summary & Objective

In vanilla Pokémon games, AI opponents often act arbitrarily—frequently selecting ineffective status moves on statused targets, attacking with resisted moves, or failing to seize guaranteed knockouts. 

In elite community ROM hacks such as **Radical Red** (powered by the Complete FireRed Upgrade / CFRU AI engine) and **Emerald Kaizo** (SinisterHoodedFigure's enhanced Emerald engine), the AI behaves like an experienced competitive tournament player.

The goal of this Knowledge Base is to document the algorithms, scoring weights, decision trees, and strategic heuristics necessary to elevate Battle Cynthia's combat AI from simple damage-greed to a formidable, champion-caliber opponent.

> **Directive**: *Knowledge Base gathering only. No code development or battle engine modification in this slice.*

---

## 2. Core Architectural Pillars of Rom Hack AI (CFRU / Radical Red / Emerald Kaizo)

The CFRU/Emerald Kaizo AI does not use non-deterministic neural networks or random dice rolls for key decisions. Instead, it relies on a **deterministic, weighted scoring matrix** combined with multi-step lookahead evaluation.

Every available action (the 4 moves + possible bench switches) begins with a baseline score (typically **100 points**). The AI runs a series of evaluation routines that award bonuses or penalties:

```
Final Action = argmax_{action} (BaseScore(100) + ∑ ScoringHeuristics(action))
```

### The 8 Classical AI Heuristic Layers:
1. **Move Validity & Disqualification Filter** (`AI_CHECK_BAD_MOVE`)
2. **Lethal Knockout & Speed Tier Recognition** (`AI_TRY_TO_FAINT`)
3. **Stat Stage & Setup Windows** (`AI_SETUP_SWEEPER`)
4. **Recovery & Sustained Stall Logic** (`AI_RECOVERY`)
5. **Status & Disruption Sequencing** (`AI_STATUS_DISRUPTION`)
6. **Entry Hazards & Field Control** (`AI_HAZARDS`)
7. **Pivot & Momentum Management** (`AI_PIVOT_VOLTTURN`)
8. **Smart Bench Replacement & Revenge Killing** (`AI_REVENGE_SWITCH`)

---

## 3. Deep Dive: Layer-by-Layer Decision Logic

### Layer 1: Move Validity & Disqualification (Hard Invalidation)
Before any tactical scoring, any move that cannot have an effect is penalized to **0 points** (or disqualified):
- **Type Immunities**:
  - Ground moves vs. Flying types or Pokémon with `Levitate` $\to$ **Score: 0**.
  - Normal / Fighting moves vs. Ghost types $\to$ **Score: 0**.
  - Psychic moves vs. Dark types $\to$ **Score: 0**.
  - Electric moves vs. Ground types $\to$ **Score: 0**.
  - Poison moves vs. Steel types $\to$ **Score: 0**.
  - Ghost moves vs. Normal types $\to$ **Score: 0**.
- **Status Redundancy**:
  - Sleep move (`Hypnosis`, `Sleep Powder`, `Spore`) if target already has any major status condition, or is behind a `Substitute` $\to$ **Score: 0**.
  - Toxic / Will-O-Wisp / Thunder Wave if target already has status or is immune (e.g. Fire cannot be burned, Electric cannot be paralyzed, Poison/Steel cannot be poisoned) $\to$ **Score: 0**.
- **Stat Stage Saturation**:
  - Stat-boosting move if the corresponding stat is already at $+6$ $\to$ **Score: 0**.
  - Stat-lowering move if target's stat is already at $-6$, or target possesses `Clear Body`, `White Smoke`, or `Mist` $\to$ **Score: 0**.
- **Diminishing Move Redundancy**:
  - `Substitute` if user already has an active Substitute, or user HP $\le 25\%$ $\to$ **Score: 0**.
  - `Protect` / `Detect` if used successfully on the immediately preceding turn $\to$ heavy penalty (due to $50\%$ failure rate).

---

### Layer 2: Lethal Knockouts & Speed Tier Evaluation (`AI_TRY_TO_FAINT`)
In Radical Red, the AI calculates both the **minimum damage roll** ($85\%$) and **maximum damage roll** ($100\%$) for all offensive moves against the player's current HP.

1. **Guaranteed Lethal (Min Roll $\ge$ Player HP)**:
   - If user outspeeds the player: **Score +30 points** (prioritize 100% accurate guaranteed kill).
   - If user is slower than the player:
     - Check if player can OHKO the AI.
     - If player can OHKO the AI, check for available **Priority Moves** (`Extreme Speed`, `Bullet Punch`, `Mach Punch`, `Aqua Jet`, `Ice Shard`, `Sucker Punch`). If priority move kills: **Score +35 points**.
2. **Probabilistic Lethal (Max Roll $\ge$ Player HP > Min Roll)**:
   - Score +18 points.
3. **Accuracy Risk Weighting**:
   - If two moves both achieve a guaranteed lethal KO (e.g., `Aura Sphere` with 100% accuracy vs `Focus Blast` with 70% accuracy), the 100% accurate move receives an extra **+10 point bonus**. The AI never gambles on a 70% accuracy move if a reliable move already secures the KO.

---

### Layer 3: Setup Windows & Sweeper Heuristics (`AI_SETUP_SWEEPER`)
One of the hallmarks of Radical Red is opponents setting up `Swords Dance`, `Dragon Dance`, `Nasty Plot`, or `Calm Mind` at the exact moment the player cannot punish them.

The AI will seek a setup turn **ONLY** when all four of the following conditions are met:
1. **Safety Window**:
   - The player's strongest predicted move deals $< 40\%$ of the AI's current HP.
   - Or the player is asleep, recharging, locked into an ineffective move, or forced to switch.
2. **Health Threshold**:
   - AI current HP is $> 65\%$.
3. **Stat Stage Room**:
   - AI currently has $< +2$ (or $< +4$) in the relevant attack/special attack stat.
4. **Not Already Lethal**:
   - If the AI already has an existing move that KOs the player right now, **do NOT set up**—take the kill immediately!

*Score Bonus*: When the setup window is valid, setup moves receive **+20 points**, taking precedence over non-lethal chip damage.

---

### Layer 4: Recovery & Sustained Stall Logic (`AI_RECOVERY`)
Moves: `Recover`, `Slack Off`, `Roost`, `Soft-Boiled`, `Synthesis`, `Moonlight`, `Wish`, `Rest` (with Chesto Berry).

In Emerald Kaizo and Radical Red, defensive Pokémon (like Milotic, Blissey, Dusclops, Skarmory) execute recovery with precise arithmetic:
- **Overheal Penalty**: If AI HP is $> 70\%$ $\to$ **Score: 0** (do not waste turns healing full HP).
- **Sweet Spot**: If AI HP is between $25\%$ and $50\%$:
  - Calculate player's maximum damage.
  - If player max damage $< 50\%$ of AI max HP (meaning recovery net-heals more than the player can inflict): **Score +25 points**.
- **Danger Zone**: If AI HP $< 25\%$ and player outspeeds and KOs:
  - Do not use recovery (it will fail to prevent fainting). Instead, fire off the strongest offensive attack or priority move before going down.

---

### Layer 5: Status, Disruption & Speed Control (`AI_STATUS_DISRUPTION`)
In competitive Pokémon, status conditions are deployed strategically to neutralize specific threats:
- **Thunder Wave / Glare**:
  - Check speed tiers. If the player is currently faster than the AI and not Ground/Electric type: **Score +18 points** (restores speed advantage).
- **Will-O-Wisp**:
  - Target has high physical Attack or is a physical setup threat (e.g., Garchomp, Tyranitar, Scizor, Gyarados) and is not Fire type: **Score +20 points**.
- **Toxic**:
  - Target is a bulky wall/tank (HP $> 300$, high defenses like Milotic, Blissey, Umbreon, Slowbro) and battle is in early/mid game: **Score +16 points**.
- **Taunt**:
  - Used turn 1 or against suspected hazard setters/status users: prevents setup.

---

### Layer 6: Entry Hazards & Field Control (`AI_HAZARDS`)
Moves: `Stealth Rock`, `Spikes`, `Toxic Spikes`, `Sticky Web`.
- **Early-Game Priority**:
  - If player side does not have `Stealth Rock`, and player has $\ge 3$ conscious bench Pokémon:
    - On Turn 1 or 2: **Score +15 points**.
- **Late-Game Penalty**:
  - If player has $\le 1$ Pokémon left, entry hazards drop to **0 points** (useless when no further switching is possible).

---

### Layer 7: Pivot & Momentum Management (`AI_PIVOT_VOLTTURN`)
Moves: `U-turn`, `Volt Switch`, `Flip Turn`, `Parting Shot`, `Baton Pass`.
- If the AI faces a bad type matchup or a defensive wall it cannot break, but possesses an advantageous bench teammate:
  - Pivot move deals chip damage and allows a free switch-in: **Score +15 points**.
- `Parting Shot`: Drops player's Attack and Sp. Atk by -1 while safely bringing in an AI sweeper.

---

### Layer 8: Smart Bench Switch & Revenge Killing (`AI_REVENGE_SWITCH`)
When an AI Pokémon faints mid-battle, vanilla games simply send out the next index in the array. Radical Red and Emerald Kaizo evaluate the bench dynamically:

```
For each conscious bench Pokémon:
  1. Can it outspeed the player active mon? (+30)
  2. Does it have an attack that OHKOs the player active mon? (+50)
  3. Does it resist the player active mon's STAB attacks? (+25)
  4. Does it possess an immunity (Levitate, Flash Fire, Water Absorb)? (+35)
  5. Does it have priority that finishes off a weakened player? (+40)
  6. Penalty: Does it take 2x/4x super-effective from player STAB? (-40)
  
Select candidate with highest total score.
```

This guarantees Cynthia will never send Lucario into a player's active Fire-type, but will instead send out Milotic or Garchomp.

---

## 4. Cynthia's Champion-Specific Persona Matrix

Cynthia is legendary for her balanced team synergy and aggressive, calculated playstyle. Her AI profile should embody her canonical tactics:

| Pokémon | Strategic Role | AI Behavioral Directives |
|:---|:---|:---|
| **Spiritomb** (Lead) | Disruption & Pressure | • Turn 1: Deploy `Hypnosis` / `Will-O-Wisp` if target unstatused.<br>• Use `Spite` / `Pressure` chip.<br>• No weaknesses in Gen 3: stays in against neutral matchups. |
| **Roserade** | Special Coverage | • Exploits Water/Ground/Rock weaknesses.<br>• Drops `Sludge Bomb` on Grass/Fairy.<br>• Switches out if threatened by Fire/Flying. |
| **Togekiss** | Serene Grace Flinch | • `Air Slash` (60% flinch rate) prioritized when outspeeding.<br>• `Aura Sphere` for guaranteed Steel/Rock coverage.<br>• Uses `Thunder Wave` to guarantee speed advantage for flinches. |
| **Lucario** | Fast Physical/Mixed Sweeper | • High priority on `Extreme Speed` for targets $< 30\%$ HP.<br>• Sets up `Swords Dance` if facing a passive wall.<br>• Deploys `Close Combat` for high burst damage. |
| **Milotic** | Marvel Scale Physical Tank | • Uses `Recover` whenever HP drops below $50\%$ against non-electric threats.<br>• `Scald` burn fishing against physical attackers.<br>• Absorbs status to activate Marvel Scale (+50% Defense). |
| **Garchomp** (Ace) | Finisher / Sweeper | • Reserved for mid/late game (sent in when player is softened).<br>• `Swords Dance` if player cannot OHKO with Ice Beam (protected by `Yache Berry`).<br>• Sweeps with `Outrage` and `Earthquake`. |

---

## 5. Proposed Evaluation Pipeline for `battleEngine.ts`

When ready to implement, `selectAIMoveOrSwitch` will be refactored into a modular pipeline:

```
selectAIMoveOrSwitch(aiMon, playerMon, aiTeam, sideConditions, weather)
 │
 ├── 1. Pre-Turn Invalidation Filter (0 out invalid moves: immunities, status on statused, +6 stats)
 ├── 2. Lethal Damage Calculation (Check for 100% and 85% KO thresholds across all moves)
 ├── 3. Speed Tier Check (Compare effective speed; factor in priority moves if slower)
 ├── 4. Setup Evaluation (Check HP > 65%, low player threat, room for +2 boost)
 ├── 5. Recovery Evaluation (Check HP 25-50%, player threat < heal amount)
 ├── 6. Hazard & Status Evaluation (Early game Stealth Rock, Will-O-Wisp / T-Wave utility)
 ├── 7. Score Aggregation (Sum heuristic points; pick highest scoring action)
 └── 8. Hard Switch / Pivot Fallback (If active is completely walled and bench has hard counter)
```

---

## 6. Verification & Adherence Notice
- **File**: `docs/ADVANCED_BATTLE_AI_KB.md` has been written and saved to the repository docs directory.
- **Rules Followed**: No code has been modified or implemented in accordance with the user's explicit instructions (*"No development"*).
- **Ready for Review**: This KB serves as the complete technical blueprint for upgrading Cynthia's combat AI when scheduled.
