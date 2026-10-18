# Architecture Decision Records — Battle Cynthia

## ADR-001: Combat Authority & Emerald Fidelity

**Status**: Accepted  
**Date**: 2026-10-18

### Context
The previous codebase contained both a custom battle engine and a Showdown protocol / agent layer. This created ambiguity about which system was the source of truth and led to inconsistent behavior and wasted agent effort.

### Decision
- The custom TypeScript engine in `src/game/battleEngine.ts` is the **single source of truth** for all live battles.
- The engine must implement full Generation 3 Emerald semantics (priority, speed, fainting, weather, Substitute, status, stat stages, secondary effects, etc.).
- Showdown protocol helpers may remain only as pure serialization / logging utilities. They must never drive live battle resolution.
- Visual feedback (HP, status icons, stage changes, action log) must update live as each effect resolves, matching the turn order rules.

### Consequences
- All new battle features and fixes go into the custom engine and its tests.
- Agents are forbidden from creating or reviving a second live battle authority.
- Test coverage for major Emerald interaction branches is mandatory before a change is considered done.

---

## ADR-002: Visual Identity & UI Contract

**Status**: Accepted  
**Date**: 2026-10-18

### Context
The previous UI mixed modern Tailwind patterns with incomplete GBA styling, causing visual drift and repeated agent rework.

### Decision
- All primary screens must follow the locked GBA visual language defined in `AGENTS.md` and `docs/UX_STYLE_GUIDE.md`.
- Color palette, double-lined frames, thumb-zone layout, 2×2 move grid, and action-log placement are non-negotiable.
- Ukiyo-e influence is restricted to a low-opacity outer border treatment only.
- Clean rewrite is preferred over incremental restyling when a screen violates the contract.

### Consequences
- Agents must re-read the visual rules before any UI change.
- Modern glass, shadows, rounded buttons, and non-palette colors are forbidden.

---

## ADR-003: Scope Boundaries

**Status**: Accepted  
**Date**: 2026-10-18

### Decision
- Multiplayer / matchmaking is completely out of scope.
- Cosmetics are secondary personalization only.
- Music is deferred (future original Gen-3-style tracks).
- Official soundtrack rips and ROM embedding are forbidden.
- Standard public Pokémon sprites and species data are allowed and expected.
