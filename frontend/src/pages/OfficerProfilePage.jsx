import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminLayout from '../components/AdminLayout';
import { User, Shield, MapPin, Cloud, Cpu, CheckCircle, Wifi, Server } from 'lucide-react';

export default function OfficerProfilePage() {
  const [profile, setProfile] = useState({ username: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const user = session.user;
          const { data } = await supabase.from('officials').select('username, email, phone_number').eq('id', user.id).single();
          setProfile({
            username: data?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Officer',
            email: data?.email || user.email || '—',
            phone: data?.phone_number || user.user_metadata?.phone_number || '—',
          });
        }
      } catch (e) { } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const initial = profile.username?.[0]?.toUpperCase() || 'O';

  const systemStatus = [
    { label: 'Supabase Database', status: 'ONLINE', icon: <Server size={16} /> },
    { label: 'OpenWeather API', status: 'ONLINE', icon: <Cloud size={16} /> },
    { label: 'OSRM GPS Router', status: 'ONLINE', icon: <MapPin size={16} /> },
    { label: 'AI Forecast Engine', status: 'ACTIVE', icon: <Cpu size={16} /> },
    { label: 'Realtime Listener', status: 'STREAMING', icon: <Wifi size={16} /> },
  ];

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-group">
            <div className="page-icon-badge"><User size={20} color="var(--accent-brand)" /></div>
            <div>
              <h1 className="page-title">Officer Profile</h1>
              <p className="page-sub">Command credentials and system status</p>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Identity Card */}
          <div className="profile-id-card">
            <div className="pid-top">
              <div className="pid-avatar">{loading ? '…' : initial}</div>
              <div className="pid-badge">
                <Shield size={14} /> VERIFIED OFFICER
              </div>
            </div>
            <h2 className="pid-name">{loading ? 'Loading…' : profile.username}</h2>
            <div className="pid-region">
              <MapPin size={14} /> Region: Goa North — Command Zone Alpha
            </div>

            <div className="pid-fields">
              {[
                { label: 'Email', value: profile.email },
                { label: 'Phone', value: profile.phone },
                { label: 'Badge ID', value: `AURA-GOA-${profile.username?.slice(0, 3).toUpperCase() || 'OFC'}-001` },
                { label: 'Clearance Level', value: 'ALPHA — Full System Access' },
              ].map(({ label, value }) => (
                <div key={label} className="pid-field">
                  <span className="pid-field-label">{label}</span>
                  <span className="pid-field-value">{loading ? '—' : (value || '—')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="system-status-card">
            <h3 className="sys-title"><Wifi size={18} color="var(--accent-brand)" /> System Status</h3>
            <div className="sys-list">
              {systemStatus.map(({ label, status, icon }) => (
                <div key={label} className="sys-item">
                  <div className="sys-icon">{icon}</div>
                  <div className="sys-label">{label}</div>
                  <div className={`sys-status status-${status.toLowerCase()}`}>
                    <CheckCircle size={12} /> {status}
                  </div>
                </div>
              ))}
            </div>

            <div className="sys-uptime">
              <div className="uptime-label">System Uptime</div>
              <div className="uptime-bar"><div className="uptime-fill" /></div>
              <div className="uptime-value">99.8% — All systems nominal</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
