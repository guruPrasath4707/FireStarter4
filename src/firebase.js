import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  FIREBASE_SETUP_MESSAGE,
  getMissingFirebaseConfigKeys,
} from './utils/firebaseConfig';

const env = import.meta.env ?? {};

const firebaseConfig = {
  apiKey: String(env.VITE_FIREBASE_API_KEY ?? '').trim(),
  authDomain: String(env.VITE_FIREBASE_AUTH_DOMAIN ?? '').trim(),
  projectId: String(env.VITE_FIREBASE_PROJECT_ID ?? '').trim(),
  storageBucket: String(env.VITE_FIREBASE_STORAGE_BUCKET ?? '').trim(),
  messagingSenderId: String(env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '').trim(),
  appId: String(env.VITE_FIREBASE_APP_ID ?? '').trim(),
};

export const missingFirebaseConfig = getMissingFirebaseConfigKeys(firebaseConfig);
export const firebaseConfigured = missingFirebaseConfig.length === 0;
export const firebaseSetupMessage = FIREBASE_SETUP_MESSAGE;

// Keep public pages usable without local credentials. Authentication and
// Firestore operations are disabled until the required client configuration
// is supplied; no placeholder Firebase project is ever initialized.
const existingDefaultApp = getApps().find((candidate) => candidate.name === '[DEFAULT]');
const app = firebaseConfigured
  ? (existingDefaultApp ?? initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
