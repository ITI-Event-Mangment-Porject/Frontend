import React, { useState, useEffect } from 'react';
import {
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaSpinner,
  FaSync,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { messageAPI } from '../../../services/api';
import useApi from '../../../hooks/useApi';

const NotificationStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    sending: 0,
    scheduled: 0,
    completion_rate: 0,
  });

  // const [lastUpdated, setLastUpdated] = useState(new Date());
  // const [refreshing, setRefreshing] = useState(false);
  const { loading, execute } = useApi();

  const fetchStats = async () => {
    try {
      // First try to get stats from the dedicated endpoint
      const statsResult = await execute(() => messageAPI.getStats()).catch(
        () => null
      );

      if (statsResult && statsResult.success !== false) {
        // If we have a dedicated stats endpoint, use that data
        setStats({
          total: statsResult.total || 0,
          completed: statsResult.completed || 0,
          failed: statsResult.failed || 0,
          sending: statsResult.sending || 0,
          scheduled: statsResult.scheduled || 0,
          completion_rate:
            statsResult.completion_rate ||
            (statsResult.total > 0
              ? Math.round((statsResult.completed / statsResult.total) * 100)
              : 0),
        });
      } else {
        // Fall back to calculating stats from all messages
        const result = await execute(() =>
          messageAPI.getAllMessages({ limit: 1000 })
        );

        if (result && result.success !== false) {
          // Process the notifications to calculate stats
          const data = result.data || [];
          const totalMessages = data.length;
          const completed = data.filter(
            n => n.status?.toLowerCase() === 'completed'
          ).length;

          const calculatedStats = {
            total: totalMessages,
            completed: completed,
            failed: data.filter(n => n.status?.toLowerCase() === 'failed')
              .length,
            sending: data.filter(n => n.status?.toLowerCase() === 'sending')
              .length,
            scheduled: data.filter(n => n.status?.toLowerCase() === 'scheduled')
              .length,
            completion_rate:
              totalMessages > 0
                ? Math.round((completed / totalMessages) * 100)
                : 0,
          };

          setStats(calculatedStats);
        }
      }

      // Update last refreshed timestamp
      // setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching notification stats:', err);
    } finally {
      // if (showRefreshAnimation) {
      //   setRefreshing(false);
      // }
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up interval to refresh stats every minute
    const intervalId = setInterval(() => fetchStats(), 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [execute]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Notifications */}
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center border-l-4 border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-full">
          <FaPaperPlane className="text-primary-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Total Messages</p>
          {loading ? (
            <div className="animate-pulse h-8 w-12 bg-gray-200 rounded"></div>
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">
              {stats.total}
            </h2>
          )}
        </div>
      </div>

      {/* Successful/Completed Deliveries */}
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-full">
          <FaCheckCircle className="text-green-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Delivered</p>
          {loading ? (
            <div className="animate-pulse h-8 w-12 bg-gray-200 rounded"></div>
          ) : (
            <h2 className="text-2xl font-semibold text-green-600">
              {stats.completed}
            </h2>
          )}
        </div>
      </div>

      {/* Failed Deliveries */}
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 rounded-full">
          <FaExclamationCircle className="text-red-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Failed</p>
          {loading ? (
            <div className="animate-pulse h-8 w-12 bg-gray-200 rounded"></div>
          ) : (
            <h2 className="text-2xl font-semibold text-red-600">
              {stats.failed}
            </h2>
          )}
        </div>
      </div>

      {/* In Progress Deliveries */}
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-full">
          <FaSpinner className="text-yellow-600 text-xl animate-spin" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">In Progress</p>
          {loading ? (
            <div className="animate-pulse h-8 w-12 bg-gray-200 rounded"></div>
          ) : (
            <h2 className="text-2xl font-semibold text-yellow-600">
              {stats.sending}
            </h2>
          )}
        </div>
      </div>

      {/* Scheduled Deliveries */}
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full">
          <FaClock className="text-blue-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Scheduled</p>
          {loading ? (
            <div className="animate-pulse h-8 w-12 bg-gray-200 rounded"></div>
          ) : (
            <h2 className="text-2xl font-semibold text-blue-600">
              {stats.scheduled}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;
