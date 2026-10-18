/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, AlertCircle, Package, RotateCcw, Home } from 'lucide-react';
import { soundFX } from '../AudioEngine';
import { haptics } from '../../audio/useHaptics';

interface BattleGameOverModalProps {
  winner: 'player' | 'opponent' | null | undefined;
  opponentRemainingCount?: number;
  onOpenGachaModal: () => void;
  onRestartBattle: () => void;
  onExitToTitle: () => void;
  turnNumber?: number;
}

export const BattleGameOverModal: React.FC<BattleGameOverModalProps> = ({
  winner,
  opponentRemainingCount = 0,
  onOpenGachaModal,
  onRestartBattle,
  onExitToTitle,
  turnNumber,
}) => {
  if (!winner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl pkmn-frame-dark text-center shadow-2xl">
        {winner === 'player' ? (
          <div>
            <div className="w-16 h-16 rounded-full pkmn-btn-emerald flex items-center justify-center text-white mx-auto mb-3 shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-pixel text-base sm:text-lg text-emerald-400 tracking-wider mb-1">
              ★ SINNOH CHAMPION DEFEATED! ★
            </h3>
            <p className="font-pixel text-[10px] sm:text-xs text-slate-300 mb-6">
              You defeated Champion Cynthia at the Sinnoh Pokémon League in {turnNumber || 12} turns!
            </p>

            {/* Victory Rewards Cluster */}
            <div className="p-3.5 rounded-xl pkmn-frame-dark mb-6 text-left border-amber-400/80 bg-slate-900">
              <div className="text-[10px] font-pixel text-amber-400 font-bold uppercase mb-2">
                ✦ VICTORY REWARDS EARNED
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-700">
                  <div className="text-[9px] font-pixel text-slate-400">BOOSTER PACKS</div>
                  <div className="text-sm font-pixel font-bold text-amber-400 mt-0.5">+2 FREE PACKS!</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-700">
                  <div className="text-[9px] font-pixel text-slate-400">BONUS STARDUST</div>
                  <div className="text-sm font-pixel font-bold text-cyan-400 mt-0.5">+100 DUST</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onOpenGachaModal();
                }}
                className="w-full pkmn-btn pkmn-btn-gold py-3 text-xs flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>OPEN REWARD PACKS [A]</span>
              </button>
              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onRestartBattle();
                }}
                className="w-full pkmn-btn pkmn-btn-blue py-3 text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REMATCH CYNTHIA</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 rounded-full pkmn-btn-red flex items-center justify-center text-white mx-auto mb-3 shadow-xl">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-pixel text-base sm:text-lg text-red-400 tracking-wider mb-1">
              CHAMPIONSHIP DEFEAT...
            </h3>
            <p className="font-pixel text-[10px] sm:text-xs text-slate-300 mb-6">
              Champion Cynthia and her Garchomp proved too formidable in the League match.
            </p>

            <div className="p-3 rounded-lg pkmn-frame-dark mb-6 text-left text-xs bg-slate-950 border-slate-800">
              <div className="text-slate-400 font-pixel text-[9px]">DEFEAT REPORT:</div>
              <div className="text-slate-300 font-pixel text-[9px] mt-1 leading-relaxed">
                Cynthia still had {opponentRemainingCount || 'active'} squad members standing. Try customizing your lead synergy or opening cosmetic packs!
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onRestartBattle();
                }}
                className="w-full pkmn-btn pkmn-btn-red py-3 text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN [A]</span>
              </button>
              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  onExitToTitle();
                }}
                className="w-full pkmn-btn bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 py-3 text-xs flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>RETURN TO TITLE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
