/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VS CHAMP — Symmetrical Upcoming Battle Preview Screen
 * Symmetrical match to Team & Lead Selector visual design:
 * - Warm tan wave-scroll frame (#cbb98c)
 * - Dark olive recess (#384430) with cream chamfered polygon headers
 * - Full Pokémon pixel front sprites on subtle ground shadows with 100% green HP bars
 * - Symmetrical 50/50 Opponent Dossier:
 *     Left: Real trainer battle sprite + centered type badge
 *     Right: Dialogue quote + Starting Lead Pokémon + Mystery bench Pokéballs
 * - Authentic double-beveled GBA START BATTLE button with Target Reticle
 */

import React from 'react';
import { soundFX } from './AudioEngine';
import { Pokemon } from '../game/types';
import { getSpriteUrl } from '../game/data/typeChart';

export interface OpponentPreviewInfo {
  name: string;
  title: string;
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#081820] select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming Battle Preview"
    >
      {/* Outer Warm Tan Wave-Scroll Frame (Exact match to Team & Lead Selector) */}
      <div
        className="relative w-full max-w-[430px] h-[100dvh] max-h-[840px] flex flex-col justify-between p-2.5 sm:p-3 overflow-hidden border-x-4 border-[#182418]"
        style={{
          backgroundColor: '#cbb98c',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23cbb98c'/%3E%3Cpath d='M0 0h16v2H0V0zm0 14h16v2H0v-2zM2 4h12v8H2V4zm2 2v4h8V6H4z' fill='%239c8860' fill-opacity='0.38'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Inner Dark Olive Recess Frame */}
        <div className="w-full h-full bg-[#384430] border-[3px] border-[#182418] p-2.5 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_0_2px_#788860] rounded-lg">
          
          {/* 1. TOP HEADER BANNER */}
          <header className="relative w-full h-[54px] shrink-0 mb-2">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 360 54"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <polygon points="6,0 354,0 360,6 360,48 354,54 6,54 0,48 0,6" fill="#182418" />
              <polygon points="8,3 352,3 357,8 357,46 352,51 8,51 3,46 3,8" fill="#607450" />
              <polygon points="11,6 349,6 354,11 354,43 349,48 11,48 6,43 6,11" fill="#182418" />
              <polygon points="13,8 347,8 352,13 352,41 347,46 13,46 8,41 8,13" fill="#e0ecd0" />
            </svg>
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-0.5">
              <div className="font-pixel text-[7.5px] text-[#506c44] font-bold tracking-wider uppercase mb-0.5">
                {mode === 'gauntlet'
                  ? isFinalStage
                    ? 'GAUNTLET FINAL • STAGE 5 OF 5'
                    : `GAUNTLET • ROUND ${stageNumber} OF ${totalStages}`
                  : "TODAY'S CHAMPION SHOWDOWN"}
              </div>
              <h1 className="gba-title-text text-[16px] sm:text-[18px] font-bold text-[#182418] leading-none">
                {mode === 'gauntlet'
                  ? isFinalStage
                    ? `FINAL: ${opponent.name}`
                    : `NEXT: ${opponent.name}`
                  : opponent.name}
              </h1>
            </div>
          </header>

          {/* 2. BODY CONTENT */}
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5 my-0.5">
            
            {/* CARD A: INTER-ROUND TEAM RECOVERY CARD (With Full Pokémon Pixel Sprites!) */}
            <article className="relative w-full shrink-0">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 120"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon points="6,0 354,0 360,6 360,114 354,120 6,120 0,114 0,6" fill="#182418" />
                <polygon points="8,2 352,2 357,7 357,113 352,118 8,118 3,113 3,7" fill="#506c44" />
                <polygon points="10,4 350,4 355,9 355,111 350,116 10,116 5,111 5,9" fill="#182418" />
                <polygon points="12,6 348,6 353,11 353,109 348,114 12,114 7,109 7,11" fill="#e8f0d8" />
              </svg>

              <div className="relative z-10 p-2.5 flex flex-col justify-between h-full">
                {/* Header Row */}
                <div className="flex items-center justify-between pb-1 border-b border-[#a8c088]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">💖</span>
                    <span className="gba-title-text text-[11px] font-bold text-[#182418]">
                      {isHealed ? 'TEAM RESTORED TO FULL HP & PP' : 'ACTIVE SQUAD STATUS'}
                    </span>
                  </div>
                  <span className="font-pixel text-[7px] text-[#285020] bg-[#c8e0a8] px-1.5 py-0.5 rounded border border-[#688848] font-bold">
                    100% READY
                  </span>
                </div>

                {/* 6-Mon Party Preview: Sprites + HP Bars + Names */}
                <div className="grid grid-cols-6 gap-1.5 my-1">
                  {playerTeam.slice(0, 6).map((mon, idx) => {
                    const isLead = idx === 0;
                    return (
                      <div
                        key={mon.id || idx}
                        className={`relative flex flex-col items-center bg-[#d8ecc0] p-1 rounded border shadow-sm ${
                          isLead ? 'border-[#506c44]' : 'border-[#a8c088]'
                        }`}
                      >
                        {isLead && (
                          <div className="absolute -top-1.5 px-1 bg-[#182818] text-[#f0c830] text-[5.5px] rounded font-bold uppercase tracking-tighter">
                            LEAD
                          </div>
                        )}
                        {/* Pixel Sprite with Ground Shadow */}
                        <div className="relative w-10 h-10 flex items-center justify-center mt-1">
                          <div className="absolute bottom-0 w-8 h-1.5 rounded-full bg-[#b8cc98]" />
                          <img
                            src={getSpriteUrl(mon.nationalDex, false)}
                            alt={mon.species}
                            className="w-10 h-10 object-contain pixelated relative z-10"
                            loading="eager"
                          />
                        </div>
                        <div className="w-full h-1.5 rounded bg-[#488838] border border-[#182818] mt-1 shadow-sm" />
                        <span className="font-pixel text-[6.5px] text-[#284020] mt-0.5 truncate font-bold max-w-full">
                          {mon.species.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="font-pixel text-[7.5px] text-[#304828] text-center leading-tight">
                  Party fully healed! All moves replenished to maximum PP.
                </p>
              </div>
            </article>

            {/* CARD B: UPCOMING OPPONENT DOSSIER (Symmetrical 50/50 Split) */}
            <article className="relative w-full flex-1 min-h-[220px]">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 220"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon points="6,0 354,0 360,6 360,214 354,220 6,220 0,214 0,6" fill="#182418" />
                <polygon points="8,2 352,2 357,7 357,213 352,218 8,218 3,213 3,7" fill="#506c44" />
                <polygon points="10,4 350,4 355,9 355,211 350,216 10,216 5,211 5,9" fill="#182418" />
                <polygon points="12,6 348,6 353,11 353,209 348,214 12,214 7,209 7,11" fill="#e8f0d8" />
                {/* Centered Vertical Divider exactly at 50% width (180px) */}
                <rect x="178" y="6" width="3" height="208" fill="#182418" />
              </svg>

              <div className="relative z-10 w-full h-full grid grid-cols-2 p-3 gap-3">
                
                {/* LEFT 50%: Trainer Battle Sprite & Type Specialty Badge */}
                <div className="flex flex-col items-center justify-between pr-1">
                  <div className="w-full text-center">
                    <span className="font-pixel text-[7.5px] text-[#284818] bg-[#d0e4b8] px-2 py-0.5 rounded border border-[#688848] font-bold uppercase tracking-tight">
                      {opponent.title}
                    </span>
                  </div>

                  {/* Real Trainer Battle Sprite Box */}
                  <div className="relative w-32 h-32 my-1 flex items-center justify-center bg-[#c8dcaf] border-2 border-[#182818] rounded-md shadow-inner overflow-hidden p-1">
                    <img
                      src={opponent.spriteUrl}
                      alt={opponent.name}
                      className="w-full h-full object-contain pixelated drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                    />
                    {/* LV. 100 Badge */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#182818] text-[#e8f0d8] font-pixel text-[6.5px] rounded font-bold">
                      LV. 100
                    </div>
                  </div>

                  {/* Trainer Specialty Type Badge */}
                  <div className="w-full text-center">
                    <span
                      className="font-pixel text-[8px] text-[#e8f0d8] px-3 py-0.5 rounded border border-[#182818] font-bold uppercase"
                      style={{ backgroundColor: opponent.typeBg || '#902820' }}
                    >
                      {opponent.typeSpecialty}
                    </span>
                  </div>
                </div>

                {/* RIGHT 50%: Opponent Name, Dialogue & Starting Lead Pokémon Preview */}
                <div className="flex flex-col justify-between pl-1">
                  <div>
                    <h2 className="gba-title-text text-[16px] sm:text-[18px] font-bold text-[#182818] leading-tight mb-1 text-center">
                      {opponent.name}
                    </h2>

                    {/* Dialogue Quote Box */}
                    <div className="p-2 bg-[#d8ecc0] border border-[#182818] rounded font-pixel text-[7.5px] text-[#182818] leading-[1.4] mb-2 shadow-sm text-center italic">
                      {opponent.quote}
                    </div>
                  </div>

                  {/* Only Lead Pokémon Revealed — Bench Stays Mystery! */}
                  <div className="p-2 bg-[#d8ecc0] border border-[#182818] rounded space-y-1.5">
                    <div className="font-pixel text-[7.5px] text-[#284818] font-bold flex items-center justify-between border-b border-[#a8c088] pb-1">
                      <span>STARTING LEAD:</span>
                      <span className="text-[#902820] font-bold uppercase">{opponent.leadPokemonName}</span>
                    </div>

                    {/* Lead Mon Sprite + Info */}
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#c8dcaf] border border-[#182818] rounded flex items-center justify-center shrink-0">
                        <img
                          src={getSpriteUrl(opponent.leadPokemonDex, false)}
                          alt={opponent.leadPokemonName}
                          className="w-9 h-9 object-contain pixelated"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-pixel text-[8px] font-bold text-[#182818] truncate">
                          {opponent.leadPokemonName.toUpperCase()} LV. 100
                        </div>
                        <div className="font-pixel text-[6.5px] text-[#385828]">
                          {opponent.leadPokemonDetail}
                        </div>
                      </div>
                    </div>

                    {/* Hidden Mystery Bench (Pokéball silhouettes — No Spoilers!) */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#a8c088] font-pixel text-[7px] text-[#305020]">
                      <span>BENCH (HIDDEN):</span>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: Math.max(0, opponent.benchCount - 1) }).map((_, i) => (
                          <span key={i} title={`Bench Member #${i + 2} (Mystery)`} className="text-xs">
                            ⚪
                          </span>
                        ))}
                        <span title="Ace Pokémon (Mystery)" className="text-xs text-[#902820]">
                          🔴
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </article>

          </div>

          {/* 3. BOTTOM START BATTLE CTA (Target Reticle Emblem) */}
          <footer className="relative w-full h-[58px] shrink-0 mt-2">
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
                viewBox="0 0 360 58"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon points="8,0 352,0 360,8 360,50 352,58 8,58 0,50 0,8" fill="#182418" />
                <polygon points="10,3 350,3 357,10 357,48 350,55 10,55 3,48 3,10" fill="#788c60" />
                <polygon points="13,6 347,6 354,13 354,45 347,52 13,52 6,45 6,13" fill="#182418" />
                <polygon points="15,8 345,8 352,15 352,43 345,50 15,50 8,43 8,15" fill="#344c2c" />
              </svg>

              <div className="relative z-10 flex flex-col items-center justify-center pt-0.5">
                <span className="gba-title-text text-[17px] sm:text-[19px] font-bold text-[#e8f4d8] drop-shadow-[2px_2px_0_#182418]">
                  {isFinalStage ? 'ENGAGE CHAMPION' : 'CONTINUE TO BATTLE'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-16 h-[2px] bg-[#98b078]" />
                  <svg width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges">
                    <rect x="5" y="1" width="6" height="14" fill="#182418" />
                    <rect x="1" y="5" width="14" height="6" fill="#182418" />
                    <rect x="3" y="3" width="10" height="10" fill="#182418" />
                    <rect x="6" y="2" width="4" height="12" fill="#d8ecd0" />
                    <rect x="2" y="6" width="12" height="4" fill="#d8ecd0" />
                    <rect x="4" y="4" width="8" height="8" fill="#d8ecd0" />
                    <rect x="5" y="5" width="6" height="6" fill="#344c2c" />
                    <rect x="7" y="7" width="2" height="2" fill="#d8ecd0" />
                  </svg>
                  <div className="w-16 h-[2px] bg-[#98b078]" />
                </div>
              </div>
            </button>
          </footer>

        </div>
      </div>
    </div>
  );
};
