import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

const SignUpRedirect = () => {
  //   const navigate = useNavigate();

  useEffect(() => {
    // Set a timer to redirect after 3 seconds
    const timer = setTimeout(() => {
      // In a real application, this would redirect to the ITI portal
      // For now, we'll redirect to the external ITI portal URL
      window.location.href = 'https://iti.gov.eg/';
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* ITI Logo placeholder */}

        {/* Loading Spinner */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-100)] border-t-[var(--primary-600)] mx-auto"></div>
        </div>

        {/* Main Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Redirecting to ITI Portal
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          We'll redirect you to the ITI portal for registrations. Please wait
          while we prepare your journey to join the Information Technology
          Institute.
        </p>

        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-[var(--primary-600)] h-2 rounded-full animate-pulse"
            style={{ width: '66%' }}
          ></div>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>✓ Secure connection established</p>
          <p>✓ Preparing registration portal</p>
          <p>⏳ Redirecting in a few seconds...</p>
        </div>

        {/* Manual Link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-2">
            If you're not redirected automatically:
          </p>
          <a
            href="https://iti.gov.eg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary-600)] hover:text-[var(--primary-700)] text-sm font-medium underline"
          >
            Click here to visit ITI Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpRedirect;
