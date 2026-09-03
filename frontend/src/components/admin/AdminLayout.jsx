import React, { useState, createContext, useContext } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

// Toast Notification Context
export const AdminToastContext = createContext({
  showToast: () => {}
});

export function useAdminToast() {
  return useContext(AdminToastContext);
}

export default function AdminLayout({ children, theme, toggleTheme }) {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/admin/projects/add', icon: PlusCircle, label: 'Add Project' },
    { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      <div className="admin-root">
        {/* Toast Notification Alert */}
        {toast && (
          <div className={`admin-toast-banner admin-toast-${toast.type}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="admin-toast-close"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Backdrop for Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="admin-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <Link to="/admin/dashboard" className="admin-sidebar-brand">
              <span className="admin-brand-badge">IT</span>
              <div className="admin-brand-text">
                <span className="admin-brand-name">Ibrahim Tanveer</span>
                <span className="admin-brand-tag">Admin Panel</span>
              </div>
            </Link>
            <button
              className="admin-mobile-close btn-icon"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              <Shield size={16} />
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">{admin?.full_name || 'Admin'}</div>
              <div className="admin-user-role">{admin?.email || 'admin@portfolio.dev'}</div>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            <NavLink
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            {/* Websites Management Group */}
            <div className="admin-nav-section-label" style={{ marginTop: '16px' }}>Websites</div>
            
            <NavLink
              to="/admin/websites"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive || window.location.pathname.startsWith('/admin/projects') && !window.location.pathname.includes('/add') ? 'active' : ''}`
              }
            >
              <FolderKanban size={18} />
              <span>All Websites</span>
            </NavLink>

            <NavLink
              to="/admin/websites/add"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive || window.location.pathname === '/admin/projects/add' ? 'active' : ''}`
              }
            >
              <PlusCircle size={18} />
              <span>+ Add New Website</span>
            </NavLink>

            {/* Other Management */}
            <div className="admin-nav-section-label" style={{ marginTop: '16px' }}>System</div>

            <NavLink
              to="/admin/categories"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <FolderTree size={18} />
              <span>Categories</span>
            </NavLink>

            <NavLink
              to="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="admin-sidebar-footer">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-item admin-live-link"
              title="Open public portfolio website in a new tab"
            >
              <ExternalLink size={17} />
              <span>View Public Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="admin-nav-item admin-logout-btn"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="admin-main-wrapper">
          {/* Top Bar */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                className="admin-mobile-toggle btn-icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
              <div className="admin-breadcrumbs">
                <span className="admin-breadcrumb-root">Admin</span>
                <span className="admin-breadcrumb-sep">/</span>
                <span className="admin-breadcrumb-current">Management Console</span>
              </div>
            </div>

            <div className="admin-topbar-right">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn-icon"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* View Public Website */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm admin-topbar-site-btn"
              >
                <span>Live Site</span>
                <ExternalLink size={14} />
              </a>

              {/* Quick Logout */}
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm admin-topbar-logout-btn"
                title="Sign out"
              >
                <LogOut size={15} />
                <span className="hide-on-mobile">Logout</span>
              </button>
            </div>
          </header>

          {/* Page Content Rendered Here */}
          <main className="admin-page-content">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </AdminToastContext.Provider>
  );
}
