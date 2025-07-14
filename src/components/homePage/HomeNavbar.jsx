import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBell,
  FaBuilding,
  FaClock,
} from 'react-icons/fa';
import axios from 'axios';

const APP_URL = import.meta.env.VITE_API_BASE_URL;

const CustomLink = ({ to, className, children }) => {
  return (
    <Link to={to} className={`${className} focus:outline-none`}>
      {children}
    </Link>
  );
};

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Handle navbar color change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for user data on component mount
  useEffect(() => {
    try {
      // Get user directly from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }
  }, []);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${APP_URL}/api/notify/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notificationData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async id => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${APP_URL}/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.log(error);
      // Fallback: just update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${APP_URL}/api/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.log(error);
      // Fallback: just update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    }
  };

  // Handle logout
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  // Navigate to profile/dashboard based on user role
  const navigateToUserArea = () => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'student':
        navigate('/student/profile');
        break;
      case 'company_representative':
        navigate('/company/dashboard');
        break;
      default:
        navigate('/');
    }
    setIsProfileMenuOpen(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isProfileMenuOpen &&
        !event.target.closest('.profile-menu-container')
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        isNotificationsOpen &&
        !event.target.closest('.notifications-container')
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isNotificationsOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <CustomLink to="/" className="flex items-center gap-2">
          {isScrolled ? (
            <img src="/logo.png" alt="CommunITI" className="h-25 w-30" />
          ) : (
            <img src="/logo-white.png" alt="CommunITI" className="h-25 w-30" />
          )}
        </CustomLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <CustomLink
            to="/"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-[var(--gray-700)] hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            Home
          </CustomLink>
          <CustomLink
            to="/events"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            Events
          </CustomLink>

          {/* Student-only navigation items */}
          {user && role === 'student' && (
            <>
              <CustomLink
                to="/student/CompanyDirectory"
                className={`flex items-center gap-2 hover:text-[var(--gray-300)] font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-[var(--primary-500)]'
                    : 'text-white'
                }`}
              >
                Job Fair Companies
              </CustomLink>
              <CustomLink
                to="/student/interview-queue"
                className={`flex items-center gap-2 hover:text-[var(--gray-300)] font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-[var(--primary-500)]'
                    : 'text-white'
                }`}
              >
                Interview Queue
              </CustomLink>
            </>
          )}

          <CustomLink
            to="/about-us"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            About Us
          </CustomLink>
          <CustomLink
            to="/contect-us"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            Contact Us
          </CustomLink>
        </div>

        {/* Auth Buttons or User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            // Show login/signup buttons if no user
            <>
              <CustomLink
                to="/login"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isScrolled
                    ? 'text-[var(--gray-700)] hover:text-[var(--primary-600)]'
                    : 'text-white hover:text-[var(--gray-300)]'
                }`}
              >
                Login
              </CustomLink>
              <CustomLink
                to="/register"
                className="px-4 py-2 rounded-md font-medium bg-[var(--primary-600)] text-white hover:bg-[var(--primary-600)] transition-colors animate-fade-in"
              >
                Sign Up
              </CustomLink>
            </>
          ) : (
            // Show user profile if logged in
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="notifications-container relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative p-2 rounded-md transition-all ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in-down z-20">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <FaBell className="w-4 h-4 text-blue-500" />
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-3 hover:bg-gray-50 transition-colors border-l-4 cursor-pointer ${
                              !notification.read_at
                                ? 'border-blue-500 bg-blue-50/30'
                                : 'border-transparent'
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title || notification.message}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.body || notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.created_at || notification.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors py-1">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="profile-menu-container relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100 hover:bg-opacity-20'
                      : 'text-white hover:bg-[var(--primary-500)]'
                  } `}
                >
                  <FaUserCircle className="w-5 h-5" />
                  <span className="font-medium">
                    {user.first_name || user.name || 'User'}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in-down">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.role && (
                        <p className="text-xs text-gray-500 mt-1 capitalize bg-gray-100 px-2 py-1 rounded inline-block">
                          {user.role}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={navigateToUserArea}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUserCircle className="mr-3 h-4 w-4 text-gray-400" />
                      {role === 'student' ? 'Profile' : 'Dashboard'}
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-in-right">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <CustomLink
              to="/"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </CustomLink>
            <CustomLink
              to="/events"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </CustomLink>

            {/* Student-only mobile navigation items */}
            {user && role === 'student' && (
              <>
                <CustomLink
                  to="/student/CompanyDirectory"
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-[var(--primary-500)] pl-4 border-l-2 border-blue-200 bg-blue-50/30 rounded-r-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaBuilding className="w-4 h-4 text-blue-500" />
                  Job Fair Companies
                </CustomLink>
                <CustomLink
                  to="/student/interview-queue"
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-[var(--primary-500)] pl-4 border-l-2 border-green-200 bg-green-50/30 rounded-r-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaClock className="w-4 h-4 text-green-500" />
                  Interview Queue
                </CustomLink>
              </>
            )}

            <CustomLink
              to="/about"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </CustomLink>
            <CustomLink
              to="/contact"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </CustomLink>
            <div className="pt-4 border-t">
              {!user ? (
                // Show login/signup buttons if no user
                <div className="flex flex-col gap-3">
                  <CustomLink
                    to="/login"
                    className="block w-full py-2 text-center text-[var(--primary-500)] border border-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white rounded-md"
                  >
                    Login
                  </CustomLink>
                  <CustomLink
                    to="/register"
                    className="block w-full py-2 text-center bg-[var(--primary-500)] text-white rounded-md"
                  >
                    Sign Up
                  </CustomLink>
                </div>
              ) : (
                // Show user options if logged in
                <div className="flex flex-col gap-3">
                  <div className="py-2 px-3 bg-gray-50 rounded-md">
                    <p className="font-medium text-gray-800">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  {/* Mobile Notifications */}
                  <div className="notifications-container">
                    <button
                      onClick={() =>
                        setIsNotificationsOpen(!isNotificationsOpen)
                      }
                      className="flex items-center justify-between w-full py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FaBell className="w-4 h-4" />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotificationsOpen && (
                      <div className="mt-2 bg-gray-50 rounded-md overflow-hidden">
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 text-sm">
                              Notifications
                            </h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 font-medium"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-3 text-gray-500 text-center text-sm">
                              No notifications
                            </div>
                          ) : (
                            notifications.map(notification => (
                              <div
                                key={notification.id}
                                className={`p-3 border-l-4 ${
                                  !notification.read_at
                                    ? 'border-blue-500 bg-blue-50/50'
                                    : 'border-transparent'
                                }`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title || notification.message}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {notification.body || notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.created_at || notification.time}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={navigateToUserArea}
                    className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaUserCircle className="mr-3 h-4 w-4 text-gray-400" />
                    {role === 'student' ? 'Profile' : 'Dashboard'}
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
