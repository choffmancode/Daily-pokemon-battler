# Mobile Web Game Optimization Guide: Monster Battlers & Gacha Systems

> **Research & Implementation Blueprint**: Best practices, performance budgets, and architectural standards for running high-performance turn-based combat and gacha card games on mobile browsers (iOS Safari, Android Chrome, and mobile webviews).

---

## 1. Viewport Stability & Safe Area Insets

### The Mobile URL Bar Problem
On iOS Safari and Android Chrome, the browser address bar and navigation bar collapse/expand during scroll events. Using standard `height: 100vh` causes severe visual layout thrashing:
- Bottom battle docks get buried beneath the home indicator or browser toolbar.
- When opening modals, the viewport recalculates, triggering sudden reflows and jerky animations.

### The Solution: Dynamic Viewport Units (`dvh`) + Safe Area Padding
1. **Dynamic Units**: Use `h-[100dvh]` and `max-h-[100dvh]` to track the true visible height of the mobile browser viewport in real time.
2. **Safe Area Insets**:
   ```css
   .pt-safe { padding-top: env(safe-area-inset-top, 0px); }
   .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
   ```
3. **Viewport Meta Configuration**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
   ```
   - `viewport-fit=cover` instructs iOS to draw into the notch and home bar regions.
   - Prevents accidental pinch-to-zoom during rapid move taps in battle.

---

## 2. Touch Latency & Gesture Handling

### Eliminating the 300ms Double-Tap Zoom Delay
Mobile browsers historically delay `click` events by 300ms to check if the user is attempting a double-tap zoom. For a fast-paced battle game, this creates sluggish input response.

**Fix**:
Apply `touch-action: manipulation` to top-level containers and buttons. This tells the browser to process clicks instantly while preserving single-finger pan gestures.

```css
* {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

### Preventing Elastic Rubber-Banding
Pulling down on mobile browsers often triggers page refresh or elastic rubber-banding, pulling the battle canvas off-screen.
- Set `overscroll-behavior: none;` on `main` and `body`.
- Keep the game arena strictly `overflow-hidden` so touch interactions remain locked to the interface.

---

## 3. Web Audio Autoplay Policy & First-Touch Unlock

### The Mobile Audio Trap
Mobile Safari and Android Chrome suspend `AudioContext` until an explicit user gesture (`touchstart`, `pointerdown`, or `click`). If audio triggers before an interaction, sounds fail silently and errors flood the console.

### The Pattern: Global First-Touch Audio Unlocking
Register a passive, self-removing listener on `window` during app mounting:

```typescript
const handleFirstTouch = () => {
  soundFX.unlockAudio(); // Calls ctx.resume() on AudioContext
  window.removeEventListener('touchstart', handleFirstTouch);
  window.removeEventListener('pointerdown', handleFirstTouch);
};
window.addEventListener('touchstart', handleFirstTouch, { passive: true });
window.addEventListener('pointerdown', handleFirstTouch, { passive: true });
```

### Procedural Synthesis vs. Audio File Downloads
Downloading dozens of MP3/WAV files for attacks and menu blips strains cellular data and causes loading delays.
- Procedural audio synthesis (oscillators, noise buffers, exponential gain ramps) delivers zero-network audio latency with negligible memory footprints ($<10\text{KB}$ code).

---

## 4. Mobile Haptics (`navigator.vibrate`)

Haptic feedback bridges the gap between web applications and native mobile apps:
- **Button Tap**: `10ms` – subtle, crisp confirmation.
- **Normal Hit**: `25ms` – tactile damage impact.
- **Critical / Super Effective Hit**: `[35ms, 30ms, 50ms]` – powerful staccato pulse.
- **Booster Pack Tear**: `[20ms, 15ms, 30ms, 15ms, 60ms]` – textured sensation simulating foil tearing.
- **Faint / Error**: `[40ms, 50ms, 40ms]` – warning buzz.

Always wrap calls in capability checks:
```typescript
if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
  navigator.vibrate(pattern);
}
```

---

## 5. Mobile GPU, Rendering & DOM Performance

### Avoiding "Layer Explosion" on Low-RAM Mobile Devices
Applying `transform: translateZ(0)` or `will-change` to too many elements creates separate compositing layers in GPU memory. On mobile devices with 2GB–4GB of RAM, this causes browser tab crashes.
- Use GPU acceleration **only on active animations** (screen shakes, pack foil tearing, modal transitions).
- Remove `will-change` once animations complete.

### Asynchronous Image Decoding
Animated GIFs and sprites must not block the main JavaScript thread during turn rendering.
```html
<img src={spriteUrl} loading="eager" decoding="async" />
```
- `decoding="async"` ensures image decompression happens on a background thread.

### Content Visibility for Catalog Modals
Large lists (such as the 50-card cosmetic wardrobe or Pokédex roster) should use:
```css
.content-auto {
  content-visibility: auto;
  contain-intrinsic-size: 1px 250px;
}
```
Browsers skip rendering off-screen cards until scrolled into view, reducing initial modal paint time by up to 70%.

---

## 6. Bundle Splitting & Mobile Memory Limits

### Code Splitting Modals with `React.lazy`
Users open the app to battle Champion Red immediately; they do not need the Wardrobe, Gacha Pack opening engine, or Multiplayer Roadmap on initial render.
- Modals are split into separate JS chunks using `React.lazy(() => import(...))`.
- Initial mobile payload drops significantly, achieving Sub-1-second Time-to-Interactive (TTI) on mobile cellular connections.

---

## 7. Mobile Ergonomics & Thumb Zone Design

- **The Thumb Zone Rule**: The most frequent actions (Moves 1-4, Switch, Pack Open) are positioned in the bottom 40% of the viewport.
- **Minimum Touch Targets**: All action buttons maintain a minimum bounding box of $44\text{px} \times 44\text{px}$ to prevent mis-clicks on small smartphone screens.
- **Single-Screen Fit**: The arena layout uses percentage-based sprite scaling (`max-h-[14vh]` to `max-h-[16vh]`) to guarantee zero scrolling during combat.
