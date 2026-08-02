
import React, { useState } from 'react';
import { Input, Button, Select } from '../components/UI.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfileTab({ profile, setProfile }){
  const { updateProfile } = useAuth();
  const [form,setForm]=useState({ name: profile?.name || '', district: profile?.district || '', class: profile?.class || '12', stream: profile?.stream || 'Undecided' });
  const save = async ()=>{ await updateProfile(form); setProfile({ ...profile, ...form }); };
  return (<div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
    <b>Edit Profile</b>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8 }}>
      <Input placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <Input placeholder='District' value={form.district} onChange={e=>setForm({...form,district:e.target.value})}/>
      <Select value={form.class} onChange={v=>setForm({...form,class:v})} options={['10','11','12']}/>
      <Select value={form.stream} onChange={v=>setForm({...form,stream:v})} options={['Undecided','Science','Commerce','Arts','Vocational']}/>
    </div>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
      <Button variant='outline' onClick={()=>setForm({ name: profile?.name || '', district: profile?.district || '', class: profile?.class || '12', stream: profile?.stream || 'Undecided' })}>Reset</Button>
      <Button onClick={save}>Save</Button>
    </div>
  </div>);
}
