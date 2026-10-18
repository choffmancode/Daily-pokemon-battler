/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Traditional Japanese Ukiyo-e Woodblock Battle Background Library.
 * Randomly selects a background for each new battle.
 * Designed specifically so the floating GBA battle UI plates, stat boxes,
 * and grass/stone pedestals sit cleanly on top without blending or visual clutter.
 */

export interface UkiyoeBackgroundSpec {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  accentColor: string;
}

export const UKIYOE_BATTLE_BACKGROUNDS: UkiyoeBackgroundSpec[] = [
  {
    id: 'ukiyoe_wave_sea',
    name: 'Great Wave & Night Sea',
    subtitle: 'Hokusai-inspired woodblock sea waves & moonlit horizon',
    imageUrl: '/backgrounds/ukiyoe/ukiyoe_wave_sea.jpg',
    accentColor: '#183848',
  },
  {
    id: 'ukiyoe_cloud_forest',
    name: 'Forest of Clouds & Crimson Sun',
    subtitle: 'Silhouetted pine boughs, woodblock cloud sea & rising crimson sun',
    imageUrl: '/backgrounds/ukiyoe/ukiyoe_cloud_forest.jpg',
    accentColor: '#a84040',
  },
  {
    id: 'ukiyoe_mountain_village',
    name: 'Mountain Village Square & Distant Peak',
    subtitle: 'Edo temple eaves, tranquil river bridge & snow-capped peak',
    imageUrl: '/backgrounds/ukiyoe/ukiyoe_mountain_village.jpg',
    accentColor: '#306850',
  },
  {
    id: 'ukiyoe_moonlit_forest',
    name: 'Nighttime Forest Under a Full Moon',
    subtitle: 'Ancient pine & bamboo silhouettes under a pale full moon',
    imageUrl: '/backgrounds/ukiyoe/ukiyoe_moonlit_forest.jpg',
    accentColor: '#88c070',
  },
];

/**
 * Randomly selects a Ukiyo-e battle background from the library.
 * Optionally avoids repeating the immediately previous background ID when rematching.
 */
export function pickRandomUkiyoeBackground(previousId?: string): UkiyoeBackgroundSpec {
  if (UKIYOE_BATTLE_BACKGROUNDS.length === 0) {
    throw new Error('UKIYOE_BATTLE_BACKGROUNDS library cannot be empty');
  }
  const candidates =
    previousId && UKIYOE_BATTLE_BACKGROUNDS.length > 1
      ? UKIYOE_BATTLE_BACKGROUNDS.filter((bg) => bg.id !== previousId)
      : UKIYOE_BATTLE_BACKGROUNDS;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
