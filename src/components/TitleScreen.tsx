/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VS CHAMP — Complete Anime Key-Art Master Panel (Mobile Optimized)
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
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-[#081820] text-[#e0f8d0] flex items-center justify-center p-1 sm:p-2 select-none overflow-hidden touch-manipulation">
      {/* Background Diamond Lattice Ambient Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
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
        className="fixed top-2.5 right-2.5 z-40 p-2 bg-[#081820]/90 border-2 border-[#306850] text-[#88c070] active:scale-95 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-[#a84040]" /> : <Volume2 className="w-4 h-4 text-[#88c070]" />}
      </button>

      {/* Mobile-First Full-Height Fit Container — Nothing Cut Off Top or Bottom */}
      <div className="relative h-full max-h-full w-auto max-w-full flex items-center justify-center">
        <div
          className="relative h-full max-h-full w-auto flex items-center justify-center"
          style={{ aspectRatio: '917 / 1348' }}
        >
          {/* Full High-Definition Master Key-Art Panel Graphic — Full Aspect Ratio Intact */}
          <img
            src="/sprites/trainers/vschamp_panel_master_complete.png"
            alt="VS CHAMP Master Panel"
            className="h-full w-auto max-h-full max-w-full object-contain pointer-events-none select-none rounded-[6px] shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
            loading="eager"
          />

          {/* Interactive Touch Target 1: Top VS CHAMP Logo Badge */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            title="VS CHAMP — Challenge Today's League Champion"
            aria-label="VS CHAMP Title Logo"
            className="absolute top-[1.2%] left-[18%] w-[64%] h-[21%] rounded-[12px] cursor-pointer active:scale-[0.98] focus:outline-none"
          />

          {/* Interactive Touch Target 2: BATTLE NOW! Starburst Badge (Left) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            title="Challenge Champion Cynthia Now!"
            aria-label="Battle Now Badge"
            className="absolute top-[54.5%] left-[7%] w-[24%] h-[11.5%] rounded-full cursor-pointer active:scale-95 focus:outline-none"
          />

          {/* Interactive Touch Target 3: FREE REWARDS TODAY! Starburst Badge (Right) */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenGacha();
            }}
            title={availablePacks > 0 ? `${availablePacks} Booster Packs Ready!` : 'Claim Today\'s Booster Packs!'}
            aria-label="Free Rewards Today Badge"
            className="absolute top-[54.5%] right-[7%] w-[24%] h-[11.5%] rounded-full cursor-pointer active:scale-95 focus:outline-none"
          >
            {/* Notification pip if booster packs are ready */}
            {(availablePacks > 0 || dailyStatus.isAvailable) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#a84040] border border-[#e0f8d0] rounded-full flex items-center justify-center font-pixel text-[6px] text-white">
                !
              </span>
            )}
          </button>

          {/* Interactive Touch Target 4: DAILY BATTLE Command Button (Gold Frame) — No Sticky Hover */}
          <button
            type="button"
            data-start="true"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            title="Play Today's Daily Battle against Champion Cynthia"
            aria-label="Daily Battle"
            className="absolute top-[66.2%] left-[14%] w-[72%] h-[8.5%] rounded-[8px] cursor-pointer active:scale-[0.98] active:opacity-85 focus:outline-none"
          />

          {/* Interactive Touch Target 5: GAUNTLET RUN Command Button (Cyan Frame) — No Sticky Hover */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('lead');
            }}
            title="Start Gauntlet Run with Custom Lead Pokémon"
            aria-label="Gauntlet Run"
            className="absolute top-[76.8%] left-[14%] w-[72%] h-[8.5%] rounded-[8px] cursor-pointer active:scale-[0.98] active:opacity-85 focus:outline-none"
          />

          {/* Interactive Touch Target 6: COLLECTION Command Button (Coral Frame) — No Sticky Hover */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setIsCollectionMenuOpen(true);
            }}
            title="Open Collection Vault: Booster Packs & Trainer Sprite Wardrobe"
            aria-label="Collection"
            className="absolute top-[87.3%] left-[14%] w-[72%] h-[8.5%] rounded-[8px] cursor-pointer active:scale-[0.98] active:opacity-85 focus:outline-none"
          />
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
                className="w-full gba-btn py-3 px-3.5 text-[11px] flex items-center justify-between cursor-pointer active:scale-[0.99]"
              >
                <span>▶ BOOSTER PACKS</span>
                <span className="text-[9px] text-[#88c070]">
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
                className="w-full gba-btn py-3 px-3.5 text-[11px] flex items-center justify-between cursor-pointer active:scale-[0.99]"
              >
                <span>▶ SPRITE STUDIO &amp; GEAR</span>
                <span className="text-[9px] text-[#88c070]">WARDROBE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsCollectionMenuOpen(false);
                }}
                className="w-full gba-select-btn py-2.5 text-[10px] text-center mt-1 cursor-pointer active:scale-[0.99]"
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
