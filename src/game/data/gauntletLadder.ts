/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * VS CHAMP — Gauntlet Ladder & Opponent Stage Configurations
 * Connects the 5-Stage Indigo Plateau Gauntlet (Lorelei -> Bruno -> Agatha -> Lance -> Champion Blue)
 * and Daily Champion Cynthia Showdown into unified, verified opponent dossiers.
 */

import { Pokemon } from '../types';
import { OpponentPreviewInfo } from '../../components/BattlePreviewModal';
import {
  KANTO_ELITE_FOUR,
  KANTO_CHAMPION_BLUE,
} from './regional/kanto';
import { CHAMPION_CYNTHIA_TEAM } from './teams';

export interface GauntletStageConfig {
  stageNumber: number; // 1 to 5
  isFinalStage: boolean;
  preview: OpponentPreviewInfo;
  roster: Pokemon[];
  badgeRewardId?: string;
  badgeRewardName?: string;
}

/**
 * Verified 5-Stage Kanto League Indigo Plateau Gauntlet Ladder
 */
export const KANTO_GAUNTLET_STAGES: GauntletStageConfig[] = [
  // Stage 1: Lorelei
  {
    stageNumber: 1,
    isFinalStage: false,
    preview: {
      name: 'LORELEI',
      title: 'ELITE FOUR #1',
      headerTitle: 'ELITE FOUR LORELEI',
      typeSpecialty: 'ICE / WATER',
      typeBg: '#387098',
      quote: '"No one can best me when it comes to icy Pokémon! Your team will freeze solid in their tracks!"',
      leadPokemonName: 'Dewgong',
      leadPokemonDex: 87,
      leadPokemonDetail: 'Water/Ice • Ability: Thick Fat',
      benchCount: 4,
      spriteUrl: '/sprites/trainers/lorelei_sprite.jpg',
    },
    roster: KANTO_ELITE_FOUR[0].roster,
  },
  // Stage 2: Bruno
  {
    stageNumber: 2,
    isFinalStage: false,
    preview: {
      name: 'BRUNO',
      title: 'ELITE FOUR #2',
      headerTitle: 'ELITE FOUR BRUNO',
      typeSpecialty: 'FIGHTING',
      typeBg: '#902820',
      quote: '"Through rigorous training, people and Pokémon become stronger! Feel our Fighting power!"',
      leadPokemonName: 'Hitmontop',
      leadPokemonDex: 237,
      leadPokemonDetail: 'Fighting • Ability: Intimidate',
      benchCount: 4,
      spriteUrl: '/sprites/trainers/bruno_sprite.png',
    },
    roster: KANTO_ELITE_FOUR[1].roster,
  },
  // Stage 3: Agatha
  {
    stageNumber: 3,
    isFinalStage: false,
    preview: {
      name: 'AGATHA',
      title: 'ELITE FOUR #3',
      headerTitle: 'ELITE FOUR AGATHA',
      typeSpecialty: 'GHOST / POISON',
      typeBg: '#683870',
      quote: '"I am Agatha of the Elite Four! I will show you how a real master fights with ghostly wrath!"',
      leadPokemonName: 'Gengar',
      leadPokemonDex: 94,
      leadPokemonDetail: 'Ghost/Poison • Ability: Levitate',
      benchCount: 4,
      spriteUrl: '/sprites/trainers/agatha_sprite.png',
    },
    roster: KANTO_ELITE_FOUR[2].roster,
  },
  // Stage 4: Lance
  {
    stageNumber: 4,
    isFinalStage: false,
    preview: {
      name: 'LANCE',
      title: 'ELITE FOUR #4',
      headerTitle: 'ELITE FOUR LANCE',
      typeSpecialty: 'DRAGON / FLYING',
      typeBg: '#502878',
      quote: '"I am Lance, the Dragon Master! Dragons are mythical and sacred beings! You cannot defeat us!"',
      leadPokemonName: 'Gyarados',
      leadPokemonDex: 130,
      leadPokemonDetail: 'Water/Flying • Ability: Intimidate',
      benchCount: 4,
      spriteUrl: '/sprites/trainers/lance_sprite.png',
    },
    roster: KANTO_ELITE_FOUR[3].roster,
  },
  // Stage 5: Champion Blue (Final Boss)
  {
    stageNumber: 5,
    isFinalStage: true,
    preview: {
      name: 'CHAMPION BLUE',
      title: 'KANTO CHAMPION',
      headerTitle: 'CHAMPION BLUE',
      typeSpecialty: 'ALL-AROUND',
      typeBg: '#305078',
      quote: '"Smell ya later! I\'m the Pokémon League Champion! Let\'s see what you\'ve got!"',
      leadPokemonName: 'Pidgeot',
      leadPokemonDex: 18,
      leadPokemonDetail: 'Normal/Flying • Ability: Keen Eye',
      benchCount: 5,
      spriteUrl: '/sprites/trainers/blue_sprite.jpg',
    },
    roster: KANTO_CHAMPION_BLUE,
    badgeRewardId: 'card_trophy_kanto_champion',
    badgeRewardName: 'Kanto Indigo Plateau Champion Trophy',
  },
];

/**
 * Retrieve stage config by 0-based index (0 to 4)
 */
export function getGauntletStage(stageIndex: number): GauntletStageConfig {
  const safeIndex = Math.max(0, Math.min(KANTO_GAUNTLET_STAGES.length - 1, stageIndex));
  return KANTO_GAUNTLET_STAGES[safeIndex];
}

/**
 * Daily Battle Opponent Preview (Champion Cynthia)
 */
export const DAILY_CYNTHIA_PREVIEW: OpponentPreviewInfo = {
  name: 'CYNTHIA',
  title: 'SINNOH CHAMPION',
  headerTitle: 'CHAMPION CYNTHIA',
  typeSpecialty: 'DRAGON / MIXED',
  typeBg: '#502878',
  quote: '"Before me stands a Trainer with a passionate heart! I, Cynthia, accept your challenge!"',
  leadPokemonName: 'Spiritomb',
  leadPokemonDex: 442,
  leadPokemonDetail: 'Ghost/Dark • Ability: Pressure',
  benchCount: 5,
  spriteUrl: '/sprites/trainers/cynthia_battle.png',
};
