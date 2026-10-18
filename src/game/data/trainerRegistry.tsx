/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrainerBaseId, EquippedTrainerConfig } from '../types';
import {
  compositeTrainerPixels,
  compilePixelRects,
  validateTrainerSprite,
  GBA_PALETTE,
  PRESET_TRAINER_BUILDS,
  PresetTrainerBuild,
  SLOT_ANCHOR_POINTS,
  renderTrainerToCanvas,
  SpriteSlotType,
  SpriteItemDefinition,
} from './trainerPixelEngine';

export interface TrainerBaseDefinition {
  id: TrainerBaseId;
  name: string;
  gameTitle: string;
  region: 'Hoenn' | 'Kanto' | 'Sinnoh';
  gender: 'boy' | 'girl';
  subtitle: string;
  description: string;
  signatureColors: {
    primary: string;
    secondary: string;
    accent: string;
    hair: string;
    skin: string;
  };
  defaultHeadItem: string;
  defaultOutfitItem: string;
  defaultBackpackItem: string;
  defaultShoesItem: string;
}

/**
 * Authentic Generation 3 Protagonist Trainer Bases
 * Extracted directly from Pokémon Emerald and Pokémon FireRed / LeafGreen.
 */
export const TRAINER_BASES: Record<TrainerBaseId, TrainerBaseDefinition> = {
  brendan_emerald: {
    id: 'brendan_emerald',
    name: 'Brendan (Emerald)',
    gameTitle: 'Pokémon Emerald',
    region: 'Hoenn',
    gender: 'boy',
    subtitle: 'Battle Frontier Champion',
    description: 'Hoenn’s emerald-clad adventurer who conquered all seven Frontier Brains and calmed the super-ancient titans.',
    signatureColors: {
      primary: '#10b981',
      secondary: '#0f172a',
      accent: '#ef4444',
      hair: '#1e293b',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_brendan_emerald_cap',
    defaultOutfitItem: 'card_brendan_emerald_suit',
    defaultBackpackItem: 'card_adventurer_rucksack',
    defaultShoesItem: 'card_emerald_runners',
  },
  may_emerald: {
    id: 'may_emerald',
    name: 'May (Emerald)',
    gameTitle: 'Pokémon Emerald',
    region: 'Hoenn',
    gender: 'girl',
    subtitle: 'Frontier Ace Coordinator',
    description: 'Vibrant coordinator and ace battler crowned across Hoenn’s Battle Tents, wearing her emerald ribbon bandana.',
    signatureColors: {
      primary: '#059669',
      secondary: '#f43f5e',
      accent: '#f8fafc',
      hair: '#78350f',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_may_emerald_bandana',
    defaultOutfitItem: 'card_may_emerald_tunic',
    defaultBackpackItem: 'card_leaf_yellow_satchel',
    defaultShoesItem: 'card_emerald_runners',
  },
  brendan_rs: {
    id: 'brendan_rs',
    name: 'Brendan (Ruby & Sapphire)',
    gameTitle: 'Pokémon Ruby & Sapphire',
    region: 'Hoenn',
    gender: 'boy',
    subtitle: 'Classic Hoenn Pioneer',
    description: 'The classic Hoenn explorer who uncovered ancient seafloor caverns and charted Route 101 to Ever Grande City.',
    signatureColors: {
      primary: '#dc2626',
      secondary: '#0f172a',
      accent: '#f59e0b',
      hair: '#1e293b',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_brendan_cap',
    defaultOutfitItem: 'card_hoenn_jacket',
    defaultBackpackItem: 'card_adventurer_rucksack',
    defaultShoesItem: 'card_red_running_shoes',
  },
  may_rs: {
    id: 'may_rs',
    name: 'May (Ruby & Sapphire)',
    gameTitle: 'Pokémon Ruby & Sapphire',
    region: 'Hoenn',
    gender: 'girl',
    subtitle: 'Ruby & Sapphire Explorer',
    description: 'The energetic route-runner of Hoenn, equipped with her signature crimson bandana and cycling gear.',
    signatureColors: {
      primary: '#e11d48',
      secondary: '#1e293b',
      accent: '#10b981',
      hair: '#78350f',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_may_bandana',
    defaultOutfitItem: 'card_magma_uniform',
    defaultBackpackItem: 'card_leaf_yellow_satchel',
    defaultShoesItem: 'card_red_running_shoes',
  },
  red_fr: {
    id: 'red_fr',
    name: 'Red (FireRed)',
    gameTitle: 'Pokémon FireRed',
    region: 'Kanto',
    gender: 'boy',
    subtitle: 'Living Legend of Mt. Silver',
    description: 'The silent champion of Kanto who defeated Team Rocket, conquered the Indigo Plateau, and ascended Mt. Silver.',
    signatureColors: {
      primary: '#dc2626',
      secondary: '#1d4ed8',
      accent: '#ffffff',
      hair: '#0f172a',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_red_vintage_cap',
    defaultOutfitItem: 'card_red_fr_vest',
    defaultBackpackItem: 'card_adventurer_rucksack',
    defaultShoesItem: 'card_red_running_shoes',
  },
  leaf_lg: {
    id: 'leaf_lg',
    name: 'Leaf (LeafGreen)',
    gameTitle: 'Pokémon LeafGreen',
    region: 'Kanto',
    gender: 'girl',
    subtitle: 'Sevii Islands Pathfinder',
    description: 'The spirited heroine of Kanto who unlocked the mysteries of the Tanoby Ruins and Sevii Islands with her wide sunhat.',
    signatureColors: {
      primary: '#2563eb',
      secondary: '#f59e0b',
      accent: '#f43f5e',
      hair: '#92400e',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_leaf_sunhat',
    defaultOutfitItem: 'card_leaf_lg_dress',
    defaultBackpackItem: 'card_leaf_yellow_satchel',
    defaultShoesItem: 'card_red_running_shoes',
  },
  cynthia_sinnoh: {
    id: 'cynthia_sinnoh',
    name: 'Cynthia (Sinnoh)',
    gameTitle: 'Pokémon Diamond & Pearl',
    region: 'Sinnoh',
    gender: 'girl',
    subtitle: 'Sinnoh League Champion',
    description: 'The peerless archaeologist and Sinnoh League Champion, draped in a black trench coat with golden hairpins.',
    signatureColors: {
      primary: '#d4af37',
      secondary: '#0f0f12',
      accent: '#38bdf8',
      hair: '#fef08a',
      skin: '#fed7aa',
    },
    defaultHeadItem: 'card_cynthia_hairpins',
    defaultOutfitItem: 'card_brendan_emerald_suit',
    defaultBackpackItem: 'card_adventurer_rucksack',
    defaultShoesItem: 'card_emerald_runners',
  },
};

export const TRAINER_BASES_LIST: TrainerBaseDefinition[] = Object.values(TRAINER_BASES);

export function getTrainerBase(id?: string): TrainerBaseDefinition {
  if (id && id in TRAINER_BASES) {
    return TRAINER_BASES[id as TrainerBaseId];
  }
  return TRAINER_BASES.brendan_emerald;
}

export {
  PRESET_TRAINER_BUILDS,
  SLOT_ANCHOR_POINTS,
  renderTrainerToCanvas,
};
export type {
  PresetTrainerBuild,
  SpriteSlotType,
  SpriteItemDefinition,
};

export { validateTrainerSprite };

/**
 * Large 80x80 GBA Battle Artwork
 * Strictly used for full-screen trainer intros or VS showcase cards.
 * Kept separate from overworld trainer sprites!
 */
export function getTrainerBattleArtwork(baseId?: string): string {
  if (baseId && baseId in TRAINER_BASES) {
    return `/sprites/trainers/${baseId}.png`;
  }
  return '/sprites/trainers/brendan_emerald.png';
}

export function getTrainerSpritePath(baseId?: string): string {
  return getTrainerBattleArtwork(baseId);
}

/**
 * Authentic Generation 3 GBA Overworld Trainer Sprite Component
 * Renders the 16x24 pixel grid using discrete SVG rects with shapeRendering: 'crispEdges'.
 * Enforces strict asset registration: reports visible error on missing/unregistered assets without silent substitution.
 */
const MiniTrainerSVGComponent: React.FC<{
  config: EquippedTrainerConfig;
  posture?: 'idle' | 'commanding' | 'cheering';
  className?: string;
  paletteOverrides?: Record<string, string>;
}> = ({ config, posture = 'idle', className = '', paletteOverrides }) => {
  const { rows, validation } = compositeTrainerPixels(config, posture);
  const rects = compilePixelRects(rows, paletteOverrides);
  const baseId = config.baseId || 'brendan_emerald';
  const base = getTrainerBase(baseId);

  // Dynamic glow according to equipped aura
  const auraClass = config.aura
    ? config.aura.includes('frost')
      ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]'
      : config.aura.includes('pyre')
      ? 'drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]'
      : 'drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
    : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]';

  // Dynamic posture transform: commanding stance or victory cheer
  const postureTransform =
    posture === 'commanding'
      ? 'scale-105 -rotate-1'
      : posture === 'cheering'
      ? '-translate-y-1 scale-105'
      : '';

  // Visible diagnostic error display if an unregistered or missing asset was requested
  if (!validation.valid) {
    return (
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center p-0.5 bg-red-950/90 border border-red-500 rounded text-center select-none ${className}`}
        title={`[SPRITE ASSET ERROR]\n${validation.errors.join('\n')}`}
      >
        <svg
          viewBox="0 0 16 24"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ shapeRendering: 'crispEdges' }}
          role="img"
          aria-label="Sprite Asset Error"
        >
          {rects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-0 bg-red-600/90 text-white font-pixel text-[6px] truncate px-0.5">
          ERR: ASSET MISSING
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      aria-label={`${base.name} overworld sprite`}
    >
      {/* Ground Shadow Ellipse */}
      <div className="absolute bottom-0 w-3/4 h-2 rounded-full bg-black/40 blur-[0.5px] pointer-events-none -z-10" />

      {/* Discrete 16x24 GBA Pixel Grid SVG */}
      <svg
        viewBox="0 0 16 24"
        preserveAspectRatio="xMidYMid meet"
        className={`w-full h-full select-none transition-transform duration-150 ${auraClass} ${postureTransform}`}
        style={{ shapeRendering: 'crispEdges' }}
        role="img"
        aria-label={`${base.name} overworld sprite`}
      >
        {rects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill={r.fill}
          />
        ))}
      </svg>
    </div>
  );
};

export const MiniTrainerSVG = React.memo(MiniTrainerSVGComponent, (prev, next) => {
  if (prev.posture !== next.posture) return false;
  if (prev.className !== next.className) return false;
  if (prev.paletteOverrides !== next.paletteOverrides) return false;
  const p = prev.config;
  const n = next.config;
  if (p === n) return true;
  if (!p || !n) return false;
  return (
    p.baseId === n.baseId &&
    p.head === n.head &&
    p.outfit === n.outfit &&
    p.backpack === n.backpack &&
    p.shoes === n.shoes &&
    p.badge === n.badge &&
    p.aura === n.aura
  );
});

