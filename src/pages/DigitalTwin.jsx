
import React, { useMemo, useRef, useState } from 'react';
import { Layers, Target, TrendingUp, Clock } from 'lucide-react';
import { Button, Input, Select, Progress, Metric } from '../components/UI.jsx';

export default function DigitalTwin({ profile }){
  const [config,setConfig]=useState({ targetRole:'Software Developer', horizon:4, city: profile?.district || 'Local', priority:{ salary:60, stability:70, passion:80 } });
  const twinRef = useRef(null);
  const [download,setDownload]=useState({ url:'', name:'' });

  const scenarios=useMemo(()=>[
    { key:'science_path', label:'Science → B.Sc. CS → Dev', timeToJob:36, estSalary:'₹22–35k/mo', fit:86, cost:'₹40–60k/yr', notes:'Higher theory depth; opens MCA/GATE.' },
    { key:'vocational_path', label:'Vocational → B.Voc Software → Jr Dev', timeToJob:24, estSalary:'₹18–28k/mo', fit:78, cost:'₹25–45k/yr', notes:'More hands-on; faster entry to work.' },
  ],[]);

  const exportPDF = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const input = twinRef.current; if(!input) return;
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const ratio = canvas.width / canvas.height;
      const imgWidth = pageWidth - 40;
      const imgHeight = imgWidth / ratio;
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      setDownload({ url, name: 'DigitalTwin.pdf' });
    } catch (e) { alert('Export failed: ' + (e?.message || e)); }
  };

  const exportPNG = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const input = twinRef.current; if(!input) return;
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const dataUrl = canvas.toDataURL('image/png');
      setDownload({ url: dataUrl, name: 'DigitalTwin.png' });
      const win = window.open(); if (win) { win.document.write(`<iframe src="${dataUrl}" style="width:100%;height:100%"/>`); }
    } catch (e) { alert('Export failed: ' + (e?.message || e)); }
  };

  const skills=[
    { name:'Programming (Java/Python)', match:55 },
    { name:'Problem Solving', match:62 },
    { name:'Databases (SQL)', match:40 },
    { name:'Communication', match:70 },
  ];

  const PRIORITIES=[ ['salary','Prioritize Salary'], ['stability','Prioritize Stability'], ['passion','Prioritize Passion/Interest'] ];

  return (<div ref={twinRef} id='digital-twin-section'>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:16 }}>
      <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
        <b style={{ display:'inline-flex', alignItems:'center', gap:8 }}><Layers size={16}/> Build Your Digital Twin</b>
        <div style={{ display:'grid', gap:12, fontSize:14, marginTop:8 }}>
          <div><div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Target role</div>
            <Input value={config.targetRole} onChange={(e)=>setConfig({...config, targetRole:e.target.value})} placeholder='e.g., Software Developer'/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Horizon (years)</div>
              <Select value={String(config.horizon)} onChange={(v)=>setConfig({...config, horizon:Number(v)})} options={[2,3,4,5,6].map(y=>({value:String(y),label:String(y)}))}/>
            </div>
            <div><div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Preferred city</div>
              <Input value={config.city} onChange={(e)=>setConfig({...config, city:e.target.value})}/>
            </div>
          </div>
          {PRIORITIES.map(([k,label])=> (
            <div key={k}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:12 }}>{label}</span><span style={{ fontSize:12 }}>{config.priority[k]}%</span></div>
              <input type='range' min={0} max={100} value={config.priority[k]} onChange={(e)=>setConfig({...config, priority:{...config.priority, [k]:Number(e.target.value)}})} style={{ width:'100%' }}/>
            </div>
          ))}
          <div style={{ background:'#f8fafc', borderRadius:12, padding:10, fontSize:12, color:'#64748b' }}>
            Data sources to integrate: O*NET/RIASEC skills, NCS/NCO occupation codes, SWAYAM courses.
          </div>
        </div>
      </div>

      <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
        <b style={{ display:'inline-flex', alignItems:'center', gap:8 }}><Target size={16}/> Simulated Path to {config.targetRole}</b>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:8 }}>
          <div style={{ border:'1px solid #e2e8f0', borderRadius:16, padding:12 }}>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Timeline</div>
            <ol style={{ paddingLeft:0, listStyle:'none', display:'grid', gap:8 }}>
              {[
                { label:'Choose Stream & College', months:2 },
                { label:'Semester 1–2: Foundations + Clubs', months:12 },
                { label:'Internship / Projects', months:3 },
                { label:'Semester 3–6: Specialisation', months:24 },
                { label:'Placement / Entry Role', months:3 },
              ].map((s,i)=>(<li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <span style={{ marginTop:2, height:20, width:20, borderRadius:999, border:'1px solid #94a3b8', fontSize:12, display:'grid', placeItems:'center' }}>{i+1}</span>
                  <span style={{ fontSize:14 }}>{s.label} <span style={{ fontSize:12, color:'#64748b' }}>• ~{s.months} mo</span></span>
              </li>))}
            </ol>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8 }}>
              <Metric icon={<Clock size={16}/>} label='Time to first job' value='24–36 mo'/>
              <Metric icon={<TrendingUp size={16}/>} label='Growth outlook' value='Positive'/>
            </div>
          </div>

          <div style={{ border:'1px solid #e2e8f0', borderRadius:16, padding:12 }}>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Compare Scenarios</div>
            <div style={{ display:'grid', gap:10 }}>
              {scenarios.map(sc=>(
                <div key={sc.key} style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><div style={{ fontWeight:600, fontSize:14 }}>{sc.label}</div><span style={{ fontSize:12, border:'1px solid #94a3b8', borderRadius:10, padding:'2px 6px' }}>Fit {sc.fit}%</span></div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, fontSize:12, marginTop:6 }}>
                    <div><div style={{ color:'#64748b' }}>Time</div><div style={{ fontWeight:600 }}>{sc.timeToJob} mo</div></div>
                    <div><div style={{ color:'#64748b' }}>Salary</div><div style={{ fontWeight:600 }}>{sc.estSalary}</div></div>
                    <div><div style={{ color:'#64748b' }}>Cost</div><div style={{ fontWeight:600 }}>{sc.cost}</div></div>
                  </div>
                  <div style={{ marginTop:6, fontSize:12, color:'#64748b' }}>{sc.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:12, alignItems:'center' }}>
          <Button variant='outline' onClick={exportPDF}>Export PDF</Button>
          <Button variant='outline' onClick={exportPNG}>Export PNG</Button>
          {download.url && (<a href={download.url} download={download.name} style={{ marginLeft:8, textDecoration:'underline' }}>Download: {download.name}</a>)}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>
          <div style={{ border:'1px solid #e2e8f0', borderRadius:16, padding:12 }}>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Skill Gaps (vs target role)</div>
            <div style={{ display:'grid', gap:10 }}>
              {skills.map((sk,i)=>(<div key={i}><div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:14 }}>{sk.name}</span><span style={{ fontSize:14 }}>{sk.match}%</span></div><Progress value={sk.match}/></div>))}
            </div>
          </div>
          <div style={{ border:'1px solid #e2e8f0', borderRadius:16, padding:12 }}>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Actions & Resources</div>
            <ul style={{ paddingLeft:0, listStyle:'none', display:'grid', gap:8 }}>
              <li style={{ display:'flex', justifyContent:'space-between' }}><span>SWAYAM: Programming in Python</span><Button variant='outline'>View</Button></li>
              <li style={{ display:'flex', justifyContent:'space-between' }}><span>SWAYAM: Database Systems</span><Button variant='outline'>View</Button></li>
              <li style={{ display:'flex', justifyContent:'space-between' }}><span>NCS: Explore NCO codes for Software Developer</span><Button variant='outline'>Open</Button></li>
            </ul>
            <div style={{ marginTop:8, fontSize:12, color:'#64748b' }}>Map interests with RIASEC → match to occupations → shortlist college programs.</div>
          </div>
        </div>
      </div>
    </div>
  </div>);
}
