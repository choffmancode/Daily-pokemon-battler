/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Package, ShieldAlert, Zap } from 'lucide-react';
import { UserCosmeticInventory } from '../../game/types';

interface BoosterPack3DProps {
  packStage: 'idle' | 'tearing' | 'revealed';
  inventory: UserCosmeticInventory;
  cooldown: { isAvailable: boolean; remainingMs: number; formattedTime: string };
  onOpenPack: (isAdminBypass?: boolean) => void;
  onClaimDaily: () => void;
}

export const BoosterPack3D: React.FC<BoosterPack3DProps> = ({
  packStage,
  inventory,
  cooldown,
  onOpenPack,
  onClaimDaily,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-4 text-center">
      {/* 3D TCG Booster Pack Graphic */}
      <div
        onClick={() => onOpenPack(inventory.availablePacks <= 0)}
        className={`w-52 h-72 sm:w-60 sm:h-84 rounded-2xl relative cursor-pointer select-none transition-all duration-300 shadow-2xl overflow-hidden group perspective ${
          packStage === 'tearing' ? 'scale-95 blur-[1px]' : 'hover:scale-105 active:scale-95'
        }`}
        title="Click booster pack to tear foil & reveal cards!"
      >
        {/* Foil Shimmer Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600 via-amber-500 to-blue-700 border-4 border-amber-300 rounded-2xl shadow-inner" />

        {/* Dynamic Holographic Foil Sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Pack Top Crimped Foil Edge */}
        <div className="absolute top-0 left-0 right-0 h-6 pkmn-booster-crimp bg-amber-300/40 border-b border-amber-200/60 flex items-center justify-between px-3 text-[9px] font-pixel text-slate-900">
          <span>SERIES 1</span>
          <span>5 CARDS</span>
        </div>

        {/* Center Pokémon Crest / TCG Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/80 border-2 border-yellow-300 flex items-center justify-center mb-2 shadow-lg group-hover:rotate-6 transition-transform">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse" />
          </div>

          <div className="font-pixel text-base sm:text-lg tracking-wider text-yellow-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            CHAMPION PACK
          </div>
          <div className="text-[9px] sm:text-[10px] font-pixel text-amber-100 tracking-wide mt-1">
            SINNOH EDITION
          </div>
          <div className="text-[8px] sm:text-[9px] text-slate-200 mt-2 font-pixel bg-slate-950/90 px-2 py-1 rounded border border-slate-700">
            ★ GUARANTEED HOLO ★
          </div>
        </div>

        {/* Pack Bottom Crimped Foil Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-6 pkmn-booster-crimp bg-amber-300/40 border-t border-amber-200/60 flex items-center justify-center text-[8px] font-pixel text-slate-900">
          POKÉMON 2000s TCG
        </div>

        {/* Tearing Slice Animation Layer */}
        {packStage === 'tearing' && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-30 animate-pulse">
            <span className="font-pixel text-xs sm:text-sm text-slate-950 bg-yellow-300 px-3 py-1 rounded border-2 border-black">
              TEARING FOIL...
            </span>
          </div>
        )}
      </div>

      {/* Bag Count & Cooldown Status */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-pixel text-slate-300">
          <Package className="w-4 h-4 text-amber-400" />
          <span>PACKS IN BAG:</span>
          <span className="font-bold text-amber-300 text-sm sm:text-base tabular-nums">
            {inventory.availablePacks}
          </span>
        </div>

        {/* PROMINENT ACTION BUTTONS FOR OPENING PACKS */}
        <div className="flex items-center gap-2.5 mt-2 flex-wrap justify-center">
          {/* 1. Primary Open Button */}
          {inventory.availablePacks > 0 ? (
            <button
              onClick={() => onOpenPack(false)}
              disabled={packStage === 'tearing'}
              className="pkmn-btn pkmn-btn-gold px-6 py-3 text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-current" />
              <span>TEAR & OPEN PACK [A]</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenPack(true)}
              disabled={packStage === 'tearing'}
              className="pkmn-btn pkmn-btn-gold px-5 py-2.5 text-xs flex items-center gap-2 shadow-xl hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>FREE PASS: OPEN NOW</span>
            </button>
          )}

          {/* 2. Claim Free Daily Pack Button */}
          {cooldown.isAvailable ? (
            <button
              onClick={onClaimDaily}
              className="pkmn-btn pkmn-btn-emerald px-5 py-2.5 text-xs flex items-center gap-2 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>CLAIM FREE DAILY PACK</span>
            </button>
          ) : (
            <div className="px-3 py-2 rounded pkmn-frame-dark text-[10px] font-pixel text-slate-400 flex items-center gap-1.5">
              <span>NEXT DAILY:</span>
              <span className="font-bold text-amber-300">{cooldown.formattedTime}</span>
            </div>
          )}

          {/* 3. Admin Instant Open Pass */}
          <button
            onClick={() => onOpenPack(true)}
            disabled={packStage === 'tearing'}
            title="Instant Open Pass: Open unlimited packs without consuming cooldown"
            className="pkmn-btn pkmn-btn-red px-3.5 py-2 text-[10px] sm:text-xs flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-300" />
            <span>ADMIN: FREE OPEN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
