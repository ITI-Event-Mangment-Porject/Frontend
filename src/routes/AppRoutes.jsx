import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from '../pages/admin/UserManagement';
import JobFairSetup from '../pages/admin/JobFairSetup';
import AttendanceReports from '../pages/admin/AttendanceReports';
import Help from '../components/common/Help';
import FeedbackForm from '../pages/student/FeedbackForm';
import EventDetails from '../pages/student/EventDetails';
import CompanyDirectory from '../pages/student/CompanyDirectory';
import InterviewQueue from '../pages/student/InterviewQueue';
import Profile from '../pages/student/Profile';
import Login from '../pages/student/Login';
import ShowEvents from '../pages/student/ShowEvents';


// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageEvents from '../pages/admin/ManageEvents';
import Notifications from '../pages/admin/Notifications';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin routes - using absolute paths */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/companies" element={<JobFairSetup />} />
      <Route path='/admin/attendance' element={<AttendanceReports/>}/>
      {/* Default redirect to admin dashboard */}

      <Route path="/admin/events" element={<ManageEvents />} />
      <Route path="/admin/notifications" element={<Notifications />} />
     

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/support" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route path="/event-details/:id" element={<EventDetails />} />
      <Route path="/show-events" element={<ShowEvents />} />{' '}
      <Route path="/company-directory" element={<CompanyDirectory />} />
      <Route path="/interview-queue" element={<InterviewQueue />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
