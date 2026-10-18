/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BattleState, UserCosmeticInventory, WeatherType } from '../game/types';
import { soundFX } from './AudioEngine';
import { haptics } from '../audio/useHaptics';
import { useBattle } from '../hooks/useBattle';
import { BattleStage } from './battle/BattleStage';
import { BattleControls } from './battle/BattleControls';
import { BattleGameOverModal } from './battle/BattleGameOverModal';
import { BattleTurnFeed } from './battle/BattleTurnFeed';
import { PokemonSummaryModal } from './PokemonSummaryModal';
import {
  pickRandomUkiyoeBackground,
  UkiyoeBackgroundSpec,
} from '../game/data/ukiyoeBackgrounds';

interface BattleArenaProps {
  battleState: BattleState;
  onUpdateBattle: (state: BattleState) => void;
  onExitToTitle: () => void;
  onRestartBattle: () => void;
  onChangeTeam?: () => void;
  inventory: UserCosmeticInventory;
  onInventoryUpdate: (inventory: UserCosmeticInventory) => void;
  onOpenGachaModal: () => void;
  onOpenWardrobeModal?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

/**
 * Pixel-Art Weather Icon for the Left Weather Panel
 * Default state ('Clear') renders a calm horizon / clear sky emblem.
 */
const PixelWeatherIcon: React.FC<{ weather: WeatherType }> = ({ weather }) => {
  if (weather === 'Clear') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges" className="shrink-0">
        {/* Subtle calm horizon & wind lines */}
        <rect x="7" y="2" width="2" height="2" fill="#88c070" />
        <rect x="5" y="4" width="6" height="2" fill="#88c070" />
        <rect x="7" y="6" width="2" height="2" fill="#88c070" />
        <rect x="2" y="10" width="12" height="2" fill="#588868" />
        <rect x="4" y="13" width="8" height="1" fill="#386850" />
      </svg>
    );
  }

  if (weather === 'Sun') {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" shapeRendering="crispEdges" className="shrink-0">
        <rect x="9" y="2" width="2" height="3" fill="#f8d850" />
        <rect x="9" y="15" width="2" height="3" fill="#f8d850" />
        <rect x="2" y="9" width="3" height="2" fill="#f8d850" />
        <rect x="15" y="9" width="3" height="2" fill="#f8d850" />
        <rect x="4" y="4" width="2" height="2" fill="#f8d850" />
        <rect x="14" y="4" width="2" height="2" fill="#f8d850" />
        <rect x="4" y="14" width="2" height="2" fill="#f8d850" />
        <rect x="14" y="14" width="2" height="2" fill="#f8d850" />
        <rect x="7" y="6" width="6" height="8" fill="#f09030" />
        <rect x="6" y="7" width="8" height="6" fill="#f09030" />
        <rect x="7" y="7" width="6" height="6" fill="#f8d850" />
      </svg>
    );
  }

  if (weather === 'Sand') {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" shapeRendering="crispEdges" className="shrink-0">
        <rect x="4" y="5" width="12" height="2" fill="#dfb868" />
        <rect x="2" y="9" width="14" height="2" fill="#c89848" />
        <rect x="5" y="13" width="12" height="2" fill="#dfb868" />
        <rect x="14" y="3" width="2" height="2" fill="#f8e8b0" />
        <rect x="3" y="15" width="2" height="2" fill="#f8e8b0" />
      </svg>
    );
  }

  /* Hail or Rain: Cloud + Pellets/Drops */
  return (
    <svg width="18" height="18" viewBox="0 0 22 20" shapeRendering="crispEdges" className="shrink-0">
      <rect x="7" y="2" width="8" height="2" fill="#98b8b8" />
      <rect x="5" y="4" width="13" height="3" fill="#b8d0d0" />
      <rect x="3" y="7" width="16" height="4" fill="#88a8a8" />
      <rect x="4" y="11" width="14" height="1" fill="#507070" />
      <rect x="6" y="13" width="2" height="2" fill="#98e0e8" />
      <rect x="5" y="16" width="2" height="2" fill="#98e0e8" />
      <rect x="11" y="13" width="2" height="2" fill="#98e0e8" />
      <rect x="10" y="16" width="2" height="2" fill="#98e0e8" />
      <rect x="16" y="13" width="2" height="2" fill="#98e0e8" />
      <rect x="15" y="16" width="2" height="2" fill="#98e0e8" />
    </svg>
  );
};

export const BattleArena: React.FC<BattleArenaProps> = ({
  battleState,
  onUpdateBattle,
  onExitToTitle,
  onRestartBattle,
  onChangeTeam,
  inventory,
  onInventoryUpdate,
  onOpenGachaModal,
  onOpenWardrobeModal,
  isMuted,
  onToggleMute,
}) => {
  // Default open so the 3-line Action Log Plate is visible just below the header (per v4 Mockup)
  const [isActionLogOpen, setIsActionLogOpen] = useState<boolean>(true);

  // Randomly select a traditional Ukiyo-e woodblock background each time a new battle starts
  const [activeBackground, setActiveBackground] = useState<UkiyoeBackgroundSpec>(() =>
    pickRandomUkiyoeBackground()
  );
  const firstLogId = battleState.combatLog[0]?.id ?? '';

  useEffect(() => {
    if (battleState.turnNumber === 1 && battleState.combatLog.length <= 5) {
      setActiveBackground((prev) => pickRandomUkiyoeBackground(prev.id));
    }
  }, [battleState.turnNumber, firstLogId]);

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

  const toggleActionLog = () => {
    soundFX.playSelect();
    haptics.tap();
    setIsActionLogOpen((prev) => !prev);
  };

  // Keyboard shortcut [L] to toggle the 3-line Action Log Plate
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'KeyL') {
        e.preventDefault();
        soundFX.playSelect();
        setIsActionLogOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const paddedTurn = String(battleState.turnNumber).padStart(2, '0');
  const isWeatherActive = battleState.weather !== 'Clear';
  const weatherLabel = isWeatherActive
    ? `${battleState.weather.toUpperCase()}${
        battleState.weatherTurnsRemaining > 0 ? ` ${battleState.weatherTurnsRemaining}T` : ''
      }`
    : 'NO WEATHER';

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-[#081820] text-[#e0f8d0] flex items-center justify-center overflow-hidden select-none">
      {/* 9:16 Mobile Portrait GBA Battle Screen Container */}
      <div className="relative w-full max-w-[430px] h-[100dvh] max-h-[920px] flex flex-col justify-between p-1.5 xs:p-2 bg-[#081820] border-x-4 border-[#183828] overflow-hidden">
        {/* Outer Screen Edge Ukiyo-e Background Layer (shows in subtle gaps around floating GBA UI frames) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={activeBackground.imageUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top pixelated opacity-45 select-none"
          />
          <div className="absolute inset-0 bg-[#081820]/50" />
        </div>

        {/* ===================================================================
            ZONE 1: SYMMETRICAL 3-SEGMENT TOP HEADER PLATE
            Left: Weather Status (defaults to NO WEATHER)
            Middle: Raised Octagonal TURN XX Crest
            Right: [LOG] & [PAUSE] Utility Controls
           =================================================================== */}
        <header className="relative z-30 w-full h-[48px] sm:h-[52px] shrink-0 flex items-center justify-between">
          {/* Segment 1 (Left — 33.5%): Dark-Green Chamfered Weather Status Plate */}
          <div
            className="relative w-[33.5%] h-[42px] sm:h-[46px] flex items-center justify-center gap-1 px-1.5"
            title={
              isWeatherActive
                ? `Active Weather: ${battleState.weather} (${battleState.weatherTurnsRemaining} turns left)`
                : 'Weather: Clear (No active weather effects)'
            }
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 136 52"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <polygon points="5,0 131,0 136,5 136,47 131,52 5,52 0,47 0,5" fill="#081820" />
              <polygon points="6,2 130,2 134,6 134,46 130,50 6,50 2,46 2,6" fill="#d8ecd0" />
              <polygon points="8,4 128,4 132,8 132,44 128,48 8,48 4,44 4,8" fill="#081820" />
              <polygon points="9,5 127,5 131,9 131,43 127,47 9,47 5,43 5,9" fill="#1c3c2c" />
              <polygon
                points="11,7 125,7 129,11 129,41 125,45 11,45 7,41 7,11"
                fill="none"
                stroke="#386850"
                strokeWidth="1.5"
              />
            </svg>
            <div className="relative z-10 flex items-center justify-center gap-1 min-w-0">
              <PixelWeatherIcon weather={battleState.weather} />
              <span
                className={`gba-title-text text-[8.5px] xs:text-[9px] sm:text-[10px] font-bold tracking-tighter whitespace-nowrap drop-shadow-[1px_1px_0_#081820] ${
                  isWeatherActive ? 'text-[#e0f8d0]' : 'text-[#88c070]'
                }`}
              >
                {weatherLabel}
              </span>
            </div>
          </div>

          {/* Segment 2 (Center — 33%): Raised Cream Octagonal TURN XX Badge */}
          <div className="relative w-[33%] h-[48px] sm:h-[52px] -mx-[1px] flex items-center justify-center px-2 z-20">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 126 58"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <polygon points="10,0 116,0 126,10 126,48 116,58 10,58 0,48 0,10" fill="#081820" />
              <polygon points="11,2 115,2 124,11 124,47 115,56 11,56 2,47 2,11" fill="#486850" />
              <polygon points="13,4 113,4 122,13 122,45 113,54 13,54 4,45 4,13" fill="#081820" />
              <polygon points="14,6 112,6 120,14 120,44 112,52 14,52 6,44 6,14" fill="#e0f0c8" />
              <polygon
                points="16,8 110,8 118,16 118,42 110,50 16,50 8,42 8,16"
                fill="none"
                stroke="#88b078"
                strokeWidth="1.5"
              />
            </svg>
            <span className="relative z-10 gba-title-text text-[13px] xs:text-[14px] sm:text-[15px] font-bold text-[#183828] tracking-tight whitespace-nowrap">
              TURN {paddedTurn}
            </span>
          </div>

          {/* Segment 3 (Right — 33.5%): Symmetrical Dark-Green Utility Plate ([LOG] [PAUSE]) */}
          <div className="relative w-[33.5%] h-[42px] sm:h-[46px] flex items-center justify-evenly px-1">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 136 52"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <polygon points="5,0 131,0 136,5 136,47 131,52 5,52 0,47 0,5" fill="#081820" />
              <polygon points="6,2 130,2 134,6 134,46 130,50 6,50 2,46 2,6" fill="#d8ecd0" />
              <polygon points="8,4 128,4 132,8 132,44 128,48 8,48 4,44 4,8" fill="#081820" />
              <polygon points="9,5 127,5 131,9 131,43 127,47 9,47 5,43 5,9" fill="#1c3c2c" />
              <polygon
                points="11,7 125,7 129,11 129,41 125,45 11,45 7,41 7,11"
                fill="none"
                stroke="#386850"
                strokeWidth="1.5"
              />
            </svg>

            <button
              type="button"
              onClick={toggleActionLog}
              title="Toggle 3-Line Action Log [L]"
              className={`relative z-10 gba-title-text text-[10px] xs:text-[11px] font-bold cursor-pointer active:translate-y-[1px] ${
                isActionLogOpen ? 'text-[#e0f8d0]' : 'text-[#88c070]'
              }`}
            >
              [LOG]
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playSelect();
                haptics.tap();
                setIsPaused(true);
              }}
              title="Pause Battle [Esc]"
              className="relative z-10 gba-title-text text-[10px] xs:text-[11px] font-bold text-[#e0f8d0] cursor-pointer active:translate-y-[1px]"
            >
              [PAUSE]
            </button>
          </div>
        </header>

        {/* ===================================================================
            ZONE 2: TOGGLEABLE TOP 3-LINE ACTION LOG PLATE (Matches v4 Mockup)
           =================================================================== */}
        <BattleTurnFeed
          logs={liveCombatLog}
          currentTurn={battleState.turnNumber}
          weather={battleState.weather}
          playerName={playerMon.species}
          opponentName={opponentMon.species}
          isOpen={isActionLogOpen}
          onToggleOpen={toggleActionLog}
        />

        {/* ===================================================================
            ZONE 3: SPLIT-PERSPECTIVE GBA BATTLEFIELD OVER UKIYO-E LANDSCAPE
           =================================================================== */}
        <div
          className={`relative z-10 flex-1 flex flex-col justify-between min-h-0 my-0.5 rounded-[4px] border-2 border-[#081820] overflow-hidden ${
            screenShake ? 'camera-shake-stage' : ''
          }`}
        >
          <BattleStage
            playerMon={playerMon}
            opponentMon={opponentMon}
            playerRemaining={battleState.playerTeam.filter((p) => !p.fainted && p.currentHp > 0).length}
            opponentRemaining={
              battleState.opponentTeam.filter((p) => !p.fainted && p.currentHp > 0).length
            }
            inventory={inventory}
            isAwaitingPlayerInput={isAwaitingPlayerInput}
            onOpenSummary={handleOpenSummary}
            activeVFX={activeVFX}
            floatingDamage={floatingDamage}
            playerAnimClass={playerAnimClass}
            opponentAnimClass={opponentAnimClass}
            isScreenFlareActive={isScreenFlareActive}
            onOpenWardrobe={onOpenWardrobeModal}
            backgroundUrl={activeBackground.imageUrl}
          />
        </div>

        {/* ===================================================================
            ZONE 4: SLIM LOWERED CREAM DIALOGUE PROMPT BAR (Matches v4 Mockup)
           =================================================================== */}
        <div className="relative z-20 w-full h-[42px] sm:h-[46px] shrink-0 mb-1">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 388 56"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
          >
            <polygon points="6,0 382,0 388,6 388,50 382,56 6,56 0,50 0,6" fill="#081820" />
            <polygon points="7,2 381,2 386,7 386,49 381,54 7,54 2,49 2,7" fill="#587448" />
            <polygon points="10,5 378,5 383,10 383,46 378,51 10,51 5,46 5,10" fill="#081820" />
            <polygon points="11,7 377,7 381,11 381,45 377,49 11,49 7,45 7,11" fill="#e0f0c8" />
          </svg>

          <div className="relative z-10 w-full h-full flex items-center px-3.5 gap-2">
            {/* Dark-Green Pixel Cursor Triangle ▶ */}
            <svg
              width="11"
              height="14"
              viewBox="0 0 12 16"
              shapeRendering="crispEdges"
              className="shrink-0"
            >
              <polygon points="1,1 11,8 1,15" fill="#183828" />
            </svg>

            {playerNeedsSwitch ? (
              <span className="gba-title-text text-[11.5px] xs:text-[12.5px] font-bold text-[#a83838] truncate">
                {playerMon.species.toUpperCase()} fainted! Choose next Pokémon!
              </span>
            ) : isTurnProcessing ? (
              <span className="gba-title-text text-[11.5px] xs:text-[12.5px] font-bold text-[#183828] truncate">
                Executing turn actions...
              </span>
            ) : (
              <span className="gba-title-text text-[12px] xs:text-[13px] sm:text-[14px] font-bold text-[#183828] truncate">
                What will {playerMon.species.toUpperCase()} do?
              </span>
            )}
          </div>
        </div>

        {/* ===================================================================
            ZONE 5: 2x2 DARK-GREEN MOVE GRID + MODE DOCK (Matches v4 Mockup)
           =================================================================== */}
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

        {/* ===================================================================
            PAUSE MENU OVERLAY (GBA Cream/Emerald Frame)
           =================================================================== */}
        {isPaused && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081820]/90"
            role="dialog"
            aria-modal="true"
            aria-label="Battle Paused"
          >
            <div className="w-full max-w-[360px] gba-frame-cream p-4 flex flex-col gap-2.5 text-[#081820]">
              <div className="flex items-center justify-between border-b-2 border-[#306850] pb-2">
                <h3 className="gba-title-text text-[15px] font-bold text-[#081820]">
                  BATTLE PAUSED
                </h3>
                <span className="gba-hanko-seal text-[8px]">休</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                }}
                className="w-full gba-btn py-2.5 text-xs text-center"
              >
                ▶ RESUME BATTLE
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onToggleMute();
                }}
                className="w-full gba-select-btn py-2.5 text-xs text-center"
              >
                AUDIO: {isMuted ? 'MUTED [OFF]' : 'ACTIVE [ON]'}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                  onOpenGachaModal();
                }}
                className="w-full gba-select-btn py-2.5 text-xs text-center"
              >
                BOOSTER PACKS
              </button>

              {onOpenWardrobeModal && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playSelect();
                    haptics.tap();
                    setIsPaused(false);
                    onOpenWardrobeModal();
                  }}
                  className="w-full gba-select-btn py-2.5 text-xs text-center"
                >
                  SPRITE STUDIO &amp; GEAR
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                  setActiveBackground((prev) => pickRandomUkiyoeBackground(prev.id));
                  onRestartBattle();
                }}
                className="w-full gba-select-btn py-2.5 text-xs text-center"
              >
                RESTART CHALLENGE
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  setIsPaused(false);
                  onExitToTitle();
                }}
                className="w-full gba-select-btn py-2.5 text-xs text-center text-[#a83838]"
              >
                MAIN MENU
              </button>
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
            playerTeam={battleState.playerTeam}
            opponentTeam={battleState.opponentTeam}
            opponentRemainingCount={
              battleState.opponentTeam.filter((p) => !p.fainted && p.currentHp > 0).length
            }
            turnNumber={battleState.turnNumber}
            onRestartBattle={onRestartBattle}
            onChangeTeam={onChangeTeam}
            onExitToTitle={onExitToTitle}
            onOpenGachaModal={onOpenGachaModal}
          />
        )}
      </div>
    </div>
  );
};
