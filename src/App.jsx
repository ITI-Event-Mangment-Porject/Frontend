import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/student/Dashboard';
import FeedbackForm from './pages/student/FeedbackForm';
import EventDetails from './pages/student/EventDetails';
import CompanyDirectory from './pages/student/CompanyDirectory';
import InterviewQueue from './pages/student/InterviewQueue';
import Profile from './pages/student/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/company-directory" element={<CompanyDirectory />} />
        <Route path="/interview-queue" element={<InterviewQueue />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
