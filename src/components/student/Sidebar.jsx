import { NavLink } from 'react-router-dom';
import { Home, Calendar, Briefcase, Clock, User } from 'lucide-react';

function Sidebar() {
  const linkStyle = ({ isActive }) =>
    `text-lg px-3 py-2 rounded transition duration-300 w-full flex items-center ${
      isActive
        ? 'bg-red-800 text-white font-semibold'
        : 'hover:underline hover:bg-red-800 hover:text-white'
    }`;

  return (
    <div className="sidebar">
      <nav className="flex flex-col items-start p-4 border-r w-64 bg-white h-full">
        <ul className="space-y-2 w-full">
          <li>
            <NavLink to="/" className={linkStyle}>
              <Home className="mr-3 w-5 h-5" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/event-details" className={linkStyle}>
              <Calendar className="mr-3 w-5 h-5" />
              Event Details
            </NavLink>
          </li>
          <li>
            <NavLink to="/company-directory" className={linkStyle}>
              <Briefcase className="mr-3 w-5 h-5" />
              Directory
            </NavLink>
          </li>
          <li>
            <NavLink to="/interview-queue" className={linkStyle}>
              <Clock className="mr-3 w-5 h-5" />
              Queue Status
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={linkStyle}>
              <User className="mr-3 w-5 h-5" />
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
