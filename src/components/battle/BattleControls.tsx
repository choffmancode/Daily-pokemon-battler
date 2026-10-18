/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Pokemon, Move } from '../../game/types';
import { TYPE_COLORS } from '../../game/data/typeChart';
import { calculateTypeEffectiveness } from '../../game/battleEngine';
import { soundFX } from '../AudioEngine';
import { haptics } from '../../audio/useHaptics';
import { Swords, RefreshCw, Zap } from 'lucide-react';

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
  const effectivenessBadges = useMemo(() => {
    const map = new Map<string, { label: string; color: string }>();
    for (const move of playerMon.moves) {
      if (move.category === 'Status') {
        map.set(move.id, { label: 'STATUS', color: 'bg-slate-700 text-slate-300' });
      } else {
        const mult = calculateTypeEffectiveness(move.type, opponentMon.types);
        if (mult > 1) {
          map.set(move.id, { label: 'SUPER EFFECTIVE!', color: 'bg-emerald-600 text-white font-bold' });
        } else if (mult === 0) {
          map.set(move.id, { label: 'NO EFFECT', color: 'bg-slate-800 text-slate-500' });
        } else if (mult < 1) {
          map.set(move.id, { label: 'NOT VERY EFFECTIVE', color: 'bg-amber-600/90 text-white' });
        } else {
          map.set(move.id, { label: 'NORMAL', color: 'bg-slate-700/80 text-slate-300' });
        }
      }
    }
    return map;
  }, [playerMon.moves, opponentMon.types]);

  const getEffectivenessBadge = (move: Move) =>
    effectivenessBadges.get(move.id) || { label: 'NORMAL', color: 'bg-slate-700/80 text-slate-300' };

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto shrink-0">
      <div
        className={`rounded-xl pkmn-frame-dark p-2 sm:p-3 transition-all ${
          isAwaitingPlayerInput
            ? 'ring-2 ring-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            : 'border-slate-800'
        }`}
      >
        {/* Gen 1-3 Dialogue & Mode Selection Ribbon */}
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            {/* FIGHT Mode Tab (FireRed Style) */}
            <button
              onClick={() => {
                soundFX.playSelect();
                haptics.tap();
                onSelectSubMenu('moves');
              }}
              className={`pkmn-btn px-3 py-1.5 text-[10px] sm:text-xs flex items-center gap-1.5 min-h-[38px] ${
                selectedSubMenu === 'moves'
                  ? 'pkmn-btn-red ring-2 ring-red-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>FIGHT [A]</span>
              {isAwaitingPlayerInput && selectedSubMenu === 'moves' && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
              )}
            </button>

            {/* POKÉMON Switch Tab (Emerald / Sapphire Style) */}
            <button
              onClick={() => {
                soundFX.playSelect();
                haptics.tap();
                onSelectSubMenu('switch');
              }}
              className={`pkmn-btn px-3 py-1.5 text-[10px] sm:text-xs flex items-center gap-1.5 min-h-[38px] ${
                selectedSubMenu === 'switch'
                  ? 'pkmn-btn-blue ring-2 ring-blue-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              } ${playerNeedsSwitch ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                POKÉMON ({playerTeam.filter((p) => !p.fainted).length}/6)
              </span>
              {playerNeedsSwitch && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
              )}
            </button>
          </div>

          <div className="font-pixel text-[8px] sm:text-[9px] text-slate-400 hidden sm:block">
            PRESS [1] [2] [3] [4]
          </div>
        </div>

        {/* Sub-menu 1: Moves (Classic 2x2 Pokémon Move Grid) */}
        {selectedSubMenu === 'moves' ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {playerMon.moves.map((move, idx) => {
              const eff = getEffectivenessBadge(move);
              const typeColor = TYPE_COLORS[move.type] || { bg: 'bg-stone-600', text: 'text-white' };
              const isOutOfPP = move.pp <= 0;

              return (
                <button
                  key={move.id}
                  onClick={() => {
                    haptics.tap();
                    onSelectMove(idx);
                  }}
                  disabled={isTurnProcessing || isOutOfPP}
                  className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[50px] sm:min-h-[60px] ${
                    isOutOfPP
                      ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                      : isAwaitingPlayerInput
                      ? 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 border-slate-600 hover:border-amber-400 active:scale-[0.98] shadow-md cursor-pointer'
                      : 'bg-slate-950/70 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-pixel text-[8px] xs:text-[9px] text-amber-400 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-pixel text-[9px] xs:text-[10px] sm:text-xs text-white truncate uppercase tracking-tight">
                        {move.name}
                      </span>
                    </div>

                    {/* Move Type Badge */}
                    <span
                      className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${typeColor.bg} ${typeColor.text}`}
                    >
                      {move.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[8px] xs:text-[9px] font-pixel text-slate-400">
                    <span
                      className={`px-1 py-0.2 rounded text-[7px] xs:text-[8px] ${eff.color}`}
                    >
                      {eff.label}
                    </span>

                    <span className={`font-bold ${isOutOfPP ? 'text-red-400' : 'text-slate-200'}`}>
                      PP {move.pp}/{move.maxPp}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Sub-menu 2: Pokémon Switch Squad */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {playerTeam.map((mon, idx) => {
              const isCurrent = idx === playerActiveIndex;
              const isFainted = mon.fainted || mon.currentHp <= 0;
              const hpPct = Math.round((mon.currentHp / mon.maxHp) * 100);

              return (
                <button
                  key={mon.id}
                  disabled={isCurrent || isFainted || isTurnProcessing}
                  onClick={() => {
                    soundFX.playSelect();
                    haptics.tap();
                    onSwitchPokemon(idx);
                  }}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all min-h-[48px] ${
                    isCurrent
                      ? 'bg-blue-950/60 border-blue-500/80 ring-1 ring-blue-400 cursor-default'
                      : isFainted
                      ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed grayscale'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-emerald-400 cursor-pointer active:scale-95'
                  }`}
                >
                  <img
                    src={mon.spriteFront}
                    alt={mon.species}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[9px] sm:text-[10px] text-white truncate uppercase">
                        {mon.species}
                      </span>
                      {isCurrent && (
                        <span className="text-[7px] font-pixel text-blue-300">OUT</span>
                      )}
                      {isFainted && (
                        <span className="text-[7px] font-pixel text-red-400">FAINT</span>
                      )}
                    </div>
                    {/* Mini HP bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${
                          hpPct > 50 ? 'bg-emerald-500' : hpPct > 20 ? 'bg-yellow-400' : 'bg-red-500'
                        }`}
                        style={{ width: `${hpPct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const BattleControls = React.memo(BattleControlsComponent);
