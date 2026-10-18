/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check } from 'lucide-react';
import { soundFX } from './AudioEngine';
import { TeamPreset } from '../game/types';
import { BEGINNER_TEAMS, TYPE_COLORS } from '../game/constants';
import { getOfficialArtworkUrl } from '../game/data/typeChart';

interface TeamSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
  onSelectTeam: (team: TeamPreset) => void;
}

export const TeamSelectorModal: React.FC<TeamSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedTeamId,
  onSelectTeam,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Choose Your Battle Squad"
    >
      <div className="relative w-full max-w-4xl my-auto rounded-2xl pkmn-frame-dark p-4 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-pixel flex items-center gap-2">
              <span>SELECT BATTLE SQUAD</span>
              <span className="text-[9px] px-2 py-0.5 rounded pkmn-btn-emerald">
                GEN 1-3
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-pixel mt-1">
              Curated teams with balanced typing and authentic 2000s rosters
            </p>
          </div>

          <button
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            aria-label="Close Team Selector"
            className="p-1.5 rounded pkmn-frame-dark text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Team Cards List */}
        <div className="flex flex-col gap-4">
          {BEGINNER_TEAMS.map((team) => {
            const isSelected = team.id === selectedTeamId;

            return (
              <div
                key={team.id}
                onClick={() => {
                  soundFX.playSelect();
                  onSelectTeam(team);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
              >
                {/* Team Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs sm:text-sm font-bold text-white">
                      {isSelected && <span className="pkmn-cursor">▶</span>}
                      {team.name}
                    </span>
                    <span className="text-[9px] font-pixel px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {team.difficulty}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="pkmn-btn pkmn-btn-emerald px-2 py-1 text-[9px] flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      ACTIVE SQUAD
                    </span>
                  ) : (
                    <span className="pkmn-btn pkmn-btn-blue px-2.5 py-1 text-[9px]">
                      CHOOSE SQUAD [A]
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-pixel text-amber-400/90 mb-1">
                  {team.tagline}
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {team.description}
                </p>

                {/* 6 Pokemon Roster Preview with Ken Sugimori artwork */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3 border-t border-slate-800">
                  {team.team.map((mon) => (
                    <div
                      key={mon.id}
                      className="p-2 rounded-lg pkmn-frame-dark flex flex-col items-center text-center group"
                    >
                      <img
                        src={getOfficialArtworkUrl(mon.nationalDex)}
                        alt={mon.species}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow group-hover:scale-110 transition-transform"
                      />
                      <div className="font-pixel text-[9px] sm:text-[10px] font-bold text-white mt-1 truncate max-w-full uppercase">
                        {mon.species}
                      </div>

                      {/* Types */}
                      <div className="flex gap-0.5 mt-1">
                        {mon.types.map((t) => {
                          const col = TYPE_COLORS[t];
                          return (
                            <span
                              key={t}
                              className={`text-[7px] px-1 py-0.2 rounded font-bold uppercase ${col.bg} ${col.text}`}
                            >
                              {t.slice(0, 4)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tactical lead advice */}
                <div className="mt-2.5 text-[9px] sm:text-[10px] font-pixel text-slate-400 flex items-center gap-1.5">
                  <span className="text-amber-400">✦ LEAD RECOMMENDATION:</span>
                  <span className="text-slate-300">{team.recommendedLead}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
