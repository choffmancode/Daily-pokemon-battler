# Champion Experience & Sprite Pipeline Knowledge Base
*Parity Benchmark, Gap Analysis & Sequenced Implementation Roadmap*

---

## 1. Executive Summary & Delivery Sequence

To scale the game from a standalone Cynthia boss encounter into a rich, replayable multi-region experience, features must be delivered in strict sequential order:

```
┌────────────────────────────────────────────────────────┐
│ 1. Core Battle Engine Improvements                     │
│    (Complete remaining move mechanics, items & status) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Rotating Daily Champion Experience                  │
│    (Dynamic title, cover art, battle sprites, modal)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Elite Four + Champion Regional Gauntlet Experience  │
│    (5-battle gauntlet, endurance logic, E4 rosters)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Dynamic Sprite Compositing Engine & Accessories     │
│    (7-layer paper-doll assembly, anchors, gacha items) │
└────────────────────────────────────────────────────────┘
```

---

## 2. The "Cynthia Experience" Parity Benchmark

The current benchmark set by Champion Cynthia consists of 5 tightly integrated touchpoints that must be replicated for every subsequent Champion and trainer:

| Touchpoint | Cynthia Implementation | Technical Requirement for New Trainers |
| :--- | :--- | :--- |
| **1. Title Screen** | Dedicated `cynthia_cover_card.png` (`723x1024` vertical trading card ratio) with purple aura, chamfered frame, and header. | Dynamic hero card loader, customizable aura glow, dynamic champion title/region header. |
| **2. Daily Matchups** | 3 curated player teams in `teams.ts` specifically balanced to counter Cynthia's team composition. | Curated 3-team player counter-drafts per Champion/League. |
| **3. Battle Arena** | Authentic full-body battle sprite (`cynthia_battle.png`) scaled to `h-24` (96px) with zero white fringing/defringed alpha. | Full-body pixel art battle sprite asset per trainer. |
| **4. CFRU Battle AI** | 8-layer CFRU AI engine with designated lead (Spiritomb) and preserved ace (Garchomp) with setup/clean-up priority. | Designated Ace and Lead behavior defined in trainer metadata for the AI engine. |
| **5. Post-Battle Modal** | 1:1 square portrait bust (`cynthia_portrait_bust.png`), custom victory & defeat dialogue quotes, and battle report showing `"CYNTHIA ACE: {aceName} ({aceHpPct}% HP)"`. | Square portrait bust asset, dynamic dialogue strings, and dynamic Ace extraction for the match report. |

---

## 3. Knowledge Base & Codebase Gap Inventory

### A. Trainer Presentation & Identity Schema
`docs/CHAMPIONS_AND_E4_ROTATING_TEAMS_KB.md` and `src/game/data/regionalLeaguesKB.ts` outline rosters for Blue, Lance, Steven, Iris, and Alder, but lack a unified **Trainer Presentation Contract**:
- **Asset Manifest**: Missing `coverCardUrl`, `battleSpriteUrl`, and `portraitBustUrl` attributes.
- **Dialogue Pack**: Missing pre-battle intro quotes, mid-battle ace send-out quotes, and victory/defeat post-battle lines for anyone other than Cynthia.
- **Visual Branding**: Missing primary/secondary theme colors and aura specifications for title screen card styling.

### B. Hardcoded UI References
- `src/components/TitleScreen.tsx`: Direct `<img src="/sprites/trainers/cynthia_cover_card.png" ... />`.
- `src/components/battle/TrainerBattleSprite.tsx`: Direct `<img src="/sprites/trainers/cynthia_battle.png" ... />` when `isOpponent=true`.
- `src/components/battle/BattleGameOverModal.tsx`: Direct `<img src="/sprites/trainers/cynthia_portrait_bust.png" ... />`, hardcoded check for `garchomp`, and hardcoded text `"CYNTHIA ACE:"`.
- `src/game/battleEngine.ts`: Fallback default opponent team is hardcoded to `CHAMPION_CYNTHIA_TEAM`.

### C. Rotation Engine & Daily Scheduling Logic
- No runtime scheduler connects calendar time (Day of Week vs Day of Month) to the active Champion.
- Need a deterministic daily rotation hook (`useDailyChampion()`).

### D. Move & Item Engine Support
- Roster configurations in `CHAMPIONS_AND_E4_ROTATING_TEAMS_KB.md` introduce moves (`Shell Smash`, `Cotton Guard`, `Metal Burst`, `Quiver Dance`, `Trick Room`, `Perish Song`) and items (`Custap Berry`, `Assault Vest`, `Weakness Policy`, `Air Balloon`) requiring implementation or fallback handling in `battleEngine.ts`.

---

## 4. Asset Specification & Standardization

All new Champion, Elite Four, and trainer artwork must conform to these standard specifications:

1. **Cover Card Asset**:
   - Aspect Ratio: `723:1024` (or ~2:3 / 5:7 vertical card ratio).
   - Presentation: High-contrast character art with ambient back glow/aura matching signature colors.
   - Output Path: `/sprites/trainers/{trainerId}_cover_card.png` (or `.jpg`).
2. **Battle Sprite Asset**:
   - Canvas/Scale: Native height scaled to ~96px (`h-24` in battle stage).
   - Alpha Channel: Defringed, 100% clean transparent background, zero white edges.
   - Rendering: `shapeRendering: crispEdges` / CSS `image-rendering: pixelated`.
   - Output Path: `/sprites/trainers/{trainerId}_battle.png`.
3. **Portrait Bust Asset**:
   - Aspect Ratio: 1:1 square crop (`80x80` to `128x128`).
   - Framing: Head & shoulders focus for post-battle dialogue modal.
   - Output Path: `/sprites/trainers/{trainerId}_portrait_bust.png`.

---

## 5. Related Knowledge Bases

- [Dynamic Sprite Compositing Engine & Custom Accessories](file:///c:/Users/bitty/Desktop/Personal%20Projects/pokemon-battler/docs/kb/sprite-compositing-engine.md)
- [Champions & Elite Four Rotating Team Configurations](file:///c:/Users/bitty/Desktop/Personal%20Projects/pokemon-battler/docs/CHAMPIONS_AND_E4_ROTATING_TEAMS_KB.md)
- [Regional Leagues & Elite Four Gauntlet](file:///c:/Users/bitty/Desktop/Personal%20Projects/pokemon-battler/docs/REGIONAL_LEAGUES_GAUNTLET_KB.md)
- [Advanced Battle AI KB](file:///c:/Users/bitty/Desktop/Personal%20Projects/pokemon-battler/docs/ADVANCED_BATTLE_AI_KB.md)
