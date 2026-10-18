/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pokemon, PokemonType } from '../../game/types';
import { TYPE_COLORS } from '../../game/data/typeChart';

interface BattleStatPlateProps {
  pokemon: Pokemon;
  isOpponent: boolean;
  remainingCount: number;
  totalCount: number;
  isAwaitingInput?: boolean;
  titleCardId?: string;
  onOpenSummary: (mon: Pokemon, isOpponent: boolean) => void;
}

const BattleStatPlateComponent: React.FC<BattleStatPlateProps> = ({
  pokemon,
  isOpponent,
  remainingCount,
  totalCount,
  isAwaitingInput = false,
  titleCardId,
  onOpenSummary,
}) => {
  const hpPct = Math.max(0, Math.min(100, (pokemon.currentHp / pokemon.maxHp) * 100));

  const getHpBarColor = (pct: number) => {
    if (pct > 50) return 'bg-emerald-500';
    if (pct > 20) return 'bg-yellow-400';
    return 'bg-red-500 animate-pulse';
  };

  // Dynamic Title Card HP Frame Styling
  let frameStyle = isOpponent
    ? 'border-slate-700 hover:border-red-500 bg-slate-900/90'
    : isAwaitingInput
    ? 'border-amber-400 ring-2 ring-amber-400/50 bg-slate-900/90'
    : 'border-slate-700 hover:border-blue-400 bg-slate-900/90';

  if (!isOpponent && titleCardId) {
    if (titleCardId === 'card_frame_prismatic') {
      frameStyle = 'border-2 border-cyan-300 ring-1 ring-amber-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80';
    } else if (titleCardId === 'card_frame_gold_scroll') {
      frameStyle = 'border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950';
    } else if (titleCardId === 'card_frame_cyber_hud') {
      frameStyle = 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.35)] bg-slate-950';
    } else if (titleCardId === 'card_frame_dragon_crest') {
      frameStyle = 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] bg-gradient-to-r from-purple-950/70 via-slate-950 to-slate-950';
    }
  }

  return (
    <div
      onClick={() => onOpenSummary(pokemon, isOpponent)}
      title={`Click to inspect ${pokemon.species} Summary [ 鑑 ]`}
      className={`w-full max-w-[170px] xs:max-w-[200px] sm:max-w-xs p-2 sm:p-2.5 rounded-lg shrink-0 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden ${frameStyle}`}
    >
      {/* Collectible Title Card Corner Accents */}
      {!isOpponent && titleCardId && (
        <div className="absolute top-1 right-1 pointer-events-none z-10 flex items-center gap-0.5">
          {titleCardId === 'card_frame_prismatic' && (
            <span className="text-[9px] text-amber-300 animate-ping">✦</span>
          )}
          {titleCardId === 'card_frame_gold_scroll' && (
            <span className="text-[7px] font-ukiyoe bg-red-600 text-white px-1 rounded-sm border border-amber-300 font-bold">金</span>
          )}
          {titleCardId === 'card_frame_cyber_hud' && (
            <span className="text-[8px] font-mono-code text-cyan-300">⌜⌝</span>
          )}
          {titleCardId === 'card_frame_dragon_crest' && (
            <span className="text-[8px] font-ukiyoe text-fuchsia-300">竜</span>
          )}
        </div>
      )}
      {/* Top Row: Pokémon Species Name & Level */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-pixel text-[10px] xs:text-[11px] sm:text-xs text-white truncate uppercase tracking-tight">
            {pokemon.species}
          </span>
          <span className="font-pixel text-[8px] xs:text-[9px] text-amber-300 shrink-0">
            :L{pokemon.level}
          </span>
        </div>

        {/* Type Badges */}
        <div className="flex items-center gap-0.5 shrink-0">
          {pokemon.types.map((t: PokemonType) => (
            <span
              key={t}
              className={`text-[7px] xs:text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
                TYPE_COLORS[t]?.bg || 'bg-stone-600'
              } ${TYPE_COLORS[t]?.text || 'text-white'}`}
            >
              {t.slice(0, 4)}
            </span>
          ))}
        </div>
      </div>

      {/* Retro Pokémon HP Bar Row */}
      <div className="flex items-center gap-1.5 pkmn-hp-frame my-1">
        <span className="pkmn-hp-tag">HP</span>
        <div className="flex-1 bg-slate-950 rounded-full h-2 sm:h-2.5 overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${getHpBarColor(hpPct)}`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      </div>

      {/* Bottom Row: Remaining Poké Balls & HP Number */}
      <div className="flex items-center justify-between mt-1 text-[8px] xs:text-[9px] font-pixel text-slate-400">
        {/* Remaining Squad Poké Ball Icons */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: totalCount }).map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full border border-black inline-block ${
                idx < remainingCount
                  ? isOpponent
                    ? 'bg-red-500'
                    : 'bg-emerald-400'
                  : 'bg-slate-700'
              }`}
              title={idx < remainingCount ? 'Alive' : 'Fainted'}
            />
          ))}
        </div>

        {/* Numeric HP readout */}
        <span className="text-slate-200 font-bold tabular-nums">
          {Math.max(0, pokemon.currentHp)}/{pokemon.maxHp}
        </span>
      </div>
    </div>
  );
};

export const BattleStatPlate = React.memo(BattleStatPlateComponent);
