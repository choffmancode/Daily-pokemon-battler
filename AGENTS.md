# Battle Cynthia — Repository Conventions & Agent Ledger

## 1. Domain Identity & Theming
- **Project**: Battle Cynthia — Mobile-First Daily Pokémon Champion Battler.
- **Visual Aesthetic**: Game Boy Advance (Gen 3 Pokémon Emerald / FireRed / LeafGreen) authentic retro UI.
  - Locked 5-color GBA palette: `#081820`, `#306850`, `#88c070`, `#e0f8d0`, accent red `#a84040`.
  - Crisp pixelated rendering: `image-rendering: pixelated`, `shape-rendering: crispEdges`.
  - Official Pokémon artwork / sprites for roster and squad displays (standard public sprites, no fake species).
  - Game Boy double-lined dialogue boxes and panels (`gba-frame-dark`, `gba-frame-cream`).
  - Strict `whitespace-nowrap` on badges and strategy tags.
  - Light Ukiyo-e wave texture ONLY on outermost border. Never inside battle area, moves, or HP bars.

## 2. Daily Loop & Battle Fidelity
- **Daily Loop**: Exactly 3 strategy-tagged teams per day → player picks one → chooses lead → battles rotating Cynthia team.
- **Combat Authority**: Custom TypeScript engine (`src/game/battleEngine.ts`) is the SINGLE source of truth for all live battles. Full Gen-3 Emerald semantics required.
- **Turn Flow & Order**:
  1. Hard switches resolve first.
  2. Moves execute sorted by Priority Bracket (+4, +2, +1, 0, -1), then effective Speed ($Stage \times Paralysis$), with 50/50 RNG tiebreak on exact Speed ties.
  3. Fainted Pokémon immediately drop from action queue and cannot move.
  4. HP, status, and residuals update LIVE as each effect resolves (not batched).
  5. Must support weather, Substitute, status conditions, stat stages −6 to +6, secondary effects.
  6. Compact Showdown-style action log always visible, never covering monsters or moves.
  7. Strict 2×2 move grid in thumb zone (bottom 40%). Switch button only (NO Bag button ever).

## 3. Scope Boundaries & Cleanup
- Multiplayer is completely out of scope.
- Cosmetics are secondary personalization only.
- Music is deferred (future original Gen-3 tracks; no official music or ROM embedding).
- No modern glass, shadows, rounded buttons, or non-GBA styling.

## 4. Verification Gate (Definition of Done)
A change is complete only when:
1. Battle tests pass (`npx tsx --test src/game/battleEngine.test.ts` + new tests).
2. Visuals match palette, frames, layout, and asset rules in `docs/UX_STYLE_GUIDE.md`.
3. No modern UI or forbidden assets introduced.
4. Action log, live HP, and faint rules still correct.
5. No deleted systems revived (no multiplayer, no Bag, no competing live battle authority).
