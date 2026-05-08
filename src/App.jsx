import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormResponses from './pages/FormResponses';
import FormView from './pages/FormView';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/f/:id" element={<FormView />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/builder/:id?" 
          element={user ? <FormBuilder /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/responses/:id" 
          element={user ? <FormResponses /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
