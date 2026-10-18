# Battle Red — System Architecture & AI Lookup Map

> **Purpose**: High-density architectural reference for rapid context recovery, AI code-assistant indexing, and developer onboarding.

---

## 1. Directory Structure & Modular Layout

```
src/
├── App.tsx                     # Top-level state orchestrator & lazy modal loader (<130 lines)
├── main.tsx                    # Vite entry point
├── index.css                   # Tailwind v4 directives, Art Deco & Ukiyo-e utilities, mobile safe areas
│
├── game/                       # Pure battle & gacha domain logic (framework-agnostic)
│   ├── constants.ts            # Lean barrel re-exporting all data modules (<20 lines)
│   ├── types.ts                # TypeScript domain models (Pokemon, Move, BattleState, CosmeticItem)
│   ├── battleEngine.ts         # Turn execution, damage formula, AI move scoring, status effects
│   ├── battleEngine.test.ts    # Automated test suite for turn logic
│   ├── gachaEngine.ts          # Booster pack RNG, pity counters, duplicate dust, local storage
│   └── data/                   # Modularized game data files
│       ├── typeChart.ts        # Gen 3-9 type chart matrix, type badge colors, sprite CDN helpers
│       ├── teams.ts            # Champion Red's team + 5 beginner curated squad presets
│       ├── cosmetics.ts        # 50 cosmetic cards with Ukiyo-e Hanko seals & woodblock styles
│       └── scenes.ts           # Cozy rotating background artwork scenes
│
├── audio/                      # Audio & sensory feedback
│   ├── useHaptics.ts           # Mobile vibration engine (navigator.vibrate with fallbacks)
│   └── (AudioEngine in components)
│
├── hooks/                      # Custom React hooks
│   ├── useBattle.ts            # Turn state, AI selection, keyboard hotkeys (1-4, Esc), pack rewards
│   └── useMobileViewport.ts    # 100dvh dynamic resizing, orientation change, first-touch audio unlock
│
└── components/                 # UI presentation layers (<280 lines each)
    ├── AudioEngine.ts          # Procedural Web Audio synth (hits, faints, pack tears, chimes)
    ├── BattleArena.tsx         # Battle screen orchestrator
    ├── GachaPackModal.tsx      # Gacha dialog orchestrator
    ├── PokemonSummaryModal.tsx # Art Deco & Ukiyo-e in-battle inspector
    ├── TitleScreen.tsx         # Hero, rotating cozy background art, squad selector launch
    ├── WardrobeModal.tsx       # Equipment locker for Trainer & Pokémon
    ├── TeamSelectorModal.tsx   # Team roster selector dialog
    ├── MultiplayerRoadmapModal.tsx # Feature roadmap dialog
    │
    ├── battle/                 # Modular battle sub-components
    │   ├── BattleStage.tsx     # Animated sprites, stage shadows, turn attention beacon
    │   ├── BattleStatPlate.tsx # HP bars, levels, types, clickable summary trigger
    │   ├── BattleControls.tsx  # Moves grid (PP, effectiveness, kanji) & Switch roster
    │   └── BattleGameOverModal.tsx # Summit Victory / Defeat dialogs with rewards
    │
    └── gacha/                  # Modular gacha sub-components
        ├── BoosterPack3D.tsx   # 3D foil booster pack, tear animation, admin bypass
        ├── PackAdminToolbar.tsx# Admin tools (+5 Packs, Reset Cooldown, Instant Open)
        └── CardRevealCarousel.tsx # Revealed cards, flipping, holo effects, inspect codex
```

---

## 2. Core State Flows & Lifecycles

### A. Game State Machine (`App.tsx`)
```
[ Title Screen ] ──( Start Battle )──> [ Battle Arena ]
       ▲                                      │
       └──────────( Exit to Title )───────────┘
```
- **Modals** (`GachaPackModal`, `WardrobeModal`, `TeamSelectorModal`, `MultiplayerRoadmapModal`): Lazy-loaded with `React.lazy` and `Suspense` so they do not block initial mobile execution.

### B. Combat Turn Cycle (`useBattle.ts` & `battleEngine.ts`)
```
1. Action Select (Phase: 'action_select')
   ├── Player selects Move [1-4] OR Switches Squad
   └── AI evaluates board state (Type advantage, HP ratio, coverage scoring)
2. Priority Resolution
   ├── Switch actions resolve first (+6 priority)
   ├── Priority moves resolve second (Extreme Speed +2, Quick Attack/Bullet Punch +1)
   └── Speed stat comparison resolves simultaneous priority brackets
3. Turn Execution (`executeBattleTurn`)
   ├── Accuracy check -> Damage calculation -> Recoil/Secondary effects
   └── Faint checks -> If current mon faints, transition to forced switch
4. End-of-Turn Phase
   ├── Weather tick (Hail 1/16 max HP damage to non-Ice types)
   └── Status condition tick (Burn/Poison damage, Paralysis speed debuff)
5. Win/Loss Evaluation
   ├── All 6 Red Pokémon fainted -> Player Victory (+2 Summit Packs, +100 Dust)
   └── All 6 Player Pokémon fainted -> Player Defeat (Retry or Exit)
```

### C. Gacha Pack Opening Flow (`GachaPackModal.tsx` & `gachaEngine.ts`)
```
1. Idle Stage -> Check available packs or daily cooldown
   └── Admin Bypass available on 3D pack and toolbar
2. Tearing Stage (700ms) -> Sound FX tear + haptic vibration
3. Revealed Stage -> 3 cards drawn with weighted RNG (Secret Rare 1.5%, Legendary 4%, Epic 12%, Rare 27.5%, Common 55%)
4. Card Flip -> User taps cards to reveal Ukiyo-e woodblock artwork, Hanko stamp, and equip actions
```

---

## 3. Key Design Decisions

1. **Sub-300 Line File Limit**: Monolithic files have been broken into focused modules. Every file in `components/` and `game/` is under ~300 lines for zero cognitive overhead.
2. **Backwards-Compatible Barrel Export**: `constants.ts` re-exports from `src/game/data/*` so existing imports remain intact.
3. **Dual-Layer Admin Bypass**: Admins can open packs via the dedicated admin button or by tapping the 3D foil pack directly even with 0 packs remaining.
4. **Zero-Lag Haptics**: Uses silent fallback on devices without `navigator.vibrate`.
