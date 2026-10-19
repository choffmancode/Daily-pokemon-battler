# Stat Changes & Summary Screen Representation Knowledge Base

## 1. Executive Summary & Objective

This document provides the definitive architectural and UI knowledge base for **in-battle stat stage modifiers** and their visual representation within **Battle Cynthia**.

### Primary Goal
When moves alter stats in battle (e.g., `Swords Dance` raising Attack by +2, `Intimidate` or `Charm` lowering Attack, `Calm Mind` boosting Sp. Atk and Sp. Def by +1):
- The modified stats must be clearly visible and highlighted on the **Pokémon Summary Screen** (`PokemonSummaryModal.tsx`).
- Players must be able to immediately inspect their active Pokémon (or Cynthia's active Pokémon) to see both the **effective numerical stat** and the **stage modifier** (`+2`, `-1`, etc.).
- The visual presentation must strictly obey the **locked GBA palette**, typography, and frame rules.

---

## 2. Gen-3 Emerald Stat Stage Mechanics

In Generation 3 (Pokémon Emerald), in-battle stat modifications are quantified by **Stat Stages** ranging from **$-6$ to $+6$** (clamped).

### A. Primary Battle Stats (Attack, Defense, Sp. Atk, Sp. Def, Speed)
The multiplier formula depends on whether the stage is positive or negative:

$$\text{Multiplier} = \begin{cases} 
\dfrac{2 + \text{stage}}{2} & \text{if } \text{stage} \ge 0 \\
\dfrac{2}{2 - \text{stage}} & \text{if } \text{stage} < 0 
\end{cases}$$

| Stage | Multiplier | Exact Decimal | Example (Base 100 Stat) | Example (Base 130 Attack) |
|:---:|:---:|:---:|:---:|:---:|
| **+6** | $8 / 2$ | **4.0×** | 400 | 520 |
| **+5** | $7 / 2$ | **3.5×** | 350 | 455 |
| **+4** | $6 / 2$ | **3.0×** | 300 | 390 |
| **+3** | $5 / 2$ | **2.5×** | 250 | 325 |
| **+2** (e.g., Swords Dance, Nasty Plot) | $4 / 2$ | **2.0×** | 200 | 260 |
| **+1** (e.g., Dragon Dance, Calm Mind) | $3 / 2$ | **1.5×** | 150 | 195 |
| **0** (Neutral) | $2 / 2$ | **1.0×** | 100 | 130 |
| **-1** (e.g., Intimidate, Screech, Sticky Web) | $2 / 3$ | **~0.67×** | 66 | 86 |
| **-2** (e.g., Screech, Metal Sound, Overheat) | $2 / 4$ | **0.50×** | 50 | 65 |
| **-3** | $2 / 5$ | **0.40×** | 40 | 52 |
| **-4** | $2 / 6$ | **~0.33×** | 33 | 43 |
| **-5** | $2 / 7$ | **~0.29×** | 28 | 37 |
| **-6** | $2 / 8$ | **0.25×** | 25 | 32 |

### B. Secondary Battle Modifiers (Accuracy & Evasion)
Accuracy and Evasion use a base denominator of 3 instead of 2:
- **Positive Stages ($+1$ to $+6$)**: $\dfrac{3 + \text{stage}}{3}$ ($+1 \to 1.33\times, +2 \to 1.67\times, \dots, +6 \to 3.0\times$)
- **Negative Stages ($-1$ to $-6$)**: $\dfrac{3}{3 - \text{stage}}$ ($-1 \to 0.75\times, -2 \to 0.60\times, \dots, -6 \to 0.33\times$)

### C. Persistent Status Interactions with In-Battle Stats
- **Paralysis**: Halves the Pokémon's effective Speed ($0.5\times$) after all Speed stage modifiers are calculated (`calculateEffectiveSpeed`).
- **Burn**: Halves the Pokémon's physical damage output in damage calculation ($0.5\times$ physical power in Gen 3).

### D. Volatile Reset & Baton Pass Rules
- **Switching Out**: When a Pokémon is withdrawn, its volatile stat stages reset to 0 unless switched via `Baton Pass`.
- **Baton Pass**: Retains all positive and negative stat stage modifiers and transfers them directly to the incoming switch-in.
- **Fainting**: When a Pokémon faints, all stat stages reset to 0 immediately. Bench Pokémon not currently active always have 0 stat stages.

---

## 3. Current Engine State vs Summary UI Gap

### What the Engine Already Implements:
In `src/game/battleEngine.ts`:
1. `Pokemon.statStages`: Each Pokémon holds an object with `{ attack, defense, spAtk, spDef, speed, accuracy, evasion }`.
2. `applyStatStageChange(mon, stat, delta)`: Clamps stage adjustments between $-6$ and $+6$.
3. `calculateEffectiveStat(mon, stat)`: Computes $\lfloor \text{base} \times \text{multiplier} \rfloor$ considering stage and paralysis.
4. `Baton Pass` transfer logic: Copies `target.statStages = { ...playerMon.statStages }`.
5. Action queue and turn logs: Accurately logs `"[Mon]'s Attack rose sharply!"` or `"[Mon]'s Defense fell!"`.

### The Visual Gap in `PokemonSummaryModal.tsx`:
Currently in `src/components/PokemonSummaryModal.tsx` (lines 228–247):
```tsx
{[
  { label: 'HP', val: currentMon.baseStats.hp },
  { label: 'ATTACK', val: currentMon.baseStats.attack },
  { label: 'DEFENSE', val: currentMon.baseStats.defense },
  { label: 'SP. ATK', val: currentMon.baseStats.spAtk },
  { label: 'SP. DEF', val: currentMon.baseStats.spDef },
  { label: 'SPEED', val: currentMon.baseStats.speed },
].map((stat) => (
  <div key={stat.label} className="bg-[#d0e4b0] border border-[#306850] p-1.5 flex flex-col justify-between">
    <span className="font-pixel text-[6.5px] text-[#306850]">{stat.label}</span>
    <span className="gba-title-text text-[12px] font-bold text-[#081820] mt-0.5">
      {stat.val}
    </span>
  </div>
))}
```
- **Issue**: The summary screen only reads `currentMon.baseStats[stat]`.
- **Consequence**: When Garchomp uses `Swords Dance` (+2 Attack), the player opens the summary modal and still sees `ATTACK 130` instead of the boosted in-battle value `260` or the stage badge `[+2]`.

---

## 4. UI Design Specification (Locked GBA Aesthetic)

The summary screen must clearly reflect active stat boosts while respecting the **5-color palette** and **retro pixelated aesthetic**:
- Deep background: `#081820`
- Dark green / frames: `#306850`
- Light green / accents: `#88c070`
- Cream / highlights: `#e0f8d0`
- Accent red / warnings: `#a84040`

### A. Stat Card Layout Matrix (3 Columns × 2 Rows)
The 6 stats are displayed in the standard GBA grid:
1. `HP`: Fixed max/current HP (HP has no stage multiplier).
2. `ATTACK`: Boosted/dropped by moves like Swords Dance, Dragon Dance, Charm, Intimidate.
3. `DEFENSE`: Boosted/dropped by Iron Defense, Acid Armor, Screech.
4. `SP. ATK`: Boosted/dropped by Nasty Plot, Calm Mind, Overheat.
5. `SP. DEF`: Boosted/dropped by Calm Mind, Amnesia, Metal Sound.
6. `SPEED`: Boosted/dropped by Agility, Dragon Dance, Scary Face, Sticky Web, Paralysis.

### B. Visual State Tokens for Each Stat Box

| State | Stage Value | Value Color | Badge / Indicator | Box Background & Border |
|:---|:---:|:---:|:---:|:---|
| **Neutral** | `0` | `#081820` (Dark) | None | Normal cream `#d0e4b0`, border `#306850` |
| **Boosted** | `+1` to `+6` | `#183828` (Bold Dark Green) | `▲+N` badge in `#306850` with `#e0f8d0` text | High-contrast light green tile `#c8e8a8` with double border `#306850` |
| **Reduced** | `-1` to `-6` | `#a84040` (Accent Red) | `▼-N` badge in `#a84040` with `#e0f8d0` text | Warning cream tile `#f0d8d0` with accent red border `#a84040` |
| **Paralyzed** (Speed) | Any | `#a84040` or `#e88840` | `PRZ (1/2)` badge | Warning tile with amber/red border |

### C. Visual Mockup of Stat Box Content

#### 1. Neutral Example (Defense with 0 stages):
```
+--------------------------+
| DEFENSE                  |
| 95                       |
| (Base: 95)               |
+--------------------------+
```

#### 2. Boosted Example (Attack after Swords Dance, +2 stages):
```
+--------------------------+
| ATTACK             ▲ +2  |
| 260                      |
| (Base: 130 × 2.0)        |
+--------------------------+
```

#### 3. Lowered Example (Speed after Sticky Web, -1 stage):
```
+--------------------------+
| SPEED              ▼ -1  |
| 68                       |
| (Base: 102 × 0.67)       |
+--------------------------+
```

### D. Accuracy & Evasion Display (Optional Bonus Row)
If accuracy or evasion is modified (e.g., from `Sand Attack` or `Double Team`), a compact secondary row can appear beneath the 6 core stats:
```
+-------------------------------------------------------------+
| ACCURACY: ▼ -1 (75%)   |   EVASION: -- (100%)              |
+-------------------------------------------------------------+
```

---

## 5. Implementation Architecture Plan (For Future Coding Slice)

When approved for implementation, the following changes will be made:

### Step 1: Create Stat Helper Utility (`src/game/statCalculator.ts`)
A dedicated, pure calculation helper:
```ts
export interface FormattedStatDisplay {
  key: StatKey;
  label: string;
  baseVal: number;
  effectiveVal: number;
  stage: number;
  multiplierText: string;
  isBoosted: boolean;
  isReduced: boolean;
}

export function getPokemonStatDisplayList(mon: Pokemon): FormattedStatDisplay[] {
  // Iterates through attack, defense, spAtk, spDef, speed
  // Returns base, effective (via calculateEffectiveStat), stage, and delta
}
```

### Step 2: Update `PokemonSummaryModal.tsx`
Replace the static `currentMon.baseStats` iteration with the dynamic stat helper:
1. Show the **effective value** in large pixel typography.
2. If `stage > 0`: Render the green `▲ +stage` badge and show the base stat calculation.
3. If `stage < 0`: Render the red `▼ -stage` badge.
4. If `stage === 0`: Render the standard base stat without extra clutter.

### Step 3: Verification & Test Coverage
1. Add unit tests in `src/game/battleEngine.test.ts` or a new `src/game/statDisplay.test.ts`:
   - Verify calculation of effective stats across stages $-6$ to $+6$.
   - Verify that non-active bench Pokémon always display neutral stats (stage 0).
   - Verify that Baton Pass correctly reflects transferred stages in the summary view.
2. Verify that visuals strictly obey the locked GBA palette and don't introduce modern shadows or gradients.

---

## 6. Summary
This knowledge base fully specifies:
- The exact mathematical formulas and multipliers for Gen-3 stat stages.
- How to bridge the current gap where `PokemonSummaryModal` only displays static base stats.
- The authentic GBA UI contract for highlighting boosted/reduced stats with badges, multipliers, and retro color tokens.
- No code has been modified in accordance with the user's explicit directive ("don't implement yet just gather knowledge").
