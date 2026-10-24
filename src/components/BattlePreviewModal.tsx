/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VS CHAMP — Symmetrical Upcoming Battle Preview Screen
 * Symmetrical match to Team & Lead Selector visual design:
 * - Warm tan wave-scroll frame (#cbb98c)
 * - Dark olive recess (#384430) with cream chamfered polygon headers
 * - Compact Inter-Round Recovery Card (h-[106px]) with neat 32px horizontal sprite strip
 * - Symmetrical 50/50 Opponent Dossier:
 *     Left: Real trainer battle sprite + centered type badge
 *     Right: Dialogue quote + Starting Lead Pokémon + Mystery bench Pokéballs
 * - Unified 100% Mathematically Centered SVG Target Reticle with Mirrored Lines
 */

import React from 'react';
import { soundFX } from './AudioEngine';
import { Pokemon } from '../game/types';
import { getSpriteUrl } from '../game/data/typeChart';

export interface OpponentPreviewInfo {
  name: string;
  title: string;
  headerTitle?: string;
  typeSpecialty: string;
  typeBg?: string;
  quote: string;
  leadPokemonName: string;
  leadPokemonDex: number;
  leadPokemonDetail: string;
  benchCount: number; // e.g. 4 or 5
  spriteUrl: string;
}

interface BattlePreviewModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onContinueToBattle: () => void;
  mode?: 'gauntlet' | 'daily';
  stageNumber?: number; // 1 to 5
  totalStages?: number; // 5
  opponent: OpponentPreviewInfo;
  playerTeam: Pokemon[];
  isHealed?: boolean;
}

export const BattlePreviewModal: React.FC<BattlePreviewModalProps> = ({
  isOpen,
  onContinueToBattle,
  mode = 'gauntlet',
  stageNumber = 2,
  totalStages = 5,
  opponent,
  playerTeam,
  isHealed = true,
}) => {
  if (!isOpen) return null;

  const isFinalStage = mode === 'gauntlet' && stageNumber === totalStages;

  const stageSubtitle = mode === 'gauntlet'
    ? isFinalStage
      ? `FINAL STAGE • ${stageNumber} OF ${totalStages}`
      : `NEXT UP • STAGE ${stageNumber} OF ${totalStages}`
    : "TODAY'S CHAMPION SHOWDOWN";

  const trainerFullTitle = opponent.headerTitle || (
    opponent.name.startsWith('ELITE FOUR') || opponent.name.startsWith('CHAMPION')
      ? opponent.name
      : opponent.title.includes('ELITE FOUR')
        ? `ELITE FOUR ${opponent.name}`
        : opponent.title.includes('CHAMPION')
          ? `CHAMPION ${opponent.name}`
          : opponent.name
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#081820] select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming Battle Preview"
    >
      {/* Outer Warm Tan Wave-Scroll Frame (Exact match to Team & Lead Selector) */}
      <div
        className="relative w-full max-w-[420px] h-[820px] max-h-[94vh] flex flex-col justify-between p-2.5 overflow-hidden border-x-4 border-[#182418] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
        style={{
          backgroundColor: '#cbb98c',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23cbb98c'/%3E%3Cpath d='M0 0h16v2H0V0zm0 14h16v2H0v-2zM2 4h12v8H2V4zm2 2v4h8V6H4z' fill='%239c8860' fill-opacity='0.38'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Inner Dark Olive Recess Frame */}
        <div className="w-full h-full bg-[#384430] border-[3px] border-[#182418] p-2 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_0_2px_#788860] rounded-lg">
          
          {/* 1. TOP HEADER BANNER (Strict 48px height) */}
          <header className="relative w-full h-[48px] shrink-0 mb-1">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 360 48"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <polygon points="6,0 354,0 360,6 360,42 354,48 6,48 0,42 0,6" fill="#182418" />
              <polygon points="8,2 352,2 357,7 357,41 352,46 8,46 3,41 3,7" fill="#607450" />
              <polygon points="10,4 350,4 355,9 355,39 350,44 10,44 5,39 5,9" fill="#182418" />
              <polygon points="12,6 348,6 353,11 353,37 348,42 12,42 7,37 7,11" fill="#e0ecd0" />
            </svg>
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              <div className="font-pixel text-[7px] sm:text-[7.5px] text-[#506c44] font-bold tracking-wider uppercase mb-0.5">
                {stageSubtitle}
              </div>
              <h1 className="gba-title-text text-[14px] sm:text-[16px] font-bold text-[#182418] leading-none">
                {trainerFullTitle}
              </h1>
            </div>
          </header>

          {/* 2. MAIN BODY CONTENT (Zero overflow, strict height containment) */}
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 my-0.5 overflow-hidden">
            
            {/* CARD A: COMPACT INTER-ROUND RECOVERY CARD (Calibrated 106px Height) */}
            <article className="relative w-full h-[106px] shrink-0">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 106"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon points="6,0 354,0 360,6 360,100 354,106 6,106 0,100 0,6" fill="#182418" />
                <polygon points="8,2 352,2 357,7 357,99 352,104 8,104 3,99 3,7" fill="#506c44" />
                <polygon points="10,4 350,4 355,9 355,97 350,102 10,102 5,97 5,9" fill="#182418" />
                <polygon points="12,6 348,6 353,11 353,95 348,100 12,100 7,95 7,11" fill="#e8f0d8" />
              </svg>

              <div className="relative z-10 px-2.5 py-1.5 flex flex-col justify-between h-full">
                {/* Header Row */}
                <div className="flex items-center justify-between pb-1 border-b border-[#a8c088]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">💖</span>
                    <span className="gba-title-text text-[10px] font-bold text-[#182418]">
                      {isHealed ? 'TEAM RESTORED TO FULL HP & PP' : 'ACTIVE SQUAD STATUS'}
                    </span>
                  </div>
                  <span className="font-pixel text-[6.5px] text-[#285020] bg-[#c8e0a8] px-1.5 py-0.2 rounded border border-[#688848] font-bold">
                    100% READY
                  </span>
                </div>

                {/* 1x6 Horizontal Sprite Strip */}
                <div className="grid grid-cols-6 gap-1 items-center justify-items-center">
                  {playerTeam.slice(0, 6).map((mon, idx) => {
                    const isLead = idx === 0;
                    return (
                      <div key={mon.id || idx} className={`flex flex-col items-center w-full ${isLead ? '' : 'pt-2'}`}>
                        {isLead && (
                          <div className="px-1 bg-[#182818] text-[#f0c830] text-[5px] rounded font-bold uppercase tracking-tighter mb-0.5">
                            LEAD
                          </div>
                        )}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <div className="absolute bottom-0 w-7 h-1 rounded-full bg-[#b8cc98]" />
                          <img
                            src={getSpriteUrl(mon.nationalDex, false)}
                            alt={mon.species}
                            className="w-8 h-8 object-contain pixelated relative z-10"
                            loading="eager"
                          />
                        </div>
                        <div className="w-8 h-1 rounded-sm bg-[#488838] border border-[#182818] mt-0.5" />
                        <span className="font-pixel text-[5.5px] text-[#203c18] font-bold truncate max-w-full mt-0.5">
                          {mon.species.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            {/* CARD B: UPCOMING OPPONENT DOSSIER (Strictly contained flex-1 min-h-0) */}
            <article className="relative w-full flex-1 min-h-0">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 270"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon points="6,0 354,0 360,6 360,264 354,270 6,270 0,264 0,6" fill="#182418" />
                <polygon points="8,2 352,2 357,7 357,263 352,268 8,268 3,263 3,7" fill="#506c44" />
                <polygon points="10,4 350,4 355,9 355,261 350,266 10,266 5,261 5,9" fill="#182418" />
                <polygon points="12,6 348,6 353,11 353,259 348,264 12,264 7,259 7,11" fill="#e8f0d8" />
                {/* Centered Vertical Divider exactly at 50% width (x=178) */}
                <rect x="178" y="6" width="3" height="258" fill="#182418" />
              </svg>

              <div className="relative z-10 w-full h-full grid grid-cols-2 p-2.5 gap-2.5 overflow-hidden">
                
                {/* LEFT 50%: Trainer Battle Sprite & Type Specialty Badge */}
                <div className="flex flex-col items-center justify-between py-0.5 overflow-hidden">
                  <div className="w-full text-center">
                    <span className="font-pixel text-[7px] text-[#284818] bg-[#d0e4b8] px-2 py-0.5 rounded border border-[#688848] font-bold uppercase tracking-tight">
                      {opponent.title}
                    </span>
                  </div>

                  {/* Real Trainer Battle Sprite Box */}
                  <div className="relative w-full max-w-[124px] flex-1 my-1 flex items-center justify-center bg-[#c8dcaf] border-2 border-[#182818] rounded-md shadow-inner overflow-hidden p-1 min-h-0">
                    <img
                      src={opponent.spriteUrl}
                      alt={opponent.name}
                      className="max-h-full max-w-full object-contain pixelated drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                    />
                    {/* LV. 100 Badge */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.2 bg-[#182818] text-[#e8f0d8] font-pixel text-[6px] rounded font-bold">
                      LV. 100
                    </div>
                  </div>

                  {/* Trainer Specialty Type Badge */}
                  <div className="w-full text-center">
                    <span
                      className="font-pixel text-[7.5px] text-[#e8f0d8] px-3 py-0.5 rounded border border-[#182818] font-bold uppercase"
                      style={{ backgroundColor: opponent.typeBg || '#902820' }}
                    >
                      {opponent.typeSpecialty}
                    </span>
                  </div>
                </div>

                {/* RIGHT 50%: Opponent Name, Dialogue & Starting Lead Pokémon Preview */}
                <div className="flex flex-col justify-between py-0.5 overflow-hidden">
                  <div className="flex flex-col items-center text-center">
                    <h2 className="gba-title-text text-[15px] sm:text-[17px] font-bold text-[#182818] leading-tight mb-1">
                      {opponent.name}
                    </h2>

                    {/* Dialogue Quote Box */}
                    <div className="w-full p-2 bg-[#d8ecc0] border border-[#182818] rounded font-pixel text-[7px] text-[#182818] leading-[1.4] shadow-sm italic text-center">
                      {opponent.quote}
                    </div>
                  </div>

                  {/* Only Lead Pokémon Revealed — Bench Stays Mystery! */}
                  <div className="w-full p-2 bg-[#d8ecc0] border border-[#182818] rounded space-y-1 shadow-sm shrink-0">
                    <div className="font-pixel text-[7px] text-[#284818] font-bold flex items-center justify-between border-b border-[#a8c088] pb-0.5">
                      <span>STARTING LEAD:</span>
                      <span className="text-[#902820] font-bold uppercase">{opponent.leadPokemonName}</span>
                    </div>

                    {/* Lead Mon Sprite + Info */}
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-[#c8dcaf] border border-[#182818] rounded flex items-center justify-center shrink-0">
                        <img
                          src={getSpriteUrl(opponent.leadPokemonDex, false)}
                          alt={opponent.leadPokemonName}
                          className="w-8 h-8 object-contain pixelated"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-pixel text-[7.5px] font-bold text-[#182818] truncate">
                          {opponent.leadPokemonName.toUpperCase()} LV. 100
                        </div>
                        <div className="font-pixel text-[6px] text-[#385828] truncate">
                          {opponent.leadPokemonDetail}
                        </div>
                      </div>
                    </div>

                    {/* Hidden Mystery Bench (Pokéballs — No Spoilers!) */}
                    <div className="flex items-center justify-between pt-0.5 border-t border-[#a8c088] font-pixel text-[6.5px] text-[#305020]">
                      <span>BENCH (MYSTERY):</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.max(0, opponent.benchCount - 1) }).map((_, i) => (
                          <span key={i} title={`Bench Member #${i + 2} (Mystery)`} className="text-[10px]">
                            ⚪
                          </span>
                        ))}
                        <span title="Ace Pokémon (Mystery)" className="text-[10px] text-[#902820]">
                          🔴
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </article>

          </div>

          {/* 3. BOTTOM START BATTLE CTA (With 100% Mathematically Centered Reticle SVG) */}
          <footer className="relative w-full h-[54px] shrink-0 mt-1">
            <button
              type="button"
              onClick={() => {
                soundFX.playSelect();
                onContinueToBattle();
              }}
              className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer active:translate-y-[1px]"
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 54"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon points="8,0 352,0 360,8 360,46 352,54 8,54 0,46 0,8" fill="#182418" />
                <polygon points="10,3 350,3 357,10 357,44 350,51 10,51 3,44 3,10" fill="#788c60" />
                <polygon points="13,6 347,6 354,13 354,41 347,48 13,48 6,41 6,13" fill="#182418" />
                <polygon points="15,8 345,8 352,15 352,39 345,46 15,46 8,39 8,15" fill="#344c2c" />
              </svg>

              <div className="relative z-10 flex flex-col items-center justify-center pt-0.5">
                <span className="gba-title-text text-[16px] sm:text-[18px] font-bold text-[#e8f4d8] drop-shadow-[2px_2px_0_#182418] leading-none mb-1">
                  {isFinalStage ? 'ENGAGE CHAMPION' : 'CONTINUE TO BATTLE'}
                </span>
                {/* Unified Mathematically Centered SVG Target Reticle with Mirrored Flanking Lines */}
                <svg width="160" height="14" viewBox="0 0 160 14" shapeRendering="crispEdges" className="overflow-visible">
                  {/* Left Horizontal Line (Length 66px, from x=3 to x=69) */}
                  <rect x="3" y="6" width="66" height="2" fill="#98b078" />
                  {/* Center Target Reticle Emblem (14x14, centered on x=80, bounds 73..87) */}
                  <g transform="translate(73, 0)">
                    <rect x="4" y="0" width="6" height="14" fill="#182418" />
                    <rect x="0" y="4" width="14" height="6" fill="#182418" />
                    <rect x="2" y="2" width="10" height="10" fill="#182418" />
                    <rect x="5" y="1" width="4" height="12" fill="#d8ecd0" />
                    <rect x="1" y="5" width="12" height="4" fill="#d8ecd0" />
                    <rect x="3" y="3" width="8" height="8" fill="#d8ecd0" />
                    <rect x="4" y="4" width="6" height="6" fill="#344c2c" />
                    <rect x="6" y="6" width="2" height="2" fill="#d8ecd0" />
                  </g>
                  {/* Right Horizontal Line (Length 66px, from x=91 to x=157) */}
                  <rect x="91" y="6" width="66" height="2" fill="#98b078" />
                </svg>
              </div>
            </button>
          </footer>

        </div>
      </div>
    </div>
  );
};
