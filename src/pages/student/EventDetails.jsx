import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Footer from '../../components/student/Footer';
import defaultEvent from '../../assets/images/Business-Event1.jpg';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import CardSkeleton from '../../components/common/CardSkeleton';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  MessageCircle,
  Star,
  ArrowRight,
  Coffee,
  Mic,
} from 'lucide-react';

const APP_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
        apiCall(`${APP_URL}/api/events/${id}`),
        apiCall(`${APP_URL}/api/events/${id}/registration-status`).catch(
          () => null
        ),
        apiCall(`${APP_URL}/api/events/${id}/sessions`),
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
      const res = await apiCall(`${APP_URL}/api/events/${id}/register`, {
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
          `${APP_URL}/api/events/${id}/registration-status`
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
        `${APP_URL}/api/events/${id}/cancel-registration`,
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
      const res = await apiCall(`${APP_URL}/api/feedback/events/${id}/forms`);
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

  // Custom skeleton components
  const EventDetailsSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Hero Skeleton */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 h-96 md:h-[500px] bg-gray-200 animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="w-24 h-6 bg-gray-300 rounded-full mb-4 animate-pulse"></div>
          <div className="w-3/4 h-12 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
          <div className="flex gap-6">
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Event Details Card Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10 mb-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="w-16 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="w-48 h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="p-6 rounded-2xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="w-32 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div>
          <div className="w-48 h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Slido Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="w-48 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Agenda Section Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-48 h-9 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="rounded-2xl border-2 border-gray-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="w-64 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="flex gap-4 mb-3">
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AgendaSkeleton = () => (
    <div className="text-center py-8">
      <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
      <div className="w-32 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
    </div>
  );

  const formatTime = time => (time ? time.slice(0, 5) : 'N/A');
  const formatDate = date =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const sortedSessions = [...sessions].sort((a, b) =>
    a.start_time.localeCompare(b.start_time)
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Navbar with backdrop */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <HomeNavbar />
      </div>

      {/* Enhanced Popup Messages */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`px-8 py-4 rounded-2xl shadow-2xl text-lg font-semibold border-2 backdrop-blur-sm ${
              popupMessage.includes('successful')
                ? 'bg-green-500/90 text-white border-green-300'
                : popupMessage.includes('Already')
                  ? 'bg-blue-500/90 text-white border-blue-300'
                  : popupMessage.includes('cancelled')
                    ? 'bg-orange-500/90 text-white border-orange-300'
                    : 'bg-red-500/90 text-white border-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {popupMessage.includes('successful') && (
                <CheckCircle className="w-6 h-6" />
              )}
              {popupMessage.includes('Already') && <Star className="w-6 h-6" />}
              {popupMessage.includes('cancelled') && (
                <XCircle className="w-6 h-6" />
              )}
              {popupMessage}
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Cancellation Modal */}
      {showCancelModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-200"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cancel Registration
              </h3>
              <p className="text-gray-600">
                We're sorry to see you go. Please let us know why you're
                cancelling:
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {predefinedReasons.map((reason, index) => (
                <motion.label
                  key={reason}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={cancellationReason === reason}
                    onChange={e => setCancellationReason(e.target.value)}
                    className="w-5 h-5 text-orange-500 focus:ring-orange-400 focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">{reason}</span>
                </motion.label>
              ))}
            </div>

            {cancellationReason === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <textarea
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="Please tell us more about your reason..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none transition-all"
                  rows="4"
                  maxLength="200"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {customReason.length}/200 characters
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Keep Registration
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelRegistration}
                disabled={
                  cancelLoading ||
                  !cancellationReason ||
                  (cancellationReason === 'Other' && !customReason.trim())
                }
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Registration'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="pt-20">
        {loading ? (
          <EventDetailsSkeleton />
        ) : error || !event ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20 px-4"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Event not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load the event details. Please try again.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto px-4 pb-20"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden shadow-2xl mb-12"
            >
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={
                    event.banner_image?.trim()
                      ? event.banner_image
                      : defaultEvent
                  }
                  onError={e => (e.target.src = defaultEvent)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
                  <div className="absolute top-32 right-32 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-300" />
                  <div className="absolute bottom-40 left-40 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-700" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 border border-white/30"
                    >
                      {event.type}
                    </motion.span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">
                          {formatDate(event.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          {formatTime(event.start_time)} -{' '}
                          {formatTime(event.end_time)}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Event Details Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <motion.div variants={slideInVariants}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-blue-500" />
                    Event Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Duration
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(event.start_date)} -{' '}
                          {formatDate(event.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Time
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatTime(event.start_time)} -{' '}
                          {formatTime(event.end_time)}
                        </p>
                      </div>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Location
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={slideInVariants}>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Registration Status
                  </h3>
                  <div className="space-y-4">
                    <div
                      className={`p-6 rounded-2xl border-2 ${
                        isRegistered
                          ? 'bg-green-50 border-green-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {isRegistered ? (
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : (
                          <Users className="w-8 h-8 text-blue-500" />
                        )}
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {isRegistered
                              ? 'You are registered!'
                              : 'Ready to join?'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isRegistered
                              ? 'Your spot is confirmed for this event'
                              : 'Register now to secure your spot'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {!isRegistered ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRegister}
                            disabled={registerLoading}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                              registerLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg'
                            }`}
                          >
                            {registerLoading ? (
                              <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Registering...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                Register Now
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            )}
                          </motion.button>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-default"
                            >
                              <span className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Registered
                              </span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCancelClick}
                              disabled={cancelLoading}
                              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
                            >
                              Cancel
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>

                    {event.status === 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFeedback}
                        disabled={feedbackLoading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {feedbackLoading ? 'Loading...' : 'Submit Feedback'}
                        </span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div variants={slideInVariants}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  About This Event
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700 bg-gray-50 rounded-xl p-6">
                  <p className="whitespace-pre-line leading-relaxed">
                    {event.description || 'No description available.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Slido Section */}
            <motion.div variants={itemVariants}>
              {event.slido_link || event.slido_embed_url ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-8 mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        💬 Interactive Q&A
                      </h3>
                      <p className="text-gray-600">
                        Join the conversation during the event!
                      </p>
                    </div>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={event.slido_link || event.slido_embed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg"
                  >
                    🔗 Open Slido
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-8 mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        💬 Interactive Q&A
                      </h3>
                      <p className="text-gray-600">
                        Slido will be available before the event starts
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-600 font-semibold bg-blue-100 rounded-xl p-4">
                    📋 Q&A platform coming soon!
                  </div>
                </div>
              )}
            </motion.div>

            {/* Agenda Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Event Agenda
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto"></div>
              </div>

              {sessionsLoading ? (
                <AgendaSkeleton />
              ) : sortedSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No sessions scheduled yet
                  </p>
                  <p className="text-gray-400">Check back soon for updates!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`relative rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                        session.is_break
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400'
                          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            session.is_break ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}
                        >
                          {session.is_break ? (
                            <Coffee className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <Mic className="w-6 h-6 text-blue-600" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {session.title}
                            </h4>
                            {session.is_break && (
                              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                Break
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {formatTime(session.start_time)} -{' '}
                                {formatTime(session.end_time)}
                              </span>
                            </div>

                            {event.type?.toLowerCase() === 'job fair' &&
                              session.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="font-medium">
                                    {session.location}
                                  </span>
                                </div>
                              )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 font-medium">
                              Speaker:{' '}
                              {session.speaker_name || 'To be announced'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Registration Deadline */}
            {event.registration_deadline && (
              <motion.div
                variants={itemVariants}
                className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-800 text-lg">
                      Registration Deadline
                    </h4>
                    <p className="text-yellow-700 font-medium">
                      {new Date(event.registration_deadline).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventDetails;
