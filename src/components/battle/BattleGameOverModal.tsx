/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pokemon } from '../../game/types';
import { soundFX } from '../AudioEngine';
import { haptics } from '../../audio/useHaptics';

interface BattleGameOverModalProps {
  winner: 'player' | 'opponent' | null | undefined;
  playerTeam?: Pokemon[];
  opponentTeam?: Pokemon[];
  opponentRemainingCount?: number;
  onOpenGachaModal: () => void;
  onRestartBattle: () => void;
  onChangeTeam?: () => void;
  onExitToTitle: () => void;
  turnNumber?: number;
}

/**
 * Pixel-Art Crowned Trophy Emblem for Victory Banner
 */
const PixelTrophyEmblemSVG: React.FC = () => (
  <svg width="60" height="68" viewBox="0 0 32 36" shapeRendering="crispEdges">
    {/* Gold/Cream Crown at Top */}
    <rect x="10" y="1" width="12" height="6" fill="#081820" />
    <polygon points="11,6 11,2 13,4 16,1 19,4 21,2 21,6" fill="#e0f0c8" />
    <rect x="11" y="6" width="10" height="2" fill="#88c070" />
    <rect x="15" y="3" width="2" height="2" fill="#a83838" />
    {/* Trophy Cup Body */}
    <rect x="8" y="9" width="16" height="12" fill="#24503c" />
    <rect x="10" y="10" width="12" height="9" fill="#3c785c" />
    <rect x="12" y="11" width="4" height="6" fill="#68a080" />
    {/* Handles */}
    <rect x="5" y="10" width="3" height="7" fill="#24503c" />
    <rect x="24" y="10" width="3" height="7" fill="#24503c" />
    {/* Stem & Pedestal Base */}
    <rect x="14" y="21" width="4" height="7" fill="#24503c" />
    <rect x="15" y="21" width="2" height="7" fill="#68a080" />
    <rect x="10" y="28" width="12" height="5" fill="#24503c" />
    <rect x="11" y="29" width="10" height="2" fill="#88c070" />
  </svg>
);

/**
 * Pixel-Art Cracked Crimson Shield Emblem for Defeat Banner
 */
const PixelBrokenShieldSVG: React.FC = () => (
  <svg width="60" height="68" viewBox="0 0 32 36" shapeRendering="crispEdges">
    <polygon points="4,3 16,1 28,3 28,19 16,34 4,19" fill="#481414" />
    <polygon points="6,5 16,3 26,5 26,18 16,31 6,18" fill="#882828" />
    <polygon points="8,7 16,5 24,7 24,17 16,28 8,17" fill="#681c1c" />
    {/* Jagged Crack Down the Middle */}
    <polygon
      points="15,2 18,2 15,10 19,13 14,20 18,25 15,33 13,24 16,19 12,13 16,9"
      fill="#081820"
    />
  </svg>
);

/**
 * Pixel-Art Tilted Foil Booster Pack Icon
 */
const PixelBoosterPackSVG: React.FC = () => (
  <svg width="44" height="50" viewBox="0 0 24 28" shapeRendering="crispEdges" className="shrink-0">
    <g transform="rotate(-12 12 14)">
      <rect x="4" y="2" width="16" height="23" fill="#081820" />
      <rect x="5" y="3" width="14" height="2" fill="#98b0b8" />
      <rect x="5" y="22" width="14" height="2" fill="#708890" />
      <rect x="5" y="5" width="14" height="17" fill="#385868" />
      <rect x="6" y="6" width="12" height="15" fill="#487888" />
      <rect x="8" y="9" width="8" height="8" fill="#081820" />
      <rect x="9" y="10" width="6" height="6" fill="#78c8e8" />
      <rect x="10" y="11" width="4" height="4" fill="#e0f8d0" />
      <rect x="6" y="18" width="12" height="2" fill="#d8a038" />
    </g>
  </svg>
);

/**
 * Pixel-Art 4-Point Stardust Star + Sparkles Icon
 */
const PixelStardustSVG: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" shapeRendering="crispEdges" className="shrink-0">
    <rect x="3" y="4" width="2" height="2" fill="#081820" />
    <rect x="3" y="4" width="1" height="1" fill="#88d0f0" />
    <rect x="19" y="4" width="2" height="2" fill="#081820" />
    <rect x="19" y="4" width="1" height="1" fill="#88d0f0" />
    <rect x="4" y="18" width="2" height="2" fill="#081820" />
    <rect x="18" y="18" width="2" height="2" fill="#081820" />
    <polygon points="12,1 15,8 22,11 15,14 12,21 9,14 2,11 9,8" fill="#081820" />
    <polygon points="12,3 14,9 20,11 14,13 12,19 10,13 4,11 10,9" fill="#68b8d8" />
    <polygon points="12,5 13,9 17,11 13,12 12,15 11,12 7,11 11,9" fill="#b8e8f8" />
  </svg>
);

/**
 * Pixel-Art Button Icons (Chest, Crossed Swords, Swap Arrows, House)
 */
const PixelChestIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" shapeRendering="crispEdges" className="shrink-0">
    <rect x="1" y="2" width="14" height="12" fill="#081820" />
    <rect x="2" y="3" width="12" height="4" fill="#88c070" />
    <rect x="2" y="7" width="12" height="1" fill="#081820" />
    <rect x="2" y="8" width="12" height="5" fill="#306850" />
    <rect x="7" y="6" width="2" height="3" fill="#e0f8d0" />
  </svg>
);

const PixelSwordsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" shapeRendering="crispEdges" className="shrink-0">
    <polygon points="2,2 4,2 14,12 12,14 2,4" fill="#e0f8d0" />
    <polygon points="14,2 12,2 2,12 4,14 14,4" fill="#88c070" />
    <rect x="2" y="12" width="3" height="2" fill="#e0f8d0" />
    <rect x="11" y="12" width="3" height="2" fill="#e0f8d0" />
  </svg>
);

const PixelSwapIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" shapeRendering="crispEdges" className="shrink-0">
    <rect x="2" y="4" width="9" height="2" fill="#88c070" />
    <rect x="2" y="6" width="2" height="2" fill="#88c070" />
    <polygon points="11,2 15,5 11,8" fill="#e0f8d0" />
    <rect x="5" y="10" width="9" height="2" fill="#88c070" />
    <rect x="12" y="8" width="2" height="2" fill="#88c070" />
    <polygon points="5,8 1,11 5,14" fill="#e0f8d0" />
  </svg>
);

const PixelHouseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" shapeRendering="crispEdges" className="shrink-0">
    <polygon points="8,1 15,8 13,8 13,15 3,15 3,8 1,8" fill="#081820" />
    <polygon points="8,2 14,8 2,8" fill="#88c070" />
    <rect x="4" y="8" width="8" height="6" fill="#e0f8d0" />
    <rect x="7" y="10" width="2" height="4" fill="#081820" />
  </svg>
);

/**
 * Reusable GBA Trapezoid-Tabbed Cream Section Card
 * Avoids any SVG-to-HTML vertical coordinate mismatch so the header text never collides with borders.
 */
const GbaTrapezoidCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="w-full flex flex-col items-center shrink-0">
    {/* Raised Top Trapezoid Header Tab */}
    <div className="relative z-10 w-[84%] h-[24px] flex items-center justify-center -mb-[3px]">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 300 26"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <polygon points="14,0 286,0 300,26 0,26" fill="#081820" />
        <polygon points="16,2 284,2 296,26 4,26" fill="#b8d898" />
        <polygon points="18,4 282,4 292,26 8,26" fill="#305840" />
        <polygon points="20,6 280,6 288,26 12,26" fill="#c8e4a8" />
      </svg>
      <span
        className="relative z-10 text-[12px] xs:text-[13px] font-bold text-[#081820] uppercase tracking-wide whitespace-nowrap pt-0.5"
        style={{ fontFamily: "'Silkscreen', monospace" }}
      >
        {title}
      </span>
    </div>

    {/* Main Cream Card Body */}
    <div className="w-full bg-[#e8f4c8] border-[3px] border-[#305840] outline outline-2 outline-[#b8d898] shadow-[0_0_0_4px_#081820] rounded-[3px] px-3 pt-2.5 pb-2.5 text-[#081820] overflow-hidden">
      {children}
    </div>
  </div>
);

export const BattleGameOverModal: React.FC<BattleGameOverModalProps> = ({
  winner,
  playerTeam = [],
  opponentTeam = [],
  opponentRemainingCount = 0,
  onOpenGachaModal,
  onRestartBattle,
  onChangeTeam,
  onExitToTitle,
  turnNumber = 8,
}) => {
  if (!winner) return null;

  const isVictory = winner === 'player';

  // Determine Player MVP
  const mvpMon =
    [...playerTeam].sort((a, b) => b.currentHp / b.maxHp - a.currentHp / a.maxHp)[0] ||
    playerTeam[0];
  const mvpName = (mvpMon?.species || 'LUCARIO').toUpperCase();

  // Determine Cynthia's Ace / Remaining Pokémon for Defeat report
  const aliveOpponents = opponentTeam.filter((p) => !p.fainted && p.currentHp > 0);
  const cynthiaAce =
    aliveOpponents.find((p) => p.species.toLowerCase() === 'garchomp') ||
    aliveOpponents[0] ||
    opponentTeam[opponentTeam.length - 1];
  const aceName = (cynthiaAce?.species || 'GARCHOMP').toUpperCase();
  const aceHpPct = cynthiaAce
    ? Math.max(1, Math.round((cynthiaAce.currentHp / cynthiaAce.maxHp) * 100))
    : 34;

  const actualOpponentRemaining =
    aliveOpponents.length > 0 ? aliveOpponents.length : Math.max(1, opponentRemainingCount || 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-[#081820] gba-outer-wave gba-scanlines select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={isVictory ? 'Champion Defeated Results' : 'Challenge Failed Results'}
    >
      {/* Signature Double-Lined GBA Screen Border with 4 Corner Square Rivets */}
      <div className="relative z-10 w-full max-w-[396px] h-full max-h-[860px] gba-screen-border px-2.5 py-2.5 flex flex-col justify-between overflow-hidden">
        <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />
        <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />
        <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-[#306850] pointer-events-none z-20" />

        {/* ===================================================================
            1. TOP HEADER BANNER (Trophy for Victory / Broken Shield for Defeat)
           =================================================================== */}
        <div className="relative w-full h-[52px] sm:h-[56px] shrink-0 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 388 64"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
          >
            <polygon
              points="12,4 376,4 388,16 388,48 376,60 12,60 0,48 0,16"
              fill="#081820"
            />
            <polygon
              points="13,6 375,6 386,17 386,47 375,58 13,58 2,47 2,17"
              fill={isVictory ? '#c8e4a8' : '#d87868'}
            />
            <polygon
              points="16,9 372,9 383,20 383,44 372,55 16,55 5,44 5,20"
              fill="#081820"
            />
            <polygon
              points="18,11 370,11 380,21 380,43 370,53 18,53 8,43 8,21"
              fill={isVictory ? '#386850' : '#983030'}
            />
            <polygon
              points="20,13 368,13 378,23 378,41 368,51 20,51 10,41 10,23"
              fill="#081820"
            />
          </svg>

          {/* Center Emblem Behind Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isVictory ? <PixelTrophyEmblemSVG /> : <PixelBrokenShieldSVG />}
          </div>

          {/* Banner Title Text with Crisp Multi-Pixel Outline for 100% Contrast */}
          <div className="relative z-10 flex items-center justify-center gap-2 px-3">
            <span className="font-pixel text-[9px] text-[#e0f8d0]">◇</span>
            <h1
              className="gba-title-text text-[14.5px] xs:text-[16px] sm:text-[17.5px] font-bold text-[#e8f4c8] tracking-[0.04em] uppercase whitespace-nowrap"
              style={{
                textShadow:
                  '2px 2px 0 #081820, -2px -2px 0 #081820, 2px -2px 0 #081820, -2px 2px 0 #081820, 0 2px 0 #081820, 0 -2px 0 #081820',
              }}
            >
              {isVictory ? 'CHAMPION DEFEATED' : 'CHALLENGE FAILED'}
            </h1>
            <span className="font-pixel text-[9px] text-[#e0f8d0]">◇</span>
          </div>
        </div>

        {/* ===================================================================
            2. CHAMPION DIALOGUE CARD + HANKO STAMP ([勝] / [敗])
           =================================================================== */}
        <div className="w-full bg-[#305840] border-[3px] border-[#b8d898] shadow-[0_0_0_3px_#081820] rounded-[3px] p-1.5 grid grid-cols-12 gap-1.5 items-stretch shrink-0">
          {/* Left: Framed Square Champion Portrait (Authentic Cynthia Shoulder Pose) */}
          <div className="col-span-4 bg-[#183828] border-2 border-[#081820] overflow-hidden flex items-center justify-center h-[84px] sm:h-[90px] p-0.5">
            <img
              src="/sprites/trainers/cynthia_portrait_bust.png"
              alt="Champion Cynthia Portrait"
              className="w-full h-full object-contain object-top pixelated select-none"
              loading="eager"
            />
          </div>

          {/* Right: Cream Dialogue Speech Box + Hanko Seal */}
          <div className="col-span-8 bg-[#e8f4c8] border-2 border-[#081820] px-3 pt-2.5 pb-1.5 flex flex-col justify-between relative">
            <p
              className="text-[12.5px] xs:text-[13.5px] font-bold text-[#102018] leading-[1.24] pr-7"
              style={{ fontFamily: "'Silkscreen', monospace" }}
            >
              {isVictory
                ? 'Magnificent strategy. You’ve conquered today’s challenge!'
                : 'A valiant effort... Study my lineup and return stronger tomorrow!'}
            </p>

            <div className="absolute bottom-1.5 right-2">
              <span className="gba-hanko-seal text-[11px] px-1.5 py-0.5 font-bold">
                {isVictory ? '勝' : '敗'}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. SQUAD MATCH SUMMARY / BATTLE REPORT SUMMARY
           =================================================================== */}
        <GbaTrapezoidCard title={isVictory ? 'SQUAD MATCH SUMMARY' : 'BATTLE REPORT SUMMARY'}>
          {/* Defeat Only: Single-Line BATTLE REPORT — REMAINING: X/6 + 6 Party Spheres */}
          {!isVictory && (
            <div className="flex items-center justify-between gap-1.5 px-0.5 pb-1.5 mb-1 border-b border-[#789868]">
              <div
                className="text-[11px] xs:text-[11.5px] font-bold text-[#081820] whitespace-nowrap tracking-tight"
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                BATTLE REPORT — REMAINING:{' '}
                <span className="text-[#a83838]">{actualOpponentRemaining}/6</span>
              </div>
              <div className="flex items-center gap-[3px] shrink-0">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const isRemaining = idx < actualOpponentRemaining;
                  return (
                    <span
                      key={idx}
                      className="inline-block w-2.5 h-2.5 rounded-full border border-[#081820]"
                      style={{
                        backgroundColor: isRemaining ? '#b83838' : '#788078',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 6-Pokémon Horizontal Lineup with Mini HP Bars & Crimson [KO] Tags */}
          <div className="grid grid-cols-6 gap-1 items-end py-1">
            {(playerTeam.length > 0 ? playerTeam.slice(0, 6) : Array.from({ length: 6 })).map(
              (monItem, idx) => {
                const mon = monItem as Pokemon | undefined;
                const isKo = !isVictory || !mon || mon.fainted || mon.currentHp <= 0;
                const hpPct =
                  mon && !isKo
                    ? Math.max(15, Math.round((mon.currentHp / mon.maxHp) * 100))
                    : 100;

                return (
                  <div key={mon?.id || idx} className="flex flex-col items-center">
                    <div className="relative w-11 h-11 xs:w-12 xs:h-12 flex items-center justify-center">
                      {mon?.spriteFront ? (
                        <img
                          src={mon.spriteFront}
                          alt={mon.species}
                          className={`w-full h-full object-contain pixelated select-none ${
                            isKo ? 'brightness-90 contrast-110' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#306850]/30 rounded-full" />
                      )}

                      {isKo && (
                        <span className="absolute bottom-0.5 inset-x-1 bg-[#982828] border border-[#081820] text-[#e8f4c8] gba-title-text text-[8px] font-bold text-center py-[1px] leading-none">
                          KO
                        </span>
                      )}
                    </div>

                    <div className="w-full flex items-center gap-[2px] mt-1">
                      <span className="font-pixel text-[5px] font-bold text-[#081820] leading-none">
                        HP
                      </span>
                      <div className="flex-1 h-[5px] bg-[#203028] border border-[#081820] rounded-[1px] overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: isKo ? '100%' : `${hpPct}%`,
                            backgroundColor: isKo ? '#983030' : '#58b858',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Bottom Match Stats Strip (Zero Truncation, Clean Single-Row Alignment) */}
          <div className="mt-1.5 pt-1.5 border-t-2 border-[#789868] text-[#081820]">
            {isVictory ? (
              <div
                className="w-full flex items-center justify-between whitespace-nowrap text-[11px] xs:text-[11.5px] font-bold tracking-tight px-0.5"
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                <span>TURNS: {String(turnNumber).padStart(2, '0')}</span>
                <span className="text-[#306850]">|</span>
                <span>MVP: {mvpName}</span>
                <span className="text-[#306850]">|</span>
                <span>STREAK: 5 DAYS</span>
              </div>
            ) : (
              <div
                className="w-full grid grid-cols-[auto_auto_auto_auto_auto] items-center justify-between gap-1 text-[9.5px] xs:text-[10px] font-bold leading-[1.15] tracking-tight"
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                <div className="text-center whitespace-nowrap">
                  <div>TURNS</div>
                  <div>SURVIVED: {String(turnNumber).padStart(2, '0')}</div>
                </div>
                <div className="w-[2px] h-5 bg-[#789868]" />
                <div className="text-center whitespace-nowrap">MVP: {mvpName}</div>
                <div className="w-[2px] h-5 bg-[#789868]" />
                <div className="text-center whitespace-nowrap">
                  <div>CYNTHIA ACE:</div>
                  <div>
                    {aceName} ({aceHpPct}% HP)
                  </div>
                </div>
              </div>
            )}
          </div>
        </GbaTrapezoidCard>

        {/* ===================================================================
            4. VICTORY REWARDS / CONSOLATION & TACTICAL TIP BOX
           =================================================================== */}
        <GbaTrapezoidCard title={isVictory ? 'VICTORY REWARDS' : 'CONSOLATION & TACTICAL TIP'}>
          {isVictory ? (
            <div className="grid grid-cols-2 gap-2 items-center py-0.5">
              {/* Left: +2 Booster Packs */}
              <div className="flex items-center justify-center gap-2">
                <PixelBoosterPackSVG />
                <div
                  className="text-[12.5px] xs:text-[13.5px] font-bold text-[#081820] leading-[1.15] text-left"
                  style={{ fontFamily: "'Silkscreen', monospace" }}
                >
                  <div>+2 BOOSTER</div>
                  <div>PACKS</div>
                </div>
              </div>

              {/* Right: +100 Dust */}
              <div className="flex items-center justify-center gap-2">
                <PixelStardustSVG />
                <div
                  className="text-[12.5px] xs:text-[13.5px] font-bold text-[#081820] leading-[1.15] text-left"
                  style={{ fontFamily: "'Silkscreen', monospace" }}
                >
                  <div>+100</div>
                  <div>DUST</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2.5 py-0.5">
              <PixelStardustSVG />
              <div
                className="text-left min-w-0"
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                <div className="text-[12px] xs:text-[13px] font-bold text-[#081820] whitespace-nowrap tracking-tight">
                  +25 STARDUST (CONSOLATION)
                </div>
                <div className="text-[10.5px] xs:text-[11px] font-bold text-[#183828] leading-[1.2] mt-0.5">
                  TIP: Try switching your LEAD or testing the STALL team!
                </div>
              </div>
            </div>
          )}
        </GbaTrapezoidCard>

        {/* ===================================================================
            5. BOTTOM STACKED GBA ACTION BUTTONS (3 Full-Width Beveled Plates)
           =================================================================== */}
        <div className="w-full flex flex-col gap-1.5 shrink-0">
          {isVictory ? (
            <>
              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onOpenGachaModal();
                }}
                className="w-full gba-btn py-2.5 px-4 flex items-center justify-center gap-2.5 shadow-[0_0_10px_rgba(136,192,112,0.45)] cursor-pointer"
              >
                <PixelChestIcon />
                <span className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] tracking-wider whitespace-nowrap">
                  OPEN REWARD PACKS
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onRestartBattle();
                }}
                className="w-full gba-btn py-2.5 px-4 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <PixelSwordsIcon />
                <span className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] tracking-wider whitespace-nowrap">
                  REMATCH CHAMPION
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onExitToTitle();
                }}
                className="w-full gba-btn py-2.5 px-4 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <PixelHouseIcon />
                <span className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] tracking-wider whitespace-nowrap">
                  MAIN MENU
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onRestartBattle();
                }}
                className="w-full gba-btn py-2.5 px-4 flex items-center justify-center gap-2.5 shadow-[0_0_10px_rgba(184,64,64,0.55)] cursor-pointer"
                style={{ borderColor: '#c86050' }}
              >
                <PixelSwordsIcon />
                <span className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] tracking-wider whitespace-nowrap">
                  REMATCH CHAMPION
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  if (onChangeTeam) {
                    onChangeTeam();
                  } else {
                    onExitToTitle();
                  }
                }}
                className="w-full gba-btn py-2.5 px-4 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <PixelSwapIcon />
                <span className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] tracking-wider whitespace-nowrap">
                  CHANGE TEAM / LEAD
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onExitToTitle();
                }}
                className="w-full gba-btn py-2.5 px-4 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <PixelHouseIcon />
                <span className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] tracking-wider whitespace-nowrap">
                  MAIN MENU
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
