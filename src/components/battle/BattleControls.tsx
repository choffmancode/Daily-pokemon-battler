/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Pokemon, Move } from '../../game/types';
import { GBA_TYPE_COLORS, TYPE_ABBR, getSpriteUrl } from '../../game/data/typeChart';
import { calculateTypeEffectiveness } from '../../game/battleEngine';
import { soundFX } from '../AudioEngine';
import { haptics } from '../../audio/useHaptics';

interface BattleControlsProps {
  playerMon: Pokemon;
  opponentMon: Pokemon;
  playerTeam: Pokemon[];
  playerActiveIndex: number;
  selectedSubMenu: 'moves' | 'switch';
  onSelectSubMenu: (menu: 'moves' | 'switch') => void;
  isTurnProcessing: boolean;
  isAwaitingPlayerInput: boolean;
  playerNeedsSwitch: boolean;
  onSelectMove: (index: number) => void;
  onSwitchPokemon: (index: number) => void;
  onOpenSummary: (mon: Pokemon, isOpponent: boolean) => void;
}

interface EffectivenessTabMeta {
  label: string;
  bg: string;
  text: string;
}

const BattleControlsComponent: React.FC<BattleControlsProps> = ({
  playerMon,
  opponentMon,
  playerTeam,
  playerActiveIndex,
  selectedSubMenu,
  onSelectSubMenu,
  isTurnProcessing,
  isAwaitingPlayerInput,
  playerNeedsSwitch,
  onSelectMove,
  onSwitchPokemon,
  onOpenSummary,
}) => {
  const effectivenessTabs = useMemo(() => {
    const map = new Map<string, EffectivenessTabMeta>();
    for (const move of playerMon.moves) {
      if (move.category === 'Status') {
        map.set(move.id, { label: 'STATUS', bg: '#507068', text: '#e0f8d0' });
      } else {
        const mult = calculateTypeEffectiveness(move.type, opponentMon.types);
        if (mult >= 4) {
          map.set(move.id, { label: '4x SUPER', bg: '#a83838', text: '#e0f8d0' });
        } else if (mult > 1) {
          map.set(move.id, { label: '2x SUPER', bg: '#a83838', text: '#e0f8d0' });
        } else if (mult === 0) {
          map.set(move.id, { label: 'NO EFFECT', bg: '#58646c', text: '#e0f8d0' });
        } else if (mult < 1) {
          map.set(move.id, { label: '0.5x WEAK', bg: '#8c7420', text: '#e0f8d0' });
        } else {
          map.set(move.id, { label: '1x HIT', bg: '#306850', text: '#e0f8d0' });
        }
      }
    }
    return map;
  }, [playerMon.moves, opponentMon.types]);

  const getEffectivenessTab = (move: Move): EffectivenessTabMeta =>
    effectivenessTabs.get(move.id) || { label: '1x HIT', bg: '#306850', text: '#e0f8d0' };

  const aliveCount = playerTeam.filter((p) => !p.fainted && p.currentHp > 0).length;

  return (
    <div className="relative z-20 w-full shrink-0 select-none">
      {/* ===================================================================
          SUB-MENU 1: 2x2 DARK-GREEN CHAMFERED GBA MOVE GRID (Matches v4 Mockup)
         =================================================================== */}
      {selectedSubMenu === 'moves' ? (
        <div className="grid grid-cols-2 gap-1.5">
          {playerMon.moves.slice(0, 4).map((move, idx) => {
            const eff = getEffectivenessTab(move);
            const typeCol = GBA_TYPE_COLORS[move.type] || GBA_TYPE_COLORS.Normal;
            const typeCode = TYPE_ABBR[move.type] || 'NORM';
            const isOutOfPP = move.pp <= 0;
            const disabled = isTurnProcessing || isOutOfPP || !isAwaitingPlayerInput;

            return (
              <button
                key={move.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onSelectMove(idx);
                }}
                className={`relative h-[68px] sm:h-[74px] w-full flex flex-col justify-between overflow-hidden transition-transform ${
                  disabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer active:translate-y-[1px] group'
                }`}
              >
                {/* Chamfered Double-Lined Dark-Green Move Box SVG */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 190 74"
                  preserveAspectRatio="none"
                  shapeRendering="crispEdges"
                >
                  {/* Outer Dark Trim */}
                  <polygon
                    points="6,0 184,0 190,6 190,68 184,74 6,74 0,68 0,6"
                    fill="#081820"
                  />
                  {/* Cream Outer Chamfered Border */}
                  <polygon
                    points="7,2 183,2 188,7 188,67 183,72 7,72 2,67 2,7"
                    fill="#d8ecd0"
                  />
                  {/* Inner Dark Border */}
                  <polygon
                    points="9,4 181,4 186,9 186,65 181,70 9,70 4,65 4,9"
                    fill="#081820"
                  />
                  {/* Consistent Dark-Green Interior Fill (#1c3c2c) */}
                  <polygon
                    points="10,6 180,6 184,10 184,64 180,68 10,68 6,64 6,10"
                    fill="#1c3c2c"
                  />
                  {/* Inner Sage Frame Line */}
                  <polygon
                    points="12,8 178,8 182,12 182,52 178,56 12,56 8,52 8,12"
                    fill="none"
                    stroke="#386850"
                    strokeWidth="1.5"
                  />
                  {/* Top Corner Diagonal Ticks */}
                  <polyline points="11,14 15,10" stroke="#88c070" strokeWidth="2" />
                  <polyline points="179,14 175,10" stroke="#88c070" strokeWidth="2" />
                </svg>

                {/* Top & Middle Content: Move Name + PP */}
                <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col justify-center px-3 pt-1.5 pb-0.5">
                  {/* Centered Move Name */}
                  <div className="w-full text-center truncate leading-none">
                    <span className="gba-title-text text-[11.5px] xs:text-[12.5px] sm:text-[13.5px] font-bold text-[#e0f8d0] uppercase tracking-tight drop-shadow-[1px_1px_0_#081820]">
                      {move.name}
                    </span>
                  </div>

                  {/* PP Row */}
                  <div className="w-full flex items-center justify-between px-1.5 mt-1 leading-none">
                    <span className="gba-title-text text-[10px] xs:text-[11px] font-bold text-[#e0f8d0] drop-shadow-[1px_1px_0_#081820]">
                      PP
                    </span>
                    <span
                      className={`gba-title-text text-[10px] xs:text-[11px] font-bold tabular-nums drop-shadow-[1px_1px_0_#081820] ${
                        isOutOfPP ? 'text-[#e85050]' : 'text-[#e0f8d0]'
                      }`}
                    >
                      {move.pp}/{move.maxPp}
                    </span>
                  </div>
                </div>

                {/* Bottom Symmetrical Angled Tabs (Full 18px Height Matching v4 Mockup) */}
                <div className="relative z-20 w-full h-[18px] shrink-0 flex items-stretch justify-between px-[5px] pb-[3px]">
                  {/* Bottom-Left Angled Type Plate Tab */}
                  <div
                    className="w-[46%] h-full flex items-center justify-center pr-2 border-t border-r border-[#081820]"
                    style={{
                      backgroundColor: typeCol.bg,
                      color: typeCol.text,
                      clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)',
                    }}
                  >
                    <span className="font-pixel text-[8px] font-bold uppercase leading-none tracking-tighter drop-shadow-[1px_1px_0_rgba(0,0,0,0.35)]">
                      {typeCode}
                    </span>
                  </div>

                  {/* Bottom-Right Angled Effectiveness Plate Tab */}
                  <div
                    className="w-[52%] h-full flex items-center justify-center pl-2 border-t border-l border-[#081820]"
                    style={{
                      backgroundColor: eff.bg,
                      color: eff.text,
                      clipPath: 'polygon(16% 0, 100% 0, 100% 100%, 0 100%)',
                    }}
                  >
                    <span className="font-pixel text-[7.5px] font-bold uppercase leading-none tracking-tighter whitespace-nowrap drop-shadow-[1px_1px_0_rgba(0,0,0,0.45)]">
                      {eff.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* ===================================================================
           SUB-MENU 2: 2x3 DARK-GREEN GBA PARTY SWITCH GRID
           =================================================================== */
        <div className="grid grid-cols-2 gap-1.5 h-[142px] sm:h-[154px]">
          {playerTeam.slice(0, 6).map((mon, idx) => {
            const isCurrent = idx === playerActiveIndex;
            const isFainted = mon.fainted || mon.currentHp <= 0;
            const hpPct = Math.max(0, Math.min(100, Math.round((mon.currentHp / mon.maxHp) * 100)));

            return (
              <button
                key={mon.id}
                type="button"
                disabled={isCurrent || isFainted || isTurnProcessing}
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onSwitchPokemon(idx);
                }}
                className={`relative px-2 py-0.5 border-2 flex items-center gap-1.5 text-left transition-transform ${
                  isCurrent
                    ? 'bg-[#285038] border-[#e0f8d0] cursor-default'
                    : isFainted
                    ? 'bg-[#102018] border-[#304838] opacity-50 cursor-not-allowed'
                    : 'bg-[#1c3c2c] border-[#88c070] hover:border-[#e0f8d0] cursor-pointer active:translate-y-[1px]'
                }`}
              >
                <img
                  src={getSpriteUrl(mon.nationalDex, false)}
                  alt={mon.species}
                  className="w-8 h-8 object-contain pixelated shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-pixel text-[8px] font-bold text-[#e0f8d0] truncate uppercase">
                      {mon.species}
                    </span>
                    {isCurrent && (
                      <span className="font-pixel text-[6px] px-1 bg-[#88c070] text-[#081820] font-bold">
                        LEAD
                      </span>
                    )}
                    {isFainted && (
                      <span className="font-pixel text-[6px] px-1 bg-[#a83838] text-[#e0f8d0] font-bold">
                        KO
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-[#081820] border border-[#e0f0c8] mt-0.5 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${hpPct}%`,
                        backgroundColor:
                          hpPct > 50 ? '#58c860' : hpPct > 20 ? '#e8b828' : '#c83838',
                      }}
                    />
                  </div>
                  <div className="font-pixel text-[6.5px] text-[#88c070] mt-0.5 tabular-nums">
                    {Math.max(0, mon.currentHp)}/{mon.maxHp}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ===================================================================
          BOTTOM MODE DOCK: [FIGHT] | [PARTY X/6] | [SUMMARY] (Matches v4 Mockup)
         =================================================================== */}
      <div className="grid grid-cols-3 gap-1.5 mt-1">
        {/* 1. [FIGHT] */}
        <button
          type="button"
          onClick={() => {
            soundFX.playSelect();
            haptics.tap();
            onSelectSubMenu('moves');
          }}
          className="relative h-[34px] sm:h-[38px] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 124 38"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
          >
            <polygon points="5,0 119,0 124,5 124,33 119,38 5,38 0,33 0,5" fill="#081820" />
            <polygon
              points="6,2 118,2 122,6 122,32 118,36 6,36 2,32 2,6"
              fill={selectedSubMenu === 'moves' ? '#e0f8d0' : '#88c070'}
            />
            <polygon points="8,4 116,4 120,8 120,30 116,34 8,34 4,30 4,8" fill="#081820" />
            <polygon
              points="9,5 115,5 119,9 119,29 115,33 9,33 5,29 5,9"
              fill={selectedSubMenu === 'moves' ? '#244c38' : '#183424'}
            />
          </svg>
          <span className="relative z-10 gba-title-text text-[11px] font-bold text-[#e0f8d0] drop-shadow-[1px_1px_0_#081820]">
            [FIGHT]
          </span>
        </button>

        {/* 2. [PARTY X/6] */}
        <button
          type="button"
          onClick={() => {
            soundFX.playSelect();
            haptics.tap();
            onSelectSubMenu(selectedSubMenu === 'switch' ? 'moves' : 'switch');
          }}
          className={`relative h-[34px] sm:h-[38px] flex items-center justify-center cursor-pointer active:translate-y-[1px] ${
            playerNeedsSwitch ? 'animate-pulse' : ''
          }`}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 124 38"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
          >
            <polygon points="5,0 119,0 124,5 124,33 119,38 5,38 0,33 0,5" fill="#081820" />
            <polygon
              points="6,2 118,2 122,6 122,32 118,36 6,36 2,32 2,6"
              fill={
                playerNeedsSwitch
                  ? '#a83838'
                  : selectedSubMenu === 'switch'
                  ? '#e0f8d0'
                  : '#88c070'
              }
            />
            <polygon points="8,4 116,4 120,8 120,30 116,34 8,34 4,30 4,8" fill="#081820" />
            <polygon
              points="9,5 115,5 119,9 119,29 115,33 9,33 5,29 5,9"
              fill={selectedSubMenu === 'switch' ? '#244c38' : '#183424'}
            />
          </svg>
          <span className="relative z-10 gba-title-text text-[10.5px] font-bold text-[#e0f8d0] whitespace-nowrap drop-shadow-[1px_1px_0_#081820]">
            [PARTY {aliveCount}/6]
          </span>
        </button>

        {/* 3. [SUMMARY] */}
        <button
          type="button"
          onClick={() => {
            soundFX.playSelect();
            haptics.tap();
            onOpenSummary(playerMon, false);
          }}
          className="relative h-[34px] sm:h-[38px] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 124 38"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
          >
            <polygon points="5,0 119,0 124,5 124,33 119,38 5,38 0,33 0,5" fill="#081820" />
            <polygon points="6,2 118,2 122,6 122,32 118,36 6,36 2,32 2,6" fill="#88c070" />
            <polygon points="8,4 116,4 120,8 120,30 116,34 8,34 4,30 4,8" fill="#081820" />
            <polygon points="9,5 115,5 119,9 119,29 115,33 9,33 5,29 5,9" fill="#183424" />
          </svg>
          <span className="relative z-10 gba-title-text text-[10.5px] font-bold text-[#e0f8d0] whitespace-nowrap drop-shadow-[1px_1px_0_#081820]">
            [SUMMARY]
          </span>
        </button>
      </div>
    </div>
  );
};

export const BattleControls = React.memo(BattleControlsComponent);
