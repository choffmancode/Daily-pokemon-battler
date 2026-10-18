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
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#081820]/95 gba-outer-wave gba-scanlines overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Pokémon Booster Packs"
    >
      <div className="w-full max-w-4xl p-3.5 sm:p-5 gba-frame-emerald shadow-2xl relative my-auto text-[#e0f8d0]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#306850] mb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="gba-hanko-seal text-[10px] px-1.5 py-0.5 font-bold shrink-0">包</span>
            <div className="min-w-0">
              <h2 className="gba-title-text text-[13px] sm:text-[15px] font-bold text-[#e0f8d0] tracking-wider uppercase whitespace-nowrap">
                ◇ BOOSTER PACKS ◇
              </h2>
              <p className="font-pixel text-[6.5px] sm:text-[7.5px] text-[#88c070] mt-0.5 uppercase truncate">
                PACKS: {inventory.availablePacks} • STARDUST: {inventory.stardust}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playSelect();
              haptics.tap();
              onClose();
              setPackStage('idle');
            }}
            aria-label="Close Packs Modal"
            className="gba-select-btn px-2.5 py-1 font-pixel text-[8px] cursor-pointer shrink-0"
          >
            [BACK]
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
              <p className="gba-title-text text-[9.5px] text-[#88c070] mt-2 text-center">
                Daily free packs refresh every 24h. Use Admin Controls to open booster packs anytime!
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

