# Battle Red — Repository Conventions & Agent Ledger

## 1. Domain Identity & Theming
- **Project**: Battle Red — Generation 3 Pokémon Showdown Engine & Mini Trainer Sprite Studio.
- **Visual Aesthetic**: Game Boy Advance (Gen 3 Pokémon Emerald / FireRed / LeafGreen) authentic retro UI.
  - Authentic 16-color GBA palette (`#081820`, `#306850`, `#88c070`, `#e0f8d0`, etc.).
  - Crisp pixelated rendering: `image-rendering: pixelated`, `shape-rendering: crispEdges`.
  - Ken Sugimori official artwork for roster and squad lead displays.
  - Game Boy double-lined dialogue boxes (`pkmn-frame-dark`, `pkmn-frame-cream`).
  - No generic modern AI slop, no mismatched UI styles, strict `whitespace-nowrap` on badges.

## 2. Gen 3 Mini Trainer Sprite Engine Standard
- **Resolution**: 16×24 pixel matrix (GBA overworld / battle platform protagonist mini sprites).
- **Layering Order**:
  1. Base silhouette (`brendan_emerald`, `may_emerald`, `brendan_rs`, `may_rs`, `red_fr`, `leaf_lg`).
  2. Shoes & Runners (`trainer_shoes`).
  3. Shirt & Outfit (`trainer_outfit`).
  4. Backpack & Back gear (`trainer_backpack`).
  5. Headwear & Hats (`trainer_head`).
  6. Lapel Badges & Auras (`trainer_badge`, `trainer_aura`).
- **Postures**: `idle` (breathing animation), `commanding` (outstretched battle arm), `cheering` (victory pose).
- **Central Files**: `src/game/data/trainerPixelEngine.ts`, `src/game/data/trainerRegistry.tsx`.

## 3. Battle Simulation & Pokémon Showdown Protocol
- **Turn Flow & Order**:
  1. Input: Simultaneous action choices via Showdown `/choose move N` or `/choose switch N`.
  2. Phase 1: Hard switches resolve first. If both sides switch, order by effective Speed of switching Pokémon.
  3. Phase 2: Moves execute sorted by Priority Bracket (+4, +2, +1, 0, -1), then effective Speed ($Stage \times Paralysis$), with 50/50 RNG tiebreak on exact Speed ties.
  4. Phase 3: Weather (Hailstorm chip damage, Ice type / Magic Guard immunity).
  5. Phase 4: Faint checks, win conditions (`|win|p1`, `|win|p2`, `|tie`).
- **Protocol Emitter & Parser**: `src/game/showdown/showdownProtocol.ts` emits newline-and-pipe (`|`) delimited text streams and `|request|` JSON payloads.
- **AI Agent**: `src/game/showdown/showdownAgent.ts` (`ShowdownHeuristicAgent`) parses request payloads to choose optimal combat moves or defensive switches.

## 4. Token & Workflow Efficiency Rules
- Output only direct solutions, updated code blocks, or concise answers without introductory/concluding pleasantries.
- Use `replace_file_content` targeting small, exact chunks (never rewrite entire files unless new).
- Verification gate: Verify changes with `npx tsx --test src/game/battleEngine.test.ts src/game/showdown/showdownProtocol.test.ts` and `compile_applet`.
