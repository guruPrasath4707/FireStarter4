
import React, { useState } from 'react';
import { Card, Button, Input } from './UI.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginForm({ onLogin, goSignup }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const { login, profile } = useAuth();

  async function handleLogin(){
    setErr('');
    try {
      const u = await login({ email, password });
      const p = profile || {
        name: u.displayName || (u.email?.split('@')[0] ?? 'User'),
        email: u.email,
        class: '12',
        stream: 'Undecided',
        district: '—',
        gender: '—'
      };
      onLogin?.(p);
    } catch(e){
      setErr(e.message);
    }
  }

  return (<Card>
    <h3>Login</h3>
    <Input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
    <Input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
    {err && <div style={{ color:'#b91c1c', fontSize:12, marginTop:6 }}>{err}</div>}
    <div style={{ display:'flex', gap:8, marginTop:8 }}>
      <Button onClick={handleLogin}>Login</Button>
      <Button variant='outline' onClick={goSignup}>Signup</Button>
    </div>
  </Card>);
}

export function SignupForm({ onSignup, goLogin }){
  const [form,setForm]=useState({ name:'', email:'', password:'', class:'12', stream:'Undecided', district:'', gender:'—' });
  const [err,setErr]=useState('');
  const { signup } = useAuth();

  async function handleSignup(){
    setErr('');
    try {
      const u = await signup({ name: form.name, email: form.email, password: form.password });
      const profile = { ...form, email: u.email || form.email, name: u.displayName || form.name };
      onSignup?.(profile);
    } catch(e){
      setErr(e.message);
    }
  }

  return (<Card>
    <h3>Signup</h3>
    <Input placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
    <Input placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
    <Input placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
    <Input placeholder='District (optional)' value={form.district} onChange={e=>setForm({...form,district:e.target.value})} />
    {err && <div style={{ color:'#b91c1c', fontSize:12, marginTop:6 }}>{err}</div>}
    <div style={{ display:'flex', gap:8, marginTop:8 }}>
      <Button onClick={handleSignup}>Create account</Button>
      <Button variant='outline' onClick={goLogin}>Back to login</Button>
    </div>
  </Card>);
}
