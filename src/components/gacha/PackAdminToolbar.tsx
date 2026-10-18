/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Zap, Clock } from 'lucide-react';

interface PackAdminToolbarProps {
  onAddPacks: (count: number) => void;
  onResetCooldown: () => void;
  onOpenAnytime: () => void;
}

export const PackAdminToolbar: React.FC<PackAdminToolbarProps> = ({
  onAddPacks,
  onResetCooldown,
  onOpenAnytime,
}) => {
  return (
    <div className="w-full max-w-md p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex flex-wrap items-center justify-center gap-2 text-xs font-mono-code mt-2">
      <span className="text-purple-300 font-bold flex items-center gap-1 mr-1">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        ADMIN CONTROLS:
      </span>
      <button
        onClick={() => onAddPacks(5)}
        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 hover:text-white transition cursor-pointer flex items-center gap-1"
      >
        <Zap className="w-3 h-3 text-amber-400" />
        +5 Packs
      </button>
      <button
        onClick={onResetCooldown}
        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:text-white transition cursor-pointer flex items-center gap-1"
      >
        <Clock className="w-3 h-3 text-emerald-400" />
        Reset Daily Cooldown
      </button>
      <button
        onClick={onOpenAnytime}
        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border border-purple-400/60 text-white font-bold transition cursor-pointer flex items-center gap-1"
      >
        Instant Open
      </button>
    </div>
  );
};
