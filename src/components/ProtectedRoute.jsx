import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredRoles = null,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const { role, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--primary-500)]"></div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check for specific role requirement
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for any of the required roles
  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
