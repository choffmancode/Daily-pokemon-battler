# Test Strategy & Definition of Done — Battle Cynthia

## Purpose
Ensure the custom battle engine remains faithful to Generation 3 Emerald semantics and that UI changes never break the locked visual or interaction contracts.  
Agents must treat the verification gate as mandatory.

## 1. Required Test Categories (Battle Engine)

### Core Turn Flow
- Priority brackets resolve correctly before Speed
- Effective Speed (stat stages + paralysis) is calculated correctly
- Speed ties use a fair 50/50 resolution
- One side fully resolves its action before the other begins

### Fainting & Action Queue
- A Pokémon that reaches 0 HP mid-turn is immediately removed from the action queue
- A fainted Pokémon never executes its chosen move
- Forced switches after fainting behave correctly

### Live State Updates
- HP changes are applied and observable as each effect resolves (not batched at end of turn)
- Status conditions are applied/removed at the correct timing
- Residual damage (weather, burn, poison, toxic) ticks at the correct point in the turn

### Major Mechanics (must have coverage)
- Weather (Hail, Rain, Sun, Sand) — residuals, immunities, move interactions
- Substitute — creation, damage absorption, status absorption, breaking
- Stat stages (−6 to +6) with correct multipliers for all six stats
- Status conditions (paralysis, burn, poison, toxic, sleep, freeze) and their interactions
- Secondary effects, multi-hit moves, recoil, drain, protection moves
- Switching (player-initiated and forced)

### Edge Cases
- Both sides fainting on the same turn
- Speed ties with priority moves
- Substitute + status moves
- Weather + residual + status interactions

## 2. UI / Integration Checks (manual or lightweight automated)

- Action log remains visible and does not cover monsters or move buttons
- Move grid is strictly 2×2 and stays in the thumb zone
- No Bag button is present
- HP bars and status icons update live
- Visual elements stay within the locked GBA palette and frame rules

## 3. Verification Gate (Definition of Done)

A change is **only complete** when all of the following are true:

1. `npx tsx --test src/game/battleEngine.test.ts` (and any newly added battle tests) pass.
2. New battle mechanics have corresponding tests for the branches they touch.
3. Visual changes match the palette, frame, layout, and asset rules in `AGENTS.md` and `docs/UX_STYLE_GUIDE.md`.
4. No modern UI patterns or forbidden assets have been introduced.
5. No deleted systems (multiplayer, Bag, second live battle authority) have been revived.
6. Action log, live HP updates, and faint rules still behave correctly.

## 4. Agent Instructions

- Before marking any battle or UI task done, run the verification gate.
- Prefer adding focused tests for new branches over large end-to-end snapshots.
- If a required semantic branch is not yet tested, write the test first (TDD) or immediately after the implementation.
- Never weaken or remove existing tests to make a change pass.

## 5. Future Expansion
As the Elite Four mini-run and additional mechanics are added, extend the test categories above rather than creating parallel test philosophies.
