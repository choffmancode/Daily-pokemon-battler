/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VS CHAMP — The Anime Key-Art Master Panel Title Screen
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFX } from './AudioEngine';
import { TeamPreset, UserCosmeticInventory } from '../game/types';
import { getDailyPackCooldown } from '../game/gachaEngine';

interface TitleScreenProps {
  onStartBattle: () => void;
  onOpenGacha: () => void;
  onOpenWardrobe: () => void;
  onOpenTeamSelect: (initialStep?: 'teams' | 'lead') => void;
  selectedTeam: TeamPreset;
  inventory?: UserCosmeticInventory;
  availablePacks: number;
  lastDailyClaimTime: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onOpenGacha,
  onOpenWardrobe,
  onOpenTeamSelect,
  availablePacks,
  lastDailyClaimTime,
  isMuted,
  onToggleMute,
}) => {
  const [dailyStatus, setDailyStatus] = useState(() => getDailyPackCooldown(lastDailyClaimTime));
  const [isCollectionMenuOpen, setIsCollectionMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDailyStatus(getDailyPackCooldown(lastDailyClaimTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastDailyClaimTime]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        soundFX.playSelect();
        onOpenTeamSelect('teams');
      } else if (e.code === 'KeyG') {
        e.preventDefault();
        soundFX.playSelect();
        onOpenTeamSelect('lead');
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        onToggleMute();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        soundFX.playSelect();
        onOpenGacha();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        soundFX.playSelect();
        setIsCollectionMenuOpen(true);
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        soundFX.playSelect();
        onOpenTeamSelect('teams');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenTeamSelect, onToggleMute, onOpenGacha]);

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-[#081820] text-[#e0f8d0] flex items-center justify-center p-2 sm:p-3 select-none overflow-hidden">
      {/* Subtle Diamond Grid Scanline Ambiance */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(#1c3c34 1px, transparent 1px), radial-gradient(ellipse at 50% 45%, rgba(168,40,144,0.18) 0%, transparent 65%)',
          backgroundSize: '16px 16px, 100% 100%',
        }}
      />

      {/* Unobtrusive Audio Mute Button Outside Console Frame */}
      <button
        onClick={() => {
          onToggleMute();
          soundFX.playSelect();
        }}
        aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        title="Toggle Audio [M]"
        className="fixed top-3 right-3 z-40 p-2 bg-[#081820]/90 border-2 border-[#306850] text-[#88c070] hover:text-[#e0f8d0] hover:border-[#88c070] rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-[#a84040]" /> : <Volume2 className="w-4 h-4 text-[#88c070]" />}
      </button>

      {/* Handheld Arcade Master Console Container (Aspect 914:1275) */}
      <div className="relative w-full max-w-[420px] sm:max-w-[440px] h-full max-h-[860px] flex items-center justify-center">
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ aspectRatio: '914 / 1275' }}
        >
          {/* Master Key-Art Panel Graphic at Native Full Resolution */}
          <img
            src="/sprites/trainers/vschamp_panel_design3_hd.png"
            alt="VS CHAMP The Anime Key-Art Master Panel"
            className="w-full h-full object-contain pointer-events-none select-none rounded-[6px] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
            loading="eager"
          />

          {/* Interactive Hotspot 1: Top VS CHAMP Logo Badge */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            title="VS CHAMP — Challenge Today's League Champion"
            aria-label="VS CHAMP Title Logo"
            className="absolute top-[1.5%] left-[18%] w-[64%] h-[24%] rounded-[12px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform focus:outline-none"
          />

          {/* Interactive Hotspot 2: BATTLE NOW! Starburst Badge (Left) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            title="Challenge Champion Cynthia Now!"
            aria-label="Battle Now Badge"
            className="absolute top-[54.5%] left-[7.5%] w-[23%] h-[13%] rounded-full cursor-pointer hover:scale-108 active:scale-95 hover:shadow-[0_0_16px_rgba(136,192,112,0.6)] transition-all focus:outline-none"
          />

          {/* Interactive Hotspot 3: FREE REWARDS TODAY! Starburst Badge (Right) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenGacha();
            }}
            title={availablePacks > 0 ? `${availablePacks} Booster Packs Ready!` : 'Claim Today\'s Booster Packs!'}
            aria-label="Free Rewards Today Badge"
            className="absolute top-[54.5%] right-[7.5%] w-[23%] h-[13%] rounded-full cursor-pointer hover:scale-108 active:scale-95 hover:shadow-[0_0_16px_rgba(136,192,112,0.6)] transition-all focus:outline-none group"
          >
            {/* Pulsing notification pip if booster packs are ready */}
            {(availablePacks > 0 || dailyStatus.isAvailable) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#a84040] border border-[#e0f8d0] rounded-full flex items-center justify-center font-pixel text-[6px] text-white animate-pulse">
                !
              </span>
            )}
          </button>

          {/* Interactive Hotspot 4: DAILY BATTLE Chamfered Command Button (Gold Frame) */}
          <button
            type="button"
            data-start="true"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            title="Play Today's Daily Battle against Champion Cynthia"
            aria-label="Daily Battle"
            className="absolute top-[67%] left-[15.5%] w-[69%] h-[9.2%] rounded-[8px] cursor-pointer hover:bg-amber-400/12 hover:shadow-[0_0_20px_rgba(240,200,48,0.45)] active:translate-y-[1.5px] transition-all focus:outline-none group"
          >
            {/* Subtle glow edge outline on hover */}
            <span className="absolute inset-0 rounded-[8px] border-2 border-transparent group-hover:border-[#f0c830]/60 transition-colors pointer-events-none" />
          </button>

          {/* Interactive Hotspot 5: GAUNTLET RUN Chamfered Command Button (Cyan Frame) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('lead');
            }}
            title="Start Gauntlet Run with Custom Lead Pokémon"
            aria-label="Gauntlet Run"
            className="absolute top-[78.5%] left-[15.5%] w-[69%] h-[9.2%] rounded-[8px] cursor-pointer hover:bg-cyan-400/12 hover:shadow-[0_0_20px_rgba(56,184,232,0.45)] active:translate-y-[1.5px] transition-all focus:outline-none group"
          >
            {/* Subtle glow edge outline on hover */}
            <span className="absolute inset-0 rounded-[8px] border-2 border-transparent group-hover:border-[#38b8e8]/60 transition-colors pointer-events-none" />
          </button>

          {/* Interactive Hotspot 6: COLLECTION Chamfered Command Button (Coral Frame) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setIsCollectionMenuOpen(true);
            }}
            title="Open Collection Vault: Booster Packs & Trainer Sprite Wardrobe"
            aria-label="Collection"
            className="absolute top-[90%] left-[15.5%] w-[69%] h-[9.2%] rounded-[8px] cursor-pointer hover:bg-rose-400/12 hover:shadow-[0_0_20px_rgba(232,88,88,0.45)] active:translate-y-[1.5px] transition-all focus:outline-none group"
          >
            {/* Subtle glow edge outline on hover */}
            <span className="absolute inset-0 rounded-[8px] border-2 border-transparent group-hover:border-[#e85858]/60 transition-colors pointer-events-none" />
          </button>
        </div>

        {/* Collection Sub-Menu Overlay (Booster Packs vs. Trainer Sprite Studio) */}
        {isCollectionMenuOpen && (
          <div
            className="absolute inset-0 z-50 bg-[#081820]/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Collection Hub"
          >
            <div className="w-full max-w-[340px] gba-frame-cream p-5 flex flex-col gap-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between border-b-2 border-[#306850] pb-2.5">
                <span className="font-pixel text-[13px] text-[#081820] font-bold">COLLECTION VAULT</span>
                <span className="gba-hanko-seal text-[9px]">蔵</span>
              </div>

              <p className="font-pixel text-[8.5px] text-[#306850] leading-relaxed">
                Open daily TCG Booster Packs or customize your Gen 3 Trainer &amp; Pokémon gear.
              </p>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsCollectionMenuOpen(false);
                  onOpenGacha();
                }}
                className="w-full gba-btn py-3 px-3.5 text-[11px] flex items-center justify-between cursor-pointer group"
              >
                <span>▶ BOOSTER PACKS</span>
                <span className="text-[9px] text-[#88c070] group-hover:text-[#e0f8d0]">
                  {availablePacks > 0 ? `${availablePacks} READY` : dailyStatus.isAvailable ? 'FREE READY' : dailyStatus.formattedTime}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsCollectionMenuOpen(false);
                  onOpenWardrobe();
                }}
                className="w-full gba-btn py-3 px-3.5 text-[11px] flex items-center justify-between cursor-pointer group"
              >
                <span>▶ SPRITE STUDIO &amp; GEAR</span>
                <span className="text-[9px] text-[#88c070] group-hover:text-[#e0f8d0]">WARDROBE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsCollectionMenuOpen(false);
                }}
                className="w-full gba-select-btn py-2.5 text-[10px] text-center mt-1 cursor-pointer"
              >
                BACK TO TITLE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
