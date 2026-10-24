import {
  arrayRemove,
  arrayUnion,
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
  savedCareerIds?: string[];
  completedLearningIds?: string[];
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

/** Atomically add a saved career without overwriting concurrent profile changes. */
export async function saveCareerToUserPath(uid: string, careerId: string): Promise<void> {
  if (!careerId?.trim()) throw new Error('A career id is required.');
  await setDoc(
    profileRef(uid),
    {
      savedCareerIds: arrayUnion(careerId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Atomically remove a saved career without overwriting other profile fields. */
export async function removeCareerFromUserPath(uid: string, careerId: string): Promise<void> {
  if (!careerId?.trim()) throw new Error('A career id is required.');
  await setDoc(
    profileRef(uid),
    {
      savedCareerIds: arrayRemove(careerId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Persist course-tracker completion without overwriting other profile fields. */
export async function markLearningResourceComplete(uid: string, resourceId: string): Promise<void> {
  const id = typeof resourceId === 'string' ? resourceId.trim() : '';
  if (!id) throw new Error('A learning resource id is required.');
  await setDoc(
    profileRef(uid),
    {
      completedLearningIds: arrayUnion(id),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Remove one completion record; this does not change any provider-side course status. */
export async function markLearningResourceIncomplete(uid: string, resourceId: string): Promise<void> {
  const id = typeof resourceId === 'string' ? resourceId.trim() : '';
  if (!id) throw new Error('A learning resource id is required.');
  await setDoc(
    profileRef(uid),
    {
      completedLearningIds: arrayRemove(id),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
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
