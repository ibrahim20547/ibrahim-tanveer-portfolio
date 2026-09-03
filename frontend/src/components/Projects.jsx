import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ExternalLink, Sparkles, Check, Info, Code2 } from 'lucide-react';
import { projectsData as fallbackProjects } from '../data/portfolioData';

export default function Projects({ onSelectProject }) {
  const [projects, setProjects] = useState(fallbackProjects);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const handleOpenWorkspace = async (e, projectId, projectTitle) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/projects/open-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, target: 'antigravity' })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Opened original ${projectTitle} workspace in Antigravity IDE!\nPath: ${data.path}`);
      } else {
        alert(`❌ Could not open: ${data.error}`);
      }
    } catch (err) {
      alert(`Workspace error: ${err.message}`);
    }
  };

  useEffect(() => {
    // Fetch published projects from Flask backend
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('API returned ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          // Merge API data with rich fallback fields if available
          const merged = data.data.map((apiItem) => {
            const fallback = fallbackProjects.find((f) => f.id === apiItem.id) || {};
            return {
              ...fallback,
              ...apiItem,
              features: Array.isArray(apiItem.features) && apiItem.features.length > 0
                ? apiItem.features
                : fallback.features || [],
              technologies: Array.isArray(apiItem.technologies) && apiItem.technologies.length > 0
                ? apiItem.technologies
                : fallback.technologies || []
            };
          });
          setProjects(merged);
        }
      })
      .catch((err) => {
        console.info('Backend API notice, using local portfolio dataset:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute available categories dynamically based on loaded projects
  const categories = [
    'All',
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))
  ];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Featured Work</span>
          <h2 className="section-title">Selected Web &amp; AI Applications</h2>
          <p className="section-subtitle">
            A showcase of modern web systems, generative AI integrations, full-stack business applications, and digital platforms.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.82rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              onClick={() => onSelectProject(project)}
            >
              <div className="project-image-container">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/assets/projects/ai_web_platform.png';
                  }}
                />
                {(project.featured || project.badge) && (
                  <span className="project-badge-pill">
                    {project.badge || 'Featured Work'}
                  </span>
                )}
              </div>

              <div className="project-body">
                <div className="project-category-tag">{project.category}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                {/* Key Features preview */}
                <ul className="project-features-list">
                  {project.features && project.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="project-feature-item">
                      <Check size={14} className="project-feature-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="project-tech-tags">
                  {project.technologies && project.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="project-tech-tag">{tech}</span>
                  ))}
                  {project.technologies && project.technologies.length > 4 && (
                    <span className="project-tech-tag">+{project.technologies.length - 4}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="project-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => handleOpenWorkspace(e, project.id, project.title)}
                    title={`Open original ${project.title} workspace in Antigravity IDE`}
                    style={{ gap: '6px' }}
                  >
                    <Code2 size={14} />
                    <span>Open Project</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                  >
                    <Info size={14} />
                    <span>Details</span>
                  </button>

                  {project.live_demo_url && !project.live_demo_url.startsWith('#') && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
