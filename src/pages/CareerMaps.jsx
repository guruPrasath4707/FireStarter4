import React, { useEffect, useMemo, useState } from "react"

/**
 * CareerMaps – polished light/blue UI (Tailwind-only)
 * Features:
 * - Stream segmented control + manual entry (with validation)
 * - Search, SSC filter, NSQF range (min/max)
 * - Stats, loading skeleton, improved error/empty states
 * - Accessible accordion for tracks, role details modal
 * - Shortlist (client-side) + CSV export
 * - Configurable API base: VITE_API_BASE || window.API_BASE || http://localhost:5000
 */

const STREAMS = ["science","commerce","arts"];
const API_BASE =
  (import.meta?.env && import.meta.env.VITE_API_BASE) ||
  (typeof window !== "undefined" && window.API_BASE) ||
  "http://localhost:5000";

const isValidStream = (s) => STREAMS.includes((s||"").toLowerCase());

function getInitialStream() {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("stream") || "").toLowerCase();
    if (isValidStream(q)) return q;
  } catch {}
  try {
    const ls = (localStorage.getItem("recommended_stream") || "").toLowerCase();
    if (isValidStream(ls)) return ls;
  } catch {}
  return "science";
}

export default function CareerMaps() {
  const [stream, setStream] = useState(getInitialStream());
  const [manual, setManual] = useState(stream);
  const [manualError, setManualError] = useState("");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({}); // idx -> open

  // Filters
  const [sscFilter, setSsc] = useState("all");
  const [nsqfMin, setMin] = useState(1);
  const [nsqfMax, setMax] = useState(8);

  // Shortlist & Modal
  const [shortlist, setShortlist] = useState([]);
  const [modal, setModal] = useState(null);

  // Fetch API
  useEffect(() => {
    setData(null);
    setError(null);
    const url = `${API_BASE}/careermaps?stream=${encodeURIComponent(stream)}`;
    fetch(url)
      .then(async (r) => {
        if (!r.ok) {
          const t = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} ${t ? "– " + t : ""}`.trim());
        }
        return r.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Careermaps fetch failed:", err);
        setError(String(err.message || err));
        setData({ stream, tracks: [] });
      });
  }, [stream]);

  // Remember last selection
  useEffect(() => {
    try { localStorage.setItem("recommended_stream", stream); } catch {}
  }, [stream]);

  // All SSC options (derived from current data)
  const allSSC = useMemo(() => {
    const set = new Set();
    (data?.tracks || []).forEach(t => (t.roles||[]).forEach(r => r.ssc && set.add(r.ssc)));
    return ["all", ...Array.from(set).sort()];
  }, [data]);

  // Filtered view
  const filtered = useMemo(() => {
    if (!data?.tracks) return [];
    const q = query.trim().toLowerCase();
    return data.tracks.map(t => ({
      ...t,
      roles: (t.roles || []).filter(r => {
        if (sscFilter !== "all" && r.ssc !== sscFilter) return false;
        const level = typeof r.nsqf_level === "number" ? r.nsqf_level : Number(r.nsqf_level || 0);
        if (level && (level < nsqfMin || level > nsqfMax)) return false;
        const text = `${r.role || ""} ${r.nco_title || ""} ${r.nco_code || ""}`.toLowerCase();
        return q ? text.includes(q) : true;
      })
    })).filter(t => (t.roles||[]).length > 0);
  }, [data, query, sscFilter, nsqfMin, nsqfMax]);

  // Stats
  const stats = useMemo(() => {
    const tracks = filtered.length;
    const roles = filtered.reduce((n,t)=> n + ((t.roles||[]).length), 0);
    return { tracks, roles };
  }, [filtered]);

  // CSV export (all visible rows)
  const exportCSV = () => {
    const rows = [["track","role","nco_code","nco_title","nsqf_level","ssc"]];
    filtered.forEach(t => (t.roles||[]).forEach(r => rows.push([
      t.career_track, r.role || "", r.nco_code || "", r.nco_title || "",
      r.nsqf_level == null ? "" : String(r.nsqf_level), r.ssc || ""
    ])));
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
    const href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const a = document.createElement("a"); a.href = href; a.download = `career-maps-${stream}.csv`; a.click();
  };

  // Shortlist helpers
  const keyFor = (r) => `${r.role}|${r.nco_code}`;
  const toggleShortlist = (roleObj, track) => {
    const obj = { ...roleObj, track, __k: keyFor(roleObj) };
    setShortlist(prev => prev.some(x=>x.__k===obj.__k) ? prev.filter(x=>x.__k!==obj.__k) : [...prev, obj]);
  };

  // Manual input apply
  const applyManual = () => {
    const v = (manual || "").trim().toLowerCase();
    if (!isValidStream(v)) { setManualError('Please enter one of: "science", "commerce", or "arts".'); return; }
    setManualError(""); setStream(v);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
      {/* Top header */}
      <header className="border-b border-blue-100/60 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm text-white font-bold">CM</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Career Maps</h1>
              <p className="text-sm text-slate-600">Explore roles aligned with your stream</p>
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                placeholder="Search roles or NCO title…"
                className="pl-9 pr-3 py-2 rounded-lg border border-blue-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button onClick={exportCSV}
              className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50">
              Export CSV
            </button>
            <button onClick={()=>window.print()}
              className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50">
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stream selection card */}
        <section className="rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="p-4 md:p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                  Current: {stream}
                </span>
                <span className="text-slate-500">API: <code className="text-slate-700">{API_BASE}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>{ const next={}; (filtered||[]).forEach((_,i)=>next[i]=true); setExpanded(next); }}
                        className="px-3 py-1.5 rounded-md text-sm border border-slate-200 bg-white hover:bg-slate-50">Expand all</button>
                <button onClick={()=>setExpanded({})}
                        className="px-3 py-1.5 rounded-md text-sm border border-slate-200 bg-white hover:bg-slate-50">Collapse all</button>
              </div>
            </div>

            {/* Segmented control */}
            <div className="inline-flex rounded-xl border border-blue-200 bg-blue-50 p-1">
              {STREAMS.map(s => {
                const active = s === stream;
                return (
                  <button key={s} onClick={()=>{ setStream(s); setManual(s); }}
                    className={"px-4 py-2 rounded-lg text-sm font-semibold transition " + (active ? "bg-white text-blue-700 shadow-sm" : "text-blue-700/70 hover:text-blue-800")}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* Manual entry */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <label className="text-sm font-semibold text-slate-700">Enter stream (science / commerce / arts):</label>
              <input
                value={manual}
                onChange={e=>setManual(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); applyManual(); }}}
                className="px-3 py-2 rounded-lg border border-blue-200 bg-white w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g., science"
              />
              <button onClick={()=>{ const v=(manual||"").trim().toLowerCase(); if(!isValidStream(v)){ setManualError('Please enter one of: "science", "commerce", or "arts".'); return; } setManualError(""); setStream(v); }}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
                Apply
              </button>
              {manualError && <span className="text-sm text-red-600">{manualError}</span>}
            </div>

            {/* Filter row */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">SSC</span>
                <select value={sscFilter} onChange={e=>setSsc(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm">
                  {allSSC.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                NSQF
                <input type="number" min={1} max={8} value={nsqfMin} onChange={e=>setMin(Number(e.target.value)||1)}
                       className="w-16 px-2 py-2 rounded-lg border border-blue-200 bg-white"/>
                –
                <input type="number" min={1} max={8} value={nsqfMax} onChange={e=>setMax(Number(e.target.value)||8)}
                       className="w-16 px-2 py-2 rounded-lg border border-blue-200 bg-white"/>
              </div>
            </div>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm">
            <div className="font-semibold">Couldn’t load career maps</div>
            <div className="mt-1">{error}</div>
            <div className="mt-1 text-xs text-red-600/80">Check your server and database tables.</div>
          </div>
        )}

        {/* Stats */}
        <section className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase text-slate-500">Tracks</div>
            <div className="text-2xl font-bold text-slate-900">{stats.tracks}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase text-slate-500">Roles</div>
            <div className="text-2xl font-bold text-slate-900">{stats.roles}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase text-slate-500">Stream</div>
            <div className="text-2xl font-bold text-blue-700">{stream[0].toUpperCase() + stream.slice(1)}</div>
          </div>
        </section>

        {/* Loading skeleton */}
        {!data && (
          <section className="mt-6 space-y-3">
            {Array.from({length:4}).map((_,i)=>(
              <div key={i} className="h-24 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100 animate-pulse border border-slate-200"/>
            ))}
          </section>
        )}

        {/* Empty state */}
        {data && filtered.length === 0 && !error && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">No results for this stream</h3>
            <p className="mt-1 text-slate-600">Try changing the stream above or clearing the search.</p>
          </section>
        )}

        {/* Tracks */}
        {data && filtered.length > 0 && (
          <section className="mt-6 space-y-3">
            {filtered.map((t, idx) => {
              const isOpen = !!expanded[idx];
              return (
                <div key={t.career_track} className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={()=> setExpanded(p => ({...p, [idx]: !isOpen}))}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-blue-50/60 transition"
                    aria-expanded={isOpen}
                    aria-controls={`panel-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200"/>
                      <div>
                        <div className="font-semibold text-slate-900">{t.career_track}</div>
                        <div className="text-xs text-slate-500">{(t.roles||[]).length} roles</div>
                      </div>
                    </div>
                    <span className={"text-xl " + (isOpen ? "text-blue-700" : "text-blue-600")}>
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div id={`panel-${idx}`} className="px-4 pb-4 md:px-5 md:pb-5 grid gap-3 sm:grid-cols-2">
                      {(t.roles || []).map((r) => {
                        const k = (r.role||"")+"|"+(r.nco_code||"");
                        const inList = shortlist.some(x => x.__k === k);
                        return (
                          <div key={t.career_track + "-" + r.role} className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium text-slate-900">{r.role}</div>
                              <div className="flex flex-wrap gap-2">
                                {r.nco_code && (
                                  <span className="px-2 py-1 text-xs font-semibold border border-blue-200 rounded-full bg-white text-blue-700">NCO {r.nco_code}</span>
                                )}
                                {r.nsqf_level != null && (
                                  <span className="px-2 py-1 text-xs font-semibold border border-blue-200 rounded-full bg-white text-blue-700">NSQF {r.nsqf_level}</span>
                                )}
                                {r.ssc && (
                                  <span className="px-2 py-1 text-xs font-semibold border border-blue-200 rounded-full bg-white text-blue-700">{r.ssc}</span>
                                )}
                              </div>
                            </div>
                            {r.nco_title && (
                              <p className="mt-1 text-sm text-slate-700">{r.nco_title}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <button onClick={()=>setModal({...r, track:t.career_track})}
                                className="flex-1 px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold hover:bg-blue-50">Details</button>
                              <button onClick={()=>toggleShortlist(r, t.career_track)}
                                className={"flex-1 px-3 py-2 rounded-lg font-semibold " + (inList
                                  ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
                                  : "border border-blue-200 bg-blue-600 text-white hover:bg-blue-700")}
                              >{inList ? "Remove" : "Shortlist"}</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* Shortlist floater */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button onClick={exportCSV}
          className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50">Export All</button>
        <button onClick={()=>alert(shortlist.map(s=>s.role).join("\n") || "No items added yet.")}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Shortlist ({shortlist.length})</button>
      </div>

      {/* Role Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="font-bold text-lg">{modal.role}</div>
              <button onClick={()=>setModal(null)} className="text-slate-500 hover:text-slate-700 text-xl">×</button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                {modal.nco_code && <span className="px-2 py-1 text-xs font-semibold border border-blue-200 rounded-full bg-blue-50 text-blue-700">NCO {modal.nco_code}</span>}
                {modal.nsqf_level!=null && <span className="px-2 py-1 text-xs font-semibold border border-blue-200 rounded-full bg-blue-50 text-blue-700">NSQF {modal.nsqf_level}</span>}
                {modal.ssc && <span className="px-2 py-1 text-xs font-semibold border border-blue-200 rounded-full bg-blue-50 text-blue-700">{modal.ssc}</span>}
                {modal.track && <span className="px-2 py-1 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-700">{modal.track}</span>}
              </div>
              {modal.nco_title && <p className="text-slate-700 leading-relaxed">{modal.nco_title}</p>}
              <ul className="list-disc pl-5 text-slate-600 text-sm">
                <li>Suggested next steps: eligibility, entrance exams, internships.</li>
                <li>Build profile: projects, volunteering, certifications.</li>
                <li>Connect with mentors / alumni in this track.</li>
              </ul>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={()=>setModal(null)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50">Close</button>
              <button onClick={()=>{ toggleShortlist(modal, modal.track); setModal(null); }} className="px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Add to Shortlist</button>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500">
        Tip: Type a stream above and click <span className="font-semibold">Apply</span>. Your last choice is remembered.
      </footer>
    </div>
  );
}
