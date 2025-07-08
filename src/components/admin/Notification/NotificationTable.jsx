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
      const result = await execute(() =>
        messageAPI.getAllMessages({ page: currentPage })
      );

      if (result && result.success !== false) {
        // Extract notifications from the response
        setNotifications(result.data || []);

        // Update pagination data
        setPaginationData({
          currentPage: result.current_page,
          from: result.from,
          to: result.to,
          total: result.total,
          lastPage: result.last_page,
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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error loading notifications: {error}
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
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No notifications found
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
