import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle,
  FileText,
  Star,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const { authFetch } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to load dashboard statistics.');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWorkspace = async (projectId) => {
    try {
      const res = await fetch('/api/projects/open-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, target: 'antigravity' })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Opened original project workspace in Antigravity IDE!\nPath: ${data.path}`);
      } else {
        alert(`❌ Could not open: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };


  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-section-tag">Overview</span>
          <h1 className="admin-page-title">Portfolio Dashboard</h1>
          <p className="admin-page-subtitle">
            Monitor and manage your websites, visibility, and portfolio content.
          </p>
        </div>

        <Link to="/admin/websites/add" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>+ Add New Website</span>
        </Link>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        {/* Total Websites */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-label">Total Websites</span>
            <div className="admin-kpi-icon kpi-blue">
              <FolderKanban size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{loading ? '—' : stats?.total ?? 0}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-sub">All websites in database</span>
          </div>
        </div>

        {/* Published Websites */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-label">Published Websites</span>
            <div className="admin-kpi-icon kpi-emerald">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="admin-kpi-value text-emerald">{loading ? '—' : stats?.published ?? 0}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-sub">Visible on public portfolio</span>
          </div>
        </div>

        {/* Draft Websites */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-label">Draft Websites</span>
            <div className="admin-kpi-icon kpi-amber">
              <Clock size={20} />
            </div>
          </div>
          <div className="admin-kpi-value text-amber">{loading ? '—' : stats?.draft ?? 0}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-sub">Hidden from visitors</span>
          </div>
        </div>

        {/* Featured Websites */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-label">Featured Websites</span>
            <div className="admin-kpi-icon kpi-purple">
              <Star size={20} />
            </div>
          </div>
          <div className="admin-kpi-value text-purple">{loading ? '—' : stats?.featured ?? 0}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-sub">Showcase highlights</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Added Projects & Quick Categories */}
      <div className="admin-dashboard-split">
        {/* Recently Added Projects Card */}
        <div className="admin-card admin-dashboard-card">
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
              <h2 className="admin-card-title">Recently Added Projects</h2>
            </div>
            <Link to="/admin/projects" className="admin-card-action-link">
              <span>View All Projects</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="admin-card-body">
            {loading ? (
              <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <span>Loading recent projects...</span>
              </div>
            ) : !stats?.recent_projects || stats.recent_projects.length === 0 ? (
              <div className="admin-empty-state">
                <FolderKanban size={36} />
                <p>No projects added yet.</p>
                <Link to="/admin/projects/add" className="btn btn-primary btn-sm">
                  Add Your First Project
                </Link>
              </div>
            ) : (
              <div className="admin-recent-list">
                {stats.recent_projects.map((proj) => (
                  <div key={proj.id} className="admin-recent-item">
                    <div className="admin-recent-thumb-wrapper">
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="admin-recent-thumb"
                        onError={(e) => {
                          e.target.src = '/assets/projects/ai_web_platform.png';
                        }}
                      />
                      {proj.featured && (
                        <span className="admin-featured-star-pill" title="Featured Project">
                          ★
                        </span>
                      )}
                    </div>

                    <div className="admin-recent-meta">
                      <div className="admin-recent-title-row">
                        <span className="admin-recent-title">{proj.title}</span>
                        <span
                          className={`admin-status-badge ${
                            proj.status === 'published'
                              ? 'status-published'
                              : 'status-draft'
                          }`}
                        >
                          {proj.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="admin-recent-sub">
                        <span className="admin-recent-cat">{proj.category}</span>
                        <span className="admin-dot-sep">&bull;</span>
                        <span>{proj.technologies?.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>

                    <div className="admin-recent-actions" style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenWorkspace(proj.id)}
                        className="btn btn-primary btn-sm"
                        title="Open original project in Antigravity IDE"
                      >
                        Open
                      </button>
                      <Link
                        to={`/admin/websites/edit/${proj.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Distribution Card */}
        <div className="admin-card admin-dashboard-card">
          <div className="admin-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} style={{ color: 'var(--accent-emerald)' }} />
              <h2 className="admin-card-title">Project Categories</h2>
            </div>
            <Link to="/admin/categories" className="admin-card-action-link">
              <span>Manage</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="admin-card-body">
            {loading ? (
              <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <span>Loading categories...</span>
              </div>
            ) : !stats?.categories || stats.categories.length === 0 ? (
              <p className="admin-text-muted">No categories populated yet.</p>
            ) : (
              <div className="admin-categories-list">
                {stats.categories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/admin/websites?category=${encodeURIComponent(cat.name)}`}
                    className="admin-category-stat-row"
                  >
                    <div className="admin-category-stat-left">
                      <span className="admin-category-bullet"></span>
                      <span className="admin-category-stat-name">{cat.name}</span>
                    </div>
                    <span className="admin-category-stat-count">
                      {cat.count} {cat.count === 1 ? 'website' : 'websites'}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <div className="admin-quick-links-box">
              <h4>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <Link to="/admin/websites/add" className="admin-quick-link">
                  <PlusCircle size={15} />
                  <span>+ Add New Website</span>
                </Link>
                <Link to="/admin/websites?status=draft" className="admin-quick-link">
                  <FileText size={15} />
                  <span>Review pending drafts</span>
                </Link>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-quick-link"
                >
                  <ExternalLink size={15} />
                  <span>Inspect public website live</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
