
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { S, Button, Select, Progress, Switch } from './components/UI.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { LoginForm, SignupForm } from './components/AuthForms.jsx';
import Streams from './pages/Streams.jsx';
import CareerMaps from './pages/CareerMaps.jsx';
import Colleges from './pages/Colleges.jsx';
import Resources from './pages/Resources.jsx';
import DigitalTwin from './pages/DigitalTwin.jsx';
import ProfileTab from './pages/ProfileTab.jsx';
import { useTranslation } from 'react-i18next';


function Layout(){
  const { user, login } = useAuth();
  const { t } = useTranslation();
  const [showSignup,setShowSignup]=useState(false);
  const [activeTab,setActiveTab]=useState('streams');
  const [locale,setLocale]=useState('en');
  const [profile,setProfile]=useState(user || null);

  if(!user){
    return (<div style={{...S.page, display:'grid', placeItems:'center'}}>
      <div style={{ ...S.container, maxWidth:420 }}>
        {showSignup ? <SignupForm onSignup={(u)=>{ login(u); setShowSignup(false); setProfile(u);} } goLogin={()=>setShowSignup(false)} />
                    : <LoginForm onLogin={(u)=>{ login(u); setProfile(u);} } goSignup={()=>setShowSignup(true)} />}
      </div>
    </div>);
  }

  return (<div style={S.page}>
    <Header onStartQuiz={()=>setActiveTab('streams')} locale={locale} setLocale={setLocale}/>
    <div style={{ ...S.container, paddingTop:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'3fr 9fr', gap:16 }}>
        <aside>
          <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
            <b>Your Profile</b>
            <div style={{ fontSize:14, marginTop:8 }}>
              <div style={{ fontWeight:600 }}>{profile?.name}</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Class {profile?.class} • {profile?.district}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8 }}>
              <Select value={profile?.class} onChange={(v)=>setProfile({...profile,class:v})} options={['10','11','12']} />
              <Select value={profile?.stream} onChange={(v)=>setProfile({...profile,stream:v})} options={[t('Undecided'), t('Science'), t('Commerce'), t('Arts'), t('Vocational')]} />
            </div>
            <div style={{ background:'#f8fafc', borderRadius:12, padding:12, marginTop:12 }}>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Readiness</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12 }}><span>Profile completeness</span><span>72%</span></div>
              <Progress value={72} />
            </div>
            <div style={{ background:'#f8fafc', borderRadius:12, padding:12, marginTop:12 }}>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Preferences</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}><span style={{ fontSize:14 }}>Notifications</span><Switch checked={true} onChange={()=>{}} /></div>
            </div>
          </div>
          <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16, marginTop:16}}>
            <b>Timeline & Alerts</b>
            <Row t='UG admissions – Phase 1 closes' d='Sep 20' />
            <Row t='NSP scholarship last date' d='Sep 30' />
            <Row t='Govt college counselling' d='Oct 05' />
          </div>
        </aside>
        <main>
          <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'linear-gradient(90deg,#eef2ff,#f0f9ff)', padding:16}}>
            <b>Quick Actions</b>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginTop:8 }}>
              <Button variant='outline' onClick={()=>setActiveTab('streams')}>Take Stream Quiz</Button>
              <Button variant='outline' onClick={()=>setActiveTab('colleges')}>Find Nearby Colleges</Button>
              <Button variant='outline' onClick={()=>setActiveTab('careers')}>View Career Maps</Button>
              <Button variant='outline' onClick={()=>setActiveTab('resources')}>Deadlines & Alerts</Button>
              <Button variant='outline' onClick={()=>setActiveTab('twin')}>Build Digital Twin</Button>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:16, marginBottom:8, flexWrap:'wrap' }}>
            {[{k:'streams',l:'Streams'},{k:'careers',l:'Career Maps'},{k:'colleges',l:'Colleges'},{k:'resources',l:'Resources'},{k:'twin',l:'Digital Twin'},{k:'profile',l:'Profile'}].map(t=>(
              <Button key={t.k} variant={activeTab===t.k?'solid':'outline'} onClick={()=>setActiveTab(t.k)}>{t.l}</Button>
            ))}
          </div>
          {activeTab==='streams' && <Streams/>}
          {activeTab==='careers' && <CareerMaps/>}
          {activeTab==='colleges' && <Colleges/>}
          {activeTab==='resources' && <Resources/>}
          {activeTab==='twin' && <DigitalTwin profile={profile}/>}
          {activeTab==='profile' && <ProfileTab profile={profile} setProfile={setProfile} />}
        </main>
      </div>
    </div>
    <Footer/>
  </div>);
}

function Row({t,d}){ return (<div style={{ display:'flex', justifyContent:'space-between', fontSize:14, border:'1px solid #e2e8f0', borderRadius:12, padding:'8px 12px', marginTop:8 }}><span>{t}</span><span style={{ display:'inline-block', padding:'2px 6px', border:'1px solid #94a3b8', borderRadius:10 }}>{d}</span></div>); }

export default function App(){
  return <AuthProvider><Layout/></AuthProvider>;
}
