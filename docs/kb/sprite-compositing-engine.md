# KB: Dynamic Sprite Compositing Engine & Custom Accessories

**Target Audience**: Workspace AI Agents, VSCode Copilots, Dev Team  
**Status**: ARCHITECTED / PLANNED FOR PHASE 4  
**Implementation Sequence**: Core Battle Engine -> Rotating Champion -> E4/Champion Gauntlet -> Dynamic Sprite Compositing Engine

---

## 1. System Overview & Objective

Build a GBA/NDS-authentic (Generations 3, 4, and 5) **Dynamic Sprite Compositing Engine** (2D "paper-doll" assembly) for a Levels-based Trainer customization and battle system.
The engine dynamically combines deconstructed base trainer "mannequins" with modular accessory sprites in real-time, preserving vintage pixel-art standards ($64\times64$ to $96\times96$ resolution) while accommodating a rich collectible accessory ecosystem.

### Merge & Alignment Mandate

* **Analyze & Overwrite**: Identify and deprecate flat/fused static overlays currently in `src/game/data/trainerPixelEngine.ts` and `src/game/data/cosmetics.ts`.
* **Preserve Game Logic**: Integrate directly with existing Battle and Roster state managers (`src/hooks/useBattle.ts`, `src/game/battleEngine.ts`) without altering state-machine interfaces, only refactoring the render pipeline.
* **Consolidate APIs**: Merge this document’s patterns with existing battle and team models in `src/game/types.ts` and battle mechanics in `src/game/data/moveMechanicsKB.ts`.

### Project Implementation Roadmap Sequence

To ensure stable foundations and avoid premature architectural entanglement, development proceeds in this strict order:
1. **Core Battle Engine Improvements**: Complete remaining move mechanics, secondary effects, and item behaviors (`src/game/battleEngine.ts`, `src/game/data/moveMechanicsKB.ts`).
2. **Rotating Champion Experience**: Implement dynamic Champion presentation, daily rotation schedule, custom cover art, battle sprites, and post-battle modals (`src/components/TitleScreen.tsx`, `src/components/battle/TrainerBattleSprite.tsx`, `src/components/battle/BattleGameOverModal.tsx`).
3. **Elite Four + Champion Gauntlet Experience**: Expand into full regional leagues, 5-trainer gauntlets, and sequential endurance battles (`docs/REGIONAL_LEAGUES_GAUNTLET_KB.md`, `src/game/data/regionalLeaguesKB.ts`).
4. **Dynamic Sprite Compositing Engine & Custom Accessories**: Unfold the 7-layer compositing engine, accessory anchoring schemas, and collectible cosmetic gear.

---

## 2. Technical Architecture: Deconstruction & Rendering

All Generation 3–5 sprites MUST be deconstructed into a "naked" (or minimally clothed) base layer, with accessory slots separated according to depth (`Z-Index`).

### A. Resolution Standards

* **Generation 3**: $64 \times 64$ pixels.
* **Generation 4 & 5**: $80 \times 80$ to $96 \times 96$ pixels.
* **Format**: Pure pixel-perfect `PNG` (Lossless, Transparent BG).
* **Storage Location**: `public/sprites/trainers/` and `public/sprites/accessories/` (served by Vite root as `/sprites/...`).

### B. Render Stack & Layer Ordering (Z-Index)

To ensure accessory overlays look correct regardless of pose, the engine renders the canvas in a strict bottom-to-top draw order:

| Z-Index | Layer Name | Description | Example |
| :---: | :--- | :--- | :--- |
| `0` | **Behind-Body** | Objects worn on the back, trailing elements. | Capes, wings, backpack straps, aura effects |
| `1` | **Base Character** | The bare/naked sprite model (body, head, limbs). | Natural hair, skin, standard shoes (if un-overlaid) |
| `2` | **Under-Clothing** | Primary base garment overlays. | Trousers, jeans, shirts, dresses |
| `3` | **Outer-Clothing** | Layer worn on top of standard wear. | Coats, jackets, vests, armor |
| `4` | **Acc Face / Head** | Face-level and top-of-head embellishments. | Hats, glasses, masks, blindfolds, bandanas |
| `5` | **Foreground / Held** | Front-most objects, layered on top of everything. | Held Poké Balls, weapons, shields, hand accessories |
| `6` | **Effects (Fore)** | Magical, elemental, or shiny overlay particles. | Glowing auras, spark effects, champion glints |

---

## 3. Data Refactoring & Anchoring Schemas

Since GBA and DS-era sprites vary wildly in pose and height (e.g., Lance is upright; Phoebe is crouching), **universal coordinates will fail**. Every accessory must be offset based on an anchor point associated with that specific character's posture.

Refactor the existing `SLOT_ANCHOR_POINTS` and `EquippedTrainerConfig` in `src/game/types.ts` and `src/game/data/trainerRegistry.tsx` to conform to the following:

### A. Base Trainer Anchor Database (`src/game/data/trainerAnchors.ts`)

```typescript
export interface AnchorPoints {
  behind_back: { x: number; y: number }; // Z-0
  torso: { x: number; y: number };       // Z-2 & Z-3 (jacket/vest/cape pins)
  head: { x: number; y: number };        // Z-4 (hats/headwear/eyewear)
  hand_front: { x: number; y: number };  // Z-5 (held item)
  natural_hair_volume: 'flat' | 'high' | 'bulky'; // Offset logic for headwear
}

export interface TrainerBaseData {
  trainerId: string;
  name: string;
  generation: 3 | 4 | 5;
  spriteBaseUrl: string; // "Naked" mannequin image path under public/
  anchors: AnchorPoints;
}

export const TRAINER_BASE_DB: Record<string, TrainerBaseData> = {
  johto_lance: {
    trainerId: "johto_lance",
    name: "Lance",
    generation: 3,
    spriteBaseUrl: "/sprites/trainers/lance_base.png",
    anchors: {
      behind_back: { x: 35, y: 28 },
      torso: { x: 32, y: 20 },
      head: { x: 32, y: 8 },
      hand_front: { x: 12, y: 24 },
      natural_hair_volume: "bulky"
    }
  },
  hoenn_phoebe: {
    trainerId: "hoenn_phoebe",
    name: "Phoebe",
    generation: 3,
    spriteBaseUrl: "/sprites/trainers/phoebe_base.png",
    anchors: {
      behind_back: { x: 34, y: 32 },
      torso: { x: 28, y: 26 },
      head: { x: 30, y: 14 },
      hand_front: { x: 10, y: 22 },
      natural_hair_volume: "flat"
    }
  },
  sinnoh_cynthia: {
    trainerId: "sinnoh_cynthia",
    name: "Cynthia",
    generation: 4,
    spriteBaseUrl: "/sprites/trainers/cynthia_battle.png",
    anchors: {
      behind_back: { x: 38, y: 30 },
      torso: { x: 34, y: 26 },
      head: { x: 36, y: 10 },
      hand_front: { x: 18, y: 28 },
      natural_hair_volume: "high"
    }
  }
};
```

### B. Updated Modular Accessory Items (`src/game/data/accessories.ts`)

Upgrades the flat `CosmeticCard` catalog (`src/game/data/cosmetics.ts`) to match the 7-layer ordering standard:

```typescript
export type AccessorySlot = 'behind_back' | 'under_clothing' | 'outer_clothing' | 'headwear' | 'held_item' | 'effects';

export interface AccessoryItem {
  itemId: string;
  name: string;
  slot: AccessorySlot;
  zIndex: number; // Stack positioning (0-6)
  spriteSheetUrl: string; // Grid or offset sheet path under public/
  pixelOffset: { x: number; y: number }; // Global adjustments
  isAnimated: boolean;
  frameCount?: number;
  paletteMask?: boolean; // Determines if tint shader applies
}

export const ACCESSORY_REGISTRY: Record<string, AccessoryItem> = {
  heroic_cape: {
    itemId: "heroic_cape",
    name: "Heroic Cape",
    slot: "behind_back",
    zIndex: 0,
    spriteSheetUrl: "/sprites/accessories/heroic_cape.png",
    pixelOffset: { x: 0, y: 0 },
    isAnimated: false
  },
  wizard_hat: {
    itemId: "wizard_hat",
    name: "Sorcerer's Hat",
    slot: "headwear",
    zIndex: 4,
    spriteSheetUrl: "/sprites/accessories/wizard_hat.png",
    pixelOffset: { x: 0, y: -2 }, // Fits just above the head anchor
    isAnimated: false
  },
  championship_belt: {
    itemId: "championship_belt",
    name: "Indigo Championship Belt",
    slot: "outer_clothing",
    zIndex: 3,
    spriteSheetUrl: "/sprites/accessories/champ_belt.png",
    pixelOffset: { x: 0, y: 1 },
    isAnimated: true,
    frameCount: 4 // Animated sparkle on gold plate
  }
};
```

---

## 4. Compositing Logic & Technical Pipeline

The runtime pipeline takes selected equipment from `UserCosmeticInventory`, resolves character-specific anchor offsets, and composites the dynamic canvas.

### Dynamic Rendering Pipeline

1. **Retrieve Selections**: Query the database for the active `TrainerBaseData` and any equipped `AccessoryItem` IDs from `UserCosmeticInventory`.
2. **Sort by Depth**: Organize active layers based on their `zIndex` (Z-0 up to Z-6).
3. **Calculate Positions**:
   - $X_{\text{Draw}} = \text{MannequinX} + \text{TrainerAnchorX} + \text{ItemOffsetX}$
   - $Y_{\text{Draw}} = \text{MannequinY} + \text{TrainerAnchorY} + \text{ItemOffsetY}$
4. **Draw and Combine**: Render the layers onto an offscreen canvas. Use pixel-snapping (`Math.round`) to preserve retro crispness and prevent sub-pixel antialiasing/blurring.

```typescript
export function renderCompositedTrainer(
  canvas: HTMLCanvasElement,
  base: TrainerBaseData,
  equipped: AccessoryItem[]
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Force retro crispness (disable image smoothing)
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. Gather all drawable layers (mannequin base + accessories)
  const drawLayers = [
    { zIndex: 1, imgUrl: base.spriteBaseUrl, offsetX: 0, offsetY: 0 },
    ...equipped.map(item => {
      // Resolve slot anchors
      let anchor = { x: 0, y: 0 };
      if (item.slot === 'behind_back') anchor = base.anchors.behind_back;
      else if (item.slot === 'headwear') anchor = base.anchors.head;
      else if (item.slot === 'held_item') anchor = base.anchors.hand_front;
      else anchor = base.anchors.torso;
      
      return {
        zIndex: item.zIndex,
        imgUrl: item.spriteSheetUrl,
        offsetX: anchor.x + item.pixelOffset.x,
        offsetY: anchor.y + item.pixelOffset.y
      };
    })
  ];
  
  // 2. Sort by Z-Index so the correct overlays are on top
  drawLayers.sort((a, b) => a.zIndex - b.zIndex);
  
  // 3. Sequential Render
  drawLayers.forEach(layer => {
    const img = new Image();
    img.src = layer.imgUrl;
    img.onload = () => {
      // Apply pixel-snapping to prevent sub-pixel blurring
      const x = Math.round(layer.offsetX);
      const y = Math.round(layer.offsetY);
      ctx.drawImage(img, x, y);
    };
  });
}
```

---

## 5. Merging, Verification, & Deprecation Plan

AI agents should adhere to this workflow when scheduled to migrate assets and interfaces:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. AUDIT EXISTING TRAINER SPRITE ARTIFACTS                             │
│ Inspect: src/game/data/trainerPixelEngine.ts, trainerRegistry.tsx,     │
│          and src/game/data/cosmetics.ts                                │
│ Pattern: /EquippedTrainerConfig|SLOT_ANCHOR_POINTS|MiniTrainerSVG/g    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. REFACTOR & MERGE                                                    │
│ Replace flat item records with 7-layer Z-ordering & anchors.           │
│ Update src/game/types.ts & export via src/game/constants.ts            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. VERIFY                                                              │
│ Validate crisp pixel edges (no sub-pixel blur), boundaries,            │
│ and anchoring across Lance, Phoebe, and Cynthia bases.                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Action Items for Agents (Phase 4)

* [ ] **Deconstruct Assets**: Store layers in `public/sprites/accessories/` and test composites in `public/sprites/test_composites/`.
* [ ] **Data Model Overhaul**: Expand `src/game/types.ts` (`AccessoryItem`, `TrainerBaseData`, `AnchorPoints`) without breaking existing battle interfaces.
* [ ] **Map the Offsets**: Map Anchor Points for target trainers (e.g., Lance, Phoebe, Cynthia) on $64\times64$ and $80\times80$ pixel grids.
* [ ] **Render Verification**: Ensure crisp edge rendering with `imageSmoothingEnabled = false` and test that accessories do not clip outside canvas bounds.
