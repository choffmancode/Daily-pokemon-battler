/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { UserCosmeticInventory } from '../../game/types';

interface PokeballEntranceVFXProps {
  inventory: UserCosmeticInventory;
  triggerKey: string | number; // Re-triggers animation when key changes (e.g., on switch)
}

/**
 * Animated Pokéball Summoning Entrance Burst
 * Renders the equipped Pokéball Entrance FX whenever a Pokémon steps onto the battle turf.
 */
export const PokeballEntranceVFX: React.FC<PokeballEntranceVFXProps> = ({
  inventory,
  triggerKey,
}) => {
  const [isActive, setIsActive] = useState(true);

  const ballEffectId = inventory.ballEffect || 'card_ball_premier';

  useEffect(() => {
    setIsActive(true);
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {/* Central Expanding Light Beam */}
      <div className="absolute w-2 h-32 bg-gradient-to-t from-white via-amber-200 to-transparent blur-xs animate-ping opacity-80" />

      {/* Specific Pokéball Custom FX */}
      {ballEffectId === 'card_ball_master' || ballEffectId === 'card_ball_master_holo' ? (
        /* MASTER BALL: Cosmic Violet Gravitational Singularity */
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-700/60 via-fuchsia-600/40 to-transparent blur-md animate-ping" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-purple-400 animate-spin" />
          <div className="absolute w-36 h-12 rounded-full border border-pink-400/80 -rotate-12 animate-pulse" />
          <div className="absolute text-yellow-300 text-lg animate-bounce">✦</div>
          <div className="absolute -top-3 left-4 text-purple-300 text-sm">✧</div>
          <div className="absolute -bottom-3 right-6 text-fuchsia-300 text-base">★</div>
        </div>
      ) : ballEffectId === 'card_ball_luxury' ? (
        /* LUXURY BALL: Royal Golden Ribbon Cascade & Shimmering Gold Coins */
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-transparent blur-md animate-pulse" />
          {/* Spiraling Ribbon Rings */}
          <div className="absolute w-32 h-16 rounded-full border-2 border-amber-300 rotate-45 animate-spin" />
          <div className="absolute w-32 h-16 rounded-full border-2 border-yellow-200 -rotate-45 animate-spin" />
          {/* Gold Sparkle Diamonds */}
          <div className="absolute -top-4 text-amber-200 text-lg animate-bounce">◆</div>
          <div className="absolute bottom-1 -left-4 text-yellow-300 text-sm animate-ping">✦</div>
          <div className="absolute top-2 -right-4 text-amber-400 text-base animate-pulse">◆</div>
        </div>
      ) : ballEffectId === 'card_ball_dusk' ? (
        /* DUSK BALL: Umbral Shadow Mist & Emerald Wisp */
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-900/60 via-purple-950/60 to-slate-950 blur-lg animate-pulse" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-emerald-500/50 animate-ping" />
          <div className="absolute -top-2 left-6 text-emerald-400 text-xs">▲</div>
          <div className="absolute bottom-2 right-6 text-purple-400 text-xs">▼</div>
        </div>
      ) : ballEffectId === 'card_ball_cherish' ? (
        /* CHERISH BALL: Flurry of Pink Sakura Blossoms */
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 via-pink-400/20 to-transparent blur-md animate-pulse" />
          <div className="absolute -top-3 left-3 text-pink-300 text-sm animate-bounce">🌸</div>
          <div className="absolute -top-1 right-2 text-rose-300 text-base animate-spin">🌸</div>
          <div className="absolute bottom-1 -left-2 text-pink-400 text-xs animate-pulse">🌸</div>
          <div className="absolute -bottom-3 right-4 text-pink-200 text-sm animate-bounce">🌸</div>
          <div className="absolute w-24 h-24 rounded-full border border-rose-300/60 animate-ping" />
        </div>
      ) : ballEffectId === 'card_ball_quick' ? (
        /* QUICK BALL: Electro-Sonic Lightning Radial Explosion */
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-ping" />
          <div className="absolute w-36 h-36 rounded-full border-2 border-yellow-300/80 animate-ping" />
          <div className="absolute -top-4 text-yellow-300 text-base animate-pulse">⚡</div>
          <div className="absolute bottom-0 -left-4 text-cyan-300 text-base animate-bounce">⚡</div>
          <div className="absolute top-2 -right-4 text-yellow-200 text-lg animate-ping">⚡</div>
        </div>
      ) : ballEffectId === 'card_ball_heavy' ? (
        /* HEAVY BALL: Seismic Ground Tremor & Boulder Cracking Shockwave */
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-stone-700/30 blur-md animate-ping" />
          <div className="absolute w-36 h-14 rounded-full border-2 border-stone-400 -bottom-2 animate-pulse" />
          <div className="absolute -top-3 text-stone-300 text-base animate-bounce">🪨</div>
          <div className="absolute bottom-1 -left-3 text-stone-400 text-sm animate-bounce">⛰️</div>
          <div className="absolute top-1 -right-3 text-stone-300 text-sm animate-ping">🪨</div>
          <div className="absolute w-28 h-28 rounded-full border border-amber-600/50 animate-ping" />
        </div>
      ) : (
        /* PREMIER BALL / DEFAULT: Platinum Supernova White Flash */
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/40 blur-md animate-ping" />
          <div className="absolute w-28 h-28 rounded-full border-2 border-slate-100 animate-ping" />
          <div className="absolute text-white text-xl animate-spin">✧</div>
          <div className="absolute -top-2 left-2 text-red-400 text-sm animate-bounce">✦</div>
          <div className="absolute -bottom-2 right-2 text-slate-200 text-sm animate-pulse">✦</div>
        </div>
      )}
    </div>
  );
};
