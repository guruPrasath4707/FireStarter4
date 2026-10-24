export const REQUIRED_FIREBASE_CONFIG_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];

export const FIREBASE_SETUP_MESSAGE =
  'Firebase is not configured for this local build. Copy .env.example to .env.local, fill in the Firebase web-app values from your Firebase project settings, then restart the development server.';

export function getMissingFirebaseConfigKeys(config = {}) {
  return REQUIRED_FIREBASE_CONFIG_KEYS.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

export function isFirebaseConfigComplete(config = {}) {
  return getMissingFirebaseConfigKeys(config).length === 0;
}
