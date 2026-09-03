import React from 'react';
import { processSteps } from '../data/portfolioData';

export default function Process() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Methodology</span>
          <h2 className="section-title">A Structured, 4-Step Development Process</h2>
          <p className="section-subtitle">
            A disciplined workflow designed to transition projects from exploratory vision to polished, production-ready execution.
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map((step) => (
            <div key={step.step} className="process-card">
              <div className="process-step-num">{step.step}</div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.description}</p>

              <ul className="process-points">
                {step.points.map((pt, idx) => (
                  <li key={idx} className="process-point">
                    <span>{pt}</span>
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
