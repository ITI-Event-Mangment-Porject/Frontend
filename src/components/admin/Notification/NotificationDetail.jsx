import React, { useEffect } from 'react';
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglass,
  FaBell,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaRedo,
} from 'react-icons/fa';

const NotificationDetail = ({ notification, onClose }) => {
  // Add escape key listener to close modal
  useEffect(() => {
    const handleEscKey = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  if (!notification) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-in-out]">
        <div
          className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4 relative text-center animate-[slideIn_0.4s_ease-out]">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-primary-100 rounded-full">
              <FaBell className="text-primary-500 text-4xl" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">
            No Notification Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Select a notification from the table to view details.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-400 to-primary-600 text-white rounded-md hover:from-primary-500 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Status badge styling
  const getStatusBadge = () => {
    switch (notification.status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return (
          <div className="flex items-center bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg mb-4 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="p-2 bg-green-200 rounded-full mr-3">
              <FaCheckCircle className="text-green-600" />
            </div>
            <div>
              <span className="font-medium text-green-800">
                Delivered Successfully
              </span>
              <p className="text-xs text-green-600 mt-0.5">
                All messages were sent to recipients
              </p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg mb-4 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="p-2 bg-red-200 rounded-full mr-3">
              <FaExclamationCircle className="text-red-600" />
            </div>
            <div>
              <span className="font-medium text-red-800">Delivery Failed</span>
              <p className="text-xs text-red-600 mt-0.5">
                There was an issue sending this notification
              </p>
            </div>
          </div>
        );
      case 'pending':
      case 'sending':
        return (
          <div className="flex items-center bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg mb-4 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="p-2 bg-yellow-200 rounded-full mr-3">
              <FaHourglass className="text-yellow-600" />
            </div>
            <div>
              <span className="font-medium text-yellow-800">
                Delivery in Progress
              </span>
              <p className="text-xs text-yellow-600 mt-0.5">
                Messages are being sent to recipients
              </p>
            </div>
          </div>
        );
      case 'scheduled':
        return (
          <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg mb-4 animate-[fadeIn_0.5s_ease-in-out]">
            <div className="p-2 bg-blue-200 rounded-full mr-3">
              <FaCalendarAlt className="text-blue-600" />
            </div>
            <div>
              <span className="font-medium text-blue-800">
                Scheduled for Delivery
              </span>
              <p className="text-xs text-blue-600 mt-0.5">
                Will be sent at the scheduled time
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Format date string to a more readable format
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time string
  const formatTime = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get recipients info from target criteria
  const getRecipientsInfo = () => {
    if (!notification.target_criteria) return 'All Users';

    try {
      const criteria = JSON.parse(notification.target_criteria);
      if (criteria.roles && criteria.roles.includes('all')) {
        return 'All Users';
      } else if (criteria.roles) {
        return `${criteria.roles.join(', ')} Users`;
      } else if (criteria.tracks) {
        return `${criteria.tracks.length} Tracks`;
      }
      return `${notification.total_recipients} Recipients`;
    } catch (e) {
      console.log(e);
      return `${notification.total_recipients} Recipients`;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-in-out]">
      {/* Blurry background overlay */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 relative z-10 overflow-hidden animate-[slideInUp_0.4s_ease-out]">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-300 to-primary-600 p-5 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <FaBell className="mr-2" /> Notification Details
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {getStatusBadge()}

          <div className="space-y-5 animate-[fadeIn_0.6s_ease-in-out]">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2 flex items-center">
                <FaEnvelope className="mr-2 text-primary-500" /> Title
              </h3>
              <p className="text-lg font-medium">{notification.title}</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2 flex items-center">
                <FaEnvelope className="mr-2 text-primary-500" /> Message
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {notification.message || 'No message content'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2 flex items-center">
                  <FaUsers className="mr-2 text-primary-500" /> Recipients
                </h3>
                <div className="flex items-center">
                  <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                    {getRecipientsInfo()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Total: {notification.total_recipients || 0}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-primary-500" /> Sent At
                </h3>
                <p className="text-gray-700 font-medium">
                  {notification.sent_at
                    ? formatDate(notification.sent_at)
                    : notification.scheduled_at
                      ? formatDate(notification.scheduled_at)
                      : 'N/A'}
                </p>
                <p className="text-gray-500 text-sm">
                  {notification.sent_at
                    ? formatTime(notification.sent_at)
                    : notification.scheduled_at
                      ? formatTime(notification.scheduled_at)
                      : ''}
                </p>
              </div>
            </div>

            {notification.sent_count > 0 && (
              <div className="animate-[fadeIn_0.7s_ease-in-out]">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-2 flex items-center">
                  <FaCheckCircle className="mr-2 text-primary-500" /> Delivery
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-green-700 text-sm">Sent</p>
                    <p className="text-green-800 font-bold text-xl">
                      {notification.sent_count}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-red-700 text-sm">Failed</p>
                    <p className="text-red-800 font-bold text-xl">
                      {notification.failed_count}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {notification.status?.toLowerCase() === 'failed' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 animate-[fadeIn_0.8s_ease-in-out]">
                <h3 className="font-semibold text-red-700 text-sm uppercase tracking-wider mb-2">
                  Failure Reason
                </h3>
                <p className="text-red-700">
                  {notification.failure_reason ||
                    'An error occurred during message delivery'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3 animate-[fadeIn_0.9s_ease-in-out]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] text-white rounded-md hover:from-[var(--primary-600)] hover:to-[var(--primary-400)] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
