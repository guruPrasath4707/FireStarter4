import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FIREBASE_SETUP_MESSAGE,
  REQUIRED_FIREBASE_CONFIG_KEYS,
  getMissingFirebaseConfigKeys,
  isFirebaseConfigComplete,
} from '../src/utils/firebaseConfig.js';

test('requires the minimum Firebase Auth and Firestore client config', () => {
  assert.deepEqual(REQUIRED_FIREBASE_CONFIG_KEYS, [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
  ]);
});

test('reports every missing required field in stable order', () => {
  assert.deepEqual(getMissingFirebaseConfigKeys({}), [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
  ]);
});

test('treats empty and whitespace-only values as missing', () => {
  assert.deepEqual(
    getMissingFirebaseConfigKeys({
      apiKey: '   ',
      authDomain: 'example.firebaseapp.com',
      projectId: '',
      appId: 123,
    }),
    ['apiKey', 'projectId', 'appId'],
  );
});

test('accepts complete client configuration without requiring optional storage fields', () => {
  assert.equal(
    isFirebaseConfigComplete({
      apiKey: 'public-client-key',
      authDomain: 'example.firebaseapp.com',
      projectId: 'example-project',
      appId: '1:123:web:abc',
    }),
    true,
  );
  assert.equal(isFirebaseConfigComplete({ apiKey: 'only-one-field' }), false);
});

test('provides an actionable local setup message', () => {
  assert.match(FIREBASE_SETUP_MESSAGE, /\.env\.example/);
  assert.match(FIREBASE_SETUP_MESSAGE, /\.env\.local/);
  assert.match(FIREBASE_SETUP_MESSAGE, /restart/);
});
