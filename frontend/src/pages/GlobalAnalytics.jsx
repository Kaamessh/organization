import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  TrendingUp, TrendingDown, Users, AlertCircle, 
  MapPin, CheckCircle2, Calendar, Target,
  MousePointer2, Info, BarChart3, ChevronDown, CloudRain,
  Activity, Zap, Shield
} from 'lucide-react';

const LOCATIONS = [
  "Baga Beach", "Calangute Beach", "Anjuna Beach", "Colva Beach", "Palolem Beach", 
  "Vagator Beach", "Miramar Beach", "Dona Paula", "Aguada Fort", "Basilica of Bom Jesus", 
  "Se Cathedral", "Mangueshi Temple", "Dudhsagar Falls", "Bondla Sanctuary", "Salim Ali Bird Sanctuary", 
  "Divar Island", "Chorao Island", "Fontainhas", "Old Goa", "Panjim Market", 
  "Mapusa Market", "Chapora Fort", "Cabo de Rama", "Butterfly Beach", "Cola Beach", 
  "Galgibaga Beach", "Morjim Beach", "Ashwem Beach", "Arambol Beach"
];

const MOCK_ANALYTICS = {
  kpis: [
    { label: "Total Footfall (YTD)", value: "1,524,082", trend: "+14.2% YoY", up: true, icon: <Users size={24} color="#38bdf8" /> },
    { label: "System Stress Index", value: "ELEVATED", trend: "9 Hotspots Critical", up: false, icon: <AlertCircle size={24} color="#fb7185" /> },
    { label: "AI Forecast Accuracy", value: "98.91%", trend: "±12 visitors", up: true, icon: <Target size={24} color="#fbbf24" /> },
    { label: "Active Diversions", value: "18", trend: "+4 since 08:00", up: true, icon: <TrendingUp size={24} color="#34d399" /> },
  ],
  insights: [
    "AI Predict: Calangute Beach peak load @ 14:30 (94% prob).",
    "Regional Shift: Precipitation in North Goa driving 22% surge in Old Goa heritage visits.",
    "Baga-Anjuna Corridor: Congestion detected. Nudge deployment recommended.",
    "Dudhsagar Entry: 98% capacity reached. Slotting system active."
  ],
  hotspots: LOCATIONS.map((name, i) => ({
    name,
    load: Math.floor(20 + Math.random() * 75),
    visitors: Math.floor(500 + Math.random() * 5000),
    capacity: 10000,
    id: i + 1,
    status: (i % 7 === 0) ? 'critical' : ((i % 5 === 0) ? 'warning' : 'optimal')
  })),
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    val: Math.floor(15 + Math.random() * 80),
    count: Math.floor(200 + Math.random() * 1500)
  }))
};

export default function GlobalAnalytics() {
  const [selectedView, setSelectedView] = useState('All Insights'); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [activeHotspotView, setActiveHotspotView] = useState('Actual vs Predicted');
  const [showHotspotDropdown, setShowHotspotDropdown] = useState(false);

  const VIEWS = {
    "Core": ["Actual vs Predicted", "Forecast Distribution", "Capacity Utilization %"],
    "Behavior": ["Crowd Heatmap", "Peak Hours"],
    "Action": ["Alerts Timeline", "Short-Term Trend (24h)"]
  };

  // FULL-YEAR DATASET (Fixes "One Half" issue)
  const masterTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    hist: Math.round(65 + Math.random() * 40),
    forecast: Math.round(85 + Math.random() * 60)
  }));

  const maxVal = 200;
  const points = masterTrend.map((d, i) => ({
    x: (i / 11) * 100,
    y: 35 - ((d.hist / maxVal) * 30),
    fy: 35 - ((d.forecast / maxVal) * 30)
  }));

  return (
    <AdminLayout>
      <div className="enterprise-theme dashboard-analytics" style={{ padding: '1.5rem', minHeight: '100vh', background: '#0f172a', color: '#f8fafc', overflowX: 'hidden' }}>
        
        {/* GLOBAL HEADER */}
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em', margin: 0 }}>Global Analytics Node <span style={{ fontSize: '0.8rem', background: '#38bdf8', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '10px' }}>LIVE v2</span></h1>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0.25rem 0 0' }}>MACRO-TREND INTELLIGENCE & PREDICTIVE MODELING</p>
          </div>
          
          <div className="insight-selector-wrapper" style={{ position: 'relative', zIndex: 1100 }}>
            <button 
              className="view-selector-btn glass-morph primary-trigger" 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem', border: '2px solid #38bdf8', borderRadius: '12px', cursor: 'pointer', background: 'rgba(56, 189, 248, 0.2)', color: '#fff', fontWeight: 900, boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}
            >
              <Users size={18} color="#fff" />
              <span>Global Scope: {selectedView}</span>
              <ChevronDown size={14} style={{ marginLeft: '0.5rem', opacity: 0.9 }} />
            </button>

            {showDropdown && (
              <div className="view-dropdown glass-morph" style={{ position: 'absolute', top: '100%', right: 0, width: '280px', zIndex: 1200, marginTop: '10px', padding: '1rem', background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                <div onClick={() => { setSelectedView('All Insights'); setShowDropdown(false); }} style={{ padding: '0.85rem', fontSize: '0.9rem', color: selectedView === 'All Insights' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', borderRadius: '8px', fontWeight: 800, background: selectedView === 'All Insights' ? 'rgba(56,189,248,0.1)' : 'transparent' }}>All Insights</div>
                {Object.entries(VIEWS).map(([cat, opts]) => (
                  <div key={cat} style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#475569', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat}</div>
                    {opts.map(o => (
                      <div key={o} onClick={() => { setSelectedView(o); setShowDropdown(false); }} style={{ padding: '8px 12px', fontSize: '0.85rem', color: selectedView === o ? '#38bdf8' : '#cbd5e1', cursor: 'pointer', borderRadius: '6px', background: selectedView === o ? 'rgba(56,189,248,0.05)' : 'transparent' }}>{o}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ACTIVE FOCUS PANEL (Interaction predictions per place) */}
        {activeHotspot && (
          <section className="focus-panel glass-morph" style={{ marginBottom: '4rem', padding: '3rem', borderRadius: '32px', border: '2px solid #38bdf8', background: 'rgba(15, 23, 42, 0.8)', animation: 'slideDown 0.4s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ padding: '10px 18px', background: 'linear-gradient(45deg, #38bdf8, #0ea5e9)', color: '#0f172a', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>CORE FOCUS: ACTIVE</div>
                  <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>{activeHotspot.name}</h2>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.75rem' }}>Precision SITREP & Behavioral Predictive Models</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                 <div className="hotspot-view-selector" style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setShowHotspotDropdown(!showHotspotDropdown)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '12px 24px', border: '2px solid #38bdf8', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.1)', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                    >
                      <BarChart3 size={20} />
                      <span>{activeHotspotView}</span>
                      <ChevronDown size={14} />
                    </button>

                    {showHotspotDropdown && (
                      <div className="glass-morph" style={{ position: 'absolute', top: '100%', right: 0, width: '280px', zIndex: 1500, marginTop: '12px', padding: '1rem', background: 'rgba(15, 23, 42, 0.98)', border: '1px solid #38bdf8', borderRadius: '20px', boxShadow: '0 40px 80px rgba(0,0,0,0.9)' }}>
                        {Object.entries(VIEWS).map(([cat, opts]) => (
                          <div key={cat} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#475569', padding: '4px 8px', textTransform: 'uppercase' }}>{cat}</div>
                            {opts.map(o => (
                              <div key={o} onClick={() => { setActiveHotspotView(o); setShowHotspotDropdown(false); }} style={{ padding: '10px 12px', fontSize: '0.85rem', color: activeHotspotView === o ? '#38bdf8' : '#94a3b8', cursor: 'pointer', borderRadius: '8px', background: activeHotspotView === o ? 'rgba(56,189,248,0.1)' : 'transparent', fontWeight: activeHotspotView === o ? 800 : 500 }}>{o}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
                 <button onClick={() => setActiveHotspot(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 900 }}>EXIT NODE</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
               <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 900, marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interactive Prediction Matrix</h3>
                  <div style={{ height: '200px', width: '100%' }}>
                     <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <path d={`M 0 35 ${Array.from({length: 12}).map((_, i) => `L ${(i/11)*100} ${10 + Math.random() * 25}`).join(' ')}`} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                        {Array.from({length: 12}).map((_, i) => (
                          <g key={i}>
                            <circle cx={(i/11)*100} cy={10 + Math.random() * 25} r="0.8" fill="#38bdf8" />
                            <text x={(i/11)*100} y="44" textAnchor="middle" fontSize="1.8" fill="#475569">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</text>
                          </g>
                        ))}
                     </svg>
                  </div>
                  <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
                     <div style={{ flex: 1, padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 900 }}>AI RECOMMENDATION</div>
                        <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0', lineHeight: 1.4 }}>Divert vehicle flow to north parking to prevent predicted gridlock.</p>
                     </div>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#38bdf8', marginBottom: '1.5rem' }}>REAL-TIME SITREP</h3>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 900 }}>OCCUPANCY</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{activeHotspot.visitors.toLocaleString()}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 900 }}>STRESS INDEX</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: activeHotspot.status === 'critical' ? '#fb7185' : '#34d399' }}>{activeHotspot.load}%</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 900 }}>AVG DWELL TIME</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>52m</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 900 }}>RESOURCE LOAD</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24' }}>HIGH</div>
                        </div>
                     </div>
                  </div>
                  <div style={{ padding: '2rem', background: 'linear-gradient(45deg, rgba(56, 189, 248, 0.05), transparent)', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                     <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#38bdf8', marginBottom: '1rem' }}>SITUATIONAL DATA POINTS</h3>
                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}><Zap size={16} color="#fbbf24" /> Node response time: 24ms</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}><Activity size={16} color="#38bdf8" /> Flow velocity: 0.8m/s</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}><Shield size={16} color="#34d399" /> Protocol Alpha-01 Engaged</li>
                     </ul>
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* MACRO GRIDS (Faded when focused) */}
        <div style={{ opacity: activeHotspot ? 0.3 : 1, transition: 'opacity 0.5s ease', pointerEvents: activeHotspot ? 'none' : 'auto' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '4rem' }}>
            {MOCK_ANALYTICS.kpis.map((k, i) => (
              <div key={i} className="glass-morph" style={{ flex: '1 1 240px', padding: '1.75rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                   <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px' }}>{k.icon}</div>
                   <span style={{ fontSize: '0.75rem', fontWeight: 900, color: k.up ? '#34d399' : '#fb7185' }}>{k.trend}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k.label}</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.5rem', letterSpacing: '-0.04em' }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
             <div className="glass-morph" style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>Macro Footfall Wave (Full 12-Month Dataset)</h3>
                   <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.65rem', fontWeight: 900 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} /> HISTORICAL</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #34d399' }} /> AI FORECAST</span>
                   </div>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                  <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <path d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`} fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
                    <path d={`M ${points.map(p => `${p.x},${p.fy}`).join(' L ')}`} fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" />
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="0.8" fill="#38bdf8" />
                        <text x={p.x} y={p.y - 3} textAnchor="middle" fontSize="1.8" fontWeight="900" fill="#38bdf8">{Math.round(masterTrend[i].hist)}k</text>
                        <text x={(i/11)*100} y="45" textAnchor="middle" fontSize="1.6" fill="#475569" fontWeight="800">{masterTrend[i].month[0]}</text>
                      </g>
                    ))}
                  </svg>
                </div>
             </div>

             <div className="glass-morph" style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2.5rem' }}>Global AI SitRep Insights</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {MOCK_ANALYTICS.insights.map((ins, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', borderLeft: '5px solid #38bdf8' }}>
                      <div style={{ color: '#38bdf8' }}><Info size={28} /></div>
                      <p style={{ fontSize: '1rem', margin: 0, lineHeight: 1.6, color: '#e2e8f0' }}>{ins}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <section className="hotspot-grid-section" style={{ marginBottom: '6rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                   <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>29-Hotspot Capacity Node</h3>
                   <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Click a location to unlock custom deep-dive interaction charts</p>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', fontWeight: 900 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fb7185' }} /> CRITICAL</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} /> WARNING</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} /> OPTIMAL</div>
                </div>
             </div>

             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                {MOCK_ANALYTICS.hotspots.map(h => (
                  <div 
                    key={h.id} 
                    onClick={() => { setActiveHotspot(h); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ flex: '1 1 230px', padding: '1.75rem', borderRadius: '28px', background: activeHotspot?.id === h.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.02)', border: activeHotspot?.id === h.id ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: activeHotspot?.id === h.id ? 'scale(1.02)' : 'none' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: activeHotspot?.id === h.id ? '#38bdf8' : '#fff' }}>{h.name}</span>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: h.status === 'critical' ? '#fb7185' : (h.status === 'warning' ? '#fbbf24' : '#34d399'), boxShadow: `0 0 15px ${h.status === 'critical' ? '#fb7185' : '#34d399'}44` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                       <span style={{ color: '#475569', fontWeight: 800 }}>STRESS</span>
                       <span style={{ fontWeight: 900, color: h.status === 'critical' ? '#fb7185' : '#fff' }}>{h.load}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${h.load}%`, height: '100%', background: h.status === 'critical' ? '#fb7185' : (h.status === 'warning' ? '#fbbf24' : '#34d399'), transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                    </div>
                    <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', fontWeight: 900 }}>
                       <span>{h.visitors.toLocaleString()} PAX</span>
                       <span>{(h.capacity/1000).toFixed(1)}k MAX</span>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="displacement-section" style={{ marginBottom: '5rem' }}>
             <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>24-Hour Regional Displacement Matrix</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {MOCK_ANALYTICS.hourly.map((h, i) => (
                  <div key={i} style={{ flex: '1 1 54px', height: '110px', background: `rgba(56, 189, 248, ${h.val/100})`, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDir: 'column', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 900, color: (h.val > 60) ? '#fff' : '#0f172a' }}>{h.count}</span>
                     <div style={{ marginTop: '0.5rem', fontSize: '0.6rem', fontWeight: 900, color: (h.val > 60) ? 'rgba(255,255,255,0.6)' : '#475569' }}>{h.hour}</div>
                  </div>
                ))}
             </div>
          </section>

        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .glass-morph { backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); }
          .focus-panel { animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes slideDown { 0% { opacity: 0; transform: translateY(-30px); scale: 0.98; } 100% { opacity: 1; transform: translateY(0); scale: 1; } }
          .enterprise-theme { font-family: 'Inter', sans-serif; }
        `}} />
      </div>
    </AdminLayout>
  );
}
