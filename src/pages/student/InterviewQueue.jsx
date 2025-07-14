import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import HomeFooter from '../../components/homePage/HomeFooter';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JobFairDashboard = () => {
  const [allQueuesData, setAllQueuesData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID safely from localStorage
  const getUserIdFromStorage = () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;

    try {
      const parsedUser = JSON.parse(savedUser);
      return (
        parsedUser.id || parsedUser.user_id || parsedUser.studentId || null
      );
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  };

  const fetchQueuesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getUserIdFromStorage();
      const token = localStorage.getItem('token');

      console.log('📦 Stored userId:', userId);

      if (!userId || !token) {
        setError('⚠️ User ID or token not found. Please log in again.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/job-fairs/2/queues/student/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const queuesArray =
        data.success && data.data && data.data.queue ? data.data.queue : [];

      setAllQueuesData(queuesArray);
    } catch (err) {
      console.error('Error fetching queues data:', err);
      setError('Failed to load interview data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueuesData();
  }, []);

  const refreshCurrentQueue = () => {
    fetchQueuesData();
  };

  const currentQueue = allQueuesData[activeTab];

  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return 'TBD';
    return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  };

  const formatDate = dateString => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Track Your Interviews
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Interview Queue
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay updated with your interview schedule and queue status in
            real-time
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {allQueuesData.length}
              </div>
              <div className="text-white/80">Scheduled Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {currentQueue?.queue_position || 0}
              </div>
              <div className="text-white/80">Your Position</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {currentQueue?.queue_position <= 1
                  ? '0-5'
                  : Math.ceil((currentQueue?.queue_position || 0) * 15)}
              </div>
              <div className="text-white/80">Minutes Wait</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-900 to-red-500 text-white p-6">
              <h1 className="text-3xl font-bold mb-2">Job Fair Dashboard</h1>
              <p className="text-orange-100">Your interviews for today</p>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your interviews...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button
                  onClick={refreshCurrentQueue}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : allQueuesData.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 text-lg">
                  No interviews scheduled for today
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    {allQueuesData.map((queueItem, index) => (
                      <button
                        key={queueItem.queue_id}
                        onClick={() => setActiveTab(index)}
                        className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                          activeTab === index
                            ? 'border-orange-500 text-orange-600 bg-orange-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            {queueItem.company?.logo_path ? (
                              <img
                                src={queueItem.company.logo_path}
                                alt={queueItem.company.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <span className="text-orange-500 text-sm font-bold">
                                {queueItem.company?.name?.[0]}
                              </span>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">
                              {queueItem.company?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(
                                queueItem.slot?.start_time,
                                queueItem.slot?.end_time
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  {currentQueue && (
                    <div className="max-w-2xl mx-auto">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                          {currentQueue.company?.logo_path ? (
                            <img
                              src={currentQueue.company.logo_path}
                              alt={currentQueue.company.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <span className="text-orange-500 text-2xl font-bold">
                              {currentQueue.company?.name?.[0]}
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {currentQueue.company?.name}
                        </h2>
                        <div className="flex justify-center gap-4 text-sm text-gray-600">
                          <span>📅 {formatDate(currentQueue.slot?.date)}</span>
                          <span>
                            🕐{' '}
                            {formatTime(
                              currentQueue.slot?.start_time,
                              currentQueue.slot?.end_time
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-orange-500 mb-2">
                              {currentQueue.queue_position}
                            </div>
                            <div className="text-gray-600 text-sm">
                              Your Position
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-blue-500 mb-2">
                              {currentQueue.queue_position > 0
                                ? currentQueue.queue_position - 1
                                : 0}
                            </div>
                            <div className="text-gray-600 text-sm">
                              People Before You
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-green-500 mb-2">
                              {currentQueue.queue_position <= 1
                                ? '0-5'
                                : Math.ceil(currentQueue.queue_position * 15)}
                            </div>
                            <div className="text-gray-600 text-sm">
                              Minutes Wait
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            currentQueue.status === 'waiting' &&
                            currentQueue.queue_position === 1
                              ? 'bg-green-100 text-green-800'
                              : currentQueue.status === 'waiting'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {currentQueue.queue_position === 1
                            ? '🎯 Next in line!'
                            : currentQueue.status === 'waiting'
                              ? '⏳ In Queue'
                              : `📋 ${currentQueue.status.charAt(0).toUpperCase() + currentQueue.status.slice(1)}`}
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Queue Progress</span>
                          <span>
                            {currentQueue.queue_position > 0
                              ? Math.round(
                                  (currentQueue.order_key /
                                    (currentQueue.order_key +
                                      currentQueue.queue_position)) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                currentQueue.queue_position > 0
                                  ? (currentQueue.order_key /
                                      (currentQueue.order_key +
                                        currentQueue.queue_position)) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {currentQueue.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h3 className="font-semibold text-blue-800 mb-2">
                            Notes:
                          </h3>
                          <p className="text-blue-700">{currentQueue.notes}</p>
                        </div>
                      )}

                      <div className="text-center">
                        <button
                          onClick={refreshCurrentQueue}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Refresh Status</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default JobFairDashboard;
