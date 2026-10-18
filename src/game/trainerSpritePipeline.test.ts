import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTrainerSprite,
  compositeTrainerPixels,
  BASE_PIXEL_MAPS,
  HEADWEAR_OVERLAYS,
  SPRITE_CANVAS_WIDTH,
  SPRITE_CANVAS_HEIGHT,
} from './data/trainerPixelEngine';
import { EquippedTrainerConfig } from './types';

test('Sprite Pipeline - Asset Catalog Integrity', () => {
  // 1. All registered base maps must have exact 16x24 dimensions
  const baseKeys = Object.keys(BASE_PIXEL_MAPS);
  assert.ok(baseKeys.length >= 6, 'Must have at least 6 canonical Gen 3 bases');

  for (const baseId of baseKeys) {
    const rows = BASE_PIXEL_MAPS[baseId as keyof typeof BASE_PIXEL_MAPS];
    assert.equal(
      rows.length,
      SPRITE_CANVAS_HEIGHT,
      `Base ${baseId} must have ${SPRITE_CANVAS_HEIGHT} rows`
    );
    for (let r = 0; r < rows.length; r++) {
      assert.equal(
        rows[r].length,
        SPRITE_CANVAS_WIDTH,
        `Base ${baseId} row ${r} must be ${SPRITE_CANVAS_WIDTH} characters wide`
      );
    }
  }

  // 2. All registered headwear overlays must be exactly 16 characters wide per row
  const headKeys = Object.keys(HEADWEAR_OVERLAYS);
  assert.ok(headKeys.length >= 5, 'Must have at least 5 registered headwear overlays');

  for (const headId of headKeys) {
    const rows = HEADWEAR_OVERLAYS[headId];
    assert.ok(rows.length <= 8, `Headwear ${headId} should cover at most top 8 rows`);
    for (let r = 0; r < rows.length; r++) {
      assert.equal(
        rows[r].length,
        SPRITE_CANVAS_WIDTH,
        `Headwear ${headId} row ${r} must be ${SPRITE_CANVAS_WIDTH} characters wide`
      );
    }
  }
});

test('Sprite Pipeline - Validator Invariants (No Silent Fallback)', () => {
  // Valid configuration passes
  const validConfig: EquippedTrainerConfig = {
    baseId: 'brendan_emerald',
    head: 'card_red_vintage_cap',
  };
  const validRes = validateTrainerSprite(validConfig);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.errors.length, 0);

  // Missing / Unregistered base ID must fail validation
  const invalidBaseConfig: EquippedTrainerConfig = {
    baseId: 'nonexistent_trainer_xyz' as any,
  };
  const invalidBaseRes = validateTrainerSprite(invalidBaseConfig);
  assert.equal(invalidBaseRes.valid, false);
  assert.ok(
    invalidBaseRes.errors.some((e) => e.includes('Unregistered trainer base asset')),
    'Must report unregistered base asset error'
  );

  // Unregistered headwear ID must fail validation
  const invalidHeadConfig: EquippedTrainerConfig = {
    baseId: 'brendan_emerald',
    head: 'missing_hat_123',
  };
  const invalidHeadRes = validateTrainerSprite(invalidHeadConfig);
  assert.equal(invalidHeadRes.valid, false);
  assert.ok(
    invalidHeadRes.errors.some((e) => e.includes('Unregistered headwear asset')),
    'Must report unregistered headwear asset error'
  );

  // Composition on invalid asset returns error pattern and does not silently invent an asset
  const compositeRes = compositeTrainerPixels(invalidHeadConfig);
  assert.equal(compositeRes.validation.valid, false);
  assert.equal(compositeRes.rows.length, 24);
  // Row 0 has the red error border 'r'
  assert.ok(compositeRes.rows[0].includes('r'));
});

test('Sprite Pipeline - Two-Layer Composition: Hat Changes Head and Preserves Body', () => {
  // Configuration A: Base Brendan with default natural head (no hat equipped)
  const baseConfig: EquippedTrainerConfig = {
    baseId: 'brendan_emerald',
    head: undefined,
  };
  const resBase = compositeTrainerPixels(baseConfig, 'idle');
  assert.equal(resBase.validation.valid, true);

  // Configuration B: Brendan wearing Red's Vintage Cap
  const redCapConfig: EquippedTrainerConfig = {
    baseId: 'brendan_emerald',
    head: 'card_red_vintage_cap',
  };
  const resRedCap = compositeTrainerPixels(redCapConfig, 'idle');
  assert.equal(resRedCap.validation.valid, true);

  // Configuration C: Brendan wearing Leaf's Sunhat
  const leafHatConfig: EquippedTrainerConfig = {
    baseId: 'brendan_emerald',
    head: 'card_leaf_sunhat',
  };
  const resLeafHat = compositeTrainerPixels(leafHatConfig, 'idle');
  assert.equal(resLeafHat.validation.valid, true);

  // 1. Verify that rows 0-4 (the hat region) visibly change between configurations
  const baseHead = resBase.rows.slice(0, 5).join('');
  const redCapHead = resRedCap.rows.slice(0, 5).join('');
  const leafHatHead = resLeafHat.rows.slice(0, 5).join('');

  assert.notEqual(baseHead, redCapHead, 'Equipping Red Cap must visibly alter the head rows');
  assert.notEqual(redCapHead, leafHatHead, 'Switching from Red Cap to Leaf Hat must visibly alter head rows');

  // 2. Critical Contract: Rows 8 to 23 (face, chin, torso, hands, legs, footwear) MUST remain 100% IDENTICAL
  const baseBody = resBase.rows.slice(8, 24).join('');
  const redCapBody = resRedCap.rows.slice(8, 24).join('');
  const leafHatBody = resLeafHat.rows.slice(8, 24).join('');

  assert.equal(
    redCapBody,
    baseBody,
    'Equipping Red Cap must preserve the exact trainer body rows (8-23)'
  );
  assert.equal(
    leafHatBody,
    baseBody,
    'Equipping Leaf Sunhat must preserve the exact trainer body rows (8-23)'
  );
});
