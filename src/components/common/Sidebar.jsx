import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUsers, FaUserCheck, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
<aside className="fixed top-[4rem] text-gray-600 left-0 h-full w-64 bg-white shadow-lg z-40">
  <nav className="flex flex-col mt-6 px-4 space-y-2">
    <NavLink
      to="/company"
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
          isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
        }`
      }
    >
      <FaHome /> Dashboard
    </NavLink>

    <NavLink
      to="/company/setup-form"
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
          isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
        }`
      }
    >
      <FaClipboardList /> Setup Form
    </NavLink>

    <NavLink
      to="/company/manage-requests"
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
          isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
        }`
      }
    >
      <FaUsers /> Manage Requests
    </NavLink>

    <NavLink
      to="/company/interview-tracking"
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
          isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
        }`
      }
    >
      <FaUserCheck /> Interview Tracking
    </NavLink>

    <NavLink
      to="/company/profile"
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
          isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
        }`
      }
    >
      <FaUser /> Company Profile
    </NavLink>
  </nav>
</aside>

  );
};

export default Sidebar;
