/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PokemonType } from '../../game/types';

export interface ActiveMoveVFX {
  id: string;
  moveName: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  targetSide: 'player' | 'opponent';
}

export interface FloatingDamageIndicator {
  id: string;
  side: 'player' | 'opponent';
  damage: number;
  isCrit?: boolean;
  effectiveness?: number;
}

interface MoveVFXProps {
  vfx: ActiveMoveVFX | null;
  floatingDamage: FloatingDamageIndicator | null;
}

/**
 * MoveVFX - Crisp GBA Pixel Impact Flash & Auto-Dismissing Damage Popup
 * Automatically fades out after 850ms so damage tags never linger on screen.
 */
export const MoveVFX: React.FC<MoveVFXProps> = ({ vfx, floatingDamage }) => {
  const [visibleDamageId, setVisibleDamageId] = useState<string | null>(null);

  useEffect(() => {
    if (!floatingDamage) {
      setVisibleDamageId(null);
      return;
    }
    setVisibleDamageId(floatingDamage.id);
    const timer = setTimeout(() => {
      setVisibleDamageId((current) => (current === floatingDamage.id ? null : current));
    }, 850);
    return () => clearTimeout(timer);
  }, [floatingDamage]);

  const showDamage = Boolean(floatingDamage && visibleDamageId === floatingDamage.id);

  return (
    <>
      {/* Brief GBA Pixel Damage Number over Defender */}
      {showDamage && floatingDamage && (
        <div
          key={floatingDamage.id}
          className={`absolute z-30 pointer-events-none flex flex-col items-center ${
            floatingDamage.side === 'opponent'
              ? 'top-2 right-14'
              : 'bottom-10 left-12'
          }`}
        >
          <div className="px-1.5 py-0.5 bg-[#081820] border border-[#e0f8d0] shadow-[2px_2px_0_#081820]">
            <span className="font-pixel text-[9px] font-bold text-[#e85050] tabular-nums">
              -{floatingDamage.damage}
            </span>
          </div>
        </div>
      )}

      {/* Brief Pixel Impact Ring on Defender */}
      {vfx && (
        <div
          key={vfx.id}
          className={`absolute z-30 pointer-events-none flex items-center justify-center ${
            vfx.targetSide === 'opponent'
              ? 'top-3 right-12 w-20 h-20'
              : 'bottom-4 left-8 w-20 h-20'
          }`}
        >
          <svg viewBox="0 0 32 32" className="w-full h-full animate-ping" shapeRendering="crispEdges">
            <rect x="14" y="2" width="4" height="6" fill="#e0f8d0" />
            <rect x="14" y="24" width="4" height="6" fill="#e0f8d0" />
            <rect x="2" y="14" width="6" height="4" fill="#e0f8d0" />
            <rect x="24" y="14" width="6" height="4" fill="#e0f8d0" />
            <rect x="6" y="6" width="4" height="4" fill="#88c070" />
            <rect x="22" y="6" width="4" height="4" fill="#88c070" />
            <rect x="6" y="22" width="4" height="4" fill="#88c070" />
            <rect x="22" y="22" width="4" height="4" fill="#88c070" />
          </svg>
        </div>
      )}
    </>
  );
};
