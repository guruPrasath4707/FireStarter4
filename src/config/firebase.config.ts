// Legacy import path retained for older service modules. Keep one Firebase
// initialization source so this file cannot create a second app with dummy IDs.
export {
  auth,
  db,
  firebaseConfigured,
  firebaseSetupMessage,
  missingFirebaseConfig,
} from '../firebase';
