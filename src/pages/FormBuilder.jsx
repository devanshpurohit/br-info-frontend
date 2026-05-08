import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, Settings, Save, ArrowLeft, Type, Hash, List, CheckSquare, CircleDot, Calendar, AlignLeft } from 'lucide-react';
import api from '../services/api';

const FIELD_TYPES = [
  { type: 'text', label: 'Short Text', icon: <Type size={18} /> },
  { type: 'textarea', label: 'Long Text', icon: <AlignLeft size={18} /> },
  { type: 'number', label: 'Number', icon: <Hash size={18} /> },
  { type: 'select', label: 'Dropdown', icon: <List size={18} /> },
  { type: 'radio', label: 'Radio Buttons', icon: <CircleDot size={18} /> },
  { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquare size={18} /> },
  { type: 'date', label: 'Date Picker', icon: <Calendar size={18} /> },
];

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Form');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [styling, setStyling] = useState({
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    buttonText: 'Submit',
    fontFamily: 'Outfit, sans-serif'
  });
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('fields'); // 'fields' or 'style'

  useEffect(() => {
    if (id) fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${id}`);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setFields(res.data.fields);
      if (res.data.styling) setStyling(res.data.styling);
    } catch (err) {
      console.error('Error fetching form:', err);
    }
  };

  const addField = (fieldType) => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1', 'Option 2'] : []
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const removeField = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const updateField = (fieldId, updates) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { title, description, fields, styling };
      if (id) {
        await api.put(`/forms/${id}`, payload);
      } else {
        await api.post('/forms', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Error saving form');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="builder-container">
      {/* Header */}
      <header className="builder-header glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" className="btn-icon"><ArrowLeft size={20} /></Link>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
          </div>
          <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
            <Save size={18} style={{ marginRight: '0.5rem' }} /> {isSaving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </header>

      <div className="builder-main">
        {/* Left Sidebar: Components */}
        <aside className="builder-sidebar-left">
          <h3>Add Fields</h3>
          <div className="field-type-list">
            {FIELD_TYPES.map(ft => (
              <button key={ft.type} className="field-type-btn" onClick={() => addField(ft.type)}>
                {ft.icon} {ft.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Canvas */}
        <main className="builder-canvas">
          <div className="form-preview" style={{ backgroundColor: styling.backgroundColor, fontFamily: styling.fontFamily }}>
            <div className="form-header">
              <h2 style={{ color: styling.primaryColor }}>{title}</h2>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form description..."
                className="desc-input"
              />
            </div>

            <div className="fields-container">
              {fields.length === 0 ? (
                <div className="canvas-empty">Click a field on the left to start building</div>
              ) : (
                fields.map(field => (
                  <div 
                    key={field.id} 
                    className={`field-wrapper ${selectedFieldId === field.id ? 'active' : ''}`}
                    onClick={() => setSelectedFieldId(field.id)}
                  >
                    <div className="field-label-row">
                      <label style={{ color: styling.textColor }}>{field.label} {field.required && <span className="req">*</span>}</label>
                      <button className="btn-del-field" onClick={(e) => { e.stopPropagation(); removeField(field.id); }}><Trash2 size={14} /></button>
                    </div>
                    {renderFieldPreview(field)}
                  </div>
                ))
              )}
            </div>

            {fields.length > 0 && (
              <button className="preview-submit" style={{ background: styling.primaryColor }}>
                {styling.buttonText}
              </button>
            )}
          </div>
        </main>

        {/* Right Sidebar: Properties/Style */}
        <aside className="builder-sidebar-right">
          <div className="tabs">
            <button className={`tab ${activeTab === 'fields' ? 'active' : ''}`} onClick={() => setActiveTab('fields')}>Properties</button>
            <button className={`tab ${activeTab === 'style' ? 'active' : ''}`} onClick={() => setActiveTab('style')}>Style</button>
          </div>

          <div className="tab-content">
            {activeTab === 'fields' ? (
              selectedField ? (
                <div className="properties-editor animate-fade-in">
                  <div className="prop-group">
                    <label>Label</label>
                    <input value={selectedField.label} onChange={(e) => updateField(selectedField.id, { label: e.target.value })} />
                  </div>
                  <div className="prop-group">
                    <label>Placeholder</label>
                    <input value={selectedField.placeholder} onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })} />
                  </div>
                  <div className="prop-group checkbox-group">
                    <input 
                      type="checkbox" 
                      id="required-check"
                      checked={selectedField.required} 
                      onChange={(e) => updateField(selectedField.id, { required: e.target.checked })} 
                    />
                    <label htmlFor="required-check">Required</label>
                  </div>
                  
                  {['select', 'radio', 'checkbox'].includes(selectedField.type) && (
                    <div className="prop-group">
                      <label>Options (one per line)</label>
                      <textarea 
                        value={selectedField.options.join('\n')} 
                        onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('\n') })}
                        rows={5}
                      />
                    </div>
                  )}
                </div>
              ) : <p className="no-select-msg">Select a field to edit its properties</p>
            ) : (
              <div className="style-editor animate-fade-in">
                <div className="prop-group">
                  <label>Primary Color</label>
                  <div className="color-picker">
                    <input type="color" value={styling.primaryColor} onChange={(e) => setStyling({...styling, primaryColor: e.target.value})} />
                    <span>{styling.primaryColor}</span>
                  </div>
                </div>
                <div className="prop-group">
                  <label>Background Color</label>
                  <div className="color-picker">
                    <input type="color" value={styling.backgroundColor} onChange={(e) => setStyling({...styling, backgroundColor: e.target.value})} />
                    <span>{styling.backgroundColor}</span>
                  </div>
                </div>
                <div className="prop-group">
                  <label>Text Color</label>
                  <div className="color-picker">
                    <input type="color" value={styling.textColor} onChange={(e) => setStyling({...styling, textColor: e.target.value})} />
                    <span>{styling.textColor}</span>
                  </div>
                </div>
                <div className="prop-group">
                  <label>Button Text</label>
                  <input value={styling.buttonText} onChange={(e) => setStyling({...styling, buttonText: e.target.value})} />
                </div>
                <div className="prop-group">
                  <label>Font Family</label>
                  <select value={styling.fontFamily} onChange={(e) => setStyling({...styling, fontFamily: e.target.value})}>
                    <option value="'Outfit', sans-serif">Outfit</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="sans-serif">System Sans</option>
                    <option value="serif">System Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .builder-container { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        .builder-header { border-bottom: 1px solid var(--border); background: white; }
        .title-input { border: none; font-size: 1.25rem; font-weight: 700; outline: none; background: transparent; width: 300px; }
        .builder-main { flex: 1; display: flex; overflow: hidden; }
        
        .builder-sidebar-left, .builder-sidebar-right { width: 300px; background: white; border-right: 1px solid var(--border); padding: 1.5rem; overflow-y: auto; }
        .builder-sidebar-right { border-right: none; border-left: 1px solid var(--border); padding: 0; }
        
        .builder-canvas { flex: 1; padding: 3rem; background: #f1f5f9; overflow-y: auto; display: flex; justify-content: center; }
        .form-preview { width: 100%; max-width: 600px; background: white; border-radius: var(--radius); box-shadow: var(--shadow-lg); padding: 3rem; min-height: fit-content; }
        
        .field-type-list { display: grid; gap: 0.75rem; margin-top: 1.5rem; }
        .field-type-btn { display: flex; alignItems: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: white; font-weight: 500; text-align: left; }
        .field-type-btn:hover { border-color: var(--primary); color: var(--primary); background: #f5f3ff; }
        
        .form-header { margin-bottom: 2rem; }
        .desc-input { width: 100%; border: none; outline: none; color: var(--text-muted); resize: none; font-size: 1rem; }
        
        .field-wrapper { padding: 1rem; border: 2px solid transparent; border-radius: 8px; margin-bottom: 1rem; cursor: pointer; transition: all 0.2s; position: relative; }
        .field-wrapper:hover { background: #f8fafc; }
        .field-wrapper.active { border-color: var(--primary); background: #f5f3ff; }
        
        .field-label-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .req { color: #ef4444; }
        .btn-del-field { background: none; border: none; color: #94a3b8; display: none; }
        .field-wrapper:hover .btn-del-field { display: block; }
        .btn-del-field:hover { color: #ef4444; }
        
        .preview-input { width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 6px; pointer-events: none; background: #fff; }
        .preview-submit { width: 100%; padding: 1rem; color: white; border: none; border-radius: 8px; font-weight: 700; margin-top: 2rem; cursor: pointer; }
        
        .tabs { display: flex; border-bottom: 1px solid var(--border); }
        .tab { flex: 1; padding: 1rem; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-muted); font-weight: 600; }
        .tab.active { color: var(--primary); border-bottom-color: var(--primary); }
        
        .tab-content { padding: 1.5rem; }
        .prop-group { margin-bottom: 1.5rem; }
        .prop-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
        .prop-group input:not([type="checkbox"]), .prop-group select, .prop-group textarea { width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 6px; outline: none; }
        .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
        .checkbox-group label { margin-bottom: 0; }
        
        .color-picker { display: flex; align-items: center; gap: 1rem; border: 1px solid var(--border); padding: 0.5rem; border-radius: 6px; }
        .color-picker input { width: 40px; height: 30px; border: none; padding: 0; background: none; cursor: pointer; }
        
        .no-select-msg { color: var(--text-muted); text-align: center; margin-top: 3rem; }
        .canvas-empty { border: 2px dashed var(--border); padding: 3rem; text-align: center; color: var(--text-muted); border-radius: 8px; }
      `}} />
    </div>
  );
};

const renderFieldPreview = (field) => {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return <input type={field.type} className="preview-input" placeholder={field.placeholder} readOnly />;
    case 'textarea':
      return <textarea className="preview-input" placeholder={field.placeholder} rows={3} readOnly />;
    case 'select':
      return (
        <select className="preview-input" readOnly>
          <option>{field.placeholder || 'Select an option'}</option>
          {field.options.map((opt, i) => <option key={i}>{opt}</option>)}
        </select>
      );
    case 'radio':
      return (
        <div>
          {field.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <input type="radio" disabled /> <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div>
          {field.options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <input type="checkbox" disabled /> <span>{opt}</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default FormBuilder;
