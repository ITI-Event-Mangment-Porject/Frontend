import React, { useState, useMemo } from 'react';
import { FaEye, FaTrash, FaRedo } from 'react-icons/fa';
import Pagination from '../../common/Pagination';

const NotificationTable = ({
  notifications,
  onViewDetails,
  onResend,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  // Generate pagination object for the custom Pagination component
  const paginationData = useMemo(
    () => ({
      currentPage,
      from: indexOfFirstItem + 1,
      to: Math.min(indexOfLastItem, notifications.length),
      total: notifications.length,
      lastPage: totalPages,
    }),
    [
      currentPage,
      indexOfFirstItem,
      indexOfLastItem,
      notifications.length,
      totalPages,
    ]
  );

  // Handle page change for the custom Pagination component
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Get appropriate style based on delivery status
  const getStatusStyle = status => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'failed':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
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
          {currentItems.map(notification => (
            <tr key={notification.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {notification.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {notification.recipients}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {notification.sentDate}
                  <div className="text-xs text-gray-400">
                    {notification.sentTime}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusStyle(notification.status)}>
                  {notification.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(notification)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onResend(notification)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <FaRedo />
                  </button>
                  <button
                    onClick={() => onDelete(notification)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Custom Pagination Component */}
      {notifications.length > 0 && (
        <Pagination
          pagination={paginationData}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default NotificationTable;
