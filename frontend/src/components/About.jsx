import React from 'react';
import { CheckCircle2, User, Layers, Sparkles, Terminal } from 'lucide-react';
import { developerInfo } from '../data/portfolioData';

export default function About() {
  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Bridging Intelligent Logic with Refined User Interfaces</h2>
          <p className="section-subtitle">
            Dedicated to developing purposeful digital products that balance clean aesthetics with robust, scalable engineering.
          </p>
        </div>

        <div className="about-grid">
          {/* Left Column: Narrative & Focus Areas */}
          <div className="about-content">
            {developerInfo.aboutText.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h3 className="focus-areas-title">Core Development Focus</h3>
            <div className="focus-areas-grid">
              {developerInfo.focusAreas.map((area, index) => (
                <div key={index} className="focus-item">
                  <CheckCircle2 size={18} className="focus-icon" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Developer Profile Card */}
          <div className="dev-card-wrapper">
            <div className="dev-profile-card">
              <div className="dev-card-header">
                <div className="dev-avatar-box">
                  <span>IT</span>
                </div>
                <div>
                  <h3 className="dev-card-name">{developerInfo.name}</h3>
                  <div className="dev-card-title">{developerInfo.title}</div>
                </div>
              </div>

              <blockquote className="dev-card-statement">
                &ldquo;{developerInfo.shortStatement}&rdquo;
              </blockquote>

              <div className="dev-meta-list">
                <div className="dev-meta-item">
                  <span className="dev-meta-label">Primary Role</span>
                  <span className="dev-meta-value">{developerInfo.role}</span>
                </div>
                <div className="dev-meta-item">
                  <span className="dev-meta-label">Specialization</span>
                  <span className="dev-meta-value">AI Web Apps &amp; Full-Stack</span>
                </div>
                <div className="dev-meta-item">
                  <span className="dev-meta-label">Primary Stack</span>
                  <span className="dev-meta-value">React.js, Python, Flask, SQLite</span>
                </div>
                <div className="dev-meta-item">
                  <span className="dev-meta-label">Design Philosophy</span>
                  <span className="dev-meta-value">Minimal, Functional &amp; Accessible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
