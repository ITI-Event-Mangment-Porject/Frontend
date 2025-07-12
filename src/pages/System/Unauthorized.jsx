import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center"
          >
            <Shield className="w-10 h-10 text-red-500" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Access Denied
          </motion.h1>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            <p className="mb-2">
              You don't have permission to access this page.
            </p>
            {user && role && (
              <p className="text-sm">
                Currently logged in as:{' '}
                <span className="font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <br />
                Role: <span className="font-medium capitalize">{role}</span>
              </p>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-3"
          >
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Logout & Login as Different User
              </button>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-sm text-gray-500"
          >
            If you believe this is an error, please contact your administrator.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Unauthorized;
