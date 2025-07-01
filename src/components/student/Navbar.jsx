import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

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
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <FaBell className="w-6 h-6" />
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
