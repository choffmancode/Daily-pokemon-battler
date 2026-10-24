/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundFX } from './AudioEngine';
import { Pokemon, PokemonType, TeamPreset } from '../game/types';
import { BEGINNER_TEAMS } from '../game/constants';
import { getSpriteUrl } from '../game/data/typeChart';

interface TeamSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
  onSelectTeam: (team: TeamPreset) => void;
  onStartBattleWithTeam?: (team: TeamPreset, customRoster: Pokemon[]) => void;
  initialStep?: 'teams' | 'lead';
  teams?: TeamPreset[];
}

interface ArchetypeMeta {
  title: string;
  summary: string;
  stampType: 'sweep' | 'stall' | 'balance';
}

const ARCHETYPES_BY_INDEX: ArchetypeMeta[] = [
  {
    title: 'SWEEP',
    summary: 'Fast offense. KO before they act.',
    stampType: 'sweep',
  },
  {
    title: 'STALL',
    summary: 'Wear them down. Outlast and punish.',
    stampType: 'stall',
  },
  {
    title: 'BALANCE',
    summary: 'Adapt and cover weaknesses. Solid all-around.',
    stampType: 'balance',
  },
];

/**
 * Square 24x24 Crimson Hanko Pictorial Pixel Stamp (matches Reference 2)
 */
const PictorialHankoStamp: React.FC<{ type: 'sweep' | 'stall' | 'balance' }> = ({ type }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" shapeRendering="crispEdges">
    <rect x="0" y="0" width="24" height="24" fill="#182818" />
    <rect x="1" y="1" width="22" height="22" fill="#a83838" />
    <rect x="3" y="3" width="18" height="18" fill="#e8f0d8" />
    <rect x="4" y="4" width="16" height="16" fill="#a83838" />
    {type === 'sweep' && (
      /* Butterfly / Winged Swiftness Crest */
      <g fill="#e8f0d8">
        <rect x="11" y="6" width="2" height="12" />
        <rect x="6" y="6" width="4" height="5" />
        <rect x="14" y="6" width="4" height="5" />
        <rect x="8" y="8" width="3" height="3" />
        <rect x="13" y="8" width="3" height="3" />
        <rect x="7" y="13" width="3" height="4" />
        <rect x="14" y="13" width="3" height="4" />
      </g>
    )}
    {type === 'stall' && (
      /* Ukiyo-e Cresting Wave Stamp */
      <g fill="#e8f0d8">
        <rect x="6" y="15" width="12" height="2" />
        <rect x="6" y="11" width="10" height="2" />
        <rect x="8" y="7" width="8" height="2" />
        <rect x="14" y="9" width="3" height="2" />
        <rect x="6" y="9" width="2" height="2" />
      </g>
    )}
    {type === 'balance' && (
      /* Twin Mountain Peaks Stamp */
      <g fill="#e8f0d8">
        <rect x="5" y="16" width="14" height="2" />
        <rect x="6" y="13" width="5" height="3" />
        <rect x="7" y="10" width="3" height="3" />
        <rect x="8" y="8" width="1" height="2" />
        <rect x="12" y="12" width="6" height="4" />
        <rect x="13" y="9" width="4" height="3" />
        <rect x="14" y="7" width="2" height="2" />
      </g>
    )}
  </svg>
);

/**
 * Monochrome Green Pixel-Art Open Hand Icon inside double-bordered square badge (matches Reference 2 BACK button)
 */
const PixelStopHandBadge: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" shapeRendering="crispEdges">
    <rect x="0" y="0" width="24" height="24" fill="#182818" />
    <rect x="2" y="2" width="20" height="20" fill="#d8ecc0" />
    <rect x="3" y="3" width="18" height="18" fill="#305030" />
    <rect x="4" y="4" width="16" height="16" fill="#d8ecc0" />
    {/* Pixel Open Palm Hand in dark forest green */}
    <g fill="#182818">
      <rect x="8" y="5" width="2" height="6" />
      <rect x="11" y="4" width="2" height="7" />
      <rect x="14" y="5" width="2" height="6" />
      <rect x="17" y="7" width="2" height="6" />
      <rect x="5" y="10" width="3" height="3" />
      <rect x="7" y="11" width="11" height="6" />
      <rect x="8" y="17" width="9" height="3" />
    </g>
    <g fill="#588850">
      <rect x="9" y="12" width="7" height="4" />
    </g>
  </svg>
);

/**
 * Elemental Pixel Icon (used both for the 14x14 unboxed inline symbol next to Lv.XX and inside the 26x26 circular badge on the right)
 */
const ElementalPixelIcon: React.FC<{ type: PokemonType; size?: 'sm' | 'circle' }> = ({
  type,
  size = 'sm',
}) => {
  const palette: Record<PokemonType, { bg: string; fg: string; accent: string }> = {
    Water: { bg: '#2868a8', fg: '#78c8f8', accent: '#e0f8ff' },
    Fire: { bg: '#b83020', fg: '#f89030', accent: '#f8e890' },
    Grass: { bg: '#307830', fg: '#78d850', accent: '#e0f8d0' },
    Electric: { bg: '#b88818', fg: '#f8d830', accent: '#ffffc0' },
    Ice: { bg: '#308898', fg: '#88e8f8', accent: '#ffffff' },
    Fighting: { bg: '#902820', fg: '#e85848', accent: '#f8d8c0' },
    Poison: { bg: '#682878', fg: '#c868d8', accent: '#f8d0f8' },
    Ground: { bg: '#886828', fg: '#dfb868', accent: '#f8e8c0' },
    Flying: { bg: '#4860a0', fg: '#98b8f8', accent: '#e8f0ff' },
    Psychic: { bg: '#a82858', fg: '#f86898', accent: '#ffd8e8' },
    Bug: { bg: '#587818', fg: '#a8d030', accent: '#e8f8b0' },
    Rock: { bg: '#685830', fg: '#b8a060', accent: '#e8d8b0' },
    Ghost: { bg: '#403060', fg: '#8870b8', accent: '#d8c8f8' },
    Dragon: { bg: '#382898', fg: '#7860f8', accent: '#d0c8ff' },
    Dark: { bg: '#383028', fg: '#887868', accent: '#d8c8b8' },
    Steel: { bg: '#506070', fg: '#a8b8c8', accent: '#e8f0f8' },
    Fairy: { bg: '#b85080', fg: '#f8a0c8', accent: '#ffe0f0' },
    Normal: { bg: '#606050', fg: '#b8b8a0', accent: '#f0f0e0' },
  };

  const col = palette[type] || palette.Normal;

  if (size === 'sm') {
    /* Unboxed 14x14 Shaped Elemental Pixel Icon next to Lv.100 (matches Reference 3) */
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0" shapeRendering="crispEdges">
        {type === 'Water' || type === 'Ice' || type === 'Poison' ? (
          /* Pixel Water Droplet Silhouette */
          <g>
            <path d="M6 1h2v2h2v3h2v4h-2v2H4v-2H2V6h2V3h2V1z" fill="#182418" />
            <path d="M6 2h2v2h2v3h1v3H9v1H5v-1H3V7h1V4h2V2z" fill={col.fg} />
            <rect x="4" y="7" width="2" height="2" fill={col.accent} />
          </g>
        ) : type === 'Fire' || type === 'Fighting' ? (
          /* Pixel Flame Silhouette */
          <g>
            <path d="M6 1h3v2h2v3h2v5h-2v2H3v-2H1V6h2V4h3V1z" fill="#182418" />
            <path d="M6 2h2v2h2v2h1v4H9v2H5v-2H3V6h2V4h1V2z" fill={col.fg} />
            <rect x="5" y="7" width="4" height="4" fill={col.accent} />
          </g>
        ) : type === 'Dragon' || type === 'Flying' ? (
          /* Pixel Wing / Dragon Crest Silhouette */
          <g>
            <path d="M8 1h4v3h1v5h-2v2H8v2H3v-3H1V6h3V3h4V1z" fill="#182418" />
            <path d="M8 2h3v2h1v4h-2v2H7v2H4V9H2V7h3V4h3V2z" fill={col.fg} />
            <rect x="7" y="4" width="3" height="2" fill={col.accent} />
          </g>
        ) : type === 'Grass' || type === 'Bug' ? (
          /* Pixel Leaf Silhouette */
          <g>
            <path d="M7 1h5v5h-1v3H9v2H5v2H2v-3h1V6h2V3h2V1z" fill="#182418" />
            <path d="M7 2h4v4h-1v2H8v2H4V7h1V4h2V2z" fill={col.fg} />
            <rect x="6" y="5" width="3" height="2" fill={col.accent} />
          </g>
        ) : type === 'Dark' || type === 'Ghost' ? (
          /* Pixel Skull / Crescent Silhouette */
          <g>
            <path d="M4 1h6v2h2v5h-2v4H4V8H2V3h2V1z" fill="#182418" />
            <path d="M4 2h6v2h1v4H9v3H5V8H3V4h1V2z" fill={col.fg} />
            <rect x="4" y="4" width="2" height="2" fill="#182418" />
            <rect x="8" y="4" width="2" height="2" fill="#182418" />
          </g>
        ) : (
          /* Pixel Twin Mountain / Steel Crest Silhouette */
          <g>
            <path d="M4 2h3v2h2V1h3v4h1v7H1V6h2V4h1V2z" fill="#182418" />
            <path d="M4 3h2v3h2V2h2v4h2v5H2V7h2V3z" fill={col.fg} />
            <rect x="8" y="4" width="2" height="2" fill={col.accent} />
          </g>
        )}
      </svg>
    );
  }

  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="shrink-0" shapeRendering="crispEdges">
      {/* Outer Dark Pixel Circle */}
      <rect x="7" y="1" width="12" height="24" fill="#182418" />
      <rect x="4" y="2" width="18" height="22" fill="#182418" />
      <rect x="2" y="4" width="22" height="18" fill="#182418" />
      <rect x="1" y="7" width="24" height="12" fill="#182418" />
      {/* Cream Ring */}
      <rect x="8" y="2" width="10" height="22" fill="#d8e8c0" />
      <rect x="5" y="3" width="16" height="20" fill="#d8e8c0" />
      <rect x="3" y="5" width="20" height="16" fill="#d8e8c0" />
      <rect x="2" y="8" width="22" height="10" fill="#d8e8c0" />
      {/* Colored Core */}
      <rect x="8" y="4" width="10" height="18" fill={col.bg} />
      <rect x="5" y="5" width="16" height="16" fill={col.bg} />
      <rect x="4" y="8" width="18" height="10" fill={col.bg} />
      {/* Inner Elemental Symbol */}
      {type === 'Water' || type === 'Ice' || type === 'Poison' ? (
        /* Droplet Emblem */
        <g fill={col.fg}>
          <rect x="12" y="6" width="2" height="3" />
          <rect x="10" y="9" width="6" height="3" />
          <rect x="9" y="12" width="8" height="5" />
          <rect x="10" y="17" width="6" height="2" />
          <rect x="10" y="12" width="2" height="3" fill={col.accent} />
        </g>
      ) : type === 'Fire' || type === 'Fighting' ? (
        /* Flame Crest */
        <g fill={col.fg}>
          <rect x="12" y="6" width="3" height="3" />
          <rect x="10" y="9" width="6" height="4" />
          <rect x="8" y="12" width="10" height="5" />
          <rect x="10" y="17" width="6" height="2" />
          <rect x="11" y="13" width="4" height="4" fill={col.accent} />
        </g>
      ) : type === 'Dragon' || type === 'Flying' ? (
        /* Dragon Wing / Fang Crest */
        <g fill={col.fg}>
          <rect x="14" y="6" width="4" height="3" />
          <rect x="10" y="8" width="7" height="3" />
          <rect x="7" y="11" width="9" height="4" />
          <rect x="8" y="15" width="5" height="3" />
          <rect x="11" y="9" width="4" height="2" fill={col.accent} />
        </g>
      ) : type === 'Grass' || type === 'Bug' ? (
        /* Leaf Emblem */
        <g fill={col.fg}>
          <rect x="13" y="6" width="4" height="3" />
          <rect x="10" y="8" width="7" height="4" />
          <rect x="8" y="11" width="8" height="5" />
          <rect x="7" y="16" width="4" height="2" />
          <rect x="10" y="11" width="4" height="2" fill={col.accent} />
        </g>
      ) : type === 'Dark' || type === 'Ghost' ? (
        /* Crescent / Skull Emblem */
        <g fill={col.fg}>
          <rect x="9" y="7" width="8" height="7" />
          <rect x="10" y="14" width="6" height="4" />
          <rect x="10" y="9" width="2" height="2" fill="#182418" />
          <rect x="14" y="9" width="2" height="2" fill="#182418" />
          <rect x="11" y="7" width="4" height="2" fill={col.accent} />
        </g>
      ) : (
        /* Twin Mountain / Hex Shield Emblem (Rock, Ground, Steel, Electric, Psychic, Normal) */
        <g fill={col.fg}>
          <rect x="14" y="7" width="3" height="3" />
          <rect x="8" y="9" width="4" height="3" />
          <rect x="7" y="12" width="12" height="5" />
          <rect x="14" y="9" width="2" height="3" fill={col.accent} />
        </g>
      )}
    </svg>
  );
};

export const TeamSelectorModal: React.FC<TeamSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedTeamId,
  onSelectTeam,
  onStartBattleWithTeam,
  initialStep = 'teams',
  teams,
}) => {
  const availableTeams = teams && teams.length > 0 ? teams : BEGINNER_TEAMS;
  const [step, setStep] = useState<'teams' | 'lead'>(initialStep);
  const [activeTeam, setActiveTeam] = useState<TeamPreset>(
    () => availableTeams.find((t) => t.id === selectedTeamId) || availableTeams[0]
  );
  const [rosterOrder, setRosterOrder] = useState<Pokemon[]>(() => [...activeTeam.team]);

  useEffect(() => {
    if (isOpen) {
      const found = availableTeams.find((t) => t.id === selectedTeamId) || availableTeams[0];
      setActiveTeam(found);
      setRosterOrder([...found.team]);
      setStep(initialStep);
    }
    // Only initialize step when modal opens or initialStep prop changes, not when selectedTeamId updates mid-flow
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialStep, availableTeams]);

  if (!isOpen) return null;

  // Strictly display 3 core teams to match Reference 2 with zero vertical scroll
  const displayedTeams = availableTeams.slice(0, 3);

  const handleChooseTeamCard = (team: TeamPreset) => {
    soundFX.playSelect();
    setActiveTeam(team);
    setRosterOrder([...team.team]);
    onSelectTeam(team);
    setStep('lead');
  };

  const handleSelectLeadSlot = (index: number) => {
    soundFX.playSelect();
    if (index === 0) return;
    setRosterOrder((prev) => {
      const next = [...prev];
      const temp = next[0];
      next[0] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleStartBattle = () => {
    soundFX.playSelect();
    const updatedPreset: TeamPreset = {
      ...activeTeam,
      team: rosterOrder,
    };
    onSelectTeam(updatedPreset);
    if (onStartBattleWithTeam) {
      onStartBattleWithTeam(updatedPreset, rosterOrder);
    }
    onClose();
  };

  // ============================================================================
  // STEP 1: TODAY'S TEAMS (Reference 2)
  // ============================================================================
  if (step === 'teams') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#081820] select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Today's Teams"
      >
        <div
          className="relative w-full max-w-[430px] h-[100dvh] max-h-[920px] flex flex-col justify-between p-2.5 sm:p-3 overflow-hidden border-x-4 border-[#182818]"
          style={{
            backgroundColor: '#c8dcb0',
            backgroundImage:
              'linear-gradient(rgba(48, 80, 48, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(48, 80, 48, 0.08) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        >
          {/* 1. TOP HEADER BANNER: TODAY'S TEAMS */}
          <header className="relative w-full h-[54px] shrink-0 mb-2">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 380 54"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              {/* Outer dark border */}
              <polygon
                points="8,0 372,0 380,8 380,46 372,54 8,54 0,46 0,8"
                fill="#182818"
              />
              {/* Mid olive-green frame */}
              <polygon
                points="10,3 370,3 377,10 377,44 370,51 10,51 3,44 3,10"
                fill="#486840"
              />
              {/* Inner dark hairline */}
              <polygon
                points="13,6 367,6 374,13 374,41 367,48 13,48 6,41 6,13"
                fill="#182818"
              />
              {/* Cream inner plate */}
              <polygon
                points="15,8 365,8 372,15 372,39 365,46 15,46 8,39 8,15"
                fill="#e0f0c8"
              />
              {/* Corner square rivets */}
              <rect x="13" y="13" width="4" height="4" fill="#486840" />
              <rect x="363" y="13" width="4" height="4" fill="#486840" />
              <rect x="13" y="37" width="4" height="4" fill="#486840" />
              <rect x="363" y="37" width="4" height="4" fill="#486840" />
            </svg>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <h1 className="gba-title-text text-[18px] sm:text-[20px] font-bold text-[#182818]">
                TODAY&apos;S TEAMS
              </h1>
            </div>
          </header>

          {/* 2. THREE ARCHETYPE CARDS (Strict 3-row grid, zero scrolling) */}
          <div className="flex-1 min-h-0 grid grid-rows-3 gap-2.5 my-0.5">
            {displayedTeams.map((team, idx) => {
              const meta = ARCHETYPES_BY_INDEX[idx] || ARCHETYPES_BY_INDEX[0];
              const previewMons = team.team.slice(0, 4);

              return (
                <article
                  key={team.id}
                  onClick={() => handleChooseTeamCard(team)}
                  className="relative w-full h-full min-h-0 cursor-pointer active:translate-y-[1px] transition-transform"
                >
                  {/* Chamfered Double-Lined Card SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 380 190"
                    preserveAspectRatio="none"
                    shapeRendering="crispEdges"
                  >
                    {/* Outer dark border */}
                    <polygon
                      points="8,0 372,0 380,8 380,182 372,190 8,190 0,182 0,8"
                      fill="#182818"
                    />
                    {/* Mid olive frame */}
                    <polygon
                      points="10,3 370,3 377,10 377,180 370,187 10,187 3,180 3,10"
                      fill="#506c44"
                    />
                    {/* Inner dark border */}
                    <polygon
                      points="13,6 367,6 374,13 374,177 367,184 13,184 6,177 6,13"
                      fill="#182818"
                    />
                    {/* Cream card surface */}
                    <polygon
                      points="15,8 365,8 372,15 372,175 365,182 15,182 8,175 8,15"
                      fill="#e0f0c8"
                    />
                    {/* Vertical Divider at 52% width */}
                    <rect x="196" y="8" width="3" height="174" fill="#182818" />
                  </svg>

                  {/* Card Foreground Content */}
                  <div className="relative z-10 w-full h-full grid grid-cols-[52%_48%] p-2.5">
                    {/* LEFT 52%: 1x4 Horizontal Row of Static Pixel Sprites directly on Cream Surface (Matches Reference 2) */}
                    <div className="relative w-full h-full grid grid-cols-4 items-center justify-items-center px-1">
                      {previewMons.map((mon) => (
                        <div
                          key={mon.id}
                          className="relative flex flex-col items-center justify-center w-full h-16"
                        >
                          {/* Subtle Pixel Ground Shadow */}
                          <div className="absolute bottom-1 w-9 h-2 rounded-full bg-[#b8cc98] border border-[#98b078]" />
                          <img
                            src={getSpriteUrl(mon.nationalDex, false)}
                            alt={mon.species}
                            className="relative z-10 w-12 h-12 sm:w-13 sm:h-13 object-contain pixelated scale-110"
                            loading="eager"
                          />
                        </div>
                      ))}
                    </div>

                    {/* RIGHT 48%: Archetype Title + Pictorial Hanko + Summary + SELECT Button */}
                    <div className="flex flex-col justify-between pl-3 pr-1.5 py-1 min-h-0">
                      {/* Title + Stamp Row */}
                      <div className="flex items-start justify-between gap-1">
                        <h2 className="gba-title-text text-[16px] sm:text-[18px] font-bold text-[#182818] leading-none pt-0.5">
                          {meta.title}
                        </h2>
                        <PictorialHankoStamp type={meta.stampType} />
                      </div>

                      {/* Complete Concise 2-Line Tactical Summary (Zero Ellipsis Cutoff) */}
                      <p className="font-pixel text-[8px] sm:text-[8.5px] leading-[1.45] text-[#20341c] pr-0.5">
                        {meta.summary}
                      </p>

                      {/* Double-Beveled Chamfered SELECT Button */}
                      <div className="flex justify-end pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChooseTeamCard(team);
                          }}
                          className="relative w-[112px] h-[32px] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
                        >
                          <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 112 32"
                            preserveAspectRatio="none"
                            shapeRendering="crispEdges"
                          >
                            <polygon
                              points="4,0 108,0 112,4 112,28 108,32 4,32 0,28 0,4"
                              fill="#182818"
                            />
                            <polygon
                              points="5,2 107,2 110,5 110,27 107,30 5,30 2,27 2,5"
                              fill="#607c50"
                            />
                            <polygon
                              points="7,4 105,4 108,7 108,25 105,28 7,28 4,25 4,7"
                              fill="#182818"
                            />
                            <polygon
                              points="8,5 104,5 107,8 107,24 104,27 8,27 5,24 5,8"
                              fill="#d8ecc0"
                            />
                          </svg>
                          <span className="relative z-10 gba-btn-text text-[11px] font-bold text-[#182818]">
                            SELECT
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 3. BOTTOM BACK BUTTON (Left-Aligned Icon + Text Matches Reference 2) */}
          <footer className="relative w-full h-[48px] shrink-0 mt-2">
            <button
              type="button"
              onClick={() => {
                soundFX.playSelect();
                onClose();
              }}
              className="relative w-full h-full flex items-center justify-start pl-6 gap-3 cursor-pointer active:translate-y-[1px]"
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 380 48"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon
                  points="8,0 372,0 380,8 380,40 372,48 8,48 0,40 0,8"
                  fill="#182818"
                />
                <polygon
                  points="10,3 370,3 377,10 377,38 370,45 10,45 3,38 3,10"
                  fill="#506c44"
                />
                <polygon
                  points="13,6 367,6 374,13 374,35 367,42 13,42 6,35 6,13"
                  fill="#182818"
                />
                <polygon
                  points="15,8 365,8 372,15 372,33 365,40 15,40 8,33 8,15"
                  fill="#d8ecc0"
                />
              </svg>
              <div className="relative z-10 flex items-center justify-start gap-3">
                <PixelStopHandBadge />
                <span className="gba-title-text text-[16px] font-bold text-[#182818]">
                  BACK
                </span>
              </div>
            </button>
          </footer>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STEP 2: CHOOSE YOUR LEAD (Reference 3)
  // ============================================================================
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#081820] select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Choose Your Lead"
    >
      {/* Outer Warm Tan Wave-Scroll Frame (Matches Reference 3) */}
      <div
        className="relative w-full max-w-[430px] h-[100dvh] max-h-[920px] flex flex-col justify-between p-2.5 sm:p-3 overflow-hidden border-x-4 border-[#182418]"
        style={{
          backgroundColor: '#cbb98c',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' fill='%23cbb98c'/%3E%3Cpath d='M0 0h16v2H0V0zm0 14h16v2H0v-2zM2 4h12v8H2V4zm2 2v4h8V6H4z' fill='%239c8860' fill-opacity='0.38'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Inner Dark Recess Frame */}
        <div className="w-full h-full bg-[#384430] border-[3px] border-[#182418] p-2 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_0_2px_#788860]">
          {/* 1. TOP HEADER BANNER: CHOOSE YOUR LEAD (Strictly clean like Reference 3) */}
          <header
            onClick={() => {
              soundFX.playSelect();
              setStep('teams');
            }}
            title="Click to return to Today's Teams"
            className="relative w-full h-[50px] shrink-0 mb-1.5 cursor-pointer"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 360 50"
              preserveAspectRatio="none"
              shapeRendering="crispEdges"
            >
              <polygon
                points="6,0 354,0 360,6 360,44 354,50 6,50 0,44 0,6"
                fill="#182418"
              />
              <polygon
                points="8,3 352,3 357,8 357,42 352,47 8,47 3,42 3,8"
                fill="#607450"
              />
              <polygon
                points="11,6 349,6 354,11 354,39 349,44 11,44 6,39 6,11"
                fill="#182418"
              />
              <polygon
                points="13,8 347,8 352,13 352,37 347,42 13,42 8,37 8,13"
                fill="#e0ecd0"
              />
            </svg>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <h1 className="gba-title-text text-[17px] sm:text-[19px] font-bold text-[#182418]">
                CHOOSE YOUR LEAD
              </h1>
            </div>
          </header>

          {/* 2. 6 PARTY SLOTS (Strict 6-row grid, zero scroll, zero clipping) */}
          <div className="flex-1 min-h-0 grid grid-rows-6 gap-1.5 my-0.5">
            {rosterOrder.slice(0, 6).map((mon, idx) => {
              const isLead = idx === 0;
              const primaryType = mon.types[0] || 'Normal';

              return (
                <div
                  key={mon.id}
                  onClick={() => handleSelectLeadSlot(idx)}
                  className="relative w-full h-full min-h-0 flex items-center cursor-pointer group"
                >
                  {/* Left Selection Marker (Flush against the row's left edge like Reference 3) */}
                  <div className="w-4 flex items-center justify-end shrink-0 z-20">
                    {isLead ? (
                      <svg
                        width="18"
                        height="24"
                        viewBox="0 0 18 24"
                        className="-mr-1.5 drop-shadow-[1px_1px_0_#081820]"
                        shapeRendering="crispEdges"
                      >
                        <polygon points="0,0 18,12 0,24" fill="#182418" />
                        <polygon points="2,3 15,12 2,21" fill="#98d848" />
                        <polygon points="3,5 12,12 3,15" fill="#d0f890" />
                      </svg>
                    ) : (
                      <div className="w-3 h-5 bg-[#34442c] border-2 border-r-0 border-[#182418] -mr-[2px]" />
                    )}
                  </div>

                  {/* Main Dark-Olive Slot Box */}
                  <div
                    className={`flex-1 h-full min-h-0 flex items-center justify-between px-2.5 py-1 border-2 border-[#182418] transition-colors ${
                      isLead
                        ? 'bg-[#3c5030] shadow-[inset_0_0_0_2px_#98d848]'
                        : 'bg-[#34442c] shadow-[inset_0_0_0_2px_#586c48] hover:bg-[#3c4e34]'
                    }`}
                  >
                    {/* Left: Sprite + Name + Lv.100 + Inline Elemental Icon */}
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={getSpriteUrl(mon.nationalDex, false)}
                        alt={mon.species}
                        className="w-12 h-12 sm:w-13 sm:h-13 object-contain pixelated shrink-0 -my-2"
                        loading="eager"
                      />
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="font-pixel text-[11px] sm:text-[12px] font-bold text-[#e8f4d8] tracking-tight truncate uppercase leading-tight drop-shadow-[1px_1px_0_#182418]">
                          {mon.species}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-pixel text-[9px] sm:text-[10px] text-[#d0e4b8] leading-none">
                            Lv.{mon.level}
                          </span>
                          <ElementalPixelIcon type={primaryType} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Right: HP Bar + Numeric HP + Circular Elemental Emblem Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex flex-col items-end justify-center">
                        {/* HP Pill Bar */}
                        <div className="flex items-center bg-[#182418] border border-[#b8cca0] px-1 py-0.5">
                          <span className="font-pixel text-[7px] font-bold text-[#a8d860] mr-1 leading-none">
                            HP
                          </span>
                          <div className="w-16 sm:w-20 h-2 bg-[#283420] border border-[#101810] overflow-hidden">
                            <div className="h-full w-full bg-[#78c840]" />
                          </div>
                        </div>
                        {/* Numeric HP Readout */}
                        <span className="font-pixel text-[9px] sm:text-[10px] text-[#e8f4d8] mt-1 leading-none tracking-tight drop-shadow-[1px_1px_0_#182418]">
                          {mon.maxHp} / {mon.maxHp}
                        </span>
                      </div>

                      {/* 26x26 Circular Elemental Pixel Badge */}
                      <ElementalPixelIcon type={primaryType} size="circle" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. BOTTOM START BATTLE CTA (Matches Reference 3 with Prominent Target Reticle Emblem) */}
          <footer className="relative w-full h-[58px] shrink-0 mt-1.5">
            <button
              type="button"
              onClick={handleStartBattle}
              className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer active:translate-y-[1px]"
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 360 58"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                <polygon
                  points="8,0 352,0 360,8 360,50 352,58 8,58 0,50 0,8"
                  fill="#182418"
                />
                <polygon
                  points="10,3 350,3 357,10 357,48 350,55 10,55 3,48 3,10"
                  fill="#788c60"
                />
                <polygon
                  points="13,6 347,6 354,13 354,45 347,52 13,52 6,45 6,13"
                  fill="#182418"
                />
                <polygon
                  points="15,8 345,8 352,15 352,43 345,50 15,50 8,43 8,15"
                  fill="#344c2c"
                />
              </svg>

              <div className="relative z-10 flex flex-col items-center justify-center pt-0.5">
                <span className="gba-title-text text-[17px] sm:text-[19px] font-bold text-[#e8f4d8] drop-shadow-[2px_2px_0_#182418]">
                  START BATTLE
                </span>
                {/* Prominent Target Reticle flanked by horizontal lines */}
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-16 h-[2px] bg-[#98b078]" />
                  <svg width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges">
                    <rect x="5" y="1" width="6" height="14" fill="#182418" />
                    <rect x="1" y="5" width="14" height="6" fill="#182418" />
                    <rect x="3" y="3" width="10" height="10" fill="#182418" />
                    <rect x="6" y="2" width="4" height="12" fill="#d8ecd0" />
                    <rect x="2" y="6" width="12" height="4" fill="#d8ecd0" />
                    <rect x="4" y="4" width="8" height="8" fill="#d8ecd0" />
                    <rect x="5" y="5" width="6" height="6" fill="#344c2c" />
                    <rect x="7" y="7" width="2" height="2" fill="#d8ecd0" />
                  </svg>
                  <div className="w-16 h-[2px] bg-[#98b078]" />
                </div>
              </div>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
