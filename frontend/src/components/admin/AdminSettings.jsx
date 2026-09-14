import React, { useState } from 'react';
import { Shield, User, Mail, Lock, Key, Save, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAdminToast } from './AdminLayout';
import { parseApiResponse } from '../../utils/apiHelper';

export default function AdminSettings() {
  const { admin, authFetch, updateCurrentAdmin } = useAdmin();
  const { showToast } = useAdminToast();

  // Profile fields
  const [username, setUsername] = useState(admin?.username || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [fullName, setFullName] = useState(admin?.full_name || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword) {
      if (!currentPassword) {
        setError('Current password is required to change password.');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        full_name: fullName.trim(),
        current_password: currentPassword,
        new_password: newPassword
      };

      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      const data = await parseApiResponse(res);

      if (data && data.success) {
        updateCurrentAdmin(data.admin, data.token);
        showToast('Admin profile and security settings updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data?.error || 'Failed to update admin settings.');
      }
    } catch (err) {
      setError(err.message || 'Error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-section-tag">Security &amp; Account</span>
          <h1 className="admin-page-title">Admin Settings</h1>
          <p className="admin-page-subtitle">
            Manage your administrative credentials, email notifications, and dashboard security.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="admin-settings-layout">
        {/* Settings Form */}
        <form onSubmit={handleUpdateProfile} className="admin-settings-form">
          {/* Profile Card */}
          <div className="admin-card admin-form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <User size={18} style={{ color: 'var(--accent-primary)' }} />
              <h2 className="admin-card-title">Profile Information</h2>
            </div>

            <div className="admin-form-group">
              <label htmlFor="fullName" className="admin-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ibrahim Tanveer"
                className="admin-input"
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="username" className="admin-label">
                  Username <span className="admin-required">*</span>
                </label>
                <div className="admin-input-wrapper">
                  <User size={16} className="admin-input-icon" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="email" className="admin-label">
                  Email Address <span className="admin-required">*</span>
                </label>
                <div className="admin-input-wrapper">
                  <Mail size={16} className="admin-input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password Card */}
          <div className="admin-card admin-form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Key size={18} style={{ color: 'var(--accent-emerald)' }} />
              <h2 className="admin-card-title">Change Password</h2>
            </div>
            <p className="admin-text-muted" style={{ marginBottom: '20px', fontSize: '0.88rem' }}>
              Leave blank if you do not wish to change your password.
            </p>

            <div className="admin-form-group">
              <label htmlFor="currentPassword" className="admin-label">
                Current Password
              </label>
              <div className="admin-input-wrapper">
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to verify"
                  className="admin-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-input-action"
                  aria-label="Toggle password view"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="newPassword" className="admin-label">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="admin-input"
                  autoComplete="new-password"
                />
              </div>

              <div className="admin-form-group" style={{ flex: 1 }}>
                <label htmlFor="confirmPassword" className="admin-label">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="admin-input"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="admin-form-bottom-actions">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span className="admin-spinner"></span>
                  Updating...
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} />
                  <span>Save Account Settings</span>
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Security Overview Info Card */}
        <div className="admin-settings-sidebar">
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Shield size={20} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="admin-card-title">Security Status</h3>
            </div>

            <ul className="admin-security-checklist">
              <li>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <span>Password hashing via PBKDF2/SHA256 active</span>
              </li>
              <li>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <span>JWT cryptographic bearer tokens enabled</span>
              </li>
              <li>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <span>All admin API endpoints require valid authorization</span>
              </li>
              <li>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <span>Public site excludes all admin routes &amp; mentions</span>
              </li>
            </ul>

            <div className="admin-default-creds-box">
              <span className="admin-creds-title">Initial Setup Credentials</span>
              <p>Username: <code>admin</code></p>
              <p>Email: <code>admin@ibrahimtanveer.dev</code></p>
              <small>You can change both your username and password above anytime.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
