import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const NotificationFilter = ({ onApplyFilters }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Notifications');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const handleApplyFilters = () => {
    onApplyFilters({
      searchText,
      status: statusFilter,
      dateRange,
    });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow mb-6 border-primary">
      <h3 className="text-gray-700 font-medium mb-4">Filter Notifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search by title or message */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <FaSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search by title or message"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-0"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-0 appearance-none"
          >
            <option>All Notifications</option>
            <option>Successful</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaFilter className="h-4 w-4" />
          </div>
        </div>

        {/* Date range filter */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <FaCalendarAlt className="h-4 w-4" />
          </span>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={e =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-0"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 text-white rounded-md bg-[var(--primary-500)] hover:bg-[var(--primary-600)] transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default NotificationFilter;
