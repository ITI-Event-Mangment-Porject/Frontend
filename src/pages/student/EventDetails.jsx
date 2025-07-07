import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const showMessage = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [eventRes, statusRes, sessionsRes] = await Promise.all([
        apiCall(`${API_BASE_URL}/api/events/${id}`),
        apiCall(`${API_BASE_URL}/api/events/${id}/registration-status`).catch(() => null),
        apiCall(`${API_BASE_URL}/api/events/${id}/sessions`)
      ]);

      if (!eventRes.ok) throw new Error('Event not found');
      
      const eventData = await eventRes.json();
      setEvent(eventData?.data?.result);

      if (statusRes?.ok) {
        const statusData = await statusRes.json();
        setIsRegistered(statusData?.isRegistered || false);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.data?.result || []);
      }
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
      setSessionsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerLoading || isRegistered) return;
    
    setRegisterLoading(true);
    try {
      const res = await apiCall(`${API_BASE_URL}/api/events/${id}/register`, { method: 'POST' });
      
      if (res.status === 409) {
        setIsRegistered(true);
        showMessage('Already registered');
        return;
      }
      
      if (!res.ok) throw new Error('Registration failed');
      
      setIsRegistered(true);
      showMessage('Registration successful!');
    } catch (err) {
      // Check if it's actually an already registered case that wasn't caught
      try {
        const statusRes = await apiCall(`${API_BASE_URL}/api/events/${id}/registration-status`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData?.isRegistered) {
            setIsRegistered(true);
            showMessage('Already registered');
            return;
          }
        }
      } catch (statusErr) {
        // Ignore status check error
      }
      
      showMessage('Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleFeedback = async () => {
    setFeedbackLoading(true);
    try {
      // First, check if feedback form exists
      const res = await apiCall(`${API_BASE_URL}/api/feedback/events/${id}/forms`);
      
      if (!res.ok) {
        // If the API returns 404 or other error, show a message
        if (res.status === 404) {
          showMessage('Feedback form not available yet');
        } else {
          showMessage('Failed to load feedback form');
        }
        return;
      }
      
      const data = await res.json();
      console.log('Feedback API Response:', data); // Debug log
      
      navigate(`/student/feedback/${id}`);
      
    } catch (err) {
      console.error('Feedback error:', err);
      showMessage('Failed to load feedback form');
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-xl">Loading event details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-xl text-red-600 mb-4">{error || 'Event not found'}</div>
            <button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 w-full px-2 sm:px-8 py-8 with-sidebar mt-24">
          {showPopup && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div className={`px-6 py-4 rounded-xl shadow-lg text-lg font-semibold border ${
                popupMessage.includes('successful') ? 'bg-green-600 text-white' : 
                popupMessage.includes('Already') ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {popupMessage}
              </div>
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-10">
            <img
              src={event.banner_image || 'https://via.placeholder.com/1200x600?text=No+Image'}
              alt={event.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">{event.title}</h1>
              <span className="inline-block bg-white/90 text-gray-800 px-4 py-2 rounded-full text-base font-semibold mb-2">
                {event.type}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <div className="flex flex-col gap-3 mb-6">
              <div className="text-gray-700 text-lg">Duration: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</div>
              <div className="text-gray-700 text-lg">Time: {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}</div>
              {event.type?.toLowerCase() === 'job fair' && (
                <div className="text-gray-700 text-lg">Location: {event.location}</div>
              )}
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <button
                className={`px-6 py-3 rounded-lg font-semibold text-base shadow transition ${
                  event.status === 'completed' ? 'bg-gray-500 text-white cursor-not-allowed' :
                  isRegistered ? 'bg-green-500 text-white cursor-not-allowed' :
                  registerLoading ? 'bg-gray-500 text-white cursor-not-allowed' :
                  'bg-red-900 hover:bg-red-800 text-white'
                }`}
                onClick={handleRegister}
                disabled={isRegistered || registerLoading || event.status === 'completed'}
              >
                {registerLoading ? 'Registering...' : isRegistered ? 'Registered ✓' : 'Register'}
              </button>
              
              {event.status === 'completed' && (
                <button
                  className="px-6 py-3 rounded-lg font-semibold text-base shadow bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  onClick={handleFeedback}
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? 'Loading...' : 'Submit Feedback'}
                </button>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Slido Section - Link Only */}
            {(event.slido_link || event.slido_embed_url) && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">💬 Ask Questions Live</h3>
                <p className="text-blue-700 mb-4">Join the conversation and ask your questions during the event!</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {event.slido_link && (
                    <a
                      href={event.slido_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      🔗 Open Slido
                    </a>
                  )}
                  
                  {event.slido_embed_url && !event.slido_link && (
                    <a
                      href={event.slido_embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      🔗 Open Slido
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {!event.slido_link && !event.slido_embed_url && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">💬 Ask Questions Live</h3>
                <p className="text-blue-700 mb-4">Join the conversation and ask your questions during the event!</p>
                <div className="text-blue-600 font-medium">
                  📋 Slido will be available before the event starts
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">Agenda</h2>
            {sessionsLoading ? (
              <div className="text-center text-orange-600">Loading agenda...</div>
            ) : sortedSessions.length === 0 ? (
              <div className="text-center text-gray-500">No sessions available</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sortedSessions.map((session) => (
                  <div key={session.id} className={`rounded-lg border p-4 ${
                    session.is_break ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{session.is_break ? '☕' : '🎤'}</span>
                      <span className="font-semibold">{session.title}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      🕒 {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                      {event.type?.toLowerCase() === 'job fair' && session.location && (
                        <span className="ml-2">📍 {session.location}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Speaker: {session.speaker_name || 'TBA'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {event.registration_deadline && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-10">
              <span className="font-semibold text-yellow-700">Registration Deadline: </span>
              <span className="text-yellow-800">{new Date(event.registration_deadline).toLocaleString()}</span>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;