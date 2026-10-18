# UX Style Guide — Battle Cynthia

This guide captures the exact visual and interaction language approved in the mock iteration so agents and humans can reproduce it consistently.

## 1. Color Tokens (mandatory)

| Token            | Hex       | Usage                          |
|------------------|-----------|--------------------------------|
| Deep background  | `#081820` | Screen background              |
| Primary green    | `#306850` | Frames, buttons, primary UI    |
| Light green      | `#88c070` | Accents, HP bars (healthy)     |
| Cream            | `#e0f8d0` | Primary text, highlights       |
| Accent red       | `#a84040` | Strategy tags, warnings        |

No other colors may be introduced for core UI.

## 2. Frames & Borders
- All dialogue boxes, panels, and cards use **classic double-lined GBA frames**.
- Outer screen border may include a very low-opacity Ukiyo-e wave texture.
- Ukiyo-e must never appear inside the battle arena, move grid, HP bars, or dialogue text.

## 3. Typography
- Pixel / bitmap style fonts only.
- Clear hierarchy: large titles → dialogue text → small PP / level numbers.
- Strategy tags and badges use `whitespace-nowrap`.

## 4. Core Screens (layout contract)

### Title Screen
- Centered champion portrait
- Double-lined title banner
- Three large thumb-zone buttons (Daily Battle, Gauntlet Run, Collection)

### Team Selection
- Exactly 3 stacked team cards
- Each card: sprite preview, bold strategy tag, one-line description, SELECT button
- Back button in thumb zone

### Lead Selection
- Classic party-list layout (6 slots)
- HP bars, levels, type indicators
- Clear “CHOOSE YOUR LEAD” dialogue
- Large “START BATTLE” button in thumb zone

### Battle Screen
- Enemy top-right, player bottom-left
- Classic HP bars and names
- Compact Showdown-style action log (always visible, never covering monsters or moves)
- Dialogue box
- Strict 2×2 move grid in thumb zone
- Switch button only (no Bag)
- Live HP and status updates as effects resolve

### Results Screen
- Large outcome dialogue (“VICTORY!” / “DEFEAT…”)
- Compact result card + streak
- Thumb-zone actions (Share, Title Screen)

## 5. Battle Visual Feedback (non-cluttering)
- Weather: small persistent icon + subtle background tint
- Status: small icon next to name / HP bar
- Stat stages: brief floating text or compact indicator
- Substitute: classic doll overlay
- All detailed messaging goes to the action log

## 6. Interaction Principles
- Mobile-first, thumb-zone primary actions
- Single-screen fit during battle (no scrolling)
- One Pokémon fully resolves its action before the other begins
- Fainted Pokémon cannot act
- HP and status update live

## 7. Prohibitions
- Modern glassmorphism, drop shadows, rounded modern buttons
- Non-palette colors
- Bag button
- Scrolling battle UI
- Inventing new visual systems that break the GBA contract
