import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';
import { db, firebaseSetupMessage } from '../firebase';

export type UserProfileDoc = {
  name: string;
  email: string;
  academicLevel: string;
  interests: string[];
  careerGoal: string;
  preferredLanguage: string;
  dailyStudyGoal: number;
  onboardingCompleted: boolean;
  updatedAt?: unknown;
};

const COLLECTION = 'users';

function requireDatabase(): Firestore {
  if (!db) throw new Error(firebaseSetupMessage);
  return db;
}

function profileRef(uid: string) {
  return doc(requireDatabase(), COLLECTION, uid);
}

export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const snap = await getDoc(profileRef(uid));
  return snap.exists() ? (snap.data() as UserProfileDoc) : null;
}

export async function setUserProfile(
  uid: string,
  data: Partial<UserProfileDoc>,
  { merge = true }: { merge?: boolean } = {},
): Promise<void> {
  await setDoc(
    profileRef(uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge },
  );
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfileDoc>,
): Promise<void> {
  await updateDoc(profileRef(uid), { ...data, updatedAt: serverTimestamp() } as DocumentData);
}

export function subscribeUserProfile(
  uid: string,
  cb: (data: UserProfileDoc | null) => void,
  onError?: (err: unknown) => void,
): () => void {
  return onSnapshot(
    profileRef(uid),
    (snap) => cb(snap.exists() ? (snap.data() as UserProfileDoc) : null),
    (err) => {
      // eslint-disable-next-line no-console
      console.error('[firestore] profile subscription error', err);
      onError?.(err);
    },
  );
}
