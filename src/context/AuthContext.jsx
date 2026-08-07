
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as fbUpdateProfile } from 'firebase/auth';

const AuthContext = createContext(null);

const ONBOARDING_KEY = (uid) => `eg_onboarding_${uid}`;

function loadOnboarding(uid){
  try{
    const raw = localStorage.getItem(ONBOARDING_KEY(uid));
    return raw ? JSON.parse(raw) : null;
  }catch{ return null; }
}

function saveOnboarding(uid, data){
  try{ localStorage.setItem(ONBOARDING_KEY(uid), JSON.stringify(data)); }catch{}
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u);
      if(u){
        const ob = loadOnboarding(u.uid);
        setOnboarding(ob);
        setProfile({
          name: u.displayName || ob?.name || (u.email?.split('@')[0] ?? 'User'),
          email: u.email || '',
          photoURL: u.photoURL || '',
        });
      }else{
        setProfile(null);
        setOnboarding(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signup({ name, email, password }){
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if(name){ await fbUpdateProfile(cred.user, { displayName: name }); }
    return cred.user;
  }

  async function login({ email, password }){
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  async function logout(){
    await signOut(auth);
  }

  async function completeOnboarding(data){
    if(!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    const payload = {
      name: data.name?.trim() || auth.currentUser.displayName || '',
      academicLevel: data.academicLevel || '',
      interests: Array.isArray(data.interests) ? data.interests : [],
      careerGoal: data.careerGoal || '',
      preferredLanguage: data.preferredLanguage || 'en',
      dailyStudyGoal: Number(data.dailyStudyGoal) || 30,
      completedAt: new Date().toISOString(),
    };
    if(payload.name){
      try{ await fbUpdateProfile(auth.currentUser, { displayName: payload.name }); }catch{}
    }
    saveOnboarding(uid, payload);
    setOnboarding(payload);
    setProfile((prev) => ({ ...(prev||{}), name: payload.name, email: auth.currentUser?.email || prev?.email || '' }));
    return payload;
  }

  function needsOnboarding(){
    return !!user && !onboarding;
  }

  const value = {
    user,
    profile,
    onboarding,
    loading,
    needsOnboarding: needsOnboarding(),
    signup,
    login,
    logout,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
