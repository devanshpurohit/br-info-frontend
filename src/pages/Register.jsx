import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Start building forms in seconds</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating account...' : 'Get Started'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Reuse styles from Login.jsx or put them in index.css */
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          background: white;
        }
        .auth-card h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .auth-subtitle {
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          border-color: var(--primary);
        }
        .btn-auth {
          width: 100%;
          padding: 0.75rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 1rem;
        }
        .btn-auth:hover {
          background: var(--primary-hover);
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-footer a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }
        .error-msg {
          background: #fee2e2;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
      `}} />
    </div>
  );
};

export default Register;
