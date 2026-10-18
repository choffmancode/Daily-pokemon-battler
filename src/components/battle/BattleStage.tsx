/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pokemon, UserCosmeticInventory } from '../../game/types';
import { BattleStatPlate } from './BattleStatPlate';
import { MoveVFX, ActiveMoveVFX, FloatingDamageIndicator } from './MoveVFX';
import { PokemonCosmeticLayer, BattleStageAuraLayer } from './BattleCosmetics';
import { TrainerBattleSprite } from './TrainerBattleSprite';
import { PokeballEntranceVFX } from './PokeballEntranceVFX';
import { ScreenFlareVFX } from './ScreenFlareVFX';

interface BattleStageProps {
  playerMon: Pokemon;
  opponentMon: Pokemon;
  playerRemaining: number;
  opponentRemaining: number;
  inventory: UserCosmeticInventory;
  isAwaitingPlayerInput: boolean;
  onOpenSummary: (mon: Pokemon, isOpponent: boolean) => void;
  activeVFX: ActiveMoveVFX | null;
  floatingDamage: FloatingDamageIndicator | null;
  playerAnimClass?: string;
  opponentAnimClass?: string;
  isScreenFlareActive?: boolean;
  onOpenWardrobe?: () => void;
  backgroundUrl?: string;
}

/**
 * Pixel-Art Oval Grass & Stone Stadium Pedestal SVG (Matches Battle Screen v4 Mockup)
 */
const GbaStadiumPedestalSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 220 56"
    preserveAspectRatio="none"
    shapeRendering="crispEdges"
    className={`pointer-events-none select-none ${className}`}
  >
    {/* Deep Ground Shadow */}
    <ellipse cx="110" cy="36" rx="108" ry="18" fill="#040c10" />
    {/* Dark Stone Platform Rim */}
    <ellipse cx="110" cy="31" rx="106" ry="20" fill="#2c3c28" />
    {/* Mid Stone Bevel */}
    <ellipse cx="110" cy="28" rx="102" ry="18" fill="#586850" />
    {/* Inner Sage-Stone Ring */}
    <ellipse cx="110" cy="26" rx="96" ry="16" fill="#788868" />
    {/* Emerald Turf Outer Ring */}
    <ellipse cx="110" cy="25" rx="88" ry="14" fill="#487840" />
    {/* Bright Sage Grass Center Turf */}
    <ellipse cx="110" cy="24" rx="78" ry="12" fill="#689858" />
    {/* Pixel Stone Rim Notches */}
    <rect x="26" y="34" width="10" height="4" fill="#3c4c38" />
    <rect x="64" y="40" width="14" height="4" fill="#3c4c38" />
    <rect x="104" y="42" width="16" height="4" fill="#3c4c38" />
    <rect x="148" y="40" width="14" height="4" fill="#3c4c38" />
    <rect x="182" y="34" width="10" height="4" fill="#3c4c38" />
  </svg>
);

const BattleStageComponent: React.FC<BattleStageProps> = ({
  playerMon,
  opponentMon,
  playerRemaining,
  opponentRemaining,
  inventory,
  isAwaitingPlayerInput,
  onOpenSummary,
  activeVFX,
  floatingDamage,
  playerAnimClass = '',
  opponentAnimClass = '',
  isScreenFlareActive = false,
  backgroundUrl,
}) => {
  return (
    <div className="relative z-10 flex-1 min-h-[156px] w-full overflow-hidden select-none">
      {/* Traditional Ukiyo-e Woodblock Landscape Background Layer (Strictly behind platforms, trainers & Pokémon) */}
      {backgroundUrl ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={backgroundUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center pixelated select-none"
          />
          {/* Subtle top/bottom vignette at stage edges so floating GBA UI plates pop cleanly */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,24,32,0.35) 0%, rgba(8,24,32,0.08) 22%, rgba(8,24,32,0.08) 78%, rgba(8,24,32,0.38) 100%)',
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 80%, transparent 18px, #183848 19px, #183848 21px, transparent 22px), radial-gradient(circle at 75% 60%, transparent 24px, #183848 25px, #183848 27px, transparent 28px)',
            backgroundSize: '96px 48px',
          }}
        />
      )}

      {/* Background Stage Aura Layer */}
      <BattleStageAuraLayer inventory={inventory} />

      {/* Cinematic Screen Flare VFX */}
      <ScreenFlareVFX inventory={inventory} isActive={isScreenFlareActive} />

      {/* ===================================================================
          QUADRANT 1 (Top-Left): Opponent Stat Plate
         =================================================================== */}
      <div className="absolute top-1.5 left-1 z-20">
        <BattleStatPlate
          pokemon={opponentMon}
          isOpponent={true}
          remainingCount={opponentRemaining}
          totalCount={6}
          onOpenSummary={onOpenSummary}
        />
      </div>

      {/* ===================================================================
          QUADRANT 2 (Top-Right): Opponent Pedestal + Opponent Pokémon + Champion
         =================================================================== */}
      <div className="absolute top-0.5 right-1 flex items-end justify-center pr-1.5 pb-2 min-w-[162px] xs:min-w-[175px] z-10">
        {/* Oval Grass & Stone Pedestal */}
        <GbaStadiumPedestalSVG className="absolute bottom-0 right-0 w-[166px] xs:w-[180px] sm:w-[192px] h-[38px] sm:h-[42px] z-0" />

        {/* Opponent Pokémon Front Sprite */}
        <div
          onClick={() => onOpenSummary(opponentMon, true)}
          title={`Inspect ${opponentMon.species}`}
          className="relative z-10 flex flex-col items-center cursor-pointer active:scale-95 transition-transform mr-1"
        >
          {opponentMon.substituteHp && opponentMon.substituteHp > 0 ? (
            <span className="absolute -top-2.5 px-1 py-[1px] bg-[#306850] border border-[#e0f8d0] font-pixel text-[6px] text-[#e0f8d0] z-20">
              SUB {opponentMon.substituteHp}
            </span>
          ) : null}
          <div className={opponentAnimClass}>
            <img
              src={opponentMon.spriteFront}
              alt={opponentMon.species}
              loading="eager"
              decoding="async"
              className="w-18 h-18 xs:w-20 xs:h-20 sm:w-24 sm:h-24 object-contain pixelated drop-shadow-[2px_3px_0_rgba(8,24,32,0.85)] select-none"
            />
          </div>
        </div>

        {/* Champion Sprite Standing on Right Edge of Opponent Pedestal */}
        <div className="relative z-10 mb-1 ml-0.5 shrink-0">
          <TrainerBattleSprite isOpponent={true} size="md" />
        </div>
      </div>

      {/* ===================================================================
          QUADRANT 3 (Bottom-Left): Player Pedestal & Back Sprite
         =================================================================== */}
      <div className="absolute bottom-0 left-1.5 flex items-end justify-center pl-2 pb-1 min-w-[155px] xs:min-w-[168px] z-10">
        {/* Foreground Oval Grass & Stone Pedestal */}
        <GbaStadiumPedestalSVG className="absolute -bottom-1.5 left-0 w-[162px] xs:w-[176px] sm:w-[190px] h-[38px] sm:h-[42px] z-0" />

        {/* Pokéball Entrance VFX */}
        <PokeballEntranceVFX inventory={inventory} triggerKey={playerMon.species} />

        {/* Player Pokémon Cosmetic Layer */}
        <PokemonCosmeticLayer
          pokemon={playerMon}
          isOpponent={false}
          inventory={inventory}
        />

        <div
          onClick={() => onOpenSummary(playerMon, false)}
          title={`Inspect ${playerMon.species}`}
          className="relative z-10 flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
        >
          {playerMon.substituteHp && playerMon.substituteHp > 0 ? (
            <span className="absolute -top-2.5 px-1 py-[1px] bg-[#306850] border border-[#e0f8d0] font-pixel text-[6px] text-[#e0f8d0] z-20">
              SUB {playerMon.substituteHp}
            </span>
          ) : null}
          <div className={playerAnimClass}>
            <img
              src={playerMon.spriteBack}
              alt={playerMon.species}
              loading="eager"
              decoding="async"
              className="w-20 h-20 xs:w-22 xs:h-22 sm:w-26 sm:h-26 object-contain pixelated drop-shadow-[2px_3px_0_rgba(8,24,32,0.85)] select-none -mb-1"
            />
          </div>
        </div>
      </div>

      {/* ===================================================================
          QUADRANT 4 (Bottom-Right): Player Stat Plate
         =================================================================== */}
      <div className="absolute bottom-0.5 right-1 z-20">
        <BattleStatPlate
          pokemon={playerMon}
          isOpponent={false}
          remainingCount={playerRemaining}
          totalCount={6}
          isAwaitingInput={isAwaitingPlayerInput}
          onOpenSummary={onOpenSummary}
        />
      </div>

      {/* Pokémon Move VFX & Auto-Dismissing Damage Numbers */}
      <MoveVFX vfx={activeVFX} floatingDamage={floatingDamage} />
    </div>
  );
};

export const BattleStage = React.memo(BattleStageComponent);
