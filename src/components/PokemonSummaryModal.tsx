/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Pokemon, PokemonType } from '../game/types';
import { GBA_TYPE_COLORS, TYPE_ABBR, getOfficialArtworkUrl } from '../game/data/typeChart';
import { soundFX } from './AudioEngine';
import { getPokemonStatDisplayList, getAccuracyEvasionDisplay } from '../game/statCalculator';

interface PokemonSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPokemon: Pokemon;
  playerTeam: Pokemon[];
  opponentMon: Pokemon;
  isOpponentInitial?: boolean;
}

export const PokemonSummaryModal: React.FC<PokemonSummaryModalProps> = ({
  isOpen,
  onClose,
  initialPokemon,
  playerTeam,
  opponentMon,
  isOpponentInitial = false,
}) => {
  const [selectedMonId, setSelectedMonId] = useState<string>(
    isOpponentInitial ? opponentMon.id : initialPokemon.id
  );
  const [activeTab, setActiveTab] = useState<'stats' | 'moves'>('stats');

  if (!isOpen) return null;

  const isViewingOpponent = selectedMonId === opponentMon.id;
  const currentMon = isViewingOpponent
    ? opponentMon
    : playerTeam.find((p) => p.id === selectedMonId) || initialPokemon;

  const hpPct = Math.max(0, Math.min(100, Math.round((currentMon.currentHp / currentMon.maxHp) * 100)));

  const getHpFillHex = (pct: number) => {
    if (pct > 50) return '#58d878';
    if (pct > 20) return '#e8b828';
    return '#d84848';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#081820]/95 gba-outer-wave gba-scanlines overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-label={`${currentMon.species} Battle Summary`}
    >
      <div className="relative z-10 w-full max-w-[420px] my-auto gba-frame-emerald p-3 flex flex-col gap-2.5 text-[#e0f8d0]">
        {/* 1. GBA Summary Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#306850] pb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="gba-hanko-seal text-[9px] px-1.5 py-0.5 font-bold shrink-0">
              {isViewingOpponent ? '敵' : '味'}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <h2 className="gba-title-text text-[12.5px] xs:text-[13.5px] font-bold text-[#e0f8d0] uppercase tracking-wider">
                  POKÉMON SUMMARY
                </h2>
                <span className="font-pixel text-[6.5px] px-1.5 py-0.5 bg-[#081820] text-[#88c070] border border-[#88c070] shrink-0">
                  {isViewingOpponent ? 'CHAMPION' : 'SQUAD'}
                </span>
              </div>
              <p className="font-pixel text-[6px] text-[#88c070] mt-0.5 truncate">
                GEN 3 STATS, ABILITY &amp; MOVE CODEX
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            aria-label="Close Summary"
            className="gba-select-btn px-2 py-1 font-pixel text-[8px] cursor-pointer shrink-0"
          >
            [X]
          </button>
        </div>

        {/* 2. Squad Quick-Switch Strip */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setSelectedMonId(opponentMon.id);
            }}
            className={`px-2 py-1 font-pixel text-[7px] shrink-0 border-2 cursor-pointer ${
              isViewingOpponent
                ? 'bg-[#a84040] border-[#e0f8d0] text-[#e0f8d0]'
                : 'bg-[#081820] border-[#306850] text-[#88c070]'
            }`}
          >
            FOE: {opponentMon.species.toUpperCase()}
          </button>

          {playerTeam.map((mon) => {
            const isSelected = selectedMonId === mon.id;
            return (
              <button
                key={mon.id}
                type="button"
                onClick={() => {
                  soundFX.playSelect();
                  setSelectedMonId(mon.id);
                }}
                className={`px-2 py-1 font-pixel text-[7px] shrink-0 border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#306850] border-[#e0f8d0] text-[#e0f8d0]'
                    : 'bg-[#081820] border-[#306850] text-[#88c070]'
                } ${mon.fainted ? 'opacity-50 line-through' : ''}`}
              >
                {mon.species.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* 3. Cream GBA Pokémon Profile Plate */}
        <div className="gba-frame-cream p-3 text-[#081820] grid grid-cols-12 gap-2.5 items-center overflow-hidden">
          {/* Left: Sprite & Dex Number */}
          <div className="col-span-5 flex flex-col items-center justify-center bg-[#183828] border-2 border-[#081820] p-2 relative">
            <span className="font-pixel text-[6.5px] text-[#88c070] self-start">
              No.{String(currentMon.nationalDex).padStart(3, '0')}
            </span>
            <img
              src={currentMon.spriteFront || getOfficialArtworkUrl(currentMon.nationalDex)}
              alt={currentMon.species}
              className="w-20 h-20 object-contain pixelated my-0.5 select-none"
            />
            <span className="gba-title-text text-[10px] font-bold text-[#e0f8d0]">
              Lv{currentMon.level}
            </span>
          </div>

          {/* Right: Name, Canonical Type Plates, HP Pill & Ability */}
          <div className="col-span-7 flex flex-col justify-between gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <h3 className="gba-title-text text-[12px] xs:text-[13px] font-bold text-[#081820] uppercase whitespace-nowrap">
                {currentMon.species}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {currentMon.types.map((t: PokemonType) => {
                  const col = GBA_TYPE_COLORS[t] || GBA_TYPE_COLORS.Normal;
                  return (
                    <span
                      key={t}
                      className="gba-title-text text-[7.5px] font-bold px-1.5 py-[1.5px] rounded-[2px] border border-[#081820] uppercase leading-none"
                      style={{ backgroundColor: col.bg, color: col.text }}
                    >
                      {TYPE_ABBR[t]}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* GBA HP Capsule */}
            <div className="w-full flex items-center bg-[#244034] border-[1.5px] border-[#081820] rounded-full pl-2 pr-1 py-[2px]">
              <span className="font-pixel text-[6.5px] font-bold text-[#e88840] mr-1.5">HP</span>
              <div className="flex-1 h-[6.5px] bg-[#405850] border border-[#e8f8d8] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${hpPct}%`, backgroundColor: getHpFillHex(hpPct) }}
                />
              </div>
            </div>
            <div className="text-right gba-title-text text-[10px] font-bold text-[#081820]">
              {Math.max(0, currentMon.currentHp)} / {currentMon.maxHp}
            </div>

            {/* Ability Strip */}
            <div className="bg-[#d0e4b0] border border-[#306850] p-1.5">
              <div className="gba-title-text text-[9px] font-bold text-[#183828] uppercase">
                ABILITY: {currentMon.ability}
              </div>
              <p className="gba-title-text text-[8.5px] text-[#081820] leading-tight mt-0.5">
                {currentMon.abilityDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Mode Toggle Tabs (STATS vs MOVES) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('stats');
            }}
            className={`py-1.5 gba-title-text text-[11px] font-bold border-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#e0f8d0] text-[#081820] border-[#88c070]'
                : 'bg-[#081820] text-[#88c070] border-[#306850]'
            }`}
          >
            ▶ BASE STATS
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('moves');
            }}
            className={`py-1.5 gba-title-text text-[11px] font-bold border-2 cursor-pointer ${
              activeTab === 'moves'
                ? 'bg-[#e0f8d0] text-[#081820] border-[#88c070]'
                : 'bg-[#081820] text-[#88c070] border-[#306850]'
            }`}
          >
            ▶ MOVES (4)
          </button>
        </div>

        {/* 5. Tab Content */}
        {activeTab === 'stats' ? (
          <div className="flex flex-col gap-1.5">
            <div className="gba-frame-cream p-2 text-[#081820] grid grid-cols-3 gap-1.5">
              {getPokemonStatDisplayList(currentMon).map((stat) => {
                if (stat.key === 'hp') {
                  return (
                    <div
                      key={stat.key}
                      className="bg-[#d0e4b0] border border-[#306850] p-1.5 flex flex-col justify-between min-h-[52px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-[6.5px] text-[#306850]">{stat.label}</span>
                      </div>
                      <span className="gba-title-text text-[12px] font-bold text-[#081820] mt-0.5">
                        {stat.effectiveVal}
                      </span>
                      <span className="font-pixel text-[5.5px] text-[#306850]">
                        Max: {stat.baseVal}
                      </span>
                    </div>
                  );
                }

                const isBoosted = stat.isBoosted;
                const isReduced = stat.isReduced;
                const isParalyzed = stat.isParalyzed;

                let boxBg = 'bg-[#d0e4b0] border-[#306850]';
                let valColor = 'text-[#081820]';
                let subColor = 'text-[#306850]';

                if (isBoosted) {
                  boxBg = 'bg-[#c8e8a8] border-2 border-[#306850] shadow-sm';
                  valColor = 'text-[#183828]';
                  subColor = 'text-[#183828] font-semibold';
                } else if (isParalyzed) {
                  boxBg = 'bg-[#f0e0c8] border-2 border-[#e88840]';
                  valColor = 'text-[#e88840]';
                  subColor = 'text-[#e88840]';
                } else if (isReduced) {
                  boxBg = 'bg-[#f0d8d0] border-2 border-[#a84040]';
                  valColor = 'text-[#a84040]';
                  subColor = 'text-[#a84040]';
                }

                return (
                  <div
                    key={stat.key}
                    className={`${boxBg} border p-1.5 flex flex-col justify-between min-h-[52px] transition-all`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-pixel text-[6.5px] text-[#306850]">{stat.label}</span>
                      {isBoosted && (
                        <span className="font-pixel text-[6px] px-1 py-[0.5px] bg-[#306850] text-[#e0f8d0] rounded-[2px] font-bold">
                          ▲+{stat.stage}
                        </span>
                      )}
                      {stat.stage < 0 && (
                        <span className="font-pixel text-[6px] px-1 py-[0.5px] bg-[#a84040] text-[#e0f8d0] rounded-[2px] font-bold">
                          ▼{stat.stage}
                        </span>
                      )}
                      {isParalyzed && (
                        <span className="font-pixel text-[5.5px] px-1 py-[0.5px] bg-[#e88840] text-[#081820] rounded-[2px] font-bold">
                          PRZ
                        </span>
                      )}
                    </div>
                    <span className={`gba-title-text text-[12px] font-bold ${valColor} mt-0.5`}>
                      {stat.effectiveVal}
                    </span>
                    <span className={`font-pixel text-[5.5px] ${subColor} truncate`}>
                      {stat.stage !== 0 || isParalyzed ? stat.multiplierText : `Base: ${stat.baseVal}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Optional Accuracy & Evasion Row if modified in battle */}
            {(() => {
              const accEva = getAccuracyEvasionDisplay(currentMon);
              if (!accEva.hasModifications) return null;
              return (
                <div className="gba-frame-cream px-2 py-1 text-[#081820] flex items-center justify-around font-pixel text-[6.5px] border border-[#306850]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#306850]">ACCURACY:</span>
                    <span
                      className={`font-bold ${
                        accEva.accuracyStage > 0
                          ? 'text-[#183828]'
                          : accEva.accuracyStage < 0
                          ? 'text-[#a84040]'
                          : 'text-[#081820]'
                      }`}
                    >
                      {accEva.accuracyMultiplierText}
                    </span>
                  </div>
                  <span className="text-[#88c070]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#306850]">EVASION:</span>
                    <span
                      className={`font-bold ${
                        accEva.evasionStage > 0
                          ? 'text-[#183828]'
                          : accEva.evasionStage < 0
                          ? 'text-[#a84040]'
                          : 'text-[#081820]'
                      }`}
                    >
                      {accEva.evasionMultiplierText}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {currentMon.moves.map((m) => {
              const col = GBA_TYPE_COLORS[m.type] || GBA_TYPE_COLORS.Normal;
              return (
                <div
                  key={m.id}
                  className="gba-frame-cream px-2.5 py-1.5 text-[#081820] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="gba-title-text text-[8px] font-bold px-1.5 py-[1px] border border-[#081820] uppercase"
                        style={{ backgroundColor: col.bg, color: col.text }}
                      >
                        {TYPE_ABBR[m.type]}
                      </span>
                      <span className="gba-title-text text-[11px] font-bold text-[#081820] uppercase truncate">
                        {m.name}
                      </span>
                    </div>
                    <p className="gba-title-text text-[8.5px] text-[#183828] truncate mt-0.5">
                      {m.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="gba-title-text text-[9.5px] font-bold text-[#081820]">
                      {m.power > 0 ? `PWR ${m.power}` : 'STATUS'}
                    </div>
                    <div className="font-pixel text-[7px] text-[#306850]">
                      PP {m.pp}/{m.maxPp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Footer Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFX.playSelect();
            onClose();
          }}
          className="w-full gba-btn py-2.5 gba-title-text text-[12px] font-bold text-[#e0f8d0] text-center cursor-pointer"
        >
          [BACK TO BATTLE]
        </button>
      </div>
    </div>
  );
};
