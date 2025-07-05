import React from 'react';

const AuthenticationPage_loading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Loading Spinner */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Authenticating Your Access
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          Please wait a moment while we securely verify your credentials and
          redirect you to the Portal Manager. This process ensures your data
          remains protected.
        </p>
      </div>
    </div>
  );
};

export default AuthenticationPage_loading;
