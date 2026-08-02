
import React from 'react';
import { Sparkles } from 'lucide-react';
import { S } from './UI.jsx';

export default function Footer(){
  return (
    <footer style={{ borderTop:'1px solid #e2e8f0', marginTop:24 }}>
      <div style={{ ...S.container, padding:'16px 0', display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', justifyContent:'space-between', fontSize:12, color:'#64748b' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Sparkles size={12}/> Offline-first • Multilingual • Accessible</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:12 }}>
          <a href='#' style={{ textDecoration:'underline', color:'#0f172a' }}>Privacy</a>
          <a href='#' style={{ textDecoration:'underline', color:'#0f172a' }}>Terms</a>
          <a href='#' style={{ textDecoration:'underline', color:'#0f172a' }}>Help</a>
        </div>
      </div>
    </footer>
  );
}
