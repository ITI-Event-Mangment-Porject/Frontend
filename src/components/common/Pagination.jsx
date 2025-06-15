import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pagination, onPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(
    1,
    pagination.currentPage - Math.floor(maxPagesToShow / 2)
  );
  let endPage = Math.min(pagination.lastPage, startPage + maxPagesToShow - 1);

  // Adjust start page when near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <p className="text-sm text-[#8C8D8BFF]">
          Showing <span className="font-medium">{pagination.from}</span> to{' '}
          <span className="font-medium">{pagination.to}</span> of{' '}
          <span className="font-medium">{pagination.total}</span> results
        </p>
      </div>
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium ${
            pagination.currentPage === 1
              ? 'bg-gray-100 text-gray-400'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">Previous</span>
          <FaChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
              number === pagination.currentPage
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.lastPage}
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium ${
            pagination.currentPage === pagination.lastPage
              ? 'bg-gray-100 text-gray-400'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">Next</span>
          <FaChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
