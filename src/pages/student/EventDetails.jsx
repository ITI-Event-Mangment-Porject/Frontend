import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';
import defaultEvent from '../../assets/images/Business-Event1.jpg';

const API_BASE_URL = 'http://127.0.0.1:8000';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // New states for cancellation modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    "I won't be able to attend",
    'Schedule conflict',
    'Personal emergency',
    'Changed my mind',
    'Found a better opportunity',
    'Other',
  ];

  const getUserId = () => {
    const userId = localStorage.getItem('userId');
    if (userId) return userId;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id || payload.id || payload.sub;
      } catch (err) {
        console.error('Token decode error:', err);
      }
    }
    return null;
  };

  const showMessage = msg => {
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
        apiCall(`${API_BASE_URL}/api/events/${id}/registration-status`).catch(
          () => null
        ),
        apiCall(`${API_BASE_URL}/api/events/${id}/sessions`),
      ]);

      if (!eventRes.ok) throw new Error('Event not found');
      const eventData = await eventRes.json();
      setEvent(eventData?.data?.result || null);

      if (statusRes?.ok) {
        const statusData = await statusRes.json();
        setIsRegistered(!!statusData?.isRegistered);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData?.data?.result || []);
      }
    } catch (err) {
      console.log(err);
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
      const res = await apiCall(`${API_BASE_URL}/api/events/${id}/register`, {
        method: 'POST',
      });
      if (res.status === 409) {
        setIsRegistered(true);
        showMessage('Already registered');
        return;
      }
      if (!res.ok) throw new Error();
      setIsRegistered(true);
      showMessage('Registration successful!');
    } catch {
      try {
        const statusRes = await apiCall(
          `${API_BASE_URL}/api/events/${id}/registration-status`
        );
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData?.isRegistered) {
            setIsRegistered(true);
            showMessage('Already registered');
            return;
          }
        }
      } catch {
        /* silent */
      }
      showMessage('You already registered for this event');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancellationReason('');
    setCustomReason('');
  };

  const handleCancelRegistration = async () => {
    const userId = getUserId();
    const token = localStorage.getItem('token');

    if (!userId || !token || cancelLoading || !isRegistered) {
      if (!userId) showMessage('User not found. Please login again.');
      if (!token)
        showMessage('Authentication token not found. Please login again.');
      return;
    }

    // Validate reason
    const finalReason =
      cancellationReason === 'Other' ? customReason : cancellationReason;
    if (!finalReason.trim()) {
      showMessage('Please provide a cancellation reason.');
      return;
    }

    setCancelLoading(true);
    try {
      const res = await apiCall(
        `${API_BASE_URL}/api/events/${id}/cancel-registration`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            cancellation_reason: finalReason.trim(),
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        // Handle specific error codes
        if (res.status === 401) {
          showMessage('Unauthorized. Please login again.');
          return;
        }
        if (res.status === 404) {
          showMessage('Registration not found.');
          return;
        }
        if (res.status === 422) {
          showMessage('Invalid request data. Please try again.');
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setIsRegistered(false);
      setShowCancelModal(false);
      showMessage('Registration cancelled successfully');
    } catch (error) {
      console.error('Cancel registration error:', error);
      showMessage('Failed to cancel registration. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const res = await apiCall(
        `${API_BASE_URL}/api/feedback/events/${id}/forms`
      );
      if (!res.ok) {
        showMessage(
          res.status === 404
            ? 'Feedback form not available yet'
            : 'Failed to load feedback form'
        );
        return;
      }
      navigate(`/student/feedback/${id}`);
    } catch {
      showMessage('Failed to load feedback form');
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const formatTime = time => (time ? time.slice(0, 5) : 'N/A');
  const sortedSessions = [...sessions].sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <Layout>
      {showPopup && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-lg font-semibold border ${
              popupMessage.includes('successful')
                ? 'bg-green-600 text-white'
                : popupMessage.includes('Already')
                  ? 'bg-blue-600 text-white'
                  : popupMessage.includes('cancelled')
                    ? 'bg-orange-600 text-white'
                    : 'bg-red-600 text-white'
            }`}
          >
            {popupMessage}
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cancel Registration
            </h3>
            <p className="text-gray-600 mb-6">
              Please tell us why you're cancelling your registration:
            </p>

            <div className="space-y-3 mb-6">
              {predefinedReasons.map(reason => (
                <label
                  key={reason}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={cancellationReason === reason}
                    onChange={e => setCancellationReason(e.target.value)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            {cancellationReason === 'Other' && (
              <div className="mb-6">
                <textarea
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows="3"
                  maxLength="200"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {customReason.length}/200 characters
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Keep Registration
              </button>
              <button
                onClick={handleCancelRegistration}
                disabled={
                  cancelLoading ||
                  !cancellationReason ||
                  (cancellationReason === 'Other' && !customReason.trim())
                }
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <span className="text-xl">Loading event details...</span>
        </div>
      ) : error || !event ? (
        <div className="text-center mt-20">
          <p className="text-red-600 text-xl mb-4">
            {error || 'Event not found'}
          </p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Event Image Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-10">
            <img
              src={
                event.banner_image?.trim() ? event.banner_image : defaultEvent
              }
              onError={e => (e.target.src = defaultEvent)}
              alt={event.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
                {event.title}
              </h1>
              <span className="inline-block bg-white/90 text-gray-800 px-4 py-2 rounded-full text-base font-semibold mb-2">
                {event.type}
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <div className="text-gray-700 text-lg mb-4">
              Duration: {new Date(event.start_date).toLocaleDateString()} -{' '}
              {new Date(event.end_date).toLocaleDateString()}
            </div>
            <div className="text-gray-700 text-lg mb-4">
              Time: {formatTime(event.start_time)} -{' '}
              {formatTime(event.end_time)}
            </div>
            {event.type?.toLowerCase() === 'job fair' && (
              <div className="text-gray-700 text-lg mb-4">
                Location: {event.location}
              </div>
            )}

            <div className="flex gap-4 mt-6 justify-end flex-wrap">
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  disabled={registerLoading}
                  className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                    registerLoading
                      ? 'bg-gray-500'
                      : 'bg-red-900 hover:bg-red-800'
                  }`}
                >
                  {registerLoading ? 'Registering...' : 'Apply'}
                </button>
              ) : (
                <>
                  <button
                    disabled
                    className="px-6 py-3 rounded-lg font-semibold text-white bg-green-500"
                  >
                    Applied ✓
                  </button>
                  <button
                    onClick={handleCancelClick}
                    disabled={cancelLoading}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                      cancelLoading
                        ? 'bg-gray-500'
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    Cancel Registration
                  </button>
                </>
              )}
              {event.status === 'completed' && (
                <button
                  onClick={handleFeedback}
                  disabled={feedbackLoading}
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {feedbackLoading ? 'Loading...' : 'Submit Feedback'}
                </button>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description || 'No description available.'}
              </p>
            </div>

            {/* Slido Section */}
            {event.slido_link || event.slido_embed_url ? (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  💬 Ask Questions Live
                </h3>
                <p className="text-blue-700 mb-4">
                  Join the conversation and ask your questions during the event!
                </p>
                <a
                  href={event.slido_link || event.slido_embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  🔗 Open Slido
                </a>
              </div>
            ) : (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  💬 Ask Questions Live
                </h3>
                <p className="text-blue-700 mb-4">
                  Join the conversation and ask your questions during the event!
                </p>
                <div className="text-blue-600 font-medium">
                  📋 Slido will be available before the event starts
                </div>
              </div>
            )}
          </div>

          {/* Agenda Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">
              Agenda
            </h2>
            {sessionsLoading ? (
              <div className="text-center text-orange-600">
                Loading agenda...
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className="text-center text-gray-500">
                No sessions available
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sortedSessions.map(session => (
                  <div
                    key={session.id}
                    className={`rounded-lg border p-4 ${
                      session.is_break
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {session.is_break ? '☕' : '🎤'}
                      </span>
                      <span className="font-semibold">{session.title}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      🕒 {formatTime(session.start_time)} -{' '}
                      {formatTime(session.end_time)}
                      {event.type?.toLowerCase() === 'job fair' &&
                        session.location && (
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
              <span className="font-semibold text-yellow-700">
                Registration Deadline:{' '}
              </span>
              <span className="text-yellow-800">
                {new Date(event.registration_deadline).toLocaleString()}
              </span>
            </div>
          )}
        </>
      )}

      <Footer />
    </Layout>
  );
};

export default EventDetails;
