/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Network, Server, Users, Zap, ShieldAlert, CheckCircle2, ArrowRight, Play, Check } from 'lucide-react';
import { soundFX } from './AudioEngine';

interface MultiplayerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiplayerRoadmapModal: React.FC<MultiplayerRoadmapModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'roadmap' | 'demo'>('architecture');
  const [simStep, setSimStep] = useState<number>(0);
  const [simLog, setSimLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSimulateQueue = () => {
    soundFX.playSelect();
    setSimStep(1);
    setSimLog(['[CLIENT] Initializing WebSocket connection to wss://battle-red.io/matchmaker...']);

    setTimeout(() => {
      setSimStep(2);
      setSimLog(prev => [
        ...prev,
        '[SERVER] Handshake verified. Authenticated as Player_884.',
        '[MATCHMAKER] Enqueued in Casual Summit Pool (Rating 1200 ± 50)... Searching opponent...',
      ]);
    }, 900);

    setTimeout(() => {
      setSimStep(3);
      setSimLog(prev => [
        ...prev,
        '[MATCHMAKER] Match found! Opponent: Trainer_Blue (ID: 0x47B).',
        '[ROOM] Provisioned Battle Room #MT-SILVER-992. Syncing seed: 0x82A1BF.',
      ]);
      soundFX.playCardFlip(true);
    }, 2200);

    setTimeout(() => {
      setSimStep(4);
      setSimLog(prev => [
        ...prev,
        '[STATE] Synchronized 6v6 Team rosters. Waiting for Lead Pokémon selection...',
        '✅ Match handshake complete and ready for turn 1!',
      ]);
    }, 3200);
  };

  const handleResetSim = () => {
    soundFX.playSelect();
    setSimStep(0);
    setSimLog([]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Multiplayer Roadmap and Architecture"
    >
      <div className="relative w-full max-w-5xl my-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Multiplayer Queue Roadmap & Architecture Analysis</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono-code font-bold">
                  Tech Spec
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Architectural breakdown of Daily Cynthia vs Pokémon Showdown & next-gen matchmaking roadmap.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            aria-label="Close Roadmap"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('architecture');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            Daily-Red vs Showdown Analysis
          </button>
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('roadmap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            Multiplayer Matchmaking Roadmap
          </button>
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('demo');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-cyan-600 text-white shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            Interactive Queue Simulator
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 pr-1 text-xs text-slate-300 space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Daily Red vs Pokemon Showdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Red Breakdown */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-red-400">Daily Red (daily-red.com)</span>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300">
                        mGBA WASM Emulator
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3 leading-relaxed">
                      Built by compiling the mGBA C emulator to WebAssembly, running a patched Pokémon FireRed ROM in a canvas.
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <strong className="text-emerald-400">✓ Strengths:</strong> Frame-accurate Gen 3 nostalgia, authentic sound and sprites.
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <strong className="text-rose-400">✗ Weaknesses:</strong> Heavy banner ads, clunky touch D-Pad controls, slow initial 20MB ROM download, state trapped in local browser cache, no multiplayer or real-time friend matchmaking.
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-code pt-2 border-t border-slate-800">
                    Verdict: Great single-player daily novelty, but poor multiplayer and progression foundation.
                  </div>
                </div>

                {/* Pokemon Showdown Breakdown */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-blue-400">Pokémon Showdown (sim.js)</span>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                        Node.js WebSockets
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3 leading-relaxed">
                      Built with a pure TypeScript/JS deterministic simulation engine (<code className="text-cyan-300">@pkmn/sim</code>), client-server model over SockJS WebSockets, and line-based protocol events (<code className="text-cyan-300">|turn|</code>, <code className="text-cyan-300">|move|</code>).
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <strong className="text-emerald-400">✓ Strengths:</strong> Lightweight, instant loads, handles 10,000+ simultaneous battles, deterministic state replication, scalable matchmaking.
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        <strong className="text-rose-400">✗ Weaknesses:</strong> Steep learning curve for beginners, 2012-era dense web interface, no cosmetic card rewards, no live move-effectiveness guidance during selection.
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-code pt-2 border-t border-slate-800">
                    Verdict: Best battle architecture in existence, but needs modern game feel, cosmetics, and beginner UX.
                  </div>
                </div>
              </div>

              {/* Our Hybrid Architecture Synthesis */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>What We Adopt from Showdown & How We Fix the Weaknesses</span>
                </h3>
                <ul className="space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>Pure JS/TS Battle Sim:</strong> We avoid the emulator overhead of Daily-Red, loading in milliseconds on any phone or desktop with zero ads.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>Beginner-First UI:</strong> Unlike Showdown's wall of text, our battle arena displays dynamic effectiveness badges (<span className="text-emerald-400">2x Super Effective</span>, <span className="text-rose-400">Resisted</span>) directly over move buttons before you attack!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span><strong>Card Pack Gacha & Cosmetic Progression:</strong> Daily free spins yield collectible Pokémon Trading Cards that unlock 3D wearable hats, jackets, and battle aura effects.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-5">
              <div className="border-l-2 border-cyan-500 pl-4 space-y-6">
                {/* Phase 1 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                  <div className="text-xs font-bold text-emerald-400 uppercase font-mono-code">
                    Phase 1: Local Simulation & AI Champion (Completed Now)
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">Scaffolded Deterministic Engine</h4>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    Turn-based battle state machine, Gen 3/4 damage calculation, priority sorting, Cynthia's smart AI decision making, daily gacha pack system, and cosmetics locker.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
                  <div className="text-xs font-bold text-cyan-400 uppercase font-mono-code">
                    Phase 2: Friend Lobbies & Private Room Codes
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">6-Character Room Matchmaking</h4>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    Users create or join rooms via a short code (e.g., <code className="text-amber-300">RED-777</code>) or shareable direct URL link (<code className="text-amber-300">/battle?code=RED-777</code>). A lightweight WebSocket relay server synchronizes moves and cosmetic loads between friend clients.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="text-xs font-bold text-indigo-400 uppercase font-mono-code">
                    Phase 3: Public Ranked & Casual Matchmaking Queue
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">Elo-Based Matchmaking & Anti-Stall Timers</h4>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    1-click "Find Match" matchmaking pool with dynamic Elo rating ranges (expanding every 5s if queue is light), 45-second turn timers to prevent AFK stalling, and server-side state verification using seed hashes.
                  </p>
                </div>

                {/* Phase 4 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-slate-900" />
                  <div className="text-xs font-bold text-purple-400 uppercase font-mono-code">
                    Phase 4: Spectator Broadcast & Battle Replays
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">Shareable Summit Showdown Records</h4>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    Spectator link allows friends to watch battles live with emoji reactions, plus exportable spoiler-free Wordle-style battle outcome grids to share on Discord or X!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Live Matchmaking Handshake Simulation</span>
                  </h4>
                  {simStep > 0 && (
                    <button
                      onClick={handleResetSim}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <p className="text-slate-300 mb-4 text-xs">
                  Test the WebSocket protocol handshake that links two players into an isolated deterministic battle room:
                </p>

                {simStep === 0 ? (
                  <button
                    onClick={handleSimulateQueue}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>SIMULATE "FIND MATCH" QUEUE</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-cyan-300 font-mono-code font-bold">
                      {simStep < 4 ? 'Processing Protocol Handshake...' : 'Match Handshake Ready!'}
                    </span>
                  </div>
                )}

                {/* Console Log Output */}
                {simLog.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-black/80 font-mono-code text-[11px] text-emerald-400 space-y-1.5 border border-slate-800">
                    {simLog.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
