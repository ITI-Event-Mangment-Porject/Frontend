import { Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";

// Company Pages
import Dashboard from "../pages/company/Dashboard";
import SetupForm from "../pages/company/SetupForm";
import ManageRequests from "../pages/company/ManageRequests";
import InterviewTracking from "../pages/company/InterviewTracking";
import Profile from "../pages/company/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/company/:companyId" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="job-fairs/:jobFairId/setup" element={<SetupForm />} />
        <Route path="requests" element={<ManageRequests />} />
        <Route path="tracking" element={<InterviewTracking />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
