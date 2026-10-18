/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCosmeticInventory, EquippedTrainerConfig } from '../../game/types';
import { COSMETIC_CARDS_CATALOG } from '../../game/data/cosmetics';
import { getTrainerBase, MiniTrainerSVG } from '../../game/data/trainerRegistry';

interface TrainerBattleSpriteProps {
  isOpponent?: boolean;
  inventory?: UserCosmeticInventory;
  previewTrainer?: EquippedTrainerConfig;
  isCommanding?: boolean;
  isCheering?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

/**
 * Authentic Generation 3 Mini Battle Screen Trainer Sprite
 * Renders the chosen protagonist base (Brendan Emerald, May Emerald, Brendan RS, May RS, Red FR, Leaf LG)
 * using pixel-accurate Game Boy Advance mini sprite engine with custom hats, shirts, backpacks, shoes, badges, and auras!
 */
const TrainerBattleSpriteComponent: React.FC<TrainerBattleSpriteProps> = ({
  isOpponent = false,
  inventory,
  previewTrainer,
  isCommanding = false,
  isCheering = false,
  className = '',
  size = 'md',
  onClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Size dimensions mapping for 16x24 GBA overworld sprites (2:3 native aspect ratio)
  const sizeClasses = {
    sm: 'w-10 h-15 xs:w-12 xs:h-18', // Compact overworld battle platform scale
    md: 'w-14 h-21',                  // Standalone preview scale
    lg: 'w-20 h-30',                  // Dressing room stage scale
    xl: 'w-24 h-36',                  // Large showcase scale
  }[size];


  // If Opponent: Render Legendary Champion Cynthia in authentic Gen 3 Mini Sprite
  if (isOpponent) {
    const cynthiaConfig: EquippedTrainerConfig = {
      baseId: 'cynthia_sinnoh',
      head: 'card_cynthia_hairpins',
    };

    return (
      <div
        className={`relative flex flex-col items-center select-none ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title="Champion Cynthia: 'Before you stands the Sinnoh Champion. Show me your bond!'"
      >
        {/* Dialogue Bubble */}
        <div className="absolute -top-6 right-0 px-2 py-0.5 rounded-full bg-slate-900/95 border border-amber-400/80 text-[8px] font-pixel text-amber-300 shadow-xl whitespace-nowrap z-30">
          Show me your bond!
        </div>

        {/* Sinnoh Champion Golden Mote */}
        <div className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-amber-300/60 blur-[0.5px] animate-ping pointer-events-none" />

        {/* Champion Cynthia Authentic Mini Sprite */}
        <div className={`relative ${sizeClasses} filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.7)] group cursor-pointer transition-transform duration-150 active:scale-95`}>
          <MiniTrainerSVG config={cynthiaConfig} posture="idle" />
        </div>

        <div className="text-[7.5px] font-pixel text-amber-400 mt-0.5 tracking-wider font-semibold">
          CHAMPION CYNTHIA
        </div>
      </div>
    );
  }

  // PLAYER TRAINER: Active or Previewed Customization
  const trainerConfig: EquippedTrainerConfig = previewTrainer || inventory?.equippedTrainer || {
    baseId: 'brendan_emerald',
    head: 'card_brendan_emerald_cap',
    outfit: 'card_brendan_emerald_suit',
    backpack: 'card_adventurer_rucksack',
    shoes: 'card_emerald_runners',
    badge: 'card_kanto_rainbow_brooch',
  };

  const base = getTrainerBase(trainerConfig.baseId);

  const headCard = trainerConfig.head ? COSMETIC_CARDS_CATALOG.find((c) => c.id === trainerConfig.head) : null;
  const outfitCard = trainerConfig.outfit ? COSMETIC_CARDS_CATALOG.find((c) => c.id === trainerConfig.outfit) : null;
  const backpackCard = trainerConfig.backpack ? COSMETIC_CARDS_CATALOG.find((c) => c.id === trainerConfig.backpack) : null;
  const shoesCard = trainerConfig.shoes ? COSMETIC_CARDS_CATALOG.find((c) => c.id === trainerConfig.shoes) : null;
  const badgeCard = trainerConfig.badge ? COSMETIC_CARDS_CATALOG.find((c) => c.id === trainerConfig.badge) : null;
  const auraCard = trainerConfig.aura ? COSMETIC_CARDS_CATALOG.find((c) => c.id === trainerConfig.aura) : null;

  // Determine posture: commanding (when awaiting player turn input), cheering (on crit / knockout), or idle
  const posture = isCheering ? 'cheering' : isCommanding ? 'commanding' : 'idle';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative flex flex-col items-center select-none group cursor-pointer ${className}`}
      title="Click to open Custom Sprite Studio"
    >
      {/* Turn Command Dialogue or Cheering Emote */}
      {isCommanding && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400/80 text-[7.5px] font-pixel text-emerald-300 shadow-xl whitespace-nowrap z-30 animate-bounce">
          Go! Take the summit!
        </div>
      )}
      {isCheering && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-400/80 text-[7.5px] font-pixel text-amber-300 shadow-xl whitespace-nowrap z-30 animate-bounce">
          Critical hit! ★
        </div>
      )}

      {/* Main Mini Trainer Figure */}
      <div
        className={`relative ${sizeClasses} filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)] transition-transform duration-150 group-hover:scale-105 active:scale-95 ${
          posture === 'idle' ? 'hover:-translate-y-0.5' : ''
        }`}
      >
        <MiniTrainerSVG
          config={trainerConfig}
          posture={posture}
          paletteOverrides={trainerConfig.customPalette ? {
            ...(trainerConfig.customPalette.skin ? { s: trainerConfig.customPalette.skin } : {}),
            ...(trainerConfig.customPalette.hair ? { K: trainerConfig.customPalette.hair, B: trainerConfig.customPalette.hair } : {}),
          } : undefined}
        />
      </div>

      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md z-50 pointer-events-none text-left">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[9px] font-pixel text-amber-300 font-bold">{base.name}</span>
            <span className="text-[7.5px] text-slate-400">{base.region}</span>
          </div>

          <div className="mt-1.5 space-y-1 text-[8px]">
            {headCard && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Hat:</span>
                <span className="text-amber-200 truncate max-w-[110px]">{headCard.name.split(' (')[0]}</span>
              </div>
            )}
            {outfitCard && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Shirt:</span>
                <span className="text-emerald-300 truncate max-w-[110px]">{outfitCard.name.split(' (')[0]}</span>
              </div>
            )}
            {backpackCard && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Backpack:</span>
                <span className="text-blue-300 truncate max-w-[110px]">{backpackCard.name.split(' (')[0]}</span>
              </div>
            )}
            {shoesCard && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Shoes:</span>
                <span className="text-rose-300 truncate max-w-[110px]">{shoesCard.name.split(' (')[0]}</span>
              </div>
            )}
            {badgeCard && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Badge:</span>
                <span className="text-yellow-300 truncate max-w-[110px]">{badgeCard.name.split(' (')[0]}</span>
              </div>
            )}
            {auraCard && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Aura:</span>
                <span className="text-cyan-300 truncate max-w-[110px]">{auraCard.name.split(' (')[0]}</span>
              </div>
            )}
          </div>

          <div className="mt-1 pt-1 border-t border-slate-800 text-[7px] text-center text-slate-400 font-pixel">
            [Click to open Custom Sprite Studio]
          </div>
        </div>
      )}
    </div>
  );
};

export const TrainerBattleSprite = React.memo(TrainerBattleSpriteComponent);
