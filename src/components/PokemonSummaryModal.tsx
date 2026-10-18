/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Shield, Swords, Zap, Heart, Sparkles } from 'lucide-react';
import { Pokemon, PokemonType } from '../game/types';
import { TYPE_COLORS } from '../game/constants';
import { getOfficialArtworkUrl } from '../game/data/typeChart';
import { soundFX } from './AudioEngine';

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
  const [selectedMonId, setSelectedMonId] = useState<string>(initialPokemon.id);
  const [activeTab, setActiveTab] = useState<'stats' | 'moves'>('stats');

  if (!isOpen) return null;

  // Determine currently viewed pokemon
  const isViewingOpponent = selectedMonId === opponentMon.id;
  const currentMon = isViewingOpponent
    ? opponentMon
    : playerTeam.find((p) => p.id === selectedMonId) || initialPokemon;

  const hpPct = Math.round((currentMon.currentHp / currentMon.maxHp) * 100);

  const getHpColor = (pct: number) => {
    if (pct > 50) return 'bg-emerald-500';
    if (pct > 20) return 'bg-yellow-400';
    return 'bg-red-500 animate-pulse';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${currentMon.species} Battle Summary`}
    >
      <div className="relative w-full max-w-2xl my-auto rounded-2xl pkmn-frame-dark p-4 sm:p-6 text-slate-100 overflow-hidden shadow-2xl">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded pkmn-btn-red flex items-center justify-center text-white font-pixel text-xs shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-pixel text-white uppercase tracking-wider">
                  POKÉMON SUMMARY
                </h2>
                <span className="text-[9px] font-pixel px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {isViewingOpponent ? 'RED' : 'YOU'}
                </span>
              </div>
              <p className="text-[9px] font-pixel text-slate-400 mt-0.5">
                Gen 1-3 Stats, Ability & Move Codex
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            aria-label="Close Summary"
            className="p-1.5 rounded pkmn-frame-dark text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Squad Quick Switch Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          <span className="text-[9px] font-pixel text-slate-400 uppercase shrink-0 mr-1">
            VIEW:
          </span>

          {/* Opponent Tab */}
          <button
            onClick={() => {
              soundFX.playSelect();
              setSelectedMonId(opponentMon.id);
            }}
            className={`px-2 py-1 rounded text-[9px] font-pixel flex items-center gap-1.5 transition shrink-0 border cursor-pointer ${
              isViewingOpponent
                ? 'pkmn-btn-red ring-1 ring-red-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>RED: {opponentMon.species}</span>
          </button>

          {/* Player Team Tabs */}
          {playerTeam.map((mon) => {
            const isSelected = selectedMonId === mon.id;
            return (
              <button
                key={mon.id}
                onClick={() => {
                  soundFX.playSelect();
                  setSelectedMonId(mon.id);
                }}
                className={`px-2 py-1 rounded text-[9px] font-pixel flex items-center gap-1.5 transition shrink-0 border cursor-pointer ${
                  isSelected
                    ? 'pkmn-btn-blue ring-1 ring-blue-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                } ${mon.fainted ? 'opacity-40 line-through' : ''}`}
              >
                <span>{mon.species}</span>
              </button>
            );
          })}
        </div>

        {/* Main Character Sheet Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          {/* Left Column: Official Ken Sugimori Art & Species Info (5 cols) */}
          <div className="md:col-span-5 rounded-xl pkmn-frame-dark p-3 flex flex-col items-center justify-between text-center relative overflow-hidden bg-slate-950/60">
            <div className="absolute top-2 left-2 text-[9px] font-pixel text-amber-300">
              No.{String(currentMon.nationalDex).padStart(3, '0')}
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-pixel text-slate-400">
              Lv.{currentMon.level}
            </div>

            {/* Official Ken Sugimori Artwork */}
            <div className="relative my-3 flex flex-col items-center justify-center">
              <img
                src={getOfficialArtworkUrl(currentMon.nationalDex)}
                alt={currentMon.species}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform"
              />
            </div>

            {/* Species & Typing */}
            <div className="w-full">
              <h3 className="font-pixel text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-1">
                {currentMon.species}
              </h3>

              <div className="flex items-center justify-center gap-1 mb-2">
                {currentMon.types.map((t) => (
                  <span
                    key={t}
                    className={`text-[8px] px-1.5 py-0.5 rounded font-pixel font-bold uppercase ${TYPE_COLORS[t].bg} ${TYPE_COLORS[t].text}`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* HP Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 p-0.5 border border-slate-700 relative overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getHpColor(hpPct)}`}
                  style={{ width: `${Math.max(0, hpPct)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-pixel text-slate-300">
                <span className="text-slate-400">HP</span>
                <span className="font-bold text-amber-300">
                  {currentMon.currentHp}/{currentMon.maxHp}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content (Stats vs Moves) (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center border-b border-slate-700 pb-2 mb-2 gap-2">
              <button
                onClick={() => {
                  soundFX.playSelect();
                  setActiveTab('stats');
                }}
                className={`pkmn-btn px-3 py-1 text-[9px] ${
                  activeTab === 'stats'
                    ? 'pkmn-btn-red ring-1 ring-red-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                STATS & ABILITY
              </button>

              <button
                onClick={() => {
                  soundFX.playSelect();
                  setActiveTab('moves');
                }}
                className={`pkmn-btn px-3 py-1 text-[9px] ${
                  activeTab === 'moves'
                    ? 'pkmn-btn-blue ring-1 ring-blue-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                MOVES (4)
              </button>
            </div>

            {/* Tab 1: Base Stats & Ability */}
            {activeTab === 'stats' ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-2 rounded pkmn-frame-dark text-left">
                    <div className="text-[8px] font-pixel text-slate-400">ATTACK</div>
                    <div className="text-xs font-pixel text-red-400 font-bold">
                      {currentMon.baseStats.attack}
                    </div>
                  </div>
                  <div className="p-2 rounded pkmn-frame-dark text-left">
                    <div className="text-[8px] font-pixel text-slate-400">DEFENSE</div>
                    <div className="text-xs font-pixel text-blue-400 font-bold">
                      {currentMon.baseStats.defense}
                    </div>
                  </div>
                  <div className="p-2 rounded pkmn-frame-dark text-left">
                    <div className="text-[8px] font-pixel text-slate-400">SP. ATK</div>
                    <div className="text-xs font-pixel text-purple-400 font-bold">
                      {currentMon.baseStats.spAtk}
                    </div>
                  </div>
                  <div className="p-2 rounded pkmn-frame-dark text-left">
                    <div className="text-[8px] font-pixel text-slate-400">SP. DEF</div>
                    <div className="text-xs font-pixel text-emerald-400 font-bold">
                      {currentMon.baseStats.spDef}
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded pkmn-frame-dark text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-pixel text-slate-400">SPEED</span>
                    <span className="text-xs font-pixel text-amber-300 font-bold">
                      {currentMon.baseStats.speed}
                    </span>
                  </div>
                </div>

                {/* Ability Card */}
                <div className="p-2.5 rounded pkmn-frame-dark text-left bg-slate-900/90 border-slate-700">
                  <div className="text-[8px] font-pixel text-amber-400 uppercase">
                    ABILITY: {currentMon.ability}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                    {currentMon.abilityDescription}
                  </p>
                </div>
              </div>
            ) : (
              /* Tab 2: Moves */
              <div className="space-y-1.5">
                {currentMon.moves.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded pkmn-frame-dark flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-pixel text-[9px] text-white uppercase">
                          {m.name}
                        </span>
                        <span
                          className={`text-[7px] px-1 py-0.2 rounded font-bold uppercase ${
                            TYPE_COLORS[m.type]?.bg || 'bg-slate-600'
                          } text-white`}
                        >
                          {m.type}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {m.description}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-pixel text-[8px] text-amber-300">
                        {m.power > 0 ? `PWR ${m.power}` : 'STATUS'}
                      </div>
                      <div className="font-pixel text-[8px] text-slate-400">
                        PP {m.pp}/{m.maxPp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Done button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            className="pkmn-btn pkmn-btn-red px-5 py-2 text-xs"
          >
            CLOSE SUMMARY [B]
          </button>
        </div>
      </div>
    </div>
  );
};
