import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Code2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAdminToast } from './AdminLayout';
import { projectsData as fallbackProjects } from '../../data/portfolioData';

export default function AdminProjectsList() {
  const { authFetch } = useAdmin();
  const { showToast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpenWorkspace = async (projectId, projectTitle) => {
    try {
      const res = await fetch('/api/projects/open-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, target: 'antigravity' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Opened ${projectTitle} in Antigravity IDE`, 'success');
      } else {
        showToast(`❌ ${data.error}`, 'error');
      }
    } catch (err) {
      showToast(`Open failed: ${err.message}`, 'error');
    }
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [featured, setFeatured] = useState(searchParams.get('featured') || 'all');

  // Deletion modal state
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Available categories
  const categories = [
    'All',
    'AI & Web Apps',
    'Full-Stack & APIs',
    'Web Platforms',
    'Interactive & UI/UX'
  ];

  const getFilteredFallbackProjects = useCallback(() => {
    return fallbackProjects.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || p.category === category;
      const matchFeatured =
        featured === 'all' || (featured === 'featured' ? p.featured : !p.featured);
      return matchSearch && matchCat && matchFeatured;
    });
  }, [search, category, featured]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category && category !== 'All') params.set('category', category);
      if (status && status !== 'all') params.set('status', status);
      if (featured && featured !== 'all') params.set('featured', featured);

      const res = await authFetch(`/api/admin/projects?${params.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setProjects(data.data || []);
          return;
        }
      }
      setProjects(getFilteredFallbackProjects());
    } catch (err) {
      setProjects(getFilteredFallbackProjects());
    } finally {
      setLoading(false);
    }
  }, [search, category, status, featured, authFetch, getFilteredFallbackProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Quick toggle status (published <-> draft)
  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      const res = await authFetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
        );
        showToast(
          `Project '${project.title}' is now ${newStatus === 'published' ? 'Published' : 'Draft'}.`
        );
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  // Quick toggle featured
  const handleToggleFeatured = async (project) => {
    const newFeatured = !project.featured;
    try {
      const res = await authFetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: newFeatured })
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: newFeatured } : p))
        );
        showToast(
          `Project '${project.title}' marked as ${newFeatured ? 'Featured' : 'Standard'}.`
        );
      } else {
        showToast(data.error || 'Failed to update featured flag', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating featured status', 'error');
    }
  };

  // Confirm delete project
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await authFetch(`/api/admin/projects/${projectToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        showToast(`Project '${projectToDelete.title}' has been deleted.`);
        setProjectToDelete(null);
      } else {
        showToast(data.error || 'Failed to delete project', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting project', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('all');
    setFeatured('all');
  };

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-section-tag">Management</span>
          <h1 className="admin-page-title">Websites Management</h1>
          <p className="admin-page-subtitle">
            Add, edit, publish/unpublish, or delete websites. All published websites appear immediately on your live Portfolio.
          </p>
        </div>

        <Link to="/admin/websites/add" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Website</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        {/* Search Field */}
        <div className="admin-search-wrapper">
          <Search size={17} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by website name, description, technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="admin-search-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="admin-filter-controls">
          {/* Category Filter */}
          <div className="admin-select-wrapper">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="admin-select"
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {categories
                .filter((c) => c !== 'All')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="admin-select-wrapper">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="admin-select"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div className="admin-select-wrapper">
            <select
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              className="admin-select"
              aria-label="Filter by featured flag"
            >
              <option value="all">All Types</option>
              <option value="1">Featured Only</option>
              <option value="0">Standard Only</option>
            </select>
          </div>

          {(search || category !== 'All' || status !== 'all' || featured !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm"
              title="Reset all filters"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Projects Table Card */}
      <div className="admin-card">
        <div className="admin-table-header-info">
          <span className="admin-table-count">
            Showing <strong>{projects.length}</strong> {projects.length === 1 ? 'website' : 'websites'}
          </span>
        </div>

        {loading ? (
          <div className="admin-loading-state" style={{ minHeight: '260px' }}>
            <div className="admin-spinner"></div>
            <span>Fetching websites catalog...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="admin-empty-state">
            <Filter size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
            <h3>{search || category !== 'All' || status !== 'all' || featured !== 'all' ? 'No websites match your filter criteria' : 'No websites added yet.'}</h3>
            <p className="admin-text-muted">
              {search || category !== 'All' || status !== 'all' || featured !== 'all'
                ? 'Try adjusting your search terms or clearing your filters.'
                : 'Click below to add the first website you have created to your portfolio.'}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              {(search || category !== 'All' || status !== 'all' || featured !== 'all') && (
                <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                  Clear Filters
                </button>
              )}
              <Link to="/admin/websites/add" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                <span>+ Add New Website</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '44px' }}></th>
                  <th>Website Name</th>
                  <th>Category</th>
                  <th>Technologies</th>
                  <th style={{ width: '130px' }}>Status</th>
                  <th style={{ width: '90px' }}>Featured</th>
                  <th style={{ width: '80px' }}>Order</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id} className="admin-table-row">
                    {/* Thumbnail */}
                    <td>
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="admin-table-thumb"
                        onError={(e) => {
                          e.target.src = '/assets/projects/ai_web_platform.png';
                        }}
                      />
                    </td>

                    {/* Title & Subtitle */}
                    <td>
                      <div className="admin-table-title-group">
                        <Link
                          to={`/admin/projects/edit/${proj.id}`}
                          className="admin-table-title"
                        >
                          {proj.title}
                        </Link>
                        <span className="admin-table-subtitle">{proj.subtitle}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="admin-tag-pill">{proj.category}</span>
                    </td>

                    {/* Tech Stack */}
                    <td>
                      <div className="admin-tech-pill-group">
                        {proj.technologies && proj.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="admin-tech-pill">
                            {tech}
                          </span>
                        ))}
                        {proj.technologies && proj.technologies.length > 3 && (
                          <span className="admin-tech-pill-more">
                            +{proj.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status badge with 1-click toggle */}
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(proj)}
                        className={`admin-status-toggle-btn ${
                          proj.status === 'published'
                            ? 'status-published'
                            : 'status-draft'
                        }`}
                        title="Click to toggle between Published and Draft"
                      >
                        <span className="status-dot"></span>
                        <span>{proj.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Featured Star Toggle */}
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj)}
                        className={`admin-star-btn ${proj.featured ? 'active' : ''}`}
                        title={proj.featured ? 'Marked as Featured' : 'Click to feature'}
                      >
                        <Star size={16} fill={proj.featured ? '#f59e0b' : 'none'} />
                      </button>
                    </td>

                    {/* Order */}
                    <td>
                      <span className="admin-order-badge">#{proj.sort_order}</span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-table-actions">
                        {/* Open in Antigravity IDE */}
                        <button
                          type="button"
                          onClick={() => handleOpenWorkspace(proj.id, proj.title)}
                          className="btn-icon"
                          title="Open original project in Antigravity IDE"
                          aria-label="Open in Antigravity IDE"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          <Code2 size={15} />
                        </button>

                        {/* Live Website Link */}
                        {proj.live_demo_url && (
                          <a
                            href={proj.live_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon"
                            title={`Open Live Website: ${proj.live_demo_url}`}
                            aria-label="Open live website"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}

                        {/* Edit Button */}
                        <Link
                          to={`/admin/websites/edit/${proj.id}`}
                          className="btn-icon"
                          title="Edit website"
                          aria-label="Edit website"
                        >
                          <Edit3 size={15} />
                        </Link>

                        {/* Public Link / Preview */}
                        <a
                          href={`/projects/${proj.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="Preview project details page"
                          aria-label="Preview project details"
                        >
                          <Eye size={15} />
                        </a>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(proj)}
                          className="btn-icon btn-icon-danger"
                          title="Delete project"
                          aria-label="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog Modal */}
      {projectToDelete && (
        <div
          className="admin-modal-backdrop"
          onClick={() => !isDeleting && setProjectToDelete(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-confirm-icon-wrapper">
              <AlertTriangle size={28} className="admin-confirm-icon" />
            </div>

            <h3 className="admin-confirm-title">Are you sure you want to delete this website?</h3>
            
            <p className="admin-confirm-desc">
              You are about to delete <strong>"{projectToDelete.title}"</strong>. This action will permanently remove it from your admin dashboard and public portfolio listings.
            </p>

            <div className="admin-confirm-actions">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="btn btn-danger"
              >
                {isDeleting ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span className="admin-spinner"></span>
                    Deleting...
                  </span>
                ) : (
                  <span>Delete Project</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
