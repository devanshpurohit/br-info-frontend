import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Database } from 'lucide-react';
import api from '../services/api';

const FormResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [formRes, respRes] = await Promise.all([
        api.get(`/forms/${id}`),
        api.get(`/responses/${id}`)
      ]);
      setForm(formRes.data);
      setResponses(respRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!responses.length) return;
    
    const headers = ['Submitted At', ...form.fields.map(f => f.label)];
    const rows = responses.map(r => [
      new Date(r.submittedAt).toLocaleString(),
      ...form.fields.map(f => {
        const val = r.answers[f.id];
        return Array.isArray(val) ? val.join(', ') : val || '';
      })
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title}_responses.csv`;
    link.click();
  };

  if (loading) return <div className="p-10">Loading responses...</div>;

  return (
    <div className="responses-page">
      <header className="glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" className="btn-icon"><ArrowLeft size={20} /></Link>
            <h1>{form?.title} <span style={{ fontWeight: '400', fontSize: '1rem', color: 'var(--text-muted)' }}>- Responses</span></h1>
          </div>
          <button onClick={exportCSV} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </header>

      <main className="container" style={{ padding: '3rem 0' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="stat-card">
            <p>Total Submissions</p>
            <h2>{responses.length}</h2>
          </div>
          <div className="stat-card">
            <p>Form Status</p>
            <h2 style={{ color: '#10b981' }}>Active</h2>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="empty-responses">
            <Database size={48} color="var(--text-muted)" />
            <p>No responses collected yet.</p>
          </div>
        ) : (
          <div className="table-container animate-fade-in">
            <table>
              <thead>
                <tr>
                  <th>Submitted At</th>
                  {form.fields.map(field => (
                    <th key={field.id}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map(resp => (
                  <tr key={resp._id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{new Date(resp.submittedAt).toLocaleString()}</td>
                    {form.fields.map(field => (
                      <td key={field.id}>
                        {Array.isArray(resp.answers[field.id]) 
                          ? resp.answers[field.id].join(', ') 
                          : resp.answers[field.id] || <span className="dash">-</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .responses-page { min-height: 100vh; background: #f8fafc; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); }
        .stat-card p { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem; }
        
        .empty-responses { text-align: center; padding: 4rem; background: white; border-radius: 12px; border: 1px solid var(--border); color: var(--text-muted); }
        
        .table-container { background: white; border-radius: 12px; border: 1px solid var(--border); overflow-x: auto; box-shadow: var(--shadow); }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { background: #f8fafc; padding: 1rem; font-weight: 600; border-bottom: 1px solid var(--border); font-size: 0.875rem; }
        td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.9375rem; }
        tr:last-child td { border-bottom: none; }
        .dash { color: #cbd5e1; }

        .btn-icon { background: none; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; }
        .btn-icon:hover { background: #f1f5f9; }
        .btn-primary { background: var(--primary); color: white; padding: 0.6rem 1.25rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
      `}} />
    </div>
  );
};

export default FormResponses;
