/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CozyBackgroundScene } from "../types";

export const COZY_BACKGROUND_SCENES: CozyBackgroundScene[] = [
  {
    id: 'sinnoh_league_chamber',
    title: 'Sinnoh League Champion Chamber',
    location: 'Pokémon League · Champion Room',
    imageUrl: '/src/assets/images/cozy_silver_summit_1792028919520.jpg',
    moodColor: 'rgba(212, 175, 55, 0.25)',
    accentBadge: 'Champion Throne & Golden Lights',
    description: 'Grand ornate columns with dramatic golden floor lights where Champion Cynthia awaits challengers.',
  },
  {
    id: 'cozy_rainy_cafe',
    title: 'Rainy Hearth Pokémon Café',
    location: 'Goldenrod Hearth & Coffeehouse',
    imageUrl: '/src/assets/images/cozy_pokemon_cafe_1792028919595.jpg',
    moodColor: 'rgba(245, 158, 11, 0.2)',
    accentBadge: 'Sleeping Pikachu & Eevee',
    description: 'Soft amber lamplight, steaming cocoa, and rain tapping gently against the bay windows.',
  },
  {
    id: 'mt_silver_camp',
    title: 'Campfire Twilight Basecamp',
    location: 'Mt. Silver Ascent Trail',
    imageUrl: '/src/assets/images/cozy_pokemon_camp_1792028418788.jpg',
    moodColor: 'rgba(239, 68, 68, 0.18)',
    accentBadge: 'Warm Campfire & Resting Squad',
    description: 'Crackling campfire embers warming the mountain snow as dusk settles over the ridge.',
  },
  {
    id: 'viridian_dawn',
    title: 'Viridian Meadow at Golden Dawn',
    location: 'Route 2 Golden Forest Glade',
    imageUrl: '/src/assets/images/cozy_forest_dawn_1792028419227.jpg',
    moodColor: 'rgba(34, 197, 94, 0.18)',
    accentBadge: 'Sunlit Forest Canopy',
    description: 'Sunbeams filtering through ancient evergreen boughs with dewy wild berry glades.',
  },
];
