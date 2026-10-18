/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type Gen3SpriteId =
  // Pokémon Universal Wearables
  | 'focus_band'
  | 'silk_scarf'
  | 'kings_rock'
  | 'leftovers_bell'
  | 'choice_scarf'
  | 'scope_lens'
  | 'black_glasses'
  | 'exp_share'
  | 'everstone'
  | 'miracle_seed'
  | 'charcoal'
  | 'mystic_water'
  | 'magnet'
  | 'soothe_bell'
  | 'shiny_star'
  | 'top_hat'
  | 'surfboard'
  | 'sakura_wreath'
  | 'astral_jewel'
  // Title Card HP Frames
  | 'frame_prismatic'
  | 'frame_gold_scroll'
  | 'frame_cyber_hud'
  | 'frame_dragon_crest'
  // Expanded Pokéball & Battle VFX
  | 'ball_heavy'
  | 'flare_comic_pow'
  | 'aura_sakura'
  | 'ball_premier'
  | 'ball_luxury'
  | 'ball_master'
  | 'ball_dusk'
  | 'ball_cherish'
  | 'ball_quick'
  | 'flare_manga'
  | 'flare_holo'
  | 'flare_lens'
  | 'dragon_flame'
  | 'electric_field'
  | 'mystic_current'
  | 'psychic_nebula'
  // Trainer Customization
  | 'brendan_cap'
  | 'may_bandana'
  | 'red_cap'
  | 'leaf_sunhat'
  | 'brendan_emerald_cap'
  | 'may_emerald_bandana'
  | 'brendan_emerald_suit'
  | 'may_emerald_tunic'
  | 'red_fr_vest'
  | 'leaf_lg_dress'
  | 'frontier_duster'
  | 'magma_uniform'
  | 'aqua_wetsuit'
  | 'pike_queen_tiara'
  | 'magma_cowl'
  | 'aqua_bandana'
  | 'kanto_rainbow_brooch'
  | 'silph_card_key'
  | 'pokedex_gold_pin'
  | 'rayquaza_ozone'
  | 'lavender_mist'
  | 'silph_visor'
  | 'devon_brooch'
  | 'badge_case'
  | 'frontier_symbol'
  | 'hoenn_jacket'
  | 'champion_mantle'
  | 'team_vest'
  | 'ember_aura'
  | 'raindrop_halo'
  | 'blizzard_orb'
  | 'cosmic_orb';

interface Gen3ItemSpriteProps {
  spriteId: Gen3SpriteId | string;
  size?: number;
  className?: string;
  title?: string;
  showPedestal?: boolean;
}

/**
 * High-Fidelity Tangible Pokémon Item Sprite
 * Rendered with volumetric 3D shading, realistic light sources, bevels,
 * specular reflections, and Game Boy Advance / Nintendo bag item proportions.
 */
export const Gen3ItemSprite: React.FC<Gen3ItemSpriteProps> = ({
  spriteId,
  size = 48,
  className = '',
  title,
  showPedestal = false,
}) => {
  const renderItemGraphic = () => {
    switch (spriteId) {
      // =====================================================================
      // 1. FOCUS BAND (気合いのハチマキ)
      // Volumetric woven warrior headband, coiled loop, knot, red martial stripes, gold pin
      // =====================================================================
      case 'focus_band':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Left trailing knot ribbon */}
            <path d="M12 28 C9 34 6 38 4 41 L8 42 C11 38 14 33 16 29 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="1" />
            <path d="M13 29 C11 34 8 38 6 41 L7.5 41.5 C10 38 12.5 33.5 14.5 29.5 Z" fill="#f8fafc" />
            {/* Right trailing knot ribbon */}
            <path d="M16 29 C14 36 12 40 10 44 L14 44 C16 39 18 35 19 30 Z" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />
            <path d="M16.5 30 C15 35 13 39 12 43 L13 43 C15 39 17 35 18 31 Z" fill="#dc2626" />

            {/* Back band curve (dark interior) */}
            <ellipse cx="25" cy="19" rx="14" ry="7" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.2" />
            <ellipse cx="25" cy="19" rx="12" ry="5.5" fill="#475569" />

            {/* Front thick band loop */}
            <path
              d="M11 20 C11 27 39 27 39 20 L39 24 C39 31 11 31 11 24 Z"
              fill="url(#focusBandGradient)"
              stroke="#0f172a"
              strokeWidth="1.4"
            />
            {/* Crimson martial twin stripes with curvature */}
            <path d="M11 22 C18 26 32 26 39 22 L39 23.5 C32 27.5 18 27.5 11 23.5 Z" fill="#dc2626" />
            <path d="M11 25.5 C18 29.5 32 29.5 39 25.5 L39 27 C32 31 18 31 11 27 Z" fill="#991b1b" />
            {/* Specular sheen on top white rim */}
            <path d="M13 20.8 C18 23.8 32 23.8 37 20.8" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.9" />

            {/* Central tied knot with gold emblem pin */}
            <circle cx="14" cy="24" r="5" fill="#dc2626" stroke="#450a0a" strokeWidth="1.2" />
            <circle cx="14" cy="24" r="3.2" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="0.8" />
            <circle cx="13" cy="23" r="1.2" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 2. SILK SCARF (絹のマフラー)
      // Flowing satiny crimson silk, deep shadow folds, specular sheen, 3D gold ring cinch
      // =====================================================================
      case 'silk_scarf':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="43" rx="14" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Trailing silk tails with graceful folds */}
            <path d="M20 25 C18 32 14 38 12 43 L18 42 C20 37 23 31 24 26 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="1" />
            <path d="M23 26 C24 33 27 38 31 43 L26 43 C23 38 21 32 21 26 Z" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
            {/* Silk Tail Highlights */}
            <path d="M15 34 C14 38 13 41 12.5 42" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M24 30 C26 35 28 39 30 42" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round" />

            {/* Draped Neck Collar Loop */}
            <ellipse cx="24" cy="18" rx="15" ry="9" fill="url(#silkScarfGradient)" stroke="#450a0a" strokeWidth="1.5" />
            <ellipse cx="24" cy="16" rx="10" ry="5.5" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
            <ellipse cx="24" cy="15" rx="7" ry="3" fill="#450a0a" />
            {/* Specular satin gleam on upper curve */}
            <path d="M12 17 C16 11 32 11 36 17" stroke="#fca5a5" strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* Heavy Gold Ring Cinch Clasp */}
            <rect x="18" y="22" width="12" height="7" rx="3" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.2" />
            <rect x="20" y="23.5" width="8" height="4" rx="1.5" fill="#fef08a" opacity="0.6" />
            <circle cx="21" cy="24" r="1" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 3. KING'S ROCK CROWN (王者の印)
      // Solid carved bedrock crown, 5 chiseled points, gold leaf, ruby & emeralds
      // =====================================================================
      case 'kings_rock':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.45)" />
            {/* Heavy Chiseled Bedrock Base */}
            <path
              d="M9 36 L39 36 L37 41 L11 41 Z"
              fill="url(#stoneBaseGradient)"
              stroke="#1e293b"
              strokeWidth="1.2"
            />
            {/* Crown Main Facets (5 Peaks) */}
            <path
              d="M8 36 L10 20 L16 26 L24 10 L32 26 L38 20 L40 36 Z"
              fill="url(#goldBevel)"
              stroke="#713f12"
              strokeWidth="1.5"
            />
            {/* Chiseled 3D Shadow Planes */}
            <path d="M24 10 L28 23 L24 36 L20 23 Z" fill="#ca8a04" />
            <path d="M10 20 L13 24 L16 26 L12 36 Z" fill="#a16207" opacity="0.7" />
            <path d="M38 20 L35 24 L32 26 L36 36 Z" fill="#eab308" opacity="0.9" />

            {/* Faceted Central Ruby Gem */}
            <polygon points="24,23 27,27 24,31 21,27" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
            <polygon points="24,24 26,27 24,30 22,27" fill="#ef4444" />
            <circle cx="23.5" cy="25.5" r="0.8" fill="#ffffff" />

            {/* Inset Emerald Jewels on Outer Battlements */}
            <circle cx="14" cy="29" r="2.2" fill="#059669" stroke="#064e3b" strokeWidth="0.8" />
            <circle cx="13.5" cy="28.5" r="0.7" fill="#6ee7b7" />
            <circle cx="34" cy="29" r="2.2" fill="#059669" stroke="#064e3b" strokeWidth="0.8" />
            <circle cx="33.5" cy="28.5" r="0.7" fill="#6ee7b7" />

            {/* Specular Star Glint on Center Peak */}
            <path d="M24 7 L25 9.5 L27.5 10.5 L25 11.5 L24 14 L23 11.5 L20.5 10.5 L23 9.5 Z" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 4. LEFTOVERS CHIME BELL (安らぎの残飯鈴)
      // Spherical cast-brass jingle bell, 3D sound slit, emerald clover ribbon bow
      // =====================================================================
      case 'leftovers_bell':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Green Clover Ribbon Bow */}
            <path d="M20 14 C14 8 10 12 16 17 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
            <path d="M28 14 C34 8 38 12 32 17 Z" fill="#22c55e" stroke="#14532d" strokeWidth="1" />
            <circle cx="24" cy="15" r="3" fill="#4ade80" stroke="#14532d" strokeWidth="1" />
            <circle cx="23" cy="14" r="1" fill="#ffffff" />

            {/* Spherical Cast-Brass Bell Body */}
            <circle cx="24" cy="28" r="13" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.5" />
            {/* Equatorial Engraved Rim */}
            <ellipse cx="24" cy="28" rx="13" ry="4" fill="none" stroke="#a16207" strokeWidth="1" />

            {/* 3D Sound Slit & Clapper Hole */}
            <path d="M14 31 Q24 27 34 31 Q24 33 14 31 Z" fill="#451a03" stroke="#291102" strokeWidth="0.8" />
            <circle cx="24" cy="31" r="2.5" fill="#291102" />
            <circle cx="24" cy="33.5" r="1.8" fill="#a16207" />

            {/* Spherical Specular Light Reflections */}
            <ellipse cx="19" cy="22" rx="4" ry="2.5" fill="#fef08a" opacity="0.8" transform="rotate(-25 19 22)" />
            <circle cx="17.5" cy="20.5" r="1.2" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 5. CHOICE SCARF (こだわりスカーフ)
      // Aerodynamic cobalt/cyan speed scarf, racing chevrons, fluttering tails
      // =====================================================================
      case 'choice_scarf':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="43" rx="15" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Dynamic trailing speed ribbons */}
            <path d="M19 26 C15 33 9 39 6 43 L13 41 C16 36 21 31 23 26 Z" fill="#0369a1" stroke="#082f49" strokeWidth="1" />
            <path d="M24 26 C26 34 32 39 38 43 L32 41 C27 36 24 31 23 26 Z" fill="#0284c7" stroke="#082f49" strokeWidth="1" />
            {/* Gold Racing Chevrons */}
            <polygon points="11,36 14,35 15,38 12,39" fill="#facc15" stroke="#713f12" strokeWidth="0.5" />
            <polygon points="30,36 33,35 34,38 31,39" fill="#facc15" stroke="#713f12" strokeWidth="0.5" />

            {/* Aerodynamic Collar Loop */}
            <ellipse cx="24" cy="18" rx="16" ry="9" fill="url(#choiceScarfGradient)" stroke="#082f49" strokeWidth="1.5" />
            <ellipse cx="24" cy="16" rx="10" ry="5.5" fill="#0f172a" />
            {/* Cyan Glint Line */}
            <path d="M11 18 C16 11 32 11 37 18" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Aerodynamic Speed Buckle */}
            <rect x="19" y="21" width="10" height="7" rx="2" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1" />
            <polygon points="22,24.5 25,23 25,26" fill="#082f49" />
            <polygon points="25,24.5 28,23 28,26" fill="#082f49" />
          </g>
        );

      // =====================================================================
      // 6. SCOPE LENS MONOCLE (ピントレンズ)
      // Brass-machined cylindrical eyepiece, glass lens refraction, red laser crosshair
      // =====================================================================
      case 'scope_lens':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Hanging chain */}
            <path d="M14 18 C8 24 9 36 15 41" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="2,2" />

            {/* Heavy Brass Outer Ring */}
            <circle cx="25" cy="24" r="14" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.6" />
            {/* Inner Dark Bezel */}
            <circle cx="25" cy="24" r="11" fill="#0f172a" stroke="#713f12" strokeWidth="1" />
            {/* Cyan Crystal Glass Lens */}
            <circle cx="25" cy="24" r="10" fill="url(#lensGlassGradient)" opacity="0.9" />

            {/* Precision Crosshairs */}
            <line x1="15" y1="24" x2="35" y2="24" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.8" />
            <line x1="25" y1="14" x2="25" y2="34" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.8" />
            {/* Red Targeting Diode */}
            <circle cx="25" cy="24" r="2" fill="#dc2626" stroke="#ffffff" strokeWidth="0.8" />

            {/* Curved Glass Highlight Specular Arc */}
            <path d="M18 19 A8 8 0 0 1 31 18" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8" />
            <ellipse cx="21" cy="21" rx="2" ry="1" fill="#ffffff" opacity="0.7" transform="rotate(-30 21 21)" />
          </g>
        );

      // =====================================================================
      // 7. BLACK GLASSES (黒いメガネ)
      // Glossy black acetate frame sunglasses, gradient smoke lenses, silver hinges
      // =====================================================================
      case 'black_glasses':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="38" rx="18" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Temples (Arms extending back) */}
            <path d="M5 22 L11 25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M43 22 L37 25" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

            {/* Acetate Frame Body */}
            <rect x="7" y="20" width="34" height="15" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1.2" />
            {/* Bridge */}
            <rect x="22" y="23" width="4" height="3" fill="#18181b" />

            {/* Left Dark Polarized Lens */}
            <rect x="9.5" y="22.5" width="13" height="10" rx="2.5" fill="url(#smokeLensGradient)" stroke="#09090b" strokeWidth="1" />
            {/* Right Dark Polarized Lens */}
            <rect x="25.5" y="22.5" width="13" height="10" rx="2.5" fill="url(#smokeLensGradient)" stroke="#09090b" strokeWidth="1" />

            {/* White Glare Specular Streaks (Gen 3 Swagger Glint!) */}
            <polygon points="12,24 15,24 10,31 8.5,31" fill="#ffffff" opacity="0.6" />
            <polygon points="28,24 31,24 26,31 24.5,31" fill="#ffffff" opacity="0.6" />

            {/* Silver Temple Screws */}
            <circle cx="8" cy="22" r="0.8" fill="#e2e8f0" />
            <circle cx="40" cy="22" r="0.8" fill="#e2e8f0" />
          </g>
        );

      // =====================================================================
      // 8. EXP SHARE CIRCLET (学習装置)
      // Silph Co. aerospace headset, dual antennas, pulsing cyan core
      // =====================================================================
      case 'exp_share':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="15" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Dual Transmission Antennas */}
            <line x1="16" y1="20" x2="10" y2="7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="7" r="2.5" fill="#06b6d4" stroke="#083344" strokeWidth="1" />
            <line x1="32" y1="20" x2="38" y2="7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="38" cy="7" r="2.5" fill="#06b6d4" stroke="#083344" strokeWidth="1" />

            {/* Silver Headband Tiara Arch */}
            <path d="M12 28 C12 16 36 16 36 28" fill="none" stroke="url(#silverBevel)" strokeWidth="4" strokeLinecap="round" />
            <path d="M12 28 C12 16 36 16 36 28" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

            {/* Central Silph Co. Broadcast Core */}
            <circle cx="24" cy="22" r="6.5" fill="url(#silverBevel)" stroke="#334155" strokeWidth="1.2" />
            <circle cx="24" cy="22" r="4.2" fill="#06b6d4" stroke="#0e7490" strokeWidth="1" />
            <circle cx="24" cy="22" r="2.2" fill="#a5f3fc" />
            {/* Green Power LED */}
            <circle cx="24" cy="30" r="1.5" fill="#22c55e" stroke="#14532d" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 9. EVERSTONE AMULET (変わらずの石)
      // Faceted obsidian geode, ancient runic spiral, sturdy leather cord
      // =====================================================================
      case 'everstone':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Hanging Cord */}
            <path d="M14 6 C20 14 28 14 34 6" fill="none" stroke="#78350f" strokeWidth="1.8" />

            {/* Faceted Volumetric Obsidian Pebble */}
            <path
              d="M17 14 L31 13 L37 22 L33 36 L15 36 L11 23 Z"
              fill="url(#obsidianGradient)"
              stroke="#09090b"
              strokeWidth="1.5"
            />
            {/* Crystalline Prismatic Facets */}
            <polygon points="17,14 24,19 19,25 11,23" fill="#3b0764" opacity="0.6" />
            <polygon points="31,13 37,22 30,27 24,19" fill="#1e1b4b" opacity="0.8" />
            <polygon points="24,19 30,27 24,34 19,25" fill="#581c87" opacity="0.7" />
            <polygon points="19,25 24,34 15,36" fill="#1e1b4b" opacity="0.9" />
            <polygon points="30,27 37,22 33,36 24,34" fill="#0f172a" opacity="0.9" />

            {/* Glowing Amethyst Runic Spiral */}
            <path
              d="M24 24 A3 3 0 0 1 26 27 A3 3 0 0 1 22 28 A1.5 1.5 0 0 1 23 25"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="18" r="0.9" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 10. MIRACLE SEED SPROUT (奇跡の種)
      // Glowing golden amber seed pod, twin fresh emerald sprout leaves, dew drops
      // =====================================================================
      case 'miracle_seed':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Left Fresh Green Sprout Leaf */}
            <path
              d="M24 22 C18 14 12 16 11 21 C15 23 20 23 24 22 Z"
              fill="url(#leafGreenGradient)"
              stroke="#14532d"
              strokeWidth="1.2"
            />
            {/* Right Fresh Green Sprout Leaf */}
            <path
              d="M24 22 C30 13 37 15 37 20 C33 23 28 23 24 22 Z"
              fill="#22c55e"
              stroke="#14532d"
              strokeWidth="1.2"
            />
            <path d="M24 22 C24 16 26 12 28 10" stroke="#86efac" strokeWidth="1" fill="none" />

            {/* Golden Amber Seed Pod */}
            <path
              d="M24 19 C31 23 33 33 24 40 C15 33 17 23 24 19 Z"
              fill="url(#seedAmberGradient)"
              stroke="#713f12"
              strokeWidth="1.5"
            />
            {/* Seed Highlight */}
            <ellipse cx="22" cy="27" rx="3.5" ry="6" fill="#fef08a" opacity="0.6" transform="rotate(-15 22 27)" />
            {/* Dewdrop sparkle */}
            <circle cx="16" cy="19" r="1.2" fill="#ffffff" />
            <circle cx="21" cy="25" r="1.5" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 11. CHARCOAL HEARTH EMBER (木炭)
      // Solid jagged volcanic coal chunk, glowing molten fissures, floating embers
      // =====================================================================
      case 'charcoal':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.45)" />
            {/* Volcanic Coal Rock Body */}
            <polygon
              points="14,15 27,11 36,17 38,30 33,39 15,39 10,28"
              fill="#18181b"
              stroke="#09090b"
              strokeWidth="1.5"
            />
            {/* 3D Chiseled Planes */}
            <polygon points="14,15 27,11 25,24 13,22" fill="#27272a" />
            <polygon points="27,11 36,17 33,26 25,24" fill="#3f3f46" />
            <polygon points="13,22 25,24 21,37 15,39 10,28" fill="#18181b" />
            <polygon points="25,24 33,26 38,30 33,39 21,37" fill="#09090b" />

            {/* Smoldering Lava Fissures (Glowing Red / Orange / Yellow) */}
            <path d="M16 23 Q22 27 27 22 Q31 29 34 32" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M16 23 Q22 27 27 22 Q31 29 34 32" stroke="#facc15" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M22 27 L20 35" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />

            {/* Rising Embers */}
            <circle cx="28" cy="8" r="1.5" fill="#facc15" />
            <circle cx="34" cy="11" r="1" fill="#f97316" />
            <circle cx="12" cy="12" r="1" fill="#ea580c" />
          </g>
        );

      // =====================================================================
      // 12. MYSTIC WATER TEARDROP (神秘の雫)
      // Translucent azure teardrop flask, silver filigree cap, inner bubbles
      // =====================================================================
      case 'mystic_water':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="13" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Silver Cap and Chain Ring */}
            <ellipse cx="24" cy="10" rx="3.5" ry="2" fill="none" stroke="url(#silverBevel)" strokeWidth="1.5" />
            <rect x="21" y="11" width="6" height="4" rx="1" fill="url(#silverBevel)" stroke="#334155" strokeWidth="1" />

            {/* Translucent Luminous Water Teardrop */}
            <path
              d="M24 14 C33 25 35 34 24 40 C13 34 15 25 24 14 Z"
              fill="url(#mysticWaterGradient)"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            {/* Inner Liquid Wave */}
            <path d="M16 29 Q24 33 32 29 C33 35 24 39 16 35 Z" fill="#0284c7" opacity="0.7" />

            {/* Aquatic Bubbles */}
            <circle cx="21" cy="32" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="26" cy="35" r="1" fill="#ffffff" opacity="0.6" />
            <circle cx="25" cy="27" r="0.8" fill="#ffffff" opacity="0.9" />

            {/* Glass Curvature Specular Highlight */}
            <path d="M19 22 C17 26 17 31 20 34" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9" />
          </g>
        );

      // =====================================================================
      // 13. MAGNET CLASP (磁石)
      // Solid red & blue horseshoe magnet, silver contact tips, electric sparks
      // =====================================================================
      case 'magnet':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Horseshoe Base Arch */}
            <path
              d="M10 28 L10 18 C10 9 38 9 38 18 L38 28 L30 28 L30 19 C30 15 18 15 18 19 L18 28 Z"
              fill="url(#magnetGradient)"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Left Silver Pole Cap (N) */}
            <rect x="10" y="28" width="8" height="8" rx="1" fill="url(#silverBevel)" stroke="#334155" strokeWidth="1.2" />
            {/* Right Silver Pole Cap (S) */}
            <rect x="30" y="28" width="8" height="8" rx="1" fill="url(#silverBevel)" stroke="#334155" strokeWidth="1.2" />

            {/* Center Electrostatic Spark Arc */}
            <path d="M18 32 L22 30 L21 34 L26 31 L25 35 L30 32" stroke="#facc15" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="24" cy="32" r="1.5" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 14. SOOTHE BELL (安らぎの鈴)
      // Golden jingle sphere, soft lavender silk bow, chime ripples
      // =====================================================================
      case 'soothe_bell':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Soft Lavender Ribbon Bow */}
            <path d="M18 12 C12 6 9 10 15 15 Z" fill="#c084fc" stroke="#6b21a8" strokeWidth="1" />
            <path d="M30 12 C36 6 39 10 33 15 Z" fill="#e879f9" stroke="#6b21a8" strokeWidth="1" />
            <circle cx="24" cy="14" r="3" fill="#f0abfc" stroke="#6b21a8" strokeWidth="1" />

            {/* Golden Jingle Bell Sphere */}
            <circle cx="24" cy="27" r="12" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.5" />
            <ellipse cx="24" cy="27" rx="12" ry="3.5" fill="none" stroke="#a16207" strokeWidth="1" />
            <path d="M16 30 Q24 26 32 30" stroke="#451a03" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="24" cy="32" r="2" fill="#713f12" />

            {/* Specular Glint */}
            <ellipse cx="19" cy="21" rx="3.5" ry="2" fill="#fef08a" opacity="0.8" transform="rotate(-20 19 21)" />
            <circle cx="18" cy="20" r="1" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 15. SHINY STARBURST AURA (色違いの星輝)
      // 8-point golden diamond starburst, cyan outer corona, glint rays
      // =====================================================================
      case 'shiny_star':
        return (
          <g>
            {/* Cyan Radiant Aura Halo */}
            <circle cx="24" cy="24" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6" />
            {/* Diagonal Star Rays */}
            <polygon points="24,6 27,21 42,24 27,27 24,42 21,27 6,24 21,21" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.2" />
            {/* Secondary Star Cross */}
            <polygon points="24,11 26,22 37,24 26,26 24,37 22,26 11,24 22,22" fill="#fef08a" opacity="0.9" />
            {/* Inner Sparkling Diamond */}
            <polygon points="24,16 29,24 24,32 19,24" fill="#ffffff" />
            {/* Corner sparkle satellites */}
            <circle cx="10" cy="10" r="1.5" fill="#fef08a" />
            <circle cx="38" cy="10" r="1.2" fill="#38bdf8" />
            <circle cx="38" cy="38" r="1.5" fill="#fef08a" />
            <circle cx="10" cy="38" r="1.2" fill="#38bdf8" />
          </g>
        );

      // =====================================================================
      // 16. BRENDAN'S CAP (エメラルドニット帽)
      // Iconic Hoenn white knit beanie, emerald brim, textured knit lines
      // =====================================================================
      case 'brendan_cap':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="40" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* White Beanie Knit Crown */}
            <path
              d="M10 26 C10 12 38 12 38 26 Z"
              fill="url(#knitWhiteGradient)"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Knit texture lines */}
            <path d="M16 26 C16 16 32 16 32 26" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M20 26 C20 18 28 18 28 26" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />

            {/* Emerald Green Visor / Headband Rim */}
            <path
              d="M7 26 C7 24 41 24 41 26 L41 33 C41 37 7 37 7 33 Z"
              fill="url(#leafGreenGradient)"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Black Lower Trim */}
            <path d="M7 32 C14 36 34 36 41 32" stroke="#09090b" strokeWidth="2" fill="none" />
            <rect x="22" y="27" width="4" height="4" rx="1" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 17. MAY'S BANDANA (ハルカのバンダナ)
      // Folded emerald bandana, white Pokéball crest, tied rear knot
      // =====================================================================
      case 'may_bandana':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="40" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Tied knot tails */}
            <path d="M36 28 C41 33 43 38 43 43 L38 41 C37 37 35 32 34 29 Z" fill="#047857" stroke="#064e3b" strokeWidth="1" />
            <path d="M38 29 C44 32 46 36 45 40 L41 39 C40 36 38 33 37 30 Z" fill="#059669" />

            {/* Bandana Triangular Crown */}
            <path
              d="M8 27 C8 15 40 15 40 27 L36 34 L12 34 Z"
              fill="url(#leafGreenGradient)"
              stroke="#064e3b"
              strokeWidth="1.5"
            />
            {/* Front White Pokéball Emblem */}
            <circle cx="24" cy="25" r="5" fill="#f8fafc" stroke="#064e3b" strokeWidth="1" />
            <line x1="19" y1="25" x2="29" y2="25" stroke="#064e3b" strokeWidth="1.2" />
            <circle cx="24" cy="25" r="2" fill="#f8fafc" stroke="#064e3b" strokeWidth="1" />
            <circle cx="24" cy="25" r="0.8" fill="#064e3b" />
          </g>
        );

      // =====================================================================
      // 18. RED'S VINTAGE CAP (レッドのキャップ)
      // Iconic vermilion cap, white front panel, curved visor, semi-circle badge
      // =====================================================================
      case 'red_cap':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="41" rx="17" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Cap Crown (Back) */}
            <path d="M12 24 C12 11 36 11 36 24 Z" fill="#b91c1c" stroke="#450a0a" strokeWidth="1.5" />
            {/* White Front Crown Panel */}
            <path d="M15 24 C15 13 33 13 33 24 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
            {/* Legendary Pokéball Semi-Circle Badge */}
            <circle cx="24" cy="19" r="3.5" fill="#dc2626" stroke="#0f172a" strokeWidth="0.8" />
            <path d="M20.5 19 C20.5 22.5 27.5 22.5 27.5 19 Z" fill="#f8fafc" />
            <line x1="20.5" y1="19" x2="27.5" y2="19" stroke="#0f172a" strokeWidth="0.8" />

            {/* Curved Visor / Bill */}
            <path
              d="M8 24 C14 28 34 28 40 24 L42 28 C34 35 14 35 6 28 Z"
              fill="url(#focusBandGradient)"
              stroke="#450a0a"
              strokeWidth="1.5"
            />
            {/* Visor Top Highlight */}
            <path d="M10 25 C16 29 32 29 38 25" stroke="#fca5a5" strokeWidth="1.2" fill="none" opacity="0.8" />
          </g>
        );

      // =====================================================================
      // 19. SILPH VISOR (シルフスコープバイザー)
      // Futuristic cyber visor, amber HUD lens, platinum temple mounts
      // =====================================================================
      case 'silph_visor':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="40" rx="16" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Platinum Frame */}
            <path d="M6 22 L12 21 L36 21 L42 22" stroke="url(#silverBevel)" strokeWidth="3" strokeLinecap="round" />
            {/* Amber Holographic HUD Visor */}
            <polygon points="9,21 39,21 36,33 12,33" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.2" opacity="0.85" />
            {/* Digital Reticle / Scan Line */}
            <line x1="12" y1="27" x2="36" y2="27" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,1" opacity="0.8" />
            <rect x="22" y="24" width="4" height="6" fill="none" stroke="#ffffff" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 20. DEVON STAR BROOCH (ツワブキのブローチ)
      // Polished silver star brooch, iridescent blue meteorite core
      // =====================================================================
      case 'devon_brooch':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Heavy Silver 6-Point Star */}
            <polygon
              points="24,8 28,19 39,16 32,25 38,34 27,31 24,42 21,31 10,34 16,25 9,16 20,19"
              fill="url(#silverBevel)"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Bevel Shading */}
            <circle cx="24" cy="25" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            {/* Iridescent Blue Fallarbor Meteorite Core */}
            <circle cx="24" cy="25" r="7" fill="url(#mysticWaterGradient)" stroke="#0284c7" strokeWidth="1" />
            <polygon points="24,20 27,25 24,30 21,25" fill="#e0f2fe" opacity="0.8" />
            <circle cx="22" cy="22" r="1.2" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 21. BADGE CASE (八大バッジケース)
      // Open mahogany wood box, 8 miniature enameled Hoenn gym badges
      // =====================================================================
      case 'badge_case':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="17" ry="4" fill="rgba(0,0,0,0.45)" />
            {/* Mahogany Box Shell */}
            <rect x="7" y="14" width="34" height="26" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.6" />
            {/* Velvet Lining */}
            <rect x="9.5" y="16.5" width="29" height="21" rx="2" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1" />
            {/* Brass Corner Reinforcements */}
            <polygon points="7,14 12,14 7,19" fill="#eab308" />
            <polygon points="41,14 36,14 41,19" fill="#eab308" />
            <polygon points="7,40 12,40 7,35" fill="#eab308" />
            <polygon points="41,40 36,40 41,35" fill="#eab308" />

            {/* 8 Miniature Hoenn Badges */}
            <circle cx="15" cy="22" r="2.2" fill="#991b1b" stroke="#facc15" strokeWidth="0.8" />
            <polygon points="21,19 23,24 19,24" fill="#0284c7" stroke="#facc15" strokeWidth="0.8" />
            <rect x="26" y="20" width="4" height="4" fill="#eab308" stroke="#713f12" strokeWidth="0.8" />
            <polygon points="33,20 35,22 33,24 31,22" fill="#f97316" stroke="#facc15" strokeWidth="0.8" />

            <circle cx="15" cy="31" r="2.2" fill="#e11d48" stroke="#facc15" strokeWidth="0.8" />
            <polygon points="21,29 23,33 19,33" fill="#84cc16" stroke="#15803d" strokeWidth="0.8" />
            <circle cx="28" cy="31" r="2.2" fill="#06b6d4" stroke="#facc15" strokeWidth="0.8" />
            <polygon points="33,29 35,31 33,33 31,31" fill="#ec4899" stroke="#facc15" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 22. FRONTIER GOLD SYMBOL (フロンティアシンボル)
      // 3D Hexagonal gold medal, embossed brain crest, royal purple ribbon
      // =====================================================================
      case 'frontier_symbol':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Purple Ribbon */}
            <polygon points="19,8 24,14 29,8 29,17 19,17" fill="#6b21a8" stroke="#3b0764" strokeWidth="1" />

            {/* Heavy Gold Hexagon Medallion */}
            <polygon
              points="24,13 36,20 36,34 24,41 12,34 12,20"
              fill="url(#goldBevel)"
              stroke="#713f12"
              strokeWidth="1.6"
            />
            {/* Inner Recessed Hexagon */}
            <polygon
              points="24,16 33,21 33,32 24,37 15,32 15,21"
              fill="#ca8a04"
              stroke="#713f12"
              strokeWidth="1"
            />
            {/* Embossed Frontier Brain Crest */}
            <circle cx="24" cy="26" r="4.5" fill="#fef08a" stroke="#713f12" strokeWidth="1" />
            <polygon points="24,23 27,27 21,27" fill="#ca8a04" />
            <circle cx="20" cy="18" r="1.5" fill="#ffffff" />
          </g>
        );

      // =====================================================================
      // 23. HOENN EXPEDITION WINDBREAKER (ホウエン冒険上着)
      // Crimson & slate explorer jacket, zipper, utility pockets
      // =====================================================================
      case 'hoenn_jacket':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Windbreaker Jacket Body */}
            <path
              d="M10 18 L16 12 L32 12 L38 18 L41 38 L31 40 L24 40 L17 40 L7 38 Z"
              fill="url(#focusBandGradient)"
              stroke="#450a0a"
              strokeWidth="1.5"
            />
            {/* Slate Grey Flanks & Shoulders */}
            <polygon points="10,18 16,12 18,22 10,26" fill="#334155" />
            <polygon points="38,18 32,12 30,22 38,26" fill="#334155" />

            {/* Center Front Zipper */}
            <line x1="24" y1="12" x2="24" y2="40" stroke="#facc15" strokeWidth="1.5" />
            <rect x="22.5" y="16" width="3" height="3" fill="#ffffff" />

            {/* Utility Flap Pockets */}
            <rect x="12" y="28" width="6" height="6" rx="1" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
            <rect x="30" y="28" width="6" height="6" rx="1" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 24. CHAMPION'S ROYAL MANTLE (覇者の紫金外套)
      // Imperial midnight-violet velvet cape, gold ermine collar, lion clasps
      // =====================================================================
      case 'champion_mantle':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="17" ry="4" fill="rgba(0,0,0,0.45)" />
            {/* Deep Violet Flowing Cape */}
            <path
              d="M14 14 C18 12 30 12 34 14 L41 40 C34 43 14 43 7 40 Z"
              fill="url(#mantleVioletGradient)"
              stroke="#1e1b4b"
              strokeWidth="1.5"
            />
            {/* Gold Embroidered Border Trim */}
            <path d="M8 39 C14 42 34 42 40 39" stroke="#facc15" strokeWidth="2.5" fill="none" />

            {/* Gold Ermine Shoulder Mantle */}
            <path
              d="M11 14 C17 10 31 10 37 14 L35 22 C29 20 19 20 13 22 Z"
              fill="url(#goldBevel)"
              stroke="#713f12"
              strokeWidth="1.2"
            />
            {/* Dual Lion-Head Clasps */}
            <circle cx="14" cy="18" r="3" fill="#facc15" stroke="#713f12" strokeWidth="0.8" />
            <circle cx="34" cy="18" r="3" fill="#facc15" stroke="#713f12" strokeWidth="0.8" />
            {/* Clasp Connecting Chain */}
            <path d="M14 19 Q24 23 34 19" stroke="#facc15" strokeWidth="1.2" fill="none" />
          </g>
        );

      // =====================================================================
      // 25. SYNDICATE TACTICAL DUAL VEST (海陸の戦術胴着)
      // Magma red & aqua dual vest, tactical webbing & holsters
      // =====================================================================
      case 'team_vest':
        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Vest Silhouette */}
            <path
              d="M12 16 L17 12 L31 12 L36 16 L38 38 L10 38 Z"
              fill="#09090b"
              stroke="#27272a"
              strokeWidth="1.5"
            />
            {/* Left Magma Red Panel */}
            <path d="M12 16 L17 12 L23 12 L23 38 L10 38 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="1" />
            {/* Right Aqua Blue Panel */}
            <path d="M25 12 L31 12 L36 16 L38 38 L25 38 Z" fill="#0369a1" stroke="#082f49" strokeWidth="1" />

            {/* Tactical Webbing Straps */}
            <line x1="13" y1="23" x2="35" y2="23" stroke="#facc15" strokeWidth="1.5" />
            <line x1="13" y1="31" x2="35" y2="31" stroke="#facc15" strokeWidth="1.5" />
            {/* Quick-Release Buckles */}
            <rect x="22" y="21.5" width="4" height="3" fill="#e2e8f0" stroke="#09090b" strokeWidth="0.8" />
            <rect x="22" y="29.5" width="4" height="3" fill="#e2e8f0" stroke="#09090b" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 26-29. ELEMENTAL AURAS (Ember, Raindrop, Blizzard, Cosmic)
      // Volumetric atmospheric energy cores with particle rings
      // =====================================================================
      case 'ember_aura':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="16" fill="url(#emberAuraGradient)" opacity="0.3" />
            <circle cx="24" cy="24" r="14" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="24" cy="24" r="8" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
            <circle cx="24" cy="24" r="4" fill="#fef08a" />
            {/* Flying Embers */}
            <circle cx="14" cy="12" r="2" fill="#ef4444" />
            <circle cx="34" cy="15" r="1.8" fill="#facc15" />
            <circle cx="31" cy="33" r="1.5" fill="#f97316" />
            <circle cx="15" cy="31" r="1.2" fill="#ea580c" />
          </g>
        );

      case 'raindrop_halo':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="16" fill="url(#mysticWaterGradient)" opacity="0.25" />
            <circle cx="24" cy="24" r="15" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,2" />
            <circle cx="24" cy="24" r="9" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="24" cy="24" r="4" fill="#bae6fd" />
            {/* Raindrops */}
            <path d="M15 13 Q13 18 15 19 Q17 18 15 13" fill="#38bdf8" />
            <path d="M33 16 Q31 21 33 22 Q35 21 33 16" fill="#38bdf8" />
            <path d="M21 32 Q19 36 21 37 Q23 36 21 32" fill="#0284c7" />
          </g>
        );

      case 'blizzard_orb':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="none" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="3,2" />
            <path d="M24 10 L24 38 M10 24 L38 24 M14 14 L34 34 M34 14 L14 34" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="24" r="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
            <circle cx="24" cy="24" r="2" fill="#ffffff" />
          </g>
        );

      case 'cosmic_orb':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="#e879f9" strokeWidth="1.5" transform="rotate(-25 24 24)" />
            <circle cx="24" cy="24" r="11" fill="url(#mantleVioletGradient)" stroke="#a855f7" strokeWidth="1.2" />
            <circle cx="24" cy="24" r="5" fill="#facc15" />
            <circle cx="35" cy="18" r="1.5" fill="#ffffff" />
            <circle cx="13" cy="30" r="1.2" fill="#f472b6" />
          </g>
        );

      // =====================================================================
      // 30-35. POKÉBALL ENTRANCE BURST GACHA SPHERES
      // =====================================================================
      case 'ball_master':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#7e22ce" stroke="#09090b" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#f8fafc" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#09090b" strokeWidth="2.8" />
            {/* Pink M nodules */}
            <circle cx="16" cy="16" r="3" fill="#ec4899" stroke="#09090b" strokeWidth="1" />
            <circle cx="32" cy="16" r="3" fill="#ec4899" stroke="#09090b" strokeWidth="1" />
            <text x="24" y="18" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">M</text>
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#09090b" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#09090b" />
          </g>
        );

      case 'ball_luxury':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#18181b" stroke="#09090b" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#27272a" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#eab308" strokeWidth="2.8" />
            {/* Gold and Red stripes */}
            <path d="M11 17 C16 13 32 13 37 17" stroke="#eab308" strokeWidth="2" fill="none" />
            <path d="M12 31 C16 35 32 35 36 31" stroke="#dc2626" strokeWidth="1.8" fill="none" />
            <circle cx="24" cy="24" r="5" fill="#eab308" stroke="#713f12" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2" fill="#713f12" />
          </g>
        );

      case 'ball_premier':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#e2e8f0" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#dc2626" strokeWidth="2.8" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#dc2626" />
            <ellipse cx="18" cy="16" rx="4" ry="2" fill="#ffffff" opacity="0.8" transform="rotate(-30 18 16)" />
          </g>
        );

      case 'ball_dusk':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#047857" stroke="#064e3b" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#1e1b4b" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#064e3b" strokeWidth="2.8" />
            <circle cx="16" cy="17" r="3" fill="#ea580c" stroke="#064e3b" strokeWidth="1" />
            <circle cx="32" cy="17" r="3" fill="#ea580c" stroke="#064e3b" strokeWidth="1" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#064e3b" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#064e3b" />
          </g>
        );

      case 'ball_cherish':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#e11d48" stroke="#881337" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#be123c" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#18181b" strokeWidth="2.8" />
            <rect x="11" y="16" width="3" height="8" rx="1" fill="#18181b" />
            <rect x="34" y="16" width="3" height="8" rx="1" fill="#18181b" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#18181b" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#18181b" />
          </g>
        );

      case 'ball_quick':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#0284c7" stroke="#082f49" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#eab308" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#082f49" strokeWidth="2.8" />
            <polygon points="17,11 24,18 20,22 13,15" fill="#facc15" stroke="#082f49" strokeWidth="0.8" />
            <polygon points="31,11 24,18 28,22 35,15" fill="#facc15" stroke="#082f49" strokeWidth="0.8" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#082f49" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#082f49" />
          </g>
        );

      // =====================================================================
      // 36-38. COMBAT SCREEN FLARES & CINEMATIC OVERLAYS
      // =====================================================================
      case 'flare_manga':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="8" y="10" width="32" height="28" rx="3" fill="#09090b" stroke="#f8fafc" strokeWidth="1.5" />
            {/* Manga radial speedlines */}
            <line x1="8" y1="10" x2="20" y2="21" stroke="#f8fafc" strokeWidth="1.2" />
            <line x1="40" y1="10" x2="28" y2="21" stroke="#f8fafc" strokeWidth="1.2" />
            <line x1="8" y1="38" x2="20" y2="27" stroke="#f8fafc" strokeWidth="1.2" />
            <line x1="40" y1="38" x2="28" y2="27" stroke="#f8fafc" strokeWidth="1.2" />
            <line x1="24" y1="10" x2="24" y2="19" stroke="#f8fafc" strokeWidth="1.5" />
            <line x1="24" y1="38" x2="24" y2="29" stroke="#f8fafc" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="3" fill="#facc15" />
          </g>
        );

      case 'flare_holo':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="8" y="10" width="32" height="28" rx="3" fill="none" stroke="url(#goldBevel)" strokeWidth="3" />
            <rect x="11" y="13" width="26" height="22" rx="1" fill="#1e1b4b" />
            <polygon points="12,14 36,14 24,34" fill="none" stroke="#e879f9" strokeWidth="1" />
            <circle cx="16" cy="18" r="2" fill="#38bdf8" />
            <circle cx="32" cy="30" r="2" fill="#facc15" />
          </g>
        );

      case 'flare_lens':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="14" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />
            {/* Anamorphic horizontal streak */}
            <line x1="6" y1="24" x2="42" y2="24" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="24" r="5" fill="#ffffff" />
            <circle cx="24" cy="24" r="8" fill="none" stroke="#facc15" strokeWidth="1.5" />
          </g>
        );

      // =====================================================================
      // 39-42. FIELD AURAS & SPARKLES
      // =====================================================================
      case 'dragon_flame':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M24 8 C16 16 14 28 24 38 C34 28 32 16 24 8 Z" fill="#6d28d9" stroke="#4c1d95" strokeWidth="1.5" />
            <path d="M24 16 C19 22 18 30 24 35 C30 30 29 22 24 16 Z" fill="#c084fc" />
            <path d="M24 22 C22 26 21 31 24 33 C27 31 26 26 24 22 Z" fill="#fef08a" />
          </g>
        );

      case 'electric_field':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="14" fill="url(#goldBevel)" stroke="#713f12" strokeWidth="1.5" />
            <polygon points="26,12 16,25 23,25 20,36 32,22 25,22" fill="#ffffff" stroke="#713f12" strokeWidth="1" />
          </g>
        );

      case 'mystic_current':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="14" fill="url(#mysticWaterGradient)" stroke="#0369a1" strokeWidth="1.5" />
            <path d="M14 24 Q24 16 34 24 Q24 32 14 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
          </g>
        );

      case 'psychic_nebula':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="14" fill="url(#mantleVioletGradient)" stroke="#7e22ce" strokeWidth="1.5" />
            <ellipse cx="24" cy="24" rx="14" ry="5" fill="none" stroke="#f0abfc" strokeWidth="1.5" transform="rotate(-30 24 24)" />
            <circle cx="24" cy="24" r="3" fill="#facc15" />
          </g>
        );

      // =====================================================================
      // 10. TITLE CARDS & HP BAR FRAMES (Custom Collectible HP & Level HUD)
      // =====================================================================
      case 'frame_prismatic':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Holographic Prismatic Outer Frame */}
            <rect x="7" y="10" width="34" height="26" rx="4" fill="url(#silverBevel)" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="10" y="13" width="28" height="20" rx="2" fill="#0f172a" />
            {/* Prismatic Rainbow Bar Gradient */}
            <rect x="12" y="16" width="24" height="4" rx="1" fill="#f43f5e" />
            <rect x="18" y="16" width="12" height="4" fill="#facc15" />
            <rect x="26" y="16" width="10" height="4" rx="1" fill="#38bdf8" />
            {/* Mini HP bar preview */}
            <rect x="12" y="24" width="24" height="3" rx="1.5" fill="#1e293b" />
            <rect x="12" y="24" width="18" height="3" rx="1.5" fill="#10b981" />
            {/* Sparkle Glints */}
            <circle cx="9" cy="12" r="1.5" fill="#ffffff" />
            <circle cx="39" cy="34" r="1.5" fill="#ffffff" />
            <path d="M37 13 L38 15 L40 16 L38 17 L37 19 L36 17 L34 16 L36 15 Z" fill="#facc15" />
          </g>
        );

      case 'frame_gold_scroll':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Gilded Lacquer Frame */}
            <rect x="7" y="10" width="34" height="26" rx="3" fill="#1e1b4b" stroke="url(#goldBevel)" strokeWidth="2" />
            {/* Corner Gilded Brackets */}
            <path d="M7 16 L7 10 L13 10" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <path d="M41 16 L41 10 L35 10" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <path d="M7 30 L7 36 L13 36" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <path d="M41 30 L41 36 L35 36" fill="none" stroke="#facc15" strokeWidth="2.5" />
            {/* Inner Seigaiha wave accent */}
            <path d="M12 23 Q16 19 20 23 Q24 19 28 23 Q32 19 36 23" fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
            {/* Mini Hanko Vermilion Stamp */}
            <rect x="30" y="26" width="6" height="6" rx="1" fill="#dc2626" />
            <text x="33" y="31" fontSize="4" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">金</text>
          </g>
        );

      case 'frame_cyber_hud':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Dark Tactical Screen Back */}
            <rect x="8" y="10" width="32" height="26" rx="2" fill="#090d16" stroke="#0284c7" strokeWidth="1.2" />
            {/* Telemetry Corner Brackets */}
            <path d="M8 17 L8 10 L15 10" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <path d="M40 17 L40 10 L33 10" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <path d="M8 29 L8 36 L15 36" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <path d="M40 29 L40 36 L33 36" fill="none" stroke="#22d3ee" strokeWidth="2" />
            {/* Crosshair Target */}
            <circle cx="24" cy="23" r="6" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="2,2" />
            <line x1="24" y1="14" x2="24" y2="32" stroke="#22d3ee" strokeWidth="0.8" />
            <line x1="15" y1="23" x2="33" y2="23" stroke="#22d3ee" strokeWidth="0.8" />
            <circle cx="24" cy="23" r="1.5" fill="#facc15" />
          </g>
        );

      case 'frame_dragon_crest':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Obsidian Dragon Frame */}
            <rect x="7" y="10" width="34" height="26" rx="4" fill="#180e29" stroke="#7e22ce" strokeWidth="1.8" />
            {/* Draconic Spikes / Scales on corners */}
            <polygon points="7,14 4,11 11,8 14,10" fill="#a855f7" />
            <polygon points="41,14 44,11 37,8 34,10" fill="#a855f7" />
            <polygon points="7,32 4,35 11,38 14,36" fill="#a855f7" />
            <polygon points="41,32 44,35 37,38 34,36" fill="#a855f7" />
            {/* Central Violet Dragon Wyrm Sigil */}
            <path d="M18 25 C16 19 24 16 26 21 C27 24 23 26 25 30" fill="none" stroke="#e879f9" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="27" cy="18" r="1.5" fill="#facc15" />
          </g>
        );

      case 'ball_heavy':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.5)" />
            {/* Dense Iron Lower Half */}
            <circle cx="24" cy="24" r="15" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#64748b" />
            {/* Heavy Ball Blue Apricorn Panels */}
            <circle cx="16" cy="15" r="3.5" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />
            <circle cx="32" cy="15" r="3.5" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#0f172a" strokeWidth="2.8" />
            <circle cx="24" cy="24" r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#0f172a" />
          </g>
        );

      case 'flare_comic_pow':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
            {/* Pop-art Halftone Comic Starburst */}
            <polygon points="24,6 28,16 39,12 34,22 45,26 34,30 38,40 28,34 24,44 19,34 10,39 14,29 3,25 14,21 9,12 20,16" fill="#f59e0b" stroke="#dc2626" strokeWidth="1.5" />
            <polygon points="24,10 27,17 35,14 31,22 39,25 31,28 34,36 27,31 24,38 21,31 14,35 17,27 9,24 17,21 13,14 21,17" fill="#fef08a" />
            <circle cx="24" cy="24" r="4" fill="#dc2626" />
            <circle cx="24" cy="24" r="2" fill="#ffffff" />
          </g>
        );

      case 'aura_sakura':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.3)" />
            {/* Glowing Pink Aura Halo */}
            <circle cx="24" cy="24" r="15" fill="#f43f5e" opacity="0.2" />
            <circle cx="24" cy="24" r="13" fill="none" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="3,2" />
            {/* Sakura Blossom Petals */}
            <circle cx="24" cy="18" r="3.5" fill="#fda4af" />
            <circle cx="18" cy="23" r="3.5" fill="#f43f5e" />
            <circle cx="30" cy="23" r="3.5" fill="#fb7185" />
            <circle cx="20" cy="29" r="3.5" fill="#f43f5e" />
            <circle cx="28" cy="29" r="3.5" fill="#fda4af" />
            <circle cx="24" cy="24" r="2.5" fill="#fef08a" />
          </g>
        );

      case 'ball_premier':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#dc2626" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#dc2626" />
          </g>
        );

      case 'ball_luxury':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.5)" />
            <circle cx="24" cy="24" r="15" fill="#0f172a" stroke="#09090b" strokeWidth="1.8" />
            <path d="M9 16 Q24 20 39 16" fill="none" stroke="#facc15" strokeWidth="2" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#facc15" strokeWidth="2" />
            <circle cx="24" cy="24" r="5" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#dc2626" />
          </g>
        );

      case 'ball_master':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.5)" />
            <circle cx="24" cy="24" r="15" fill="#7e22ce" stroke="#09090b" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#f8fafc" />
            <circle cx="15" cy="15" r="3.5" fill="#ec4899" />
            <circle cx="33" cy="15" r="3.5" fill="#ec4899" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#09090b" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#09090b" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#09090b" />
          </g>
        );

      case 'flare_manga':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
            <circle cx="24" cy="24" r="14" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="24" y1="10" x2="24" y2="18" stroke="#ffffff" strokeWidth="2" />
            <line x1="24" y1="30" x2="24" y2="38" stroke="#ffffff" strokeWidth="2" />
            <line x1="10" y1="24" x2="18" y2="24" stroke="#ffffff" strokeWidth="2" />
            <line x1="30" y1="24" x2="38" y2="24" stroke="#ffffff" strokeWidth="2" />
          </g>
        );

      case 'flare_holo':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
            <rect x="10" y="10" width="28" height="28" rx="3" fill="#18181b" stroke="url(#goldBevel)" strokeWidth="2" />
            <path d="M10 10 L38 38" stroke="#f43f5e" strokeWidth="1.5" />
            <path d="M38 10 L10 38" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="3" fill="#facc15" />
          </g>
        );

      case 'flare_lens':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
            <circle cx="24" cy="24" r="14" fill="#0284c7" opacity="0.3" />
            <line x1="6" y1="24" x2="42" y2="24" stroke="#22d3ee" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="5" fill="#ffffff" />
            <circle cx="24" cy="24" r="2.5" fill="#facc15" />
          </g>
        );

      case 'leaf_sunhat':
        return (
          <g>
            <ellipse cx="24" cy="40" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            <ellipse cx="24" cy="26" rx="18" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <ellipse cx="24" cy="23" rx="12" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M12 25 C12 22 36 22 36 25" stroke="#dc2626" strokeWidth="3" fill="none" />
            <circle cx="24" cy="24" r="3" fill="#f8fafc" stroke="#dc2626" strokeWidth="1" />
            <circle cx="24" cy="24" r="1" fill="#dc2626" />
          </g>
        );

      case 'brendan_emerald_cap':
        return (
          <g>
            <ellipse cx="24" cy="40" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M10 26 C10 12 38 12 38 26 Z" fill="url(#knitWhiteGradient)" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M7 26 C7 24 41 24 41 26 L41 33 C41 37 7 37 7 33 Z" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="7" y1="32" x2="41" y2="32" stroke="#09090b" strokeWidth="2" />
            <polygon points="22,27 26,27 24,30" fill="#ef4444" />
          </g>
        );

      case 'may_emerald_bandana':
        return (
          <g>
            <ellipse cx="24" cy="40" rx="16" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M8 27 C8 15 40 15 40 27 L36 34 L12 34 Z" fill="#059669" stroke="#064e3b" strokeWidth="1.5" />
            <circle cx="24" cy="25" r="5" fill="#f8fafc" stroke="#064e3b" strokeWidth="1" />
            <circle cx="24" cy="25" r="2" fill="#047857" />
            <polygon points="36,28 44,36 38,36" fill="#047857" />
          </g>
        );

      case 'brendan_emerald_suit':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="12" y="16" width="24" height="22" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="17,16 31,16 29,28 19,28" fill="#10b981" />
            <line x1="24" y1="16" x2="24" y2="32" stroke="#ef4444" strokeWidth="1.5" />
          </g>
        );

      case 'may_emerald_tunic':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <polygon points="14,16 34,16 36,36 12,36" fill="#059669" stroke="#064e3b" strokeWidth="1.5" />
            <polygon points="18,16 30,16 24,26" fill="#f43f5e" />
            <circle cx="24" cy="21" r="2" fill="#f8fafc" />
          </g>
        );

      case 'red_fr_vest':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="12" y="16" width="24" height="22" rx="3" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />
            <polygon points="18,16 30,16 24,22" fill="#f8fafc" />
            <rect x="16" y="22" width="16" height="16" fill="#0f172a" />
            <line x1="24" y1="22" x2="24" y2="38" stroke="#f8fafc" strokeWidth="1" />
          </g>
        );

      case 'leaf_lg_dress':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="15" y="16" width="18" height="12" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
            <polygon points="13,26 35,26 38,36 10,36" fill="#38bdf8" />
            <line x1="13" y1="16" x2="33" y2="34" stroke="#eab308" strokeWidth="2.5" />
            <rect x="29" y="30" width="6" height="6" rx="1" fill="#eab308" />
          </g>
        );

      case 'frontier_duster':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <polygon points="11,16 8,40 40,40 37,16" fill="#334155" stroke="#facc15" strokeWidth="1.5" />
            <rect x="16" y="18" width="16" height="20" fill="#1e293b" />
            <polygon points="19,18 29,18 24,25" fill="#facc15" />
          </g>
        );

      case 'magma_uniform':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="12" y="16" width="24" height="22" rx="3" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
            <polygon points="16,16 32,16 24,26" fill="#0f172a" />
            <circle cx="24" cy="21" r="2.5" fill="#f59e0b" />
          </g>
        );

      case 'aqua_wetsuit':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="12" y="16" width="24" height="22" rx="3" fill="#0369a1" stroke="#075985" strokeWidth="1.5" />
            <rect x="18" y="16" width="12" height="22" fill="#0f172a" />
            <circle cx="24" cy="24" r="3" fill="#f8fafc" />
          </g>
        );

      case 'pike_queen_tiara':
        return (
          <g>
            <ellipse cx="24" cy="40" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M12 28 C12 20 36 20 36 28" fill="none" stroke="#eab308" strokeWidth="2.5" />
            <polygon points="24,14 27,24 21,24" fill="#facc15" stroke="#713f12" strokeWidth="1" />
            <circle cx="24" cy="16" r="2" fill="#dc2626" />
          </g>
        );

      case 'magma_cowl':
        return (
          <g>
            <ellipse cx="24" cy="40" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M10 32 C10 16 38 16 38 32 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
            <polygon points="13,20 8,10 16,16" fill="#7f1d1d" />
            <polygon points="35,20 40,10 32,16" fill="#7f1d1d" />
            <circle cx="24" cy="22" r="2.5" fill="#0f172a" />
          </g>
        );

      case 'aqua_bandana':
        return (
          <g>
            <ellipse cx="24" cy="40" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M10 28 C10 16 38 16 38 28 L34 35 L14 35 Z" fill="#0369a1" stroke="#075985" strokeWidth="1.5" />
            <line x1="12" y1="22" x2="36" y2="22" stroke="#ffffff" strokeWidth="1.8" />
            <line x1="10" y1="26" x2="38" y2="26" stroke="#ffffff" strokeWidth="1.8" />
            <circle cx="24" cy="24" r="2.5" fill="#f8fafc" />
          </g>
        );

      case 'kanto_rainbow_brooch':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="14" y="14" width="20" height="20" rx="3" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
            <circle cx="18" cy="18" r="2" fill="#991b1b" />
            <circle cx="24" cy="18" r="2" fill="#f59e0b" />
            <circle cx="30" cy="18" r="2" fill="#eab308" />
            <circle cx="18" cy="24" r="2" fill="#16a34a" />
            <circle cx="24" cy="24" r="2" fill="#2563eb" />
            <circle cx="30" cy="24" r="2" fill="#7c3aed" />
            <circle cx="21" cy="30" r="2" fill="#db2777" />
            <circle cx="27" cy="30" r="2" fill="#f43f5e" />
          </g>
        );

      case 'silph_card_key':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="12" y="16" width="24" height="16" rx="2" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="14" y="18" width="8" height="4" fill="#38bdf8" />
            <line x1="12" y1="26" x2="36" y2="26" stroke="#0284c7" strokeWidth="2" />
          </g>
        );

      case 'pokedex_gold_pin':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <polygon points="24,14 27,21 34,21 28,26 30,33 24,28 18,33 20,26 14,21 21,21" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="24" cy="24" r="2.5" fill="#dc2626" />
          </g>
        );

      case 'rayquaza_ozone':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="14" fill="#065f46" opacity="0.3" />
            <path d="M12 28 C16 16 32 16 36 28" stroke="#10b981" strokeWidth="2.5" fill="none" />
            <circle cx="18" cy="20" r="2" fill="#facc15" />
            <circle cx="30" cy="20" r="2" fill="#facc15" />
          </g>
        );

      case 'lavender_mist':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="14" fill="#581c87" opacity="0.4" />
            <circle cx="18" cy="18" r="3" fill="#c084fc" />
            <circle cx="30" cy="22" r="2.5" fill="#e879f9" />
          </g>
        );

      // =====================================================================
      // 54. MT. SILVER ALPINE CANVAS RUCKSACK
      // =====================================================================
      case 'adventurer_rucksack':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Rolled green sleeping bedroll on top */}
            <rect x="12" y="8" width="24" height="8" rx="4" fill="#047857" stroke="#064e3b" strokeWidth="1.2" />
            <line x1="18" y1="8" x2="18" y2="16" stroke="#78350f" strokeWidth="1.2" />
            <line x1="30" y1="8" x2="30" y2="16" stroke="#78350f" strokeWidth="1.2" />
            {/* Main canvas pack body */}
            <rect x="10" y="14" width="28" height="26" rx="5" fill="#15803d" stroke="#064e3b" strokeWidth="1.5" />
            {/* Flap & leather straps */}
            <path d="M12 16 L36 16 L34 26 L14 26 Z" fill="#166534" stroke="#064e3b" strokeWidth="1" />
            <line x1="16" y1="16" x2="16" y2="38" stroke="#92400e" strokeWidth="1.6" />
            <line x1="32" y1="16" x2="32" y2="38" stroke="#92400e" strokeWidth="1.6" />
            {/* Brass buckles */}
            <rect x="14.5" y="27" width="3" height="3" fill="#facc15" stroke="#713f12" strokeWidth="0.8" />
            <rect x="30.5" y="27" width="3" height="3" fill="#facc15" stroke="#713f12" strokeWidth="0.8" />
            {/* Front pouch */}
            <rect x="18" y="27" width="12" height="10" rx="2" fill="#14532d" stroke="#064e3b" strokeWidth="1" />
          </g>
        );

      // =====================================================================
      // 55. LEAF'S GOLDEN EXPLORER SATCHEL
      // =====================================================================
      case 'leaf_satchel':
        return (
          <g>
            <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Crossbody strap */}
            <path d="M10 8 Q24 20 38 10" stroke="#b45309" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Main golden leather satchel */}
            <rect x="11" y="18" width="26" height="22" rx="4" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
            {/* Satchel top flap */}
            <path d="M11 18 L37 18 L35 30 L13 30 Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.2" />
            {/* Central brass clasp & strap */}
            <line x1="24" y1="18" x2="24" y2="36" stroke="#78350f" strokeWidth="1.8" />
            <rect x="22" y="28" width="4" height="4" rx="1" fill="#fef08a" stroke="#713f12" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 56. DEVON TECH COMM PACK
      // =====================================================================
      case 'devon_tech_pack':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Antenna */}
            <line x1="33" y1="6" x2="33" y2="16" stroke="#94a3b8" strokeWidth="1.8" />
            <circle cx="33" cy="5" r="1.8" fill="#38bdf8" />
            {/* Main carbon-silver body */}
            <rect x="12" y="15" width="24" height="24" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="15" y="18" width="18" height="18" rx="2" fill="#1e293b" />
            {/* Glowing cyan battery cells */}
            <rect x="18" y="22" width="12" height="4" rx="1" fill="#38bdf8" />
            <rect x="18" y="28" width="12" height="4" rx="1" fill="#0284c7" />
          </g>
        );

      // =====================================================================
      // 57. DRAGONITE GLIDER WINGS
      // =====================================================================
      case 'dragon_wings':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="3.5" fill="rgba(0,0,0,0.4)" />
            {/* Left wing */}
            <path d="M24 24 C14 12 4 14 3 22 C2 28 12 30 24 27 Z" fill="#f97316" stroke="#9a3412" strokeWidth="1.5" />
            <path d="M22 23 C14 15 7 17 6 22 C6 26 13 28 22 26 Z" fill="#2dd4bf" opacity="0.8" />
            {/* Right wing */}
            <path d="M24 24 C34 12 44 14 45 22 C46 28 36 30 24 27 Z" fill="#f97316" stroke="#9a3412" strokeWidth="1.5" />
            <path d="M26 23 C34 15 41 17 42 22 C42 26 35 28 26 26 Z" fill="#2dd4bf" opacity="0.8" />
            {/* Harness center */}
            <circle cx="24" cy="25" r="4" fill="#fdba74" stroke="#9a3412" strokeWidth="1.2" />
          </g>
        );

      // =====================================================================
      // 58. SILPH ROCKET MINI JETPACK
      // =====================================================================
      case 'silph_jetpack':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Left thruster cylinder */}
            <rect x="11" y="12" width="9" height="22" rx="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="11" y1="20" x2="20" y2="20" stroke="#0f172a" strokeWidth="1.2" />
            {/* Right thruster cylinder */}
            <rect x="28" y="12" width="9" height="22" rx="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="28" y1="20" x2="37" y2="20" stroke="#0f172a" strokeWidth="1.2" />
            {/* Central manifold */}
            <rect x="18" y="16" width="12" height="14" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />
            {/* Cyan exhaust flame plumes */}
            <path d="M12 34 L15.5 44 L19 34 Z" fill="#38bdf8" />
            <path d="M29 34 L32.5 44 L36 34 Z" fill="#38bdf8" />
          </g>
        );

      // =====================================================================
      // 59. PALLET RED TURBO RUNNERS
      // =====================================================================
      case 'red_runners':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Left shoe */}
            <path d="M7 26 C9 22 17 22 20 28 L22 36 L6 36 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
            <rect x="5" y="34" width="18" height="4" rx="1" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
            {/* Right shoe */}
            <path d="M26 26 C28 22 36 22 39 28 L41 36 L25 36 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
            <rect x="24" y="34" width="18" height="4" rx="1" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
            {/* White side chevrons */}
            <path d="M12 28 L15 32 L11 34" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M31 28 L34 32 L30 34" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        );

      // =====================================================================
      // 60. DEVON MACH RUNNING SHOES
      // =====================================================================
      case 'emerald_runners':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Left shoe */}
            <path d="M7 26 C9 21 17 21 20 27 L22 35 L6 35 Z" fill="#059669" stroke="#064e3b" strokeWidth="1.5" />
            <rect x="5" y="34" width="18" height="4" rx="1" fill="#0f172a" stroke="#000000" strokeWidth="1" />
            {/* Right shoe */}
            <path d="M26 26 C28 21 36 21 39 27 L41 35 L25 35 Z" fill="#059669" stroke="#064e3b" strokeWidth="1.5" />
            <rect x="24" y="34" width="18" height="4" rx="1" fill="#0f172a" stroke="#000000" strokeWidth="1" />
            {/* Emerald neon stripes */}
            <line x1="9" y1="30" x2="18" y2="30" stroke="#34d399" strokeWidth="1.8" />
            <line x1="28" y1="30" x2="37" y2="30" stroke="#34d399" strokeWidth="1.8" />
          </g>
        );

      // =====================================================================
      // 61. MT. SILVER HIKING BOOTS
      // =====================================================================
      case 'hiking_boots':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            {/* Left boot */}
            <rect x="7" y="19" width="12" height="16" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <path d="M7 28 L22 32 L22 36 L7 36 Z" fill="#92400e" />
            <rect x="6" y="34" width="17" height="5" rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Right boot */}
            <rect x="26" y="19" width="12" height="16" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <path d="M26 28 L41 32 L41 36 L26 36 Z" fill="#92400e" />
            <rect x="25" y="34" width="17" height="5" rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          </g>
        );

      // =====================================================================
      // 62. MOLTEN MAGMA GREAVES
      // =====================================================================
      case 'magma_greaves':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <rect x="8" y="18" width="11" height="17" rx="3" fill="#b91c1c" stroke="#450a0a" strokeWidth="1.5" />
            <rect x="26" y="18" width="11" height="17" rx="3" fill="#b91c1c" stroke="#450a0a" strokeWidth="1.5" />
            <line x1="8" y1="24" x2="19" y2="24" stroke="#facc15" strokeWidth="2" />
            <line x1="26" y1="24" x2="37" y2="24" stroke="#facc15" strokeWidth="2" />
            <rect x="6" y="34" width="16" height="5" rx="1" fill="#0f172a" />
            <rect x="24" y="34" width="16" height="5" rx="1" fill="#0f172a" />
          </g>
        );

      // =====================================================================
      // 63. DEEP OCEAN REEF STRIDE SHOES
      // =====================================================================
      case 'aqua_flippers':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <path d="M6 26 C9 22 17 22 22 28 L24 35 L4 35 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
            <path d="M25 26 C28 22 36 22 41 28 L43 35 L23 35 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
            <path d="M4 35 L24 35 L26 38 L2 38 Z" fill="#38bdf8" />
            <path d="M23 35 L43 35 L45 38 L21 38 Z" fill="#38bdf8" />
          </g>
        );

      // =====================================================================
      // 64. GOLDENROD INLINE ROLLERBLADES
      // =====================================================================
      case 'rollerblades':
        return (
          <g>
            <ellipse cx="24" cy="43" rx="15" ry="3" fill="rgba(0,0,0,0.4)" />
            <rect x="9" y="18" width="10" height="16" rx="2" fill="#f8fafc" stroke="#334155" strokeWidth="1.2" />
            <rect x="26" y="18" width="10" height="16" rx="2" fill="#f8fafc" stroke="#334155" strokeWidth="1.2" />
            {/* Aluminum frame */}
            <rect x="7" y="33" width="14" height="3" rx="1" fill="#94a3b8" />
            <rect x="24" y="33" width="14" height="3" rx="1" fill="#94a3b8" />
            {/* Neon Wheels */}
            <circle cx="9" cy="38" r="2.2" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.8" />
            <circle cx="14" cy="38" r="2.2" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.8" />
            <circle cx="19" cy="38" r="2.2" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.8" />
            <circle cx="26" cy="38" r="2.2" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.8" />
            <circle cx="31" cy="38" r="2.2" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.8" />
            <circle cx="36" cy="38" r="2.2" fill="#22d3ee" stroke="#0891b2" strokeWidth="0.8" />
          </g>
        );

      // =====================================================================
      // 65. SHADOW NINJA MASK & VISOR
      // =====================================================================
      case 'cyber_ninja_mask':
        return (
          <g>
            <ellipse cx="24" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="22" r="14" fill="#18181b" stroke="#09090b" strokeWidth="1.8" />
            {/* Cyan Optic Visor Slit */}
            <rect x="14" y="19" width="20" height="4" rx="2" fill="#22d3ee" />
            <circle cx="24" cy="21" r="1.5" fill="#ffffff" />
            {/* Headband knot trailing behind */}
            <path d="M12 24 C8 28 6 34 5 39 L8 40 C9 35 11 30 14 26 Z" fill="#27272a" />
          </g>
        );

      // =====================================================================
      // DEFAULT / FALLBACK: TANGIBLE 3D POKÉBALL REGALIA
      // =====================================================================
      default:
        return (
          <g>
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
            <circle cx="24" cy="24" r="15" fill="#dc2626" stroke="#09090b" strokeWidth="1.8" />
            <path d="M9 24 C9 32.2 15.8 39 24 39 C32.2 39 39 32.2 39 24 Z" fill="#f8fafc" />
            <line x1="9" y1="24" x2="39" y2="24" stroke="#09090b" strokeWidth="2.8" />
            <circle cx="24" cy="24" r="5" fill="#f8fafc" stroke="#09090b" strokeWidth="2" />
            <circle cx="24" cy="24" r="2" fill="#09090b" />
            <ellipse cx="18" cy="16" rx="4" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-30 18 16)" />
          </g>
        );
    }
  };

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`inline-flex items-center justify-center shrink-0 select-none aspect-square relative ${
        showPedestal ? 'p-1' : ''
      } ${className}`}
      title={title || spriteId}
    >
      {/* Optional Illuminated 3D Display Pedestal Stage */}
      {showPedestal && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900 border border-amber-500/40 shadow-inner overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)]" />
        </div>
      )}

      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-md relative z-10 transition-transform duration-200"
      >
        <defs>
          {/* Gold Burnished Metallic Gradient */}
          <linearGradient id="goldBevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Silver Polished Chrome Gradient */}
          <linearGradient id="silverBevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Focus Band Rich Crimson Gradient */}
          <linearGradient id="focusBandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#f1f5f9" />
            <stop offset="80%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Silk Scarf Satiny Gradient */}
          <linearGradient id="silkScarfGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="35%" stopColor="#dc2626" />
            <stop offset="75%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Choice Scarf Speed Gradient */}
          <linearGradient id="choiceScarfGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="80%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>

          {/* Monocle Optical Cyan Lens */}
          <radialGradient id="lensGlassGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#083344" stopOpacity="0.8" />
          </radialGradient>

          {/* Sunglasses Gradient Smoke Lens */}
          <linearGradient id="smokeLensGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="50%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Stone Base Gradient */}
          <linearGradient id="stoneBaseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Obsidian Prismatic Gradient */}
          <linearGradient id="obsidianGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="30%" stopColor="#1e1b4b" />
            <stop offset="70%" stopColor="#3b0764" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Leaf Green Organic Gradient */}
          <linearGradient id="leafGreenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="80%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* Seed Amber Gradient */}
          <linearGradient id="seedAmberGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>

          {/* Mystic Water Azure Refraction */}
          <radialGradient id="mysticWaterGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#082f49" />
          </radialGradient>

          {/* Horseshoe Magnet Dual Gradient */}
          <linearGradient id="magnetGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="45%" stopColor="#991b1b" />
            <stop offset="55%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Knit White Gradient */}
          <linearGradient id="knitWhiteGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Royal Mantle Velvet Violet */}
          <linearGradient id="mantleVioletGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="40%" stopColor="#7e22ce" />
            <stop offset="80%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          {/* Ember Aura Radial Warmth */}
          <radialGradient id="emberAuraGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
        </defs>

        {renderItemGraphic()}
      </svg>
    </div>
  );
};
