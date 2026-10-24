/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pokemon, PokemonType, TeamPreset } from '../../types';
import { getAnimatedSpriteUrl } from '../typeChart';
import { enrichMoveWithMechanics } from '../moveMechanicsKB';

export type { Pokemon, PokemonType, TeamPreset };
export type RegionId = 'kanto' | 'johto' | 'hoenn' | 'sinnoh' | 'unova';

export interface EliteFourMember {
  id: string;
  name: string;
  title: string;
  specialty: string;
  roster: Pokemon[];
}

export interface RegionalLeagueConfig {
  regionId: RegionId;
  regionName: string;
  leagueName: string;
  championName: string;
  championTitle: string;
  championRoster: Pokemon[];
  eliteFour: EliteFourMember[];
  dailyPlayerTeams: TeamPreset[];
}

/** Helper to generate a fully normalized, mechanics-enriched Level 100 Pokemon object */
export function createLvl100Mon(
  id: string,
  species: string,
  nationalDex: number,
  types: [PokemonType, PokemonType] | [PokemonType],
  baseStats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number },
  ability: string,
  abilityDescription: string,
  moves: Array<{
    id: string;
    name: string;
    type: PokemonType;
    category: 'Physical' | 'Special' | 'Status';
    power: number;
    accuracy: number;
    pp: number;
    priority?: number;
    description: string;
  }>,
  heldItem?: string
): Pokemon {
  return {
    id,
    species,
    nationalDex,
    types,
    level: 100,
    baseStats,
    currentHp: baseStats.hp,
    maxHp: baseStats.hp,
    ability,
    abilityDescription,
    fainted: false,
    spriteFront: getAnimatedSpriteUrl(nationalDex),
    spriteBack: getAnimatedSpriteUrl(nationalDex, true),
    moves: moves.map((m) => enrichMoveWithMechanics({ ...m, maxPp: m.pp })),
    heldItem,
  };
}
