import React from 'react';
import { Link } from 'react-router-dom';
import { FormInput, Palette, BarChart3, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="glass">
        <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div className="logo" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>FormFlow</div>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500' }}>Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className="hero" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Build powerful forms <br /> without writing code.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            The most intuitive no-code form builder for creators, marketers, and developers. Custom styling, dynamic fields, and real-time analytics.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Create Your First Form</Link>
        </section>

        <section className="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '4rem 0' }}>
          <FeatureCard 
            icon={<FormInput size={32} color="var(--primary)" />} 
            title="Dynamic Fields" 
            desc="Add text, dropdowns, checkboxes, and more with a simple click." 
          />
          <FeatureCard 
            icon={<Palette size={32} color="var(--primary)" />} 
            title="Custom Styling" 
            desc="Match your brand with custom colors, fonts, and layouts." 
          />
          <FeatureCard 
            icon={<BarChart3 size={32} color="var(--primary)" />} 
            title="Real-time Analytics" 
            desc="Track submissions and analyze data with beautiful dashboards." 
          />
          <FeatureCard 
            icon={<ShieldCheck size={32} color="var(--primary)" />} 
            title="Secure Data" 
            desc="Your data is encrypted and stored securely in our database." 
          />
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s;
          display: inline-block;
        }
        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        .feature-card {
          background: var(--card);
          padding: 2rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-lg);
          transform: translateY(-5px);
        }
      `}} />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card animate-fade-in">
    <div style={{ marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)' }}>{desc}</p>
  </div>
);

export default Landing;
