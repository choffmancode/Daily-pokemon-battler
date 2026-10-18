/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Pause, Eye, ScrollText, AlertCircle } from 'lucide-react';
import { BattleState, UserCosmeticInventory } from '../game/types';
import { soundFX } from './AudioEngine';
import { haptics } from '../audio/useHaptics';
import { useBattle } from '../hooks/useBattle';
import { BattleStage } from './battle/BattleStage';
import { BattleControls } from './battle/BattleControls';
import { BattleGameOverModal } from './battle/BattleGameOverModal';
import { BattleTurnFeed } from './battle/BattleTurnFeed';
import { TrainerEquippedBadge } from './battle/BattleCosmetics';
import { PokemonSummaryModal } from './PokemonSummaryModal';

interface BattleArenaProps {
  battleState: BattleState;
  onUpdateBattle: (state: BattleState) => void;
  onExitToTitle: () => void;
  onRestartBattle: () => void;
  inventory: UserCosmeticInventory;
  onInventoryUpdate: (inventory: UserCosmeticInventory) => void;
  onOpenGachaModal: () => void;
  onOpenWardrobeModal?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  battleState,
  onUpdateBattle,
  onExitToTitle,
  onRestartBattle,
  inventory,
  onInventoryUpdate,
  onOpenGachaModal,
  onOpenWardrobeModal,
  isMuted,
  onToggleMute,
}) => {
  const [isDesktopFeedOpen, setIsDesktopFeedOpen] = useState<boolean>(true);
  const [isMobileFeedDrawerOpen, setIsMobileFeedDrawerOpen] = useState<boolean>(false);

  const {
    playerMon,
    opponentMon,
    selectedSubMenu,
    setSelectedSubMenu,
    isPaused,
    setIsPaused,
    isTurnProcessing,
    screenShake,
    isSummaryOpen,
    setIsSummaryOpen,
    summaryMon,
    isSummaryOpponentInitial,
    handleOpenSummary,
    handleSelectMove,
    handleSwitchPokemon,
    // Showdown Battle Feed and Animation States
    liveCombatLog,
    activeVFX,
    floatingDamage,
    playerAnimClass,
    opponentAnimClass,
    isScreenFlareActive,
  } = useBattle({
    battleState,
    onUpdateBattle,
    inventory,
    onInventoryUpdate,
    onRestartBattle,
  });

  const isAwaitingPlayerInput = !isTurnProcessing && battleState.phase === 'action_select';
  const playerNeedsSwitch = !isTurnProcessing && (playerMon.fainted || playerMon.currentHp <= 0);

  const toggleFeedUI = () => {
    soundFX.playSelect();
    haptics.tap();
    if (window.innerWidth >= 1024) {
      setIsDesktopFeedOpen((prev) => !prev);
    } else {
      setIsMobileFeedDrawerOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col lg:flex-row overflow-hidden pkmn-battle-arena-standard text-slate-100 select-none">
      {/* Standard Stadium Battle Background & Atmospheric Floodlights */}
      <div className="pkmn-stadium-lights" />

      {/* Main Battle Playfield (Left on Desktop, Full on Mobile) */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0 p-1.5 xs:p-2 sm:p-3 relative z-10 overflow-hidden">
        {/* Top HUD Cluster: Weather, Turn Count, Equipped Trainer Badge & Utility Controls */}
        <header className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between shrink-0 h-8 sm:h-9">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            {/* Weather Pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 shadow-md shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${battleState.weather === 'Hail' ? 'bg-cyan-400' : battleState.weather === 'Sun' ? 'bg-amber-400' : battleState.weather === 'Rain' ? 'bg-blue-400' : 'bg-emerald-400'} animate-ping`} />
              <span className={`text-[9px] sm:text-xs font-pixel ${battleState.weather === 'Hail' ? 'text-cyan-300' : battleState.weather === 'Sun' ? 'text-amber-300' : battleState.weather === 'Rain' ? 'text-blue-300' : 'text-emerald-300'}`}>
                {battleState.weather.toUpperCase()}
              </span>
            </div>

            {/* Turn Counter in Retro Game Boy Style */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[9px] sm:text-xs font-pixel text-slate-300 shadow-md shrink-0">
              <span className="text-slate-400">TURN</span>
              <span className="font-bold text-amber-300 tabular-nums">{battleState.turnNumber}</span>
            </div>

            {/* Trainer Equipped Brooch / Badge */}
            <TrainerEquippedBadge inventory={inventory} />
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Showdown Action Feed Toggle Button */}
            <button
              onClick={toggleFeedUI}
              aria-label="Toggle Showdown Battle Feed"
              className={`px-2 sm:px-2.5 py-1 rounded border text-[9px] sm:text-xs font-pixel flex items-center gap-1 transition cursor-pointer shadow-md ${
                isDesktopFeedOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
              }`}
              title="Toggle Pokémon Showdown Action Feed [L]"
            >
              <ScrollText className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">FEED</span>
              <span className="hidden lg:inline text-[8px] text-amber-400/80">
                {isDesktopFeedOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Active Pokémon Summary Codex Button */}
            <button
              onClick={() => handleOpenSummary(playerMon, false)}
              aria-label="View Active Pokémon Summary"
              className="px-2 sm:px-2.5 py-1 rounded pkmn-btn-blue text-white text-[9px] sm:text-xs font-pixel flex items-center gap-1 transition cursor-pointer shadow-md"
              title="Open Pokémon Summary Codex [ 鑑 ]"
            >
              <Eye className="w-3 h-3 text-white" />
              <span>SUMMARY</span>
            </button>

            {/* Mute Audio */}
            <button
              onClick={() => {
                soundFX.playSelect();
                haptics.tap();
                onToggleMute();
              }}
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              )}
            </button>

            {/* Pause Menu */}
            <button
              onClick={() => {
                soundFX.playSelect();
                haptics.tap();
                setIsPaused(true);
              }}
              aria-label="Pause Battle"
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </header>

        {/* Center Main Arena Playfield with Animated Sprites & Standard Grass Pedestals */}
        {/* Note: camera-shake-stage applies ONLY here to avoid root viewport bounce jitter */}
        <div className={`flex-1 flex flex-col justify-between min-h-0 ${screenShake ? 'camera-shake-stage' : ''}`}>
          <BattleStage
            playerMon={playerMon}
            opponentMon={opponentMon}
            playerRemaining={battleState.playerTeam.filter((p) => !p.fainted).length}
            opponentRemaining={battleState.opponentTeam.filter((p) => !p.fainted).length}
            inventory={inventory}
            isAwaitingPlayerInput={isAwaitingPlayerInput}
            onOpenSummary={handleOpenSummary}
            activeVFX={activeVFX}
            floatingDamage={floatingDamage}
            playerAnimClass={playerAnimClass}
            opponentAnimClass={opponentAnimClass}
            isScreenFlareActive={isScreenFlareActive}
            onOpenWardrobe={onOpenWardrobeModal}
          />
        </div>

        {/* Mobile / Narrow Screen In-Battle Action Feed Strip (Always visible, non-disruptive, auto-scrolls) */}
        <div className="lg:hidden relative z-20 w-full max-w-4xl mx-auto shrink-0 mb-1 sm:mb-1.5">
          <BattleTurnFeed
            mode="strip"
            logs={liveCombatLog}
            currentTurn={battleState.turnNumber}
            isOpen={isMobileFeedDrawerOpen}
            onToggleOpen={() => setIsMobileFeedDrawerOpen((prev) => !prev)}
            onClose={() => setIsMobileFeedDrawerOpen(false)}
          />
        </div>

        {/* Authentic Gen 1-3 Dialogue Prompt Bar ("What will PIKACHU do?") */}
        <div className="relative z-20 w-full max-w-4xl mx-auto shrink-0 mb-1 sm:mb-1.5">
          {playerNeedsSwitch ? (
            <div className="p-2 sm:p-2.5 rounded-lg pkmn-frame-cream border-2 border-red-500 text-slate-900 font-pixel text-[9px] sm:text-xs flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-1.5 text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{playerMon.species.toUpperCase()} FAINTED! CHOOSE A SWITCH:</span>
              </div>
              <span className="pkmn-btn pkmn-btn-red px-2 py-0.5 text-[8px] uppercase">
                SWITCH ▼
              </span>
            </div>
          ) : isAwaitingPlayerInput ? (
            <div className="p-2 sm:p-2.5 rounded-lg pkmn-frame-cream border-2 border-slate-800 text-slate-900 font-pixel text-[9px] sm:text-xs flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="pkmn-cursor">▶</span>
                <span className="text-slate-900">
                  What will {playerMon.species.toUpperCase()} do?
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] text-slate-600 font-mono-code uppercase">
                SELECT MOVE BELOW
              </span>
            </div>
          ) : isTurnProcessing ? (
            <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-pixel text-[9px] sm:text-[10px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="truncate">Executing moves & counter-attacks...</span>
            </div>
          ) : null}
        </div>

        {/* Bottom Command Dock */}
        <BattleControls
          playerMon={playerMon}
          opponentMon={opponentMon}
          playerTeam={battleState.playerTeam}
          playerActiveIndex={battleState.playerActiveIndex}
          selectedSubMenu={selectedSubMenu}
          onSelectSubMenu={setSelectedSubMenu}
          isTurnProcessing={isTurnProcessing}
          isAwaitingPlayerInput={isAwaitingPlayerInput}
          playerNeedsSwitch={playerNeedsSwitch}
          onSelectMove={handleSelectMove}
          onSwitchPokemon={handleSwitchPokemon}
          onOpenSummary={handleOpenSummary}
        />
      </div>

      {/* Right Column: Dedicated Pokémon Showdown Live Action Feed Sidebar (Desktop & Wide Screens) */}
      {isDesktopFeedOpen && (
        <aside className="hidden lg:flex w-80 xl:w-96 shrink-0 h-full border-l border-slate-700/80 bg-slate-950/90 backdrop-blur-md flex-col z-30 shadow-2xl overflow-hidden">
          <BattleTurnFeed
            mode="sidebar"
            logs={liveCombatLog}
            currentTurn={battleState.turnNumber}
            isOpen={true}
            onClose={() => setIsDesktopFeedOpen(false)}
          />
        </aside>
      )}

      {/* Pause Menu Overlay */}
      {isPaused && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Battle Paused"
        >
          <div className="w-full max-w-sm p-6 rounded-2xl pkmn-frame-dark text-center shadow-2xl">
            <h3 className="font-pixel text-base font-bold text-amber-400 mb-2">
              BATTLE PAUSED
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-mono-code">
              Take a breather. The Sinnoh Pokémon League awaits your command.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                }}
                className="pkmn-btn pkmn-btn-red py-2.5 text-xs"
              >
                RESUME BATTLE [Esc]
              </button>

              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                  onOpenGachaModal();
                }}
                className="pkmn-btn pkmn-btn-gold py-2.5 text-xs"
              >
                OPEN BOOSTER PACKS
              </button>

              {onOpenWardrobeModal && (
                <button
                  onClick={() => {
                    soundFX.playSelect();
                    haptics.tap();
                    setIsPaused(false);
                    onOpenWardrobeModal();
                  }}
                  className="pkmn-btn pkmn-btn-emerald py-2.5 text-xs"
                >
                  CUSTOM SPRITE STUDIO & GEAR
                </button>
              )}

              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                  onRestartBattle();
                }}
                className="pkmn-btn bg-slate-700 hover:bg-slate-600 text-white py-2.5 text-xs"
              >
                RESTART SHOWDOWN
              </button>

              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                  onExitToTitle();
                }}
                className="pkmn-btn bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 text-xs"
              >
                QUIT TO TITLE SCREEN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-Battle Pokémon Summary Modal */}
      {isSummaryOpen && summaryMon && (
        <PokemonSummaryModal
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          initialPokemon={summaryMon}
          playerTeam={battleState.playerTeam}
          opponentMon={opponentMon}
          isOpponentInitial={isSummaryOpponentInitial}
        />
      )}

      {/* Game Over / Victory Modal */}
      {battleState.phase === 'battle_over' && (
        <BattleGameOverModal
          winner={battleState.winner}
          turnNumber={battleState.turnNumber}
          onRestartBattle={onRestartBattle}
          onExitToTitle={onExitToTitle}
          onOpenGachaModal={onOpenGachaModal}
        />
      )}
    </div>
  );
};
