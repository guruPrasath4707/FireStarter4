
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signup({ name, email, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      try {
        await fbUpdateProfile(cred.user, { displayName: name });
      } catch {
        // Non-fatal: profile display name can be set later.
      }
    }
    return cred.user;
  }

  async function login({ email, password }) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  async function logout() {
    await signOut(auth);
  }

  async function syncDisplayName(name) {
    if (!auth.currentUser || !name?.trim()) return;
    try {
      await fbUpdateProfile(auth.currentUser, { displayName: name.trim() });
    } catch {
      // Non-fatal.
    }
  }

  const value = { user, loading, signup, login, logout, syncDisplayName };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
