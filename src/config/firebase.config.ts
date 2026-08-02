import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDfJfJfJfJfJfJfJfJfJfJfJfJfJfJfJfJf',
  authDomain: 'firestarter4.firebaseapp.com',
  projectId: 'firestarter4',
  storageBucket: 'firestarter4.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:123456789',
  measurementId: 'G-123456789',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);