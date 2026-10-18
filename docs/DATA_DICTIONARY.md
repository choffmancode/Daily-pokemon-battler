# Battle Red — Data Dictionary & Schema Reference

> **Purpose**: Single source of truth for all domain models, state interfaces, data catalogs, and formula calculations across the engine.

---

## 1. Domain Entities & Interfaces (`src/game/types.ts`)

### `Pokemon`
Represents an active or benched combatant on Mt. Silver.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g. `'red_pikachu'`, `'user_raichu'`) |
| `species` | `string` | Display species name (e.g. `'Pikachu'`, `'Charizard'`) |
| `nationalDex` | `number` | Pokédex index number for sprite fetching |
| `types` | `PokemonType[]` | Primary & secondary types (e.g. `['Fire', 'Flying']`) |
| `level` | `number` | Always `100` for endgame summit battles |
| `baseStats` | `Record<StatKey, number>` | `{ hp, attack, defense, spAtk, spDef, speed }` |
| `currentHp` | `number` | Dynamic current hit points ($0 \le \text{hp} \le \text{maxHp}$) |
| `maxHp` | `number` | Maximum hit points calculated from base stats |
| `moves` | `Move[]` | 4-move combat movepool |
| `ability` | `string` | Innate passive trait (e.g. `'Static'`, `'Thick Fat'`) |
| `abilityDescription` | `string` | Human-readable explanation of passive trait |
| `statusCondition?` | `StatusCondition` | `'healthy' \| 'paralysis' \| 'burn' \| 'freeze' \| 'sleep' \| 'poison'` |
| `statStages?` | `Record<StatKey, number>` | Temporary combat stage modifiers ($-6 \dots +6$) |
| `fainted` | `boolean` | `true` when current HP hits 0 |
| `spriteFront` | `string` | Animated GIF URL (front view) |
| `spriteBack` | `string` | Animated GIF URL (back view) |
| `equippedCosmetics?` | `string[]` | Cosmetic card IDs equipped to this Pokémon |

---

### `Move`
A tactical action executable in combat.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique ID (e.g. `'volt_tackle'`, `'surf'`) |
| `name` | `string` | Display name (e.g. `'Volt Tackle'`) |
| `type` | `PokemonType` | Elemental type (Normal, Fire, Water, etc.) |
| `category` | `'Physical' \| 'Special' \| 'Status'` | Physical (uses Atk/Def), Special (SpAtk/SpDef), Status (stat/hazard) |
| `power` | `number` | Base move power ($0$ for status moves) |
| `accuracy` | `number` | Hit chance percentage ($1 \dots 100$) |
| `pp` | `number` | Current Power Points remaining |
| `maxPp` | `number` | Maximum Power Points |
| `priority?` | `number` | Turn priority bracket (default `0`, priority moves `+1` or `+2`) |
| `description` | `string` | Tactical description |

---

### `CosmeticItem`
Collectable Gacha card with Ukiyo-e and Art Deco styling.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Item ID (e.g. `'card_red_vintage_cap'`, `'card_hokusai_wave_sash'`) |
| `name` | `string` | Full title with kanji marker |
| `cardNumber` | `string` | Collector set index (e.g. `'001/050'`) |
| `slot` | `CosmeticSlot` | `'trainer_head'`, `'trainer_outfit'`, `'pokemon_gear'`, `'pokemon_aura'`, etc. |
| `slotLabel` | `string` | Readable category label |
| `wearableOn` | `string` | Target wearers (`'Trainer'`, `'All Pokémon'`, or specific mon) |
| `rarity` | `CosmeticRarity` | `'Common' \| 'Rare' \| 'Epic' \| 'Legendary' \| 'Secret Rare'` |
| `description` | `string` | Functional lore & cosmetic description |
| `flavorText` | `string` | Atmospheric narrative quote |
| `kanjiSeal?` | `string` | Traditional Japanese Hanko stamp glyph (`笠`, `冠`, `浪`, `雷`, `炎`, etc.) |
| `ukiyoeStyle?` | `string` | Art style description (`'Nishiki-e Woodblock'`, `'Hokusai Indigo Wave'`, etc.) |
| `imageUrl?` | `string` | PokeAPI sprite asset URL |
| `dropRatePercent` | `number` | Individual roll probability weight |

---

### `BattleState`
Turn-by-turn state machine representation.

```typescript
export interface BattleState {
  turnNumber: number;
  weather: 'Clear' | 'Hail' | 'Rain' | 'Sun';
  weatherTurnsRemaining: number;
  playerActiveIndex: number;
  opponentActiveIndex: number;
  playerTeam: Pokemon[];
  opponentTeam: Pokemon[];
  combatLog: BattleTurnLog[];
  phase: 'intro' | 'action_select' | 'animating' | 'forced_switch' | 'battle_over';
  winner?: 'player' | 'opponent' | null;
}
```

---

## 2. Damage & Combat Calculation Formulas

### A. Core Damage Formula
$$\text{Damage} = \left( \left( \frac{2 \times \text{Level} / 5 + 2}{50} \times \text{Power} \times \frac{A}{D} \right) + 2 \right) \times \text{Weather} \times \text{Critical} \times \text{Random} \times \text{STAB} \times \text{TypeEff}$$

Where:
- $\text{Level} = 100$
- $A$: Attacker's physical `attack` or `spAtk` (adjusted by stat stages)
- $D$: Defender's physical `defense` or `spDef` (adjusted by stat stages)
- $\text{Weather}$: $1.5\times$ for boosted conditions, $0.5\times$ for resisted conditions
- $\text{Critical}$: $1.5\times$ (approx. 1/16 roll)
- $\text{Random}$: Uniform float between $0.85$ and $1.00$
- $\text{STAB}$ (Same Type Attack Bonus): $1.5\times$ if move matches either of attacker's types
- $\text{TypeEff}$: Product of type chart multipliers against defender's dual types ($0\times, 0.25\times, 0.5\times, 1\times, 2\times, 4\times$)

### B. AI Move Selection Heuristic (`selectAIMoveOrSwitch`)
Champion Red evaluates all 4 moves using scoring criteria:
1. **Lethal Priority**: If a move deals $\ge \text{currentHp}$ of player mon, score $+200$.
2. **Type Effectiveness**: Super-effective moves gain $+50$ points per multiplier step.
3. **Accuracy Reliability**: Low-accuracy moves are discounted proportional to $(100 - \text{accuracy})$.
4. **Status Applicability**: Sleep/Paralysis moves are heavily prioritized if player is currently healthy, and ignored if player already has a condition.
