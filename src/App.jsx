import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackForm from './pages/student/FeedbackForm';
import EventDetails from './pages/student/EventDetails';
import CompanyDirectory from './pages/student/CompanyDirectory';
import InterviewQueue from './pages/student/InterviewQueue';
import Profile from './pages/student/Profile';
import Login from './pages/student/Login';
import ShowEvents from './pages/student/ShowEvents';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/event-details/:id" element={<EventDetails />} />
        <Route path="/show-events" element={<ShowEvents />} />{' '}
        <Route path="/company-directory" element={<CompanyDirectory />} />
        <Route path="/interview-queue" element={<InterviewQueue />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
