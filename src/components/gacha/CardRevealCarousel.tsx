/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Sparkles, Eye, Check, ShieldAlert, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CosmeticItem, CosmeticRarity, UserCosmeticInventory } from '../../game/types';
import { PackPullResult } from '../../game/gachaEngine';
import { soundFX } from '../AudioEngine';
import { haptics } from '../../audio/useHaptics';
import { Gen3ItemSprite } from '../common/Gen3ItemSprite';

export const RARITY_COLORS: Record<
  CosmeticRarity,
  { border: string; badge: string; text: string; bg: string; holoClass: string }
> = {
  Common: {
    border: 'border-slate-600',
    badge: 'bg-slate-700 text-slate-200',
    text: 'text-slate-300',
    bg: 'from-slate-900 to-slate-950',
    holoClass: '',
  },
  Rare: {
    border: 'border-blue-500',
    badge: 'bg-blue-600 text-white',
    text: 'text-blue-400',
    bg: 'from-blue-950/60 to-slate-950',
    holoClass: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  },
  Epic: {
    border: 'border-purple-500',
    badge: 'bg-purple-600 text-white',
    text: 'text-purple-400',
    bg: 'from-purple-950/60 to-slate-950',
    holoClass: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  },
  Legendary: {
    border: 'border-amber-400',
    badge: 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black',
    text: 'text-amber-400',
    bg: 'from-amber-950/50 via-slate-900 to-rose-950/40',
    holoClass: 'shadow-[0_0_25px_rgba(251,191,36,0.5)] ring-1 ring-amber-400/50',
  },
  'Secret Rare': {
    border: 'border-rose-400',
    badge: 'bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 text-white font-black',
    text: 'text-rose-400',
    bg: 'from-rose-950/60 via-purple-950/40 to-slate-950',
    holoClass: 'shadow-[0_0_30px_rgba(244,63,94,0.6)] ring-2 ring-rose-400/80 animate-pulse',
  },
};

interface CardRevealCarouselProps {
  revealedCards: PackPullResult[];
  flippedIndices: Set<number>;
  justEquippedId: string | null;
  inventory: UserCosmeticInventory;
  onFlipCard: (idx: number, card: CosmeticItem) => void;
  onEquipCard: (card: CosmeticItem) => void;
  onOpenAnother: (isAdminBypass?: boolean) => void;
  onResetToIdle: () => void;
  onClose: () => void;
}

export const CardRevealCarousel: React.FC<CardRevealCarouselProps> = ({
  revealedCards,
  flippedIndices,
  justEquippedId,
  inventory,
  onFlipCard,
  onEquipCard,
  onOpenAnother,
  onResetToIdle,
  onClose,
}) => {
  const [inspectingIndex, setInspectingIndex] = useState<number | null>(null);

  // Navigate between inspecting cards
  const handleNextInspect = useCallback(() => {
    if (inspectingIndex === null || revealedCards.length === 0) return;
    const next = (inspectingIndex + 1) % revealedCards.length;
    setInspectingIndex(next);
    soundFX.playSelect();
    haptics.tap();
  }, [inspectingIndex, revealedCards.length]);

  const handlePrevInspect = useCallback(() => {
    if (inspectingIndex === null || revealedCards.length === 0) return;
    const prev = (inspectingIndex - 1 + revealedCards.length) % revealedCards.length;
    setInspectingIndex(prev);
    soundFX.playSelect();
    haptics.tap();
  }, [inspectingIndex, revealedCards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inspectingIndex !== null) {
        if (e.key === 'ArrowRight') handleNextInspect();
        if (e.key === 'ArrowLeft') handlePrevInspect();
        if (e.key === 'Escape') setInspectingIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectingIndex, handleNextInspect, handlePrevInspect]);

  const inspectingCard = inspectingIndex !== null ? revealedCards[inspectingIndex]?.card : null;

  return (
    <div>
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-bold text-amber-400 font-pixel uppercase tracking-wider">
          Tap cards to reveal your cosmetics!
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Flip cards to reveal · Click any card to inspect high-definition 3D details
        </p>

        {flippedIndices.size < revealedCards.length && (
          <button
            onClick={() => {
              revealedCards.forEach((pull, idx) => {
                if (!flippedIndices.has(idx)) {
                  onFlipCard(idx, pull.card);
                }
              });
            }}
            className="pkmn-btn pkmn-btn-gold px-4 py-1.5 text-[10px] mt-2 inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>REVEAL ALL CARDS</span>
          </button>
        )}
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {revealedCards.map((pull, idx) => {
          const isFlipped = flippedIndices.has(idx);
          const card = pull.card;
          const rarityStyle = RARITY_COLORS[card.rarity] || RARITY_COLORS.Common;
          const isEquipped = justEquippedId === card.id;

          return (
            <div
              key={`${card.id}_${idx}`}
              onClick={() => {
                if (!isFlipped) {
                  onFlipCard(idx, card);
                } else {
                  soundFX.playSelect();
                  haptics.tap();
                  setInspectingIndex(idx);
                }
              }}
              className="relative cursor-pointer min-h-[390px] flex flex-col transition-transform hover:-translate-y-1"
            >
              {!isFlipped ? (
                /* Card Back View */
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border-2 border-blue-400/40 p-4 flex flex-col items-center justify-between shadow-xl">
                  <div className="w-full text-right text-[10px] font-mono-code text-amber-300">
                    DAILY CYNTHIA TCG · PACK CARD #{idx + 1}
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400/50 bg-slate-950 flex items-center justify-center shadow-lg">
                    <Package className="w-10 h-10 text-amber-400 animate-bounce" />
                  </div>
                  <div className="text-xs font-bold text-amber-300 font-mono-code flex items-center gap-1">
                    <span>TAP TO FLIP</span>
                    <span>✦</span>
                  </div>
                </div>
              ) : (
                /* Card Front View (Tangible 3D Item Showcase) */
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-b ${rarityStyle.bg} border-2 ${rarityStyle.border} p-3.5 sm:p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden pattern-artdeco-lines ${rarityStyle.holoClass}`}
                >
                  {/* Ukiyo-e Wave Watermark */}
                  <div className="absolute inset-0 pattern-seigaiha opacity-20 pointer-events-none" />

                  {/* Top Header Row */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-code text-[11px] text-slate-400">
                          #{card.cardNumber}
                        </span>
                        {card.kanjiSeal && (
                          <span className="w-5 h-5 rounded border border-rose-500 bg-rose-950/80 text-rose-300 font-ukiyoe font-bold text-[10px] flex items-center justify-center shadow-sm">
                            {card.kanjiSeal}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap ${rarityStyle.badge}`}
                      >
                        {card.rarity}
                      </span>
                    </div>

                    <div className="font-bold font-artdeco text-white text-sm sm:text-base leading-snug truncate">
                      {card.name}
                    </div>

                    {/* Where to Wear Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-[10px] sm:text-[11px] font-medium text-emerald-300 mt-1">
                      <span>Wearable:</span>
                      <strong className="text-white whitespace-nowrap">{card.wearableOn}</strong>
                    </div>
                  </div>

                  {/* 3D Tangible Item Showcase Frame */}
                  <div className="relative z-10 my-2 p-2 rounded-xl bg-slate-950/90 border border-amber-500/40 flex flex-col items-center justify-center text-center overflow-hidden min-h-[125px] shadow-inner">
                    <div className="w-20 h-20 rounded-xl overflow-hidden mb-1 flex items-center justify-center bg-gradient-to-b from-stone-900 to-slate-950 border border-amber-500/30 shadow-inner relative">
                      <Gen3ItemSprite spriteId={card.previewGraphic} size={54} showPedestal={true} />
                    </div>
                    <div className="text-[11px] font-semibold text-amber-200/90 font-mono-code">
                      {card.slotLabel}
                    </div>
                  </div>

                  {/* Card Description */}
                  <div className="relative z-10 text-[11px] text-slate-300 leading-snug">
                    <p className="line-clamp-2">{card.description}</p>
                  </div>

                  {/* Bottom Actions: New vs Dust + Inspect + Instant Equip */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap relative z-10">
                    <div className="flex items-center gap-1.5">
                      {pull.isNew ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold whitespace-nowrap">
                          ✨ NEW!
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code font-bold whitespace-nowrap">
                          +{pull.duplicateDust} Dust
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFX.playSelect();
                          haptics.tap();
                          setInspectingIndex(idx);
                        }}
                        title="Inspect 3D Tangible Item Codex"
                        className="p-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition border border-slate-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        haptics.tap();
                        onEquipCard(card);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        isEquipped
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>EQUIPPED</span>
                        </>
                      ) : (
                        <span>EQUIP</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Post-reveal Action Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xs font-mono-code text-slate-400">
          Stardust Balance:{' '}
          <strong className="text-cyan-400 tabular-nums">{inventory.stardust}</strong>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Admin Button to Open Another Pack Anytime */}
          <button
            onClick={() => {
              haptics.tap();
              onOpenAnother(true);
            }}
            className="pkmn-btn pkmn-btn-red px-3 py-2 text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer"
            title="Admin Bypass: Open another pack immediately (infinite supply)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-300" />
            <span>ADMIN: FREE OPEN</span>
          </button>

          {inventory.availablePacks > 0 && (
            <button
              onClick={() => {
                haptics.tap();
                onOpenAnother(false);
              }}
              className="pkmn-btn pkmn-btn-gold px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-slate-950" />
              <span>OPEN ANOTHER ({inventory.availablePacks} LEFT)</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFX.playSelect();
              haptics.tap();
              onResetToIdle();
              onClose();
            }}
            className="pkmn-btn bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 px-4 py-2 text-xs cursor-pointer"
          >
            DONE [B]
          </button>
        </div>
      </div>

      {/* Navigable Card Inspection Modal */}
      {inspectingCard && inspectingIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl relative">
            <button
              onClick={() => setInspectingIndex(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={handlePrevInspect}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-0.5 text-[10px] font-pixel cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREV</span>
              </button>
              <span className="text-[10px] font-mono-code text-amber-300 font-bold">
                CARD {inspectingIndex + 1} OF {revealedCards.length}
              </span>
              <button
                onClick={handleNextInspect}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-0.5 text-[10px] font-pixel cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center mb-3">
              <span className="text-[10px] font-mono-code text-slate-400">
                #{inspectingCard.cardNumber} · {inspectingCard.rarity}
              </span>
              <h4 className="text-base font-artdeco font-bold text-white mt-0.5">
                {inspectingCard.name}
              </h4>
            </div>

            {/* Tangible 3D Item Showcase */}
            <div className="w-28 h-28 mx-auto rounded-xl bg-slate-950 border border-amber-500/50 p-2 flex items-center justify-center mb-3 shadow-inner">
              <Gen3ItemSprite spriteId={inspectingCard.previewGraphic} size={76} showPedestal={true} />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 text-xs leading-relaxed text-slate-300 mb-3 border border-slate-800">
              <div className="font-semibold text-amber-400 mb-1">Item Details:</div>
              <p>{inspectingCard.description}</p>
              {inspectingCard.flavorText && (
                <p className="mt-2 text-slate-400 italic text-[11px] border-t border-slate-800/80 pt-1.5">
                  "{inspectingCard.flavorText}"
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEquipCard(inspectingCard);
                  soundFX.playSelect();
                  haptics.tap();
                }}
                className="flex-1 py-2 rounded-xl pkmn-btn-blue text-white font-bold text-xs cursor-pointer shadow"
              >
                Equip This Item
              </button>
              <button
                onClick={() => setInspectingIndex(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
