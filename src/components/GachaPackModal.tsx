/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, startTransition } from 'react';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CosmeticItem, UserCosmeticInventory } from '../game/types';
import { claimDailyPack, openBoosterPack, equipCosmetic, getDailyPackCooldown, PackPullResult } from '../game/gachaEngine';
import { soundFX } from './AudioEngine';
import { haptics } from '../audio/useHaptics';
import { BoosterPack3D } from './gacha/BoosterPack3D';
import { PackAdminToolbar } from './gacha/PackAdminToolbar';
import { TeamPreset } from '../game/types';
import { CardRevealCarousel } from './gacha/CardRevealCarousel';

interface GachaPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: UserCosmeticInventory;
  onInventoryUpdate: (inventory: UserCosmeticInventory) => void;
  selectedTeam?: TeamPreset;
}

export const GachaPackModal: React.FC<GachaPackModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onInventoryUpdate,
  selectedTeam,
}) => {
  const [packStage, setPackStage] = useState<'idle' | 'tearing' | 'revealed'>('idle');
  const [revealedCards, setRevealedCards] = useState<PackPullResult[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [cooldown, setCooldown] = useState(() => getDailyPackCooldown(inventory.lastDailyClaimTime));
  const [justEquippedId, setJustEquippedId] = useState<string | null>(null);

  // Update cooldown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown(getDailyPackCooldown(inventory.lastDailyClaimTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [inventory.lastDailyClaimTime]);

  if (!isOpen) return null;

  // Claim Daily Free Pack
  const handleClaimDaily = () => {
    const result = claimDailyPack(inventory);
    if (result.success && result.updatedInventory) {
      soundFX.playPackTear();
      haptics.packTear();
      onInventoryUpdate(result.updatedInventory);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  // Open Booster Pack (with Admin Bypass support)
  const handleOpenPack = (isAdminBypass: boolean = false) => {
    let currentInventory = inventory;
    if (isAdminBypass && currentInventory.availablePacks <= 0) {
      currentInventory = {
        ...currentInventory,
        availablePacks: 1,
      };
    }

    if (currentInventory.availablePacks <= 0) return;

    soundFX.playPackTear();
    haptics.packTear();
    setPackStage('tearing');

    setTimeout(() => {
      const result = openBoosterPack(currentInventory);
      if (result.success) {
        startTransition(() => {
          setRevealedCards(result.pulls);
          setFlippedIndices(new Set());
          setPackStage('revealed');
          onInventoryUpdate(result.updatedInventory);
        });

        const hasHighTier = result.pulls.some(
          (p) => p.card.rarity === 'Legendary' || p.card.rarity === 'Secret Rare'
        );
        if (hasHighTier) {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#ec4899', '#6366f1', '#e11d48'],
          });
          soundFX.playVictoryFanfare();
          haptics.rareShimmer();
        }
      }
    }, 700);
  };

  // Admin Controls: Add Packs
  const handleAdminAddPacks = (count: number = 5) => {
    const updated: UserCosmeticInventory = {
      ...inventory,
      availablePacks: inventory.availablePacks + count,
    };
    onInventoryUpdate(updated);
    soundFX.playSelect();
    haptics.tap();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  // Admin Controls: Reset Cooldown
  const handleAdminResetCooldown = () => {
    const updated: UserCosmeticInventory = {
      ...inventory,
      lastDailyClaimTime: 0,
    };
    onInventoryUpdate(updated);
    setCooldown({ isAvailable: true, remainingMs: 0, formattedTime: 'Ready Now!' });
    soundFX.playSelect();
    haptics.tap();
  };

  // Flip Card Handler
  const handleFlipCard = (index: number, card: CosmeticItem) => {
    if (flippedIndices.has(index)) return;
    const isRare =
      card.rarity === 'Epic' || card.rarity === 'Legendary' || card.rarity === 'Secret Rare';
    soundFX.playCardFlip(isRare);
    if (isRare) haptics.rareShimmer();
    else haptics.tap();

    setFlippedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Equip Cosmetic Handler
  const handleEquipCard = (card: CosmeticItem) => {
    const targetSpecies = selectedTeam?.team?.[0]?.species || 'Lucario';
    const updated = equipCosmetic(inventory, card.id, targetSpecies);
    onInventoryUpdate(updated);
    setJustEquippedId(card.id);
    soundFX.playSelect();
    haptics.tap();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl p-4 sm:p-6 rounded-2xl pkmn-frame-dark shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded pkmn-btn-gold flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-pixel">
                POKÉMON BOOSTER PACKS
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-pixel mt-0.5">
                Collect & Equip Rare TCG Gear & Regalia
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playSelect();
              haptics.tap();
              onClose();
              setPackStage('idle');
            }}
            aria-label="Close Packs Modal"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Stage: Booster Pack or Revealed Cards */}
        {packStage === 'idle' || packStage === 'tearing' ? (
          <div>
            <BoosterPack3D
              packStage={packStage}
              inventory={inventory}
              cooldown={cooldown}
              onOpenPack={handleOpenPack}
              onClaimDaily={handleClaimDaily}
            />

            <div className="flex flex-col items-center">
              <PackAdminToolbar
                onAddPacks={handleAdminAddPacks}
                onResetCooldown={handleAdminResetCooldown}
                onOpenAnytime={() => handleOpenPack(true)}
              />
              <p className="text-xs text-slate-400 mt-2 text-center">
                Daily free packs refresh every 24h. Use Admin Controls to open booster packs whenever you want!
              </p>
            </div>
          </div>
        ) : (
          <CardRevealCarousel
            revealedCards={revealedCards}
            flippedIndices={flippedIndices}
            justEquippedId={justEquippedId}
            inventory={inventory}
            onFlipCard={handleFlipCard}
            onEquipCard={handleEquipCard}
            onOpenAnother={handleOpenPack}
            onResetToIdle={() => setPackStage('idle')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};
