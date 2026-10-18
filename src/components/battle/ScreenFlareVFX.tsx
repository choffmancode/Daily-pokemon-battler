/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserCosmeticInventory } from '../../game/types';

interface ScreenFlareVFXProps {
  inventory: UserCosmeticInventory;
  isActive: boolean; // Active when critical hit, super effective move, or manual preview triggers
}

/**
 * Combat Screen Flare & Impact Overlay System
 * Flashes cinematic 2000s anime speedlines, holographic gold foil borders,
 * or anamorphic lens flares during high-impact battle moments!
 */
export const ScreenFlareVFX: React.FC<ScreenFlareVFXProps> = ({
  inventory,
  isActive,
}) => {
  if (!isActive) return null;

  const flareId = inventory.screenFlare || 'card_flare_manga';

  if (flareId === 'card_flare_holo') {
    /* HOLOGRAPHIC GOLD FOIL BORDER SHIMMER */
    return (
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden animate-pulse">
        {/* Shimmering Prismatic Holographic Border Frame */}
        <div className="absolute inset-0 border-4 border-amber-400 shadow-[inset_0_0_30px_rgba(251,191,36,0.6)]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-300 to-cyan-400 animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-500 animate-pulse" />
        {/* Corner Holographic Diamond Glints */}
        <div className="absolute top-2 left-2 text-amber-300 text-lg animate-ping">✦</div>
        <div className="absolute top-2 right-2 text-cyan-300 text-lg animate-ping">✦</div>
        <div className="absolute bottom-2 left-2 text-rose-300 text-lg animate-ping">✦</div>
        <div className="absolute bottom-2 right-2 text-yellow-300 text-lg animate-ping">✦</div>
      </div>
    );
  }

  if (flareId === 'card_flare_lens') {
    /* ANAMORPHIC HORIZONTAL NEON LENS FLARE STREAK */
    return (
      <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
        {/* Horizontal Cyan / Gold Anamorphic Laser Streak */}
        <div className="w-full h-1 bg-cyan-300 shadow-[0_0_20px_#22d3ee] animate-pulse" />
        <div className="absolute w-3/4 h-3 bg-gradient-to-r from-transparent via-amber-300 to-transparent blur-xs animate-ping" />
        {/* Center Flare Burst */}
        <div className="absolute w-32 h-32 rounded-full bg-cyan-400/40 blur-xl animate-pulse" />
        <div className="absolute w-12 h-12 rounded-full bg-white blur-xs animate-ping" />
      </div>
    );
  }

  if (flareId === 'card_flare_comic_pow') {
    /* POP-ART COMIC STARBURST & ACTION FLASH */
    return (
      <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-yellow-500/20 mix-blend-overlay" />
        {/* Dynamic Halftone Comic Star Explosion */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center animate-ping">
          <svg viewBox="0 0 100 100" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_#ef4444]">
            <polygon
              points="50,5 60,30 85,15 75,40 100,50 75,60 85,85 60,70 50,95 40,70 15,85 25,60 0,50 25,40 15,15 40,30"
              fill="#fbbf24"
              stroke="#dc2626"
              strokeWidth="2.5"
            />
            <polygon
              points="50,15 58,35 78,25 70,43 90,50 70,57 78,75 58,65 50,85 42,65 22,75 30,57 10,50 30,43 22,25 42,35"
              fill="#ef4444"
            />
            <text x="50" y="55" fontSize="11" fill="#ffffff" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontWeight="bold">
              CRITICAL!
            </text>
          </svg>
        </div>
      </div>
    );
  }

  /* RETRO MANGA RADIAL ACTION SPEEDLINES (Default) */
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden opacity-45 mix-blend-screen animate-pulse">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full object-cover"
      >
        <defs>
          <radialGradient id="speedlineCenterFade" cx="50%" cy="50%" r="50%">
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </radialGradient>
        </defs>
        {/* Radial Speedline Spikes Converging to Center */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 50 + Math.cos(angle) * 22;
          const y1 = 50 + Math.sin(angle) * 22;
          const x2 = 50 + Math.cos(angle) * 70;
          const y2 = 50 + Math.sin(angle) * 70;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#speedlineCenterFade)"
              strokeWidth={i % 2 === 0 ? '1.5' : '0.8'}
            />
          );
        })}
      </svg>
    </div>
  );
};
