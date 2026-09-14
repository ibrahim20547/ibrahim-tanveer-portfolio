import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Plus,
  X,
  Sparkles,
  ExternalLink,
  Github,
  CheckCircle,
  Eye,
  AlertCircle,
  FolderPlus,
  Layers,
  Star
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAdminToast } from './AdminLayout';
import { parseApiResponse } from '../../utils/apiHelper';

export default function AdminProjectForm() {
  const { projectId } = useParams();
  const isEditing = Boolean(projectId);
  const navigate = useNavigate();
  const { authFetch } = useAdmin();
  const { showToast } = useAdminToast();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'AI & Web Apps',
    customCategory: '',
    description: '',
    overview: '',
    problem: '',
    solution: '',
    technologies: ['React.js', 'Python', 'Flask'],
    features: ['Modern responsive UI', 'REST API integration'],
    image_url: '/assets/projects/ai_web_platform.png',
    screenshots: [],
    live_demo_url: '',
    github_url: '',
    status: 'published',
    featured: false,
    sort_order: 0
  });

  // Inputs for adding tags & items
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [screenshotInput, setScreenshotInput] = useState('');
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const predefinedCategories = [
    'AI & Web Apps',
    'Full-Stack & APIs',
    'Web Platforms',
    'Interactive & UI/UX',
    'E-Commerce & Portals',
    'Other (Custom)'
  ];

  // Fetch project data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const res = await authFetch(`/api/admin/projects/${projectId}`);
          const data = await parseApiResponse(res);
          if (data && data.success && (data.data || data.website)) {
            const p = data.data || data.website;
            setFormData({
              title: p.title || p.name || '',
              subtitle: p.subtitle || '',
              category: predefinedCategories.includes(p.category) ? p.category : 'Other (Custom)',
              customCategory: predefinedCategories.includes(p.category) ? '' : p.category,
              description: p.description || '',
              overview: p.overview || p.description || '',
              problem: p.problem || '',
              solution: p.solution || '',
              technologies: Array.isArray(p.technologies) ? p.technologies : [],
              features: Array.isArray(p.features) ? p.features : [],
              image_url: p.image_url || p.image || '',
              screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
              live_demo_url: p.live_demo_url || p.url || '',
              github_url: p.github_url || p.githubUrl || '',
              status: p.status || 'published',
              featured: Boolean(p.featured),
              sort_order: p.sort_order ?? 0
            });
          } else {
            setError(data?.error || 'Failed to load project details.');
          }
        } catch (err) {
          setError(err.message || 'Error fetching project.');
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [projectId, isEditing, authFetch]);

  // Available Categories dynamically loaded from backend
  const [availableCategories, setAvailableCategories] = useState([
    'Web Application',
    'E-Commerce',
    'AI & Machine Learning',
    'Education & LMS',
    'Portfolio & UI/UX',
    'Full-Stack & APIs',
    'Web Platforms'
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await parseApiResponse(res);
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const names = data.data.map((c) => c.name || c);
          setAvailableCategories(names);
        }
      } catch (err) {
        console.warn('Could not load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Load available project media library images
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await authFetch('/api/admin/media-library');
        const data = await parseApiResponse(res);
        if (data && data.success) {
          setMediaLibrary(data.data || []);
        }
      } catch (err) {
        console.warn('Could not load media library:', err);
      }
    };
    fetchMedia();
  }, [authFetch]);

  // Technology Tags Handlers (supports comma-separated e.g. React, JavaScript, CSS)
  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;

    const parts = trimmed.split(',').map((t) => t.trim()).filter(Boolean);
    const newTechs = parts.filter((t) => !formData.technologies.includes(t));

    if (newTechs.length > 0) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, ...newTechs]
      }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  // Feature Items Handlers
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !formData.features.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, trimmed]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Screenshot handler
  const handleAddScreenshot = () => {
    const trimmed = screenshotInput.trim();
    if (trimmed && !formData.screenshots.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, trimmed]
      }));
      setScreenshotInput('');
    }
  };

  const handleRemoveScreenshot = (index) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  // File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await authFetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });
      const data = await parseApiResponse(res);
      if (data && data.success && data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }));
        showToast('Image uploaded and set as project thumbnail.');
      } else {
        showToast(data?.error || 'Failed to upload image.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error uploading image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const title = formData.title.trim();
    if (!title) {
      setError('Website Name is required. Please enter a name for your website.');
      return;
    }

    let url = formData.live_demo_url.trim();
    if (!url) {
      setError('Website URL is required. Please enter a valid website URL (e.g. https://example.com).');
      return;
    }

    // Auto-prefix https:// if protocol is omitted
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('#')) {
      url = `https://${url}`;
    }

    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    if (!url.startsWith('#') && !urlPattern.test(url)) {
      setError('Please enter a valid website URL format (e.g. https://example.com or https://myproject.dev).');
      return;
    }

    const description = formData.description.trim();
    if (!description) {
      setError('Website Description is required. Please enter a description.');
      return;
    }

    const finalCategory =
      formData.category === 'Other (Custom)'
        ? formData.customCategory.trim() || 'Web Development'
        : formData.category;

    // Automatically incorporate any pending text in techInput (e.g. if user typed 'React, JavaScript, CSS')
    let finalTechs = [...formData.technologies];
    if (techInput.trim()) {
      const parts = techInput.trim().split(',').map((t) => t.trim()).filter(Boolean);
      parts.forEach((p) => {
        if (!finalTechs.includes(p)) finalTechs.push(p);
      });
    }

    const payload = {
      ...formData,
      title,
      name: title,
      live_demo_url: url,
      url,
      description,
      category: finalCategory,
      technologies: finalTechs,
      overview: formData.overview.trim() || description,
      image_url: formData.image_url.trim() || '/assets/projects/ai_web_platform.png'
    };

    setSubmitting(true);
    try {
      const apiUrl = isEditing
        ? `/api/admin/projects/${projectId}`
        : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await authFetch(apiUrl, {
        method,
        body: JSON.stringify(payload)
      });

      const data = await parseApiResponse(res);

      if (data && data.success) {
        showToast(
          isEditing
            ? `Website '${title}' updated successfully!`
            : `Website '${title}' added successfully!`
        );
        navigate('/admin/websites');
      } else {
        setError(data?.error || 'Failed to save website.');
      }
    } catch (err) {
      setError(err.message || 'Error saving website.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading-state" style={{ minHeight: '350px' }}>
          <div className="admin-spinner"></div>
          <span>Loading project data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin/websites" className="btn-icon" title="Back to Websites">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <span className="admin-section-tag">
              {isEditing ? 'Website Editor' : 'Website Manager'}
            </span>
            <h1 className="admin-page-title">
              {isEditing ? `Edit Website: ${formData.title || 'Website'}` : 'Add New Website'}
            </h1>
            <p className="admin-page-subtitle">
              {isEditing
                ? 'Update your website details, URL, technologies and publication status.'
                : 'Add a new website you created to your portfolio. It will appear live once published.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="admin-spinner"></span>
              Saving...
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} />
              <span>{isEditing ? 'UPDATE WEBSITE' : 'SAVE WEBSITE'}</span>
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Layout: Form Fields & Live Card Preview */}
      <div className="admin-form-grid">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSubmit} className="admin-form-main">
          {/* Card 1: Core Website Details */}
          <div className="admin-card admin-form-card">
            <h2 className="admin-card-title">Website Details</h2>

            {/* Website Name */}
            <div className="admin-form-group">
              <label htmlFor="title" className="admin-label">
                Website Name <span className="admin-required">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Digital Library, Electrotech Store, Supercar Website..."
                className="admin-input"
                required
              />
            </div>

            {/* Website URL */}
            <div className="admin-form-group">
              <label htmlFor="live_demo_url" className="admin-label">
                Website URL <span className="admin-required">*</span>
                <span className="admin-label-hint">Opened when visitors click "View Website"</span>
              </label>
              <div className="admin-input-wrapper">
                <ExternalLink size={16} className="admin-input-icon" />
                <input
                  id="live_demo_url"
                  type="text"
                  value={formData.live_demo_url}
                  onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                  placeholder="https://example.com"
                  className="admin-input"
                  required
                />
              </div>
            </div>

            {/* Category & Custom Category */}
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="category" className="admin-label">
                  Website Category <span className="admin-required">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="admin-select"
                  style={{ width: '100%' }}
                >
                  {availableCategories.map((catName) => (
                    <option key={catName} value={catName}>
                      {catName}
                    </option>
                  ))}
                  <option value="Other (Custom)">Other (Custom)</option>
                </select>
              </div>

              {formData.category === 'Other (Custom)' && (
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label htmlFor="customCategory" className="admin-label">
                    Custom Category Name
                  </label>
                  <input
                    id="customCategory"
                    type="text"
                    value={formData.customCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, customCategory: e.target.value })
                    }
                    placeholder="Enter custom category"
                    className="admin-input"
                  />
                </div>
              )}
            </div>

            {/* Website Description */}
            <div className="admin-form-group">
              <label htmlFor="description" className="admin-label">
                Website Description <span className="admin-required">*</span>
                <span className="admin-label-hint">Shown on the public website card</span>
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A modern digital library website with catalog search, borrow/return workflows..."
                className="admin-textarea"
                required
              />
            </div>

            {/* Subtitle / Tagline */}
            <div className="admin-form-group">
              <label htmlFor="subtitle" className="admin-label">
                Subtitle / Short Tagline (Optional)
              </label>
              <input
                id="subtitle"
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Modern Full-Stack Digital Experience"
                className="admin-input"
              />
            </div>

            {/* Detailed Description / Overview */}
            <div className="admin-form-group">
              <label htmlFor="overview" className="admin-label">
                Detailed Overview
                <span className="admin-label-hint">Shown in the detailed modal/page</span>
              </label>
              <textarea
                id="overview"
                rows={4}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                placeholder="Detailed project context, business objectives, architecture, and deployment..."
                className="admin-textarea"
              />
            </div>

            {/* Problem & Solution */}
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="problem" className="admin-label">
                  The Challenge / Problem
                </label>
                <textarea
                  id="problem"
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="What friction or problem was being addressed?"
                  className="admin-textarea"
                />
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="solution" className="admin-label">
                  The Solution Architecture
                </label>
                <textarea
                  id="solution"
                  rows={3}
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How did your code and design solve it?"
                  className="admin-textarea"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Technologies & Key Features */}
          <div className="admin-card admin-form-card">
            <h2 className="admin-card-title">Tech Stack &amp; Key Features</h2>

            {/* Tech Stack Input */}
            <div className="admin-form-group">
              <label className="admin-label">
                Technologies / Tech Stack
                <span className="admin-label-hint">Type a tech name and press Enter or click Add</span>
              </label>
              <div className="admin-tag-input-row">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. Next.js, Flask, PostgreSQL, OpenAI..."
                  className="admin-input"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="btn btn-secondary"
                >
                  <Plus size={16} />
                  <span>Add Tech</span>
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="admin-tag-cloud">
                {formData.technologies.map((tech, idx) => (
                  <span key={idx} className="admin-tag-item">
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(idx)}
                      className="admin-tag-remove"
                      aria-label={`Remove ${tech}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features List */}
            <div className="admin-form-group" style={{ marginTop: '20px' }}>
              <label className="admin-label">
                Key Architectural Highlights / Features
                <span className="admin-label-hint">Bullet items showcased in detail modal</span>
              </label>
              <div className="admin-tag-input-row">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Automated Borrow / Return tracking system..."
                  className="admin-input"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="btn btn-secondary"
                >
                  <Plus size={16} />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="admin-features-list-editor">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="admin-feature-editor-item">
                    <CheckCircle size={15} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="admin-feature-remove-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Media & Images */}
          <div className="admin-card admin-form-card">
            <h2 className="admin-card-title">Website Image &amp; Media</h2>

            {/* Main Thumbnail */}
            <div className="admin-form-group">
              <label htmlFor="image_url" className="admin-label">
                Website Image / Thumbnail
                <span className="admin-label-hint">Upload an image file, enter URL, or select from gallery</span>
              </label>
              <div className="admin-tag-input-row">
                <input
                  id="image_url"
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="/assets/projects/my_website.png or https://..."
                  className="admin-input"
                />
                <label className="btn btn-secondary admin-upload-label">
                  <Upload size={16} />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingImage}
                  />
                </label>
                {mediaLibrary.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(true)}
                    className="btn btn-secondary"
                    title="Choose from existing images"
                  >
                    <ImageIcon size={16} />
                    <span>Browse Gallery</span>
                  </button>
                )}
              </div>
            </div>

            {/* Additional Screenshots */}
            <div className="admin-form-group" style={{ marginTop: '20px' }}>
              <label className="admin-label">
                Multiple Screenshots / Gallery Images
              </label>
              <div className="admin-tag-input-row">
                <input
                  type="text"
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddScreenshot();
                    }
                  }}
                  placeholder="Enter additional screenshot URL..."
                  className="admin-input"
                />
                <button
                  type="button"
                  onClick={handleAddScreenshot}
                  className="btn btn-secondary"
                >
                  <Plus size={16} />
                  <span>Add Image</span>
                </button>
              </div>

              {formData.screenshots.length > 0 && (
                <div className="admin-screenshots-gallery-preview">
                  {formData.screenshots.map((img, idx) => (
                    <div key={idx} className="admin-screenshot-thumb-wrapper">
                      <img src={img} alt={`Screenshot ${idx + 1}`} />
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="admin-screenshot-remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Links, Visibility & Priority */}
          <div className="admin-card admin-form-card">
            <h2 className="admin-card-title">URLs, Visibility &amp; Order</h2>

            <div className="admin-form-row">
              {/* Live Demo URL */}
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="live_demo_url" className="admin-label">
                  Live Website URL
                </label>
                <div className="admin-input-wrapper">
                  <ExternalLink size={16} className="admin-input-icon" />
                  <input
                    id="live_demo_url"
                    type="text"
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                    placeholder="https://example.com or #demo-slug"
                    className="admin-input"
                  />
                </div>
              </div>

              {/* GitHub URL */}
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="github_url" className="admin-label">
                  GitHub Repository URL
                </label>
                <div className="admin-input-wrapper">
                  <Github size={16} className="admin-input-icon" />
                  <input
                    id="github_url"
                    type="text"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/ibrahimtanveer/..."
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-row" style={{ marginTop: '10px' }}>
              {/* Status Radio Pills: Published vs Draft */}
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label className="admin-label">
                  Publication Status <span className="admin-required">*</span>
                </label>
                <div className="admin-status-picker">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'published' })}
                    className={`admin-status-option ${
                      formData.status === 'published' ? 'selected-published' : ''
                    }`}
                  >
                    <CheckCircle size={16} />
                    <span>Published</span>
                    <small>Visible publicly</small>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                    className={`admin-status-option ${
                      formData.status === 'draft' ? 'selected-draft' : ''
                    }`}
                  >
                    <Eye size={16} />
                    <span>Draft</span>
                    <small>Hidden from public</small>
                  </button>
                </div>
              </div>

              {/* Featured Toggle & Sort Order */}
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label className="admin-label">Project Priority &amp; Highlighting</label>

                {/* Featured Checkbox */}
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="admin-checkbox"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={16} fill={formData.featured ? '#f59e0b' : 'none'} color="#f59e0b" />
                    <span>Mark as Featured Project</span>
                  </div>
                </label>

                {/* Sort Order */}
                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="sort_order" className="admin-label" style={{ fontSize: '0.82rem' }}>
                    Sort Order Priority (Lower numbers appear first)
                  </label>
                  <input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="admin-input"
                    style={{ maxWidth: '140px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="admin-form-bottom-actions">
            <Link to="/admin/websites" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Saving Website...' : isEditing ? 'UPDATE WEBSITE' : 'SAVE WEBSITE'}
            </button>
          </div>
        </form>

        {/* Right Column: Live Card Preview */}
        <div className="admin-form-preview-col">
          <div className="admin-sticky-preview">
            <div className="admin-preview-header">
              <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Public Card Live Preview</span>
            </div>

            <div className="project-card" style={{ maxWidth: '100%', margin: '0' }}>
              <div className="project-image-container">
                <img
                  src={formData.image_url || '/assets/projects/ai_web_platform.png'}
                  alt={formData.title || 'Preview Project'}
                  className="project-image"
                  onError={(e) => {
                    e.target.src = '/assets/projects/ai_web_platform.png';
                  }}
                />
                {formData.featured && (
                  <span className="project-badge-pill">Featured</span>
                )}
              </div>

              <div className="project-body">
                <div className="project-category-tag">
                  {formData.category === 'Other (Custom)'
                    ? formData.customCategory || 'Category'
                    : formData.category}
                </div>
                <h3 className="project-title">{formData.title || 'Your Project Title'}</h3>
                <p className="project-desc">
                  {formData.description || 'Project short description will appear here on your portfolio page...'}
                </p>

                {/* Key Features preview */}
                <ul className="project-features-list">
                  {formData.features &&
                    formData.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="project-feature-item">
                        <CheckCircle size={14} className="project-feature-icon" />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>

                {/* Tech Tags */}
                <div className="project-tech-tags">
                  {formData.technologies &&
                    formData.technologies.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="project-tech-tag">
                        {tech}
                      </span>
                    ))}
                  {formData.technologies && formData.technologies.length > 4 && (
                    <span className="project-tech-tag">
                      +{formData.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Card Actions */}
                <div className="project-card-actions">
                  <button type="button" className="btn btn-secondary btn-sm">
                    <span>View Details</span>
                  </button>
                  <a
                    href={formData.live_demo_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => !formData.live_demo_url && e.preventDefault()}
                  >
                    <span>View Project</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Visibility Callout */}
            <div
              className={`admin-visibility-indicator ${
                formData.status === 'published' ? 'vis-published' : 'vis-draft'
              }`}
            >
              {formData.status === 'published' ? (
                <>
                  <CheckCircle size={16} />
                  <span>
                    <strong>Status: Published.</strong> This project will be publicly visible to all visitors.
                  </span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span>
                    <strong>Status: Draft.</strong> This project is completely hidden from public visitors.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaModal && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowMediaModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-media-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-media-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} />
                <h3>Select Image from Asset Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-media-grid">
              {mediaLibrary.map((item, idx) => (
                <div
                  key={idx}
                  className={`admin-media-item ${
                    formData.image_url === item.url ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image_url: item.url }));
                    setShowMediaModal(false);
                  }}
                >
                  <img src={item.url} alt={item.name} />
                  <span className="admin-media-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
