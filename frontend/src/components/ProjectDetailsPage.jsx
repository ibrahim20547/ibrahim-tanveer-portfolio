import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  Share2
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { parseApiResponse } from '../utils/apiHelper';
import { projectsData as fallbackProjects } from '../data/portfolioData';

export default function ProjectDetailsPage({ theme, toggleTheme }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await parseApiResponse(res);
        if (data && data.success && data.data) {
          setProject(data.data);
          setActiveImage(data.data.image_url);
        } else {
          const fallback = fallbackProjects.find((p) => p.id === projectId);
          if (fallback) {
            setProject(fallback);
            setActiveImage(fallback.image_url);
          } else {
            setError(data?.error || 'Project not found.');
          }
        }
      } catch (err) {
        const fallback = fallbackProjects.find((p) => p.id === projectId);
        if (fallback) {
          setProject(fallback);
          setActiveImage(fallback.image_url);
        } else {
          setError('Failed to load project details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return (
    <div className="app-container">
      {/* Public Navbar (Theme preserved, NO admin links) */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="project-detail-page-main">
        <div className="container" style={{ paddingBottom: '80px', paddingTop: '40px' }}>
          {/* Back button */}
          <div style={{ marginBottom: '24px' }}>
            <Link to="/#projects" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={16} />
              <span>Back to Portfolio</span>
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading-state" style={{ minHeight: '400px' }}>
              <div className="admin-spinner"></div>
              <span>Loading project details...</span>
            </div>
          ) : error || !project ? (
            <div className="admin-card admin-empty-state" style={{ minHeight: '320px' }}>
              <AlertCircle size={40} style={{ color: '#ef4444', marginBottom: '16px' }} />
              <h2>Project Not Found</h2>
              <p className="admin-text-muted">
                {error || 'This project may have been moved, deleted, or is currently unpublished.'}
              </p>
              <Link to="/#projects" className="btn btn-primary" style={{ marginTop: '20px' }}>
                View All Work
              </Link>
            </div>
          ) : (
            <article className="project-detail-article">
              {/* Header Info */}
              <div className="project-detail-header">
                <div className="project-category-tag">{project.category}</div>
                <h1 className="project-detail-title">{project.title}</h1>
                <p className="project-detail-subtitle">{project.subtitle}</p>

                {/* Meta stats & links bar */}
                <div className="project-detail-actions-bar">
                  <div className="project-detail-actions-left">
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        <span>Live Website</span>
                        <ExternalLink size={16} />
                      </a>
                    )}

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        <Github size={16} />
                        <span>View Repository</span>
                      </a>
                    )}
                  </div>

                  {project.status === 'draft' && (
                    <span className="admin-status-badge status-draft">
                      Draft Preview Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="project-detail-hero-wrapper">
                <img
                  src={activeImage || project.image_url}
                  alt={project.title}
                  className="project-detail-hero-img"
                  onError={(e) => {
                    e.target.src = '/assets/projects/ai_web_platform.png';
                  }}
                />

                {/* Screenshots Thumbnails Strip if multiple exist */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="project-detail-gallery-strip">
                    <button
                      type="button"
                      onClick={() => setActiveImage(project.image_url)}
                      className={`project-detail-gallery-thumb ${activeImage === project.image_url ? 'active' : ''}`}
                    >
                      <img src={project.image_url} alt="Main thumbnail" />
                    </button>
                    {project.screenshots.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(s)}
                        className={`project-detail-gallery-thumb ${activeImage === s ? 'active' : ''}`}
                      >
                        <img src={s} alt={`Screenshot ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Grid */}
              <div className="project-detail-grid">
                {/* Main Left Column: Overview, Challenge, Solution */}
                <div className="project-detail-main-col">
                  {/* Detailed Description */}
                  <div className="project-detail-card">
                    <h2 className="project-detail-section-title">Project Overview</h2>
                    <div className="project-detail-text">
                      {project.overview || project.description}
                    </div>
                  </div>

                  {/* Problem & Solution */}
                  {(project.problem || project.solution) && (
                    <div className="modal-grid-two" style={{ marginTop: '24px' }}>
                      {project.problem && (
                        <div className="modal-box">
                          <h4>
                            <AlertCircle size={18} style={{ color: '#ef4444' }} />
                            <span>The Challenge</span>
                          </h4>
                          <p>{project.problem}</p>
                        </div>
                      )}

                      {project.solution && (
                        <div className="modal-box">
                          <h4>
                            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
                            <span>The Solution</span>
                          </h4>
                          <p>{project.solution}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="project-detail-card" style={{ marginTop: '24px' }}>
                      <h2 className="project-detail-section-title">Key Architectural Features</h2>
                      <ul className="modal-features-list">
                        {project.features.map((feat, idx) => (
                          <li key={idx} className="modal-feature-item">
                            <CheckCircle size={16} style={{ color: 'var(--accent-emerald)', marginTop: '3px', flexShrink: 0 }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Sidebar: Tech Stack & Specs */}
                <aside className="project-detail-sidebar">
                  {/* Technologies */}
                  <div className="project-detail-card">
                    <h3 className="project-detail-sidebar-title">Technologies</h3>
                    <div className="project-tech-tags" style={{ marginTop: '12px' }}>
                      {project.technologies && project.technologies.map((tech, idx) => (
                        <span key={idx} className="project-tech-tag" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Meta Card */}
                  <div className="project-detail-card" style={{ marginTop: '20px' }}>
                    <h3 className="project-detail-sidebar-title">Project Details</h3>
                    <div className="project-meta-list">
                      <div className="project-meta-item">
                        <span className="meta-label">Category</span>
                        <span className="meta-value">{project.category}</span>
                      </div>
                      <div className="project-meta-item">
                        <span className="meta-label">Architecture</span>
                        <span className="meta-value">Modern Web Application</span>
                      </div>
                      <div className="project-meta-item">
                        <span className="meta-label">Status</span>
                        <span className="meta-value" style={{ textTransform: 'capitalize' }}>
                          {project.status || 'Published'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="project-detail-card cta-card" style={{ marginTop: '20px' }}>
                    <h4>Interested in similar work?</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
                      Let's collaborate to bring your web or AI application to reality.
                    </p>
                    <Link to="/#contact" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      Get In Touch
                    </Link>
                  </div>
                </aside>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
