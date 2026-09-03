import React, { useState } from 'react';
import { ArrowRight, Code2, Sparkles, Terminal, Cpu, Database } from 'lucide-react';
import { developerInfo } from '../data/portfolioData';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <section id="home" className="section hero-section">
      <div className="container hero-grid">
        {/* Left Column: Heading & CTAs */}
        <div className="hero-content">
          <div className="hero-status-pill">
            <span className="status-dot"></span>
            <span>Available for innovative web projects</span>
          </div>

          <h1 className="hero-name">{developerInfo.name}</h1>
          <h2 className="hero-role-title">{developerInfo.title}</h2>

          <p className="hero-supporting-text">
            {developerInfo.heroSubtitle}
          </p>

          <div className="hero-cta-group">
            <a href="#projects" className="btn btn-primary">
              <span>View My Work</span>
              <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              <span>Let's Work Together</span>
            </a>
          </div>
        </div>

        {/* Right Column: Subtle AI + Web Developer Graphic / Terminal */}
        <div className="hero-visual-card">
          <div className="visual-topbar">
            <div className="topbar-dots">
              <span className="topbar-dot red"></span>
              <span className="topbar-dot amber"></span>
              <span className="topbar-dot green"></span>
            </div>
            <span className="visual-title">ibrahim-tanveer.dev / runtime</span>
            <div style={{ width: '42px' }}></div>
          </div>

          <div className="visual-body">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('ai')}
                className={`btn btn-sm ${activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                <Sparkles size={13} style={{ marginRight: '4px' }} />
                AI Pipeline
              </button>
              <button
                onClick={() => setActiveTab('fullstack')}
                className={`btn btn-sm ${activeTab === 'fullstack' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                <Code2 size={13} style={{ marginRight: '4px' }} />
                Full-Stack Architecture
              </button>
            </div>

            {activeTab === 'ai' ? (
              <div>
                <div className="visual-chip">
                  <Cpu size={13} />
                  <span>Model Coordinator &bull; v2.4 Active</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span className="terminal-code">
                    <span className="kw">const</span> engine = <span className="fn">createAIEngine</span>({'{'}
                  </span>
                </div>
                <div className="terminal-line" style={{ paddingLeft: '16px' }}>
                  <span className="terminal-code">
                    models: [<span className="str">'LLM-Assistant'</span>, <span className="str">'ImageGen'</span>, <span className="str">'CodeSynth'</span>],
                  </span>
                </div>
                <div className="terminal-line" style={{ paddingLeft: '16px' }}>
                  <span className="terminal-code">
                    streaming: <span className="kw">true</span>, latency: <span className="str">'sub-100ms'</span>
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span className="terminal-code">{'}'});</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span className="terminal-code">
                    <span className="fn">await</span> engine.<span className="fn">synthesizeExperience</span>();
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix" style={{ color: 'var(--accent-emerald)' }}>✓</span>
                  <span className="terminal-code" style={{ color: 'var(--text-muted)' }}>
                    System operational: Ready to build intelligent interfaces.
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="visual-chip">
                  <Database size={13} />
                  <span>Stack: React.js + Flask + SQLite</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span className="terminal-code">
                    <span className="kw">@app.route</span>(<span className="str">'/api/v1/solutions'</span>)
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span className="terminal-code">
                    <span className="kw">def</span> <span className="fn">render_application</span>():
                  </span>
                </div>
                <div className="terminal-line" style={{ paddingLeft: '16px' }}>
                  <span className="terminal-code">
                    <span className="kw">return</span> <span className="fn">jsonify</span>({'{'}<span className="str">'ui'</span>: <span className="str">'clean'</span>, <span className="str">'speed'</span>: <span className="str">'optimal'</span>{'}'})
                  </span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prefix" style={{ color: 'var(--accent-emerald)' }}>✓</span>
                  <span className="terminal-code" style={{ color: 'var(--text-muted)' }}>
                    Database connected. APIs compiled with zero warnings.
                  </span>
                </div>
              </div>
            )}

            <div className="terminal-pill-grid">
              <div className="feature-tag-box">
                <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>AI Integrations</span>
              </div>
              <div className="feature-tag-box">
                <Code2 size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>React &amp; Flask</span>
              </div>
              <div className="feature-tag-box">
                <Terminal size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>RESTful APIs</span>
              </div>
              <div className="feature-tag-box">
                <Database size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>Structured DBs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
