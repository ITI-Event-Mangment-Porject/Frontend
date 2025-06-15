import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from '../pages/admin/UserManagement';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}

      {/* Admin routes */}
      <Route path="/admin">
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
