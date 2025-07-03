import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://127.0.0.1:8000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        // Count notifications where read_at is null (unread)
        const notifications = Array.isArray(res.data.data) ? res.data.data : [];
        const count = notifications.filter(n => !n.read_at).length;
        setUnreadCount(count);
      })
      .catch(() => setUnreadCount(0));
  }, []);

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

      <div className="flex items-center gap-4">
        <Link to="/profile" className="hover:opacity-80 transition">
          <img
            className="rounded-full w-8 h-8 object-cover"
            src="./profile.jpg"
            alt="Profile"
          />
        </Link>

        <Link
          to="/notifications"
          className="relative text-gray-500 hover:text-gray-700 transition"
        >
          <FaBell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Link>

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
