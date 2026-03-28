import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  TrendingUp, TrendingDown, Users, AlertCircle, 
  MapPin, CheckCircle2, Calendar, Target,
  MousePointer2, Info, BarChart3
} from 'lucide-react';

const MOCK_ANALYTICS = {
  kpis: [
    { label: "Total Footfall (YTD)", value: "1.2M", trend: "+8%", up: true, icon: <Users size={24} color="#0EA5E9" /> },
    { label: "Most Stressed Hotspot", value: "Baga Beach", trend: "92% Cap", up: false, icon: <AlertCircle size={24} color="#E11D48" /> },
    { label: "Highest Growth Gem", value: "Divar Island", trend: "+45% MoM", up: true, icon: <TrendingUp size={24} color="#10B981" /> },
    { label: "AI Model Accuracy", value: "96.4%", trend: "±42 MAE", up: true, icon: <Target size={24} color="#F59E0B" /> },
  ],
  trend: [
    { month: 'Jan', hist: 120, forecast: null },
    { month: 'Feb', hist: 110, forecast: null },
    { month: 'Mar', hist: 95, forecast: null },
    { month: 'Apr', hist: 80, forecast: null },
    { month: 'May', hist: 85, forecast: null },
    { month: 'Jun', hist: 60, forecast: null },
    { month: 'Jul', hist: 55, forecast: null },
    { month: 'Aug', hist: 65, forecast: null },
    { month: 'Sep', hist: 75, forecast: null },
    { month: 'Oct', hist: 90, forecast: null },
    { month: 'Nov', hist: null, forecast: 115 },
    { month: 'Dec', hist: null, forecast: 160 },
  ],
  distribution: [
    { name: 'Calangute', val: 98, type: 'stress' },
    { name: 'Baga', val: 92, type: 'stress' },
    { name: 'Anjuna', val: 85, type: 'stress' },
    { name: 'Dudhsagar', val: 78, type: 'stress' },
    { name: 'Basilica', val: 72, type: 'stress' },
    { name: 'Butterfly', val: 12, type: 'gem' },
    { name: 'Divar Is.', val: 15, type: 'gem' },
    { name: 'Chorla', val: 18, type: 'gem' },
    { name: 'Cola', val: 22, type: 'gem' },
    { name: 'Fontainhas', val: 28, type: 'gem' },
  ],
  factors: [
    { label: 'Weekends', val: 40 },
    { label: 'Holidays', val: 35 },
    { label: 'Weather', val: 25 },
  ]
};

export default function GlobalAnalytics() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Chart Logic: Normalize 12 month trend for SVG (0-100 range)
  const maxVal = 180;
  const points = MOCK_ANALYTICS.trend.map((d, i) => ({
    x: (i / 11) * 100,
    y: 100 - ((d.hist || d.forecast) / maxVal) * 100,
    isForecast: d.forecast !== null
  }));

  const histPath = points.filter(p => !p.isForecast || (p.isForecast && p.x === points[9].x)).map(p => `${p.x},${p.y}`).join(' L ');
  const forecastPath = points.filter((p, i) => i >= 9).map(p => `${p.x},${p.y}`).join(' L ');

  return (
    <AdminLayout>
      <div className="enterprise-theme">
        <header className="ent-header">
          <div className="ent-title">
            <BarChart3 size={36} color="var(--accent-brand)" />
            <div>
              <h1>Global Analytics Node</h1>
              <p>Macro-Trend Intelligence & Predictive Modeling</p>
            </div>
          </div>
          <div className="ent-controls">
             <div className="capacity-badge" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' }}>
                <span className="label" style={{ color: '#10B981' }}>SYSTEM HEALTH:</span>
                <span className="value">OPTIMAL</span>
             </div>
          </div>
        </header>

        <main className="ent-main">
          {/* Top KPI Cards */}
          <section className="analytics-grid">
            {MOCK_ANALYTICS.kpis.map((kpi, i) => (
              <div key={i} className="analytics-card">
                <div className="card-icon-bg">{kpi.icon}</div>
                <span className="label">{kpi.label}</span>
                <div className="value">{kpi.value}</div>
                <div className={`trend ${kpi.up ? 'up' : 'down'}`}>
                  {kpi.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {kpi.trend}
                </div>
              </div>
            ))}
          </section>

          {/* Main Forecasting Wave */}
          <section className="analytics-main-chart">
            <div className="chart-header-bi" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                  <h2>12-Month Macro Footfall Trend</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>Historical Load (Jan-Oct) vs Prophet Forecast (Nov-Dec)</p>
               </div>
               <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 20, height: 3, background: '#0EA5E9' }}></div> Historical
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 20, height: 3, borderTop: '3px dotted #10B981' }}></div> AI Forecast
                  </div>
               </div>
            </div>

            <div className="chart-svg-container">
               {/* Peak Season Highlight */}
               <div style={{ 
                 position: 'absolute', 
                 right: 0, 
                 width: '18%', 
                 height: '100%', 
                 background: 'rgba(225,29,72,0.05)', 
                 borderLeft: '1px dashed rgba(225,29,72,0.2)',
                 display: 'flex',
                 alignItems: 'flex-end',
                 justifyContent: 'center',
                 paddingBottom: '1rem'
               }}>
                 <span style={{ color: 'var(--accent-red)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Peak Season Window</span>
               </div>

               <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                 {/* Grid Lines */}
                 {[0, 25, 50, 75, 100].map(v => (
                   <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                 ))}
                 
                 {/* Main Path: Historical */}
                 <path d={`M ${histPath}`} fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Main Path: Forecast */}
                 <path d={`M ${forecastPath}`} fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="3,2" strokeLinecap="round" />

                 {/* Data Points */}
                 {points.map((p, i) => (
                   <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                     <circle 
                        cx={p.x} cy={p.y} r={hoveredIdx === i ? 2.5 : 1} 
                        fill={p.isForecast ? "#10B981" : "#0EA5E9"} 
                        style={{ cursor: 'pointer', transition: 'r 0.2s' }} 
                     />
                     {hoveredIdx === i && (
                        <foreignObject x={p.x < 80 ? p.x + 2 : p.x - 22} y={p.y - 12} width="20" height="10" style={{ overflow: 'visible' }}>
                           <div className="chart-tooltip-bi">
                              {MOCK_ANALYTICS.trend[i].month}: {MOCK_ANALYTICS.trend[i].hist || MOCK_ANALYTICS.trend[i].forecast}k
                           </div>
                        </foreignObject>
                     )}
                   </g>
                 ))}
               </svg>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', padding: '0 0.5rem' }}>
               {MOCK_ANALYTICS.trend.map((d, i) => (
                 <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.month}</span>
               ))}
            </div>
          </section>

          {/* Bottom Split Grid */}
          <section className="analytics-bottom-grid">
            {/* Load Distribution Bar Chart */}
            <div className="mini-chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Load Distribution - Top 5 vs Bottom 5</h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-brand)' }}>% CAPACITY LOAD</span>
              </div>
              <div className="bar-chart-v-wrapper">
                {MOCK_ANALYTICS.distribution.map((item, i) => (
                  <div key={i} className="bar-row-bi">
                    <span className="bar-label-bi">{item.name}</span>
                    <div className="bar-trail-bi">
                       <div 
                         className="bar-fill-bi" 
                         style={{ 
                           width: `${item.val}%`, 
                           backgroundColor: item.type === 'stress' ? 'var(--accent-red)' : 'var(--accent-brand)',
                           opacity: 0.7 + (item.val/100)*0.3
                         }} 
                       />
                    </div>
                    <span className="bar-value-bi">{item.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Factors Radar */}
            <div className="mini-chart-card">
              <h3>Contextual Factors Engine (XGBoost Inputs)</h3>
              <div className="radar-svg-wrapper">
                 <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
                   {/* Background circles */}
                   {[20, 40, 60, 80, 100].map(r => (
                     <circle key={r} cx="0" cy="0" r={r/2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                   ))}
                   
                   {/* Factor Data Polygon */}
                   <polygon 
                     points={MOCK_ANALYTICS.factors.map((f, i) => {
                       const deg = i * (360 / MOCK_ANALYTICS.factors.length) - 90;
                       const r = f.val;
                       return `${r/2 * Math.cos(deg * Math.PI / 180)},${r/2 * Math.sin(deg * Math.PI / 180)}`;
                     }).join(' ')} 
                     fill="rgba(14,165,233,0.2)" 
                     stroke="var(--accent-brand)" 
                     strokeWidth="2" 
                   />
                   
                   {/* Labels */}
                   {MOCK_ANALYTICS.factors.map((f, i) => {
                     const deg = i * (360 / MOCK_ANALYTICS.factors.length) - 90;
                     const r = 55;
                     return (
                        <text 
                          key={i} 
                          x={r/2 * Math.cos(deg * Math.PI / 180)} 
                          y={r/2 * Math.sin(deg * Math.PI / 180)} 
                          fill="var(--text-muted)" 
                          fontSize="6" 
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {f.label}
                        </text>
                     );
                   })}
                 </svg>
              </div>
              <div className="radar-labels">
                 {MOCK_ANALYTICS.factors.map((f, i) => (
                   <div key={i} className="radar-tag">
                      <div className="dot" style={{ backgroundColor: i === 0 ? '#0EA5E9' : i === 1 ? '#E11D48' : '#10B981' }} />
                      {f.label}: {f.val}%
                   </div>
                 ))}
              </div>
              <div style={{ marginTop: '1.5rem', background: 'rgba(15,23,42,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--ent-border)' }}>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                   <Info size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                   The XGBoost model weight is currently biased towards <strong>Weekend Volume</strong>. This correlates with the 45% MoM growth seen at Hidden Gems like Divar Island.
                 </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </AdminLayout>
  );
}
