import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios'; // Adjust the import path as needed
const APP_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef();
  const userId = user ?.id ;

    useEffect(() => {
      console.log("Fetching notifications for user:", userId);
      if (!userId) return; 
      const unsubscribe = onSnapshot(collection
        (db, "notifications", String(userId), "user_notifications"),
        (snapshot) => {
          const newNotifications = [];
  
          snapshot.docChanges().forEach((change)=> {
            if(change.type === "added") {
              newNotifications.push({id: change.doc.id, ...change.doc.data()});
            }
          })
  
          if (newNotifications.length > 0) {
            setNotifications((prev) => [...prev, ...newNotifications]);
          }
        }
      )
      return () => unsubscribe();
      }, []);



  const fetchNotifications = () => {
    const token = localStorage.getItem('token');
    axios
      .get(`${APP_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const notifications = Array.isArray(res.data.data) ? res.data.data : [];
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read_at).length);
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  };

  const markAsRead = id => {
    const token = localStorage.getItem('token');
    axios
      .post(
        `${APP_URL}/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchNotifications();
      });
  };

  const markAllAsRead = () => {
    const token = localStorage.getItem('token');
    axios
      .post(
        `${APP_URL}/api/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchNotifications();
      });
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex hover:cursor-pointer justify-content-center align-content-center"
            onClick={() => navigate('/')}
          >
            <img src="/logo.webp" alt="Logo" className="h-20 w-auto ms-4" />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center" ref={dropdownRef}>
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleNotificationClick}
              >
                <FaBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 ring-2 ring-white text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                  <div className="py-1" role="menu">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!n.read_at ? 'bg-red-50' : ''}`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <p className="text-sm text-gray-900">
                            {n.title || 'Notification'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {n.body || n.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {n.created_at}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                className="flex items-center max-w-xs p-2 text-sm rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleProfileClick}
              >
                <FaUserCircle className="h-8 w-8" />
              </button>

              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/student/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      <FaUserCircle className="mr-3 h-4 w-4 text-gray-400" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                      Sign out
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
