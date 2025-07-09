import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaRedo } from 'react-icons/fa';
import Pagination from '../../common/Pagination';
import TableSkeleton from '../../common/TableSkeleton';
import { messageAPI } from '../../../services/api';
import useApi from '../../../hooks/useApi';

const NotificationTable = ({ onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    from: 0,
    to: 0,
    total: 0,
    lastPage: 1,
  });

  const { loading, error, execute } = useApi();

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await execute(() =>
          messageAPI.getAll({ page: currentPage })
        );

        if (result && result.success !== false) {
          // Extract notifications from the response
          const notificationsData = result.data || [];
          setNotifications(notificationsData);

          // Update pagination data
          setPaginationData({
            currentPage: result.current_page || 1,
            from: result.from || 0,
            to: result.to || 0,
            total: result.total || 0,
            lastPage: result.last_page || 1,
          });
        } else {
          // Handle case where API returns success: false
          setNotifications([]);
          setPaginationData({
            currentPage: 1,
            from: 0,
            to: 0,
            total: 0,
            lastPage: 1,
          });
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setNotifications([]);
        setPaginationData({
          currentPage: 1,
          from: 0,
          to: 0,
          total: 0,
          lastPage: 1,
        });
      }
    };

    fetchNotifications();
  }, [currentPage, execute]);

  // Handle page change for the custom Pagination component
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Get appropriate style based on delivery status
  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'failed':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  // Format date to a readable format
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time to a readable format
  const formatTime = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  // Get recipients info
  const getRecipientsInfo = notification => {
    if (!notification) return 'N/A';

    // For displaying targets and recipients count
    let targetInfo = '';
    try {
      if (notification.target_criteria) {
        const criteria = JSON.parse(notification.target_criteria);
        if (criteria.roles && criteria.roles.includes('all')) {
          targetInfo = 'All Users';
        } else if (criteria.roles) {
          targetInfo = `${criteria.roles.join(', ')} users`;
        } else if (criteria.tracks) {
          targetInfo = `${criteria.tracks.length} tracks`;
        }
      }
    } catch (e) {
      console.log(e);
      targetInfo = 'Custom Criteria';
    }

    return `${targetInfo} (${notification.total_recipients})`;
  };

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      {loading ? (
        <TableSkeleton
          rows={5}
          columns={5}
          showProfileColumn={false}
          showActionsColumn={true}
          className="mt-2 mb-4"
        />
      ) : error ? (
        <div className="px-6 py-16 text-center">
          <div className="animate-fade-in">
            <div className="mx-auto w-16 h-16 mb-6 relative">
              <div className="absolute inset-0 bg-gray-100 rounded-full animate-pulse"></div>
              <svg
                className="relative w-16 h-16 text-gray-400 animate-bounce-slow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2 animate-slide-up">
              No notifications found here
            </h3>
            <p className="text-sm text-gray-500 animate-slide-up-delay">
              Check back later for new notifications
            </p>
          </div>
        </div>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Notifications Found
                      </h3>
                      <p className="text-gray-500 text-sm max-w-sm">
                        There are no notifications to display at the moment. New
                        notifications will appear here once they are created.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map(notification => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getRecipientsInfo(notification)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {notification.sent_at
                          ? formatDate(notification.sent_at)
                          : formatDate(notification.scheduled_at)}
                        <div className="text-xs text-gray-400">
                          {notification.sent_at
                            ? formatTime(notification.sent_at)
                            : formatTime(notification.scheduled_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusStyle(notification.status)}>
                        {notification.status}
                        {notification.status === 'completed' &&
                          notification.failed_count > 0 && (
                            <span className="ml-1">
                              ({notification.sent_count}/
                              {notification.total_recipients})
                            </span>
                          )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewDetails(notification)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Custom Pagination Component */}
          {paginationData.total > 0 && (
            <Pagination
              pagination={paginationData}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NotificationTable;
