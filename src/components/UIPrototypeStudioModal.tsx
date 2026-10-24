/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VS CHAMP — UI Prototype Studio Component
 * Interactive review modal for proposed game experience screens:
 * 1. Gauntlet 5-Stage Bracket & Inter-Round Heal
 * 2. Champion Matchup / Intro Screens (Blue, Lance, Steven, Cynthia, Iris)
 * 3. Daily Regional League Hub (5-day rotating cycle)
 * 4. Gauntlet Hall of Fame & Trophy Award Victory Celebration
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { soundFX } from './AudioEngine';

interface UIPrototypeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'bracket' | 'champions' | 'regional' | 'victory';
}

export const UIPrototypeStudioModal: React.FC<UIPrototypeStudioModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'bracket',
}) => {
  const [activeTab, setActiveTab] = useState<'bracket' | 'champions' | 'regional' | 'victory'>(initialTab);
  const [selectedChampion, setSelectedChampion] = useState<'blue' | 'lance' | 'steven' | 'cynthia' | 'iris'>('blue');

  if (!isOpen) return null;

  const championsData = {
    blue: {
      num: '01',
      region: 'KANTO • INDIGO PLATEAU',
      config: 'CONFIG A: STANDARD',
      title: 'CHAMPION BLUE',
      tagline: '"Smell ya later! I\'m the most powerful Pokémon Trainer in the world!"',
      difficulty: 'DIFFICULTY: ★★★★★',
      roster: ['Pidgeot', 'Alakazam', 'Rhydon', 'Exeggutor', 'Arcanine', 'Blastoise (Ace)'],
      briefing: 'Fast-paced offensive balance. Alakazam (Magic Guard Focus Sash) and Blastoise pose massive special threats. Watch for Rhydon Lightning Rod absorbing Electric moves!',
      accentColor: '#38b8e8',
      frameBorder: 'border-[#38b8e8]',
    },
    lance: {
      num: '02',
      region: 'JOHTO • SILVER CONFERENCE',
      config: 'CONFIG A: DRAGON RESURGENCE',
      title: 'CHAMPION LANCE',
      tagline: '"I\'ve been waiting for you! The Pokémon League Champion, Lance the dragon master!"',
      difficulty: 'DIFFICULTY: ★★★★★',
      roster: ['Gyarados', 'Aerodactyl', 'Charizard', 'Dragonite (Sp)', 'Dragonite (Phys)', 'Kingdra (Ace)'],
      briefing: 'Dragon Dance sweeping terror. Intimidate Gyarados leads into Multiscale Weakness Policy Dragonite. Kingdra has only Dragon/Fairy weaknesses.',
      accentColor: '#e85858',
      frameBorder: 'border-[#e85858]',
    },
    steven: {
      num: '03',
      region: 'HOENN • EVER GRANDE CITY',
      config: 'CONFIG A: STEEL METEOR',
      title: 'CHAMPION STEVEN',
      tagline: '"Congratulations. You have come far. But to become Champion, you must overcome me!"',
      difficulty: 'DIFFICULTY: ★★★★★',
      roster: ['Skarmory', 'Claydol', 'Aggron', 'Cradily', 'Armaldo', 'Metagross (Ace)'],
      briefing: 'Sturdy hazard stack with Skarmory and Claydol screens. Metagross hits with Meteor Mash and Bullet Punch priority.',
      accentColor: '#88e0f8',
      frameBorder: 'border-[#88e0f8]',
    },
    cynthia: {
      num: '04',
      region: 'SINNOH • POKÉMON LEAGUE',
      config: 'CONFIG A: PLATINUM STANDARD',
      title: 'CHAMPION CYNTHIA',
      tagline: '"Before me stands a Trainer with a passionate heart! I, Cynthia, accept your challenge!"',
      difficulty: 'DIFFICULTY: ★★★★★',
      roster: ['Spiritomb', 'Roserade', 'Togekiss', 'Lucario', 'Milotic', 'Garchomp (Ace)'],
      briefing: 'Flawless type synergy. Spiritomb has zero weaknesses in Gen 3/4. Togekiss Serene Grace flinch-lock, Marvel Scale Milotic, and Yache Berry Swords Dance Garchomp.',
      accentColor: '#f0c830',
      frameBorder: 'border-[#f0c830]',
    },
    iris: {
      num: '05',
      region: 'UNOVA • POKÉMON LEAGUE',
      config: 'CONFIG A: DRAGON SOVEREIGN',
      title: 'CHAMPION IRIS',
      tagline: '"Welcome to the Pokémon League! I\'m so excited to battle you!"',
      difficulty: 'DIFFICULTY: ★★★★★',
      roster: ['Hydreigon', 'Druddigon', 'Aggron', 'Archeops', 'Lapras', 'Haxorus (Ace)'],
      briefing: 'Extreme offensive firepower. Focus Sash Haxorus with Dragon Dance and Outrage. Hydreigon brings immense special coverage.',
      accentColor: '#f8b820',
      frameBorder: 'border-[#f8b820]',
    },
  };

  const champ = championsData[selectedChampion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-[#081820] border-4 border-[#306850] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#102424] border-b-2 border-[#306850] px-3 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#88c070] animate-pulse" />
            <span className="font-pixel text-[10px] text-[#e0f8d0]">UI PROTOTYPE STUDIO</span>
          </div>
          <button
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            className="p-1 text-[#88c070] hover:text-[#e0f8d0] rounded active:scale-95"
            aria-label="Close Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Screen Tabs */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-[#0c1c22] border-b border-[#306850] shrink-0 font-pixel text-[8px]">
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('bracket');
            }}
            className={`py-1.5 px-1 rounded transition-colors text-center ${
              activeTab === 'bracket' ? 'bg-[#306850] text-[#e0f8d0] border border-[#88c070]' : 'text-[#88c070] bg-[#102424]'
            }`}
          >
            1. BRACKET
          </button>
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('champions');
            }}
            className={`py-1.5 px-1 rounded transition-colors text-center ${
              activeTab === 'champions' ? 'bg-[#306850] text-[#e0f8d0] border border-[#88c070]' : 'text-[#88c070] bg-[#102424]'
            }`}
          >
            2. CHAMPIONS
          </button>
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('regional');
            }}
            className={`py-1.5 px-1 rounded transition-colors text-center ${
              activeTab === 'regional' ? 'bg-[#306850] text-[#e0f8d0] border border-[#88c070]' : 'text-[#88c070] bg-[#102424]'
            }`}
          >
            3. REGIONS
          </button>
          <button
            onClick={() => {
              soundFX.playSelect();
              setActiveTab('victory');
            }}
            className={`py-1.5 px-1 rounded transition-colors text-center ${
              activeTab === 'victory' ? 'bg-[#306850] text-[#e0f8d0] border border-[#88c070]' : 'text-[#88c070] bg-[#102424]'
            }`}
          >
            4. TROPHY
          </button>
        </div>

        {/* Screen Content Body */}
        <div className="flex-1 overflow-y-auto p-3 gba-scrollbar">
          
          {/* SCREEN 1: GAUNTLET BRACKET */}
          {activeTab === 'bracket' && (
            <div className="space-y-2.5">
              <div className="bg-[#102424] border-2 border-[#306850] rounded-lg p-2.5 text-center">
                <div className="font-pixel text-[8px] text-[#f0c830] mb-0.5">STAGE 1 CLEARED • ADVANCING TO STAGE 2</div>
                <h3 className="font-pixel text-xs text-[#e0f8d0]">KANTO ELITE FOUR GAUNTLET</h3>
                <p className="text-[10px] text-[#88c070] mt-0.5">Indigo Plateau • 5-Round Endurance Climb</p>
              </div>

              {/* 5 Ladder Steps */}
              <div className="space-y-1.5 text-xs">
                {/* Stage 1 */}
                <div className="p-2 rounded bg-[#142e22] border border-[#88c070]/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#88c070] text-[#081820] font-pixel text-[8px] flex items-center justify-center font-bold">✓</span>
                    <div>
                      <div className="font-pixel text-[9px] text-[#88c070]">ROUND 1: LORELEI</div>
                      <div className="text-[10px] text-[#a0d8a0]">Ice/Water • Dewgong, Cloyster, Lapras</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-[#88c070] bg-[#081820] px-1.5 py-0.5 rounded border border-[#88c070]">DEFEATED</span>
                </div>

                {/* Stage 2 (Current) */}
                <div className="p-2 rounded bg-[#0a1e28] border-2 border-[#38b8e8] shadow-[0_0_12px_rgba(56,184,232,0.3)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#38b8e8] text-[#081820] font-pixel text-[9px] flex items-center justify-center font-bold animate-pulse">▶</span>
                    <div>
                      <div className="font-pixel text-[10px] text-[#38b8e8]">ROUND 2: BRUNO (NEXT UP)</div>
                      <div className="text-[10px] text-[#e0f8d0] font-bold">Fighting • Machamp, Hitmonlee, Steelix</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-[#38b8e8] bg-[#081820] px-2 py-0.5 rounded border border-[#38b8e8]">ACTIVE</span>
                </div>

                {/* Stage 3 */}
                <div className="p-2 rounded bg-[#081820] border border-[#306850]/50 opacity-60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#102424] text-[#88c070] font-pixel text-[8px] flex items-center justify-center">3</span>
                    <div>
                      <div className="font-pixel text-[9px] text-[#88c070]">ROUND 3: AGATHA</div>
                      <div className="text-[10px] text-[#88c070]/80">Ghost/Poison • Gengar, Crobat, Arbok</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-[#88c070]/60">LOCKED</span>
                </div>

                {/* Stage 4 */}
                <div className="p-2 rounded bg-[#081820] border border-[#306850]/50 opacity-60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#102424] text-[#88c070] font-pixel text-[8px] flex items-center justify-center">4</span>
                    <div>
                      <div className="font-pixel text-[9px] text-[#88c070]">ROUND 4: LANCE</div>
                      <div className="text-[10px] text-[#88c070]/80">Dragon • Gyarados, Aerodactyl, Dragonite</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-[#88c070]/60">LOCKED</span>
                </div>

                {/* Stage 5 */}
                <div className="p-2 rounded bg-[#181608] border border-[#f0c830]/60 opacity-80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#f0c830] text-[#081820] font-pixel text-[9px] flex items-center justify-center font-bold">★</span>
                    <div>
                      <div className="font-pixel text-[9px] text-[#f0c830]">FINAL: CHAMPION BLUE</div>
                      <div className="text-[10px] text-[#f8e878]/80">6-Mon Full Tournament Roster</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-[#f0c830] bg-[#081820] px-1.5 py-0.5 rounded border border-[#f0c830]">TROPHY</span>
                </div>
              </div>

              {/* Automatic Recovery Card */}
              <div className="bg-[#102424] border-2 border-[#88c070] rounded-lg p-2.5 shadow-[0_0_12px_rgba(136,192,112,0.2)]">
                <div className="flex items-center justify-between text-[9px] font-pixel text-[#88c070] mb-1">
                  <span>💖 INTER-ROUND RECOVERY</span>
                  <span className="text-[#f0c830]">100% HEALTHY</span>
                </div>
                <p className="text-[10px] text-[#e0f8d0] leading-snug">
                  Party fully restored! HP recharged, move PP replenished, and all status conditions cleared.
                </p>
                <div className="grid grid-cols-6 gap-1 mt-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-1.5 bg-[#88c070] rounded-sm shadow-[0_0_4px_#88c070]" />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => soundFX.playSelect()}
                className="w-full py-3 bg-[#38b8e8] text-[#081820] font-pixel text-[10px] rounded border-2 border-[#88e0f8] shadow-md font-bold active:scale-[0.98]"
              >
                ▶ CHALLENGE BRUNO (STAGE 2/5)
              </button>
            </div>
          )}

          {/* SCREEN 2: CHAMPIONS DOSSIER */}
          {activeTab === 'champions' && (
            <div className="space-y-2.5">
              {/* Champion Selector Buttons */}
              <div className="grid grid-cols-5 gap-1 font-pixel text-[8px]">
                {(['blue', 'lance', 'steven', 'cynthia', 'iris'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      soundFX.playSelect();
                      setSelectedChampion(key);
                    }}
                    className={`py-1 rounded uppercase font-bold transition-colors ${
                      selectedChampion === key
                        ? 'bg-[#f0c830] text-[#081820] shadow-md'
                        : 'bg-[#102424] text-[#88c070] border border-[#306850]'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Champion Card */}
              <div className={`bg-[#0c1820] border-2 ${champ.frameBorder} rounded-lg p-3 space-y-2 relative overflow-hidden`}>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-pixel px-1.5 py-0.5 rounded bg-[#102424] text-[#e0f8d0] border border-[#306850]">
                    {champ.region}
                  </span>
                  <span className="font-pixel text-[#f0c830]">{champ.config}</span>
                </div>

                <div>
                  <h3 className="font-pixel text-sm text-[#e0f8d0]">{champ.title}</h3>
                  <p className="text-[10px] text-[#88c070] italic mt-0.5">{champ.tagline}</p>
                </div>

                <div className="p-2 bg-[#081820] rounded border border-[#306850] space-y-1">
                  <div className="flex items-center justify-between font-pixel text-[8px]">
                    <span className="text-[#f0c830]">SIGNATURE ROSTER (LV. 100)</span>
                    <span className="text-[#e85858]">{champ.difficulty}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-bold text-[#e0f8d0]">
                    {champ.roster.map((p, i) => (
                      <div key={i} className={`p-1 rounded bg-[#102424] border ${i === 5 ? 'border-[#f0c830] text-[#f0c830]' : 'border-[#306850]'}`}>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 bg-[#081820] rounded border border-[#306850] text-[9.5px] text-[#c0e0b8] leading-relaxed">
                  <span className="font-pixel text-[8px] text-[#88c070] block mb-0.5">TACTICAL BRIEFING:</span>
                  {champ.briefing}
                </div>

                <button
                  onClick={() => soundFX.playSelect()}
                  className="w-full py-2.5 bg-[#f0c830] text-[#081820] font-pixel text-[9px] font-bold rounded shadow-md active:scale-[0.98]"
                >
                  ⚔ ENGAGE {champ.title}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: REGIONAL HUB */}
          {activeTab === 'regional' && (
            <div className="space-y-2.5">
              <div className="bg-[#182010] border-2 border-[#f0c830] rounded-lg p-2.5 text-center">
                <div className="font-pixel text-[8px] text-[#f0c830] mb-0.5">TODAY'S ACTIVE REGION</div>
                <h3 className="font-pixel text-xs text-[#e0f8d0]">SINNOH POKÉMON LEAGUE</h3>
                <p className="text-[10px] text-[#f8e878] mt-0.5">Champion Cynthia • Daily cycle resets at 00:00 UTC</p>
              </div>

              {/* 5-Day Regional Track */}
              <div className="grid grid-cols-5 gap-1 font-pixel text-[7px] text-center">
                <div className="p-1 rounded bg-[#102424] border border-[#306850] text-[#88c070]/60">DAY 1<br/>KANTO</div>
                <div className="p-1 rounded bg-[#102424] border border-[#306850] text-[#88c070]/60">DAY 2<br/>JOHTO</div>
                <div className="p-1 rounded bg-[#102424] border border-[#306850] text-[#88c070]/60">DAY 3<br/>HOENN</div>
                <div className="p-1 rounded bg-[#f0c830] text-[#081820] font-bold shadow-[0_0_6px_#f0c830]">DAY 4<br/>SINNOH</div>
                <div className="p-1 rounded bg-[#102424] border border-[#306850] text-[#88c070]/60">DAY 5<br/>UNOVA</div>
              </div>

              {/* 2 Mode Cards */}
              <div className="p-2.5 rounded-lg bg-[#081820] border-2 border-[#88c070] space-y-1">
                <div className="flex items-center justify-between font-pixel text-[8.5px]">
                  <span className="text-[#88c070]">MODE A: DAILY SHOWDOWN</span>
                  <span className="text-[#f0c830]">1 MATCH</span>
                </div>
                <div className="font-pixel text-[10px] text-[#e0f8d0]">DIRECT CHAMPION BATTLE</div>
                <p className="text-[10px] text-[#88c070] leading-snug">
                  Jump straight into a 6v6 Level 100 tactical clash against today's Champion. Fast daily action.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0a1e28] border-2 border-[#38b8e8] space-y-1 shadow-[0_0_12px_rgba(56,184,232,0.2)]">
                <div className="flex items-center justify-between font-pixel text-[8.5px]">
                  <span className="text-[#38b8e8]">MODE B: GAUNTLET RUN</span>
                  <span className="text-[#38b8e8]">5 ROUNDS</span>
                </div>
                <div className="font-pixel text-[10px] text-[#e0f8d0]">ELITE FOUR ENDURANCE CLIMB</div>
                <p className="text-[10px] text-[#88e0f8] leading-snug">
                  Battle all 4 Elite Four members in sequence to challenge the Champion. Unlocks regional League Trophies.
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 4: TROPHY VICTORY */}
          {activeTab === 'victory' && (
            <div className="space-y-2.5 text-center">
              <div className="bg-[#182010] border-2 border-[#f0c830] rounded-lg p-3">
                <div className="text-3xl mb-1">🏆</div>
                <div className="font-pixel text-[8px] text-[#f0c830] mb-0.5">GAUNTLET RUN COMPLETE!</div>
                <h3 className="font-pixel text-xs text-[#e0f8d0]">SINNOH LEAGUE CHAMPION</h3>
                <p className="text-[10px] text-[#f8e878] mt-0.5">Defeated all 4 Elite Four members & Cynthia</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-left font-pixel text-[8px]">
                <div className="p-2 bg-[#102424] rounded border border-[#306850]">
                  <div className="text-[#88c070]">TURNS</div>
                  <div className="text-sm text-[#e0f8d0] font-bold mt-0.5">24</div>
                </div>
                <div className="p-2 bg-[#102424] rounded border border-[#306850]">
                  <div className="text-[#88c070]">FAINTED</div>
                  <div className="text-sm text-[#e0f8d0] font-bold mt-0.5">1 / 6</div>
                </div>
                <div className="p-2 bg-[#102424] rounded border border-[#306850]">
                  <div className="text-[#88c070]">RECORD</div>
                  <div className="text-sm text-[#f0c830] font-bold mt-0.5">5 - 0</div>
                </div>
                <div className="p-2 bg-[#102424] rounded border border-[#306850]">
                  <div className="text-[#88c070]">RUN MVP</div>
                  <div className="text-xs text-[#e0f8d0] font-bold mt-0.5 truncate">INFERNAPE</div>
                </div>
              </div>

              {/* Rewards Card */}
              <div className="p-2.5 bg-[#081820] border-2 border-[#f0c830] rounded-lg space-y-1">
                <div className="font-pixel text-[8.5px] text-[#f0c830]">REWARDS UNLOCKED</div>
                <div className="flex justify-around text-xs pt-1">
                  <div>
                    <span className="text-xl">🥇</span>
                    <div className="font-pixel text-[7px] text-[#e0f8d0]">TROPHY</div>
                  </div>
                  <div>
                    <span className="text-xl">🎴</span>
                    <div className="font-pixel text-[7px] text-[#e0f8d0]">+3 PACKS</div>
                  </div>
                  <div>
                    <span className="text-xl">🔥</span>
                    <div className="font-pixel text-[7px] text-[#e0f8d0]">STREAK +1</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => soundFX.playSelect()}
                className="w-full py-3 bg-[#f0c830] text-[#081820] font-pixel text-[10px] font-bold rounded shadow-lg active:scale-[0.98]"
              >
                CLAIM TROPHY &amp; BOOSTER PACKS
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation Note */}
        <div className="bg-[#102424] border-t border-[#306850] px-3 py-1.5 flex items-center justify-between text-[8px] font-pixel text-[#88c070] shrink-0">
          <span>PORTRAIT MOBILE FIT</span>
          <span className="text-[#e0f8d0]">VS CHAMP DESIGN SYSTEM</span>
        </div>

      </div>
    </div>
  );
};
