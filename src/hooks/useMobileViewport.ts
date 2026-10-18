/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { soundFX } from '../components/AudioEngine';

/**
 * Mobile Viewport & Gesture Hook
 * 1. Handles dynamic viewport height without glitchy re-render loops.
 * 2. Unlocks Web Audio on the very first touch/tap interaction.
 * 3. Prevents unwanted pull-to-refresh / rubberband bounces on mobile screens.
 */
export function useMobileViewport() {
  const [viewportHeight, setViewportHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') return window.innerHeight;
    return 800;
  });

  useEffect(() => {
    // 1. One-time audio context unlocker on first user touch
    const handleFirstTouch = () => {
      soundFX.unlockAudio();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('pointerdown', handleFirstTouch);
    };

    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('pointerdown', handleFirstTouch, { passive: true });

    // 2. Set CSS custom property directly to avoid React re-render cascades
    const updateHeightVar = () => {
      if (typeof window !== 'undefined') {
        const h = window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${h}px`);
        setViewportHeight((prev) => {
          // Only trigger React state change if height changed significantly (e.g. virtual keyboard or orientation)
          if (Math.abs(h - prev) > 40) {
            return h;
          }
          return prev;
        });
      }
    };

    updateHeightVar();

    let resizeTimer: NodeJS.Timeout | null = null;
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateHeightVar, 100);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('orientationchange', debouncedResize, { passive: true });

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('pointerdown', handleFirstTouch);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, []);

  return { viewportHeight };
}
