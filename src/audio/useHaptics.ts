/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Mobile Haptics Engine for Web Devices
 * Safely wraps navigator.vibrate with capability checks and gentle power throttling.
 */
export const haptics = {
  isSupported: typeof navigator !== 'undefined' && 'vibrate' in navigator,

  // Gentle light tick on button taps and menu selection
  tap() {
    if (this.isSupported) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  },

  // Medium thud on normal attack damage
  hit() {
    if (this.isSupported) {
      try {
        navigator.vibrate(24);
      } catch {}
    }
  },

  // Heavy multi-burst for super-effective or critical strikes
  heavyHit() {
    if (this.isSupported) {
      try {
        navigator.vibrate([35, 30, 50]);
      } catch {}
    }
  },

  // Textured staggered vibration simulating booster pack foil tearing
  packTear() {
    if (this.isSupported) {
      try {
        navigator.vibrate([20, 15, 30, 15, 60]);
      } catch {}
    }
  },

  // Shimmer pulse for rare/secret rare pulls
  rareShimmer() {
    if (this.isSupported) {
      try {
        navigator.vibrate([15, 20, 25, 20, 35]);
      } catch {}
    }
  },

  // Double pulse on invalid move or faint
  faint() {
    if (this.isSupported) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {}
    }
  },
};
