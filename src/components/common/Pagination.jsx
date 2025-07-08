import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pagination, onPageChange }) => {
  const pageNumbers = [];

  // Dynamic max pages based on screen size
  const maxPagesToShow = 3; // Desktop
  const maxPagesToShowMobile = 2; // Mobile

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

  // Mobile page numbers (limited)
  const mobilePageNumbers = [];
  let mobileStartPage = Math.max(
    1,
    pagination.currentPage - Math.floor(maxPagesToShowMobile / 2)
  );
  let mobileEndPage = Math.min(
    pagination.lastPage,
    mobileStartPage + maxPagesToShowMobile - 1
  );

  if (mobileEndPage - mobileStartPage + 1 < maxPagesToShowMobile) {
    mobileStartPage = Math.max(1, mobileEndPage - maxPagesToShowMobile + 1);
  }

  for (let i = mobileStartPage; i <= mobileEndPage; i++) {
    mobilePageNumbers.push(i);
  }
  return (
    <div className="mt-4 border-t border-[var(--gray-200)] bg-white">
      {/* Mobile Layout */}
      <div className="block sm:hidden px-4 py-3">
        {/* Mobile Info */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#8C8D8BFF]">
            <span className="font-medium">{pagination.from}</span>-
            <span className="font-medium">{pagination.to}</span> of{' '}
            <span className="font-medium">{pagination.total}</span>
          </p>
          <p className="text-xs text-[#8C8D8BFF]">
            Page {pagination.currentPage} of {pagination.lastPage}
          </p>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pagination.currentPage === 1
                ? 'bg-[var(--gray-100)] text-[var(--gray-400)] cursor-not-allowed'
                : 'bg-white text-[var(--gray-500)] hover:bg-[var(--gray-50)] border border-[var(--gray-300)]'
            }`}
          >
            <FaChevronLeft className="h-3 w-3 mr-1" />
            Previous
          </button>

          {/* Mobile Page Numbers */}
          <div className="flex items-center space-x-1">
            {mobilePageNumbers.map(number => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded ${
                  number === pagination.currentPage
                    ? 'bg-[var(--primary-500)] text-white'
                    : 'bg-white border border-[var(--gray-300)] text-[var(--gray-500)] hover:bg-[var(--primary-500)] hover:text-white'
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              pagination.currentPage === pagination.lastPage
                ? 'bg-[var(--gray-100)] text-[var(--gray-400)] cursor-not-allowed'
                : 'bg-white text-[var(--gray-500)] hover:bg-[var(--gray-50)] border border-[var(--gray-300)]'
            }`}
          >
            Next
            <FaChevronRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between px-4 py-3 sm:px-6">
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
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium transition-colors ${
              pagination.currentPage === 1
                ? 'bg-[var(--gray-100)] text-[var(--gray-400)] cursor-not-allowed'
                : 'bg-white text-[var(--gray-500)] hover:bg-[var(--gray-50)] border border-[var(--gray-300)]'
            }`}
          >
            <span className="sr-only">Previous</span>
            <FaChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                number === pagination.currentPage
                  ? 'z-10 bg-[var(--primary-500)] border-[var(--primary-500)] text-white'
                  : 'bg-white border border-[var(--gray-300)] text-[var(--gray-500)] hover:bg-[var(--primary-500)] hover:text-white'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium transition-colors ${
              pagination.currentPage === pagination.lastPage
                ? 'bg-[var(--gray-100)] text-[var(--gray-400)] cursor-not-allowed'
                : 'bg-white text-[var(--gray-500)] hover:bg-[var(--gray-50)] border border-[var(--gray-300)]'
            }`}
          >
            <span className="sr-only">Next</span>
            <FaChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
