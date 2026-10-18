/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

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
    <div className="w-full max-w-[360px] gba-frame-dark p-2.5 flex flex-col items-center gap-2 mt-1">
      <div className="flex items-center gap-1.5">
        <span className="gba-hanko-seal text-[7px] px-1 py-[1px]">管</span>
        <span className="gba-title-text text-[10px] font-bold text-[#88c070] uppercase tracking-wider">
          ADMIN CONTROLS
        </span>
      </div>
      <div className="w-full grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={() => onAddPacks(5)}
          className="gba-select-btn py-1.5 px-1 gba-title-text text-[9px] font-bold text-center cursor-pointer"
        >
          +5 PACKS
        </button>
        <button
          type="button"
          onClick={onResetCooldown}
          className="gba-select-btn py-1.5 px-1 gba-title-text text-[9px] font-bold text-center cursor-pointer"
        >
          RESET TIMER
        </button>
        <button
          type="button"
          onClick={onOpenAnytime}
          className="gba-select-btn py-1.5 px-1 gba-title-text text-[9px] font-bold text-center cursor-pointer"
        >
          FREE OPEN
        </button>
      </div>
    </div>
  );
};
