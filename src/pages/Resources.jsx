
import React from 'react';
import { CalendarDays, Users, Send } from 'lucide-react';
import { Button, Input, Badge } from '../components/UI.jsx';

export default function Resources(){
  const scholarships=[{name:'NSP – Post-Matric Scholarship',due:'Sep 30',type:'Need-based'},{name:'State Merit Scholarship',due:'Oct 10',type:'Merit'},{name:'Girl Child Scholarship',due:'Oct 25',type:'Women'}];
  return <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
    <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
      <b style={{ display:'inline-flex', alignItems:'center', gap:8 }}><CalendarDays size={16}/> Key Deadlines</b>
      <Row label='UG Admission – Phase 1' date='Sep 20'/>
      <Row label='Counselling – Round 1' date='Oct 05'/>
      <Row label='Counselling – Round 2' date='Oct 26'/>
      <Button variant='outline' style={{ width:'100%', marginTop:8 }}>Add to Calendar</Button>
    </div>
    <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
      <b style={{ display:'inline-flex', alignItems:'center', gap:8 }}><Users size={16}/> Scholarships</b>
      <div style={{ display:'grid', gap:10, marginTop:8 }}>
        {scholarships.map(s=>(
          <div key={s.name} style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontWeight:600 }}>{s.name}</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Type: {s.type}</div>
            </div>
            <Badge>Due {s.due}</Badge>
          </div>
        ))}
      </div>
      <Button variant='outline' style={{ width:'100%', marginTop:8 }}>Explore more</Button>
    </div>
    <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
      <b style={{ display:'inline-flex', alignItems:'center', gap:8 }}><Users size={16}/> Mentor Chat</b>
      <div style={{ border:'1px solid #e2e8f0', borderRadius:16, height:160, padding:12, overflowY:'auto', display:'grid', gap:8, fontSize:14, marginTop:8 }}>
        <Chat who='Mentor' text='Hi! Tell me your interests and we’ll shortlist degrees in nearby govt colleges.'/>
        <Chat who='You' text='I like math and building things. I want a job soon after graduation.'/>
        <Chat who='Mentor' text='Great! B.Sc. CS or B.Voc Software could fit. Let’s compare Science vs Vocational.'/>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <Input placeholder='Type a message…'/>
        <Button size='icon'><Send size={16}/></Button>
      </div>
    </div>
  </div>;
}

function Row({label,date}){ return (<div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}><span>{label}</span><Badge>{date}</Badge></div>); }
function Chat({ who, text }){ const me = who==='You'; return (<div style={{ display:'flex', justifyContent: me?'flex-end':'flex-start' }}><div style={{ maxWidth:'80%', borderRadius:14, padding:'8px 10px', fontSize:14, background: me?'#0f172a':'#f1f5f9', color: me?'#fff':'#0f172a' }}><div style={{ fontSize:10, opacity:0.7, marginBottom:4 }}>{who}</div>{text}</div></div>); }
