import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  ShieldAlert, Activity, Radio, Database,
  User, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: <Activity size={20} />, label: 'AI Command Center', exact: true },
  { to: '/intel', icon: <Radio size={20} />, label: 'Live Ground Intel' },
  { to: '/locations', icon: <Database size={20} />, label: 'Location Database' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('Officer');
  const [activeSOS, setActiveSOS] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const meta = session.user.user_metadata;
        setUsername(meta?.username || session.user.email?.split('@')[0] || 'Officer');
      }
    });

    // 1. Fetch any current active SOS
    const fetchActiveSOS = async () => {
      console.log("🕵️ HQ: Fetching initial SOS alerts...");
      const { data, error } = await supabase.from('sos_alerts').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(1);
      if (error) console.error("❌ HQ SOS Fetch Error:", error);
      if (data && data.length > 0) {
        console.log("🚨 HQ: Found active SOS on mount:", data[0]);
        setActiveSOS(data[0]);
      }
    };
    fetchActiveSOS();

    console.log("📡 HQ: Opening Realtime Channel for SOS...");
    const channel = supabase
      .channel('sos-global')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, payload => {
        console.log("🆘 NEW SOS INSERT DETECTED:", payload);
        if (payload.new.status === 'active') {
          setActiveSOS(payload.new);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_alerts' }, payload => {
        console.log("🔄 SOS UPDATE DETECTED:", payload);
        if (payload.new.status === 'resolved' && (activeSOS?.id === payload.new.id || !activeSOS)) {
          setActiveSOS(null);
        }
      })
      .subscribe((status) => {
        console.log("🔌 HQ SOS Subscription Status:", status);
      });

    return () => { supabase.removeChannel(channel); };
  }, []); // Only run on mount to keep connection stable

  const handleResolveSOS = async () => {
    if (!activeSOS) return;
    try {
      await supabase.from('sos_alerts').update({ status: 'resolved' }).eq('id', activeSOS.id);
      setActiveSOS(null);
    } catch (err) { console.error("Resolve Error:", err); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {/* GLOBAL SOS ALARM BANNER - MOVED OUTSIDE FOR SAFETY */}
      {activeSOS && (
        <div className="sos-alarm-banner">
          <div className="sos-msg">
            <ShieldAlert size={32} />
            🚨 CRITICAL INCIDENT: SOS BEACON ACTIVATED AT 
            <span className="sos-location-name">{activeSOS.location_name || 'UNKNOWN LOCATION'}</span>
          </div>
          <button className="btn-dispatch" onClick={handleResolveSOS}>
            Dispatch Police & Acknowledge
          </button>
        </div>
      )}

      <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-brand" onClick={() => setCollapsed(p => !p)}>
          <ShieldAlert size={24} color="var(--accent-brand)" />
          {!collapsed && <span>AURA<strong> HQ</strong></span>}
          {collapsed ? <ChevronRight size={16} color="var(--text-muted)" /> : <Menu size={16} color="var(--text-muted)" />}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{icon}</span>
              {!collapsed && <span className="sidebar-label">{label}</span>}
            </NavLink>
          ))}
          
        </nav>

        {/* Officer Profile at bottom */}
        <div className="sidebar-footer">
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <div className="sidebar-avatar">{username[0]?.toUpperCase()}</div>
            {!collapsed && (
              <div className="sidebar-user">
                <span className="sidebar-username">{username}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Intelligence Officer</span>
              </div>
            )}
          </NavLink>
          <button onClick={handleSignOut} className="sidebar-logout" title="Sign Out">
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {children}
      </main>
    </div>
    </>
  );
}
