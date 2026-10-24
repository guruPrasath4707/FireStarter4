import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firebaseConfigured, firebaseSetupMessage } from '../firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';

const AuthContext = createContext(null);

function requireAuth() {
  if (!firebaseConfigured || !auth) {
    throw new Error(firebaseSetupMessage);
  }
  return auth;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let active = true;
    const unsub = onAuthStateChanged(
      auth,
      (nextUser) => {
        if (!active) return;
        setUser(nextUser);
        setLoading(false);
      },
      () => {
        if (!active) return;
        setUser(null);
        setLoading(false);
      },
    );

    return () => {
      active = false;
      unsub();
    };
  }, []);

  async function signup({ name, email, password }) {
    const client = requireAuth();
    const cred = await createUserWithEmailAndPassword(client, email, password);
    if (name?.trim()) {
      try {
        await fbUpdateProfile(cred.user, { displayName: name.trim() });
      } catch {
        // Creating the account is the primary operation; name can be edited later.
      }
    }
    return cred.user;
  }

  async function login({ email, password }) {
    const client = requireAuth();
    const { user: signedInUser } = await signInWithEmailAndPassword(client, email, password);
    return signedInUser;
  }

  async function logout() {
    await signOut(requireAuth());
  }

  async function syncDisplayName(name) {
    const client = requireAuth();
    if (!client.currentUser || !name?.trim()) return;
    await fbUpdateProfile(client.currentUser, { displayName: name.trim() });
  }

  const value = {
    user,
    loading,
    firebaseConfigured,
    firebaseSetupMessage,
    signup,
    login,
    logout,
    syncDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
