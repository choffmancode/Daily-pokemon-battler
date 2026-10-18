/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, Package, Shirt, Network, Flame, Volume2, VolumeX, ArrowRight, ChevronLeft, ChevronRight, Play, Palette } from 'lucide-react';
import { soundFX } from './AudioEngine';
import { TeamPreset, UserCosmeticInventory } from '../game/types';
import { getDailyPackCooldown } from '../game/gachaEngine';
import { COZY_BACKGROUND_SCENES } from '../game/constants';
import { getOfficialArtworkUrl } from '../game/data/typeChart';
import { MiniTrainerSVG, getTrainerBase } from '../game/data/trainerRegistry';

interface TitleScreenProps {
  onStartBattle: () => void;
  onOpenGacha: () => void;
  onOpenWardrobe: () => void;
  onOpenMultiplayerRoadmap: () => void;
  onOpenTeamSelect: () => void;
  selectedTeam: TeamPreset;
  inventory?: UserCosmeticInventory;
  availablePacks: number;
  lastDailyClaimTime: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartBattle,
  onOpenGacha,
  onOpenWardrobe,
  onOpenMultiplayerRoadmap,
  onOpenTeamSelect,
  selectedTeam,
  inventory,
  availablePacks,
  lastDailyClaimTime,
  isMuted,
  onToggleMute,
}) => {
  const [dailyStatus, setDailyStatus] = useState(() => getDailyPackCooldown(lastDailyClaimTime));
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Rotate nostalgic background art every 10 seconds
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % COZY_BACKGROUND_SCENES.length);
    }, 10000);
    return () => clearInterval(bgTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDailyStatus(getDailyPackCooldown(lastDailyClaimTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastDailyClaimTime]);

  const activeScene = COZY_BACKGROUND_SCENES[currentSceneIndex];

  // Lead Pokémon official artwork (Ken Sugimori style)
  const leadMon = selectedTeam.team[0];
  const leadArtUrl = leadMon ? getOfficialArtworkUrl(leadMon.nationalDex) : getOfficialArtworkUrl(25);

  const handleNextScene = () => {
    soundFX.playSelect();
    setCurrentSceneIndex((prev) => (prev + 1) % COZY_BACKGROUND_SCENES.length);
  };

  const handlePrevScene = () => {
    soundFX.playSelect();
    setCurrentSceneIndex((prev) => (prev - 1 + COZY_BACKGROUND_SCENES.length) % COZY_BACKGROUND_SCENES.length);
  };

  // Bind Enter and Space on title screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        soundFX.playSelect();
        onStartBattle();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        onToggleMute();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        onOpenGacha();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        onOpenTeamSelect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartBattle, onToggleMute, onOpenGacha, onOpenTeamSelect]);

  return (
    <div className="relative min-h-[100dvh] h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Nostalgic 2000s Rotating Background Artwork with Ambient Scanlines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {COZY_BACKGROUND_SCENES.map((scene, idx) => {
          const isCurrent = idx === currentSceneIndex;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isCurrent ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={scene.imageUrl}
                alt={scene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter saturate-110 brightness-90"
              />
            </div>
          );
        })}

        {/* Nostalgic CRT / Game Boy Scanline & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/60" />
        <div className="absolute inset-0 scanlines-overlay opacity-15" />
      </div>

      {/* Top Header: GBA Ribbon Bar & Audio / Scene Controls */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-bold shadow-md border border-amber-300">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="font-pixel text-[9px] sm:text-[10px] text-amber-400 tracking-wider">
              DAILY SHOWDOWN
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-200 font-pixel">
              DAILY CYNTHIA
            </div>
          </div>
        </div>

        {/* Background Artwork Switcher & Mute */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded pkmn-frame-dark text-xs text-slate-300">
            <button
              onClick={handlePrevScene}
              aria-label="Previous background"
              className="p-0.5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] sm:text-[10px] font-pixel text-amber-300 truncate max-w-[110px] sm:max-w-[150px]">
              {activeScene.title}
            </span>
            <button
              onClick={handleNextScene}
              aria-label="Next background"
              className="p-0.5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              onToggleMute();
              soundFX.playSelect();
            }}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded pkmn-frame-dark text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Center Stage: 2000s Pokémon Title & Ken Sugimori Art Hero */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-2 sm:py-4 flex-1 flex flex-col items-center justify-center text-center">
        {/* Title Screen Logo (Cynthia Black & Gold Championship Style) */}
        <div className="mb-2 sm:mb-4">
          <div className="inline-block relative">
            <h1 className="font-pixel text-2xl xs:text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_4px_12px_rgba(212,175,55,0.45)] tracking-wider">
              DAILY CYNTHIA
            </h1>
            <div className="font-pixel text-[9px] xs:text-[11px] sm:text-xs text-amber-300 tracking-widest mt-1">
              ★ SINNOH CHAMPION SHOWDOWN ★
            </div>
          </div>
        </div>

        {/* Ken Sugimori Artwork Showcase & Custom Gen 3 Mini Trainer Sprite */}
        <div className="relative my-2 sm:my-3 flex items-center justify-center gap-3 sm:gap-6">
          {/* Subtle Stage Halo */}
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />

          {/* Official Ken Sugimori Artwork */}
          <div className="relative group cursor-pointer" onClick={onOpenTeamSelect} title="Click to change your Pokémon squad">
            <img
              src={leadArtUrl}
              alt={leadMon.species}
              loading="eager"
              className="w-24 h-24 xs:w-32 xs:h-32 sm:w-44 sm:h-44 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full pkmn-frame-cream font-pixel text-[8px] sm:text-[9px] text-slate-900 border border-slate-700 shadow-md whitespace-nowrap">
              LEAD: {leadMon.species.toUpperCase()}
            </div>
          </div>

          {/* Player Custom Gen 3 Mini Trainer Sprite on Summit Pedestal */}
          {inventory?.equippedTrainer && (
            <div
              onClick={onOpenWardrobe}
              title="Click to customize your Gen 3 Trainer Sprite & Gear!"
              className="relative flex flex-col items-center justify-end group cursor-pointer active:scale-95 transition-transform pb-2"
            >
              {/* Mini Pedestal Disc */}
              <div className="absolute bottom-1 w-16 sm:w-20 h-3.5 rounded-full bg-slate-900 border border-indigo-400/50 shadow-[0_0_10px_rgba(99,102,241,0.3)] pointer-events-none" />

              <div className="w-12 h-18 sm:w-16 sm:h-24 filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform origin-bottom">
                <MiniTrainerSVG
                  config={inventory.equippedTrainer}
                  posture="idle"
                />
              </div>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-indigo-950/90 text-amber-300 font-pixel text-[7.5px] sm:text-[8px] border border-amber-400/50 shadow whitespace-nowrap flex items-center gap-1 group-hover:border-amber-300">
                <Sparkles className="w-2 h-2 text-amber-400 animate-spin" />
                <span>{getTrainerBase(inventory.equippedTrainer.baseId).name.split(' (')[0].toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Authentic Gen 1-3 Menu Window (Iconic Double-Line Frame) */}
        <div className="w-full max-w-md pkmn-frame-dark p-3 sm:p-4 my-2 sm:my-3 text-left">
          <div className="space-y-2">
            {/* Start Battle Choice */}
            <button
              onClick={() => {
                soundFX.playSelect();
                onStartBattle();
              }}
              data-start="true"
              className="w-full pkmn-btn pkmn-btn-gold py-3 px-4 text-xs sm:text-sm flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2 text-slate-950 font-bold">
                <span className="pkmn-cursor text-slate-950">▶</span>
                <span>CHALLENGE CHAMPION CYNTHIA</span>
              </div>
              <span className="pkmn-btn-round-a text-[9px]">A</span>
            </button>

            {/* Booster Packs / TCG Gacha Choice */}
            <button
              onClick={() => {
                soundFX.playSelect();
                onOpenGacha();
              }}
              className="w-full pkmn-btn pkmn-btn-gold py-2.5 px-4 text-xs flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2 text-slate-950">
                <Package className="w-4 h-4 text-slate-950" />
                <span>BOOSTER PACKS</span>
                {availablePacks > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-black">
                    {availablePacks}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-slate-800 font-mono-code font-bold">
                {dailyStatus.isAvailable ? 'FREE READY' : dailyStatus.formattedTime}
              </span>
            </button>

            {/* Squad Selection & Custom Sprite Studio Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  soundFX.playSelect();
                  onOpenTeamSelect();
                }}
                className="pkmn-btn pkmn-btn-blue py-2 px-3 text-[10px] sm:text-xs flex items-center justify-center gap-1.5"
              >
                <span>SQUAD ({selectedTeam.name.slice(0, 8)})</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playSelect();
                  onOpenWardrobe();
                }}
                className="pkmn-btn pkmn-btn-emerald py-2 px-3 text-[10px] sm:text-xs flex items-center justify-center gap-1.5 group"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>SPRITE STUDIO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Flashing "PRESS START" Prompt */}
        <div
          onClick={() => {
            soundFX.playSelect();
            onStartBattle();
          }}
          className="font-pixel text-[10px] sm:text-xs text-amber-300 animate-pulse cursor-pointer py-1"
        >
          - PRESS [ENTER] OR [SPACE] TO START -
        </div>
      </main>

      {/* Retro Game Boy Footer Control Bar */}
      <footer className="relative z-10 w-full py-2.5 px-4 text-center font-pixel text-[8px] sm:text-[9px] text-slate-400 border-t border-slate-800/80 bg-slate-950/80">
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          <span>[A] START BATTLE</span>
          <span>[P] BOOSTER PACKS</span>
          <span>[T] SELECT SQUAD</span>
          <span>[M] MUTE SOUND</span>
        </div>
      </footer>
    </div>
  );
};
