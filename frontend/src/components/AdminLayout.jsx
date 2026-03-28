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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const meta = session.user.user_metadata;
        setUsername(meta?.username || session.user.email?.split('@')[0] || 'Officer');
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
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
  );
}
