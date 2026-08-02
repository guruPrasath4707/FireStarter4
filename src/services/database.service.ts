import { db } from '../config/firebase.config';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export const DatabaseService = {
  async saveUserProfile(userId: string, data: any) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  async getUserProfile(userId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
};
