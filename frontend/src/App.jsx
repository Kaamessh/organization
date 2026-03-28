import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import OfficerDashboard from './pages/OfficerDashboard';
import DeveloperSetup from './pages/DeveloperSetup';
import Login from './pages/Login';
import './index.css';

// Reusable wrapper to bounce unauthenticated users back to /login
const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="enterprise-theme" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <h2 style={{color: 'var(--accent-brand)'}}>Verifying Identity...</h2>
    </div>;
  }

  return session ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* This route is completely locked down by Supabase! */}
          <Route path="/" element={
            <PrivateRoute>
              <OfficerDashboard />
            </PrivateRoute>
          } />
          
          {/* Non-locked Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/developer-setup" element={<DeveloperSetup />} />
        </Routes>
      </div>
    </Router>
  );
}
          <Route path="/login" element={<Login />} />
          <Route path="/developer" element={<DeveloperSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
