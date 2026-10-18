/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_PIXEL_MAPS,
  HEADWEAR_OVERLAYS,
  GBA_PALETTE,
  SPRITE_CANVAS_WIDTH,
  SPRITE_CANVAS_HEIGHT,
  validateTrainerSprite,
  compositeTrainerPixels,
  generateErrorGrid,
  compilePixelRects,
} from './data/trainerPixelEngine';
import { TRAINER_BASES } from './data/trainerRegistry';
import { COSMETIC_CARDS_CATALOG } from './data/cosmetics';

test('Sprite Pipeline: All base trainer bodies strictly adhere to 16x24 discrete matrix', () => {
  for (const [id, rows] of Object.entries(BASE_PIXEL_MAPS)) {
    assert.equal(
      rows.length,
      SPRITE_CANVAS_HEIGHT,
      `Base ${id} must have exactly ${SPRITE_CANVAS_HEIGHT} rows`
    );
    for (let r = 0; r < rows.length; r++) {
      assert.equal(
        rows[r].length,
        SPRITE_CANVAS_WIDTH,
        `Base ${id} row ${r} must have exactly ${SPRITE_CANVAS_WIDTH} columns`
      );
      for (const ch of rows[r]) {
        assert.ok(ch in GBA_PALETTE, `Char "${ch}" in base ${id} row ${r} must belong to GBA_PALETTE`);
      }
    }
  }
});

test('Sprite Pipeline: All catalog headwear overlays adhere to 16-pixel width grid', () => {
  const headCards = COSMETIC_CARDS_CATALOG.filter((c) => c.slot === 'trainer_head');
  assert.ok(headCards.length >= 10, 'Expected at least 10 headwear cards');

  for (const card of headCards) {
    assert.ok(
      card.id in HEADWEAR_OVERLAYS,
      `Card ${card.id} must be registered in HEADWEAR_OVERLAYS`
    );
    const overlay = HEADWEAR_OVERLAYS[card.id];
    for (let r = 0; r < overlay.length; r++) {
      assert.equal(
        overlay[r].length,
        SPRITE_CANVAS_WIDTH,
        `Overlay ${card.id} row ${r} must have width ${SPRITE_CANVAS_WIDTH}`
      );
      for (const ch of overlay[r]) {
        assert.ok(ch in GBA_PALETTE, `Char "${ch}" in overlay ${card.id} must belong to GBA_PALETTE`);
      }
    }
  }
});

test('Sprite Pipeline: Two-layer composition updates hat visibly while keeping body unchanged', () => {
  const baseId = 'brendan_emerald';
  const defaultBase = compositeTrainerPixels({ baseId });
  const redHat = compositeTrainerPixels({ baseId, head: 'card_red_vintage_cap' });
  const emeraldHat = compositeTrainerPixels({ baseId, head: 'card_brendan_emerald_cap' });

  assert.equal(defaultBase.validation.valid, true);
  assert.equal(redHat.validation.valid, true);
  assert.equal(emeraldHat.validation.valid, true);

  // Rows 0-5 (Hat layer): visibly different
  const defaultHatRows = defaultBase.rows.slice(0, 6).join('');
  const redHatRows = redHat.rows.slice(0, 6).join('');
  assert.notEqual(defaultHatRows, redHatRows, 'Red cap must visibly change hat layer rows 0-5');

  // Rows 6-23 (Body layer): 100% identical invariant
  const defaultBody = defaultBase.rows.slice(6);
  const redBody = redHat.rows.slice(6);
  const emeraldBody = emeraldHat.rows.slice(6);

  assert.deepEqual(defaultBody, redBody, 'Body rows 6-23 must remain unchanged when equipping red hat');
  assert.deepEqual(defaultBody, emeraldBody, 'Body rows 6-23 must remain unchanged when equipping emerald hat');
});

test('Sprite Pipeline: Asset validation reports visible errors on missing assets without silent fallback', () => {
  // Test invalid baseId
  const invalidBase = validateTrainerSprite({ baseId: 'nonexistent_trainer' as any });
  assert.equal(invalidBase.valid, false);
  assert.ok(invalidBase.errors.some((e) => e.includes('Unregistered trainer base asset')));

  // Test invalid headId
  const invalidHead = validateTrainerSprite({
    baseId: 'brendan_emerald',
    head: 'nonexistent_hat_card',
  });
  assert.equal(invalidHead.valid, false);
  assert.ok(invalidHead.errors.some((e) => e.includes('Unregistered headwear asset')));

  // Test compositeTrainerPixels on invalid configuration returns error grid
  const res = compositeTrainerPixels({
    baseId: 'brendan_emerald',
    head: 'corrupted_asset_id',
  });
  assert.equal(res.validation.valid, false);
  assert.equal(res.rows.length, SPRITE_CANVAS_HEIGHT);
  assert.equal(res.rows[0].length, SPRITE_CANVAS_WIDTH);
  // Red border on error grid
  assert.equal(res.rows[0], 'rrrrrrrrrrrrrrrr');
});

test('Sprite Pipeline: Rect compiler compiles discrete 16x24 SVG rectangles without smoothing', () => {
  const result = compositeTrainerPixels({ baseId: 'red_fr', head: 'card_red_vintage_cap' });
  const rects = compilePixelRects(result.rows);
  assert.ok(rects.length > 50, 'Expected non-trivial number of pixel rects for Red FR sprite');

  for (const r of rects) {
    assert.ok(r.x >= 0 && r.x < SPRITE_CANVAS_WIDTH);
    assert.ok(r.y >= 0 && r.y < SPRITE_CANVAS_HEIGHT);
    assert.ok(r.w >= 1 && r.w <= SPRITE_CANVAS_WIDTH);
    assert.equal(r.h, 1);
    assert.ok(r.fill.startsWith('#'), 'Fill must be a hex color code');
  }
});
