import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert, User, Mail, Phone, LogOut, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }

        const user = session.user;
        // Try to get from officials table
        const { data } = await supabase
          .from('officials')
          .select('username, email, phone_number')
          .eq('id', user.id)
          .single();

        setProfile({
          username: data?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Officer',
          email: data?.email || user.email || '—',
          phone: data?.phone_number || user.user_metadata?.phone_number || '—',
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const initial = profile.username ? profile.username[0].toUpperCase() : 'O';

  return (
    <div className="enterprise-theme" style={{ minHeight: '100vh', padding: '2rem 2.5rem' }}>
      {/* Header */}
      <header className="ent-header" style={{ marginBottom: '2.5rem' }}>
        <div className="ent-title">
          <ShieldAlert size={32} color="var(--accent-brand)" />
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>Officer Settings</h1>
            <p>Manage your profile and preferences</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--ent-panel)', border: '1px solid var(--ent-border)', color: 'var(--text-muted)', padding: '0.7rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Avatar Card */}
        <div style={{ background: 'var(--ent-panel)', border: '1px solid var(--ent-border)', borderRadius: '16px', padding: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-brand), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'white', flexShrink: 0, boxShadow: '0 0 24px rgba(14,165,233,0.4)' }}>
            {loading ? '…' : initial}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'white' }}>{loading ? 'Loading...' : profile.username}</h2>
            <p style={{ margin: '0.3rem 0 0 0', color: 'var(--accent-brand)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Crowd Intelligence Officer</p>
          </div>
        </div>

        {/* Profile Details */}
        <div style={{ background: 'var(--ent-panel)', border: '1px solid var(--ent-border)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Profile Information</h3>

          {[
            { icon: <User size={18} />, label: 'Username', value: profile.username },
            { icon: <Mail size={18} />, label: 'Email Address', value: profile.email },
            { icon: <Phone size={18} />, label: 'Phone Number', value: profile.phone },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--ent-border)', marginBottom: '1rem', background: '#0F172A' }}>
              <div style={{ color: 'var(--accent-brand)' }}>{icon}</div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ color: 'white', fontSize: '1.05rem', fontWeight: 600 }}>{loading ? '—' : (value || '—')}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.3)', borderRadius: '16px', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', color: 'var(--accent-red)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Session</h3>
          <button
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', background: 'var(--accent-red)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.5px' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
