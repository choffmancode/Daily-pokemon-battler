/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PokemonType } from '../types';

// Standard Gen 3-9 Type Chart
export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string; border: string }> = {
  Normal: { bg: 'bg-stone-500', text: 'text-stone-100', border: 'border-stone-400' },
  Fire: { bg: 'bg-orange-600', text: 'text-orange-50', border: 'border-orange-500' },
  Water: { bg: 'bg-blue-600', text: 'text-blue-50', border: 'border-blue-400' },
  Electric: { bg: 'bg-amber-400', text: 'text-amber-950', border: 'border-amber-300' },
  Grass: { bg: 'bg-emerald-600', text: 'text-emerald-50', border: 'border-emerald-400' },
  Ice: { bg: 'bg-cyan-400', text: 'text-cyan-950', border: 'border-cyan-300' },
  Fighting: { bg: 'bg-red-700', text: 'text-red-50', border: 'border-red-500' },
  Poison: { bg: 'bg-purple-600', text: 'text-purple-50', border: 'border-purple-400' },
  Ground: { bg: 'bg-amber-700', text: 'text-amber-100', border: 'border-amber-600' },
  Flying: { bg: 'bg-indigo-400', text: 'text-indigo-950', border: 'border-indigo-300' },
  Psychic: { bg: 'bg-pink-600', text: 'text-pink-50', border: 'border-pink-400' },
  Bug: { bg: 'bg-lime-600', text: 'text-lime-50', border: 'border-lime-400' },
  Rock: { bg: 'bg-stone-600', text: 'text-stone-100', border: 'border-stone-500' },
  Ghost: { bg: 'bg-violet-800', text: 'text-violet-100', border: 'border-violet-600' },
  Dragon: { bg: 'bg-indigo-700', text: 'text-indigo-50', border: 'border-indigo-500' },
  Steel: { bg: 'bg-slate-400', text: 'text-slate-900', border: 'border-slate-300' },
  Dark: { bg: 'bg-zinc-800', text: 'text-zinc-100', border: 'border-zinc-700' },
  Fairy: { bg: 'bg-pink-400', text: 'text-pink-950', border: 'border-pink-300' },
};

// Official Sprite CDN from PokeAPI (clean, high quality, free)
export const getSpriteUrl = (dexNumber: number, back = false): string => {
  if (back) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${dexNumber}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexNumber}.png`;
};

export const getAnimatedSpriteUrl = (dexNumber: number, back = false): string => {
  if (back) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${dexNumber}.gif`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${dexNumber}.gif`;
};

// Official Ken Sugimori Gen 1-3 2000s watercolor artwork
export const getOfficialArtworkUrl = (dexNumber: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`;
};

// Generation 3 GBA (Emerald / FireRed) pixel sprites
export const getGen3SpriteUrl = (dexNumber: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${dexNumber}.png`;
};
