import { Bell, Settings } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';

const Topbar = () => {
  const { companyId, jobFairId } = useParams();

  return (
    <header className="fixed w-full flex items-center justify-between bg-white shadow-sm px-6 py-3 z-50">

      <div className="flex items-center justify-center h-10">
        <img src="/logo.png" alt="Company Logo" className="h-24" />
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium">
        {[
          { label: "Profile", path: "profile" },
          // { label: "Dashboard", path: "dashboard" },
          { label: "Participation Form", path: `job-fairs/${jobFairId}/setup` },
          { label: "Requests", path: "requests" },
          { label: "Tracking", path: "tracking" },

        ].map(({ label, path }) => (
          <NavLink
            key={path}
            to={`/company/${companyId}/${path}`}
            end
            className={({ isActive }) =>
              `px-2 py-1 border-b-2 transition duration-300 ${
                isActive
                  ? "text-[#1f2a3b] border-[#1f2a3b] font-semibold"
                  : "text-gray-600 border-transparent hover:text-[#a72b2b] hover:border-[#a72b2b]"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-[#a72b2b]">
          <Bell size={20} />
        </button>
        <button className="text-gray-600 hover:text-[#a72b2b]">
          <Settings size={20} />
        </button>
        <img
          src="https://i.pravatar.cc/32"
          alt="User"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
      </div>
    </header>
  );
};

export default Topbar;
