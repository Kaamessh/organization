import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  TrendingUp, TrendingDown, Users, AlertCircle, 
  MapPin, CheckCircle2, Calendar, Target,
  MousePointer2, Info, BarChart3, ChevronDown, CloudRain
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
  trend: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    hist: i < 10 ? Math.round(80 + Math.random() * 40) : null,
    forecast: i >= 9 ? Math.round(100 + Math.random() * 60) : null
  })),
  hotspots: LOCATIONS.map((name, i) => {
    const capacity = 2000 + Math.floor(Math.random() * 8000);
    const load = Math.floor(20 + Math.random() * 75);
    return {
      name,
      load,
      visitors: Math.floor((load / 100) * capacity),
      capacity,
      id: i + 1,
      status: load > 85 ? 'critical' : (load > 60 ? 'warning' : 'optimal')
    };
  }),
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    val: 20 + Math.random() * 60 + (i > 10 && i < 20 ? 20 : 0),
    count: 500 + Math.floor(Math.random() * 2000)
  })),
  insights: [
    `AI Predict: Calangute Beach peak load @ ${new Date(Date.now() + 7200000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (94% prob).`,
    "Regional Shift: Precipitation in North Goa driving 22% surge in Old Goa heritage visits.",
    "Baga-Anjuna Corridor: Congestion detected. Nudge deployment recommended for alternative routes.",
    "Dudhsagar Entry: 98% capacity reached. Slotting system active. System latency: 24ms."
  ]
};

export default function GlobalAnalytics() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedView, setSelectedView] = useState('All Insights'); 
  const [showDropdown, setShowDropdown] = useState(false);

  const VIEWS = {
    "Core": ["Actual vs Predicted", "Forecast Distribution", "Capacity Utilization %"],
    "Behavior": ["Crowd Heatmap", "Peak Hours"],
    "Action": ["Alerts Timeline", "Short-Term Trend (24h)"]
  };

  const maxVal = 200;
  const points = MOCK_ANALYTICS.trend.map((d, i) => ({
    x: (i / 11) * 100,
    y: 35 - (((d.hist || d.forecast) / maxVal) * 30), // Map to viewBox height 40, keeping safe margins
    isForecast: d.forecast !== null
  }));

  return (
    <AdminLayout>
      <div className="enterprise-theme dashboard-analytics" style={{ padding: '1rem', minHeight: '100vh', background: 'var(--ent-bg)', color: '#f8fafc', overflowX: 'hidden' }}>
        <header className="dashboard-header-flex" style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', paddingBottom: '1.5rem' }}>
          <div className="header-main-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="header-left">
              <h1 className="dashboard-main-title" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em', margin: 0 }}>Global Analytics Node <span style={{ fontSize: '0.8rem', background: '#38bdf8', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '10px' }}>LIVE v2</span></h1>
              <p className="dashboard-main-subtitle" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0.25rem 0 0' }}>MACRO-TREND INTELLIGENCE & PREDICTIVE MODELING</p>
            </div>
            
            <div className="insight-selector-wrapper" style={{ position: 'relative', zIndex: 1100 }}>
              <button 
                className="view-selector-btn glass-morph primary-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem', border: '2px solid #38bdf8', borderRadius: '12px', cursor: 'pointer', background: 'rgba(56, 189, 248, 0.2)', color: '#fff', fontWeight: 900, boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}
              >
                <Users size={18} color="#fff" />
                <span style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>{selectedView === 'All Insights' ? 'All Insights' : `${Object.keys(VIEWS).find(key => VIEWS[key].includes(selectedView))} / ${selectedView}`}</span>
                <ChevronDown size={14} style={{ marginLeft: '0.5rem', opacity: 0.9 }} />
              </button>

              {showDropdown && (
                <div className="view-dropdown glass-morph" style={{ position: 'absolute', top: '100%', right: 0, width: '260px', zIndex: 1200, marginTop: '8px', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(20px)', border: '1px solid var(--ent-border)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.8)' }}>
                  <div 
                    className={`view-option ${selectedView === 'All Insights' ? 'active' : ''}`}
                    onClick={() => { setSelectedView('All Insights'); setShowDropdown(false); }}
                    style={{ padding: '0.85rem', fontSize: '0.9rem', color: selectedView === 'All Insights' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', borderRadius: '8px', background: selectedView === 'All Insights' ? 'rgba(56,189,248,0.15)' : 'transparent', fontWeight: selectedView === 'All Insights' ? 800 : 500 }}
                  >
                    All Insights
                  </div>
                  {Object.entries(VIEWS).map(([category, options]) => (
                    <div key={category} style={{ marginTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#475569', padding: '0.5rem 0.85rem 0.25rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{category}</div>
                      {options.map(opt => (
                        <div 
                          key={opt} 
                          className={`view-option ${selectedView === opt ? 'active' : ''}`} 
                          onClick={() => { setSelectedView(opt); setShowDropdown(false); }}
                          style={{ padding: '0.85rem', fontSize: '0.85rem', color: selectedView === opt ? '#38bdf8' : '#94a3b8', cursor: 'pointer', borderRadius: '8px', background: selectedView === opt ? 'rgba(56,189,248,0.1)' : 'transparent', fontWeight: selectedView === opt ? 800 : 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          {opt} {selectedView === opt && <div style={{ width: '6px', height: '6px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 10px #38bdf8' }} />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {(selectedView === 'All Insights' || selectedView === 'Alerts Timeline') && (
            <div className="insight-ticker-container glass-morph" style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ent-border)', display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
              <div className="ticker-label" style={{ background: '#f43f5e', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '0.25rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>LIVE AI INSIGHTS</div>
              <div className="ticker-track" style={{ display: 'flex', gap: '2rem', animation: 'ticker 30s linear infinite' }}>
                {MOCK_ANALYTICS.insights.map((ins, i) => (
                  <div key={i} className="ticker-item" style={{ fontSize: '0.85rem', color: '#cbd5e1', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '6px', height: '6px', background: '#38bdf8', borderRadius: '50%' }} /> {ins}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedView === 'All Insights' || selectedView === 'Actual vs Predicted' || selectedView === 'Short-Term Trend (24h)') && (
            <div className="dashboard-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {MOCK_ANALYTICS.kpis.map((kpi, i) => (
                <div key={i} className="kpi-card glass-morph" style={{ padding: '1.5rem', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
                  <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="kpi-icon-box" style={{ padding: '0.75rem', background: 'rgba(56,189,248,0.1)', borderRadius: '12px' }}>{kpi.icon}</div>
                    <div className={`kpi-trend ${kpi.up ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', fontWeight: 800, color: kpi.up ? '#34d399' : '#f43f5e' }}>{kpi.trend}</div>
                  </div>
                  <div className="kpi-body">
                    <div className="kpi-val" style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{kpi.value}</div>
                    <div className="kpi-label" style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.25rem' }}>{kpi.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(selectedView === 'All Insights' || selectedView === 'Actual vs Predicted') && (
            <div className="dashboard-mid-split">
              <div className="trend-main-card glass-morph" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
                <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Macro Footfall Wave (12 Months)</h2>
                <div className="chart-legend" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="legend-item" style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%' }} /> Historical</div>
                  <div className="legend-item" style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%' }} /> Forecast</div>
                </div>
                <div className="chart-svg-container-high" style={{ height: '240px', width: '100%' }}>
                  <svg viewBox="0 0 100 40" className="trend-svg" style={{ overflow: 'visible', width: '100%', height: '100%' }}>
                    <path d={`M 0 ${points[0].y} ${points.filter(p => !p.isForecast || p.x === points[9].x).map(p => `L ${p.x} ${p.y}`).join(' ')}`} fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d={`M ${points[9].x} ${points[9].y} ${points.filter(p => p.isForecast).map(p => `L ${p.x} ${p.y}`).join(' ')}`} fill="none" stroke="#34d399" strokeWidth="1.2" strokeDasharray="2 1" />
                    {points.map((p, i) => (
                      <circle 
                        key={i} cx={p.x} cy={p.y} r="0.6" 
                        fill={p.isForecast ? "#34d399" : "#38bdf8"} 
                        onMouseEnter={() => setHoveredIdx(i)} 
                        onMouseLeave={() => setHoveredIdx(null)} 
                        style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                      />
                    ))}
                    {(selectedView === 'Actual vs Predicted' || hoveredIdx !== null) && points.map((p, i) => (
                      <text 
                        key={i} x={p.x} y={p.y - 3} 
                        fill={p.isForecast ? "#34d399" : "#38bdf8"} 
                        fontSize="1.5" fontWeight="900" textAnchor="middle" 
                        style={{ opacity: (hoveredIdx === i || selectedView === 'Actual vs Predicted') ? 1 : 0, transition: 'opacity 0.2s' }}
                      >
                        {MOCK_ANALYTICS.trend[i].hist || MOCK_ANALYTICS.trend[i].forecast}k
                      </text>
                    ))}
                    <g style={{ fontSize: '1.2px', fill: '#64748b' }}>
                      {MOCK_ANALYTICS.trend.map((d, i) => (
                        <text key={i} x={(i/11)*100} y="38" textAnchor="middle">{d.month}</text>
                      ))}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {(selectedView === 'All Insights' || selectedView === 'Forecast Distribution') && (
            <div className="distribution-section glass-morph" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
              <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Forecast Distribution</h2>
              <div style={{ display: 'flex', gap: '1.5rem', height: '120px', alignItems: 'flex-end' }}>
                {['Beaches', 'Heritage', 'Wildlife', 'Urban', 'Rural'].map((cat, i) => (
                  <div key={cat} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ height: `${40 + i * 12}%`, background: 'rgba(56,189,248,0.4)', borderRadius: '6px', width: '100%', position: 'relative' }}>
                       <span style={{ position: 'absolute', top: '-18px', width: '100%', textAlign: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#38bdf8' }}>{40 + i*12}%</span>
                    </div>
                    <span style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedView === 'All Insights' || selectedView === 'Capacity Utilization %') && (
            <div className="hotspot-monitor-section glass-morph" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
              <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>29-Hotspot Capacity Monitor</h2>
              <div className="hotspot-scroll-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {MOCK_ANALYTICS.hotspots.map(h => (
                  <div key={h.id} className={`hotspot-mini-card ${h.status}`} style={{ flex: '1 1 180px', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ent-border)' }}>
                    <div className="h-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="h-name" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>{h.name}</span>
                      <span className="h-val" style={{ fontSize: '0.8rem', fontWeight: 900, color: h.status === 'critical' ? '#f43f5e' : (h.status === 'warning' ? '#fbbf24' : '#34d399') }}>{h.load}%</span>
                    </div>
                    <div className="h-bar-bg" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                      <div className="h-bar-fill" style={{ width: `${h.load}%`, height: '100%', background: h.status === 'critical' ? '#f43f5e' : (h.status === 'warning' ? '#fbbf24' : '#34d399'), borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedView === 'All Insights' || selectedView === 'Crowd Heatmap' || selectedView === 'Peak Hours') && (
            <div className="dashboard-bottom-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="hourly-heatmap-card glass-morph" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
                <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>24-Hour Congestion</h2>
                <div className="hourly-bars" style={{ display: 'flex', gap: '4px', height: '140px', alignItems: 'flex-end' }}>
                  {MOCK_ANALYTICS.hourly.map((h, i) => {
                    const isPeak = h.val > 65;
                    if (selectedView === 'Peak Hours' && !isPeak) return null;
                    return (
                      <div key={i} className="h-bar-v-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '100%', height: `${h.val}%`, background: isPeak ? '#38bdf8' : 'rgba(56,189,248,0.3)', borderRadius: '2px', transition: 'height 0.3s' }} className="h-bar-v-fill" />
                        <div className="h-bar-time" style={{ fontSize: '0.5rem', color: '#64748b', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{h.hour}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(selectedView === 'All Insights' || selectedView === 'Crowd Heatmap') && (
                <div className="weather-intelligence-card glass-morph" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
                  <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Environmental Context</h2>
                  <div className="weather-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="weather-stat large" style={{ gridColumn: 'span 2', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', textAlign: 'center' }}>
                      <div className="w-val" style={{ fontSize: '2.5rem', fontWeight: 900 }}>29°C</div>
                      <div className="w-label" style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>TEMPERATURE</div>
                    </div>
                    <div className="weather-stat" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', textAlign: 'center' }}>
                      <div className="w-val" style={{ fontSize: '1.2rem', fontWeight: 900 }}>65%</div>
                      <div className="w-label" style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>HUMIDITY</div>
                    </div>
                    <div className="weather-stat" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', textAlign: 'center' }}>
                      <div className="w-val" style={{ fontSize: '1.2rem', fontWeight: 900 }}>1.2m</div>
                      <div className="w-label" style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>WAVE HEIGHT</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedView === 'Alerts Timeline' && (
            <div className="alerts-full-page glass-morph" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ent-border)' }}>
              <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Critical Alerts Timeline</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_ANALYTICS.insights.map((ins, i) => (
                  <div key={i} className="insight-item glass-morph" style={{ padding: '1.25rem', background: 'rgba(244, 63, 94, 0.05)', borderLeft: '4px solid #f43f5e', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.5 }}>{ins}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, marginTop: '0.75rem', letterSpacing: '0.05em' }}>TIMESTAMP: T+{(i+1)*4}M · PRIORITY: CRITICAL · NODE: CC-04</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .glass-morph { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>
    </AdminLayout>
  );
}
