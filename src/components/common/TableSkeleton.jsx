import React from 'react';

/**
 * TableSkeleton - A reusable skeleton loader component for tables
 *
 * @param {number} rows - Number of skeleton rows to display (default: 5)
 * @param {number} columns - Number of columns in the table (default: 5)
 * @param {boolean} showProfileColumn - Whether to show profile avatar + name in first column (default: true)
 * @param {boolean} showActionsColumn - Whether to show action buttons in last column (default: true)
 * @param {string} className - Additional CSS classes for styling
 *
 * @example
 * // Basic usage
 * <TableSkeleton />
 *
 * @example
 * // Custom configuration
 * <TableSkeleton
 *   rows={8}
 *   columns={4}
 *   showProfileColumn={false}
 *   showActionsColumn={true}
 * />
 */
const TableSkeleton = ({
  rows = 5,
  columns = 5,
  showProfileColumn = true,
  showActionsColumn = true,
  className = '',
}) => {
  // Column width configurations for different column types
  const getColumnWidth = (index, totalColumns) => {
    if (showProfileColumn && index === 0) return '120px'; // Profile + Name column
    if (showActionsColumn && index === totalColumns - 1) return '100px'; // Actions column

    // Dynamic widths for other columns
    const widths = ['180px', '100px', '80px', '120px', '90px'];
    return widths[index % widths.length] || '100px';
  };
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Card Layout (hidden on desktop) */}
      <div className="block md:hidden space-y-4">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
          >
            {/* Mobile card header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Profile picture skeleton */}
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  {/* Name skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  {/* Email skeleton */}
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
              {/* Status badge skeleton */}
              <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            </div>

            {/* Mobile card details */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-300 rounded w-18"></div>
            </div>

            {/* Mobile action buttons */}
            <div className="flex space-x-2">
              <div className="flex-1 h-8 bg-gray-300 rounded"></div>
              <div className="flex-1 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full bg-white shadow-sm rounded-lg border border-gray-200">
          {/* Table header skeleton */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              {Array.from({ length: columns }, (_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-300 rounded animate-pulse"
                  style={{ width: getColumnWidth(i, columns) }}
                ></div>
              ))}
            </div>
          </div>

          {/* Table rows skeleton */}
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="px-4 sm:px-6 py-4 border-b border-gray-200"
            >
              <div className="flex justify-between items-center">
                {Array.from({ length: columns }, (_, colIndex) => {
                  // Profile + Name column (first column when showProfileColumn is true)
                  if (showProfileColumn && colIndex === 0) {
                    return (
                      <div
                        key={colIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-20 sm:w-24"></div>
                      </div>
                    );
                  }

                  // Actions column (last column when showActionsColumn is true)
                  if (showActionsColumn && colIndex === columns - 1) {
                    return (
                      <div
                        key={colIndex}
                        className="flex space-x-1 sm:space-x-2"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    );
                  }

                  // Regular data columns
                  return (
                    <div
                      key={colIndex}
                      className="h-4 bg-gray-300 rounded animate-pulse"
                      style={{ width: getColumnWidth(colIndex, columns) }}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Pagination skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
        {/* Info text skeleton */}
        <div className="h-4 bg-gray-300 rounded animate-pulse w-32 sm:w-40"></div>

        {/* Pagination controls skeleton */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile pagination - fewer buttons */}
          <div className="flex space-x-1 sm:hidden">
            <div className="w-16 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-12 h-8 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Desktop pagination - full buttons */}
          <div className="hidden sm:flex space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gray-300 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
