import {
  getUserProfile,
  setUserProfile,
  type UserProfileDoc,
} from './firestore';

// Compatibility adapter for older imports. Keep Firestore reads/writes in the
// shared service so timestamps, configuration checks, and error behavior stay
// consistent across the app.
export const DatabaseService = {
  async saveUserProfile(
    userId: string,
    data: Partial<UserProfileDoc>,
  ): Promise<void> {
    await setUserProfile(userId, data);
  },

  getUserProfile(userId: string): Promise<UserProfileDoc | null> {
    return getUserProfile(userId);
  },
};

export default DatabaseService;
