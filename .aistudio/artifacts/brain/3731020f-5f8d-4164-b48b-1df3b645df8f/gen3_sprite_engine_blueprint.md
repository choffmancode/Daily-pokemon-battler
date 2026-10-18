# Generation 3 Pokémon Emerald Sprite Compositor Engine — Technical Blueprint

## 1. Engine & Canvas Specifications

### Technical Stack
- **Runtime Environment**: Web Application (React 19, TypeScript, Tailwind CSS).
- **Dual Rendering Modes**:
  1. **Run-Length Optimized SVG Renderer (`MiniTrainerSVG`)**: Directly compiles 16×24 (or 64×64) pixel matrices into contiguous, optimized horizontal rectangles (`<rect>`) with `shape-rendering: crispEdges` and `image-rendering: pixelated`. Zero raster blur, infinite crisp geometric scaling, and zero memory overhead.
  2. **HTML5 Direct Pixel Canvas Renderer (`renderTrainerToCanvas`)**: Low-level `CanvasRenderingContext2D` pixel-matrix compositor rendering directly into an offscreen or on-screen `<canvas>` at $1\times, 2\times, 4\times, 8\times, 16\times$ integer scaling factors.

### Target Resolution Rules
- **Native Matrix**: $16 \times 24$ pixels (authentic Game Boy Advance overworld protagonist mini-matrix; expandable to $64 \times 64$ battle sprite matrix).
- **HD Upscaling**: Rendered at $128 \times 192$, $256 \times 384$, and $512 \times 768$ viewport sizes.
- **Scaling Invariant**: Strictly nearest-neighbor integer interpolation (`image-rendering: pixelated`, `image-rendering: -moz-crisp-edges`, `image-rendering: crisp-edges`). No bilinear smoothing or vector antialiasing.

---

## 2. Layering Hierarchy & Z-Index Rules

To eliminate visual clipping between layered clothing, hair, hats, and backpacks, all items are sorted strictly by their assigned Z-Index before compositing:

```
[Back]                                                                      [Front]
 ──┬──────────┬──────────┬──────────────┬─────────────┬───────┬──────────┬───────►
   │          │          │              │             │       │          │
 Z: 0        Z: 1       Z: 2           Z: 3          Z: 4    Z: 5       Z: 6
Background  Ground    Backpack &     Base Body     Under-   Over-     Footwear &
  Auras     Shadow    Back Gear      (Skin/Face/   garment  garment     Shoes
                      (Rucksack,      Rear Hair)   (Pants,  (Shirts,   (Sneakers,
                       Wings)                      Shorts)   Vests)     Greaves)
                                                                 │
                                                       ┌─────────┴─────────┐
                                                       │                   │
                                                      Z: 7                Z: 8
                                                   Headwear &        Front Held Items &
                                                   Face Gear         Arm Transformations
                                                  (Hats, Caps,       (Pokéballs, Badges,
                                                    Bandanas)         Commanding Postures)
```

| Z-Index | Slot Category | Description & Collision Boundary | Anchor Origin |
|:---:|:---|:---|:---:|
| **Z: 0** | `aura` | Ambient energy sparks, elemental rings, Mt. Silver frost mist | `(X: 0, Y: 0)` |
| **Z: 1** | `shadow` | Ground contact shadow ellipse (`rx: 6, ry: 1.2`) | `(X: 8, Y: 22.5)` |
| **Z: 2** | `backpack` | Rucksacks, explorer satchels, glider wings, tech packs | `(X: 0, Y: 8)` |
| **Z: 3** | `base` | Core model: rear hair silhouette, skin tone, face, anime eyes | `(X: 0, Y: 0)` |
| **Z: 4** | `undergarment` | Denim trousers, athletic cycling shorts, utility pants | `(X: 0, Y: 13)` |
| **Z: 5** | `overgarment` | Shirts, vests, dresses, tunics, robes, hoodies | `(X: 0, Y: 11)` |
| **Z: 6** | `shoes` | Running shoes, turbo runners, magma greaves, reef flippers | `(X: 0, Y: 18)` |
| **Z: 7** | `headwear` | Baseball caps, knit beanies, sunhats, bandanas, crowns, ninja masks | `(X: 0, Y: 0)` |
| **Z: 8** | `badge` / `held_item` | Lapel gym brooches, Frontier symbols, held Pokéball in commanding stance | `(X: 3, Y: 12)` |

---

## 3. Sprite Anatomy, Anchor Points & Frame Postures

### Base Model Matrix Dimensions
- **Width**: 16 columns (indices $0 \dots 15$)
- **Height**: 24 rows (indices $0 \dots 23$)

### Standard Anatomical Row Segments
- **Rows 0 – 5**: Headwear crown, cap dome, visor brim shelf, beanie tuft, bandana fold.
- **Rows 6 – 9**: Anime eyes (sclera + pupil), forehead, cheeks, jawline, rounded chin.
- **Row 10**: Tapered neck shadow connecting head to shoulders.
- **Rows 11 – 14**: Shoulders, open collar, vest/jacket, undershirt, belt buckle, resting arms (Cols 1-2, 13-14).
- **Rows 15 – 18**: Denim jeans, pleated skirt, cycling shorts, knee fabric crease folds, cuffs.
- **Rows 19 – 21**: Sneaker uppers, white midsoles, rubber tread base.
- **Rows 22 – 23**: Ground contact clearance & ambient shadow ellipse.

### Posture State Transforms & Arm Retraction Mechanics
1. **`idle`**: Canonical 16×24 GBA resting stance. Both arms rest comfortably at hips (Cols 1-2 and 13-14 on Rows 11–13).
2. **`commanding`**: Dynamic battle stance. Right resting hand at hip (Cols 12-13 on Rows 12-13) is automatically retracted/cleared, and an outstretched battle arm stretches across Rows 10-12 gripping an authentic 3×3 Pokéball (Red top hemisphere `r`, black dividing band with clean white button `w`, and white bottom hemisphere `w`).
3. **`cheering`**: Joyous celebration pose. Both resting hands at hips (Cols 1-2 and 13-14 on Rows 12-13) are automatically retracted/cleared (preventing four-arm rendering artifacts), and energetic arms rise overhead to Rows 8-10 with clenched fists and happy posture.

---

## 4. Standardized Item Data Structure (JSON Schema)

Every wearable clothing piece, accessory, and cosmetic card adheres to this schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SpriteItemDefinition",
  "type": "object",
  "properties": {
    "item_id": {
      "type": "string",
      "description": "Unique immutable identifier matching gacha card id"
    },
    "name": {
      "type": "string",
      "description": "User-facing item name"
    },
    "slot": {
      "type": "string",
      "enum": ["aura", "backpack", "base", "undergarment", "overgarment", "headwear", "shoes", "badge", "held_item"]
    },
    "z_index": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10
    },
    "assets": {
      "type": "object",
      "properties": {
        "idle": { "type": "array", "items": { "type": "string" } },
        "commanding": { "type": "array", "items": { "type": "string" } },
        "cheering": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["idle"]
    },
    "offsets": {
      "type": "object",
      "properties": {
        "x": { "type": "integer" },
        "y": { "type": "integer" }
      },
      "required": ["x", "y"]
    },
    "palette_swaps": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": { "type": "string" }
      }
    }
  },
  "required": ["item_id", "name", "slot", "z_index", "assets", "offsets"]
}
```

### Example Concrete Item Object

```json
{
  "item_id": "card_brendan_emerald_cap",
  "name": "Emerald Knit Beanie",
  "slot": "headwear",
  "z_index": 7,
  "assets": {
    "idle": [
      "....XwwX........",
      "...XwwwwX.......",
      "..XwwwwwwX......",
      ".XwwwwwwwwX.....",
      "XEEEEEEEEEEEX...",
      "XXXXXXXXXXXXX...",
      ".XRbXXXXXXbRX..."
    ]
  },
  "offsets": { "x": 0, "y": 0 },
  "palette_swaps": {
    "default": { "E": "#08a858", "e": "#38e090" },
    "shiny_gold": { "E": "#b87808", "e": "#f8b820" },
    "shadow_purple": { "E": "#582098", "e": "#c078f8" }
  }
}
```

---

## 5. Authentic GBA Color Palette & Customization Mechanics

### 16-Color Game Boy Advance Master Palette
Extracted directly from Pokémon Emerald & FireRed/LeafGreen ROM binaries:

| Code | Hex | Color Name & GBA Semantic Role |
|:---:|:---:|:---|
| `.` | `transparent` | Clear / Pass-through to lower Z-index |
| `X` | `#181818` | Black Contour Outline |
| `s` | `#fed0a0` | Skin Highlight (Warm GBA Peach) |
| `S` | `#e89860` | Skin Midtone |
| `d` | `#985830` | Skin Shadow / Neck Shade |
| `w` | `#f8f8f8` | Clean GBA White |
| `g` | `#c8d0d8` | Light Platinum Gray |
| `G` | `#485058` | Dark Slate / Charcoal Pants |
| `r` | `#f85848` | Vermilion Red Highlight |
| `R` | `#d82818` | Red Midtone |
| `b` | `#881010` | Deep Crimson Shadow |
| `e` | `#38e090` | Emerald Green Highlight |
| `E` | `#08a858` | Emerald Green Midtone |
| `k` | `#085830` | Deep Forest Emerald Shadow |
| `l` | `#5898f8` | Bright Azure Highlight |
| `L` | `#1858c0` | Cobalt Blue Midtone |
| `D` | `#102868` | Deep Navy Shadow |
| `h` | `#b87040` | Chestnut Hair Highlight |
| `H` | `#804820` | Brunette Hair Midtone |
| `B` | `#482810` | Dark Brown Hair Shadow |
| `K` | `#201828` | Jet Black Anime Hair |
| `y` | `#f8b820` | Gold / Yellow Accent |
| `Y` | `#b87808` | Dark Gold Shadow |
| `p` | `#c078f8` | Lavender / Violet Highlight |
| `P` | `#582098` | Royal Velvet Purple |
| `c` | `#38d8f8` | Cyan / Ice Highlight |
| `C` | `#0888a8` | Deep Teal Shadow |
| `o` | `#f88820` | Wristband Orange Highlight |
| `O` | `#c04808` | Burnt Orange Shadow |
| `m` | `#e84878` | Coral / Magenta Highlight |
| `M` | `#a81848` | Deep Coral Shadow |

### Customization Mechanics
1. **Dynamic Hex Swapping**:
   - `paletteOverrides?: Record<string, string>` passes custom dyes (e.g. `{ 's': '#ffdfb8', 'E': '#9333ea' }`) into `compilePixelRects()` or `renderTrainerToCanvas()`, instantly recoloring skin, hair, or fabrics without duplicating sprite matrices.
2. **Key Character Mapping**:
   - Transparent characters (`.`) preserve underlying layer data; solid characters (`X`, `w`, `E`, etc.) overwrite lower Z-index pixels according to strict layer precedence.
3. **Run-Length SVG Optimization**:
   - Horizontally adjacent pixels sharing the same palette color merge into a single SVG `<rect x="..." y="..." width="..." height="1" fill="..." />`, reducing DOM nodes from 384 down to ~70 elements per sprite.
