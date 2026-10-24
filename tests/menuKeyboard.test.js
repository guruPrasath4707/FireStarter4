import test from 'node:test';
import assert from 'node:assert/strict';
import { getMenuFocusIndex } from '../src/utils/menuKeyboard.js';

test('arrow keys enter the menu at the expected edge when focus is outside', () => {
  assert.equal(getMenuFocusIndex('ArrowDown', -1, 4), 0);
  assert.equal(getMenuFocusIndex('ArrowUp', -1, 4), 3);
});

test('arrow keys move and wrap around menu items', () => {
  assert.equal(getMenuFocusIndex('ArrowDown', 0, 4), 1);
  assert.equal(getMenuFocusIndex('ArrowDown', 3, 4), 0);
  assert.equal(getMenuFocusIndex('ArrowUp', 3, 4), 2);
  assert.equal(getMenuFocusIndex('ArrowUp', 0, 4), 3);
});

test('Home and End target the first and last enabled item', () => {
  assert.equal(getMenuFocusIndex('Home', 2, 4), 0);
  assert.equal(getMenuFocusIndex('End', 1, 4), 3);
});

test('unrelated keys and empty menus do not change focus', () => {
  assert.equal(getMenuFocusIndex('Enter', 0, 4), null);
  assert.equal(getMenuFocusIndex('ArrowDown', -1, 0), null);
  assert.equal(getMenuFocusIndex('ArrowUp', 0, -2), null);
});
