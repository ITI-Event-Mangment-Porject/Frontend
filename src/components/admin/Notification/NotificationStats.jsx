import React from 'react';
import {
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

const NotificationStats = ({ totalCount, successCount, failedCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center border-primary hover:shadow-lg transition-shadow duration-300 hover:scale-103">
        <div className="bg-blue-100 p-3 rounded-full">
          <FaPaperPlane className="text-blue-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Total Notifications Sent</p>
          <h2 className="text-2xl font-semibold text-gray-800">{totalCount}</h2>
        </div>
      </div>

      {/* Successful Deliveries */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center border-primary hover:shadow-lg transition-shadow duration-300 hover:scale-103">
        <div className="bg-green-100 p-3 rounded-full">
          <FaCheckCircle className="text-green-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Successful Deliveries</p>
          <h2 className="text-2xl font-semibold text-green-600">
            {successCount}
          </h2>
        </div>
      </div>

      {/* Failed Deliveries */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center border-primary hover:shadow-lg transition-shadow duration-300 hover:scale-103">
        <div className="bg-red-100 p-3 rounded-full">
          <FaExclamationCircle className="text-red-600 text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500 text-sm">Failed Deliveries</p>
          <h2 className="text-2xl font-semibold text-red-600">{failedCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;
