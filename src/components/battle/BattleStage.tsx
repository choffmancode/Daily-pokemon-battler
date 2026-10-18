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
}

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
  onOpenWardrobe,
}) => {
  return (
    <div className="relative z-10 flex-1 min-h-0 w-full max-w-4xl mx-auto flex flex-col justify-between py-1 sm:py-3 overflow-hidden select-none">
      {/* Background Stage Aura Layer */}
      <BattleStageAuraLayer inventory={inventory} />

      {/* Cinematic Screen Flare VFX (Manga Speedlines, Gold Holo Foil, Anamorphic Streak) */}
      <ScreenFlareVFX inventory={inventory} isActive={isScreenFlareActive} />

      {/* Opponent Row (Top Right in Classic Pokémon Battle Perspective) */}
      <div className="relative flex items-center justify-end gap-2 sm:gap-4 pr-2 sm:pr-8 pt-1">
        <BattleStatPlate
          pokemon={opponentMon}
          isOpponent={true}
          remainingCount={opponentRemaining}
          totalCount={6}
          onOpenSummary={onOpenSummary}
        />

        {/* Opponent Sprite Platform & Champion Cynthia */}
        <div className="relative flex items-end gap-1.5 shrink-0">
          {/* Opponent Pokémon & Platform */}
          <div
            onClick={() => onOpenSummary(opponentMon, true)}
            title={`Click to inspect Champion Cynthia's ${opponentMon.species} [ 鑑 ]`}
            className="relative flex flex-col items-center shrink-0 cursor-pointer group active:scale-95 transition-transform"
          >
            {/* Authentic Opponent Battle Platform Pedestal */}
            <div className="absolute -bottom-2 sm:-bottom-3 w-28 xs:w-36 sm:w-48 h-10 sm:h-14 pkmn-platform-opponent pointer-events-none -z-10" />

            <div className={`${opponentAnimClass}`}>
              <img
                src={opponentMon.spriteFront}
                alt={opponentMon.species}
                loading="eager"
                decoding="async"
                className="w-18 h-18 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 max-h-[17vh] object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform select-none relative z-10"
              />
            </div>
          </div>

          {/* Champion Cynthia Active Trainer Sprite on Opponent Platform */}
          <div className="flex mb-1 shrink-0 scale-90 xs:scale-100 origin-bottom select-none">
            <TrainerBattleSprite isOpponent={true} size="sm" />
          </div>
        </div>
      </div>

      {/* Player Active Pokémon Row (Bottom Left in Classic Pokémon Battle Perspective) */}
      <div className="relative flex items-center justify-start gap-2 sm:gap-4 pl-2 sm:pl-8 pb-1">
        {/* Player Active Trainer & Pokémon Platform */}
        <div className="relative flex items-end gap-1.5 shrink-0">
          {/* Player Active Customized Trainer (Commanding / Cheering Stance) */}
          <div className="flex mb-1 z-20 shrink-0 scale-90 xs:scale-100 origin-bottom">
            <TrainerBattleSprite
              isOpponent={false}
              inventory={inventory}
              isCommanding={isAwaitingPlayerInput}
              isCheering={opponentAnimClass === 'anim-faint-sink' || Boolean(floatingDamage?.isCrit && floatingDamage?.side === 'opponent')}
              size="sm"
              onClick={onOpenWardrobe}
            />
          </div>

          {/* Player Pokémon & Grass Stadium Turf Platform */}
          <div
            onClick={() => onOpenSummary(playerMon, false)}
            title={`Click to inspect your ${playerMon.species} [ 鑑 ]`}
            className="relative flex flex-col items-center shrink-0 cursor-pointer group active:scale-95 transition-transform"
          >
            {/* Authentic Player Battle Platform (Iconic Green Grass Pedestal) */}
            <div className="absolute -bottom-3 sm:-bottom-4 w-32 xs:w-44 sm:w-56 h-12 sm:h-16 pkmn-platform-grass pointer-events-none -z-10" />

            {/* Retro Turn Indicator Badge */}
            {isAwaitingPlayerInput && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-pixel text-[8px] sm:text-[9px] shadow-lg shadow-red-600/50 flex items-center gap-1 whitespace-nowrap z-30 border border-red-300">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
                <span>YOUR TURN</span>
              </div>
            )}

            {/* Pokéball Entrance Animation (Triggers on initial summon or switch) */}
            <PokeballEntranceVFX inventory={inventory} triggerKey={playerMon.species} />

            {/* Stadium Turf Field Aura & Held Item Display */}
            <PokemonCosmeticLayer
              pokemon={playerMon}
              isOpponent={false}
              inventory={inventory}
            />

            <div className={`${playerAnimClass}`}>
              <img
                src={playerMon.spriteBack}
                alt={playerMon.species}
                loading="eager"
                decoding="async"
                className="w-22 h-22 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 max-h-[19vh] object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform select-none relative z-10"
              />
            </div>
          </div>
        </div>

        <BattleStatPlate
          pokemon={playerMon}
          isOpponent={false}
          remainingCount={playerRemaining}
          totalCount={6}
          isAwaitingInput={isAwaitingPlayerInput}
          onOpenSummary={onOpenSummary}
        />
      </div>

      {/* Pokémon Showdown Elemental Move VFX & Floating Damage Numbers */}
      <MoveVFX vfx={activeVFX} floatingDamage={floatingDamage} />
    </div>
  );
};

export const BattleStage = React.memo(BattleStageComponent);
