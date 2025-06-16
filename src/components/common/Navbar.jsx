import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      message: 'New user registration',
      time: '5 minutes ago',
      isRead: false,
    },
    {
      id: 2,
      message: 'Event schedule updated',
      time: '1 hour ago',
      isRead: true,
    },
    {
      id: 3,
      message: 'System maintenance scheduled',
      time: '2 hours ago',
      isRead: true,
    },
  ];
  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-semibold text-red-600">
              CommuNITI
            </span>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <FaBell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 ${
                          !notification.isRead ? 'bg-red-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                    <div className="border-t border-gray-100">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-center text-gray-500 hover:text-gray-700"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                className="flex items-center max-w-xs p-2 text-sm rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <FaUserCircle className="h-8 w-8" />
              </button>

              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                      <p className="font-medium">Admin User</p>
                      <p className="text-sm text-gray-500">admin@example.com</p>
                    </div>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      <FaCog className="mr-3 h-4 w-4 text-gray-400" />
                      Settings
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
