import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from '../pages/admin/UserManagement';
import JobFairSetup from '../pages/admin/JobFairSetup';

// Admin Pages
// import AdminDashboard from '../pages/admin/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin routes - using absolute paths */}
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/job-fair" element={<JobFairSetup />} />
      {/* Default redirect to admin dashboard */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
     
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
