import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const FormView = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${id}`);
      setForm(res.data);
    } catch (err) {
      setError('Form not found or inaccessible.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    const currentAnswers = answers[fieldId] || [];
    if (checked) {
      setAnswers(prev => ({ ...prev, [fieldId]: [...currentAnswers, option] }));
    } else {
      setAnswers(prev => ({ ...prev, [fieldId]: currentAnswers.filter(o => o !== option) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/responses/${id}`, { answers });
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting form. Please try again.');
    }
  };

  if (loading) return <div className="loading-screen">Loading form...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-card glass animate-fade-in">
          <CheckCircle2 size={64} color="#10b981" />
          <h2>Response Submitted!</h2>
          <p>Thank you for filling out <strong>{form.title}</strong>.</p>
          <button onClick={() => window.location.reload()} className="btn-refresh">Submit another response</button>
        </div>
      </div>
    );
  }

  const { styling } = form;

  return (
    <div className="form-view-container" style={{ backgroundColor: styling.backgroundColor, minHeight: '100vh', fontFamily: styling.fontFamily }}>
      <div className="form-card animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '3rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
        <header style={{ marginBottom: '2.5rem', borderBottom: `4px solid ${styling.primaryColor}`, paddingBottom: '1.5rem' }}>
          <h1 style={{ color: styling.primaryColor, marginBottom: '0.5rem' }}>{form.title}</h1>
          <p style={{ color: styling.textColor, opacity: 0.8 }}>{form.description}</p>
        </header>

        <form onSubmit={handleSubmit}>
          {form.fields.map(field => (
            <div key={field.id} className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.75rem', color: styling.textColor }}>
                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              {renderField(field, handleInputChange, handleCheckboxChange, answers[field.id])}
            </div>
          ))}

          <button 
            type="submit" 
            className="submit-btn" 
            style={{ 
              backgroundColor: styling.primaryColor, 
              color: '#fff', 
              width: '100%', 
              padding: '1rem', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            {styling.buttonText}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-view-container { padding: 4rem 1rem; }
        .form-card { border-radius: 16px; }
        .input-field { width: 100%; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border-color 0.2s; font-size: 1rem; }
        .input-field:focus { border-color: ${styling.primaryColor}; }
        
        .loading-screen, .error-screen, .success-screen { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; background: #f8fafc; }
        .success-card { background: white; padding: 4rem; border-radius: 20px; text-align: center; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
        .success-card h2 { margin: 1.5rem 0 0.5rem; font-size: 2rem; }
        .success-card p { color: #64748b; font-size: 1.1rem; }
        .btn-refresh { margin-top: 2rem; background: none; border: none; color: ${styling.primaryColor}; font-weight: 600; cursor: pointer; text-decoration: underline; }
      `}} />
    </div>
  );
};

const renderField = (field, onChange, onCheckboxChange, value) => {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return <input type={field.type} required={field.required} placeholder={field.placeholder} className="input-field" onChange={(e) => onChange(field.id, e.target.value)} />;
    case 'textarea':
      return <textarea required={field.required} placeholder={field.placeholder} rows={4} className="input-field" onChange={(e) => onChange(field.id, e.target.value)} />;
    case 'select':
      return (
        <select required={field.required} className="input-field" onChange={(e) => onChange(field.id, e.target.value)}>
          <option value="">{field.placeholder || 'Select an option'}</option>
          {field.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    case 'radio':
      return (
        <div>
          {field.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <input type="radio" name={field.id} required={field.required} value={opt} onChange={(e) => onChange(field.id, e.target.value)} /> 
              <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div>
          {field.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <input type="checkbox" checked={value?.includes(opt)} onChange={(e) => onCheckboxChange(field.id, opt, e.target.checked)} /> 
              <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default FormView;
