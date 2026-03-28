import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  TrendingUp, TrendingDown, Users, AlertCircle, 
  MapPin, CheckCircle2, Calendar, Target,
  MousePointer2, Info, BarChart3
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
    hist: i < 10 ? 80 + Math.random() * 40 : null,
    forecast: i >= 9 ? 100 + Math.random() * 60 : null
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
    `AI Predict: Calangute Beach peak load @ ${new Date(Date.now() + 7200000).toLocaleTimeString([], {hour: '2.digit', minute:'2.digit'})} (94% prob).`,
    "Regional Shift: Precipitation in North Goa driving 22% surge in Old Goa heritage visits.",
    "Baga-Anjuna Corridor: Congestion detected. Nudge deployment recommended for alternative routes.",
    "Dudhsagar Entry: 98% capacity reached. Slotting system active. System latency: 24ms."
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
             <div className="capacity-badge" style={{ borderColor: 'rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.1)' }}>
                <span className="label" style={{ color: '#38bdf8' }}>LATENCY:</span>
                <span className="value">24ms</span>
             </div>
             <div className="capacity-badge" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' }}>
                <span className="label" style={{ color: '#10B981' }}>SYSTEM HEALTH:</span>
                <span className="value">OPTIMAL</span>
             </div>
          </div>
        </header>

        <main className="ent-main">
          {/* AI INSIGHT TICKER */}
          <section className="insight-ticker-container">
            <div className="ticker-label">LIVE AI INSIGHTS</div>
            <div className="ticker-track">
              {MOCK_ANALYTICS.insights.concat(MOCK_ANALYTICS.insights).map((insight, i) => (
                <span key={i} className="ticker-item"><AlertCircle size={14} /> {insight}</span>
              ))}
            </div>
          </section>

          {/* Top KPI Cards */}
          <section className="analytics-grid">
            {MOCK_ANALYTICS.kpis.map((kpi, i) => (
              <div key={i} className="analytics-card glass-morph">
                <div className="card-icon-bg">{kpi.icon}</div>
                <span className="label text-glow">{kpi.label}</span>
                <div className="value">{kpi.value}</div>
                <div className={`trend ${kpi.up ? 'up' : 'down'}`}>
                  {kpi.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {kpi.trend}
                </div>
              </div>
            ))}
          </section>

          <div className="dashboard-mid-split">
            {/* Main Forecasting Wave */}
            <section className="analytics-main-chart glass-morph">
              <div className="chart-header-bi">
                <div>
                  <h2 className="section-title">Macro Footfall Wave (12 Months)</h2>
                  <p className="section-subtitle">Real-time load projection using advanced Prophet modeling</p>
                </div>
                <div className="chart-legend">
                  <div className="legend-item"><span className="dot hist" /> Historical</div>
                  <div className="legend-item"><span className="dot fore" /> Forecast</div>
                </div>
              </div>

              <div className="chart-svg-container-high">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d={`M ${points.filter(p => !p.isForecast || p.x === points[9].x).map(p => `${p.x},${p.y * 0.4}`).join(' L ')}`} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d={`M ${points.filter((p, i) => i >= 9).map(p => `${p.x},${p.y * 0.4}`).join(' L ')}`} fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="2,1" />

                  {/* DATA LABELS */}
                  {points.map((p, i) => (
                    i % 2 === 0 && (
                      <text 
                        key={`val-${i}`} 
                        x={p.x} y={p.y * 0.4 - 2} 
                        fill={p.isForecast ? "#34d399" : "#38bdf8"} 
                        fontSize="1.5" 
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {MOCK_ANALYTICS.trend[i].hist || MOCK_ANALYTICS.trend[i].forecast}k
                      </text>
                    )
                  ))}
                </svg>
              </div>

              <div className="chart-labels-row">
                {MOCK_ANALYTICS.trend.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </section>

            {/* Weather Impact Intelligence */}
            <section className="weather-intelligence-card glass-morph">
              <h3 className="section-title">Environmental Context</h3>
              <div className="weather-grid">
                <div className="weather-stat large">
                  <div className="w-val">31°C</div>
                  <div className="w-label">CURRENT TEMP</div>
                </div>
                <div className="weather-stat">
                  <div className="w-val">65%</div>
                  <div className="w-label">HUMIDITY</div>
                </div>
                <div className="weather-stat">
                  <div className="w-val">0.0<small>mm</small></div>
                  <div className="w-label">PRECIPITATION</div>
                </div>
              </div>
              <div className="weather-analysis">
                <Info size={16} />
                <span>Weather conditions are currently <strong>Optimal</strong> for beach tourism. Expected 12% rise in Dudhsagar Falls interest if precipitation increases.</span>
              </div>
            </section>
          </div>

          <div className="dashboard-bottom-split">
            {/* Real-time 29 Hotspot Grid */}
            <section className="hotspot-monitor-section glass-morph">
              <div className="monitor-header">
                <h3 className="section-title">29-Hotspot Capacity Monitor</h3>
                <div className="monitor-stats">
                  <span>OVERALL LOAD: <strong style={{ color: '#fbbf24' }}>74%</strong></span>
                </div>
              </div>
              <div className="hotspot-scroll-grid">
                {MOCK_ANALYTICS.hotspots.map((h, i) => (
                  <div key={i} className={`hotspot-mini-card ${h.status}`}>
                    <div className="h-info">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="h-name">{h.name}</span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{h.visitors.toLocaleString()} / {h.capacity.toLocaleString()} PAX</span>
                      </div>
                      <span className="h-val">{h.load}%</span>
                    </div>
                    <div className="h-bar-bg">
                      <div className="h-bar-fill" style={{ width: `${h.load}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Hourly Congestion Heatmap */}
            <section className="hourly-heatmap-card glass-morph">
              <h3 className="section-title">24-Hour State-wide Congestion</h3>
              <div className="hourly-bars">
                {MOCK_ANALYTICS.hourly.map((h, i) => (
                  <div key={i} className="h-bar-v-container">
                    <span style={{ fontSize: '0.5rem', color: '#38bdf8', marginBottom: '2px', fontWeight: 'bold' }}>{h.count}</span>
                    <div className="h-bar-v-fill" style={{ height: `${h.val}%`, opacity: h.val > 70 ? 1 : 0.6 }} />
                    <span className="h-bar-time">{h.hour}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
