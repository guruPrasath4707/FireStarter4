
import React from 'react';
import { Bell, Menu, Rocket } from 'lucide-react';
import { S, Button, Input, Select, Badge } from './UI.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ onStartQuiz, locale, setLocale }){
  const { user, logout } = useAuth();
  return (
    <header style={S.header}>
      <div style={{ ...S.container, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant='outline' style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Menu size={18}/></Button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ height:32, width:32, borderRadius:10, background:'#0f172a', color:'#fff', display:'grid', placeItems:'center', fontWeight:700 }}>EG</div>
            <div style={{ lineHeight:1.1 }}>
              <div style={{ fontWeight:600 }}>EduGuidance</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Career & College Advisor</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center', flex:1, maxWidth:560, margin:'0 16px' }}>
          <Input placeholder='Search colleges, courses, exams…' />
          <Select value={locale} onChange={setLocale} options={[{value:'en',label:'English'},{value:'ta',label:'தமிழ்'},{value:'hi',label:'हिन्दी'}]} />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Button variant='outline'><span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Bell size={16}/> Alerts</span></Button>
          <Button onClick={onStartQuiz}><span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Rocket size={16}/> Start Quiz</span></Button>
          {user && <Button variant='outline' onClick={logout}>Logout</Button>}
        </div>
      </div>
    </header>
  );
}
