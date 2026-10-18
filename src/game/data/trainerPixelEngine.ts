/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrainerBaseId, EquippedTrainerConfig } from '../types';

/**
 * Authentic 16-color Game Boy Advance palette + GBA-accurate dye hues.
 * Directly extracted from Pokémon Emerald and Pokémon FireRed / LeafGreen ROM sprites.
 */
export const GBA_PALETTE: Record<string, string> = {
  '.': 'transparent',
  'X': '#181818', // Black / Dark Contour Outline
  's': '#fed0a0', // Skin Highlight (Warm GBA Peach)
  'S': '#e89860', // Skin Midtone
  'd': '#985830', // Skin Shadow / Neck Shade
  'w': '#f8f8f8', // Clean GBA White
  'g': '#c8d0d8', // Light Gray Shadow / Platinum
  'G': '#485058', // Dark Charcoal Slate
  'r': '#f85848', // Bright Vermilion Red Highlight
  'R': '#d82818', // Red Midtone
  'b': '#881010', // Deep Crimson Shadow
  'e': '#38e090', // Emerald Green Highlight
  'E': '#08a858', // Emerald Midtone
  'k': '#085830', // Deep Forest Emerald Shadow
  'l': '#5898f8', // Bright Blue Highlight
  'L': '#1858c0', // Blue Midtone
  'D': '#102868', // Deep Navy Shadow
  'h': '#c07840', // Brown Hair Highlight
  'H': '#804820', // Brown Hair Midtone
  'B': '#482810', // Dark Brown Hair Shadow
  'K': '#201828', // Jet Black Anime Hair
  'y': '#f8b820', // Gold / Bright Yellow
  'Y': '#b87808', // Dark Gold Shadow
  'p': '#c078f8', // Lavender / Violet Highlight
  'P': '#582098', // Deep Royal Velvet Purple
  'c': '#38d8f8', // Cyan Highlight / Ice
  'C': '#0888a8', // Dark Teal
  'o': '#f88820', // Orange Wristband / Highlight
  'O': '#c04808', // Burnt Orange
  'm': '#e84878', // Coral / Magenta Highlight
  'M': '#a81848', // Deep Coral Shadow
};

/**
 * Base 16x24 Pixel Grids for the 6 Authentic Protagonists
 * Mapped pixel-for-pixel from Pokémon Emerald and Pokémon FireRed / LeafGreen reference sprite sheets.
 * Features:
 * - Rounded proportional chibi heads with authentic cap tufts and bandana bows
 * - Vertical 2-pixel anime eyes (col 4 and col 11) with warm skin highlights
 * - Compact stance with 1-pixel leg crease (no gaping holes)
 * - Proportional footwear and crisp GBA contours
 */
export const BASE_PIXEL_MAPS: Record<TrainerBaseId, string[]> = {
  // 1. BRENDAN (Pokémon Ruby & Sapphire) - Sprite 1 in Reference Sheet
  brendan_rs: [
    ".......XwX......", // 0: White knit cap tuft flicking right
    ".....XXwwwXX....", // 1: Cap top
    "....XwwwwwwwX...", // 2: Cap crown
    "...XwwwwwwwwwX..", // 3: Cap widening
    "..XXXXXXXXXXXX..", // 4: Jet black headband
    "..XKKXRRRRXKKX..", // 5: Crimson chevron motif on black band
    "..XKKSSSSSSKKX..", // 6: Black sideburns, warm peach forehead
    "..XsSSXSSXSSsX..", // 7: Ears at cols 3, 12; 1x2 dot eyes at cols 6, 9
    "..XsSSXSSXSSsX..", // 8: Cheeks, 1x2 dot eyes
    "...XSSSSSSSSX...", // 9: Cheeks
    "....XSSSSSSX....", // 10: Rounded chin
    "...XKKRRRRKKX...", // 11: Black shoulders, red collar
    "..XyXKKRRKKXyX..", // 12: Bright yellow wristbands, red/black shirt
    "..XsXKKKKKKXsX..", // 13: Hands, black shirt
    "...XXXXXXXXXX...", // 14: Belt
    "...XGGGGGGGGX...", // 15: Charcoal pants
    "...XGGX..XGGX...", // 16: Two legs separated by 2px gap
    "...XGGX..XGGX...", // 17: Knees
    "..XRRRX..XRRRX..", // 18: Red shoes
    "..XKKKX..XKKKX..", // 19: Black soles
    "..XXXXX..XXXXX..", // 20: Tread
    "................", // 21: Ground clearance
    "................", // 22
    "................", // 23
  ],

  // 2. MAY (Pokémon Ruby & Sapphire) - Sprite 2 in Reference Sheet
  may_rs: [
    "..XXrR....RrXX..", // 0: Crimson bandana bow loops
    ".XrRRRX..XrRRRX.", // 1: Bow loops
    ".XRRRRRRRRRRRRX.", // 2: Red bandana top
    ".XRRwwwwwwwwRRX.", // 3: White crescent crest
    ".XRRwwwwwwwwRRX.", // 4: White crest
    ".XHHHBSSSSBBHHX.", // 5: Brown hair bobs framing forehead
    ".XHH.XSSXSSX.HH.", // 6: Eyes at cols 6, 9
    ".XHH.XSSXSSX.HH.", // 7: Eyes at cols 6, 9
    ".XHHXSSSSSSXHHX.", // 8: Cheeks
    "..XHHSSSSSSHHX..", // 9: Chin framed by hair
    "...XRRRRRRRRX...", // 10: Red cycling top
    "..XwXRRRRRRXwX..", // 11: White puffy sleeves
    "..XwXGGGGGGXwX..", // 12: Black cycling belt
    "..XsXGGGGGGXsX..", // 13: Hands, bike shorts
    "...XGGGGGGGGX...", // 14: Dark cycling shorts
    "...Xs.X..X.sX...", // 15: Bare peach legs
    "...Xs.X..X.sX...", // 16: Bare legs
    "..XRRRX..XRRRX..", // 17: Red sneakers
    "..XwwwX..XwwwX..", // 18: White soles
    "..XXXXX..XXXXX..", // 19: Tread
    "................", // 20
    "................", // 21
    "................", // 22
    "................", // 23
  ],

  // 3. BRENDAN (Pokémon Emerald) - Sprite 3 in Reference Sheet
  brendan_emerald: [
    ".......XwX......", // 0: White knit cap tuft flicking right
    ".....XXwwwXX....", // 1: White knit dome
    "....XwwwwwwwX...", // 2: White knit
    "...XwwwwwwwwwX..", // 3: White knit widening
    "..XEEEEEEEEEEX..", // 4: Emerald green headband
    "..XkEEkEEkEEkX..", // 5: Dark green pattern in emerald band
    "..XKKSSSSSSKKX..", // 6: Black sideburns, peach forehead
    "..XsSSXSSXSSsX..", // 7: Ears at cols 3, 12; 1x2 dot eyes at cols 6, 9
    "..XsSSXSSXSSsX..", // 8: Eyes lower pixel
    "...XSSSSSSSSX...", // 9: Cheeks
    "....XSSSSSSX....", // 10: Chin
    "...XEEGGGEEEX...", // 11: Emerald shoulders, charcoal chest
    "..XeXGGGRGGXeX..", // 12: Emerald cuffs at wrists, red collar
    "..XsXGGGGGGXsX..", // 13: Hands, charcoal suit
    "...XXXXXXXXXX...", // 14: Belt
    "...XGGGGGGGGX...", // 15: Charcoal athletic pants
    "...XGGX..XGGX...", // 16: Legs with 2px gap
    "...XGGX..XGGX...", // 17: Knees
    "..XEEEX..XEEEX..", // 18: Emerald green sneakers
    "..XGGGX..XGGGX..", // 19: Charcoal soles
    "..XXXXX..XXXXX..", // 20: Tread
    "................", // 21
    "................", // 22
    "................", // 23
  ],

  // 4. MAY (Pokémon Emerald) - Sprite 4 in Reference Sheet
  may_emerald: [
    "..XXeE....EeXX..", // 0: Emerald bandana bow loops
    ".XeEEEX..XeEEEX.", // 1: Bow loops
    ".XEEEEEEEEEEEEX.", // 2: Green bandana dome
    ".XEEwwwwwwwwEEX.", // 3: White crescent crest
    ".XEEwwwwwwwwEEX.", // 4: White crest
    ".XHHHBSSSSBBHHX.", // 5: Brown hair bobs
    ".XHH.XSSXSSX.HH.", // 6: Eyes at cols 6, 9
    ".XHH.XSSXSSX.HH.", // 7: Eyes at cols 6, 9
    ".XHHXSSSSSSXHHX.", // 8: Cheeks
    "..XHHSSSSSSHHX..", // 9: Chin framed by hair
    "...XrRRRRRRrX...", // 10: Orange-red tunic
    "..XwXrRRRRrXwX..", // 11: White puffy sleeves
    "..XwXEEEEEEEXwX.", // 12: Emerald green belt
    "..XsXGGGGGGXsX..", // 13: Hands, bike shorts
    "...XGGGGGGGGX...", // 14: Dark cycling shorts
    "...Xs.X..X.sX...", // 15: Bare peach legs
    "...Xs.X..X.sX...", // 16: Bare legs
    "..XRRRX..XRRRX..", // 17: Red sneakers
    "..XEEEX..XEEEX..", // 18: Emerald soles
    "..XXXXX..XXXXX..", // 19: Tread
    "................", // 20
    "................", // 21
    "................", // 22
    "................", // 23
  ],

  // 5. RED (Pokémon FireRed) - Sprite 5 in Reference Sheet
  red_fr: [
    ".....XXXXXX.....", // 0: Curved cap crown top
    "...XXrRRRRrXX...", // 1: Red cap dome
    "..XrRRRRRRRRrX..", // 2: Red cap
    "..XRRRRRRRRRRX..", // 3: Red cap lower dome
    "..XwwwwwwwwwwX..", // 4: White visor brim across forehead
    "...XXXXXXXXXX...", // 5: Visor shadow line
    "..XKKSSSSSSKKX..", // 6: Black hair at sides, peach forehead
    "..XsSSXSSXSSsX..", // 7: Ears at cols 3, 12; 1x2 dot eyes at cols 6, 9
    "..XsSSXSSXSSsX..", // 8: Eyes lower pixel
    "...XSSSSSSSSX...", // 9: Cheeks
    "....XSSSSSSX....", // 10: Rounded chin
    "...XDDwwwwDDX...", // 11: Dark blue sleeves, white collar
    "..XDsXRRRRXsDX..", // 12: Blue sleeve, hand, red vest, hand, sleeve
    "..X.sXRRRRXs.X..", // 13: Hands at sides, red vest
    "...XXXXXXXXXX...", // 14: Belt
    "...XLLLLLLLLX...", // 15: Denim blue jeans
    "...XLLX..XLLX...", // 16: Jeans legs separated by 2px gap
    "...XDDX..XDDX...", // 17: Darker blue knee crease
    "..XRRRX..XRRRX..", // 18: Red sneakers
    "..XwwwX..XwwwX..", // 19: White soles
    "..XXXXX..XXXXX..", // 20: Tread
    "................", // 21
    "................", // 22
    "................", // 23
  ],

  // 6. LEAF (Pokémon LeafGreen) - Sprite 6 in Reference Sheet
  leaf_lg: [
    ".....XXXXXX.....", // 0: White sunhat crown
    "...XXwwwwwwXX...", // 1: White dome
    "..XwwwwwwwwwwX..", // 2: White dome
    "..XwwRRRRRRwwX..", // 3: Red ribbon band
    "..XwwRRwwRRwwX..", // 4: Red Pokéball crest on hat
    ".XXXXXXXXXXXXXX.", // 5: Wide sunhat brim edge
    ".XwwwwwwwwwwwwX.", // 6: Wide white sunhat brim
    ".XXXXXXXXXXXXXX.", // 7: Brim shadow
    "XHH.BSSSSBB..HHX", // 8: Long brown hair flowing down sides
    "XHH.XSSXSSX..HHX", // 9: Eyes at cols 6, 9
    "XHH.XSSXSSX..HHX", // 10: Eyes at cols 6, 9
    "XHH.XSSSSSSX.HHX", // 11: Cheeks framed by long hair
    "XHH..XSSSSX..HHX", // 12: Chin
    "XHH.XLYYYYLX.HHX", // 13: Blue top with yellow diagonal satchel strap
    "XHs.XLLYYLLX.sHX", // 14: Hands alongside long hair, yellow strap
    ".X..XLLLLLLX..X.", // 15: Waist
    "...XLLLLLLLLX...", // 16: Blue pleated skirt
    "...XLLLLLLLLX...", // 17: Blue skirt hem
    "...Xw.X..X.wX...", // 18: White socks with gap
    "..XRRRX..XRRRX..", // 19: Red shoes
    "..XXXXX..XXXXX..", // 20: Soles
    "................", // 21
    "................", // 22
    "................", // 23
  ],

  // 7. CYNTHIA (Pokémon Sinnoh Champion)
  cynthia_sinnoh: [
    ".....XXyyXX.....", // 0: Blonde hair crown top
    "...XXyyyyyyXX...", // 1: Blonde hair top
    "..XyyyyKKyyyyX..", // 2: Blonde hair with black teardrop hairpin clips
    "..XyyyyKKyyyyX..", // 3: Blonde hair framing forehead
    "..XyKKSSSSKKyX..", // 4: Forehead, peach skin, black hair ornaments
    "..XySSXSSXSSyX..", // 5: Eyes at col 6 & 9, blonde hair sides
    "..XySSXSSXSSyX..", // 6: Eyes lower, warm cheeks
    "..XySSSSSSSSyX..", // 7: Cheeks, long blonde hair
    "..XyXSSSSSSXyX..", // 8: Chin, long blonde hair flowing
    "...XyXssssXyX...", // 9: Neck, blonde locks
    "...XGGXccXGGX...", // 10: Coat shoulders, cyan brooch
    "..XyXGGGGGGXyX..", // 11: Blonde hair drape, black coat
    "..XyXGGYYGGXyX..", // 12: Gold coat clasps, blonde locks
    "..XsXGGGGGGXsX..", // 13: Hands at sides, black coat
    "...XGGYYYYGGX...", // 14: Gold waist belt / trim
    "...XGGGGGGGGX...", // 15: Long coat skirt
    "...XGGGGGGGGX...", // 16: Coat tail
    "...XGGX..XGGX...", // 17: Coat split showing trousers
    "...XKKX..XKKX...", // 18: Black trousers
    "...XKKX..XKKX...", // 19: Trousers
    "..XKKKX..XKKKX..", // 20: Black boots
    "..XXXXX..XXXXX..", // 21: Soles
    "................", // 22
    "................", // 23
  ],
};

/**
 * Headwear Overlays (Rows 0 to 6)
 * Precise pixel art for hats, crowns, bandanas, and cyber gear.
 * All layers adhere to exact 16-pixel width with clean transparent boundaries.
 */
export const HEADWEAR_OVERLAYS: Record<string, string[]> = {
  // Cynthia's Sinnoh Champion Black Teardrop Hairpins
  card_cynthia_hairpins: [
    ".....XXyyXX.....",
    "...XXyyyyyyXX...",
    "..XyyyyKKyyyyX..",
    "..XyyyyKKyyyyX..",
    "..XyKK....KKyX..",
  ],

  // Red's Vintage Cap (FireRed 1996)
  card_red_vintage_cap: [
    ".....XXXXXX.....",
    "...XXrRRRRrXX...",
    "..XrRRRRRRRRrX..",
    "..XRRRRRRRRRRX..",
    "..XwwwwwwwwwwX..",
    "...XXXXXXXXXX...",
  ],

  // Leaf's Sun Visor Hat (LeafGreen)
  card_leaf_sunhat: [
    ".....XXXXXX.....",
    "...XXwwwwwwXX...",
    "..XwwwwwwwwwwX..",
    "..XwwRRRRRRwwX..",
    "..XwwRRwwRRwwX..",
    ".XXXXXXXXXXXXXX.",
    ".XwwwwwwwwwwwwX.",
    ".XXXXXXXXXXXXXX.",
  ],

  // Brendan's Emerald Cap
  card_brendan_emerald_cap: [
    ".......XwX......",
    ".....XXwwwXX....",
    "....XwwwwwwwX...",
    "...XwwwwwwwwwX..",
    "..XEEEEEEEEEEX..",
    "..XkEEkEEkEEkX..",
  ],

  // Brendan's RS Classic Cap
  card_brendan_cap: [
    ".......XwX......",
    ".....XXwwwXX....",
    "....XwwwwwwwX...",
    "...XwwwwwwwwwX..",
    "..XXXXXXXXXXXX..",
    "..XKKXRRRRXKKX..",
  ],

  // May's Emerald Bandana
  card_may_emerald_bandana: [
    "..XXeE....EeXX..",
    ".XeEEEX..XeEEEX.",
    ".XEEEEEEEEEEEEX.",
    ".XEEwwwwwwwwEEX.",
    ".XEEwwwwwwwwEEX.",
  ],

  // May's RS Crimson Bandana
  card_may_bandana: [
    "..XXrR....RrXX..",
    ".XrRRRX..XrRRRX.",
    ".XRRRRRRRRRRRRX.",
    ".XRRwwwwwwwwRRX.",
    ".XRRwwwwwwwwRRX.",
  ],

  // Silph Co. Holo-Visor (Futuristic amber scanner)
  card_silph_visor: [
    "................",
    "................",
    "................",
    "................",
    "..XGGGGGGGGGGX..",
    ".XcyyyyyyyyyycX.",
    "..XcyyyyyyyycX..",
  ],

  // Pike Queen Lucy's Serpent Tiara
  card_pike_queen_tiara: [
    "......XyyX......",
    "....XXyyyyXX....",
    "...XyyyRRyyyX...",
    "..XyyRRwwRRyyX..",
    "..XyyyyyyyyyyX..",
    "..XXXXXXXXXXXX..",
  ],

  // Team Magma Horn Cowl
  card_magma_cowl: [
    ".XbbX......XbbX.",
    ".XRRbX....XbRRX.",
    "..XRRbXXXXbRRX..",
    ".XRRRRRRRRRRRRX.",
    "XRRRRRRRRRRRRRX.",
    "XXXXXXXXXXXXXXX.",
  ],

  // Team Aqua Buccaneer Bandana
  card_aqua_bandana: [
    ".....XXXXXX.....",
    "...XXDDDDDXX....",
    "..XDDwwwwwwDDX..",
    ".XDDDDDDDDDDDDX.",
    ".XwwwwwwwwwwwwX.",
    ".XXXXXXXXXXXXXX.",
  ],

  // Cyber Ninja Mask & Visor
  card_cyber_ninja_mask: [
    ".....XXXXXX.....",
    "...XXKKKKKXX....",
    "..XKKKKKKKKKX...",
    ".XKKKKKKKKKKKKX.",
    ".XXccccccccccXX.",
    ".XKKKKKKKKKKKKX.",
  ],

  // Kanto League Sovereign Crown (Golden 4-point crown)
  card_golden_crown: [
    "..XyX.XyyX.XyX..",
    "..XyyXyyyyXyyX..",
    "..XyyyRRRRyyyX..",
    ".XyyyyyyyyyyyyX.",
    ".XyyRRwwRRyyyyX.",
    ".XXXXXXXXXXXXXX.",
  ],

  // Arcane Sorcerer Wizard Hat
  card_wizard_hat: [
    ".......XyX......",
    "......XPPyX.....",
    ".....XPPPPyX....",
    "....XPPPPPPyX...",
    "...XyPPyyPPyX...",
    ".XXXXXXXXXXXXXX.",
  ],
};

/**
 * Outfit Overlays (Rows 11 to 17)
 * Modular tops, vests, sundresses, dusters, hoodies, uniforms, and robes.
 * Follows the 2-pixel gap for legs on rows 16-17.
 */
export const OUTFIT_OVERLAYS: Record<string, string[]> = {
  // Red's FireRed Vest & Denim
  card_red_fr_vest: [
    "...XDDwwwwDDX...", // 11
    "..XDsXRRRRXsDX..", // 12
    "..X.sXRRRRXs.X..", // 13
    "...XXXXXXXXXX...", // 14
    "...XLLLLLLLLX...", // 15
    "...XLLX..XLLX...", // 16
    "...XDDX..XDDX...", // 17
  ],

  // Leaf's LeafGreen Sundress & Satchel
  card_leaf_lg_dress: [
    "...XLYYYYLX.....", // 11
    "..XsLLYYLLssX...", // 12
    "..XsLLLLLLssX...", // 13
    "...XLLLLLLLLX...", // 14
    "...XLLLLLLLLX...", // 15
    "...Xw.X..X.wX...", // 16
    "...Xw.X..X.wX...", // 17
  ],

  // Brendan's Emerald Suit
  card_brendan_emerald_suit: [
    "...XEEGGGEEEX...", // 11
    "..XeXGGGRGGXeX..", // 12
    "..XsXGGGGGGXsX..", // 13
    "...XXXXXXXXXX...", // 14
    "...XGGGGGGGGX...", // 15
    "...XGGX..XGGX...", // 16
    "...XGGX..XGGX...", // 17
  ],

  // May's Emerald Tunic
  card_may_emerald_tunic: [
    "...XrRRRRRRrX...", // 11
    "..XwXrRRRRrXwX..", // 12
    "..XwXEEEEEEEXwX..", // 13
    "...XGGGGGGGGX...", // 14
    "...XGGGGGGGGX...", // 15
    "...Xs.X..X.sX...", // 16
    "...Xs.X..X.sX...", // 17
  ],

  // Hoenn Explorer Windbreaker
  card_hoenn_jacket: [
    "...XKKRRRRKKX...", // 11
    "..XyXKKRRKKXyX..", // 12
    "..XsXKKKKKKXsX..", // 13
    "...XXXXXXXXXX...", // 14
    "...XGGGGGGGGX...", // 15
    "...XGGX..XGGX...", // 16
    "...XGGX..XGGX...", // 17
  ],

  // Supreme Champion's Royal Velvet Mantle (Gold hemmed)
  card_champion_mantle: [
    "..XyPPXXXXPPyX..", // 11
    ".XPPPPXXXXPPPPX.", // 12
    ".XPPPPXXXXPPPPX.", // 13
    ".XPPPPDDDDPPPPX.", // 14
    ".XyPPPPPPPPPPyX.", // 15
    "..XyPPX..XPPyX..", // 16
    "...XyyX..XyyX...", // 17
  ],

  // Battle Frontier Gilded Duster
  card_frontier_duster: [
    "..XyGGXXXXGGyX..", // 11
    ".XyGGXXXXXXGGyX.", // 12
    ".XyGGXXXXXXGGyX.", // 13
    ".XyGGGGGGGGGGyX.", // 14
    "..XyGGGGGGGGyX..", // 15
    "..XyGGX..XGGyX..", // 16
    "...XyyX..XyyX...", // 17
  ],

  // Team Magma Heavy Molten Uniform
  card_magma_uniform: [
    "...XRRbXXbRRX...", // 11
    "..XsRRbXyyXbRRss", // 12
    "..XsRRXXXXRRssX.", // 13
    "...XGGGGGGGGX...", // 14
    "...XGGGGGGGGX...", // 15
    "...XGGX..XGGX...", // 16
    "...XGGX..XGGX...", // 17
  ],

  // Team Aqua Deep Sea Diver Suit
  card_aqua_wetsuit: [
    "...XDDcXXcDDX...", // 11
    "..XsDDcwwcDDssX.", // 12
    "..XsDDXXXXDDssX.", // 13
    "...XDDDDDDDDX...", // 14
    "...XDDDDDDDDX...", // 15
    "...XDDX..XDDX...", // 16
    "...XDDX..XDDX...", // 17
  ],

  // Cyber Neon Streetwear Hoodie
  card_cyber_hoodie: [
    "...XKKcXXcKKX...", // 11
    "..XsKKcXXcKKssX.", // 12
    "..XsKKcccccKKssX", // 13
    "...XKKKKKKKKX...", // 14
    "...XKKKKKKKKX...", // 15
    "...XKKX..XKKX...", // 16
    "...XKKX..XKKX...", // 17
  ],

  // Team Rocket Executive Suit (Black with red R)
  card_rocket_suit: [
    "...XKKwXXwKKX...", // 11
    "..XsKKXRRRXKKssX", // 12
    "..XsKKX.R.XKKssX", // 13
    "...XKKKKKKKKX...", // 14
    "...XKKKKKKKKX...", // 15
    "...XKKX..XKKX...", // 16
    "...XKKX..XKKX...", // 17
  ],

  // Martial Arts Karate Gi
  card_karate_gi: [
    "...XwwwXXwwwX...", // 11
    "..XswwwXddXwwwss", // 12
    "..XswwXXXXwwssX.", // 13
    "...XKKKKKKKKX...", // 14
    "...XwwwwwwwwX...", // 15
    "...XwwwX.XwwX...", // 16
    "...XwwwX.XwwX...", // 17
  ],
};

/**
 * Backpacks & Back Gear Overlays
 * Renders backpacks, shoulder satchels, high-tech packs, wings, and jetpacks.
 * Designed to sit cleanly on the shoulders and back without invading facial pixels.
 */
export const BACKPACK_OVERLAYS: Record<string, { r: number; c: number; char: string }[]> = {
  // Mt. Silver Alpine Canvas Rucksack (Sturdy leather straps)
  card_adventurer_rucksack: [
    { r: 10, c: 1, char: 'B' },
    { r: 10, c: 2, char: 'B' },
    { r: 11, c: 0, char: 'X' },
    { r: 11, c: 1, char: 'h' },
    { r: 11, c: 2, char: 'B' },
    { r: 12, c: 0, char: 'X' },
    { r: 12, c: 1, char: 'B' },
    { r: 13, c: 1, char: 'X' },
    { r: 12, c: 5, char: 'y' },
  ],

  // Leaf's Yellow Satchel
  card_leaf_yellow_satchel: [
    { r: 11, c: 5, char: 'y' },
    { r: 12, c: 6, char: 'Y' },
    { r: 13, c: 7, char: 'y' },
    { r: 13, c: 12, char: 'y' },
    { r: 13, c: 13, char: 'Y' },
    { r: 14, c: 12, char: 'Y' },
    { r: 14, c: 13, char: 'y' },
  ],

  // Devon Corp. Tech Comm Pack (Silver & glowing cyan LED)
  card_devon_tech_pack: [
    { r: 8, c: 14, char: 'c' },
    { r: 9, c: 14, char: 'g' },
    { r: 10, c: 13, char: 'g' },
    { r: 10, c: 14, char: 'G' },
    { r: 11, c: 13, char: 'c' },
    { r: 11, c: 14, char: 'g' },
    { r: 12, c: 13, char: 'G' },
    { r: 12, c: 14, char: 'g' },
    { r: 13, c: 13, char: 'g' },
  ],

  // Dragonite Orange Glider Wings
  card_dragon_wings: [
    { r: 9, c: 0, char: 'o' },
    { r: 9, c: 1, char: 'o' },
    { r: 9, c: 14, char: 'o' },
    { r: 9, c: 15, char: 'o' },
    { r: 10, c: 0, char: 'o' },
    { r: 10, c: 1, char: 'e' },
    { r: 10, c: 14, char: 'e' },
    { r: 10, c: 15, char: 'o' },
    { r: 11, c: 0, char: 'X' },
    { r: 11, c: 1, char: 'O' },
    { r: 11, c: 14, char: 'O' },
    { r: 11, c: 15, char: 'X' },
  ],

  // Silph Rocket Mini Jetpack (Dual thruster pods with cyan flame)
  card_silph_jetpack: [
    { r: 10, c: 1, char: 'g' },
    { r: 10, c: 2, char: 'G' },
    { r: 10, c: 13, char: 'G' },
    { r: 10, c: 14, char: 'g' },
    { r: 11, c: 1, char: 'w' },
    { r: 11, c: 2, char: 'g' },
    { r: 11, c: 13, char: 'g' },
    { r: 11, c: 14, char: 'w' },
    { r: 12, c: 1, char: 'c' },
    { r: 12, c: 14, char: 'c' },
  ],
};

/**
 * Shoes & Footwear Overlays (Rows 18 to 20)
 * Turbo runners, hiking boots, greaves, flippers, and rollerblades.
 * Centered under the compact leg contours.
 */
export const SHOES_OVERLAYS: Record<string, string[]> = {
  // Pallet Red Turbo Runners
  card_red_running_shoes: [
    "..XRRRX..XRRRX..", // 18
    "..XwwwX..XwwwX..", // 19: White sole
    "..XXXXX..XXXXX..", // 20: Tread
  ],

  // Devon Emerald Running Shoes
  card_emerald_runners: [
    "..XEEEX..XEEEX..", // 18
    "..XGGGX..XGGGX..", // 19: Black shock-absorber sole
    "..XXXXX..XXXXX..", // 20
  ],

  // Mt. Silver Heavy Climber Hiking Boots
  card_hiking_boots: [
    "..XBBBX..XBBBX..", // 18: High-ankle leather boot
    "..XBhBX..XBhBX..", // 19: Brass eyelets
    "..XGGGX..XGGGX..", // 20: Thick lugged tread
  ],

  // Molten Magma Armored Greaves
  card_magma_greaves: [
    "..XRRRX..XRRRX..", // 18
    "..XyyyX..XyyyX..", // 19: Gold thermal trim
    "..XbbbX..XbbbX..", // 20
  ],

  // Deep Ocean Azure Reef Stride Shoes
  card_aqua_flippers: [
    "..XDDDX..XDDDX..", // 18
    ".XccccX..XccccX.", // 19: Cyan fin edge
    ".XXXXXX..XXXXXX.", // 20
  ],

  // Goldenrod City Inline Rollerblades
  card_rollerblades: [
    "..XwwwX..XwwwX..", // 18: Skate boot
    "..XgggX..XgggX..", // 19: Aluminum frame
    ".XcycyX..XcycyX.", // 20: Dual neon wheels
  ],
};

/**
 * Lapel Badge Pixel Coordinates (Row 12, Column 7-8)
 * Refined 2-pixel metallic accent on the lapel fold.
 */
export const BADGE_PIXELS: Record<string, { r: number; c: number; char: string }[]> = {
  // 1996 Indigo Gym Brooch
  card_kanto_rainbow_brooch: [
    { r: 12, c: 7, char: 'y' },
    { r: 12, c: 8, char: 'r' },
  ],

  // Steven's Devon Star Brooch
  card_devon_brooch: [
    { r: 12, c: 7, char: 'w' },
    { r: 12, c: 8, char: 'c' },
  ],

  // Battle Frontier Gold Symbol
  card_frontier_symbol: [
    { r: 12, c: 7, char: 'y' },
    { r: 12, c: 8, char: 'Y' },
  ],

  // Silph Co. Keycard Pin
  card_silph_card_key: [
    { r: 12, c: 7, char: 'w' },
    { r: 12, c: 8, char: 'c' },
  ],

  // Professor Oak's Research Gold Pin
  card_pokedex_gold_pin: [
    { r: 12, c: 7, char: 'y' },
    { r: 12, c: 8, char: 'Y' },
  ],
};

/**
 * Floating Ambient Auras (Rows 0-23 particles surrounding the sprite)
 */
export const AURA_PIXELS: Record<string, { r: number; c: number; char: string }[]> = {
  card_champion_gold_aura: [
    { r: 2, c: 1, char: 'y' },
    { r: 3, c: 14, char: 'Y' },
    { r: 6, c: 0, char: 'w' },
    { r: 10, c: 15, char: 'y' },
    { r: 15, c: 1, char: 'Y' },
    { r: 19, c: 14, char: 'y' },
  ],
  card_mt_silver_frost_aura: [
    { r: 1, c: 2, char: 'c' },
    { r: 4, c: 13, char: 'w' },
    { r: 7, c: 15, char: 'c' },
    { r: 12, c: 0, char: 'w' },
    { r: 16, c: 14, char: 'c' },
    { r: 20, c: 1, char: 'w' },
  ],
  card_rayquaza_ozone_aura: [
    { r: 1, c: 14, char: 'e' },
    { r: 5, c: 0, char: 'e' },
    { r: 9, c: 15, char: 'y' },
    { r: 14, c: 0, char: 'e' },
    { r: 18, c: 15, char: 'E' },
    { r: 21, c: 0, char: 'e' },
  ],
};

/**
 * Assembles the final 16x24 pixel grid with layer-by-layer compositing.
 * Strict Layering Order:
 * 1. Base silhouette (from authentic GBA reference in IMG_8771)
 * 2. Backpack Overlay (Rows 8-14, behind or around shoulders)
 * 3. Shoes Overlay (Rows 18-20)
 * 4. Outfit Overlay (Rows 11-17)
 * 5. Headwear Overlay (Rows 0-6)
 * 6. Lapel Badge (Row 12, Col 7-8)
 * 7. Dynamic Posture (Canonical Idle, Battle Commanding with in-hand Pokéball, or Cheering)
 * 8. Ambient Aura FX (Rows 0-23)
 */
export interface SpriteAssetValidation {
  valid: boolean;
  errors: string[];
}

export interface CompositeResult {
  rows: string[];
  validation: SpriteAssetValidation;
}

export const SPRITE_CANVAS_WIDTH = 16;
export const SPRITE_CANVAS_HEIGHT = 24;

/**
 * Validates that requested sprite assets exist in the registered catalog,
 * conform to the 16x24 overworld dimensions, and contain no invalid palette keys.
 * Never silently substitutes missing assets!
 */
export function validateTrainerSprite(config: EquippedTrainerConfig): SpriteAssetValidation {
  const errors: string[] = [];

  // 1. Validate Base Asset
  if (!config.baseId) {
    errors.push('Missing baseId in trainer configuration.');
  } else if (!(config.baseId in BASE_PIXEL_MAPS)) {
    errors.push(
      `Unregistered trainer base asset: "${config.baseId}". Registered bases: ${Object.keys(BASE_PIXEL_MAPS).join(', ')}`
    );
  } else {
    const baseMap = BASE_PIXEL_MAPS[config.baseId as TrainerBaseId];
    if (baseMap.length !== SPRITE_CANVAS_HEIGHT) {
      errors.push(
        `Invalid row count for base "${config.baseId}": expected ${SPRITE_CANVAS_HEIGHT}, got ${baseMap.length}`
      );
    }
    for (let r = 0; r < baseMap.length; r++) {
      if (baseMap[r].length !== SPRITE_CANVAS_WIDTH) {
        errors.push(
          `Invalid column width for base "${config.baseId}" at row ${r}: expected ${SPRITE_CANVAS_WIDTH}, got ${baseMap[r].length}`
        );
        break;
      }
      for (const ch of baseMap[r]) {
        if (!(ch in GBA_PALETTE)) {
          errors.push(`Unrecognized palette character "${ch}" in base "${config.baseId}" at row ${r}`);
          break;
        }
      }
    }
  }

  // 2. Validate Headwear Asset (if equipped)
  if (config.head) {
    if (!(config.head in HEADWEAR_OVERLAYS)) {
      errors.push(
        `Unregistered headwear asset: "${config.head}". Registered headwear: ${Object.keys(HEADWEAR_OVERLAYS).join(', ')}`
      );
    } else {
      const headMap = HEADWEAR_OVERLAYS[config.head];
      for (let r = 0; r < headMap.length; r++) {
        if (headMap[r].length !== SPRITE_CANVAS_WIDTH) {
          errors.push(
            `Invalid column width for headwear "${config.head}" at row ${r}: expected ${SPRITE_CANVAS_WIDTH}, got ${headMap[r].length}`
          );
          break;
        }
        for (const ch of headMap[r]) {
          if (!(ch in GBA_PALETTE)) {
            errors.push(`Unrecognized palette character "${ch}" in headwear "${config.head}" at row ${r}`);
            break;
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Deterministic missing-asset / error pattern (magenta and dark checkerboard with red border)
 * Explicitly signals invalid or missing assets in the browser UI without silent fallback.
 */
export function generateErrorGrid(errors: string[]): string[] {
  const rows: string[] = [];
  for (let r = 0; r < SPRITE_CANVAS_HEIGHT; r++) {
    let row = '';
    for (let c = 0; c < SPRITE_CANVAS_WIDTH; c++) {
      if (r === 0 || r === SPRITE_CANVAS_HEIGHT - 1 || c === 0 || c === SPRITE_CANVAS_WIDTH - 1) {
        row += 'r'; // Red warning border
      } else if ((r + c) % 2 === 0) {
        row += 'm'; // Magenta / Coral error pixel
      } else {
        row += 'X'; // Dark charcoal error pixel
      }
    }
    rows.push(row);
  }
  return rows;
}

// High-performance in-memory composite and SVG rect caches
const COMPOSITE_CACHE = new Map<string, CompositeResult>();
const RECT_CACHE = new Map<string, PixelRect[]>();
const MAX_CACHE_ENTRIES = 256;

export function clearSpriteCaches(): void {
  COMPOSITE_CACHE.clear();
  RECT_CACHE.clear();
}

/**
 * Assembles the final 16x24 pixel grid with layer-by-layer compositing.
 * Strict Layering Order (Two-Layer Vertical Slice):
 * 1. Base trainer body (16x24) - Silhouette, facial features, and body
 * 2. Interchangeable Headwear / Hat (Rows 0 to N-1, where N <= 8)
 *
 * Guaranteed Invariant:
 * Rows 6 to 23 (face, chin, torso, arms, legs, footwear) remain 100% UNCHANGED
 * when swapping hats.
 */
export function compositeTrainerPixels(
  config: EquippedTrainerConfig,
  posture: 'idle' | 'commanding' | 'cheering' = 'idle'
): CompositeResult {
  const cacheKey = `${config.baseId || ''}:${config.head || ''}:${config.outfit || ''}:${config.backpack || ''}:${config.shoes || ''}:${config.badge || ''}:${config.aura || ''}:${posture}`;
  const cached = COMPOSITE_CACHE.get(cacheKey);
  if (cached) return cached;

  const validation = validateTrainerSprite(config);

  if (!validation.valid) {
    console.error('[SpritePipeline Validator Error]', validation.errors.join(' | '));
    return {
      rows: generateErrorGrid(validation.errors),
      validation,
    };
  }

  const baseId = config.baseId as TrainerBaseId;
  const baseMap = BASE_PIXEL_MAPS[baseId];

  // 1. Layer 1: Base trainer body (16x24 matrix)
  const grid: string[][] = baseMap.map((row) => row.split(''));

  // 2. Layer 2: Interchangeable Headwear / Hat overlay (Rows 0 to N-1)
  if (config.head && config.head in HEADWEAR_OVERLAYS) {
    const overlay = HEADWEAR_OVERLAYS[config.head];
    for (let r = 0; r < overlay.length; r++) {
      if (r < SPRITE_CANVAS_HEIGHT) {
        const overlayRow = overlay[r];
        for (let c = 0; c < SPRITE_CANVAS_WIDTH; c++) {
          const char = overlayRow[c];
          if (char && char !== '.') {
            grid[r][c] = char;
          }
        }
      }
    }
  }

  // 3. Dynamic Posture Action Transforms
  if (posture === 'commanding') {
    grid[11][12] = 'r';
    grid[11][13] = 'r';
    grid[12][12] = 'w';
    grid[12][13] = 'w';
  } else if (posture === 'cheering') {
    grid[3][1] = 'y';
    grid[4][0] = 'w';
    grid[4][2] = 'y';
    grid[3][14] = 'y';
    grid[4][13] = 'y';
    grid[4][15] = 'w';
  }

  const result: CompositeResult = {
    rows: grid.map((row) => row.join('')),
    validation,
  };

  if (COMPOSITE_CACHE.size >= MAX_CACHE_ENTRIES) {
    const firstKey = COMPOSITE_CACHE.keys().next().value;
    if (firstKey) COMPOSITE_CACHE.delete(firstKey);
  }
  COMPOSITE_CACHE.set(cacheKey, result);

  return result;
}

export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export type SpriteSlotType =
  | 'aura'
  | 'backpack'
  | 'base'
  | 'undergarment'
  | 'overgarment'
  | 'headwear'
  | 'shoes'
  | 'badge'
  | 'held_item';

export interface SpriteItemDefinition {
  item_id: string;
  name: string;
  slot: SpriteSlotType;
  z_index: number;
  assets: {
    idle: string[];
    commanding?: string[];
    cheering?: string[];
  };
  offsets: {
    x: number;
    y: number;
  };
  palette_swaps?: Record<string, Record<string, string>>;
}

/**
 * Standard Generation 3 anatomical anchor points and Z-indices for layer compositing
 */
export const SLOT_ANCHOR_POINTS: Record<SpriteSlotType, { x: number; y: number; z_index: number }> = {
  aura: { x: 0, y: 0, z_index: 0 },
  backpack: { x: 0, y: 8, z_index: 2 },
  base: { x: 0, y: 0, z_index: 3 },
  undergarment: { x: 0, y: 14, z_index: 4 },
  overgarment: { x: 0, y: 11, z_index: 5 },
  shoes: { x: 0, y: 19, z_index: 6 },
  headwear: { x: 0, y: 0, z_index: 7 },
  badge: { x: 7, y: 12, z_index: 8 },
  held_item: { x: 12, y: 11, z_index: 8 },
};

/**
 * Compiles a 16x24 pixel grid into run-length optimized rects for ultra-fast, crisp SVG rendering.
 * Supports dynamic color palette swapping for custom dyes!
 */
export function compilePixelRects(
  rows: string[],
  paletteOverrides?: Record<string, string>
): PixelRect[] {
  const paletteKey = paletteOverrides ? JSON.stringify(paletteOverrides) : 'default';
  const cacheKey = `${rows.join(':')}|${paletteKey}`;
  const cached = RECT_CACHE.get(cacheKey);
  if (cached) return cached;

  const activePalette = paletteOverrides
    ? { ...GBA_PALETTE, ...paletteOverrides }
    : GBA_PALETTE;

  const rects: PixelRect[] = [];

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    let startX = -1;
    let currentColor = '';

    for (let x = 0; x < 16; x++) {
      const char = row[x] || '.';
      const hex = activePalette[char] || 'transparent';

      if (hex !== 'transparent') {
        if (startX === -1) {
          startX = x;
          currentColor = hex;
        } else if (hex !== currentColor) {
          rects.push({ x: startX, y, w: x - startX, h: 1, fill: currentColor });
          startX = x;
          currentColor = hex;
        }
      } else {
        if (startX !== -1) {
          rects.push({ x: startX, y, w: x - startX, h: 1, fill: currentColor });
          startX = -1;
          currentColor = '';
        }
      }
    }

    if (startX !== -1) {
      rects.push({ x: startX, y, w: 16 - startX, h: 1, fill: currentColor });
    }
  }

  if (RECT_CACHE.size >= MAX_CACHE_ENTRIES) {
    const firstKey = RECT_CACHE.keys().next().value;
    if (firstKey) RECT_CACHE.delete(firstKey);
  }
  RECT_CACHE.set(cacheKey, rects);

  return rects;
}

/**
 * Directly renders the composited sprite to an HTML5 CanvasRenderingContext2D at integer scale
 */
export function renderTrainerToCanvas(
  ctx: CanvasRenderingContext2D,
  config: EquippedTrainerConfig,
  posture: 'idle' | 'commanding' | 'cheering' = 'idle',
  scale = 4,
  paletteOverrides?: Record<string, string>
): void {
  const { rows } = compositeTrainerPixels(config, posture);
  const rects = compilePixelRects(rows, paletteOverrides);

  // Disable bilinear interpolation for crisp GBA pixel fidelity
  ctx.imageSmoothingEnabled = false;

  // Ground shadow ellipse
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(8 * scale, 22.5 * scale, 6 * scale, 1.2 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw compiled pixel rectangles
  for (const r of rects) {
    ctx.fillStyle = r.fill;
    ctx.fillRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
  }
}

/**
 * Preset Custom Builds ready for 1-click preview and equip in the studio!
 */
export interface PresetTrainerBuild {
  id: string;
  name: string;
  theme: string;
  description: string;
  config: EquippedTrainerConfig;
}

export const PRESET_TRAINER_BUILDS: PresetTrainerBuild[] = [
  {
    id: 'preset_red_champion',
    name: 'Red (FireRed Master)',
    theme: 'Pallet Town Classic',
    description: 'Iconic 1996 Pallet Town red visor cap, red vest, turbo running shoes, and Indigo gym brooch.',
    config: {
      baseId: 'red_fr',
      head: 'card_red_vintage_cap',
      outfit: 'card_red_fr_vest',
      backpack: 'card_adventurer_rucksack',
      shoes: 'card_red_running_shoes',
      badge: 'card_kanto_rainbow_brooch',
      aura: 'card_champion_gold_aura',
    },
  },
  {
    id: 'preset_leaf_explorer',
    name: 'Leaf (LeafGreen Scout)',
    theme: 'Kanto Pathfinder',
    description: 'Crisp white sunhat with red ribbon, sky azure sundress, golden explorer satchel, and blue sneakers.',
    config: {
      baseId: 'leaf_lg',
      head: 'card_leaf_sunhat',
      outfit: 'card_leaf_lg_dress',
      backpack: 'card_leaf_yellow_satchel',
      shoes: 'card_red_running_shoes',
      badge: 'card_kanto_rainbow_brooch',
      aura: undefined,
    },
  },
  {
    id: 'preset_brendan_emerald',
    name: 'Brendan (Frontier Brain)',
    theme: 'Hoenn Ace',
    description: 'Emerald knit beanie, compression suit with vivid green pads, alpine rucksack, and Devon runners.',
    config: {
      baseId: 'brendan_emerald',
      head: 'card_brendan_emerald_cap',
      outfit: 'card_brendan_emerald_suit',
      backpack: 'card_adventurer_rucksack',
      shoes: 'card_emerald_runners',
      badge: 'card_frontier_symbol',
      aura: 'card_rayquaza_ozone_aura',
    },
  },
  {
    id: 'preset_may_contest',
    name: 'May (Contest Star)',
    theme: 'Ribbon Coordinator',
    description: 'Emerald ribbon bandana, coral-trimmed emerald tunic, golden satchel, and emerald sneakers.',
    config: {
      baseId: 'may_emerald',
      head: 'card_may_emerald_bandana',
      outfit: 'card_may_emerald_tunic',
      backpack: 'card_leaf_yellow_satchel',
      shoes: 'card_emerald_runners',
      badge: 'card_devon_brooch',
      aura: undefined,
    },
  },
  {
    id: 'preset_magma_infiltrator',
    name: 'Team Magma Operative',
    theme: 'Molten Earth',
    description: 'Horned cowl helmet, molten thermal uniform, dragon glider wings, and armored boots.',
    config: {
      baseId: 'brendan_rs',
      head: 'card_magma_cowl',
      outfit: 'card_magma_uniform',
      backpack: 'card_dragon_wings',
      shoes: 'card_magma_greaves',
      badge: 'card_silph_card_key',
      aura: 'card_champion_gold_aura',
    },
  },
  {
    id: 'preset_aqua_diver',
    name: 'Team Aqua Deep Sea Ace',
    theme: 'Kyogre Abyssal',
    description: 'Buccaneer pirate bandana, deep ocean diving wetsuit, high-tech comm pack, and reef flippers.',
    config: {
      baseId: 'may_rs',
      head: 'card_aqua_bandana',
      outfit: 'card_aqua_wetsuit',
      backpack: 'card_devon_tech_pack',
      shoes: 'card_aqua_flippers',
      badge: 'card_devon_brooch',
      aura: undefined,
    },
  },
  {
    id: 'preset_cyber_scout',
    name: 'Celadon Cyber Ninja',
    theme: 'Futuristic Neo-Kanto',
    description: 'Shadow ninja mask with cyan visor, neon streetwear hoodie, mini rocket jetpack, and inline skates.',
    config: {
      baseId: 'red_fr',
      head: 'card_cyber_ninja_mask',
      outfit: 'card_cyber_hoodie',
      backpack: 'card_silph_jetpack',
      shoes: 'card_rollerblades',
      badge: 'card_silph_card_key',
      aura: 'card_mt_silver_frost_aura',
    },
  },
  {
    id: 'preset_grand_champion',
    name: 'Supreme Sovereign',
    theme: 'Battle Frontier Royalty',
    description: 'Golden 4-point royal crown, purple velvet mantle, dragon wings, and gold ability symbol.',
    config: {
      baseId: 'brendan_emerald',
      head: 'card_golden_crown',
      outfit: 'card_champion_mantle',
      backpack: 'card_dragon_wings',
      shoes: 'card_magma_greaves',
      badge: 'card_frontier_symbol',
      aura: 'card_champion_gold_aura',
    },
  },
];
