import React from 'react';
import { Bot, Layers, Globe, LayoutDashboard, BrainCircuit, Smartphone, Check } from 'lucide-react';
import { servicesData } from '../data/portfolioData';

export default function Services() {
  const getServiceIcon = (id) => {
    switch (id) {
      case 'ai-web-app':
        return <Bot size={24} />;
      case 'full-stack':
        return <Layers size={24} />;
      case 'business-websites':
        return <Globe size={24} />;
      case 'admin-dashboards':
        return <LayoutDashboard size={24} />;
      case 'ai-integration':
        return <BrainCircuit size={24} />;
      case 'ui-ux-responsive':
        return <Smartphone size={24} />;
      default:
        return <Bot size={24} />;
    }
  };

  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Services &amp; Solutions</span>
          <h2 className="section-title">End-to-End Engineering for Digital Products</h2>
          <p className="section-subtitle">
            Delivering tailored web engineering services from conceptualization and AI model integration to full-stack deployment.
          </p>
        </div>

        <div className="services-grid">
          {servicesData.map((srv) => (
            <div key={srv.id} className="service-card">
              <div className="service-icon-box">
                {getServiceIcon(srv.id)}
              </div>

              <h3 className="service-title">{srv.title}</h3>
              <p className="service-desc">{srv.description}</p>

              <ul className="service-points-list">
                {srv.details.map((point, idx) => (
                  <li key={idx} className="service-point-item">
                    <Check size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
