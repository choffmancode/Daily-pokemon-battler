/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { BattleTurnLog, WeatherType } from '../../game/types';

interface BattleTurnFeedProps {
  logs: BattleTurnLog[];
  currentTurn: number;
  weather?: WeatherType;
  playerName?: string;
  opponentName?: string;
  mode?: 'sidebar' | 'strip' | 'modal';
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onClose?: () => void;
}

/**
 * Compact GBA Top Action Log Plate (Scrollable Turn History)
 * Docked directly below the 3-segment top header plate and toggled via [LOG] or [L].
 */
export const BattleTurnFeed: React.FC<BattleTurnFeedProps> = ({
  logs,
  currentTurn,
  weather = 'Clear',
  playerName = 'POKEMON',
  opponentName = 'OPPONENT',
  isOpen = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayLines = useMemo(() => {
    const cleaned = logs
      .map((entry) => entry.message.trim())
      .filter((msg) => msg.length > 0 && !msg.startsWith('---'));

    if (cleaned.length > 0) {
      return cleaned;
    }

    return [
      `CHAMPION CYNTHIA sent out ${opponentName.toUpperCase()}!`,
      `Go! ${playerName.toUpperCase()}! Prepare for battle.`,
      weather !== 'Clear'
        ? `${weather.toUpperCase()} continues to fall on the arena.`
        : `Turn ${String(currentTurn).padStart(2, '0')} — Awaiting your command.`,
    ];
  }, [logs, currentTurn, weather, playerName, opponentName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayLines.length, currentTurn]);

  if (!isOpen) return null;

  return (
    <section
      aria-label="Battle Action Log"
      className="relative z-20 w-full h-[56px] sm:h-[62px] shrink-0 mt-0.5 select-none"
    >
      {/* Chamfered Double-Lined Dark GBA Log Plate SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 388 68"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        {/* Outer Dark Border */}
        <polygon points="6,0 382,0 388,6 388,62 382,68 6,68 0,62 0,6" fill="#081820" />
        {/* Cream Outer Chamfered Frame */}
        <polygon points="7,2 381,2 386,7 386,61 381,66 7,66 2,61 2,7" fill="#d8ecd0" />
        {/* Mid Dark Border */}
        <polygon points="9,4 379,4 384,9 384,59 379,64 9,64 4,59 4,9" fill="#081820" />
        {/* Deep Slate-Emerald Log Interior */}
        <polygon points="10,6 378,6 382,10 382,58 378,62 10,62 6,58 6,10" fill="#102424" />
        {/* Inner Sage Accent Border */}
        <polygon
          points="12,8 376,8 380,12 380,56 376,60 12,60 8,56 8,12"
          fill="none"
          stroke="#386850"
          strokeWidth="1.5"
        />
        {/* 4 Corner Diagonal Ticks */}
        <polyline points="11,14 15,10" stroke="#88c070" strokeWidth="1.5" />
        <polyline points="377,14 373,10" stroke="#88c070" strokeWidth="1.5" />
        <polyline points="11,54 15,58" stroke="#88c070" strokeWidth="1.5" />
        <polyline points="377,54 373,58" stroke="#88c070" strokeWidth="1.5" />
      </svg>

      {/* Scrollable Combat Log Lines */}
      <div
        ref={scrollRef}
        className="relative z-10 w-full h-full flex flex-col px-3.5 py-1.5 gap-[3px] overflow-y-auto gba-scrollbar"
      >
        {displayLines.map((line, index) => (
          <div
            key={`${index}-${line}`}
            className="font-pixel text-[7.5px] xs:text-[8px] sm:text-[8.5px] leading-[1.35] text-[#e0f8d0] shrink-0 tracking-tight drop-shadow-[1px_1px_0_#081820]"
          >
            <span className="text-[#88c070] mr-1">&gt;</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
