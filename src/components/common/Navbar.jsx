'use client';

import { useState, useEffect } from 'react';
import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLandmark, FaUser } from 'react-icons/fa';

const APP_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser || null);
  }, []);

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
      console.log(error);
      // Fallback to mock notifications if API fails
      const mockNotifications = [
        {
          id: 1,
          title: 'New user registration',
          body: 'A new user has registered',
          created_at: '5 minutes ago',
          read_at: null,
        },
        {
          id: 2,
          title: 'Event schedule updated',
          body: 'The schedule for upcoming events has been updated',
          created_at: '1 hour ago',
          read_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 3,
          title: 'System maintenance scheduled',
          body: 'System maintenance is scheduled for tonight',
          created_at: '2 hours ago',
          read_at: '2024-01-01T00:00:00Z',
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read_at).length);
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

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/80">
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 sm:p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#901b20]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#901b20]" />
              )}
            </button>

            {/* Logo Section */}
            <div
              className="flex items-center gap-2 sm:gap-4 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain"
                  />
                </div>
                <div className="absolute -inset-1 bg-[#eca8ac] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent">
                  CommunITI
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 sm:p-3 text-gray-600 hover:text-[#901b20] hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 sm:mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up z-50">
                  <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#901b20]" />
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#901b20] hover:text-[#7a1619] font-medium transition-colors duration-200"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200 border-l-4 cursor-pointer ${
                            !notification.read_at
                              ? 'border-[#901b20] bg-red-50/30'
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
                  <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
                    <button className="w-full text-sm text-[#901b20] hover:text-[#7a1619] font-medium transition-colors duration-200 py-2">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-32 lg:max-w-none">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-32 lg:max-w-none">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 hidden sm:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up z-50">
                  <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    {localStorage.getItem('role') === 'admin' ? (
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-[#901b20] rounded-xl transition-all duration-200 "
                      >
                        <FaLandmark className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">
                          Admin Dashboard
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          localStorage.getItem('role') === 'student'
                            ? navigate('/student/profile')
                            : localStorage.getItem('role') ===
                                'company_representative'
                              ? navigate('/company/profile')
                              : navigate('/admin/dashboard')
                        }
                        className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-[#901b20] rounded-xl transition-all duration-200"
                      >
                        <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">
                          Profile
                        </span>
                      </button>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium text-sm sm:text-base">
                        Sign out
                      </span>
                    </button>
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
