
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as fbUpdateProfile } from 'firebase/auth';

const AuthContext = createContext(null);

function loadLocalProfile(uid){
  try{
    const raw = localStorage.getItem('eg_profile_'+uid);
    return raw ? JSON.parse(raw) : null;
  }catch{return null;}
}
function saveLocalProfile(uid, obj){
  try{ localStorage.setItem('eg_profile_'+uid, JSON.stringify(obj)); }catch{}
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u);
      if(u){
        const local = loadLocalProfile(u.uid) || {};
        setProfile({
          name: u.displayName || local.name || (u.email?.split('@')[0] ?? 'User'),
          email: u.email || local.email || '',
          district: local.district || '',
          class: local.class || '12',
          stream: local.stream || 'Undecided',
          gender: local.gender || '—'
        });
      }else{
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signup({ name, email, password }){
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if(name){ await fbUpdateProfile(cred.user, { displayName: name }); }
    saveLocalProfile(cred.user.uid, { name, email });
    return cred.user;
  }

  async function login({ email, password }){
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  async function logout(){
    await signOut(auth);
  }

  async function updateProfile(patch){
    if(!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const base = loadLocalProfile(uid) || {};
    const merged = { ...base, ...patch };
    if(typeof patch?.name === 'string' && patch.name.trim()){
      try{ await fbUpdateProfile(auth.currentUser, { displayName: patch.name.trim() }); }catch{}
    }
    saveLocalProfile(uid, merged);
    setProfile(prev => ({ ...(prev||{}), ...merged }));
  }

  const value = { user, profile, loading, signup, login, logout, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
