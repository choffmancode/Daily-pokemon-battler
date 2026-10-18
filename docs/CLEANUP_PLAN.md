# Cleanup & Performance Optimization Plan — Battle Cynthia

This plan addresses performance and architectural hygiene across the turn-based battle simulator, sprite customizer, and gacha rewards.

## 1. Diagnostic Discipline
- Profile turns, wardrobe, and gacha with Chrome DevTools Performance & React Profiler.
- Flag long tasks >50ms, unnecessary fiber reconciliations, and layer composite time.

## 2. Core React Architecture
- Reduce commit-phase workload; decouple state stores.
- Use `startTransition` for non-urgent updates (wardrobe filters, card reveals).
- Use `useDeferredValue` for live previews.
- Isolate battle state from wardrobe and gacha state.

## 3. Battle Simulator Optimizations
- `src/game/battleEngine.ts` is the sole live simulation authority.
- Precompute and cache type effectiveness and move damage lookups.
- Only re-render active Pokémon pair and changing status/HP elements.
- Strict 2×2 move grid in thumb zone; no Bag button.

## 4. Sprite Customization Engine
- In-memory LRU caching for `compositeTrainerPixels` and `compilePixelRects`.
- Eliminate inline `JSON.parse(JSON.stringify)` deep cloning.
- Memoize `MiniTrainerSVG` with shallow prop comparison.

## 5. Gacha Pulls & Animations
- Keep particles off the React commit tree.
- Use GPU-accelerated CSS transforms.
- Batch inventory updates.

## 6. Deprecated Systems Purge
- Delete multiplayer roadmap and matchmaking artifacts.
- Prohibit any Bag menu or in-combat inventory button.
- Clean rewrite of legacy modern UI rather than superficial restyling.

## 7. Follow-Up UI State Cleanup Notes
- **Pre-Battle Step Transition (`TeamSelectorModal.tsx`)**: Selecting a different team card updates `selectedTeamId` in parent `App.tsx`; ensure the modal's `useEffect` initialization only runs when `isOpen` opens (not when `selectedTeamId` changes mid-flow) so transitioning from `TODAY'S TEAMS` (`step === 'teams'`) to `CHOOSE YOUR LEAD` (`step === 'lead'`) never resets `step` back to `'teams'`.

