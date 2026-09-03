import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProjectModal from './components/ProjectModal';
import Services from './components/Services';
import Process from './components/Process';
import WhyMe from './components/WhyMe';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Dynamic Project Details Page
import ProjectDetailsPage from './components/ProjectDetailsPage';

// Admin System
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProjectsList from './components/admin/AdminProjectsList';
import AdminProjectForm from './components/admin/AdminProjectForm';
import AdminCategories from './components/admin/AdminCategories';
import AdminSettings from './components/admin/AdminSettings';

/**
 * Public Portfolio Homepage
 * Zero admin links, completely clean and professional
 */
function PublicPortfolio({ theme, toggleTheme }) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="app-container">
      {/* Sticky Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects onSelectProject={(project) => setSelectedProject(project)} />
        <Services />
        <Process />
        <WhyMe />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Detailed Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

/**
 * Protected Admin Route Area
 * If a user is not logged in and tries to open /admin/dashboard or other admin routes,
 * redirect them to /admin.
 */
function ProtectedAdminArea({ theme, toggleTheme }) {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-loading-state" style={{ minHeight: '300px' }}>
          <div className="admin-spinner"></div>
          <span>Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout theme={theme} toggleTheme={toggleTheme}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Reusable Website Management */}
        <Route path="websites" element={<AdminProjectsList />} />
        <Route path="websites/add" element={<AdminProjectForm />} />
        <Route path="websites/edit/:projectId" element={<AdminProjectForm />} />

        {/* Backwards-compatible Project aliases */}
        <Route path="projects" element={<AdminProjectsList />} />
        <Route path="projects/add" element={<AdminProjectForm />} />
        <Route path="projects/new" element={<AdminProjectForm />} />
        <Route path="projects/edit/:projectId" element={<AdminProjectForm />} />

        <Route path="categories" element={<AdminCategories />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}

/**
 * Admin Login Route
 * Shows Admin Login page when visiting /admin.
 * If already logged in, redirects directly to /admin/dashboard.
 */
function AdminLoginRoute() {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-loading-state" style={{ minHeight: '300px' }}>
          <div className="admin-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLogin />;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ibrahim_portfolio_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ibrahim_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio (Default /) */}
          <Route
            path="/"
            element={<PublicPortfolio theme={theme} toggleTheme={toggleTheme} />}
          />

          {/* Dynamic Standalone Project Details Page */}
          <Route
            path="/projects/:projectId"
            element={<ProjectDetailsPage theme={theme} toggleTheme={toggleTheme} />}
          />

          {/* Admin Login Route (ONLY /admin) */}
          <Route path="/admin" element={<AdminLoginRoute />} />

          {/* Protected Admin Routes (e.g. /admin/dashboard, /admin/projects, /admin/projects/add) */}
          <Route
            path="/admin/*"
            element={<ProtectedAdminArea theme={theme} toggleTheme={toggleTheme} />}
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
