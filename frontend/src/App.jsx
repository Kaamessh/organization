import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import OfficerDashboard from './pages/OfficerDashboard';
import GroundIntelPage from './pages/GroundIntelPage';
import LocationDatabasePage from './pages/LocationDatabasePage';
import OfficerProfilePage from './pages/OfficerProfilePage';
import DeveloperSetup from './pages/DeveloperSetup';
import GlobalAnalytics from './pages/GlobalAnalytics';
import Login from './pages/Login';
import './index.css';

const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="enterprise-theme" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2 style={{ color: 'var(--accent-brand)' }}>Verifying Identity...</h2>
    </div>
  );

  return session ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/developer-setup" element={<DeveloperSetup />} />
          <Route path="/" element={<PrivateRoute><OfficerDashboard /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><GlobalAnalytics /></PrivateRoute>} />
          <Route path="/intel" element={<PrivateRoute><GroundIntelPage /></PrivateRoute>} />
          <Route path="/locations" element={<PrivateRoute><LocationDatabasePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><OfficerProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
