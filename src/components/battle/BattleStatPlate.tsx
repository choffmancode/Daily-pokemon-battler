/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pokemon, PokemonType } from '../../game/types';
import { GBA_TYPE_COLORS, TYPE_ABBR } from '../../game/data/typeChart';

interface BattleStatPlateProps {
  pokemon: Pokemon;
  isOpponent: boolean;
  remainingCount: number;
  totalCount: number;
  isAwaitingInput?: boolean;
  onOpenSummary: (mon: Pokemon, isOpponent: boolean) => void;
}

const STATUS_BADGE_MAP: Record<string, { label: string; bg: string }> = {
  burn: { label: 'BRN', bg: '#d84028' },
  paralysis: { label: 'PAR', bg: '#d8a018' },
  poison: { label: 'PSN', bg: '#9038a0' },
  toxic: { label: 'TOX', bg: '#702088' },
  sleep: { label: 'SLP', bg: '#687888' },
  freeze: { label: 'FRZ', bg: '#4898c8' },
};

const BattleStatPlateComponent: React.FC<BattleStatPlateProps> = ({
  pokemon,
  isOpponent,
  remainingCount,
  totalCount = 6,
  onOpenSummary,
}) => {
  const hpPct = Math.max(0, Math.min(100, (pokemon.currentHp / pokemon.maxHp) * 100));

  const getHpFillHex = (pct: number) => {
    if (pct > 50) return '#58d878';
    if (pct > 20) return '#e8b828';
    return '#d84848';
  };

  const statusMeta = pokemon.statusCondition ? STATUS_BADGE_MAP[pokemon.statusCondition] : null;

  return (
    <div
      onClick={() => onOpenSummary(pokemon, isOpponent)}
      title={`Click to inspect ${pokemon.species} (${Math.max(0, pokemon.currentHp)}/${pokemon.maxHp} HP)`}
      className="relative w-[220px] xs:w-[232px] sm:w-[244px] shrink-0 cursor-pointer select-none active:translate-y-[1px] transition-transform z-20"
    >
      {/* Chamfered Cream GBA Stat Box + Lower 3D Slate-Green Pointer Ledge (Matches Reference Image) */}
      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        viewBox="0 0 244 84"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        {isOpponent ? (
          /* Opponent Stat Plate: Main Box on Left (0..228), 3D Pointer Ledge Flaring Bottom-Right (18..244) */
          <g>
            {/* Lower 3D Base Ledge & Right-Flared Pointer Tail */}
            <polygon
              points="16,72 228,62 244,78 244,83 22,83"
              fill="#081820"
            />
            <polygon
              points="18,73 227,64 241,78 241,81 24,81"
              fill="#3c5c4c"
            />

            {/* Main Symmetrical Chamfered Card Outer Dark Outline */}
            <polygon
              points="6,0 222,0 228,6 228,68 222,74 6,74 0,68 0,6"
              fill="#081820"
            />
            {/* Olive-Sage Outer Bevel Ring */}
            <polygon
              points="7,2 221,2 226,7 226,67 221,72 7,72 2,67 2,7"
              fill="#4c6c54"
            />
            {/* Top-Left Sage Highlight */}
            <polygon
              points="8,2 220,2 220,4 8,4 4,8 4,66 2,66 2,7"
              fill="#608064"
            />
            {/* Dark Forest-Charcoal Inner Frame */}
            <polygon
              points="9,4 219,4 224,9 224,65 219,70 9,70 4,65 4,9"
              fill="#142c20"
            />
            {/* Soft Cream Card Interior */}
            <polygon
              points="11,6 217,6 221,10 221,64 217,68 11,68 7,64 7,10"
              fill="#e8f4c8"
            />
          </g>
        ) : (
          /* Player Stat Plate: Main Box on Right (16..244), 3D Pointer Ledge Flaring Bottom-Left (0..228) */
          <g>
            {/* Lower 3D Base Ledge & Left-Flared Pointer Tail */}
            <polygon
              points="228,72 16,62 0,78 0,83 222,83"
              fill="#081820"
            />
            <polygon
              points="226,73 17,64 3,78 3,81 220,81"
              fill="#3c5c4c"
            />

            {/* Main Symmetrical Chamfered Card Outer Dark Outline */}
            <polygon
              points="22,0 238,0 244,6 244,68 238,74 22,74 16,68 16,6"
              fill="#081820"
            />
            {/* Olive-Sage Outer Bevel Ring */}
            <polygon
              points="23,2 237,2 242,7 242,67 237,72 23,72 18,67 18,7"
              fill="#4c6c54"
            />
            {/* Top-Left Sage Highlight */}
            <polygon
              points="24,2 236,2 236,4 24,4 20,8 20,66 18,66 18,7"
              fill="#608064"
            />
            {/* Dark Forest-Charcoal Inner Frame */}
            <polygon
              points="25,4 235,4 240,9 240,65 235,70 25,70 20,65 20,9"
              fill="#142c20"
            />
            {/* Soft Cream Card Interior */}
            <polygon
              points="27,6 233,6 237,10 237,64 233,68 27,68 23,64 23,10"
              fill="#e8f4c8"
            />
          </g>
        )}
      </svg>

      {/* Foreground Plate Content — Identical Layout & Generous Breathing Room on Both Boxes */}
      <div
        className={`relative z-10 flex flex-col justify-between pt-2.5 pb-4 ${
          isOpponent ? 'pl-3.5 pr-6' : 'pl-6 pr-3.5'
        }`}
      >
        {/* ROW 1: Pokémon Name (Left) + Level (Right) */}
        <div className="flex items-baseline justify-between gap-1.5 leading-none">
          <span className="gba-title-text text-[11px] xs:text-[11.5px] font-bold text-[#102018] uppercase whitespace-nowrap tracking-[-0.03em]">
            {pokemon.species}
          </span>
          <span className="gba-title-text text-[10.5px] xs:text-[11px] font-bold text-[#102018] shrink-0 tracking-[-0.03em]">
            Lv{pokemon.level}
          </span>
        </div>

        {/* ROW 2: Left Status Slot (22% Indent) + Right-Aligned Rounded Dark-Green HP Pill (78% Width) */}
        <div className="my-1.5 flex items-center justify-end gap-1.5">
          {statusMeta && (
            <span
              className="font-pixel text-[6px] font-bold text-[#f8fcf8] px-1 py-[1.5px] rounded-[2px] border border-[#102018] leading-none shrink-0"
              style={{ backgroundColor: statusMeta.bg }}
            >
              {statusMeta.label}
            </span>
          )}
          <div className="w-[78%] flex items-center bg-[#244034] border-[1.5px] border-[#142820] rounded-full pl-2 pr-1 py-[1.5px] shadow-[inset_0_1px_0_rgba(16,32,24,0.65)]">
            <span className="font-pixel text-[7px] font-bold text-[#e88840] mr-1.5 leading-none tracking-tight drop-shadow-[1px_1px_0_#102018]">
              HP
            </span>
            <div className="flex-1 h-[6.5px] bg-[#405850] border-[1.5px] border-[#e8f8d8] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${hpPct}%`,
                  backgroundColor: getHpFillHex(hpPct),
                }}
              />
            </div>
          </div>
        </div>

        {/* ROW 3: Team Size (6 Pixel Pokéball Spheres on Left) + All Type Plates (Right) */}
        <div className="flex items-center justify-between gap-1.5 leading-none pt-0.5">
          {/* Left: 6 Pixel Pokéball Spheres */}
          <div className="flex items-center gap-[3px] shrink-0">
            {Array.from({ length: totalCount }).map((_, idx) => {
              const isAlive = idx < remainingCount;
              return (
                <svg
                  key={idx}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  shapeRendering="crispEdges"
                  className="shrink-0"
                >
                  {/* Outer Dark Pixel Circle Outline */}
                  <rect x="3" y="0" width="4" height="10" fill="#182428" />
                  <rect x="1" y="1" width="8" height="8" fill="#182428" />
                  <rect x="0" y="3" width="10" height="4" fill="#182428" />
                  {isAlive ? (
                    <>
                      {/* Coral-Red Top Hemisphere */}
                      <rect x="3" y="1" width="4" height="3" fill="#d85868" />
                      <rect x="2" y="2" width="6" height="2" fill="#d85868" />
                      <rect x="1" y="3" width="8" height="1" fill="#d85868" />
                      {/* Specular White-Pink Gleam */}
                      <rect x="3" y="2" width="2" height="1" fill="#ffd8dc" />
                      {/* Center Band & Button */}
                      <rect x="1" y="4" width="8" height="2" fill="#28343c" />
                      <rect x="4" y="4" width="2" height="2" fill="#e8f0f4" />
                      {/* Silver-Cream Bottom Hemisphere */}
                      <rect x="1" y="6" width="8" height="1" fill="#d0dce0" />
                      <rect x="2" y="7" width="6" height="1" fill="#b8c8d0" />
                      <rect x="3" y="8" width="4" height="1" fill="#b8c8d0" />
                    </>
                  ) : (
                    <>
                      {/* Fainted Dark Muted Sphere */}
                      <rect x="3" y="1" width="4" height="8" fill="#485c50" />
                      <rect x="2" y="2" width="6" height="6" fill="#485c50" />
                      <rect x="1" y="3" width="8" height="4" fill="#485c50" />
                      <rect x="1" y="4" width="8" height="2" fill="#24342c" />
                    </>
                  )}
                </svg>
              );
            })}
          </div>

          {/* Right: Canonical 4-Char Type Plates (Shows both/all types on both plates) */}
          <div className="flex items-center gap-1 shrink-0">
            {pokemon.types.map((t: PokemonType) => {
              const col = GBA_TYPE_COLORS[t] || GBA_TYPE_COLORS.Normal;
              return (
                <span
                  key={t}
                  className="gba-title-text text-[8.5px] font-bold px-2 py-[2px] rounded-[3px] border border-[#182820] leading-none uppercase tracking-[0.03em] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_0_rgba(16,32,24,0.3)]"
                  style={{
                    backgroundColor: col.bg,
                    color: col.text,
                    textShadow: '0 1px 0 rgba(8, 24, 32, 0.85)',
                  }}
                >
                  {TYPE_ABBR[t]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BattleStatPlate = React.memo(BattleStatPlateComponent);

