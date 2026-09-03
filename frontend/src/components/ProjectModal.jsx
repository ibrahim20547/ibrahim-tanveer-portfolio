import React, { useEffect } from 'react';
import { X, CheckCircle, ExternalLink, Github, Layers, AlertCircle, Sparkles } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <img
          src={project.image_url}
          alt={project.title}
          className="modal-hero-img"
          loading="lazy"
        />

        <div className="modal-content">
          <div className="modal-category">{project.category}</div>
          <h2 className="modal-title">{project.title}</h2>
          <div className="modal-subtitle">{project.subtitle}</div>

          {/* Overview */}
          <h3 className="modal-section-title">Project Overview</h3>
          <p style={{ fontSize: '0.98rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            {project.overview}
          </p>

          {/* Problem & Solution */}
          <div className="modal-grid-two">
            <div className="modal-box">
              <h4>
                <AlertCircle size={17} style={{ color: '#ef4444' }} />
                <span>The Challenge</span>
              </h4>
              <p>{project.problem}</p>
            </div>

            <div className="modal-box">
              <h4>
                <Sparkles size={17} style={{ color: 'var(--accent-primary)' }} />
                <span>The Solution</span>
              </h4>
              <p>{project.solution}</p>
            </div>
          </div>

          {/* Key Features */}
          <h3 className="modal-section-title">Key Architectural Features</h3>
          <ul className="modal-features-list">
            {project.features && project.features.map((feat, idx) => (
              <li key={idx} className="modal-feature-item">
                <CheckCircle size={16} style={{ color: 'var(--accent-emerald)', marginTop: '3px', flexShrink: 0 }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {/* Technologies Used */}
          <h3 className="modal-section-title">Technologies &amp; Tools</h3>
          <div className="project-tech-tags" style={{ marginTop: '10px' }}>
            {project.technologies && project.technologies.map((tech, idx) => (
              <span key={idx} className="project-tech-tag" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="modal-actions" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const res = await fetch('/api/projects/open-workspace', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, target: 'antigravity' })
                  });
                  const data = await res.json();
                  if (data.success) {
                    alert(`✅ Successfully opened original ${project.title} workspace in Antigravity IDE!\nPath: ${data.path}`);
                  } else {
                    alert(`❌ Could not open: ${data.error}`);
                  }
                } catch (err) {
                  alert(`Workspace opener error: ${err.message}`);
                }
              }}
            >
              <span>Open in Antigravity</span>
              <ExternalLink size={16} />
            </button>

            {project.live_demo_url && !project.live_demo_url.startsWith('#') && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <span>Live Website</span>
                <ExternalLink size={16} />
              </a>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  const res = await fetch('/api/projects/open-workspace', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, target: 'explorer' })
                  });
                  const data = await res.json();
                  if (data.success) {
                    alert(`📁 Opened original project folder in File Explorer:\n${data.path}`);
                  }
                } catch (err) {
                  alert(`Error: ${err.message}`);
                }
              }}
            >
              <span>Browse Files</span>
              <Layers size={16} />
            </button>

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <span>Repository</span>
                <Github size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
