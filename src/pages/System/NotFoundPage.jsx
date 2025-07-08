import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-[var(--primary-500)] mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex space-x-4 justify-center">
          <Link
            to="/"
            className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200"
          >
            Go to Home
          </Link>

          <Link
            to="/support"
            className="border border-[var(--primary-500)] text-[var(--primary-500)] hover:bg-[var(--primary-50)] px-6 py-2 rounded text-sm font-medium transition-colors duration-200"
          >
            Go to Support
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        © ITI All rights reserved
      </div>
    </div>
  );
};

export default NotFoundPage;
