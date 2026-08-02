
import React from 'react';

export const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(#f8fafc,#ffffff)' },
  container: { margin: '0 auto', maxWidth: 1120, padding: 16 },
  grid: (cols, gap = 16) => ({ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap }),
  card: { border: '1px solid #e2e8f0', borderRadius: 14, background: '#fff', padding: 16 },
  header: { position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e2e8f0', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' },
};

export const Button = ({ variant='solid', size='md', style, children, ...props }) => (
  <button type={props.type || 'button'} style={{ 
    fontSize: 14, padding: size==='icon' ? 10 : '10px 12px', borderRadius: 12, 
    border: variant==='outline' ? '1px solid #94a3b8' : '1px solid #0f172a',
    background: variant==='outline' ? '#fff' : '#0f172a',
    color: variant==='outline' ? '#0f172a' : '#fff',
    cursor:'pointer', ...style }} {...props}>{children}</button>
);

export const Card = ({ title, icon, children, style, headerRight }) => (
  <div style={{ ...S.card, ...style }}>
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>{icon} <span>{title}</span></div>
        {headerRight}
      </div>
    )}
    <div>{children}</div>
  </div>
);

export const Input = (props) => <input style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #cbd5e1', fontSize:14 }} {...props} />;
export const Badge = ({ children }) => <span style={{ display:'inline-block', padding:'4px 8px', fontSize:12, borderRadius:10, border:'1px solid #94a3b8' }}>{children}</span>;
export const Switch = ({ checked, onChange }) => <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} />;

export function getOptionParts(o){ if(typeof o==='string') return {value:o,label:o}; if(o&&typeof o==='object') return {value:String(o.value),label:String(o.label ?? o.value)}; return {value:'',label:''}; }
export const Select = ({ value, onChange, options }) => (
  <select style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #cbd5e1', fontSize:14 }} value={value} onChange={(e)=>onChange(e.target.value)}>
    {options.map((o,i)=>{ const {value:v,label:l}=getOptionParts(o); return <option key={`${v}-${i}`} value={v}>{l}</option>; })}
  </select>
);

export const Progress = ({ value }) => <div style={{ width:'100%', height:8, background:'#e2e8f0', borderRadius:8 }}><div style={{ width:`${value}%`, height:8, background:'#0f172a', borderRadius:8 }} /></div>;

export const Metric = ({ icon, label, value, hint }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:10, padding:'8px 10px' }}>
    {icon}
    <div style={{ lineHeight:1 }}>
      <div style={{ fontSize:12, color:'#64748b' }}>{label}</div>
      <div style={{ fontWeight:700 }}>{value}</div>
      {hint && <div style={{ fontSize:11, color:'#94a3b8' }}>{hint}</div>}
    </div>
  </div>
);
