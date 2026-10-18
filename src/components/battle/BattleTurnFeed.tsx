/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ScrollText, ChevronDown, ChevronUp, Copy, Check, X, Maximize2, Minimize2, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { BattleTurnLog, PokemonType } from '../../game/types';
import { TYPE_COLORS } from '../../game/data/typeChart';
import { soundFX } from '../AudioEngine';
import { haptics } from '../../audio/useHaptics';

interface BattleTurnFeedProps {
  logs: BattleTurnLog[];
  currentTurn: number;
  mode?: 'sidebar' | 'strip' | 'modal';
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onClose?: () => void;
}

type FeedFilter = 'all' | 'attacks' | 'damage' | 'switches';

// Common move type mapping for authentic Pokémon Showdown move badges
const MOVE_TYPE_DICTIONARY: Record<string, PokemonType> = {
  // Electric
  'Thunderbolt': 'Electric',
  'Volt Tackle': 'Electric',
  'Thunder': 'Electric',
  'Thunder Wave': 'Electric',
  'Spark': 'Electric',
  'Electro Ball': 'Electric',
  // Fire
  'Flamethrower': 'Fire',
  'Fire Blast': 'Fire',
  'Flare Blitz': 'Fire',
  'Fire Punch': 'Fire',
  'Flame Wheel': 'Fire',
  'Overheat': 'Fire',
  // Water
  'Hydro Pump': 'Water',
  'Surf': 'Water',
  'Waterfall': 'Water',
  'Water Gun': 'Water',
  'Aqua Tail': 'Water',
  'Scald': 'Water',
  // Grass
  'Frenzy Plant': 'Grass',
  'Giga Drain': 'Grass',
  'Solar Beam': 'Grass',
  'Energy Ball': 'Grass',
  'Leaf Blade': 'Grass',
  'Seed Bomb': 'Grass',
  // Ice
  'Ice Beam': 'Ice',
  'Blizzard': 'Ice',
  'Ice Punch': 'Ice',
  'Icy Wind': 'Ice',
  // Psychic
  'Psychic': 'Psychic',
  'Calm Mind': 'Psychic',
  'Zen Headbutt': 'Psychic',
  'Psyshock': 'Psychic',
  'Rest': 'Psychic',
  // Ghost
  'Shadow Ball': 'Ghost',
  'Shadow Claw': 'Ghost',
  'Night Shade': 'Ghost',
  // Fairy
  'Dazzling Gleam': 'Fairy',
  'Moonblast': 'Fairy',
  'Play Rough': 'Fairy',
  // Normal
  'Quick Attack': 'Normal',
  'Body Slam': 'Normal',
  'Hyper Beam': 'Normal',
  'Double-Edge': 'Normal',
  'Tackle': 'Normal',
  'Recover': 'Normal',
  'Roost': 'Flying',
  // Ground
  'Earthquake': 'Ground',
  'Earth Power': 'Ground',
  'Mud-Slap': 'Ground',
  // Steel
  'Iron Tail': 'Steel',
  'Flash Cannon': 'Steel',
  'Steel Wing': 'Steel',
  'Bullet Punch': 'Steel',
  // Fighting
  'Close Combat': 'Fighting',
  'Aura Sphere': 'Fighting',
  'Dynamic Punch': 'Fighting',
  'Mach Punch': 'Fighting',
  'Cross Chop': 'Fighting',
  // Dark
  'Crunch': 'Dark',
  'Bite': 'Dark',
  'Dark Pulse': 'Dark',
  'Night Slash': 'Dark',
  // Dragon
  'Dragon Pulse': 'Dragon',
  'Dragon Claw': 'Dragon',
  'Outrage': 'Dragon',
  'Draco Meteor': 'Dragon',
  // Flying
  'Air Slash': 'Flying',
  'Brave Bird': 'Flying',
  'Fly': 'Flying',
  // Poison
  'Sludge Bomb': 'Poison',
  'Poison Jab': 'Poison',
  'Toxic': 'Poison',
  // Rock
  'Stone Edge': 'Rock',
  'Rock Slide': 'Rock',
  'Ancient Power': 'Rock',
  // Bug
  'Megahorn': 'Bug',
  'Bug Buzz': 'Bug',
  'X-Scissor': 'Bug',
};

function getMoveType(moveName: string): PokemonType {
  return MOVE_TYPE_DICTIONARY[moveName] || 'Normal';
}

/**
 * BattleTurnFeed - Pokémon Showdown Battle Action Stream
 * Renders in two primary non-disruptive setups:
 * 1. Desktop Sidebar (always visible beside the arena on wide screens)
 * 2. Mobile In-Battle Stream Strip (always visible compact live stream above controls)
 * 3. Mobile History Drawer (expanded view on request)
 */
export const BattleTurnFeed: React.FC<BattleTurnFeedProps> = ({
  logs,
  currentTurn,
  mode = 'sidebar',
  isOpen = false,
  onToggleOpen,
  onClose,
}) => {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll sidebar feed when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isOpen]);

  // Auto-scroll compact strip to newest entry
  useEffect(() => {
    if (stripContainerRef.current) {
      stripContainerRef.current.scrollTop = stripContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyLogs = () => {
    soundFX.playSelect();
    haptics.tap();
    const text = logs
      .map((l) => `[Turn ${l.turn}] [${l.actor.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'attacks') return log.message.includes('used ') || log.type === 'damage';
    if (filter === 'damage') return log.type === 'damage' || log.type === 'effectiveness' || log.type === 'crit';
    if (filter === 'switches') return log.type === 'switch' || log.message.includes('sent out') || log.message.includes('called back');
    return true;
  });

  // Group logs by turn for Showdown-style banners
  const turnsMap: Record<number, BattleTurnLog[]> = {};
  filteredLogs.forEach((log) => {
    if (!turnsMap[log.turn]) turnsMap[log.turn] = [];
    turnsMap[log.turn].push(log);
  });
  const turnKeys = Object.keys(turnsMap).map(Number).sort((a, b) => a - b);

  const getActorBadge = (actor: BattleTurnLog['actor']) => {
    switch (actor) {
      case 'player':
        return (
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 font-bold text-[8px] uppercase tracking-wider shrink-0 font-pixel">
            YOU
          </span>
        );
      case 'opponent':
        return (
          <span className="px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-500/50 font-bold text-[8px] uppercase tracking-wider shrink-0 font-pixel">
            RED
          </span>
        );
      case 'weather':
        return (
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 font-bold text-[8px] uppercase tracking-wider shrink-0 font-pixel">
            HAIL
          </span>
        );
      case 'system':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/50 font-bold text-[8px] uppercase tracking-wider shrink-0 font-pixel">
            SHOWDOWN
          </span>
        );
    }
  };

  const formatLogMessage = (message: string, isCompact = false) => {
    // 1. Move Usage: e.g. "Pikachu used Thunderbolt!"
    const moveMatch = message.match(/(.+) used ([A-Za-z0-9\s-]+)!/);
    if (moveMatch) {
      const mon = moveMatch[1];
      const move = moveMatch[2];
      const moveType = getMoveType(move);
      const typeStyle = TYPE_COLORS[moveType] || TYPE_COLORS.Normal;

      return (
        <span className="inline-flex items-center gap-1.5 flex-wrap">
          <strong className="text-white font-semibold">{mon}</strong>
          <span className="text-slate-400">used</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border} shadow-sm font-mono-code uppercase whitespace-nowrap`}
          >
            {move}
          </span>
          <span className="text-amber-300 font-pixel text-[8px] hidden xs:inline">
            [{moveType.toUpperCase()}]
          </span>
        </span>
      );
    }

    // 2. Faint Message
    if (message.includes('fainted')) {
      return (
        <span className="text-rose-400 font-bold flex items-center gap-1.5">
          <span>💀</span>
          <span className="underline decoration-rose-500/50">{message}</span>
        </span>
      );
    }

    // 3. Effectiveness Messages
    if (message.includes("super effective")) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold text-[10px]">
          <span>💥</span>
          <span>{message}</span>
        </span>
      );
    }
    if (message.includes("not very effective")) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-600 font-medium text-[10px]">
          <span>🛡️</span>
          <span>{message}</span>
        </span>
      );
    }

    // 4. Critical Hit
    if (message.includes("critical hit")) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/80 text-yellow-300 border border-amber-400/60 font-bold text-[10px]">
          <span>⚡</span>
          <span>{message}</span>
        </span>
      );
    }

    // 5. Damage Numbers: e.g. "Gyarados took 184 damage (68%)!"
    const damageMatch = message.match(/(.+) took (\d+) damage \((\d+)%\)!/);
    if (damageMatch) {
      const mon = damageMatch[1];
      const dmg = damageMatch[2];
      const pct = damageMatch[3];
      return (
        <span className="inline-flex items-center gap-1.5 flex-wrap">
          <strong className="text-slate-200">{mon}</strong>
          <span className="text-slate-400">lost</span>
          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/60 font-bold tabular-nums">
            -{dmg} HP
          </span>
          <span className="text-xs text-rose-400 font-mono-code font-bold">
            ({pct}%)
          </span>
        </span>
      );
    }

    // 6. Switch Message
    if (message.includes('sent out') || message.includes('called back')) {
      return (
        <span className="text-sky-300 inline-flex items-center gap-1">
          <span>🔄</span>
          <span>{message}</span>
        </span>
      );
    }

    // 7. Weather / Hail
    if (message.includes('Hail')) {
      return (
        <span className="text-cyan-300 inline-flex items-center gap-1">
          <span>❄️</span>
          <span>{message}</span>
        </span>
      );
    }

    // Default regular message
    return <span className="text-slate-300">{message}</span>;
  };

  // =========================================================================
  // VIEW MODE 1: MOBILE IN-BATTLE COMPACT ACTION STREAM STRIP
  // Always visible on mobile battle screens, non-disruptive, never covers controls!
  // =========================================================================
  if (mode === 'strip') {
    const recentLogs = logs.slice(-3); // Show latest 2-3 action logs

    return (
      <div className="w-full">
        <div className="rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 p-2 shadow-xl flex flex-col gap-1 transition-all">
          {/* Action Strip Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <div className="flex items-center gap-1.5 text-[9px] font-pixel text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <ScrollText className="w-3 h-3 text-amber-400" />
              <span>SHOWDOWN ACTION FEED</span>
              <span className="text-slate-400 font-mono-code">· T{currentTurn}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyLogs}
                title="Copy battle history"
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-mono-code flex items-center gap-1 transition cursor-pointer"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playSelect();
                  haptics.tap();
                  if (onToggleOpen) onToggleOpen();
                }}
                className="px-1.5 py-0.5 rounded pkmn-btn-blue text-white text-[8px] font-pixel flex items-center gap-0.5 cursor-pointer shadow"
                title="Expand full Showdown history"
              >
                <Maximize2 className="w-2.5 h-2.5" />
                <span>EXPAND</span>
              </button>
            </div>
          </div>

          {/* Real-time Streaming Logs Box (Fixed height ~52px, auto-scrolls, non-intrusive) */}
          <div
            ref={stripContainerRef}
            className="max-h-[56px] overflow-y-auto space-y-1 pkmn-feed-scrollbar text-[11px] font-mono-code text-slate-200"
          >
            {recentLogs.length === 0 ? (
              <div className="text-slate-500 text-[10px] italic py-1 text-center">
                Battle ready in the Sinnoh League Champion Room... Select a move!
              </div>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="feed-log-entry flex items-center gap-1.5 truncate leading-tight py-0.5"
                >
                  {getActorBadge(log.actor)}
                  <div className="truncate flex-1">
                    {formatLogMessage(log.message, true)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expandable History Drawer (When user explicitly taps 'EXPAND') */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Pokémon Showdown Full Combat Log"
          >
            <div className="w-full max-w-2xl max-h-[75vh] flex flex-col rounded-2xl pkmn-frame-dark shadow-2xl overflow-hidden">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-amber-400" />
                  <h3 className="font-pixel text-xs text-amber-300">
                    POKÉMON SHOWDOWN BATTLE FEED
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-code">
                    {logs.length} Events
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLogs}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono-code flex items-center gap-1 cursor-pointer transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playSelect();
                      if (onClose) onClose();
                      else if (onToggleOpen) onToggleOpen();
                    }}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 px-3 py-2 bg-slate-950/60 border-b border-slate-800 text-[10px] font-mono-code">
                {(['all', 'attacks', 'damage', 'switches'] as FeedFilter[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      soundFX.playSelect();
                      setFilter(tab);
                    }}
                    className={`px-2 py-0.5 rounded font-bold uppercase transition cursor-pointer ${
                      filter === tab
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable Logs */}
              <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 font-mono-code text-xs text-slate-300 pkmn-feed-scrollbar divide-y divide-slate-800/80"
              >
                {turnKeys.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No events recorded for this filter.
                  </div>
                ) : (
                  turnKeys.map((turnNum) => (
                    <div key={turnNum} className="pt-2 first:pt-0 space-y-1.5">
                      <div className="pkmn-showdown-turn-divider">
                        <span>━━━ TURN {turnNum} ━━━</span>
                      </div>
                      {turnsMap[turnNum].map((log) => (
                        <div
                          key={log.id}
                          className={`flex items-start gap-2 p-1.5 rounded-lg text-xs leading-relaxed transition ${
                            log.actor === 'player'
                              ? 'bg-emerald-950/20'
                              : log.actor === 'opponent'
                              ? 'bg-rose-950/20'
                              : 'bg-slate-900/40'
                          }`}
                        >
                          {getActorBadge(log.actor)}
                          <div className="flex-1 min-w-0">
                            {formatLogMessage(log.message)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                <span>Active Turn: {currentTurn} · All events verified</span>
                <button
                  onClick={() => {
                    soundFX.playSelect();
                    if (onClose) onClose();
                    else if (onToggleOpen) onToggleOpen();
                  }}
                  className="pkmn-btn pkmn-btn-red px-2.5 py-1 text-[9px]"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: DESKTOP SHOWDOWN SIDEBAR (Widescreen Persistent Column)
  // Perfectly positioned beside the arena, fully visible, live auto-scroll
  // =========================================================================
  return (
    <div className="flex flex-col h-full w-full select-none text-slate-100">
      {/* Sidebar Header */}
      <div className="p-2.5 sm:p-3 border-b border-slate-700/80 bg-slate-900/95 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ScrollText className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="font-pixel text-[10px] sm:text-xs text-amber-300 tracking-wide">
              BATTLE LOG
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <div className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-pixel text-amber-300">
              TURN {currentTurn}
            </div>

            <button
              onClick={handleCopyLogs}
              title="Copy All Combat Logs"
              className="px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[9px] font-mono-code flex items-center gap-1 transition cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>

            {onClose && (
              <button
                onClick={() => {
                  soundFX.playSelect();
                  onClose();
                }}
                title="Collapse Sidebar"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-[9px] font-mono-code">
            {(['all', 'attacks', 'damage', 'switches'] as FeedFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundFX.playSelect();
                  setFilter(tab);
                }}
                className={`px-1.5 py-0.5 rounded font-bold uppercase transition cursor-pointer ${
                  filter === tab
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800/90 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll((prev) => !prev)}
            title="Toggle Autoscroll"
            className={`px-1.5 py-0.5 rounded text-[8px] font-mono-code transition cursor-pointer border ${
              autoScroll
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            AUTO: {autoScroll ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Scrollable Live Turn Feed Body */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5 font-mono-code text-[11px] text-slate-300 pkmn-feed-scrollbar divide-y divide-slate-800/60"
      >
        {turnKeys.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
            <ScrollText className="w-6 h-6 text-slate-600" />
            <span>Awaiting opening move against Champion Cynthia...</span>
          </div>
        ) : (
          turnKeys.map((turnNum) => (
            <div key={turnNum} className="pt-2 first:pt-0 space-y-1.5">
              {/* Showdown Turn Divider */}
              <div className="pkmn-showdown-turn-divider">
                <span>━━━ TURN {turnNum} ━━━</span>
              </div>

              {/* Turn Events */}
              {turnsMap[turnNum].map((log) => (
                <div
                  key={log.id}
                  className={`feed-log-entry flex items-start gap-1.5 p-1.5 rounded text-[11px] leading-relaxed transition ${
                    log.actor === 'player'
                      ? 'bg-emerald-950/25 border-l-2 border-emerald-500/70'
                      : log.actor === 'opponent'
                      ? 'bg-rose-950/25 border-l-2 border-rose-500/70'
                      : log.actor === 'weather'
                      ? 'bg-cyan-950/25 border-l-2 border-cyan-500/70'
                      : 'bg-slate-900/40 border-l-2 border-slate-700'
                  }`}
                >
                  {getActorBadge(log.actor)}
                  <div className="flex-1 min-w-0">
                    {formatLogMessage(log.message)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-2 border-t border-slate-800/90 bg-slate-900/90 flex items-center justify-between text-[9px] font-mono-code text-slate-400 shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Showdown Live Engine</span>
        </span>
        <span className="text-amber-400/90 font-bold">
          {logs.length} logged events
        </span>
      </div>
    </div>
  );
};
