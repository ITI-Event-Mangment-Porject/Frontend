import { NavLink, useParams } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUsers, FaUserCheck, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const { companyId,  jobFairId} = useParams();

  return (
    <aside className="fixed top-[4rem] text-gray-600 left-0 h-full w-64 bg-white shadow-lg z-40">
      <nav className="flex flex-col mt-6 px-4 space-y-2">
        
        <NavLink
          to={`/company/${companyId}/profile`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
              isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
            }`
          }
        >
          <FaUser /> Company Profile
        </NavLink>

        <NavLink
          to={`/company/${companyId}/job-fairs/${jobFairId}/setup`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
              isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
            }`
          }
        >
          <FaClipboardList /> Participation Form
        </NavLink>

        <NavLink
          to={`/company/${companyId}/requests`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
              isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
            }`
          }
        >
          <FaUsers /> Manage Requests
        </NavLink>

        <NavLink
          to={`/company/${companyId}/tracking`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-200 ${
              isActive ? 'bg-gray-700 text-white' : 'hover:bg-[#a72b2b] hover:text-white'
            }`
          }
        >
          <FaUserCheck /> Interview Tracking
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
