import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, LocateFixed, Filter } from 'lucide-react';
import { Button, Input, Select, Badge } from '../components/UI.jsx';

/* ---------- Utilities ---------- */
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function normalizeCoords(raw){
  let lat = raw?.lat ?? raw?.latitude ?? raw?.latlong?.lat ?? raw?.latlon?.lat;
  let lng = raw?.lng ?? raw?.lon ?? raw?.longitude ?? raw?.latlong?.lng ?? raw?.latlon?.lng ?? raw?.latlong?.lon;
  if (typeof lat === 'string') lat = parseFloat(lat);
  if (typeof lng === 'string') lng = parseFloat(lng);
  // swap if obviously flipped
  if ((lat != null && Math.abs(lat) > 90) || (lng != null && Math.abs(lng) > 180)) {
    const t = lat; lat = lng; lng = t;
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  lat = clamp(lat, -90, 90);
  lng = clamp(lng, -180, 180);
  return { lat, lng };
}

function OfflineMiniMap({ lat, lng }){
  const w=600,h=260;
  const x=((lng+180)/360)*w;
  const y=((90-(lat+90))/180)*h;
  const lines=[]; for(let i=0;i<=12;i++){ lines.push({x:(w/12)*i,y:(h/6)*i}); }
  return (<svg width='100%' height={h} viewBox={`0 0 ${w} ${h}`} style={{ borderRadius:12, background:'#f8fafc', border:'1px solid #e2e8f0' }}>
    {lines.map((g,i)=>(<line key={`v${i}`} x1={g.x} y1={0} x2={g.x} y2={h} stroke='#e5e7eb' strokeWidth='1'/>))}
    {lines.map((g,i)=>(<line key={`h${i}`} x1={0} y1={g.y} x2={w} y2={g.y} stroke='#e5e7eb' strokeWidth='1'/>))}
    <circle cx={x} cy={y} r={6} fill='#0f172a'/>
    <text x={x+10} y={y-8} fontSize='12' fill='#0f172a'>You</text>
  </svg>);
}

export default function Colleges(){
  // -- original state (kept) --
  const [coords,setCoords]=useState({lat:13.04,lng:80.27});
  const [geoError,setGeoError]=useState('');
  const [allowNet,setAllowNet]=useState(()=> (localStorage.getItem('eg_map_pref')==='online'));

  // -- API integration state --
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState('');

  // search state
  const [search, setSearch] = useState('');
  const [openSuggest, setOpenSuggest] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // selected college (for overlay label & center pin)
  const [selectedCollege, setSelectedCollege] = useState(null);

  // Prefer Vite env, fall back to CRA env, then localhost.
  const API_BASE =
    (typeof import.meta !== "undefined" && import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
    "http://localhost:5000";

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/colleges?limit=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!abort) setColleges(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!abort) setLoadErr('Unable to load colleges');
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [API_BASE]);

  // Suggestions by name
  const nameSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return colleges
      .filter(c => (c.name || '').toLowerCase().includes(q))
      .slice(0, 20);
  }, [search, colleges]);

  /* ---------- Map URL with exact pin & zoom ---------- */
  const zoom = 17; // close view on selection
  const lat = coords.lat, lng = coords.lng;
  const deltaLat = 0.01; // ~1.1km
  const deltaLon = deltaLat / Math.max(0.3, Math.cos(lat * Math.PI / 180)); // account for longitude shrink
  const bbox = `${(lng - deltaLon).toFixed(6)},${(lat - deltaLat).toFixed(6)},${(lng + deltaLon).toFixed(6)},${(lat + deltaLat).toFixed(6)}`;
  const osmSrc=`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)},${lng.toFixed(6)}&zoom=${zoom}`;

  const useMyLocation=()=>{
    if(!navigator.geolocation){ setGeoError('Geolocation unavailable in this browser'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{ setCoords({lat:pos.coords.latitude,lng:pos.coords.longitude}); setGeoError(''); setSelectedCollege(null); },
      ()=>{ setGeoError('Permission denied or unavailable'); }
    );
  };

  // Fetch lat/lng and center map by college id
  async function showOnMapByCollege(college){
    if(!college) return;
    const id = college.id ?? college.college_id;
    if(!id){ setGeoError('Missing college id'); return; }
    try {
      setGeoError('');
      const res = await fetch(`${API_BASE}/colleges/latlong/${id}`);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const fixed = normalizeCoords(data);
      if (fixed) {
        setCoords(fixed);
        setSelectedCollege({ id, name: college.name, district: college.district });
      } else {
        setGeoError('Invalid coordinates received');
      }
    } catch (e) {
      setGeoError('Unable to fetch college coordinates');
    }
  }

  // keyboard navigation in suggestions
  function onKeyDown(e){
    if(!openSuggest) return;
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, nameSuggestions.length - 1));
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if(e.key === 'Enter'){
      e.preventDefault();
      const picked = nameSuggestions[activeIndex];
      if(picked){
        setSearch(picked.name);
        setOpenSuggest(false);
        showOnMapByCollege(picked);
      }
    } else if(e.key === 'Escape'){
      setOpenSuggest(false);
    }
  }

  return <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16}}>
    {/* LEFT: map/search pane */}
    <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16, position:'relative'}}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <MapPin size={16}/> <b>Nearby Government Colleges</b>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:12, position:'relative', alignItems:'stretch' }}>
        {/* Bigger search box */}
        <div style={{ flexGrow: 1, minWidth: 340, position:'relative' }}>
          <Input
            placeholder='Search college by name…'
            value={search}
            onChange={(e)=>{ setSearch(e.target.value); setOpenSuggest(true); setActiveIndex(0);}}
            onFocus={()=> setOpenSuggest(!!search)}
            onKeyDown={onKeyDown}
            style={{ height: 42 }}
          />
          {/* suggestions dropdown */}
          {openSuggest && nameSuggestions.length > 0 && (
            <div style={{
              position:'absolute', top:'100%', left:0, right:0, zIndex:50,
              background:'#fff', border:'1px solid #e2e8f0', borderRadius:8,
              boxShadow:'0 10px 24px rgba(0,0,0,.08)', maxHeight:240, overflowY:'auto', marginTop:6
            }}>
              {nameSuggestions.map((c, i)=>(
                <div
                  key={c.id ?? c.name}
                  onMouseDown={(e)=>{ e.preventDefault(); }}  /* prevent input blur before click */
                  onClick={()=>{ setSearch(c.name); setOpenSuggest(false); showOnMapByCollege(c); }}
                  style={{
                    padding:'10px 12px', cursor:'pointer', display:'flex', justifyContent:'space-between',
                    background: i===activeIndex ? '#f1f5f9' : '#fff'
                  }}
                >
                  <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                  <span style={{ fontSize:12, color:'#64748b', marginLeft:8 }}>{c.district || ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Smaller KM select */}
        <div style={{ width: 120 }}>
          <Select value={'10 km'} onChange={()=>{}} options={['5 km','10 km','25 km','50 km'].map(r=>({value:r,label:r}))} />
        </div>
        <Button variant='outline'><span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Filter size={16}/> Filters</span></Button>
      </div>

      {/* Map block with overlay label + center pin */}
      {!allowNet ? (
        <div style={{ border:'1px dashed #cbd5e1', borderRadius:16, padding:12, display:'grid', gap:12 }}>
          <OfflineMiniMap lat={coords.lat} lng={coords.lng} />
          <div style={{ fontSize:12, color:'#475569' }}>Showing offline mini-map (no network). Enable online tiles to view live OpenStreetMap.</div>
        </div>
      ) : (
        <div style={{ border:'1px dashed #cbd5e1', borderRadius:16, padding:8, position:'relative' }}>
          {/* Overlay chip with college name */}
          {selectedCollege && (
            <div style={{
              position:'absolute',
              top:12,
              left:12,
              zIndex:5,
              background:'#0f172a',
              color:'#fff',
              padding:'8px 12px',
              borderRadius:12,
              fontSize:12,
              boxShadow:'0 6px 20px rgba(0,0,0,0.15)',
              maxWidth:'70%',
              whiteSpace:'nowrap',
              overflow:'hidden',
              textOverflow:'ellipsis',
              pointerEvents:'none'
            }} title={selectedCollege.name + (selectedCollege.district ? `, ${selectedCollege.district}` : '')}>
              {selectedCollege.name}{selectedCollege.district ? ` • ${selectedCollege.district}` : ''}
            </div>
          )}

          {/* Center-pin overlay to guarantee a visible pin even if OSM embed marker fails */}
          <div style={{
            position:'absolute',
            top:'50%',
            left:'50%',
            transform:'translate(-50%, -100%)',
            zIndex:4,
            width:0,
            height:0,
            pointerEvents:'none'
          }}>
            <svg width="28" height="40" viewBox="0 0 28 40">
              <path d="M14 0C6.82 0 1 5.82 1 13c0 10.5 13 27 13 27s13-16.5 13-27C27 5.82 21.18 0 14 0z" fill="#e11d48" stroke="#ffffff" strokeWidth="2"/>
              <circle cx="14" cy="13" r="4" fill="#ffffff"/>
            </svg>
          </div>

          <iframe
            key={`${lat.toFixed(6)},${lng.toFixed(6)}`} /* force refresh on coord change */
            title='College Map'
            src={osmSrc}
            style={{ border:'none', borderRadius:12, height:260, width:'100%' }}
          />
        </div>
      )}
      <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:12 }}>
        <Button variant='outline' onClick={useMyLocation}><LocateFixed size={16}/> Use my location</Button>
        <Button variant='outline' onClick={()=>{ const n=!allowNet; setAllowNet(n); localStorage.setItem('eg_map_pref', n?'online':'offline'); }}>{allowNet? 'Disable online tiles' : 'Enable online tiles'}</Button>
        {geoError && <span style={{ fontSize:12, color:'#991b1b' }}>{geoError}</span>}
      </div>
    </div>

    {/* RIGHT: scrollable + data from API */}
    <div style={{border:'1px solid #e2e8f0', borderRadius:14, background:'#fff', padding:16}}>
      <b>Programs & Cut-offs</b>
      <div style={{ display:'grid', gap:10, marginTop:8, maxHeight:'70vh', overflowY:'auto', paddingRight:8 }}>
        {loading && (
          <div style={{ fontSize:14, color:'#64748b' }}>Loading colleges…</div>
        )}
        {loadErr && !loading && (
          <div style={{ fontSize:14, color:'#991b1b' }}>{loadErr}</div>
        )}
        {!loading && !loadErr && colleges.length === 0 && (
          <div style={{ fontSize:14, color:'#64748b' }}>No colleges found.</div>
        )}

        {!loading && !loadErr && colleges.map((c)=>(
          <div key={c.id ?? c.name} style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:600 }}>{c.name}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>
                  {c.district ? <>District: {c.district}</> : '—'}
                </div>
              </div>
              {c.cutoff
                ? <Badge>Cut-off {c.cutoff}</Badge>
                : (c.district ? <Badge>{c.district}</Badge> : <span />)
              }
            </div>

            {Array.isArray(c.programs) && c.programs.length > 0 && (
              <div style={{ marginTop:8, display:'flex', gap:6, flexWrap:'wrap' }}>
                {c.programs.map((p)=>(<Badge key={p}>{p}</Badge>))}
              </div>
            )}
            {Array.isArray(c.facilities) && c.facilities.length > 0 && (
              <div style={{ marginTop:6, fontSize:12, color:'#64748b' }}>
                Facilities: {c.facilities.join(', ')}
              </div>
            )}

            <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
              <Button variant='outline' onClick={()=> showOnMapByCollege(c)}>Show on map</Button>
              <Button variant='outline'>View details</Button>
              <Button>Apply</Button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:12, color:'#94a3b8', marginTop:8 }}>
        Source: <code>{API_BASE}/colleges</code> &nbsp;•&nbsp; Coords: <code>{API_BASE}/colleges/latlong/:id</code>
      </div>
    </div>
  </div>;
}
