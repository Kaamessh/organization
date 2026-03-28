import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let loginEmail = username; // Assume they typed an email initially
      
      // If it doesn't look like an email, assume it is a username and securely fetch the real email
      if (!username.includes('@')) {
        const { data: profile, error: fetchError } = await supabase
          .from('officials')
          .select('email')
          .eq('username', username)
          .single();
          
        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
             throw new Error(`Username '${username}' does not exist in the 'officials' table! If you registered this account BEFORE executing the auth SQL script, the mapping trigger failed. Register a brand new user!`); 
          }
          throw new Error(`Supabase Error: ${fetchError.message}`);
        }
        if (!profile) {
          throw new Error("Profile not retrieved from database.");
        }
        loginEmail = profile.email;
      }

      // Sign in seamlessly using the resolved email
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (authError) throw authError;

      navigate('/');
    } catch (err) {
      setErrorMsg(err.message === "Failed to fetch" ? "Database offline. Run the .sql setup script!" : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Check if username is already taken to prevent database constraint errors
      const { data: existingUser } = await supabase
        .from('officials')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
         throw new Error("Username is already taken by another official.");
      }

      // 2. Sign up natively with Supabase, injecting the custom parameters into User Meta Data
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            phone_number: phone
          }
        }
      });

      if (error) throw error;
      
      setSuccessMsg("Registration successful! You can now securely log in.");
      setIsLogin(true); // Switch back to the login view automatically
      setUsername('');
      setPassword('');
      
    } catch (err) {
       setErrorMsg(err.message === "Failed to fetch" ? "Database offline. Are your Supabase Keys in .env?" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enterprise-theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="dashboard-card" style={{ maxWidth: '450px', width: '100%', padding: '3rem 2.5rem', background: 'var(--ent-panel)', border: '1px solid var(--ent-border)', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <ShieldAlert size={56} color="var(--accent-brand)" style={{margin: '0 auto'}} />
          <h2 style={{ marginTop: '1.5rem', fontSize: '1.8rem', color: 'white' }}>AURA Network</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.5rem 0 0 0' }}>{isLogin ? 'Officer Identity Verification' : 'New Officer Registration Node'}</p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMsg && (
            <div style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-red)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(225, 29, 72, 0.3)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
              ✅ {successMsg}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>
              {isLogin ? 'USERNAME OR EMAIL' : 'CREATE USERNAME'}
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ent-select"
              style={{ width: '100%', padding: '1rem' }}
              placeholder={isLogin ? "name@goa.gov.in or comm_sharma" : "e.g. comm_sharma"}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>OFFICIAL EMAIL</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ent-select"
                  style={{ width: '100%', padding: '1rem' }}
                  placeholder="name@goa.gov.in"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>PHONE NUMBER</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="ent-select"
                  style={{ width: '100%', padding: '1rem' }}
                  placeholder="+91 90000 00000"
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ent-select"
              style={{ width: '100%', padding: '1rem' }}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button type="submit" className="ent-btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
            {loading ? 'PROCESSING...' : (isLogin ? 'SECURE LOGIN' : 'REGISTER OFFICER')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-brand)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
          >
            {isLogin ? "Need access? Register Official" : "Already registered? Login here"}
          </button>
        </div>

      </div>
    </div>
  );
}
