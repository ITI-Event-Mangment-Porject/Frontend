import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (token && storedUser && storedRole) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(storedRole);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = e => {
      if (['token', 'user', 'role'].includes(e.key)) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData, userRole, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
    setUser(userData);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const hasRole = requiredRole => {
    return role === requiredRole;
  };

  const hasAnyRole = requiredRoles => {
    return requiredRoles.includes(role);
  };

  return {
    user,
    role,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
};

export default useAuth;
