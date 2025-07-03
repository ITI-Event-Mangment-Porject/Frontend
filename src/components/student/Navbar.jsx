import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    fetchNotifications();
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://127.0.0.1:8000/api/notifications', {
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

  const markAsRead = (id) => {
    const token = localStorage.getItem('token');
    axios.post(
      `http://127.0.0.1:8000/api/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      fetchNotifications();
    });
  };

  const markAllAsRead = () => {
    const token = localStorage.getItem('token');
    axios.post(
      'http://127.0.0.1:8000/api/notifications/mark-all-read',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      fetchNotifications();
    });
  };

  const handleBellClick = () => {
    setDropdownOpen(!dropdownOpen);
    // Optionally, mark all as read when opening:
    // notifications.forEach(n => { if (!n.read_at) markAsRead(n.id); });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b w-full bg-white shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <img src="./logo.webp" alt="Logo" className="w-20 h-20 ml-2" />
        </Link>
      </div>

      <div className="flex items-center gap-4" ref={dropdownRef}>
        <Link to="/profile" className="hover:opacity-80 transition">
          <img
            className="rounded-full w-8 h-8 object-cover"
            src="./profile.jpg"
            alt="Profile"
          />
        </Link>

        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative text-gray-500 hover:text-gray-700 transition"
          >
            <FaBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b font-bold flex justify-between items-center">
                Notifications
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-orange-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-4 border-b cursor-pointer hover:bg-orange-50 ${!n.read_at ? 'bg-orange-50' : ''}`}
                    onClick={() => {
                      markAsRead(n.id);
                      // Optionally navigate:
                      // navigate(n.link || '/notifications');
                    }}
                  >
                    <div className="font-medium">{n.title || 'Notification'}</div>
                    <div className="text-sm text-gray-600">{n.body || n.message}</div>
                    <div className="text-xs text-gray-400">{n.created_at}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
