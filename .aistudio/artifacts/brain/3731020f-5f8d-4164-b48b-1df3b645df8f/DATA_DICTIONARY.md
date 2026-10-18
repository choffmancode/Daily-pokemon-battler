# Battle Red — Data Dictionary & Entity Reference

## 1. Pokémon & Battle Models (`src/game/types.ts`)

### `Pokemon`
| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique entity identifier (e.g., `'mon_pikachu_01'`) |
| `species` | `string` | Species name (e.g., `'Pikachu'`, `'Charizard'`, `'Lucario'`) |
| `types` | `PokemonType[]` | Primary & secondary elemental types (Gen 3-9 standard) |
| `level` | `number` | Battle level (default: 100) |
| `maxHp` | `number` | Maximum Hit Points |
| `currentHp` | `number` | Real-time Hit Points remaining |
| `baseStats` | `Record<string, number>` | `{ hp, attack, defense, spAtk, spDef, speed }` |
| `statStages` | `Record<string, number>` | In-battle stat buffs/debuffs from -6 to +6 |
| `moves` | `Move[]` | 4 equipped combat moves with PP tracking |
| `ability` | `string` | Passive ability (e.g., `'Static'`, `'Blaze'`, `'Inner Focus'`) |
| `spriteFront` | `string` | High-res Showdown/Gen 5 front animated/static sprite URL |
| `spriteBack` | `string` | Back battle view sprite URL |
| `fainted` | `boolean` | `true` when `currentHp <= 0` |
| `statusCondition` | `StatusCondition` | `'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | null` |

---

## 2. Gen 3 Customization Motif System (`src/game/data/cosmetics.ts`)

### A. Universal Pokémon Items (`wearableOn: 'All Pokémon'`)
| ID | Item Name | Motif & Role | Gen 3 2D Pixel Sprite | Visual Layer Overlay |
|---|---|---|---|---|
| `card_focus_band` | Focus Band (気合いのハチマキ) | Tenacity & Survival | White/crimson tied headband with knot | Forehead headband with fluttering tails |
| `card_silk_scarf` | Silk Scarf (絹のマフラー) | Normal Boost & Mystery Dungeon | Crimson silk loop with gold ring | Collar scarf with trailing ends |
| `card_kings_rock` | King's Rock Crown (王者の印) | Flinch & Regal Authority | 5-point gold crown with ruby | Tilted crown with sparkle |
| `card_leftovers_bell` | Leftovers Chime Bell (安らぎの残飯鈴) | Recovery & Chime | Brass chime bell with clover leaf | Bell on collar with soft recovery gleam |
| `card_choice_scarf` | Choice Scarf (こだわりスカーフ) | Speed Blitz & Velocity | Cyan/indigo speed scarf with chevrons | Trailing speed scarf with wind lines |
| `card_scope_lens` | Scope Lens Monocle (ピントレンズ) | Critical Hit Glint | Brass monocle with crosshair lens | Crosshair lens over eye with glint |
| `card_black_glasses` | Black Glasses Shades (黒いメガネ) | Cool Squad Leader | Jet-black shades with white glare | Dark sunglasses across eyes |
| `card_exp_share` | EXP Share Circlet (学習装置ティアラ) | Silph Co. Tech | Silver tiara with teal LED core | Silver antenna circlet with blinking LED |
| `card_everstone` | Everstone Amulet (変わらずの石) | Ancient Runic Stasis | Dark obsidian rune river stone | Runic pendant with purple stasis glow |
| `card_miracle_seed` | Miracle Seed Sprout (奇跡の種ピン) | Verdant Life | Twin emerald leaf sprout clip | Green sprout pinned near ear with leaves |
| `card_charcoal` | Charcoal Hearth Ember (木炭の炉火) | Smoldering Fire | Fissured charcoal with fire fissures | Ember talisman with floating sparks |
| `card_mystic_water` | Mystic Water Teardrop (神秘の雫玉) | Deep Ocean Clarity | Sapphire crystal teardrop | Floating azure water gem with ripple |
| `card_magnet` | Magnet Clasp Brooch (磁石の留め具) | High Voltage Flux | Red & blue horseshoe magnet | Magnet with crackling yellow sparks |
| `card_soothe_bell` | Soothe Bell Bow (安らぎの鈴リボン) | Friendship & Joy | Lavender bow with chime bell | Lavender ribbon bell with heart sparks |
| `card_shiny_star` | Shiny Starburst Aura (色違いの星輝) | 1-in-8192 Legendary Radiance | 4-pointed gold/cyan starburst | Orbiting star sparkles and shimmer ring |

### B. Trainer Customization Items (`wearableOn: 'Trainer'`)
| ID | Item Name | Slot | Gen 3 Pixel Sprite | Description |
|---|---|---|---|---|
| `card_brendan_cap` | Brendan's Hoenn Knit Beanie | `trainer_head` | White beanie with emerald trim | Classic Hoenn protagonist cap |
| `card_may_bandana` | May's Emerald Ribbon Bandana | `trainer_head` | Emerald folded bandana with crest | Classic May contest bandana |
| `card_red_vintage_cap` | Red's Pallet Vintage Cap | `trainer_head` | Red/white baseball cap with visor | 1996 Pallet Town traveler cap |
| `card_silph_visor` | Silph Co. Holo-Visor | `trainer_head` | Amber tech battle eyepiece | Silph Scope modernized visor |
| `card_devon_brooch` | Steven's Devon Star Brooch | `trainer_badge` | Silver star with meteorite core | Lapel brooch from Steven Stone |
| `card_badge_case` | Hoenn Mahogany Badge Case | `trainer_badge` | Mahogany case with 8 badges | All 8 Hoenn Gym Badges |
| `card_frontier_symbol` | Battle Frontier Gold Symbol | `trainer_badge` | Gilded hexagonal frontier crest | Frontier Brain master symbol |
| `card_hoenn_jacket` | Hoenn Explorer Windbreaker | `trainer_outfit` | Red/slate expedition jacket | Tactical windbreaker with utility belt |
| `card_champion_mantle` | Supreme Champion's Royal Mantle | `trainer_outfit` | Midnight violet mantle with gold | Flowing imperial League mantle |
| `card_team_vest` | Syndicate Tactical Dual Vest | `trainer_outfit` | Red & blue tactical vest | Marine & magma dual contrast vest |
| `card_ember_aura` | Mt. Chimney Volcanic Ember Halo | `trainer_aura` | Drifting ember particles | Volcanic soot and warm embers |
| `card_raindrop_halo` | Sootopolis Raindrop Ripple Halo | `trainer_aura` | Concentric cyan water ripples | Sunken crater gentle rain mist |

---

## 3. Inventory & Team Alignment Engine

### `UserCosmeticInventory`
```ts
export interface UserCosmeticInventory {
  unlockedCardIds: string[];
  equippedTrainer: {
    head?: string;
    outfit?: string;
    badge?: string;
    aura?: string;
  };
  equippedPokemon: Record<string, {
    gear?: string;
    aura?: string;
  }>;
  stardust: number;
  availablePacks: number;
  lastDailyClaimTime: number;
  streakDays: number;
}
```

### Team Alignment & Equip Fixes:
1. **Dynamic Party Tabs**: Wardrobe reflects the player's active team (`selectedTeam.team`), displaying each member's species, types, animated sprite, and current gear.
2. **Deterministic Species Scoping**: Gear is equipped to the selected team Pokémon (e.g. `equippedPokemon['Pikachu'].gear`), eliminating phantom global overrides.
3. **Dual Action States**: Clear `[EQUIP]`, `[TRANSFER]`, and `[REMOVE / UNEQUIP]` buttons prevent button lockup.
4. **Isolated Card Grid**: CSS isolation and `auto-rows-fr` prevent card overlapping on all viewports.
