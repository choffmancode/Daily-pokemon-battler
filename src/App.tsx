/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { BattleArena } from './components/BattleArena';
import { BattleState, Pokemon, TeamPreset, UserCosmeticInventory } from './game/types';
import { BEGINNER_TEAMS } from './game/constants';
import { initializeBattle, clonePokemon } from './game/battleEngine';
import { loadUserInventory, saveUserInventory } from './game/gachaEngine';
import { soundFX } from './components/AudioEngine';
import { useMobileViewport } from './hooks/useMobileViewport';
import { OpponentPreviewInfo } from './components/BattlePreviewModal';
import {
  KANTO_GAUNTLET_STAGES,
  getGauntletStage,
  DAILY_CYNTHIA_PREVIEW,
} from './game/data/gauntletLadder';
import { CHAMPION_CYNTHIA_TEAM } from './game/data/teams';

// Code-split heavy modals to minimize initial mobile bundle size
const GachaPackModal = lazy(() =>
  import('./components/GachaPackModal').then((m) => ({ default: m.GachaPackModal }))
);
const WardrobeModal = lazy(() =>
  import('./components/WardrobeModal').then((m) => ({ default: m.WardrobeModal }))
);
const TeamSelectorModal = lazy(() =>
  import('./components/TeamSelectorModal').then((m) => ({ default: m.TeamSelectorModal }))
);
const UIPrototypeStudioModal = lazy(() =>
  import('./components/UIPrototypeStudioModal').then((m) => ({ default: m.UIPrototypeStudioModal }))
);
const BattlePreviewModal = lazy(() =>
  import('./components/BattlePreviewModal').then((m) => ({ default: m.BattlePreviewModal }))
);

export default function App() {
  useMobileViewport(); // Handles 100dvh shifts and first-touch audio unlock

  const [gameState, setGameState] = useState<'title' | 'playing'>('title');
  const [selectedTeam, setSelectedTeam] = useState<TeamPreset>(BEGINNER_TEAMS[0]);
  const [battleState, setBattleState] = useState<BattleState>(() => initializeBattle(BEGINNER_TEAMS[0].team));
  const [inventory, setInventory] = useState<UserCosmeticInventory>(() => loadUserInventory());

  // Modals state
  const [isGachaModalOpen, setIsGachaModalOpen] = useState<boolean>(false);
  const [isWardrobeModalOpen, setIsWardrobeModalOpen] = useState<boolean>(false);
  const [isTeamSelectModalOpen, setIsTeamSelectModalOpen] = useState<boolean>(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState<boolean>(false);
  const [isBattlePreviewOpen, setIsBattlePreviewOpen] = useState<boolean>(false);
  const [studioInitialTab, setStudioInitialTab] = useState<'bracket' | 'champions' | 'regional' | 'victory'>('bracket');
  const [teamSelectInitialStep, setTeamSelectInitialStep] = useState<'teams' | 'lead'>('teams');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.getMuted());

  // Gauntlet & Battle Preview State Machine
  const [isGauntletActive, setIsGauntletActive] = useState<boolean>(false);
  const [gauntletStageIndex, setGauntletStageIndex] = useState<number>(0);
  const [activePlayerRoster, setActivePlayerRoster] = useState<Pokemon[]>(() => BEGINNER_TEAMS[0].team);
  const [previewOpponent, setPreviewOpponent] = useState<OpponentPreviewInfo>(KANTO_GAUNTLET_STAGES[0].preview);
  const [previewMode, setPreviewMode] = useState<'gauntlet' | 'daily'>('gauntlet');
  const [previewStageNumber, setPreviewStageNumber] = useState<number>(1);
  const [previewIsHealed, setPreviewIsHealed] = useState<boolean>(true);

  // Sync state machine to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Support ?autostart=1 and ?preview=victory|defeat query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview');
    if (preview === 'victory') {
      const state = initializeBattle(BEGINNER_TEAMS[0].team);
      state.phase = 'battle_over';
      state.winner = 'player';
      state.turnNumber = 8;
      // Mark 2 player Pokémon as KO'd to match reference Victory summary
      if (state.playerTeam[2]) {
        state.playerTeam[2].currentHp = 0;
        state.playerTeam[2].fainted = true;
      }
      if (state.playerTeam[5]) {
        state.playerTeam[5].currentHp = 0;
        state.playerTeam[5].fainted = true;
      }
      state.opponentTeam.forEach((p) => {
        p.currentHp = 0;
        p.fainted = true;
      });
      setBattleState(state);
      setGameState('playing');
    } else if (preview === 'defeat') {
      const state = initializeBattle(BEGINNER_TEAMS[0].team);
      state.phase = 'battle_over';
      state.winner = 'opponent';
      state.turnNumber = 7;
      state.playerTeam.forEach((p) => {
        p.currentHp = 0;
        p.fainted = true;
      });
      // Leave 2 of Cynthia's Pokémon alive (including Garchomp at 34% HP)
      state.opponentTeam.forEach((p, idx) => {
        if (idx < 4) {
          p.currentHp = 0;
          p.fainted = true;
        } else if (p.species.toLowerCase() === 'garchomp') {
          p.currentHp = Math.round(p.maxHp * 0.34);
          p.fainted = false;
        }
      });
      setBattleState(state);
      setGameState('playing');
    } else if (params.get('autostart') === '1') {
      startNewBattleWithOpponent(selectedTeam.team);
    } else if (preview === 'studio' || preview === 'bracket' || preview === 'champions' || preview === 'regional' || preview === 'victory') {
      setStudioInitialTab(preview === 'studio' ? 'bracket' : (preview as any));
      setIsStudioModalOpen(true);
    } else if (preview === 'battle_preview' || preview === 'preview') {
      setPreviewOpponent(getGauntletStage(1).preview);
      setPreviewMode('gauntlet');
      setPreviewStageNumber(2);
      setPreviewIsHealed(true);
      setIsBattlePreviewOpen(true);
    }
  }, []);

  const startNewBattleWithOpponent = (playerRoster: Pokemon[], opponentRoster?: Pokemon[]) => {
    const freshState = initializeBattle(playerRoster, opponentRoster);
    setBattleState(freshState);
    setGameState('playing');
  };

  const handleToggleMute = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  const handleInventoryUpdate = (updated: UserCosmeticInventory) => {
    setInventory(updated);
    saveUserInventory(updated);
  };

  const handleSelectTeam = (team: TeamPreset) => {
    setSelectedTeam(team);
    setActivePlayerRoster(team.team);
    if (gameState === 'playing') {
      const oppRoster = isGauntletActive
        ? getGauntletStage(gauntletStageIndex).roster
        : CHAMPION_CYNTHIA_TEAM;
      setBattleState(initializeBattle(team.team, oppRoster));
    }
  };

  const handleStartGauntlet = () => {
    setIsGauntletActive(true);
    setGauntletStageIndex(0);
    setTeamSelectInitialStep('teams');
    setIsTeamSelectModalOpen(true);
  };

  const handleStartDailyBattle = () => {
    setIsGauntletActive(false);
    setGauntletStageIndex(0);
    setTeamSelectInitialStep('teams');
    setIsTeamSelectModalOpen(true);
  };

  const handleStartBattleWithTeam = (team: TeamPreset, customRoster: Pokemon[]) => {
    setSelectedTeam(team);
    setActivePlayerRoster(customRoster);
    setIsTeamSelectModalOpen(false);

    if (isGauntletActive) {
      setGauntletStageIndex(0);
      const stage = getGauntletStage(0);
      setPreviewOpponent(stage.preview);
      setPreviewMode('gauntlet');
      setPreviewStageNumber(1);
      setPreviewIsHealed(true);
      setIsBattlePreviewOpen(true);
    } else {
      setPreviewOpponent(DAILY_CYNTHIA_PREVIEW);
      setPreviewMode('daily');
      setPreviewStageNumber(1);
      setPreviewIsHealed(true);
      setIsBattlePreviewOpen(true);
    }
  };

  const handleContinueFromPreview = () => {
    setIsBattlePreviewOpen(false);
    if (isGauntletActive) {
      const stage = getGauntletStage(gauntletStageIndex);
      startNewBattleWithOpponent(activePlayerRoster, stage.roster);
    } else {
      startNewBattleWithOpponent(activePlayerRoster, CHAMPION_CYNTHIA_TEAM);
    }
  };

  const handleAdvanceGauntletStage = () => {
    const nextIndex = gauntletStageIndex + 1;
    setGauntletStageIndex(nextIndex);
    const nextStage = getGauntletStage(nextIndex);

    // Fully heal player roster (100% HP, status cleared, 100% PP)
    const healedRoster = activePlayerRoster.map((p) => {
      const copy = clonePokemon(p);
      copy.currentHp = copy.maxHp;
      copy.fainted = false;
      copy.statusCondition = null;
      copy.sleepTurns = 0;
      copy.toxicCounter = 0;
      copy.substituteHp = 0;
      copy.isProtected = false;
      copy.moves = copy.moves.map((m) => ({ ...m, pp: m.maxPp }));
      return copy;
    });
    setActivePlayerRoster(healedRoster);

    setPreviewOpponent(nextStage.preview);
    setPreviewMode('gauntlet');
    setPreviewStageNumber(nextIndex + 1);
    setPreviewIsHealed(true);
    setGameState('title');
    setIsBattlePreviewOpen(true);
  };

  const handleRestartCurrentBattle = () => {
    if (isGauntletActive) {
      const stage = getGauntletStage(gauntletStageIndex);
      startNewBattleWithOpponent(activePlayerRoster, stage.roster);
    } else {
      startNewBattleWithOpponent(activePlayerRoster, CHAMPION_CYNTHIA_TEAM);
    }
  };

  return (
    <main className="w-full min-h-[100dvh] h-[100dvh] max-h-[100dvh] bg-[#081820] text-[#e0f8d0] font-pixel overflow-hidden overscroll-none touch-manipulation">
      {gameState === 'title' ? (
        <TitleScreen
          onStartBattle={handleStartDailyBattle}
          onStartGauntlet={handleStartGauntlet}
          onOpenGacha={() => setIsGachaModalOpen(true)}
          onOpenWardrobe={() => setIsWardrobeModalOpen(true)}
          onOpenTeamSelect={(step = 'teams') => {
            setIsGauntletActive(false);
            setTeamSelectInitialStep(step);
            setIsTeamSelectModalOpen(true);
          }}
          onOpenStudio={(tab = 'bracket') => {
            setStudioInitialTab(tab);
            setIsStudioModalOpen(true);
          }}
          selectedTeam={selectedTeam}
          inventory={inventory}
          availablePacks={inventory.availablePacks}
          lastDailyClaimTime={inventory.lastDailyClaimTime}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      ) : (
        <BattleArena
          battleState={battleState}
          onUpdateBattle={setBattleState}
          onExitToTitle={() => {
            setIsGauntletActive(false);
            setGameState('title');
          }}
          onRestartBattle={handleRestartCurrentBattle}
          onChangeTeam={() => {
            setTeamSelectInitialStep('teams');
            setIsTeamSelectModalOpen(true);
          }}
          inventory={inventory}
          onInventoryUpdate={handleInventoryUpdate}
          onOpenGachaModal={() => setIsGachaModalOpen(true)}
          onOpenWardrobeModal={() => setIsWardrobeModalOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isGauntlet={isGauntletActive}
          gauntletStageNumber={gauntletStageIndex + 1}
          totalGauntletStages={5}
          opponentName={
            isGauntletActive
              ? getGauntletStage(gauntletStageIndex).preview.name
              : 'CYNTHIA'
          }
          opponentSpriteUrl={
            isGauntletActive
              ? getGauntletStage(gauntletStageIndex).preview.spriteUrl
              : '/sprites/trainers/cynthia_battle.png'
          }
          onAdvanceGauntletStage={handleAdvanceGauntletStage}
        />
      )}

      {/* Code-Split Modals with Suspense */}
      <Suspense fallback={null}>
        {isGachaModalOpen && (
          <GachaPackModal
            isOpen={isGachaModalOpen}
            onClose={() => setIsGachaModalOpen(false)}
            inventory={inventory}
            onInventoryUpdate={handleInventoryUpdate}
            selectedTeam={selectedTeam}
          />
        )}

        {isWardrobeModalOpen && (
          <WardrobeModal
            isOpen={isWardrobeModalOpen}
            onClose={() => setIsWardrobeModalOpen(false)}
            inventory={inventory}
            onInventoryUpdate={handleInventoryUpdate}
            selectedTeam={selectedTeam}
          />
        )}

        {isTeamSelectModalOpen && (
          <TeamSelectorModal
            isOpen={isTeamSelectModalOpen}
            onClose={() => setIsTeamSelectModalOpen(false)}
            selectedTeamId={selectedTeam.id}
            onSelectTeam={handleSelectTeam}
            onStartBattleWithTeam={handleStartBattleWithTeam}
            initialStep={teamSelectInitialStep}
          />
        )}

        {isStudioModalOpen && (
          <UIPrototypeStudioModal
            isOpen={isStudioModalOpen}
            onClose={() => setIsStudioModalOpen(false)}
            initialTab={studioInitialTab}
          />
        )}

        {isBattlePreviewOpen && (
          <BattlePreviewModal
            isOpen={isBattlePreviewOpen}
            onClose={() => {
              setIsBattlePreviewOpen(false);
              if (gameState !== 'playing') {
                setGameState('title');
              }
            }}
            onContinueToBattle={handleContinueFromPreview}
            mode={previewMode}
            stageNumber={previewStageNumber}
            totalStages={5}
            playerTeam={activePlayerRoster}
            opponent={previewOpponent}
            isHealed={previewIsHealed}
          />
        )}
      </Suspense>
    </main>
  );
}
