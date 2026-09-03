import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext(null);

const TOKEN_KEY = 'it_portfolio_admin_token';
const ADMIN_KEY = 'it_portfolio_admin_data';

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  // Helper for authenticated API calls
  const authFetch = useCallback(async (url, options = {}) => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    const headers = {
      ...(options.headers || {}),
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    // Don't set Content-Type if it's FormData (browser sets boundary automatically)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      // Session expired or invalid
      logout();
      throw new Error('Your session has expired. Please log in again.');
    }

    return response;
  }, []);

  // Verify stored session on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.admin) {
            setAdmin(data.admin);
            localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Admin session verification notice:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed. Please check credentials.' };
      }

      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));

      return { success: true, admin: data.admin };
    } catch (err) {
      return { success: false, error: 'Network error. Please make sure backend server is running.' };
    }
  };

  const logout = () => {
    setToken('');
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  };

  const updateCurrentAdmin = (updatedAdmin, newToken) => {
    if (updatedAdmin) {
      setAdmin(updatedAdmin);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(updatedAdmin));
    }
    if (newToken) {
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
        authFetch,
        updateCurrentAdmin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
