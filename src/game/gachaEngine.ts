/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CosmeticItem, UserCosmeticInventory, CosmeticRarity, TrainerBaseId } from './types';
import { COSMETIC_CARDS_CATALOG } from './constants';

const STORAGE_KEY = 'battle_red_gacha_inventory_v1';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_USER_INVENTORY: UserCosmeticInventory = {
  unlockedCardIds: [
    'card_frame_prismatic',
    'card_frame_gold_scroll',
    'card_brendan_cap',
    'card_brendan_emerald_cap',
    'card_brendan_emerald_suit',
    'card_red_vintage_cap',
    'card_leaf_sunhat',
    'card_adventurer_rucksack',
    'card_emerald_runners',
    'card_red_running_shoes',
    'card_kanto_rainbow_brooch',
    'card_ball_premier',
    'card_flare_manga',
    'card_shiny_star',
  ],
  equippedTrainer: {
    baseId: 'brendan_emerald',
    head: 'card_brendan_emerald_cap',
    outfit: 'card_brendan_emerald_suit',
    backpack: 'card_adventurer_rucksack',
    shoes: 'card_emerald_runners',
    badge: 'card_kanto_rainbow_brooch',
    aura: undefined,
  },
  equippedPokemon: {
    Lucario: {
      titleCard: 'card_frame_prismatic',
      aura: 'card_shiny_star',
    },
    Milotic: {
      titleCard: 'card_frame_gold_scroll',
    },
  },
  activeTitleCard: 'card_frame_prismatic',
  ballEffect: 'card_ball_premier',
  screenFlare: 'card_flare_manga',
  stardust: 150,
  availablePacks: 3, // 3 welcome packs for new players!
  lastDailyClaimTime: 0,
  streakDays: 1,
};

/**
 * Loads inventory from localStorage or provides defaults.
 * Automatically sanitizes stale legacy keys and ensures clean held-item mapping.
 */
export function loadUserInventory(): UserCosmeticInventory {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_USER_INVENTORY;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_INVENTORY;
    const parsed = JSON.parse(raw);
    const merged: UserCosmeticInventory = { ...DEFAULT_USER_INVENTORY, ...parsed };

    if (!merged.equippedTrainer) {
      merged.equippedTrainer = DEFAULT_USER_INVENTORY.equippedTrainer;
    } else if (!merged.equippedTrainer.baseId) {
      merged.equippedTrainer.baseId = 'brendan_emerald';
    }

    // Sanitize legacy 'All Pokémon' or invalid entries
    if (merged.equippedPokemon) {
      if ((merged.equippedPokemon as Record<string, unknown>)['All Pokémon']) {
        delete (merged.equippedPokemon as Record<string, unknown>)['All Pokémon'];
      }
    }

    return merged;
  } catch {
    return DEFAULT_USER_INVENTORY;
  }
}

/**
 * Saves inventory to localStorage
 */
export function saveUserInventory(inventory: UserCosmeticInventory): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  } catch (err) {
    console.error('Failed to save inventory to localStorage', err);
  }
}

/**
 * Calculates remaining milliseconds until next free daily pack claim
 */
export function getDailyPackCooldown(lastClaimTime: number): {
  isAvailable: boolean;
  remainingMs: number;
  formattedTime: string;
} {
  const now = Date.now();
  const nextClaimTime = lastClaimTime + TWENTY_FOUR_HOURS_MS;
  const diff = nextClaimTime - now;

  if (diff <= 0 || lastClaimTime === 0) {
    return {
      isAvailable: true,
      remainingMs: 0,
      formattedTime: 'Ready Now!',
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = `${hours.toString().padStart(2, '0')}h ${minutes
    .toString()
    .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

  return {
    isAvailable: false,
    remainingMs: diff,
    formattedTime: formatted,
  };
}

/**
 * Claims daily free pack, updating streak and available packs
 */
export function claimDailyPack(inventory: UserCosmeticInventory): {
  success: boolean;
  updatedInventory: UserCosmeticInventory;
  packsAdded: number;
  message: string;
} {
  const { isAvailable } = getDailyPackCooldown(inventory.lastDailyClaimTime);
  if (!isAvailable) {
    return {
      success: false,
      updatedInventory: inventory,
      packsAdded: 0,
      message: 'Daily booster pack is still on cooldown.',
    };
  }

  const now = Date.now();
  // Check streak: if claimed within 48 hours, increment; otherwise reset to 1
  const isConsecutive = now - inventory.lastDailyClaimTime < TWENTY_FOUR_HOURS_MS * 2;
  const newStreak = isConsecutive ? inventory.streakDays + 1 : 1;
  const bonusPacks = newStreak % 7 === 0 ? 3 : 1; // 7-day streak bonus!

  const updated: UserCosmeticInventory = {
    ...inventory,
    availablePacks: inventory.availablePacks + bonusPacks,
    lastDailyClaimTime: now,
    streakDays: newStreak,
    stardust: inventory.stardust + 50, // Daily login stardust bonus
  };

  saveUserInventory(updated);
  return {
    success: true,
    updatedInventory: updated,
    packsAdded: bonusPacks,
    message: `Claimed ${bonusPacks} Free Booster Pack${bonusPacks > 1 ? 's' : ''}! Day ${newStreak} Streak! (+50 Stardust)`,
  };
}

export interface PackPullResult {
  card: CosmeticItem;
  isNew: boolean;
  duplicateDust: number;
}

/**
 * Pulls a random card based on rarity weight distribution
 */
export function pullRandomCard(): CosmeticItem {
  const roll = Math.random() * 100;
  let targetRarity: CosmeticRarity;

  if (roll < 1.5) {
    targetRarity = 'Secret Rare';
  } else if (roll < 5.5) {
    targetRarity = 'Legendary';
  } else if (roll < 17.5) {
    targetRarity = 'Epic';
  } else if (roll < 45.0) {
    targetRarity = 'Rare';
  } else {
    targetRarity = 'Common';
  }

  const matchingPool = COSMETIC_CARDS_CATALOG.filter(c => c.rarity === targetRarity);
  if (matchingPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchingPool.length);
    return matchingPool[randomIndex];
  }

  // Fallback to random in whole catalog
  return COSMETIC_CARDS_CATALOG[Math.floor(Math.random() * COSMETIC_CARDS_CATALOG.length)];
}

/**
 * Opens a 3-card Booster Pack with duplicate dust compensation
 */
export function openBoosterPack(inventory: UserCosmeticInventory): {
  success: boolean;
  pulls: PackPullResult[];
  updatedInventory: UserCosmeticInventory;
  message?: string;
} {
  if (inventory.availablePacks <= 0) {
    return {
      success: false,
      pulls: [],
      updatedInventory: inventory,
      message: 'No booster packs available. Wait for your daily free spin or win a summit battle!',
    };
  }

  const pulls: PackPullResult[] = [];
  const nextUnlocked = new Set(inventory.unlockedCardIds);
  let dustGained = 0;

  for (let i = 0; i < 3; i++) {
    const card = pullRandomCard();
    const isNew = !nextUnlocked.has(card.id);

    let dupDust = 0;
    if (isNew) {
      nextUnlocked.add(card.id);
    } else {
      // Duplicate dust scale by rarity
      switch (card.rarity) {
        case 'Secret Rare': dupDust = 300; break;
        case 'Legendary': dupDust = 150; break;
        case 'Epic': dupDust = 75; break;
        case 'Rare': dupDust = 35; break;
        default: dupDust = 15; break;
      }
      dustGained += dupDust;
    }

    pulls.push({ card, isNew, duplicateDust: dupDust });
  }

  const updated: UserCosmeticInventory = {
    ...inventory,
    availablePacks: inventory.availablePacks - 1,
    unlockedCardIds: Array.from(nextUnlocked),
    stardust: inventory.stardust + dustGained,
  };

  saveUserInventory(updated);
  return {
    success: true,
    pulls,
    updatedInventory: updated,
  };
}

/**
 * Switches the active Gen 3 Trainer Base (Brendan Emerald, May Emerald, Brendan RS, May RS, Red FR, Leaf LG)
 */
export function equipTrainerBase(
  inventory: UserCosmeticInventory,
  baseId: TrainerBaseId
): UserCosmeticInventory {
  const nextInventory: UserCosmeticInventory = JSON.parse(JSON.stringify(inventory));
  nextInventory.equippedTrainer.baseId = baseId;
  saveUserInventory(nextInventory);
  return nextInventory;
}

/**
 * Equips a cosmetic to the Trainer or a specific Pokémon.
 * Ensures that if a held item was equipped on another Pokémon, it is cleanly transferred
 * so each unique held item is only equipped on one Pokémon at a time.
 */
export function equipCosmetic(
  inventory: UserCosmeticInventory,
  cardId: string,
  targetPokemonSpecies?: string
): UserCosmeticInventory {
  const card = COSMETIC_CARDS_CATALOG.find(c => c.id === cardId);
  if (!card) return inventory;

  const nextInventory: UserCosmeticInventory = JSON.parse(JSON.stringify(inventory));

  if (card.slot.startsWith('trainer_')) {
    if (card.slot === 'trainer_head') nextInventory.equippedTrainer.head = cardId;
    if (card.slot === 'trainer_outfit') nextInventory.equippedTrainer.outfit = cardId;
    if (card.slot === 'trainer_backpack') nextInventory.equippedTrainer.backpack = cardId;
    if (card.slot === 'trainer_shoes') nextInventory.equippedTrainer.shoes = cardId;
    if (card.slot === 'trainer_badge') nextInventory.equippedTrainer.badge = cardId;
    if (card.slot === 'trainer_aura') nextInventory.equippedTrainer.aura = cardId;
  } else if (card.slot === 'pokeball_effect') {
    nextInventory.ballEffect = cardId;
  } else if (card.slot === 'screen_flare') {
    nextInventory.screenFlare = cardId;
  } else {
    // Determine target species
    const species = (targetPokemonSpecies && targetPokemonSpecies !== 'All Pokémon')
      ? targetPokemonSpecies
      : (card.wearableOn !== 'All Pokémon' && card.wearableOn !== 'Trainer')
        ? card.wearableOn
        : Object.keys(nextInventory.equippedPokemon)[0] || 'Lucario';

    // 1. Cleanly transfer: unequip this card from ANY other Pokémon currently holding it
    Object.keys(nextInventory.equippedPokemon).forEach(otherSpecies => {
      if (otherSpecies !== species) {
        if (nextInventory.equippedPokemon[otherSpecies]?.titleCard === cardId) {
          nextInventory.equippedPokemon[otherSpecies].titleCard = undefined;
        }
        if (nextInventory.equippedPokemon[otherSpecies]?.aura === cardId) {
          nextInventory.equippedPokemon[otherSpecies].aura = undefined;
        }
      }
    });

    // 2. Equip to the target Pokémon
    if (!nextInventory.equippedPokemon[species]) {
      nextInventory.equippedPokemon[species] = {};
    }
    if (card.slot === 'title_card') {
      nextInventory.equippedPokemon[species].titleCard = cardId;
      nextInventory.activeTitleCard = cardId;
    } else if (card.slot === 'pokemon_aura') {
      nextInventory.equippedPokemon[species].aura = cardId;
    }
  }

  saveUserInventory(nextInventory);
  return nextInventory;
}

/**
 * Unequips a cosmetic from the Trainer, Pokémon, or Battle settings.
 */
export function unequipCosmetic(
  inventory: UserCosmeticInventory,
  cardId: string,
  targetPokemonSpecies?: string
): UserCosmeticInventory {
  const card = COSMETIC_CARDS_CATALOG.find(c => c.id === cardId);
  if (!card) return inventory;

  const nextInventory: UserCosmeticInventory = JSON.parse(JSON.stringify(inventory));

  if (card.slot.startsWith('trainer_')) {
    if (card.slot === 'trainer_head' && nextInventory.equippedTrainer.head === cardId) nextInventory.equippedTrainer.head = undefined;
    if (card.slot === 'trainer_outfit' && nextInventory.equippedTrainer.outfit === cardId) nextInventory.equippedTrainer.outfit = undefined;
    if (card.slot === 'trainer_backpack' && nextInventory.equippedTrainer.backpack === cardId) nextInventory.equippedTrainer.backpack = undefined;
    if (card.slot === 'trainer_shoes' && nextInventory.equippedTrainer.shoes === cardId) nextInventory.equippedTrainer.shoes = undefined;
    if (card.slot === 'trainer_badge' && nextInventory.equippedTrainer.badge === cardId) nextInventory.equippedTrainer.badge = undefined;
    if (card.slot === 'trainer_aura' && nextInventory.equippedTrainer.aura === cardId) nextInventory.equippedTrainer.aura = undefined;
  } else if (card.slot === 'pokeball_effect') {
    if (nextInventory.ballEffect === cardId) nextInventory.ballEffect = undefined;
  } else if (card.slot === 'screen_flare') {
    if (nextInventory.screenFlare === cardId) nextInventory.screenFlare = undefined;
  } else {
    // Clear from target species
    if (targetPokemonSpecies && nextInventory.equippedPokemon[targetPokemonSpecies]) {
      if (nextInventory.equippedPokemon[targetPokemonSpecies].titleCard === cardId) {
        nextInventory.equippedPokemon[targetPokemonSpecies].titleCard = undefined;
      }
      if (nextInventory.equippedPokemon[targetPokemonSpecies].aura === cardId) {
        nextInventory.equippedPokemon[targetPokemonSpecies].aura = undefined;
      }
    }
    // Also clear everywhere else this item may be registered
    Object.keys(nextInventory.equippedPokemon).forEach(species => {
      if (nextInventory.equippedPokemon[species]?.titleCard === cardId) {
        nextInventory.equippedPokemon[species].titleCard = undefined;
      }
      if (nextInventory.equippedPokemon[species]?.aura === cardId) {
        nextInventory.equippedPokemon[species].aura = undefined;
      }
    });
    if (nextInventory.activeTitleCard === cardId) {
      nextInventory.activeTitleCard = undefined;
    }
  }

  saveUserInventory(nextInventory);
  return nextInventory;
}

