# Pokémon Battle Simulation Engine — Flow, Turn Lifecycle & Core Rules

## 1. Executive Summary & The Invariant Cardinal Rule

This document serves as the authoritative, invariant specification for the battle engine within this repository. Pokémon battles are strict, deterministic sequential state machines that resolve simultaneous player actions under imperfect information.

> ### ⚠️ The Cardinal Rule of Pokémon Combat
> **A Pokémon that has been knocked out (HP reduced to 0 or fainted) in a turn CANNOT take an action, execute an attack, apply a status effect, or retaliate in that same turn.**
> When Pokémon A outspeeds Pokémon B and lands a knockout blow, Pokémon B's scheduled action is immediately canceled, the fainting sequence resolves, and the turn advances directly to the upkeep/replacement phase. Under no circumstances may a fainted Pokémon animate, deal damage, or attack back.

---

## 2. The 5-Phase Turn Lifecycle

Every battle turn in the engine adheres strictly to the following 5-phase sequence:

```
[Phase 0: Decision & Simultaneous Input Collection]
  ├── P1 sends /choose (move 1-4 or switch 1-6)
  └── P2 / Gemini Agent sends /choose (move 1-4 or switch 1-6)
         │
         ▼
[Phase 1: Hard Switches & Immediate Deploys]
  ├── Hard switches ALWAYS resolve before moves (priority +99)
  ├── Dual-switch sorting: Resolved in descending order of in-battle Effective Speed
  └── Entry hazard damage (Spikes, Stealth Rock) applied immediately upon deployment
         │
         ▼
[Phase 2: Attacks & Move Execution (Sorted by Priority & Effective Speed)]
  ├── Primary Action Sorting: Priority Bracket (+5 down to -7)
  ├── Secondary Action Sorting: In-battle Effective Speed (Base × Stat Stages × Paralysis)
  ├── Speed Tie Tiebreaker: Strict 50/50 pseudorandom coin flip on exact ties
  └── Sequential Participant Execution Loop:
        1. Attacker faint check: If attacker has fainted or currentHp <= 0, CANCEL action.
        2. Target faint check: If defender is already fainted, CANCEL action.
        3. Accuracy & category check: Physical, Special, or Status.
        4. Damage calculation: STAB, Type Effectiveness (0x, 0.25x, 0.5x, 1x, 2x, 4x), Critical Hits (1.5x), Stat Stage Multipliers (-6 to +6).
        5. Immediate Defender HP Drain:
           • defender.currentHp = Math.max(0, defender.currentHp - damage)
           • Emit |-damage| and effectiveness tokens immediately to client
        6. Immediate Faint Evaluation:
           • If defender.currentHp <= 0:
               - defender.currentHp = 0
               - defender.fainted = true
               - Emit |faint| token
               - BREAK execution loop: pending moves for the knocked out Pokémon are permanently canceled
         │
         ▼
[Phase 3: Weather & End-of-Turn Residuals]
  ├── Weather Chip Damage (Hail / Sandstorm):
  │     • Strictly 1/16th (6.25%) max HP chip damage (Gen 3-8 / Mt. Silver standard)
  │     • Ice-type immunity: Ice types take 0 chip damage
  │     • Ability immunity: Magic Guard, Overcoat, Snow Cloak, Ice Body take 0 chip damage
  │     • Fainted check: Fainted Pokémon NEVER take weather damage
  │     • Gen 9 Snow alternative: 0 chip damage, +50% Defense to Ice types
  │     • Emit |-damage|...|[from] Hail and weather status tokens
  ├── Status conditions: Burn (1/16 max HP), Poison (1/8 max HP), Toxic progression
  └── Weather duration decrement (stops after 5 turns unless permanent)
         │
         ▼
[Phase 4: Upkeep & Match Victory Resolution]
  ├── Victory Conditions Check:
  │     • Both teams all fainted -> Match Draw (|tie)
  │     • Opponent team all fainted -> Player Victory (|win|p1)
  │     • Player team all fainted -> Opponent Victory (|win|p2)
  └── Active Replacement Switches:
        • If active Pokémon fainted, prompt for replacement switch (|request| or faint_switch_player phase)
        • AI automatically deploys next available conscious Pokémon
```

---

## 3. Order of Execution & Priority Brackets

### Priority Brackets
Moves execute in descending order of priority, regardless of in-battle Speed:

| Priority | Description | Representative Moves |
|:---:|:---|:---|
| **+5** | Ultra-priority fleeing / switching | `Helping Hand` |
| **+4** | Absolute shields & protection | `Protect`, `Detect`, `Endure` |
| **+3** | First-turn flinch priority | `Fake Out`, `Quick Guard` |
| **+2** | Extreme speed attacks | `Extreme Speed`, `Feint` |
| **+1** | Standard priority strikes | `Aqua Jet`, `Mach Punch`, `Bullet Punch`, `Quick Attack`, `Ice Shard` |
| **0** | Standard attacks & status moves | `Thunderbolt`, `Earthquake`, `Surf`, `Flamethrower`, `Volt Tackle`, `Psychic` |
| **-1** | Delayed strikes | `Vital Throw` |
| **-3** | Focus-charge attacks | `Focus Punch` |
| **-6** | Forced phased switches | `Roar`, `Whirlwind` |
| **-7** | Dimension warping | `Trick Room` |

### Effective Speed Formula
Within the same priority bracket, move sequence is determined by **Effective Speed**:

$$\text{Effective Speed} = \left\lfloor \text{Base Speed} \times \text{Stat Stage Multiplier} \times \text{Status Multiplier} \right\rfloor$$

- **Stat Stages ($-6$ to $+6$)**:
  - Positive stages ($+1$ to $+6$): $\frac{2 + \text{stage}}{2}$ (e.g. $+1 \to 1.5\times$, $+2 \to 2.0\times$)
  - Negative stages ($-1$ to $-6$): $\frac{2}{2 - \text{stage}}$ (e.g. $-1 \to 0.66\times$, $-2 \to 0.5\times$)
- **Paralysis Penalty**:
  - Afflicted Pokémon suffer a $0.5\times$ ($50\%$) speed reduction.
- **Speed Ties**:
  - When effective speeds are identical, the simulator executes a $50/50$ pseudorandom coin flip.

---

## 4. Weather Mechanics & Damage Calibration

### Hail & Sandstorm Calibration
- **Official Gen 3-8 / Showdown OU Standard**:
  - Weather chip damage is strictly **1/16th of maximum HP** (6.25%), rounded down:
    $$\text{Hail Damage} = \max\left(1, \left\lfloor \frac{\text{Max HP}}{16} \right\rfloor\right)$$
- **Immunity Invariants**:
  1. Any Pokémon whose HP is $\le 0$ or whose `fainted` flag is true is completely immune to weather chip damage.
  2. Ice-type Pokémon are completely immune to Hail chip damage.
  3. Pokémon with abilities `Magic Guard`, `Overcoat`, `Snow Cloak`, or `Ice Body` take 0 Hail damage.
- **Generation 9 Snow Standard**:
  - In modern Gen 9 (Scarlet/Violet / Showdown Gen 9 OU), Hail is replaced by `Snow`, dealing **0 chip damage** to all Pokémon while boosting the physical Defense of Ice types by $1.5\times$.
- **UI Isolation Rule**:
  - Weather damage MUST NOT be subtracted simultaneously with move impact. It resolves during Phase 3 with its own visual notification and feed log (`The hail buffets...`).

---

## 5. Client-Side Immediate HP Bar Rendering Guarantees

To ensure instant feedback and avoid end-of-turn HP bar clustering:

1. **State Authoritative Playback (`turnMoves`)**:
   - The UI animation pipeline reads directly from `nextState.turnMoves` generated by `executeBattleTurn()`.
   - It NEVER re-simulates turn order, speeds, or priority in React.
2. **Immediate Impact HP Draining**:
   - At the exact frame the attack VFX connects (240ms after windup), the defender's HP bar and numeric display drain immediately to `firstMove.defenderHpRemaining`.
   - The HP bar transition is tuned to `transition-all duration-300 ease-out` for snappy retro GBA feedback.
3. **Faint Short-Circuit**:
   - If `firstMove.defenderFainted` or `firstMove.defenderHpRemaining <= 0`:
     - The defender triggers `anim-faint-sink` immediately.
     - The counter-attack is NEVER queued or animated.
     - After faint sink completes, the replacement switch phase begins.
4. **Counter-Attack Flow**:
   - Only when the defender survives (`firstMove.defenderHpRemaining > 0`) does the second Pokémon execute their counter-attack.
   - The second Pokémon's hit lands, and the attacker's HP bar immediately drains to `secondMove.defenderHpRemaining`.

---

## 6. Comprehensive 6v6 Showdown Protocol Reference Stream

The simulator generates and parses newline-and-pipe (`|`) delimited protocol streams compliant with Pokémon Showdown:

```text
|start
|gen|9
|tier|[Gen 9] OU
|gametype|singles
|player|p1|Agent_Alpha|avatar|1|
|player|p2|Agent_Beta|avatar|2|
|teamsize|p1|6
|teamsize|p2|6
|teampreview

|start
|switch|p1a: Great Tusk|Great Tusk, L100|100/100
|switch|p2a: Glimmora|Glimmora, L100, F|100/100
|-ability|p1a: Great Tusk|Protosynthesis|[silent]

|turn|1
|move|p1a: Great Tusk|Earthquake|p2a: Glimmora
|-supereffective|p2a: Glimmora
|-damage|p2a: Glimmora|0 Faint
|-ability|p2a: Glimmora|Toxic Debris|[from] move: Earthquake
|-sidestart|p1: Agent_Alpha|Spikes
|faint|p2a: Glimmora

|upkeep
|switch|p2a: Dragapult|Dragapult, L100, M|100/100

|turn|2
|switch|p1a: Kingambit|Kingambit, L100, M|100/100
|-damage|p1a: Kingambit|88/100|[from] Spikes
|move|p2a: Dragapult|Draco Meteor|p1a: Kingambit
|-resisted|p1a: Kingambit
|-damage|p1a: Kingambit|64/100
|-unboost|p2a: Dragapult|spa|2

|turn|3
|move|p2a: Dragapult|U-turn|p1a: Kingambit
|-damage|p1a: Kingambit|52/100
|switch|p2a: Great Tusk|Great Tusk, L100|100/100|[from] U-turn
|move|p1a: Kingambit|Kowtow Cleave|p2a: Great Tusk
|-resisted|p2a: Great Tusk
|-damage|p2a: Great Tusk|81/100

|turn|4
|move|p2a: Great Tusk|Close Combat|p1a: Kingambit
|-supereffective|p1a: Kingambit
|-damage|p1a: Kingambit|0 Faint
|-unboost|p2a: Great Tusk|def|1
|-unboost|p2a: Great Tusk|spd|1
|faint|p1a: Kingambit

|upkeep
|switch|p1a: Iron Valiant|Iron Valiant, L100|100/100
|-damage|p1a: Iron Valiant|88/100|[from] Spikes

|turn|5
|move|p1a: Iron Valiant|Moonblast|p2a: Great Tusk
|-supereffective|p2a: Great Tusk
|-damage|p2a: Great Tusk|0 Faint
|faint|p2a: Great Tusk

|win|p1
```

---

## 7. Gemini AI Showdown Agent Architecture (`GeminiBattleAgent`)

The engine provides native support for Gemini LLM agents via `@google/genai` and `gemini-3.8-flash`:

1. **Protocol Request Serialization**:
   - `buildShowdownRequest(state, side)` compiles active Pokémon moves, PP, base stats, and benched squad health into schema-compliant JSON.
2. **Structured Response Schema**:
   - Uses `responseSchema` for guaranteed structured outputs (`actionType: 'move' | 'switch'`, `targetNumber: 1-6`).
3. **Deterministic Heuristic Fallback (`ShowdownHeuristicAgent`)**:
   - Always provides a local, zero-latency fallback calculating STAB multipliers, type matchups, and lethal ranges if API quota or latency boundaries are exceeded.

---

## 8. Verification Invariant Gate

Before committing modifications to battle logic or UI animations, ensure:
- [x] Fast Pokémon knocking out slow Pokémon completely suppresses any retaliation or counter-attack.
- [x] HP bars drain immediately upon attack impact before any secondary move executes.
- [x] Weather chip damage is strictly calibrated to $\frac{1}{16}$th max HP and immune to fainted or Ice Pokémon.
- [x] Dual switches resolve by effective Speed.
- [x] Moves in higher priority brackets outspeed standard moves regardless of base speed.
- [x] All automated unit tests pass: `npx tsx --test src/game/battleEngine.test.ts src/game/showdown/showdownProtocol.test.ts`.
