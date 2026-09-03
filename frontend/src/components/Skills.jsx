import React from 'react';
import { Layout, Server, Sparkles, GitBranch, Cpu, Database, Terminal } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

export default function Skills() {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Frontend':
        return <Layout size={22} />;
      case 'Backend':
        return <Server size={22} />;
      case 'AI & Development':
        return <Sparkles size={22} />;
      case 'Tools & Workflow':
        return <GitBranch size={22} />;
      default:
        return <Cpu size={22} />;
    }
  };

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Skills &amp; Technologies</span>
          <h2 className="section-title">Technical Expertise &amp; Core Stack</h2>
          <p className="section-subtitle">
            A focused toolkit centered on building fast, modern AI-integrated web applications and scalable full-stack platforms.
          </p>
        </div>

        <div className="skills-grid">
          {skillsData.map((cat, idx) => (
            <div key={idx} className="skill-category-card">
              <div className="skill-card-top">
                <div className="skill-cat-icon">
                  {getCategoryIcon(cat.category)}
                </div>
                <div>
                  <h3 className="skill-cat-title">{cat.category}</h3>
                </div>
              </div>

              <p className="skill-cat-desc">{cat.description}</p>

              <div className="skills-chip-list">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-chip" title={skill.level}>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
