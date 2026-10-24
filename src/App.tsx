/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { BattleArena } from './components/BattleArena';
import { BattleState, Pokemon, TeamPreset, UserCosmeticInventory } from './game/types';
import { BEGINNER_TEAMS } from './game/constants';
import { initializeBattle } from './game/battleEngine';
import { loadUserInventory, saveUserInventory } from './game/gachaEngine';
import { soundFX } from './components/AudioEngine';
import { useMobileViewport } from './hooks/useMobileViewport';

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
  const [studioInitialTab, setStudioInitialTab] = useState<'bracket' | 'champions' | 'regional' | 'victory'>('bracket');
  const [teamSelectInitialStep, setTeamSelectInitialStep] = useState<'teams' | 'lead'>('teams');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.getMuted());

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
      startNewBattle();
    } else if (preview === 'studio' || preview === 'bracket' || preview === 'champions' || preview === 'regional' || preview === 'victory') {
      setStudioInitialTab(preview === 'studio' ? 'bracket' : (preview as any));
      setIsStudioModalOpen(true);
    }
  }, []);

  const startNewBattle = (customRoster?: Pokemon[]) => {
    const freshState = initializeBattle(customRoster ?? selectedTeam.team);
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
    if (gameState === 'playing') {
      setBattleState(initializeBattle(team.team));
    }
  };

  const handleStartBattleWithTeam = (team: TeamPreset, customRoster: Pokemon[]) => {
    setSelectedTeam(team);
    setIsTeamSelectModalOpen(false);
    startNewBattle(customRoster);
  };

  return (
    <main className="w-full min-h-[100dvh] h-[100dvh] max-h-[100dvh] bg-[#081820] text-[#e0f8d0] font-pixel overflow-hidden overscroll-none touch-manipulation">
      {gameState === 'title' ? (
        <TitleScreen
          onStartBattle={() => {
            setTeamSelectInitialStep('teams');
            setIsTeamSelectModalOpen(true);
          }}
          onOpenGacha={() => setIsGachaModalOpen(true)}
          onOpenWardrobe={() => setIsWardrobeModalOpen(true)}
          onOpenTeamSelect={(step = 'teams') => {
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
          onExitToTitle={() => setGameState('title')}
          onRestartBattle={() => startNewBattle(selectedTeam.team)}
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
      </Suspense>
    </main>
  );
}
