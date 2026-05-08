import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Eye, BarChart2, LogOut } from 'lucide-react';
import api from '../services/api';

const Dashboard = ({ user, setUser }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      setForms(res.data);
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      await api.delete(`/forms/${id}`);
      setForms(forms.filter(f => f._id !== id));
    } catch (err) {
      alert('Error deleting form');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dash-header glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div className="logo" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>FormFlow</div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>Welcome, <strong>{user.name}</strong></span>
            <button onClick={handleLogout} className="btn-icon" title="Logout"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>My Forms</h1>
          <Link to="/builder" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Create New Form
          </Link>
        </div>

        {loading ? (
          <p>Loading forms...</p>
        ) : forms.length === 0 ? (
          <div className="empty-state">
            <FileText size={64} color="var(--text-muted)" />
            <h3>No forms yet</h3>
            <p>Create your first dynamic form to start collecting responses.</p>
            <Link to="/builder" className="btn-primary" style={{ marginTop: '1rem' }}>Get Started</Link>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map(form => (
              <div key={form._id} className="form-card animate-fade-in">
                <h3>{form.title}</h3>
                <p>{form.description || 'No description'}</p>
                <div className="card-footer">
                  <div className="actions">
                    <Link to={`/f/${form._id}`} target="_blank" className="btn-icon" title="View Public Form"><Eye size={18} /></Link>
                    <Link to={`/builder/${form._id}`} className="btn-icon" title="Edit Form"><FileText size={18} /></Link>
                    <Link to={`/responses/${form._id}`} className="btn-icon" title="View Responses"><BarChart2 size={18} /></Link>
                  </div>
                  <button onClick={() => deleteForm(form._id)} className="btn-icon btn-delete" title="Delete Form"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .dash-header {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .btn-icon {
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-icon:hover {
          background: #f1f5f9;
          color: var(--primary);
        }
        .btn-delete:hover {
          color: #ef4444;
          background: #fee2e2;
        }
        .empty-state {
          text-align: center;
          padding: 5rem 0;
          background: white;
          border-radius: var(--radius);
          border: 2px dashed var(--border);
        }
        .empty-state h3 { margin-top: 1rem; }
        .empty-state p { color: var(--text-muted); }
        
        .forms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .form-card {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .form-card h3 { margin-bottom: 0.5rem; }
        .form-card p {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          height: 3em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius);
          text-decoration: none;
          font-weight: 600;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
