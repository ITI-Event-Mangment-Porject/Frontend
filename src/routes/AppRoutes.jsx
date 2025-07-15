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
import Dashboard from '../pages/company/Dashboard';
import SetupForm from '../pages/company/SetupForm';
import ManageRequests from '../pages/company/ManageRequests';
import InterviewTracking from '../pages/company/InterviewTracking';
import CompanyProfile from '../pages/company/Profile';
import Layout from '../pages/company/common/Layout';

// Home Page
import HomePage from '../pages/homePage/HomePage';
import AllEvents from '../pages/Events/AllEvents';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageEvents from '../pages/admin/ManageEvents';
import Notifications from '../pages/admin/Notifications';
import LiveQueue from '../pages/admin/LiveInterviewQueue';
import JobFairSetup from '../pages/admin/JobFairSetup';
import FeedbackFormsCreaton from '../pages/admin/FeedbackFormsCreaton';
import BrandingDaySetup from '../pages/admin/BrandingDaySetup';
import LiveMonitor from '../pages/admin/LiveMonitor';
import AlFeedbackAnalyics from '../pages/admin/FeedbackAnalytics';
import EventsDetails from "../pages/admin/EventsDetails";

// System Pages
import NotFoundPage from '../pages/System/NotFoundPage';
import AboutUs from '../pages/System/AboutUs';
import ContactUs from '../pages/System/ContactUs';
import Unauthorized from '../pages/System/Unauthorized';
import SignUpRedirect from '../pages/System/SignUpRedirect';

// Protected Route Component
import ProtectedRoute from '../components/ProtectedRoute';
import AttendanceCheckin from '../pages/staff/AttendanceCheckin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<AllEvents />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contect-us" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUpRedirect />} />
      <Route path="/support" element={<Help />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute requiredRole="admin">
            <CompaniesSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute requiredRole="admin">
            <AttendanceReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobfair"
        element={
          <ProtectedRoute requiredRole="admin">
            <JobFairSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/brandingDay"
        element={
          <ProtectedRoute requiredRole="admin">
            <BrandingDaySetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageEvents />
           </ProtectedRoute> 
        }
      />
      {/* New Admin Event Details Route */}
      <Route
        path="/admin/events/:id"
        element={
          // <ProtectedRoute requiredRole="admin">
            <EventsDetails />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute requiredRole="admin">
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/liveevents"
        element={
          <ProtectedRoute requiredRole="admin">
            <LiveMonitor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/FeedbackAnalytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <AlFeedbackAnalyics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/LiveQueue"
        element={
          <ProtectedRoute requiredRole="admin">
            <LiveQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/createFeedbackForm"
        element={
          <ProtectedRoute requiredRole="admin">
            <FeedbackFormsCreaton />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/qrAttendance"
        element={
          <ProtectedRoute requiredRole="admin">
            <AttendanceCheckin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />

      {/* Student Routes - Protected */}
      <Route
        path="/student/feedback/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <FeedbackForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/event-details/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <EventDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/show-events"
        element={
          <ProtectedRoute requiredRole="student">
            <ShowEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/CompanyDirectory"
        element={
          <ProtectedRoute requiredRole="student">
            <CompanyDirectory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/interview-queue"
        element={
          <ProtectedRoute requiredRole="student">
            <InterviewQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="student">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Company Routes - Protected */}
      <Route
        path="/company/:companyId"
        element={
          <ProtectedRoute requiredRole="company_representative">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="job-fairs/:jobFairId/setup" element={<SetupForm />} />
        <Route
          path="job-fairs/:jobFairId/requests"
          element={<ManageRequests />}
        />
        <Route path="tracking" element={<InterviewTracking />} />
        <Route path="profile" element={<CompanyProfile />} />
      </Route>

      {/* Catch all route - 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
