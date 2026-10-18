# Battle Red — Developer Architecture & Mobile Game Optimization Blueprint

## Executive Summary
This document provides an AI-friendly, developer-ready blueprint for **Battle Red**, detailing the modularized system architecture, centralized 2000s Gen 1-3 Pokémon theme system, mobile performance optimizations, viewport stability guarantees, and nostalgic TCG booster pack mechanics.

---

## 1. Centralized Theme & Styling System (`src/styles/theme.css`)

All CSS rules and design tokens are centralized in `src/styles/theme.css` and imported via `src/index.css`, creating a single source of truth across all views:

| Token / Class | Aesthetic & Purpose |
|---|---|
| `pkmn-frame-dark` | Classic Game Boy Advance dual-line inset dialog & menu frame (deep slate with beveled borders and inner light rim) |
| `pkmn-frame-cream` | Iconic Pokémon FireRed / Emerald cream dialogue prompt window (`"What will PIKACHU do?"`) |
| `pkmn-frame-gold` | Champion & Booster Pack shiny border box with metallic amber trim |
| `pkmn-btn` | Base tactile 3D beveled retro button with active depression (`translateY(3px)`) |
| `pkmn-btn-red` | FireRed / Primary Attack button with crimson shadow |
| `pkmn-btn-blue` | Sapphire / Switch Squad button with navy shadow |
| `pkmn-btn-emerald` | Emerald / Success & Equipped state button |
| `pkmn-btn-gold` | TCG Booster Pack tear & open button with gold foil luster |
| `pkmn-btn-round-a` & `pkmn-btn-round-b` | Circular tactile GBA A & B buttons |
| `pkmn-cursor` | Flashing red arrow cursor `▶` for retro menu item focus |
| `pkmn-battle-arena-standard` | Standard Pokémon Coliseum / GBA Stadium battlefield gradient |
| `pkmn-stadium-lights` | Stadium floodlight cone gradients with realistic depth |
| `pkmn-platform-grass` | Authentic player circular green stadium grass pedestal with dark earth rim |
| `pkmn-platform-opponent` | Authentic opponent circular stadium turf pedestal |
| `camera-shake-stage` | Stage-only subtle tremor (`±3px`), eliminating viewport jumps or resize glitches |
| `pkmn-hp-frame` & `pkmn-hp-tag` | Gen 1-3 HP bar with `HP` badge, segmented health fill, and squad Poké Ball icons |

---

## 2. Viewport Glitch & Refresh Loop Resolution

### Root Cause
Previously, clicking a battle move triggered `screenShake(true)`. In `BattleArena.tsx`, `animate-bounce` was applied to the root full-height container (`<div className="h-[100dvh] ... animate-bounce">`). Tailwind's `animate-bounce` executes a `-25%` vertical translation, which shifted the entire webpage by ~200px. This triggered mobile browser chrome auto-hide/show behaviors, URL bar repositioning, and continuous `resize` event loops that repeatedly re-rendered the application root.

### Resolution
1. **Isolated Stage Tremor**: Removed `animate-bounce` from the root viewport container entirely. Replaced with `.camera-shake-stage`, an inline GPU-accelerated tremor (`transform: translate3d(±3px, ±2px, 0)`) applied **only** to the inner battle stage container.
2. **Debounced Viewport Resizing**: In `useMobileViewport.ts`, window resize listeners are debounced by 100ms and thresholded to only fire state updates when height shifts exceed 40px (e.g. virtual keyboard open/close or device orientation change).
3. **CSS Custom Property Direct Sync**: `--app-height` is synchronized directly onto `document.documentElement.style`, ensuring 100% viewport stability without React re-render cascades.

---

## 3. Nostalgic 2000s Pokémon Vibe & Ken Sugimori Art Selection

1. **Ken Sugimori Official Artwork CDN**:
   - `getOfficialArtworkUrl(dexNumber)` fetches high-resolution Ken Sugimori watercolor wash artwork from PokeAPI:
     `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`
   - Featured in:
     - **Title Screen**: Hero artwork of your squad's lead Pokémon (Pikachu, Charizard, Blastoise, Venusaur, Snorlax, Espeon).
     - **Squad Selector**: Ken Sugimori cards for all 6 squad members across all 5 beginner teams.
     - **Summary Codex**: Official artwork showcase with base stats, abilities, and move sets.
2. **Gen 1-3 Dialogue Prompting**:
   - The battle prompt faithfully reproduces the iconic GBA text: `"What will PIKACHU do?"` with blinking `▶` cursor in a cream/white dialogue box.
   - When fainting, prompts switch immediately to `"Select another Pokémon to send into battle!"`
3. **Standard Battle Field**:
   - Features standard stadium arena floodlights and authentic 3D-angled grass and turf pedestals under each Pokémon.

---

## 4. TCG Booster Pack Experience & Tactile Buttons

The booster pack opening flow has been upgraded with clear, tactile buttons:
- **`TEAR & OPEN PACK [A]`**: Primary gold button with tactile press and foil tearing sound/animation.
- **`CLAIM FREE DAILY PACK`**: Emerald button that pulses when daily packs refresh.
- **`FREE PASS: OPEN NOW`**: Unlimited instant-open option for testing and free play.
- **`REVEAL ALL CARDS`**: One-tap quick reveal for opening cards without flipping each individually.
- **`ADMIN: FREE OPEN`**: Instant bypass button always available in the card reveal carousel.
- **`EQUIP ITEM [A]`**: Clear one-tap button on revealed cards and wardrobe items.

---

## 5. Modular File Directory Map

```
src/
├── styles/
│   └── theme.css                 <-- Centralized design tokens & GBA styles
├── components/
│   ├── TitleScreen.tsx           <-- 2000s GBA title, Ken Sugimori lead art, A/B buttons
│   ├── BattleArena.tsx           <-- Stable 100dvh arena, standard stadium BG, cream dialog
│   ├── GachaPackModal.tsx        <-- Booster pack modal orchestrator
│   ├── PokemonSummaryModal.tsx   <-- Ken Sugimori artwork codex & GBA stat plates
│   ├── TeamSelectorModal.tsx     <-- Squad selector with Ken Sugimori rosters
│   ├── WardrobeModal.tsx         <-- Team-aligned fitting room with live cosmetic rendering
│   ├── AudioEngine.ts            <-- Web Audio retro sound effects
│   ├── common/
│   │   └── Gen3ItemSprite.tsx    <-- Crisp 2D GBA 32x32 vector pixel-art item sprites
│   ├── battle/
│   │   ├── BattleStage.tsx       <-- Standard circular grass/turf pedestals
│   │   ├── BattleCosmetics.tsx   <-- Universal 2D visual gear overlays on Pokémon
│   │   ├── BattleStatPlate.tsx   <-- Gen 1-3 HP box, HP tag, Poké Ball markers
│   │   ├── BattleControls.tsx    <-- 2x2 move grid with PP and effectiveness
│   │   ├── BattleTurnFeed.tsx    <-- Pokémon Showdown combat log
│   │   ├── MoveVFX.tsx           <-- Elemental move VFX animations
│   │   └── BattleGameOverModal.tsx <-- Victory/defeat screen with pkmn-btn styles
│   └── gacha/
│       ├── BoosterPack3D.tsx     <-- 3D foil pack with crimped edges & tear button
│       └── CardRevealCarousel.tsx<-- Reveal All button & Gen 3 sprite cards
├── hooks/
│   ├── useBattle.ts              <-- Combat turn progression & Showdown animation orchestrator
│   └── useMobileViewport.ts      <-- Debounced viewport resize stabilizer (no glitch)
└── index.css                     <-- Imports Tailwind CSS and theme.css
```

---

## 5. Customization & Wardrobe Engine

### A. Non-Overlapping Card Grid & Visual Containment
- Grid uses `grid-cols-1 sm:grid-cols-2 gap-3.5 auto-rows-fr` and `contain: content; isolation: isolate;`.
- Titles and descriptions enforce `line-clamp-2` with dedicated footer rows so buttons and cards never collide or bleed across boundaries.

### B. Dynamic Team Alignment & Live Dressing Room
- `WardrobeModal` ingests `selectedTeam` directly from application state.
- Pokémon tabs display the active squad's species, types, and equipped status.
- Equipped items render in real time on the animated Pokémon sprite in the dressing room via `PokemonCosmeticLayer` and carry through directly into battle!

### C. Deterministic Equip / Unequip Lifecycle
- For Pokémon items, buttons evaluate `isEquippedOnCurrent` against the selected party member.
- Provides immediate 1-click `[EQUIP]`, `[TRANSFER]`, and `[REMOVE / UNEQUIP]` actions.
- Synchronously updates `localStorage` and application state with retro sound effects.

