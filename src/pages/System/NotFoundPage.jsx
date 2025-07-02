import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-red-500 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
 
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200">
          Go to Help/Support
        </button>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        © ITI All rights reserved
      </div>
    </div>
  );
};

export default NotFoundPage;