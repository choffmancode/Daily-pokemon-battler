/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { UserCosmeticInventory, Pokemon } from '../../game/types';
import { COSMETIC_CARDS_CATALOG } from '../../game/data/cosmetics';
import { Gen3ItemSprite } from '../common/Gen3ItemSprite';

interface BattleCosmeticsProps {
  pokemon: Pokemon;
  isOpponent: boolean;
  inventory: UserCosmeticInventory;
}

// O(1) in-memory catalog lookup
const COSMETIC_MAP = new Map(COSMETIC_CARDS_CATALOG.map((c) => [c.id, c]));

/**
 * Renders Battle Ground Pedestal Auras, Sparkles & Held Item badges on the stadium platform.
 * Replaces awkward pinned sprite clothing with authentic field auras and platform sparkles.
 */
const PokemonCosmeticLayerComponent: React.FC<BattleCosmeticsProps> = ({
  pokemon,
  isOpponent,
  inventory,
}) => {
  // Opponents do not render player's equipped inventory items
  if (isOpponent) return null;

  const equipped = inventory.equippedPokemon[pokemon.species] || {};

  const titleCardItem = equipped.titleCard ? COSMETIC_MAP.get(equipped.titleCard) : null;
  const auraItem = equipped.aura ? COSMETIC_MAP.get(equipped.aura) : null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
      {/* 1. Dynamic Stadium Turf Field Aura */}
      {auraItem && (
        <div className="absolute inset-0 flex items-center justify-center">
          {auraItem.id === 'card_shiny_star' ? (
            /* Gen 3 Shiny 1-in-8192 Starburst Radiance */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-yellow-400/40 animate-ping opacity-30" />
              <div className="absolute -top-3 left-1/4 text-yellow-300 text-xs animate-bounce">✦</div>
              <div className="absolute -bottom-2 right-1/4 text-amber-300 text-sm animate-pulse">✦</div>
              <div className="absolute top-1/3 -right-2 text-cyan-300 text-xs animate-spin">✧</div>
              <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400/15 via-yellow-300/10 to-transparent blur-md pointer-events-none" />
            </div>
          ) : auraItem.id === 'card_dragon_flame' ? (
            /* Dragon Dance Ethereal Violet Flame */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full border border-purple-500/50 animate-spin" />
              <div className="absolute w-24 h-24 rounded-full bg-purple-600/20 blur-md animate-pulse" />
              <div className="absolute -top-2 left-2 text-purple-300 text-xs animate-bounce">🔥</div>
              <div className="absolute bottom-0 right-2 text-fuchsia-300 text-xs animate-bounce">🔥</div>
            </div>
          ) : auraItem.id === 'card_electric_field' ? (
            /* Electric Surge Electro-Field Sparks */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-32 h-14 rounded-full border-2 border-yellow-400/60 animate-pulse -bottom-1" />
              <div className="absolute -bottom-1 left-2 text-yellow-300 text-xs animate-ping">⚡</div>
              <div className="absolute -bottom-1 right-2 text-yellow-200 text-xs animate-ping">⚡</div>
            </div>
          ) : auraItem.id === 'card_mystic_current' ? (
            /* Deep Sea Mystic Current Orbs */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full bg-cyan-400/15 blur-md animate-pulse" />
              <div className="absolute -top-1 left-4 text-cyan-300 text-xs animate-bounce">💧</div>
              <div className="absolute top-2 right-3 text-sky-200 text-xs animate-spin">💧</div>
              <div className="absolute -bottom-1 left-1/3 w-2 h-2 rounded-full bg-white/70 animate-ping" />
            </div>
          ) : auraItem.id === 'card_psychic_nebula' ? (
            /* Psychic Nebula Gravitational Wave */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full border border-purple-400/40 animate-ping" />
              <div className="absolute w-28 h-28 rounded-full bg-fuchsia-950/30 blur-md" />
              <div className="absolute -top-2 right-4 text-pink-300 text-xs">✦</div>
            </div>
          ) : auraItem.id === 'card_aura_sakura' ? (
            /* Ethereal Sakura Spirit Cascade */
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full border border-pink-400/40 animate-spin" />
              <div className="absolute w-24 h-24 rounded-full bg-rose-500/15 blur-md animate-pulse" />
              <div className="absolute -top-2 left-2 text-pink-300 text-xs animate-bounce">🌸</div>
              <div className="absolute bottom-1 right-2 text-rose-300 text-xs animate-bounce">🌸</div>
              <div className="absolute top-2 right-4 text-amber-200 text-xs animate-ping">✧</div>
            </div>
          ) : (
            /* Generic Ambient Aura */
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/15 to-transparent blur-md animate-pulse" />
          )}
        </div>
      )}

      {/* 2. Platform Title Card Indicator */}
      {titleCardItem && (
        <div className="absolute -bottom-3 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/50 shadow-md text-[8px] font-pixel text-amber-300 z-30 pointer-events-auto">
          <Gen3ItemSprite spriteId={titleCardItem.previewGraphic} size={14} />
          <span className="truncate max-w-[70px]">{titleCardItem.name.split(' (')[0]}</span>
        </div>
      )}
    </div>
  );
};

export const PokemonCosmeticLayer = React.memo(PokemonCosmeticLayerComponent);

/**
 * Battlefield Ambient Weather & Stadium Aura Layer
 */
const BattleStageAuraLayerComponent: React.FC<{ inventory: UserCosmeticInventory }> = ({ inventory }) => {
  const auraId = inventory.equippedTrainer.aura;
  if (!auraId) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
      {/* Mt. Chimney Volcanic Ember Halo */}
      {auraId === 'card_ember_aura' && (
        <div className="absolute inset-0">
          <div className="absolute top-4 left-1/5 text-orange-400/50 text-xs animate-bounce">🔥</div>
          <div className="absolute top-16 right-1/4 text-amber-300/40 text-sm animate-pulse">✦</div>
          <div className="absolute bottom-20 left-1/3 text-orange-500/40 text-xs animate-ping">✦</div>
          <div className="absolute bottom-10 right-1/3 text-red-500/30 text-sm animate-bounce">🔥</div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-orange-950/25 to-transparent" />
        </div>
      )}

      {/* Sootopolis Raindrop Ripple Halo */}
      {auraId === 'card_raindrop_halo' && (
        <div className="absolute inset-0">
          <div className="absolute top-6 left-1/4 text-sky-300/50 text-xs animate-pulse">💧</div>
          <div className="absolute top-14 right-1/3 text-cyan-200/40 text-xs animate-bounce">💧</div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-12 rounded-full border border-sky-400/30 animate-ping" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sky-950/30 to-transparent" />
        </div>
      )}

      {/* Blizzard / Frostbound Scroll */}
      {(auraId === 'card_aura_blizzard' || auraId === 'card_blizzard_orb') && (
        <div className="absolute inset-0">
          <div className="absolute top-4 left-1/4 text-cyan-200/40 text-sm animate-pulse">❄️</div>
          <div className="absolute top-12 right-1/3 text-cyan-100/30 text-xs animate-bounce">❄️</div>
          <div className="absolute bottom-16 left-1/3 text-cyan-200/40 text-base animate-pulse">❄️</div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cyan-950/30 to-transparent" />
        </div>
      )}

      {/* Celestial Galaxy Star Chart */}
      {(auraId === 'card_aura_cosmic' || auraId === 'card_cosmic_orb') && (
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-amber-400/20 border-dashed animate-spin" />
          <div className="absolute top-1/4 left-1/3 text-amber-300/60 text-xs">✦</div>
          <div className="absolute bottom-1/4 right-1/4 text-amber-300/60 text-sm">✦</div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-purple-950/30 to-transparent" />
        </div>
      )}

      {/* Rayquaza Ozone Sky Dragon Streamers */}
      {auraId === 'card_rayquaza_ozone' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
          <div className="absolute bottom-16 right-1/4 w-40 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent animate-pulse" />
          <div className="absolute top-1/3 right-1/5 text-emerald-300/60 text-sm animate-bounce">⚡</div>
          <div className="absolute bottom-1/3 left-1/5 text-yellow-300/60 text-xs animate-ping">✦</div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-emerald-950/30 to-transparent" />
        </div>
      )}

      {/* Lavender Town Umbral Spirit Wisps */}
      {auraId === 'card_lavender_mist' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-1/3 text-purple-400/50 text-xs animate-bounce">🔥</div>
          <div className="absolute top-14 right-1/4 text-fuchsia-300/40 text-sm animate-pulse">🔥</div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 h-12 rounded-full border border-purple-500/25 animate-ping" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-purple-950/30 to-transparent" />
        </div>
      )}
    </div>
  );
};

export const BattleStageAuraLayer = React.memo(BattleStageAuraLayerComponent);

/**
 * Trainer Gilded Brooch / Badge Indicator for HUD Header
 */
const TrainerEquippedBadgeComponent: React.FC<{ inventory: UserCosmeticInventory }> = ({ inventory }) => {
  const badgeId = inventory.equippedTrainer.badge;
  if (!badgeId) return null;

  const item = COSMETIC_MAP.get(badgeId);
  if (!item) return null;

  return (
    <div
      title={`${item.name} (${item.rarity}) - ${item.description}`}
      className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-stone-900 border border-amber-400/60 text-amber-300 text-[8px] sm:text-[9px] font-artdeco font-bold shadow-md cursor-pointer hover:border-amber-300"
    >
      <ShieldCheck className="w-3 h-3 text-amber-300 shrink-0" />
      <span className="truncate max-w-[85px] xs:max-w-[120px]">{item.name}</span>
      {item.kanjiSeal && (
        <span className="font-ukiyoe text-[8px] text-amber-200 bg-stone-950/80 px-1 rounded border border-amber-500/40">
          {item.kanjiSeal}
        </span>
      )}
    </div>
  );
};

export const TrainerEquippedBadge = React.memo(TrainerEquippedBadgeComponent);
