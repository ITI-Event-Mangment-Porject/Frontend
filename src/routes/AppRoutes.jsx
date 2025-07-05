"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.jsx"
import ProtectedRoute from "../components/common/ProtectedRoute"

// Import your existing components
import Login from "../pages/student/Login"
import Dashboard from "../pages/admin/Dashboard"
import ShowEvents from "../pages/student/ShowEvents"
import NotFoundPage from "../pages/System/NotFoundPage"

// Import other pages as needed
import UserManagement from "../pages/admin/UserManagement"
import ManageEvents from "../pages/admin/ManageEvents"
import JobFairSetup from "../pages/admin/JobFairSetup"
import Notifications from "../pages/admin/Notifications"
import AttendanceReports from "../pages/admin/AttendanceReports"
import CreateNotification from "../pages/admin/CreateNotification"

// Student pages
import EventDetails from "../pages/student/EventDetails"
import CompanyDirectory from "../pages/student/CompanyDirectory"
import InterviewQueue from "../pages/student/InterviewQueue"
import Profile from "../pages/student/Profile"
import FeedbackForm from "../pages/student/FeedbackForm"

const AppRoutes = () => {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getRoleBasedRedirect(role)} replace /> : <Login />}
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to={getRoleBasedRedirect(role)} replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-events"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/job-fair-setup"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <JobFairSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-notification"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateNotification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance-reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AttendanceReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/live-monitor"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LiveMonitor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/queue-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <QueueManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback-analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <FeedbackAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/show-events"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ShowEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-details/:id"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <EventDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-directory"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CompanyDirectory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-queue"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <InterviewQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <FeedbackForm />
          </ProtectedRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/setup"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <SetupForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/interview-tracking"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <InterviewTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/manage-requests"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <ManageRequests />
          </ProtectedRoute>
        }
      />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

// Helper function to get role-based redirect
const getRoleBasedRedirect = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "student":
      return "/show-events"
    case "company":
      return "/company/dashboard"
    case "staff":
      return "/staff/dashboard"
    default:
      return "/login"
  }
}

export default AppRoutes
