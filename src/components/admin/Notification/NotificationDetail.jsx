import React from 'react';
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglass,
} from 'react-icons/fa';

const NotificationDetail = ({ notification, onClose }) => {
  if (!notification) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4 relative text-center">
          <div className="mb-6 flex justify-center">
            <FaHourglass className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold mb-4">
            No Notification Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Select a notification from the table to view details.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Status badge styling
  const getStatusBadge = () => {
    switch (notification.status.toLowerCase()) {
      case 'success':
        return (
          <div className="flex items-center text-green-600 mb-4">
            <FaCheckCircle className="mr-2" />
            <span>Delivered successfully</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-600 mb-4">
            <FaExclamationCircle className="mr-2" />
            <span>Delivery failed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 mb-4">
            <FaHourglass className="mr-2" />
            <span>Delivery pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-2">Notification Details</h2>

        {getStatusBadge()}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Title</h3>
            <p>{notification.title}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Message</h3>
            <p className="text-gray-600">
              {notification.message || 'No message content'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Sent To</h3>
              <p className="text-gray-600">{notification.recipients}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Sent At</h3>
              <p className="text-gray-600">{notification.sentDate}</p>
              <p className="text-gray-500 text-sm">{notification.sentTime}</p>
            </div>
          </div>

          {notification.deliveryDetails && (
            <div>
              <h3 className="font-semibold text-gray-700">Delivery Details</h3>
              <p className="text-gray-600">{notification.deliveryDetails}</p>
            </div>
          )}

          {notification.status.toLowerCase() === 'failed' &&
            notification.failureReason && (
              <div>
                <h3 className="font-semibold text-red-600">Failure Reason</h3>
                <p className="text-red-600">{notification.failureReason}</p>
              </div>
            )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {notification.status.toLowerCase() === 'failed' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Resend
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
