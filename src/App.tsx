/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { BattleArena } from './components/BattleArena';
import { BattleState, TeamPreset, UserCosmeticInventory } from './game/types';
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
const MultiplayerRoadmapModal = lazy(() =>
  import('./components/MultiplayerRoadmapModal').then((m) => ({ default: m.MultiplayerRoadmapModal }))
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
  const [isMultiplayerRoadmapOpen, setIsMultiplayerRoadmapOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.getMuted());

  // Sync state machine to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Support ?autostart=1 query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startNewBattle();
    }
  }, []);

  const startNewBattle = () => {
    const freshState = initializeBattle(selectedTeam.team);
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

  return (
    <main className="w-full min-h-[100dvh] h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 font-sans-ui overflow-hidden overscroll-none touch-manipulation">
      {gameState === 'title' ? (
        <TitleScreen
          onStartBattle={startNewBattle}
          onOpenGacha={() => setIsGachaModalOpen(true)}
          onOpenWardrobe={() => setIsWardrobeModalOpen(true)}
          onOpenMultiplayerRoadmap={() => setIsMultiplayerRoadmapOpen(true)}
          onOpenTeamSelect={() => setIsTeamSelectModalOpen(true)}
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
          onRestartBattle={startNewBattle}
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
          />
        )}

        {isMultiplayerRoadmapOpen && (
          <MultiplayerRoadmapModal
            isOpen={isMultiplayerRoadmapOpen}
            onClose={() => setIsMultiplayerRoadmapOpen(false)}
          />
        )}
      </Suspense>
    </main>
  );
}
