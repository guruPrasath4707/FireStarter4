import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  CAREER_MARKET_DATA_NOTICE,
  CAREER_MARKET_DATA_STATUS,
} from '../src/features/careers/data/marketDataQuality.js';

test('career market figures are explicitly classified as illustrative and unverified', () => {
  assert.equal(CAREER_MARKET_DATA_STATUS, 'illustrative-unverified');
  assert.match(CAREER_MARKET_DATA_NOTICE, /illustrative placeholders/i);
  assert.match(CAREER_MARKET_DATA_NOTICE, /not been validated/i);
  assert.match(CAREER_MARKET_DATA_NOTICE, /country-specific, dated authoritative source/i);
  assert.match(CAREER_MARKET_DATA_NOTICE, /should not be used/i);
});

test('career listing and detail pages both render the market-data notice', async () => {
  const [explorer, detail] = await Promise.all([
    readFile(new URL('../src/features/careers/pages/CareerExplorerPage.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/features/careers/pages/CareerDetailPage.jsx', import.meta.url), 'utf8'),
  ]);
  for (const source of [explorer, detail]) {
    assert.match(source, /import MarketDataNotice from '\.\.\/components\/MarketDataNotice'/);
    assert.match(source, /<MarketDataNotice\s*\/>/);
  }
});
