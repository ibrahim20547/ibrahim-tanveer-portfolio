import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  X,
  Save,
  Globe,
  Tag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAdminToast } from './AdminLayout';
import { parseApiResponse } from '../../utils/apiHelper';

export default function AdminCategories() {
  const { authFetch } = useAdmin();
  const { showToast } = useAdminToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirm Modal
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Default Categories Fallback
  const defaultCategories = [
    { id: 1, name: 'AI & Web Apps', description: 'Generative AI, conversational interfaces, and intelligent automation', project_count: 2 },
    { id: 2, name: 'Full-Stack & APIs', description: 'Backend-heavy platforms, REST APIs, and database-driven solutions', project_count: 2 },
    { id: 3, name: 'Web Platforms', description: 'Scalable multi-user platforms and web systems', project_count: 1 },
    { id: 4, name: 'Interactive & UI/UX', description: 'Personal portfolios, design showcases, and creative agency websites', project_count: 1 }
  ];

  // Fetch all categories
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/admin/categories');
      const data = await parseApiResponse(res);
      if (data && data.success && Array.isArray(data.data)) {
        setCategories(data.data);
        return;
      }
      setCategories(defaultCategories);
    } catch (err) {
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setFormError('');
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setFormError('');
    setModalOpen(true);
  };

  // Submit Add / Edit
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = catName.trim();
    if (!trimmedName) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        // Edit
        const res = await authFetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: trimmedName, description: catDesc.trim() })
        });
        const data = await parseApiResponse(res);
        if (data && data.success) {
          showToast(`Category '${trimmedName}' updated successfully.`);
          setModalOpen(false);
          loadCategories();
        } else {
          setFormError(data?.error || 'Failed to update category.');
        }
      } else {
        // Create
        const res = await authFetch('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify({ name: trimmedName, description: catDesc.trim() })
        });
        const data = await parseApiResponse(res);
        if (data && data.success) {
          showToast(`Category '${trimmedName}' created successfully.`);
          setModalOpen(false);
          loadCategories();
        } else {
          setFormError(data?.error || 'Failed to create category.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving category.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Category
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await parseApiResponse(res);
      if (data && data.success) {
        showToast(data.message || `Category '${categoryToDelete.name}' deleted.`);
        setCategoryToDelete(null);
        loadCategories();
      } else {
        showToast(data?.error || 'Failed to delete category.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting category.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-section-tag">Organization</span>
          <h1 className="admin-page-title">Categories Management</h1>
          <p className="admin-page-subtitle">
            Add, edit, or delete categories used to organize your websites and portfolio projects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>Add Category</span>
          </button>

          <Link to="/admin/websites/add" className="btn btn-secondary">
            <Globe size={18} />
            <span>+ Add New Website</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Content */}
      {loading ? (
        <div className="admin-loading-state" style={{ minHeight: '260px' }}>
          <div className="admin-spinner"></div>
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-card admin-empty-state">
          <Layers size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
          <h3>No categories created yet</h3>
          <p className="admin-text-muted">Create your first category to organize your websites.</p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
            <PlusCircle size={16} />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="admin-categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="admin-card admin-category-card">
              <div className="admin-category-card-header">
                <div className="admin-category-icon">
                  <Tag size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="admin-category-card-title">{cat.name}</h3>
                  <p className="admin-category-card-desc">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="admin-category-stats-row">
                <div className="admin-cat-stat">
                  <span className="admin-cat-stat-num">{cat.total_projects}</span>
                  <span className="admin-cat-stat-lbl">Websites</span>
                </div>
                <div className="admin-cat-stat">
                  <span className="admin-cat-stat-num text-emerald">{cat.published_projects}</span>
                  <span className="admin-cat-stat-lbl">Published</span>
                </div>
                <div className="admin-cat-stat">
                  <span className="admin-cat-stat-num text-amber">{cat.draft_projects}</span>
                  <span className="admin-cat-stat-lbl">Draft</span>
                </div>
              </div>

              <div className="admin-category-card-actions">
                <Link
                  to={`/admin/websites?category=${encodeURIComponent(cat.name)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <FolderKanban size={14} />
                  <span>View Websites</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(cat)}
                  className="btn-icon"
                  title="Edit category"
                  aria-label="Edit category"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setCategoryToDelete(cat)}
                  className="btn-icon btn-icon-danger"
                  title="Delete category"
                  aria-label="Delete category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-icon"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="admin-modal-body">
              {formError && (
                <div className="admin-alert admin-alert-error" style={{ marginBottom: '14px' }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="admin-form-group">
                <label className="admin-label">
                  Category Name <span className="admin-required">*</span>
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Web App, E-Commerce, AI, Education..."
                  className="admin-input"
                  autoFocus
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Brief description of what kinds of websites belong to this category..."
                  className="admin-textarea"
                />
              </div>

              <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span className="admin-spinner"></span>
                      Saving...
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Save size={16} />
                      <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setCategoryToDelete(null)}>
          <div className="admin-modal-card admin-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-icon-danger">
              <AlertCircle size={28} />
            </div>
            <h3>Delete Category</h3>
            <p>
              Are you sure you want to delete <strong>"{categoryToDelete.name}"</strong>?
              {categoryToDelete.total_projects > 0 && (
                <span>
                  {' '}The {categoryToDelete.total_projects} website(s) in this category will be safely reassigned to "Other".
                </span>
              )}
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
