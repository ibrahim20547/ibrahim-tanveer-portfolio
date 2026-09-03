import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your admin username or email and password.');
      return;
    }

    setLoading(true);
    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* Discrete back link to homepage */}
        <Link to="/" className="admin-login-back">
          <ArrowLeft size={16} />
          <span>Return to website</span>
        </Link>

        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-brand-icon">
              <ShieldCheck size={28} />
            </div>
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-desc">
              Sign in to manage projects, visibility, and portfolio content.
            </p>
          </div>

          {error && (
            <div className="admin-alert admin-alert-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label htmlFor="admin-identifier" className="admin-label">
                Username or Email
              </label>
              <div className="admin-input-wrapper">
                <User size={18} className="admin-input-icon" />
                <input
                  id="admin-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin or admin@ibrahimtanveer.dev"
                  className="admin-input"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password" className="admin-label">
                Password
              </label>
              <div className="admin-input-wrapper">
                <Lock size={18} className="admin-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  className="admin-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-input-action"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary admin-btn-block"
              style={{ marginTop: '16px' }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span className="admin-spinner"></span>
                  Authenticating...
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} />
                  Sign In to Dashboard
                </span>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Protected area &bull; Authorized portfolio administrator only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
