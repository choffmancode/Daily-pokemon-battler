/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PokemonType } from '../../game/types';

export interface ActiveMoveVFX {
  id: string;
  moveName: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  targetSide: 'player' | 'opponent';
}

export interface FloatingDamageIndicator {
  id: string;
  side: 'player' | 'opponent';
  damage: number;
  isCrit?: boolean;
  effectiveness?: number;
}

interface MoveVFXProps {
  vfx: ActiveMoveVFX | null;
  floatingDamage: FloatingDamageIndicator | null;
}

/**
 * MoveVFX - Pokémon Showdown Inspired Move & Impact Visual Effects
 * Renders elemental particle bursts, slashes, zaps, waves, and floating damage numbers.
 */
export const MoveVFX: React.FC<MoveVFXProps> = ({ vfx, floatingDamage }) => {
  return (
    <>
      {/* Floating Damage Number & Effectiveness Banner */}
      {floatingDamage && (
        <div
          key={floatingDamage.id}
          className={`absolute z-40 pointer-events-none anim-float-damage flex flex-col items-center ${
            floatingDamage.side === 'opponent'
              ? 'top-[16%] right-[18%] sm:right-[22%]'
              : 'bottom-[32%] left-[16%] sm:left-[22%]'
          }`}
        >
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-950/90 border border-red-500/80 shadow-2xl shadow-red-500/50">
            <span className="font-artdeco font-black text-sm xs:text-base sm:text-lg text-rose-400 tabular-nums">
              -{floatingDamage.damage} HP
            </span>
          </div>

          {/* Critical Hit / Super Effective Badges */}
          <div className="flex gap-1 mt-0.5 whitespace-nowrap">
            {floatingDamage.isCrit && (
              <span className="text-[8px] xs:text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-bold font-artdeco shadow animate-pulse">
                CRITICAL!
              </span>
            )}
            {floatingDamage.effectiveness && floatingDamage.effectiveness > 1 && (
              <span className="text-[8px] xs:text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-stone-950 font-bold font-artdeco shadow">
                SUPER EFFECTIVE! ({floatingDamage.effectiveness}x)
              </span>
            )}
            {floatingDamage.effectiveness !== undefined &&
              floatingDamage.effectiveness < 1 &&
              floatingDamage.effectiveness > 0 && (
                <span className="text-[8px] xs:text-[9px] px-1.5 py-0.2 rounded bg-stone-700 text-stone-200 font-bold font-artdeco shadow">
                  RESISTED ({floatingDamage.effectiveness}x)
                </span>
              )}
            {floatingDamage.effectiveness === 0 && (
              <span className="text-[8px] xs:text-[9px] px-1.5 py-0.2 rounded bg-stone-900 border border-stone-600 text-stone-400 font-bold font-artdeco shadow">
                NO EFFECT (0x)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active Elemental Move VFX positioned on Defender */}
      {vfx && (
        <div
          key={vfx.id}
          className={`absolute z-35 pointer-events-none flex items-center justify-center ${
            vfx.targetSide === 'opponent'
              ? 'top-[12%] right-[12%] sm:right-[18%] w-24 h-24 sm:w-36 sm:h-36'
              : 'bottom-[24%] left-[10%] sm:left-[16%] w-28 h-28 sm:w-40 sm:h-40'
          }`}
        >
          {/* Electric (Thunderbolt, Thunder, Volt Tackle) */}
          {vfx.type === 'Electric' && (
            <div className="relative w-full h-full flex items-center justify-center anim-lightning">
              <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-300 drop-shadow-[0_0_15px_#fde047]">
                <polygon
                  points="55,0 20,55 45,55 35,100 80,45 55,45"
                  fill="currentColor"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
            </div>
          )}

          {/* Fire (Flamethrower, Fire Blast, Flare Blitz) */}
          {vfx.type === 'Fire' && (
            <div className="relative w-full h-full flex items-center justify-center anim-flame">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-300 blur-[2px] opacity-90 shadow-[0_0_30px_#ea580c]" />
              <div className="absolute text-2xl sm:text-4xl animate-bounce">🔥</div>
            </div>
          )}

          {/* Water (Hydro Pump, Surf, Water Pulse) */}
          {vfx.type === 'Water' && (
            <div className="relative w-full h-full flex items-center justify-center anim-wave">
              <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 drop-shadow-[0_0_15px_#0284c7]">
                <path
                  d="M10,80 Q30,20 50,70 T90,50 T100,90 Z"
                  fill="currentColor"
                  opacity="0.85"
                />
              </svg>
              <div className="absolute text-xl sm:text-3xl">🌊</div>
            </div>
          )}

          {/* Ice (Blizzard, Ice Beam) */}
          {vfx.type === 'Ice' && (
            <div className="relative w-full h-full flex items-center justify-center anim-lightning">
              <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-cyan-200 rotate-45 rounded-lg bg-cyan-400/30 backdrop-blur-xs shadow-[0_0_25px_#22d3ee]" />
              <div className="absolute text-xl sm:text-3xl animate-spin">❄️</div>
            </div>
          )}

          {/* Grass (Razor Leaf, Giga Drain, Solar Beam) */}
          {vfx.type === 'Grass' && (
            <div className="relative w-full h-full flex items-center justify-center anim-leaf">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-emerald-400" />
              <div className="absolute text-xl sm:text-3xl">🍃</div>
              <div className="absolute text-lg sm:text-2xl -top-2 right-2">🌱</div>
            </div>
          )}

          {/* Psychic (Psychic, Psyshock, Rest) */}
          {vfx.type === 'Psychic' && (
            <div className="relative w-full h-full flex items-center justify-center anim-psychic">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-fuchsia-400/80 bg-purple-600/20 shadow-[0_0_30px_#c026d3]" />
              <div className="absolute text-xl sm:text-3xl">👁️</div>
            </div>
          )}

          {/* Normal, Fighting, Flying, Ground, Rock, Steel, Dark, Dragon, Bug, Poison, Ghost */}
          {!['Electric', 'Fire', 'Water', 'Ice', 'Grass', 'Psychic'].includes(vfx.type) && (
            <div className="relative w-full h-full flex items-center justify-center anim-slash">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <line x1="15" y1="15" x2="85" y2="85" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
                <line x1="35" y1="10" x2="90" y2="65" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div className="absolute w-12 h-12 rounded-full bg-white/40 blur-xs" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
