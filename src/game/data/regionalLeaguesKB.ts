/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regional Leagues & Elite Four Gauntlet Knowledge Base (Gens 1–5)
 * Master competitive Level 100 rosters for all 20 Elite Four members and 5 Champions,
 * along with regional daily 3-team player presets across Kanto, Johto, Hoenn, Sinnoh, and Unova.
 */

import {
  RegionId,
  EliteFourMember,
  RegionalLeagueConfig,
  createLvl100Mon,
} from './regional/types';
import { KANTO_LEAGUE, KANTO_ELITE_FOUR, KANTO_CHAMPION_BLUE } from './regional/kanto';
import { JOHTO_LEAGUE, JOHTO_ELITE_FOUR, JOHTO_CHAMPION_LANCE } from './regional/johto';
import { HOENN_LEAGUE, HOENN_ELITE_FOUR, HOENN_CHAMPION_STEVEN } from './regional/hoenn';
import { SINNOH_LEAGUE, SINNOH_ELITE_FOUR, SINNOH_CHAMPION_CYNTHIA } from './regional/sinnoh';
import { UNOVA_LEAGUE, UNOVA_ELITE_FOUR, UNOVA_CHAMPION_IRIS } from './regional/unova';

export type { RegionId, EliteFourMember, RegionalLeagueConfig };
export { createLvl100Mon };

export {
  KANTO_LEAGUE,
  KANTO_ELITE_FOUR,
  KANTO_CHAMPION_BLUE,
  JOHTO_LEAGUE,
  JOHTO_ELITE_FOUR,
  JOHTO_CHAMPION_LANCE,
  HOENN_LEAGUE,
  HOENN_ELITE_FOUR,
  HOENN_CHAMPION_STEVEN,
  SINNOH_LEAGUE,
  SINNOH_ELITE_FOUR,
  SINNOH_CHAMPION_CYNTHIA,
  UNOVA_LEAGUE,
  UNOVA_ELITE_FOUR,
  UNOVA_CHAMPION_IRIS,
};

/* ============================================================================
 * MASTER REGIONAL LEAGUES LOOKUP DICTIONARY (GENS 1-5 FULLY POPULATED)
 * ============================================================================ */
export const REGIONAL_LEAGUES: Record<RegionId, RegionalLeagueConfig> = {
  kanto: KANTO_LEAGUE,
  johto: JOHTO_LEAGUE,
  hoenn: HOENN_LEAGUE,
  sinnoh: SINNOH_LEAGUE,
  unova: UNOVA_LEAGUE,
};

/**
 * Accessor that retrieves verified regional data with safe fallback to Sinnoh/Kanto.
 */
export function getRegionalLeague(region: RegionId): RegionalLeagueConfig {
  if (REGIONAL_LEAGUES[region]) return REGIONAL_LEAGUES[region];
  return REGIONAL_LEAGUES.sinnoh ?? REGIONAL_LEAGUES.kanto;
}
