import React from 'react';
import { 
  Sparkles, 
  Code, 
  Eye, 
  Smartphone, 
  Server, 
  Layers, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import { whyWorkWithMe } from '../data/portfolioData';

export default function WhyMe() {
  const getIcon = (idx) => {
    switch (idx) {
      case 0: return <Code size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 1: return <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 2: return <Eye size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 3: return <Smartphone size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 4: return <Server size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 5: return <Layers size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 6: return <Users size={18} style={{ color: 'var(--accent-primary)' }} />;
      case 7: return <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />;
      default: return <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />;
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Value &amp; Standards</span>
          <h2 className="section-title">Why Collaborate With Me</h2>
          <p className="section-subtitle">
            Grounded engineering principles focused on quality code, intelligent integrations, and dependable product delivery.
          </p>
        </div>

        <div className="why-grid">
          {whyWorkWithMe.map((item, idx) => (
            <div key={idx} className="why-card">
              <h3 className="why-title">
                {getIcon(idx)}
                <span>{item.title}</span>
              </h3>
              <p className="why-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
