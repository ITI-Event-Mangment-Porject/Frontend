import { NavLink } from 'react-router-dom';

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
              <i className="fa-solid fa-house mr-3 text-xl"></i>Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/event-details" className={linkStyle}>
              <i className="fa-solid fa-calendar mr-3 text-xl"></i>Event Details
            </NavLink>
          </li>
          <li>
            <NavLink to="/company-directory" className={linkStyle}>
              <i className="fa-solid fa-suitcase mr-3 text-xl"></i>Directory
            </NavLink>
          </li>
          <li>
            <NavLink to="/interview-queue" className={linkStyle}>
              <i className="fa-solid fa-clock mr-3 text-xl"></i>Queue Status
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={linkStyle}>
              <i className="fa-solid fa-user mr-3 text-xl"></i>Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
