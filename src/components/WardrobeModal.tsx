/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useDeferredValue, startTransition } from 'react';
import {
  X,
  Sparkles,
  Check,
  Shirt,
  User,
  Lock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Layers,
  Search,
  Play,
  Zap,
  Shield,
  Crown,
  Flame,
  Droplets,
  RotateCcw,
  Backpack,
  Footprints,
  Compass,
} from 'lucide-react';
import { soundFX } from './AudioEngine';
import { haptics } from '../audio/useHaptics';
import { UserCosmeticInventory, CosmeticItem, TeamPreset, Pokemon, TrainerBaseId } from '../game/types';
import { COSMETIC_CARDS_CATALOG, BEGINNER_TEAMS } from '../game/constants';
import { equipCosmetic, unequipCosmetic, saveUserInventory, equipTrainerBase } from '../game/gachaEngine';
import {
  TRAINER_BASES_LIST,
  getTrainerBase,
  MiniTrainerSVG,
  PRESET_TRAINER_BUILDS,
  PresetTrainerBuild,
} from '../game/data/trainerRegistry';
import { Gen3ItemSprite } from './common/Gen3ItemSprite';
import { PokemonCosmeticLayer } from './battle/BattleCosmetics';
import { TrainerBattleSprite } from './battle/TrainerBattleSprite';
import { PokeballEntranceVFX } from './battle/PokeballEntranceVFX';
import { ScreenFlareVFX } from './battle/ScreenFlareVFX';

// O(1) in-memory lookup map for all catalog cosmetic items
const COSMETIC_MAP = new Map(COSMETIC_CARDS_CATALOG.map((c) => [c.id, c]));

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: UserCosmeticInventory;
  onInventoryUpdate: (updated: UserCosmeticInventory) => void;
  selectedTeam?: TeamPreset;
}

type CatalogCategory =
  | 'all'
  | 'trainer'
  | 'hats'
  | 'shirts'
  | 'backpacks'
  | 'shoes'
  | 'badges'
  | 'pokemon'
  | 'battle_fx'
  | 'equipped';
type DressingRoomTab = 'trainer' | 'pokemon' | 'battle_fx';
type MobileViewMode = 'catalog' | 'mirror';

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onInventoryUpdate,
  selectedTeam,
}) => {
  // Mobile mode: browse catalog vs full dressing mirror
  const [mobileMode, setMobileMode] = useState<MobileViewMode>('catalog');

  // Dressing room stage tab
  const [dressingTab, setDressingTab] = useState<DressingRoomTab>('trainer');

  // Category filter
  const [category, setCategory] = useState<CatalogCategory>('all');

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rarity filter
  const [rarityFilter, setRarityFilter] = useState<'all' | 'Legendary' | 'Epic' | 'Rare' | 'Common'>('all');

  // Active squad Pokémon list
  const teamPokemonList: Pokemon[] = useMemo(() => {
    return selectedTeam && selectedTeam.team.length > 0
      ? selectedTeam.team
      : BEGINNER_TEAMS[0].team;
  }, [selectedTeam]);

  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState<number>(0);
  const activePokemon = teamPokemonList[selectedPokemonIndex] || teamPokemonList[0];

  // Currently inspected card
  const [selectedCardId, setSelectedCardId] = useState<string>(() => {
    return COSMETIC_CARDS_CATALOG[0].id;
  });

  // Battle FX test triggers
  const [ballPreviewKey, setBallPreviewKey] = useState<number>(1);
  const [isFlareTestActive, setIsFlareTestActive] = useState<boolean>(false);

  // Unlocked items set
  const unlockedSet = useMemo(() => new Set(inventory.unlockedCardIds), [inventory.unlockedCardIds]);

  // Filtered card list
  const filteredCards = useMemo(() => {
    return COSMETIC_CARDS_CATALOG.filter((card) => {
      // Category filter
      if (category === 'trainer') {
        if (!card.slot.startsWith('trainer_')) return false;
      } else if (category === 'hats') {
        if (card.slot !== 'trainer_head') return false;
      } else if (category === 'shirts') {
        if (card.slot !== 'trainer_outfit') return false;
      } else if (category === 'backpacks') {
        if (card.slot !== 'trainer_backpack') return false;
      } else if (category === 'shoes') {
        if (card.slot !== 'trainer_shoes') return false;
      } else if (category === 'badges') {
        if (card.slot !== 'trainer_badge' && card.slot !== 'trainer_aura') return false;
      } else if (category === 'pokemon') {
        if (card.slot !== 'pokemon_aura' && card.slot !== 'title_card') return false;
      } else if (category === 'battle_fx') {
        if (card.slot !== 'pokeball_effect' && card.slot !== 'screen_flare') return false;
      } else if (category === 'equipped') {
        const isEquippedTrainer =
          inventory.equippedTrainer.head === card.id ||
          inventory.equippedTrainer.outfit === card.id ||
          inventory.equippedTrainer.backpack === card.id ||
          inventory.equippedTrainer.shoes === card.id ||
          inventory.equippedTrainer.badge === card.id ||
          inventory.equippedTrainer.aura === card.id;

        const isEquippedPokemon = Object.values(inventory.equippedPokemon).some(
          (loadout) => loadout?.aura === card.id || loadout?.titleCard === card.id
        );

        const isEquippedGlobal =
          inventory.ballEffect === card.id ||
          inventory.screenFlare === card.id ||
          inventory.activeTitleCard === card.id;

        if (!isEquippedTrainer && !isEquippedPokemon && !isEquippedGlobal) return false;
      }

      // Rarity filter
      if (rarityFilter !== 'all') {
        if (rarityFilter === 'Legendary') {
          if (card.rarity !== 'Legendary' && card.rarity !== 'Secret Rare') return false;
        } else if (card.rarity !== rarityFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = card.name.toLowerCase().includes(q);
        const matchSlot = card.slotLabel.toLowerCase().includes(q);
        const matchWearable = card.wearableOn.toLowerCase().includes(q);
        const matchDesc = card.description.toLowerCase().includes(q);
        if (!matchName && !matchSlot && !matchWearable && !matchDesc) return false;
      }

      return true;
    });
  }, [category, rarityFilter, searchQuery, inventory]);

  // Keep selected card in bounds
  useEffect(() => {
    if (filteredCards.length > 0 && !filteredCards.some((c) => c.id === selectedCardId)) {
      setSelectedCardId(filteredCards[0].id);
    }
  }, [filteredCards, selectedCardId]);

  const activeCardIndex = useMemo(() => {
    const idx = filteredCards.findIndex((c) => c.id === selectedCardId);
    return idx >= 0 ? idx : 0;
  }, [filteredCards, selectedCardId]);

  const selectedCard = filteredCards[activeCardIndex] || filteredCards[0] || COSMETIC_CARDS_CATALOG[0];

  // Automatically sync dressing room tab with the inspected card's domain
  const handleSelectCard = useCallback((card: CosmeticItem) => {
    soundFX.playSelect();
    haptics.tap();
    startTransition(() => {
      setSelectedCardId(card.id);

      if (card.slot.startsWith('trainer_')) {
        setDressingTab('trainer');
      } else if (card.slot === 'pokemon_aura' || card.slot === 'title_card') {
        setDressingTab('pokemon');
      } else if (card.slot === 'pokeball_effect' || card.slot === 'screen_flare') {
        setDressingTab('battle_fx');
      }
    });
  }, []);

  const handleNextCard = useCallback(() => {
    if (filteredCards.length === 0) return;
    const nextIdx = (activeCardIndex + 1) % filteredCards.length;
    handleSelectCard(filteredCards[nextIdx]);
  }, [activeCardIndex, filteredCards, handleSelectCard]);

  const handlePrevCard = useCallback(() => {
    if (filteredCards.length === 0) return;
    const prevIdx = (activeCardIndex - 1 + filteredCards.length) % filteredCards.length;
    handleSelectCard(filteredCards[prevIdx]);
  }, [activeCardIndex, filteredCards, handleSelectCard]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextCard, handlePrevCard, onClose]);

  if (!isOpen) return null;

  // Active equipped items O(1) lookup
  const equippedTrainerHeadCard = COSMETIC_MAP.get(inventory.equippedTrainer.head || '');
  const equippedTrainerOutfitCard = COSMETIC_MAP.get(inventory.equippedTrainer.outfit || '');
  const equippedTrainerBackpackCard = COSMETIC_MAP.get(inventory.equippedTrainer.backpack || '');
  const equippedTrainerShoesCard = COSMETIC_MAP.get(inventory.equippedTrainer.shoes || '');
  const equippedTrainerBadgeCard = COSMETIC_MAP.get(inventory.equippedTrainer.badge || '');
  const equippedTrainerAuraCard = COSMETIC_MAP.get(inventory.equippedTrainer.aura || '');

  // Live posture switcher for previewing battle stances
  const [previewPosture, setPreviewPosture] = useState<'idle' | 'commanding' | 'cheering'>('commanding');

  const activeMonLoadout = inventory.equippedPokemon[activePokemon?.species] || {};
  const equippedPokemonAuraCard = activeMonLoadout.aura ? COSMETIC_MAP.get(activeMonLoadout.aura) : null;
  const equippedPokemonTitleCard = activeMonLoadout.titleCard ? COSMETIC_MAP.get(activeMonLoadout.titleCard) : null;

  const equippedBallEffectCard = inventory.ballEffect ? COSMETIC_MAP.get(inventory.ballEffect) : null;
  const equippedScreenFlareCard = inventory.screenFlare ? COSMETIC_MAP.get(inventory.screenFlare) : null;

  // Deferred card for responsive, non-blocking preview rendering
  const deferredCard = useDeferredValue(selectedCard);

  // High-performance speculative preview inventory without expensive deep cloning
  const previewInventory = useMemo<UserCosmeticInventory>(() => {
    if (!deferredCard) return inventory;

    const copy: UserCosmeticInventory = {
      ...inventory,
      equippedTrainer: { ...inventory.equippedTrainer },
      equippedPokemon: { ...inventory.equippedPokemon },
    };

    if (deferredCard.slot.startsWith('trainer_')) {
      if (deferredCard.slot === 'trainer_head') copy.equippedTrainer.head = deferredCard.id;
      else if (deferredCard.slot === 'trainer_outfit') copy.equippedTrainer.outfit = deferredCard.id;
      else if (deferredCard.slot === 'trainer_backpack') copy.equippedTrainer.backpack = deferredCard.id;
      else if (deferredCard.slot === 'trainer_shoes') copy.equippedTrainer.shoes = deferredCard.id;
      else if (deferredCard.slot === 'trainer_badge') copy.equippedTrainer.badge = deferredCard.id;
      else if (deferredCard.slot === 'trainer_aura') copy.equippedTrainer.aura = deferredCard.id;
    } else if (deferredCard.slot === 'pokemon_aura') {
      const sp = activePokemon?.species || 'Lucario';
      copy.equippedPokemon[sp] = { ...(copy.equippedPokemon[sp] || {}), aura: deferredCard.id };
    } else if (deferredCard.slot === 'title_card') {
      const sp = activePokemon?.species || 'Lucario';
      copy.equippedPokemon[sp] = { ...(copy.equippedPokemon[sp] || {}), titleCard: deferredCard.id };
      copy.activeTitleCard = deferredCard.id;
    } else if (deferredCard.slot === 'pokeball_effect') {
      copy.ballEffect = deferredCard.id;
    } else if (deferredCard.slot === 'screen_flare') {
      copy.screenFlare = deferredCard.id;
    }
    return copy;
  }, [inventory, deferredCard, activePokemon?.species]);

  // Active Trainer Base
  const activeTrainerBase = getTrainerBase(inventory.equippedTrainer.baseId);

  const handleSelectTrainerBase = (baseId: TrainerBaseId) => {
    soundFX.playSelect();
    haptics.tap();
    const updated = equipTrainerBase(inventory, baseId);
    onInventoryUpdate(updated);
  };

  // Equip handler
  const handleEquipItem = (card: CosmeticItem) => {
    soundFX.playSelect();
    haptics.tap();
    const updated = equipCosmetic(inventory, card.id, activePokemon.species);
    onInventoryUpdate(updated);
  };

  // Unequip handler
  const handleUnequipItem = (card: CosmeticItem) => {
    soundFX.playSelect();
    haptics.tap();
    const updated = unequipCosmetic(inventory, card.id, activePokemon.species);
    onInventoryUpdate(updated);
  };

  // Clear all trainer items
  const handleClearTrainer = () => {
    soundFX.playSelect();
    haptics.tap();
    const updated: UserCosmeticInventory = JSON.parse(JSON.stringify(inventory));
    updated.equippedTrainer = {
      baseId: inventory.equippedTrainer.baseId || 'brendan_emerald',
      head: undefined,
      outfit: undefined,
      backpack: undefined,
      shoes: undefined,
      badge: undefined,
      aura: undefined,
    };
    saveUserInventory(updated);
    onInventoryUpdate(updated);
  };

  // 1-Click Preset Trainer Custom Build
  const handleEquipPreset = (preset: PresetTrainerBuild) => {
    soundFX.playSelect();
    haptics.rareShimmer();
    const updated: UserCosmeticInventory = JSON.parse(JSON.stringify(inventory));
    updated.equippedTrainer = { ...preset.config };
    // Auto-unlock the preset pieces in inventory so they can be mixed & matched
    const presetCardIds = [
      preset.config.head,
      preset.config.outfit,
      preset.config.backpack,
      preset.config.shoes,
      preset.config.badge,
      preset.config.aura,
    ].filter(Boolean) as string[];
    presetCardIds.forEach((id) => {
      if (!updated.unlockedCardIds.includes(id)) {
        updated.unlockedCardIds.push(id);
      }
    });
    saveUserInventory(updated);
    onInventoryUpdate(updated);
  };

  // Clear active pokemon loadout
  const handleClearActivePokemon = () => {
    soundFX.playSelect();
    haptics.tap();
    const updated: UserCosmeticInventory = JSON.parse(JSON.stringify(inventory));
    if (updated.equippedPokemon[activePokemon.species]) {
      updated.equippedPokemon[activePokemon.species] = {};
    }
    saveUserInventory(updated);
    onInventoryUpdate(updated);
  };

  // Craft with stardust
  const handleCraftWithStardust = (card: CosmeticItem) => {
    const cost = card.rarity === 'Legendary' || card.rarity === 'Secret Rare'
      ? 200
      : card.rarity === 'Epic'
      ? 120
      : card.rarity === 'Rare'
      ? 70
      : 35;

    if (inventory.stardust < cost) return;

    soundFX.playSelect();
    haptics.rareShimmer();
    const updated: UserCosmeticInventory = {
      ...inventory,
      stardust: inventory.stardust - cost,
      unlockedCardIds: [...inventory.unlockedCardIds, card.id],
    };
    saveUserInventory(updated);
    onInventoryUpdate(updated);
  };

  // Helper to test screen flare in preview
  const handleTriggerTestFlare = () => {
    soundFX.playSelect();
    haptics.tap();
    setIsFlareTestActive(true);
    setTimeout(() => {
      setIsFlareTestActive(false);
    }, 900);
  };

  // Helper to test pokeball entrance
  const handleTriggerTestBall = () => {
    soundFX.playSelect();
    haptics.tap();
    setBallPreviewKey((k) => k + 1);
  };

  // Check if item is equipped
  const getItemEquippedStatus = (card: CosmeticItem) => {
    if (card.slot.startsWith('trainer_')) {
      const isEquipped =
        inventory.equippedTrainer.head === card.id ||
        inventory.equippedTrainer.outfit === card.id ||
        inventory.equippedTrainer.backpack === card.id ||
        inventory.equippedTrainer.shoes === card.id ||
        inventory.equippedTrainer.badge === card.id ||
        inventory.equippedTrainer.aura === card.id;
      return { isEquipped, location: isEquipped ? 'Trainer' : null };
    }

    if (card.slot === 'pokeball_effect') {
      const isEquipped = inventory.ballEffect === card.id;
      return { isEquipped, location: isEquipped ? 'Pokéball' : null };
    }

    if (card.slot === 'screen_flare') {
      const isEquipped = inventory.screenFlare === card.id;
      return { isEquipped, location: isEquipped ? 'Screen Flare' : null };
    }

    // Pokemon auras and title cards
    const currentMonHasIt =
      inventory.equippedPokemon[activePokemon?.species]?.aura === card.id ||
      inventory.equippedPokemon[activePokemon?.species]?.titleCard === card.id;

    if (currentMonHasIt) {
      return { isEquipped: true, location: activePokemon.species };
    }

    const otherMon = Object.entries(inventory.equippedPokemon).find(
      ([sp, loadout]) => (loadout?.aura === card.id || loadout?.titleCard === card.id) && sp !== activePokemon?.species
    )?.[0];

    if (otherMon) {
      return { isEquipped: false, otherHolder: otherMon };
    }

    return { isEquipped: false, location: null };
  };

  /* =========================================================================
   * RENDER: DRESSING ROOM STAGE (Left Column on Desktop, Mirror Tab on Mobile)
   * ========================================================================= */
  const renderDressingRoom = () => (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950/80 rounded-xl border border-slate-800 p-3 sm:p-4">
      {/* 1. Dressing Room Stage Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 mb-3 shrink-0">
        <button
          onClick={() => {
            soundFX.playSelect();
            setDressingTab('trainer');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-[10px] sm:text-xs font-pixel flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            dressingTab === 'trainer'
              ? 'pkmn-btn-blue text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>TRAINER</span>
        </button>

        <button
          onClick={() => {
            soundFX.playSelect();
            setDressingTab('pokemon');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-[10px] sm:text-xs font-pixel flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            dressingTab === 'pokemon'
              ? 'pkmn-btn-gold text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>SQUAD ({teamPokemonList.length})</span>
        </button>

        <button
          onClick={() => {
            soundFX.playSelect();
            setDressingTab('battle_fx');
          }}
          className={`flex-1 py-1.5 px-2 rounded text-[10px] sm:text-xs font-pixel flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            dressingTab === 'battle_fx'
              ? 'pkmn-btn-emerald text-white font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>BATTLE FX</span>
        </button>
      </div>

      {/* 2. Stage Display Area (Scrollable if screen height is constrained) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
        {/* --- TAB A: TRAINER AVATAR --- */}
        {dressingTab === 'trainer' && (
          <div className="flex flex-col gap-3">
            {/* 1. Gen 3 Protagonist Base Selector Roster */}
            <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-pixel text-slate-400">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <span>PROTAGONIST BASE</span>
                  <span className="text-[8px] text-slate-400 font-normal">(GEN 3 ROSTER)</span>
                </span>
                <span className="text-[9px] text-indigo-300 font-mono-code font-bold">
                  {activeTrainerBase.gameTitle}
                </span>
              </div>

              {/* 6 Protagonist Avatars Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {TRAINER_BASES_LIST.map((b) => {
                  const isSelected = (inventory.equippedTrainer.baseId || 'brendan_emerald') === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleSelectTrainerBase(b.id)}
                      className={`p-1.5 rounded-lg border text-left transition cursor-pointer flex flex-col items-center justify-center text-center relative group ${
                        isSelected
                          ? 'bg-indigo-950/90 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                          : 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="w-8 h-12 flex items-center justify-center overflow-hidden mb-0.5 filter drop-shadow group-hover:scale-110 transition-transform">
                        <MiniTrainerSVG
                          config={{
                            baseId: b.id,
                            head: b.defaultHeadItem,
                            outfit: b.defaultOutfitItem,
                            backpack: b.defaultBackpackItem,
                            shoes: b.defaultShoesItem,
                          }}
                          posture="idle"
                        />
                      </div>
                      <span className="text-[10px] font-pixel font-bold truncate max-w-full text-white">
                        {b.name.split(' (')[0]}
                      </span>
                      <span
                        className={`text-[7px] font-mono-code font-bold px-1 rounded mt-0.5 whitespace-nowrap ${
                          b.region === 'Hoenn' ? 'text-emerald-400' : 'text-blue-400'
                        }`}
                      >
                        {b.gameTitle.replace('Pokémon ', '')}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[8px] font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Stage Container */}
            <div className="relative w-full h-52 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/40 border-2 border-indigo-500/30 flex flex-col items-center justify-end pb-3 shadow-inner overflow-hidden shrink-0">
              {/* Stadium Spotlight Glow */}
              <div className="absolute top-0 w-3/4 h-24 bg-gradient-to-b from-indigo-500/10 via-amber-400/5 to-transparent blur-md pointer-events-none" />

              {/* Top Controls: Battle Pose Switcher */}
              <div className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 shadow">
                {(['idle', 'commanding', 'cheering'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      soundFX.playSelect();
                      haptics.tap();
                      setPreviewPosture(p);
                    }}
                    className={`px-2 py-0.5 rounded text-[8px] font-pixel transition cursor-pointer whitespace-nowrap ${
                      previewPosture === p
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p === 'idle' ? '🧍 IDLE' : p === 'commanding' ? '👉 COMMAND' : '🎉 CHEER'}
                  </button>
                ))}
              </div>

              {/* Pedestal Disc */}
              <div className="absolute bottom-2 w-40 h-7 rounded-full bg-slate-900 border-2 border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.25)] pointer-events-none" />

              {/* Live Animated Gen 3 Mini Trainer Figure */}
              <div className="relative z-10 scale-125 origin-bottom">
                <TrainerBattleSprite
                  previewTrainer={previewInventory.equippedTrainer}
                  size="lg"
                  isCommanding={previewPosture === 'commanding'}
                  isCheering={previewPosture === 'cheering'}
                />
              </div>

              {/* Live Preview Tag Indicator */}
              {selectedCard && selectedCard.slot.startsWith('trainer_') && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-indigo-500/90 text-white font-pixel text-[9px] shadow border border-indigo-300 flex items-center gap-1 z-20 whitespace-nowrap animate-pulse">
                  <span>TRYING: {selectedCard.name.split(' (')[0]}</span>
                </div>
              )}
            </div>

            {/* 1-Click Preset Custom Builds Bar */}
            <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-pixel text-slate-400">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-CLICK CUSTOM PRESET BUILDS</span>
                </span>
                <span className="text-[8px] text-slate-400">Full gear loadouts</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PRESET_TRAINER_BUILDS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleEquipPreset(preset)}
                    className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/60 text-left transition cursor-pointer flex items-center gap-2 group"
                    title={preset.description}
                  >
                    <div className="w-8 h-12 shrink-0 flex items-center justify-center overflow-hidden">
                      <MiniTrainerSVG config={preset.config} posture="idle" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-pixel text-amber-200 font-bold truncate group-hover:text-amber-300">
                        {preset.name.split(' (')[0]}
                      </div>
                      <div className="text-[7.5px] font-mono-code text-slate-400 truncate">
                        {preset.theme}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trainer Equipped Slots Header */}
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pt-1 border-t border-slate-800">
              <span className="font-bold text-indigo-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{activeTrainerBase.name.toUpperCase()} LOADOUT SLOTS</span>
              </span>
              {(equippedTrainerHeadCard ||
                equippedTrainerOutfitCard ||
                equippedTrainerBackpackCard ||
                equippedTrainerShoesCard ||
                equippedTrainerBadgeCard ||
                equippedTrainerAuraCard) && (
                <button
                  onClick={handleClearTrainer}
                  className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer underline"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Unequip All</span>
                </button>
              )}
            </div>

            {/* 6 Clean Trainer Slots (Hats, Shirts, Backpacks, Shoes, Badges, Auras) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {/* 1. Headwear Slot */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedTrainerHeadCard ? (
                      <Gen3ItemSprite spriteId={equippedTrainerHeadCard.previewGraphic} size={20} />
                    ) : (
                      <Crown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-slate-400 uppercase font-mono-code">Cool Hat</div>
                    <div className="font-semibold text-slate-200 truncate text-[11px]">
                      {equippedTrainerHeadCard
                        ? equippedTrainerHeadCard.name.split(' (')[0]
                        : `${activeTrainerBase.name.split(' (')[0]}’s Cap`}
                    </div>
                  </div>
                </div>
                {equippedTrainerHeadCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedTrainerHeadCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Headwear"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 2. Outfit / Shirt Slot */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedTrainerOutfitCard ? (
                      <Gen3ItemSprite spriteId={equippedTrainerOutfitCard.previewGraphic} size={20} />
                    ) : (
                      <Shirt className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-slate-400 uppercase font-mono-code">Shirt / Top</div>
                    <div className="font-semibold text-slate-200 truncate text-[11px]">
                      {equippedTrainerOutfitCard
                        ? equippedTrainerOutfitCard.name.split(' (')[0]
                        : `${activeTrainerBase.name.split(' (')[0]}’s Outfit`}
                    </div>
                  </div>
                </div>
                {equippedTrainerOutfitCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedTrainerOutfitCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Outfit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 3. Backpack Slot */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedTrainerBackpackCard ? (
                      <Gen3ItemSprite spriteId={equippedTrainerBackpackCard.previewGraphic} size={20} />
                    ) : (
                      <Backpack className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-blue-400 uppercase font-mono-code">Backpack / Gear</div>
                    <div className="font-semibold text-blue-200 truncate text-[11px]">
                      {equippedTrainerBackpackCard
                        ? equippedTrainerBackpackCard.name.split(' (')[0]
                        : 'No Backpack'}
                    </div>
                  </div>
                </div>
                {equippedTrainerBackpackCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedTrainerBackpackCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Backpack"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 4. Shoes Slot */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedTrainerShoesCard ? (
                      <Gen3ItemSprite spriteId={equippedTrainerShoesCard.previewGraphic} size={20} />
                    ) : (
                      <Footprints className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-rose-400 uppercase font-mono-code">Shoes / Runners</div>
                    <div className="font-semibold text-rose-200 truncate text-[11px]">
                      {equippedTrainerShoesCard
                        ? equippedTrainerShoesCard.name.split(' (')[0]
                        : 'Standard Shoes'}
                    </div>
                  </div>
                </div>
                {equippedTrainerShoesCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedTrainerShoesCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Shoes"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 5. Lapel Badge Slot */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedTrainerBadgeCard ? (
                      <Gen3ItemSprite spriteId={equippedTrainerBadgeCard.previewGraphic} size={20} />
                    ) : (
                      <Sparkles className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-amber-400 uppercase font-mono-code">Lapel Badge</div>
                    <div className="font-semibold text-amber-300 truncate text-[11px]">
                      {equippedTrainerBadgeCard ? equippedTrainerBadgeCard.name.split(' (')[0] : 'No Badge Pinned'}
                    </div>
                  </div>
                </div>
                {equippedTrainerBadgeCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedTrainerBadgeCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Lapel Badge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 6. Trainer Aura FX Slot */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedTrainerAuraCard ? (
                      <Gen3ItemSprite spriteId={equippedTrainerAuraCard.previewGraphic} size={20} />
                    ) : (
                      <Zap className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-cyan-400 uppercase font-mono-code">Trainer Aura FX</div>
                    <div className="font-semibold text-cyan-300 truncate text-[11px]">
                      {equippedTrainerAuraCard ? equippedTrainerAuraCard.name.split(' (')[0] : 'None'}
                    </div>
                  </div>
                </div>
                {equippedTrainerAuraCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedTrainerAuraCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Trainer Aura"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB B: POKÉMON SQUAD --- */}
        {dressingTab === 'pokemon' && (
          <div className="flex flex-col gap-3">
            {/* Squad Member Selector Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {teamPokemonList.map((mon, idx) => {
                const isSelected = selectedPokemonIndex === idx;
                const monLoadout = inventory.equippedPokemon[mon.species] || {};
                const hasItem = monLoadout.aura || monLoadout.titleCard;

                return (
                  <button
                    key={mon.id || mon.species}
                    onClick={() => {
                      soundFX.playSelect();
                      haptics.tap();
                      setSelectedPokemonIndex(idx);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-pixel transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'pkmn-btn-gold text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>{mon.species}</span>
                    {hasItem && <span className="text-[9px] text-amber-500 font-bold">★</span>}
                  </button>
                );
              })}
            </div>

            {/* Pokémon Stage Container */}
            <div className="relative w-full h-48 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/40 border-2 border-amber-500/30 flex flex-col items-center justify-center p-3 shadow-inner overflow-hidden shrink-0">
              {/* Stadium Turf Pedestal */}
              <div className="absolute bottom-3 w-40 h-8 rounded-full bg-emerald-900/60 border-2 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] pointer-events-none" />

              {/* Dynamic Pedestal Turf Aura Layer */}
              <PokemonCosmeticLayer
                pokemon={activePokemon}
                isOpponent={false}
                inventory={previewInventory}
              />

              {/* Animated Pokémon Sprite */}
              <img
                src={activePokemon.spriteFront}
                alt={activePokemon.species}
                className="w-24 h-24 object-contain filter drop-shadow-xl relative z-10 select-none pointer-events-none"
              />

              {/* Live Preview / Equipped Badge Tag */}
              {selectedCard && (selectedCard.slot === 'pokemon_aura' || selectedCard.slot === 'title_card') ? (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-pixel font-bold text-[9px] shadow border border-amber-300 flex items-center gap-1 z-20 whitespace-nowrap animate-pulse">
                  <span>TRYING: {selectedCard.name.split(' (')[0]}</span>
                </div>
              ) : null}
            </div>

            {/* Pokémon Equipped Slots Header */}
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pt-1 border-t border-slate-800">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <span>EQUIPPED ON {activePokemon.species.toUpperCase()}</span>
                <span className="text-[10px] text-emerald-400 font-normal">({activePokemon.types.join('/')})</span>
              </span>
              {(equippedPokemonAuraCard || equippedPokemonTitleCard) && (
                <button
                  onClick={handleClearActivePokemon}
                  className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer underline"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Unequip All</span>
                </button>
              )}
            </div>

            {/* 2 Clean Pokémon Slots */}
            <div className="grid grid-cols-1 gap-1.5">
              {/* Battle Turf Aura */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedPokemonAuraCard ? (
                      <Gen3ItemSprite spriteId={equippedPokemonAuraCard.previewGraphic} size={20} />
                    ) : (
                      <Sparkles className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-amber-400 uppercase font-mono-code">Turf Pedestal Aura</div>
                    <div className="font-semibold text-amber-300 truncate text-[11px]">
                      {equippedPokemonAuraCard ? equippedPokemonAuraCard.name.split(' (')[0] : 'No Aura Equipped'}
                    </div>
                  </div>
                </div>
                {equippedPokemonAuraCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedPokemonAuraCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Turf Aura"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* HP Title Card Frame */}
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {equippedPokemonTitleCard ? (
                      <Gen3ItemSprite spriteId={equippedPokemonTitleCard.previewGraphic} size={20} />
                    ) : (
                      <Shield className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[8px] text-cyan-400 uppercase font-mono-code">HP Title Card Frame</div>
                    <div className="font-semibold text-cyan-300 truncate text-[11px]">
                      {equippedPokemonTitleCard ? equippedPokemonTitleCard.name.split(' (')[0] : 'Standard HP Bar'}
                    </div>
                  </div>
                </div>
                {equippedPokemonTitleCard && (
                  <button
                    onClick={() => handleUnequipItem(equippedPokemonTitleCard)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Unequip Title Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB C: BATTLE FX (Pokéball & Screen Flare) --- */}
        {dressingTab === 'battle_fx' && (
          <div className="flex flex-col gap-3">
            {/* Pokéball Entrance Preview Card */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>POKÉBALL ENTRANCE ANIMATION</span>
                </span>
                <span className="text-[9px] text-slate-400 font-normal">Plays on Summon</span>
              </div>

              {/* Mini Preview Stage */}
              <div className="relative w-full h-28 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                <PokeballEntranceVFX inventory={previewInventory} triggerKey={ballPreviewKey} />
                <img
                  src={activePokemon.spriteFront}
                  alt={activePokemon.species}
                  className="w-16 h-16 object-contain z-10 select-none opacity-80"
                />
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="min-w-0 flex items-center gap-2">
                  {equippedBallEffectCard && (
                    <Gen3ItemSprite spriteId={equippedBallEffectCard.previewGraphic} size={18} />
                  )}
                  <span className="text-[11px] font-semibold text-slate-200 truncate">
                    {previewInventory.ballEffect
                      ? COSMETIC_CARDS_CATALOG.find((c) => c.id === previewInventory.ballEffect)?.name.split(' (')[0]
                      : 'Premier Ball Platinum Supernova'}
                  </span>
                </div>
                <button
                  onClick={handleTriggerTestBall}
                  className="px-2.5 py-1 rounded pkmn-btn-gold text-slate-950 font-pixel text-[9px] font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>TEST BURST</span>
                </button>
              </div>
            </div>

            {/* Combat Screen Flare Preview Card */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CRITICAL HIT SCREEN FLARE</span>
                </span>
                <span className="text-[9px] text-slate-400 font-normal">Flashes on Crits</span>
              </div>

              {/* Mini Screen Flare Stage */}
              <div className="relative w-full h-28 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                <ScreenFlareVFX inventory={previewInventory} isActive={isFlareTestActive} />
                <div className="text-center font-pixel text-xs text-slate-400 select-none">
                  {isFlareTestActive ? (
                    <span className="text-amber-300 animate-pulse font-bold">FLARE FLASHING!</span>
                  ) : (
                    <span>Click Test to Trigger</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="min-w-0 flex items-center gap-2">
                  {equippedScreenFlareCard && (
                    <Gen3ItemSprite spriteId={equippedScreenFlareCard.previewGraphic} size={18} />
                  )}
                  <span className="text-[11px] font-semibold text-slate-200 truncate">
                    {previewInventory.screenFlare
                      ? COSMETIC_CARDS_CATALOG.find((c) => c.id === previewInventory.screenFlare)?.name.split(' (')[0]
                      : 'Retro Manga Speedlines'}
                  </span>
                </div>
                <button
                  onClick={handleTriggerTestFlare}
                  className="px-2.5 py-1 rounded pkmn-btn-blue text-white font-pixel text-[9px] font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>TEST FLARE</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Back Shortcut */}
      <button
        onClick={() => {
          soundFX.playSelect();
          setMobileMode('catalog');
        }}
        className="md:hidden w-full py-2.5 rounded-xl pkmn-btn-blue text-xs font-pixel font-bold flex items-center justify-center gap-1.5 shadow mt-3 shrink-0 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>BACK TO ITEMS CATALOG</span>
      </button>
    </div>
  );

  /* =========================================================================
   * RENDER: CATALOG VIEW (Right Column on Desktop, Catalog Tab on Mobile)
   * ========================================================================= */
  const renderCatalogView = () => (
    <div className="flex flex-col h-full overflow-hidden min-h-0">
      {/* 1. Category Tabs & Stardust Header */}
      <div className="flex items-center justify-between gap-2 mb-2 shrink-0 flex-wrap">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'trainer', label: 'All Trainer' },
            { id: 'hats', label: 'Cool Hats' },
            { id: 'shirts', label: 'Shirts' },
            { id: 'backpacks', label: 'Backpacks' },
            { id: 'shoes', label: 'Shoes' },
            { id: 'badges', label: 'Badges' },
            { id: 'pokemon', label: 'Pokémon' },
            { id: 'battle_fx', label: 'Battle FX' },
            { id: 'equipped', label: 'Equipped' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playSelect();
                haptics.tap();
                setCategory(tab.id as CatalogCategory);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-pixel transition cursor-pointer whitespace-nowrap shrink-0 ${
                category === tab.id
                  ? 'pkmn-btn-blue text-white shadow-md font-bold'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stardust Dust Balance Pill */}
        <div className="text-[10px] sm:text-xs font-mono-code text-amber-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/40 whitespace-nowrap shrink-0 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold">{inventory.stardust} Dust</span>
        </div>
      </div>

      {/* 2. Secondary Filter Bar (Search + Rarity Filter Pills) */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, slots, or effects..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 font-pixel focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Rarity Selector */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {(['all', 'Legendary', 'Epic', 'Rare', 'Common'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                soundFX.playSelect();
                setRarityFilter(r);
              }}
              className={`px-2 py-1 rounded text-[9px] font-pixel transition cursor-pointer whitespace-nowrap ${
                rarityFilter === r
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cards Grid - Responsive, Non-Squished, Dedicated Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {filteredCards.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-slate-950/60 border border-slate-800">
            <Layers className="w-10 h-10 text-slate-400 mb-2" />
            <h3 className="font-pixel text-xs text-slate-300">NO COSMETICS FOUND</h3>
            <p className="text-[10px] text-slate-400 font-pixel mt-1">
              Try adjusting your search query or category filter.
            </p>
            <button
              onClick={() => {
                setCategory('all');
                setSearchQuery('');
                setRarityFilter('all');
              }}
              className="mt-3 px-3 py-1 rounded pkmn-btn-blue text-[10px] font-pixel font-bold"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-max content-start">
            {filteredCards.map((card) => {
              const isUnlocked = unlockedSet.has(card.id);
              const isSelected = card.id === selectedCardId;
              const { isEquipped, location, otherHolder } = getItemEquippedStatus(card);

              const craftCost = card.rarity === 'Legendary' || card.rarity === 'Secret Rare'
                ? 200
                : card.rarity === 'Epic'
                ? 120
                : card.rarity === 'Rare'
                ? 70
                : 35;
              const canCraft = inventory.stardust >= craftCost;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card)}
                  className={`rounded-xl border p-3 flex flex-col justify-between transition-all relative cursor-pointer shadow-md select-none min-h-[170px] ${
                    isSelected
                      ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-950/25 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                      : isUnlocked
                      ? isEquipped
                        ? 'border-emerald-500/70 bg-emerald-950/20 hover:border-emerald-400'
                        : otherHolder
                        ? 'border-amber-500/40 bg-slate-950/90 hover:border-amber-400'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-600'
                      : 'border-slate-800/80 bg-slate-950/40 opacity-75'
                  }`}
                >
                  <div>
                    {/* Top Card Info Bar */}
                    <div className="flex items-center justify-between text-[11px] mb-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-code text-slate-400 text-[10px]">#{card.cardNumber}</span>
                        {card.kanjiSeal && (
                          <span className="w-3.5 h-3.5 rounded border border-rose-500/80 bg-rose-950/80 text-rose-300 font-ukiyoe font-bold text-[8px] flex items-center justify-center shrink-0">
                            {card.kanjiSeal}
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[7px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold font-pixel whitespace-nowrap">
                            SELECTED
                          </span>
                        )}
                      </div>

                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[8px] whitespace-nowrap ${
                          card.rarity === 'Secret Rare'
                            ? 'bg-fuchsia-600 text-white'
                            : card.rarity === 'Legendary'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : card.rarity === 'Epic'
                            ? 'bg-purple-600 text-purple-100'
                            : card.rarity === 'Rare'
                            ? 'bg-blue-600 text-blue-100'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {card.rarity}
                      </span>
                    </div>

                    {/* Tangible 3D Item Showcase & Titles */}
                    <div className="flex items-start gap-2.5 my-1 shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center shrink-0 shadow-inner">
                        <Gen3ItemSprite spriteId={card.previewGraphic} size={32} showPedestal={true} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold font-artdeco text-white text-xs sm:text-sm leading-snug line-clamp-1">
                          {card.name.split(' (')[0]}
                        </h4>
                        <div className="text-[9px] text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                          <span>Wearable:</span>
                          <strong className="text-white whitespace-nowrap">{card.wearableOn}</strong>
                        </div>
                        <div className="text-[8px] text-slate-400 font-mono-code truncate">
                          {card.slotLabel}
                        </div>
                      </div>
                    </div>

                    {/* Card Description Snippet */}
                    <p className="text-[10px] text-slate-300 mt-1 mb-2 leading-tight line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between shrink-0 mt-auto">
                    {isUnlocked ? (
                      isEquipped ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnequipItem(card);
                          }}
                          className="w-full py-1.5 px-2 text-[10px] rounded pkmn-btn-emerald font-pixel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span className="whitespace-nowrap">EQUIPPED · UNEQUIP</span>
                        </button>
                      ) : otherHolder ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipItem(card);
                          }}
                          className="w-full py-1.5 px-2 text-[10px] rounded pkmn-btn-gold text-slate-950 font-pixel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
                        >
                          <span className="whitespace-nowrap">TRANSFER FROM {otherHolder.toUpperCase()}</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipItem(card);
                          }}
                          className="w-full py-1.5 px-2 text-[10px] rounded pkmn-btn-blue font-pixel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
                        >
                          <span className="whitespace-nowrap">
                            {card.slot.startsWith('trainer_')
                              ? 'EQUIP TO TRAINER'
                              : card.slot === 'pokeball_effect'
                              ? 'SET BALL EFFECT'
                              : card.slot === 'screen_flare'
                              ? 'SET SCREEN FLARE'
                              : `EQUIP TO ${activePokemon.species.toUpperCase()}`}
                          </span>
                        </button>
                      )
                    ) : (
                      <div className="w-full flex items-center justify-between gap-2">
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 font-pixel whitespace-nowrap">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>LOCKED</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCraftWithStardust(card);
                          }}
                          disabled={!canCraft}
                          className={`px-3 py-1.5 text-[10px] font-pixel rounded transition whitespace-nowrap cursor-pointer ${
                            canCraft
                              ? 'pkmn-btn-gold text-slate-950 font-bold shadow'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          CRAFT ({craftCost} DUST)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Sticky Inspection Pill (Quick Preview Shortcut) */}
      <div className="md:hidden pt-2 border-t border-slate-800 shrink-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Gen3ItemSprite spriteId={selectedCard.previewGraphic} size={22} />
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-white truncate font-pixel">
              {selectedCard.name.split(' (')[0]}
            </div>
            <div className="text-[8px] text-emerald-400 font-mono-code truncate">
              {selectedCard.slotLabel}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundFX.playSelect();
            setMobileMode('mirror');
          }}
          className="px-3 py-1.5 rounded-lg pkmn-btn-gold text-slate-950 font-pixel text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow"
        >
          <Eye className="w-3 h-3" />
          <span>VIEW IN MIRROR</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#081820]/95 gba-outer-wave gba-scanlines overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Cosmetics Wardrobe and Fitting Room"
    >
      <div className="relative z-10 w-full max-w-6xl h-[94dvh] sm:h-[90dvh] gba-frame-emerald p-3 sm:p-4 text-[#e0f8d0] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#306850] mb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="gba-hanko-seal text-[10px] px-1.5 py-0.5 font-bold shrink-0">装</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="gba-title-text text-[13px] sm:text-[16px] font-bold text-[#e0f8d0] uppercase tracking-wider">
                  ◇ COLLECTION &amp; FITTING ROOM ◇
                </h2>
                <span className="font-pixel text-[7px] px-2 py-0.5 bg-[#081820] text-[#88c070] border border-[#88c070] whitespace-nowrap">
                  {inventory.unlockedCardIds.length}/{COSMETIC_CARDS_CATALOG.length} UNLOCKED
                </span>
              </div>
              <p className="hidden sm:block font-pixel text-[7.5px] text-[#88c070] mt-0.5 uppercase">
                CUSTOMIZE YOUR GEN 3 TRAINER AVATAR, POKÉMON AURAS &amp; COMBAT FLARES
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              onClose();
            }}
            aria-label="Close Wardrobe"
            className="gba-select-btn px-2.5 py-1 font-pixel text-[8px] cursor-pointer shrink-0"
          >
            [BACK]
          </button>
        </div>

        {/* Mobile View Switcher (Browse Items vs Dressing Mirror) */}
        <div className="md:hidden grid grid-cols-2 gap-1.5 mb-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setMobileMode('catalog');
            }}
            className={`py-1.5 gba-title-text text-[10px] font-bold border-2 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mobileMode === 'catalog'
                ? 'bg-[#e0f8d0] text-[#081820] border-[#88c070]'
                : 'bg-[#081820] text-[#88c070] border-[#306850]'
            }`}
          >
            <span>▶ CATALOG ({filteredCards.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              setMobileMode('mirror');
            }}
            className={`py-1.5 gba-title-text text-[10px] font-bold border-2 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mobileMode === 'mirror'
                ? 'bg-[#e0f8d0] text-[#081820] border-[#88c070]'
                : 'bg-[#081820] text-[#88c070] border-[#306850]'
            }`}
          >
            <span>▶ DRESSING MIRROR</span>
          </button>
        </div>

        {/* Main Content Area: Responsive 2-Pane on Desktop / Single Pane on Mobile */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Desktop Layout: Side-by-Side 12-Column Grid */}
          <div className="hidden md:grid grid-cols-12 gap-4 h-full overflow-hidden">
            {/* Left 5 Cols: Dressing Room Showcase */}
            <div className="col-span-5 h-full overflow-hidden">
              {renderDressingRoom()}
            </div>
            {/* Right 7 Cols: Card Catalog Grid & Filters */}
            <div className="col-span-7 h-full overflow-hidden">
              {renderCatalogView()}
            </div>
          </div>

          {/* Mobile Layout: Active Tab Pane */}
          <div className="md:hidden h-full overflow-hidden">
            {mobileMode === 'catalog' ? renderCatalogView() : renderDressingRoom()}
          </div>
        </div>
      </div>
    </div>
  );
};
