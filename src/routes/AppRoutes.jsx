import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from '../pages/admin/UserManagement';
import CompaniesSetup from '../pages/admin/CompaniesSetup';
import AttendanceReports from '../pages/admin/AttendanceReports';
import Help from '../components/common/Help';
import FeedbackForm from '../pages/student/FeedbackForm';
import EventDetails from '../pages/student/EventDetails';
import CompanyDirectory from '../pages/student/CompanyDirectory'; // adjust the path if needed
import InterviewQueue from '../pages/student/InterviewQueue';
import Profile from '../pages/student/Profile';
import Login from '../pages/student/Login';
import ShowEvents from '../pages/student/ShowEvents';


// Company Pages
import Dashboard from "../pages/company/Dashboard";
import SetupForm from "../pages/company/SetupForm";
import ManageRequests from "../pages/company/ManageRequests";
import InterviewTracking from "../pages/company/InterviewTracking";
import CompanyProfile from "../pages/company/Profile";

// Home Page
import HomePage from '../pages/homePage/HomePage';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageEvents from '../pages/admin/ManageEvents';
import Notifications from '../pages/admin/Notifications';
import LiveEventMonitor from '../components/live-event/live-event-monitor';
import FeedbackAnalytics from '../pages/admin/FeedbackAnalytics';

// Not Found Page
import NotFoundPage from '../pages/System/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin routes - using absolute paths */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/companies" element={<CompaniesSetup />} />
      <Route path="/admin/attendance" element={<AttendanceReports />} />
      {/* Default redirect to admin dashboard */}
      <Route path="/admin/events" element={<ManageEvents />} />
      <Route path="/admin/notifications" element={<Notifications />} />
      <Route path="/admin/liveevents" element={<LiveEventMonitor />} />
      <Route path="/admin/FeedbackAnalytics" element={<FeedbackAnalytics />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      {/* Home route */}
      <Route path="/" element={<HomePage />} />
      {/* Catch all route - 404 Not Found Page */}
      <Route path="/support" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student/feedback/:id" element={<FeedbackForm />} />
      <Route path="/student/event-details/:id" element={<EventDetails />} />
      <Route path="/student/show-events" element={<ShowEvents />} />{' '}
      <Route path="/student/CompanyDirectory" element={<CompanyDirectory />} />
      <Route path="/student/interview-queue" element={<InterviewQueue />} />
      <Route path="/student/profile" element={<Profile />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Company routes - using relative paths */}
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="job-fairs/:jobFairId/setup" element={<SetupForm />} />
      <Route path="job-fairs/:jobFairId/requests" element={<ManageRequests />} />
      <Route path="tracking" element={<InterviewTracking />} />
      <Route path="profile" element={<CompanyProfile />} />
    </Routes>
  );
};

export default AppRoutes;
