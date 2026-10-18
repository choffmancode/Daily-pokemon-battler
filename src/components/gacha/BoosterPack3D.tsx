/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
    <div className="flex flex-col items-center justify-center py-3 sm:py-4 px-2 text-center">
      {/* GBA Emerald Pixel-Art Booster Pack Foil Card */}
      <div
        onClick={() => onOpenPack(inventory.availablePacks <= 0)}
        className={`w-52 h-68 sm:w-56 sm:h-76 relative cursor-pointer select-none transition-transform duration-200 gba-frame-dark overflow-hidden group ${
          packStage === 'tearing' ? 'scale-95' : 'hover:scale-[1.02] active:scale-95'
        }`}
        title="Click booster pack to tear foil & reveal cards!"
      >
        {/* Top Foil Crimp Bar */}
        <div className="w-full h-6 bg-[#306850] border-b-2 border-[#88c070] flex items-center justify-between px-3 font-pixel text-[7.5px] text-[#e0f8d0]">
          <span>SERIES 1</span>
          <span>3 CARDS</span>
        </div>

        {/* Center GBA Foil Pack Body */}
        <div className="flex-1 h-[calc(100%-48px)] bg-[#183828] flex flex-col items-center justify-center p-3 relative">
          {/* Inner Cream Double-Lined Crest Frame */}
          <div className="w-16 h-16 bg-[#081820] border-2 border-[#e0f8d0] outline outline-2 outline-[#88c070] flex items-center justify-center mb-3">
            <svg width="36" height="36" viewBox="0 0 24 24" shapeRendering="crispEdges">
              <polygon points="12,1 15,8 22,11 15,14 12,21 9,14 2,11 9,8" fill="#88c070" />
              <polygon points="12,4 14,9 19,11 14,13 12,18 10,13 5,11 10,9" fill="#e0f8d0" />
            </svg>
          </div>

          <div className="gba-title-text text-[15px] sm:text-[16px] font-bold text-[#e0f8d0] tracking-wider uppercase drop-shadow-[2px_2px_0_#081820]">
            CHAMPION PACK
          </div>
          <div className="font-pixel text-[7.5px] text-[#88c070] tracking-wider mt-1">
            EMERALD EDITION
          </div>
          <div className="mt-2.5 bg-[#081820] border border-[#88c070] px-2 py-1 font-pixel text-[6.5px] text-[#e0f8d0]">
            ★ GUARANTEED HOLO ★
          </div>
        </div>

        {/* Bottom Foil Crimp Bar */}
        <div className="w-full h-6 bg-[#306850] border-t-2 border-[#88c070] flex items-center justify-center font-pixel text-[7px] text-[#e0f8d0]">
          DAILY CHAMPION TCG
        </div>

        {/* Tearing Overlay */}
        {packStage === 'tearing' && (
          <div className="absolute inset-0 bg-[#e0f8d0]/90 flex items-center justify-center z-30">
            <span className="gba-title-text text-[12px] font-bold text-[#081820] bg-[#88c070] px-3 py-1 border-2 border-[#081820]">
              TEARING FOIL...
            </span>
          </div>
        )}
      </div>

      {/* Bag Count & Action Buttons */}
      <div className="mt-3 w-full max-w-[360px] flex flex-col items-center gap-2">
        <div className="gba-frame-cream px-3 py-1 text-[#081820] gba-title-text text-[11px] font-bold">
          PACKS IN BAG: {inventory.availablePacks}
        </div>

        <div className="w-full flex flex-col gap-1.5 mt-1">
          <button
            type="button"
            onClick={() => onOpenPack(inventory.availablePacks <= 0)}
            disabled={packStage === 'tearing'}
            className="w-full gba-btn py-2.5 px-4 gba-title-text text-[12px] font-bold text-[#e0f8d0] text-center cursor-pointer"
          >
            ▶ {inventory.availablePacks > 0 ? 'TEAR & OPEN PACK [A]' : 'FREE PASS: OPEN PACK'}
          </button>

          {cooldown.isAvailable ? (
            <button
              type="button"
              onClick={onClaimDaily}
              className="w-full gba-select-btn py-2 px-4 gba-title-text text-[11px] font-bold text-center cursor-pointer"
            >
              ★ CLAIM FREE DAILY PACK
            </button>
          ) : (
            <div className="w-full bg-[#081820] border border-[#306850] py-1.5 px-3 font-pixel text-[7.5px] text-[#88c070] text-center">
              NEXT DAILY PACK: {cooldown.formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
