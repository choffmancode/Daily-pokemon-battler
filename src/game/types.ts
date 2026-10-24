/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Steel'
  | 'Dark'
  | 'Fairy';

export type MoveCategory = 'Physical' | 'Special' | 'Status';

export type StatKey = 'hp' | 'attack' | 'defense' | 'spAtk' | 'spDef' | 'speed' | 'accuracy' | 'evasion';

export type StatusCondition = 'paralysis' | 'burn' | 'poison' | 'toxic' | 'sleep' | 'freeze';

export type WeatherType = 'Clear' | 'Hail' | 'Rain' | 'Sun' | 'Sand';

export interface StatChangeSpec {
  stat: StatKey;
  stages: number;
  target?: 'self' | 'opponent';
}

export interface SecondaryEffectSpec {
  chance: number; // 0 - 100
  statusEffect?: StatusCondition;
  statChange?: StatChangeSpec;
  statChanges?: StatChangeSpec[];
  flinchChance?: number; // 0 - 100 (or uses chance if flinch is the primary secondary effect)
  confusionChance?: number; // 0 - 100 chance to inflict confusion
}

export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  category: MoveCategory;
  power: number; // 0 for status
  accuracy: number; // 0 - 100
  pp: number;
  maxPp: number;
  priority?: number; // default 0
  description: string;
  statusEffect?: StatusCondition;
  statChange?: StatChangeSpec;
  statChanges?: StatChangeSpec[];
  secondaryEffect?: SecondaryEffectSpec;
  recoil?: number; // fraction of damage dealt, e.g. 0.25 or 0.33
  drain?: number; // fraction of damage dealt healed, e.g. 0.5
  multiHit?: [number, number]; // [minHits, maxHits], e.g. [2, 5]
  critRatioBonus?: number; // +1 for high-crit moves (Night Slash, Stone Edge, etc.)
  isProtect?: boolean; // Protect / Detect
  isSubstitute?: boolean; // Substitute
  weatherEffect?: WeatherType;
  isPivot?: boolean; // Switches user out after attacking (Volt Switch, U-turn, Flip Turn, Parting Shot, Baton Pass)
  isBatonPass?: boolean; // Passes stat stage boosts and Substitute to incoming teammate
  infallible?: boolean; // Never misses (Aura Sphere, Aerial Ace, Swift, Shock Wave, Magical Leaf)
  rechargeTurn?: boolean; // Forces user to skip next turn to recharge (Blast Burn, Frenzy Plant, Hydro Cannon)
  causesConfusion?: boolean; // 100% confusion on hit (Confuse Ray, Sweet Kiss, Supersonic, Swagger)
  entryHazard?: 'stealth_rock' | 'spikes' | 'toxic_spikes' | 'sticky_web'; // Sets entry hazard on opposing side
  clearsHazards?: boolean; // Clears entry hazards (Rapid Spin, Defog)
  isScreen?: 'reflect' | 'light_screen'; // Dual screens (Reflect / Light Screen)
  isHaze?: boolean; // Resets all stat stage changes on both sides (Haze)
  isPhazing?: boolean; // Forces target to switch out (Whirlwind, Roar, Dragon Tail)
  isSelfFaint?: boolean; // User faints upon successful execution (Explosion, Self-Destruct)
  isSuckerPunch?: boolean; // Fails if opponent does not select an attack move (Sucker Punch)
  isFacade?: boolean; // Doubles power to 140 if user is burned, poisoned, or paralyzed (Facade)
  isPsyshock?: boolean; // Special move calculating damage against physical Defense (Psyshock, Psystrike)
  isKnockOff?: boolean; // Removes target's held item and deals 1.5x damage if item held (Knock Off)
  isTaunt?: boolean; // Prevents target from using status moves for 3 turns (Taunt)
  isPerishSong?: boolean; // All active Pokemon faint in 3 turns (Perish Song)
  isTrickRoom?: boolean; // Reverses speed brackets for 5 turns (Trick Room)
  breaksScreens?: boolean; // Shatters opponent's Reflect and Light Screen before dealing damage (Brick Break)
  isCrashOnMiss?: boolean; // Attacker takes 50% max HP crash damage if move misses or target protects (High Jump Kick, Jump Kick)
  fixedDamage?: number; // Deals flat fixed damage regardless of stats (Night Shade, Seismic Toss)
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface Pokemon {
  id: string;
  species: string;
  nationalDex: number;
  types: PokemonType[];
  level: number;
  baseStats: PokemonStats;
  currentHp: number;
  maxHp: number;
  moves: Move[];
  spriteFront: string;
  spriteBack: string;
  ability: string;
  abilityDescription: string;
  statusCondition?: StatusCondition | null;
  sleepTurns?: number;
  toxicCounter?: number;
  substituteHp?: number;
  isProtected?: boolean;
  protectStreak?: number;
  mustRecharge?: boolean;
  isConfused?: boolean;
  confusionTurns?: number;
  statStages?: {
    hp?: number;
    attack: number;
    defense: number;
    spAtk: number;
    spDef: number;
    speed: number;
    accuracy?: number;
    evasion?: number;
  };
  fainted: boolean;
  heldItem?: string;
  heldItemConsumed?: boolean;
  choiceLockedMove?: string;
  isTaunted?: boolean;
  tauntTurns?: number;
  perishCount?: number;
  equippedCosmetics?: {
    head?: string;
    accessory?: string;
    aura?: string;
  };
}

export interface SideConditions {
  stealthRock?: boolean;
  spikes?: number; // 0 - 3 layers
  toxicSpikes?: number; // 0 - 2 layers
  stickyWeb?: boolean;
  reflectTurns?: number;
  lightScreenTurns?: number;
  tailwindTurns?: number;
}

export interface TeamPreset {
  id: string;
  name: string;
  tagline: string;
  strategyTag?: 'SWEEP' | 'STALL' | 'BALANCE';
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Strategic';
  description: string;
  recommendedLead: string;
  team: Pokemon[];
  colorTheme: string;
}

export type BattleActionType = 'move' | 'switch' | 'forfeit';

export interface BattleAction {
  type: BattleActionType;
  moveIndex?: number;
  targetPokemonIndex?: number;
}

export interface BattleTurnLog {
  id: string;
  turn: number;
  actor: 'player' | 'opponent' | 'system' | 'weather';
  message: string;
  type?: 'damage' | 'status' | 'faint' | 'switch' | 'effectiveness' | 'weather' | 'crit';
  effectiveness?: number;
}

export interface BattleState {
  turnNumber: number;
  weather: WeatherType;
  weatherTurnsRemaining: number;
  playerActiveIndex: number;
  opponentActiveIndex: number;
  playerTeam: Pokemon[];
  opponentTeam: Pokemon[];
  isPlayerTurn: boolean;
  phase: 'action_select' | 'animating' | 'faint_switch_player' | 'faint_switch_opponent' | 'battle_over';
  winner?: 'player' | 'opponent' | null;
  pendingPivot?: boolean;
  pendingBatonPass?: boolean;
  pendingOpponentAction?: BattleAction;
  trickRoomTurns?: number;
  playerSideConditions?: SideConditions;
  opponentSideConditions?: SideConditions;
  combatLog: BattleTurnLog[];
  lastMoveUsed?: {
    moveName: string;
    userSide: 'player' | 'opponent';
    targetSide: 'player' | 'opponent';
    damageDealt: number;
    isCrit: boolean;
    effectiveness: number;
  };
  turnMoves?: Array<{
    moveName: string;
    moveType?: PokemonType;
    moveCategory?: 'Physical' | 'Special' | 'Status';
    userSide: 'player' | 'opponent';
    targetSide: 'player' | 'opponent';
    damageDealt: number;
    isCrit: boolean;
    effectiveness: number;
    defenderHpRemaining: number;
    defenderFainted?: boolean;
  }>;
  protocolLog?: string[];
}

/* =================== GACHA & COSMETICS SYSTEM =================== */

export type CosmeticSlot =
  | 'trainer_head'
  | 'trainer_outfit'
  | 'trainer_backpack'
  | 'trainer_shoes'
  | 'trainer_badge'
  | 'trainer_aura'
  | 'pokemon_aura'
  | 'pokeball_effect'
  | 'screen_flare'
  | 'title_card';

export type CosmeticRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Secret Rare';

export interface CosmeticItem {
  id: string;
  name: string;
  cardNumber: string; // e.g. "014/050"
  slot: CosmeticSlot;
  slotLabel: string; // "Trainer Headwear", "Trainer Outfit", "Trainer Backpack", "Trainer Shoes", etc.
  wearableOn: 'Trainer' | 'All Pokémon' | 'Battle Arena' | 'Pikachu' | 'Charizard' | 'Blastoise' | 'Venusaur' | 'Snorlax' | 'Espeon';
  rarity: CosmeticRarity;
  description: string;
  flavorText: string;
  iconName: string;
  colorGradient: string;
  previewGraphic: string; // Gen3SpriteId or SVG snippet
  imageUrl?: string; // Real image asset
  bonusTitle?: string;
  kanjiSeal?: string; // Ukiyo-e Hanko stamp glyph
  ukiyoeStyle?: string; // Woodblock print art style subtitle
  dropRatePercent: number;
}

export interface GachaPack {
  id: string;
  name: string;
  series: string;
  packArtColor: string;
  accentColor: string;
  description: string;
  cardsCount: number;
}

export type TrainerBaseId =
  | 'brendan_emerald'
  | 'may_emerald'
  | 'brendan_rs'
  | 'may_rs'
  | 'red_fr'
  | 'leaf_lg'
  | 'cynthia_sinnoh';

export interface DailyBattleStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  todayCompleted: boolean;
  todayWon: boolean;
  todayTurns: number;
}

export interface EquippedTrainerConfig {
  baseId?: TrainerBaseId;
  head?: string;
  outfit?: string;
  backpack?: string;
  shoes?: string;
  badge?: string;
  aura?: string;
  // Custom Studio / Workshop Color Tinting & Feature tweaks
  customPalette?: {
    skin?: string;
    hair?: string;
    hatColor?: string;
    shirtColor?: string;
    pantsColor?: string;
    shoesColor?: string;
  };
}

export interface UserCosmeticInventory {
  unlockedCardIds: string[];
  equippedTrainer: EquippedTrainerConfig;
  equippedPokemon: Record<string, {
    aura?: string;
    titleCard?: string;
  }>;
  activeTitleCard?: string; // Active HP bar & level collectible title card
  ballEffect?: string; // Active Pokéball entrance animation
  screenFlare?: string; // Active critical/impact screen flare
  stardust: number;
  availablePacks: number;
  lastDailyClaimTime: number; // timestamp
  streakDays: number;
}

export interface OpponentTrainer {
  id: string;
  name: string;
  title: string;
  location: string;
  dialogue: string;
  weather: WeatherType;
  team: Pokemon[];
  badgeName?: string;
  tagline?: string;
}
