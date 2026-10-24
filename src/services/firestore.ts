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
  completedLearningResourceIds?: string[];
  lastAssessment?: {
    version: string;
    completedAt: string;
    score: number;
    total: number;
    categoryScores: Record<string, {
      label: string;
      score: number;
      total: number;
      resourceId: string;
    }>;
    recommendedResourceIds: string[];
    recommendationMode: 'practice' | 'reinforcement';
  } | null;
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

/** Save a self-reported external learning-resource completion. */
export async function markLearningResourceComplete(uid: string, resourceId: string): Promise<void> {
  if (!resourceId?.trim()) throw new Error('A learning resource id is required.');
  await setDoc(
    profileRef(uid),
    {
      completedLearningResourceIds: arrayUnion(resourceId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Remove a self-reported completion without changing other profile fields. */
export async function reopenLearningResource(uid: string, resourceId: string): Promise<void> {
  if (!resourceId?.trim()) throw new Error('A learning resource id is required.');
  await setDoc(
    profileRef(uid),
    {
      completedLearningResourceIds: arrayRemove(resourceId),
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
