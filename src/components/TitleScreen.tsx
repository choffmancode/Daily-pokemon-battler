/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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

/**
 * Chamfered Double-Lined GBA Banner Frame SVG (Matches Reference Screen 1 Top Banner)
 */
const ChamferedBannerFrameSVG: React.FC = () => (
  <svg
    viewBox="0 0 360 68"
    preserveAspectRatio="none"
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ shapeRendering: 'crispEdges' }}
  >
    {/* Outer Dark Trim */}
    <polygon
      points="12,0 348,0 360,12 360,56 348,68 12,68 0,56 0,12"
      fill="#081820"
      stroke="#306850"
      strokeWidth="2"
    />
    {/* Main Cream Outer Chamfered Border */}
    <polygon
      points="13,3 347,3 357,13 357,55 347,65 13,65 3,55 3,13"
      fill="#081820"
      stroke="#e0f8d0"
      strokeWidth="3"
    />
    {/* Inner Sage Chamfered Rim */}
    <polygon
      points="16,8 344,8 352,16 352,52 344,60 16,60 8,52 8,16"
      fill="#081820"
      stroke="#306850"
      strokeWidth="2"
    />
    {/* Corner Accent Ticks */}
    <polyline points="12,18 18,12" stroke="#88c070" strokeWidth="2" />
    <polyline points="348,18 342,12" stroke="#88c070" strokeWidth="2" />
    <polyline points="12,50 18,56" stroke="#88c070" strokeWidth="2" />
    <polyline points="348,50 342,56" stroke="#88c070" strokeWidth="2" />
    {/* Symmetrical Left & Right Decorative Underline Bars (Reference Screen 1) */}
    <rect x="44" y="51" width="76" height="2" fill="#306850" />
    <rect x="44" y="55" width="76" height="2" fill="#306850" />
    <rect x="240" y="51" width="76" height="2" fill="#306850" />
    <rect x="240" y="55" width="76" height="2" fill="#306850" />
  </svg>
);

/**
 * Chamfered Double-Lined GBA Menu Button Frame SVG (Matches Reference Screen 1 Buttons)
 */
const ChamferedButtonFrameSVG: React.FC = () => (
  <svg
    viewBox="0 0 360 62"
    preserveAspectRatio="none"
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ shapeRendering: 'crispEdges' }}
  >
    {/* Outer Dark Trim */}
    <polygon
      points="8,0 352,0 360,8 360,54 352,62 8,62 0,54 0,8"
      fill="#183828"
      stroke="#306850"
      strokeWidth="2"
    />
    {/* Cream Outer Chamfered Border */}
    <polygon
      points="9,2.5 351,2.5 357.5,9 357.5,53 351,59.5 9,59.5 2.5,53 2.5,9"
      fill="#183828"
      stroke="#e0f8d0"
      strokeWidth="2.5"
    />
    {/* Inner Sage Chamfered Rim */}
    <polygon
      points="13,7 347,7 353,13 353,49 347,55 13,55 7,49 7,13"
      fill="#163324"
      stroke="#306850"
      strokeWidth="2"
    />
    {/* 4 Inner Corner Diagonal Ticks */}
    <polyline points="11,16 16,11" stroke="#88c070" strokeWidth="2" />
    <polyline points="349,16 344,11" stroke="#88c070" strokeWidth="2" />
    <polyline points="11,46 16,51" stroke="#88c070" strokeWidth="2" />
    <polyline points="349,46 344,51" stroke="#88c070" strokeWidth="2" />
  </svg>
);

/**
 * Pixel Diamond Icon ◇ for the Top Header Banner
 */
const PixelDiamondIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 12 12"
    className="relative z-10 w-4 h-4 shrink-0"
    style={{ shapeRendering: 'crispEdges' }}
  >
    <path
      d="M5 1h2v2h2v2h2v2H9v2H7v2H5V9H3V7H1V5h2V3h2V1zm0 2v2H3v2h2v2h2V7h2V5H7V3H5z"
      fill="#e0f8d0"
    />
    <rect x="5" y="5" width="2" height="2" fill="#306850" />
  </svg>
);

/**
 * Chunky 32-Bit Pixel Icons for the 3 Stacked GBA Title Buttons (Reference Screen 1)
 */
const PixelSwordsIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" style={{ shapeRendering: 'crispEdges' }}>
    {/* Dark Outlines */}
    <path
      d="M2 2h4v2h2v2h2v2h2v2h2V8h2V6h2V4h4v4h-2v2h-2v2h-2v2h2v2h2v2h2v4h-4v-2h-2v-2h-2v-2h-4v2H8v2H6v2H2v-4h2v-2h2v-2h2v-2H6V8H4V6H2V2z"
      fill="#081820"
    />
    {/* Cream Sword Blades */}
    <path
      d="M3 3h2v2h2v2h2v2h2v2h2V9h2V7h2V5h2V3h2v2h-2v2h-2v2h-2v2h-2v2h-2v2H9v2H7v2H5v-2h2v-2h2v-2h2v-2H9V9H7V7H5V5H3V3z"
      fill="#e0f8d0"
    />
    {/* Sage Blade Shading & Crossguards */}
    <path
      d="M4 5h2v2h2v2h2v2H8V9H6V7H4V5zm14 0h2v2h-2v2h-2v2h-2V9h2V7h2V5zM5 15h3v3H5v-3zm11 0h3v3h-3v-3zM3 19h2v2H3v-2zm16 0h2v2h-2v-2z"
      fill="#88c070"
    />
  </svg>
);

const PixelShieldIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" style={{ shapeRendering: 'crispEdges' }}>
    {/* Outer Shield Rim */}
    <path
      d="M4 2h16v10h-1v3h-2v2h-2v2h-2v2H11v-2H9v-2H7v-2H5v-3H4V2z"
      fill="#081820"
    />
    <path
      d="M5 3h14v9h-1v2h-2v2h-2v2h-4v-2H8v-2H6v-2H5V3z"
      fill="#e0f8d0"
    />
    <path
      d="M6 4h12v7h-1v2h-2v2h-2v1h-2v-1H9v-2H7v-2H6V4z"
      fill="#183828"
    />
    <path
      d="M7 5h10v5h-1v2h-2v2h-4v-2H8v-2H7V5z"
      fill="#306850"
    />
    {/* Center Flame / Leaf Emblem */}
    <path
      d="M11 6h2v2h2v2h1v3h-2v2h-4v-2H8v-3h1V8h2V6z"
      fill="#e0f8d0"
    />
    <rect x="11" y="10" width="2" height="3" fill="#306850" />
  </svg>
);

const PixelChestIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" style={{ shapeRendering: 'crispEdges' }}>
    {/* Isometric 3D Box Outline */}
    <path
      d="M9 2h6v1h3v1h2v1h2v12h-2v1h-2v1h-3v1H9v-1H6v-1H4v-1H2V5h2V4h2V3h3V2z"
      fill="#081820"
    />
    {/* Top Lid Highlight */}
    <path
      d="M9 3h6v1h3v1h2v2h-3v1h-3v1h-4V8H7V7H4V5h2V4h3V3z"
      fill="#88c070"
    />
    {/* Left & Right Isometric Box Faces */}
    <path d="M3 8h3v1h3v1h2v9H8v-1H5v-1H3V8z" fill="#306850" />
    <path d="M13 10h2V9h3V8h3v9h-2v1h-3v1h-3v-9z" fill="#183828" />
    {/* Cream Edges & Center Clasp */}
    <path
      d="M3 7h4v1h3v1h4V8h3V7h4v1h-4v1h-3v1h-2v9h-2v-9h-2V9H7V8H3V7z"
      fill="#e0f8d0"
    />
    <rect x="10" y="10" width="4" height="4" fill="#e0f8d0" />
    <rect x="11" y="11" width="2" height="2" fill="#306850" />
  </svg>
);

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

  // Keyboard shortcuts
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
        onOpenGacha();
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        onOpenTeamSelect('teams');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenTeamSelect, onToggleMute, onOpenGacha]);

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-[#081820] text-[#e0f8d0] flex items-center justify-center p-2 sm:p-3 select-none overflow-hidden">
      {/* Unobtrusive Audio Mute Button Outside the GBA Screen Frame */}
      <button
        onClick={() => {
          onToggleMute();
          soundFX.playSelect();
        }}
        aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        title="Toggle Audio [M]"
        className="fixed top-2.5 right-2.5 z-40 p-1.5 bg-[#081820] border-2 border-[#306850] text-[#88c070] hover:text-[#e0f8d0] cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#a84040]" /> : <Volume2 className="w-3.5 h-3.5 text-[#88c070]" />}
      </button>

      {/* 2:3 GBA Handheld Portrait Frame (Matches Reference Screen 1) */}
      <div className="relative w-full max-w-[360px] sm:max-w-[390px] h-full max-h-[820px] gba-screen-border p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
        {/* 4 Inner Corner Square Rivets */}
        <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />
        <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />
        <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />

        {/* Top Chamfered Banner: ◇ DAILY CHAMPION ◇ */}
        <header className="relative z-10 w-full h-[58px] sm:h-[66px] shrink-0 flex items-center justify-between px-4">
          <ChamferedBannerFrameSVG />
          <PixelDiamondIcon />
          <h1 className="relative z-10 font-pixel text-[15px] xs:text-[17px] sm:text-[19px] text-[#e0f8d0] gba-title-text drop-shadow-[2px_2px_0_#306850] whitespace-nowrap">
            DAILY CHAMPION
          </h1>
          <PixelDiamondIcon />
        </header>

        {/* Central Hero Stage: Champion Cynthia Pokemon Card Cover */}
        <div
          onClick={() => {
            soundFX.playSelect();
            onOpenTeamSelect('teams');
          }}
          className="relative z-20 flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2 cursor-pointer group"
          title="Click to challenge Today's Teams"
        >
          <div
            className="relative h-full max-h-[340px] rounded-[4px] p-[3px] bg-[#183828] border-2 border-[#306850] shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_0_1px_#88c070] transition-transform duration-200 group-hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center overflow-hidden"
            style={{ aspectRatio: '250 / 354' }}
          >
            <img
              src="/sprites/trainers/cynthia_cover_card.png"
              alt="Champion Cynthia Supporter Card"
              className="w-full h-full object-contain rounded-[2px] select-none"
              loading="eager"
            />
            {/* Subtle GBA Holo / Gloss Glint Accent */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[#e0f8d0]/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Bottom 3 Stacked Chamfered GBA Command Buttons (Reference Screen 1) */}
        <nav className="relative z-20 w-full flex flex-col gap-2 sm:gap-2.5 shrink-0">
          {/* 1. DAILY BATTLE */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('teams');
            }}
            data-start="true"
            className="relative w-full h-[52px] sm:h-[60px] px-5 flex items-center cursor-pointer group active:translate-y-[1px]"
          >
            <ChamferedButtonFrameSVG />
            <div className="relative z-10 w-full flex items-center pl-2 sm:pl-4 gap-3.5 sm:gap-4">
              <PixelSwordsIcon />
              <span className="font-pixel text-[14px] xs:text-[16px] sm:text-[18px] text-[#e0f8d0] gba-btn-text drop-shadow-[2px_2px_0_#081820] whitespace-nowrap">
                DAILY BATTLE
              </span>
            </div>
          </button>

          {/* 2. GAUNTLET RUN */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onOpenTeamSelect('lead');
            }}
            className="relative w-full h-[52px] sm:h-[60px] px-5 flex items-center cursor-pointer group active:translate-y-[1px]"
          >
            <ChamferedButtonFrameSVG />
            <div className="relative z-10 w-full flex items-center pl-2 sm:pl-4 gap-3.5 sm:gap-4">
              <PixelShieldIcon />
              <span className="font-pixel text-[14px] xs:text-[16px] sm:text-[18px] text-[#e0f8d0] gba-btn-text drop-shadow-[2px_2px_0_#081820] whitespace-nowrap">
                GAUNTLET RUN
              </span>
            </div>
          </button>

          {/* 3. COLLECTION */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setIsCollectionMenuOpen(true);
            }}
            className="relative w-full h-[52px] sm:h-[60px] px-5 flex items-center cursor-pointer group active:translate-y-[1px]"
          >
            <ChamferedButtonFrameSVG />
            <div className="relative z-10 w-full flex items-center pl-2 sm:pl-4 gap-3.5 sm:gap-4">
              <PixelChestIcon />
              <span className="font-pixel text-[14px] xs:text-[16px] sm:text-[18px] text-[#e0f8d0] gba-btn-text drop-shadow-[2px_2px_0_#081820] whitespace-nowrap">
                COLLECTION
              </span>
            </div>
          </button>
        </nav>

        {/* Collection Sub-Menu Overlay (Booster Packs vs. Trainer Sprite Studio) */}
        {isCollectionMenuOpen && (
          <div
            className="absolute inset-0 z-30 bg-[#081820]/95 flex flex-col items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Collection Hub"
          >
            <div className="w-full gba-frame-cream p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b-2 border-[#306850] pb-2">
                <span className="font-pixel text-xs text-[#081820]">COLLECTION VAULT</span>
                <span className="gba-hanko-seal text-[8px]">蔵</span>
              </div>

              <p className="font-pixel text-[8px] text-[#306850] leading-relaxed">
                Open daily TCG Booster Packs or customize your Gen 3 Trainer &amp; Pokémon gear.
              </p>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsCollectionMenuOpen(false);
                  onOpenGacha();
                }}
                className="w-full gba-btn py-3 px-3 text-xs flex items-center justify-between"
              >
                <span>▶ BOOSTER PACKS</span>
                <span className="text-[8px] text-[#88c070]">
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
                className="w-full gba-btn py-3 px-3 text-xs flex items-center justify-between"
              >
                <span>▶ SPRITE STUDIO &amp; GEAR</span>
                <span className="text-[8px] text-[#88c070]">WARDROBE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setIsCollectionMenuOpen(false);
                }}
                className="w-full gba-select-btn py-2.5 text-[10px] text-center mt-1"
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
