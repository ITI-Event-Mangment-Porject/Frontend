import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ searchQuery, setSearchQuery }) => (
  <nav className="flex items-center justify-between p-4 border-b w-full bg-white shadow-sm">
    <div className="flex items-center gap-8">
      <Link to="/" className="flex items-center gap-2">
        <img src="./logo.png" alt="Logo" className="w-20 h-20 ml-2" />
      </Link>

      <Link
        to="/"
        className="text-lg text-stone-950 font-semibold hover:text-orange-600 transition"
      >
        Dashboard
      </Link>

      <Link
        to="/company-directory"
        className="text-lg text-stone-950 font-semibold hover:text-orange-600 transition"
      >
        Directory
      </Link>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 w-64"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <Link to="/profile" className="hover:opacity-80 transition">
        <img
          className="rounded-full w-8 h-8 object-cover"
          src="./profile.jpg"
          alt="Profile"
        />
      </Link>

      <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition">
        Logout
      </button>
    </div>
  </nav>
);

Navbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default Navbar;
