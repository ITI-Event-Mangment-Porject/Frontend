import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaBriefcase,
  FaDesktop,
  FaBell,
  FaListAlt,
  FaClipboardList,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'User Management' },
    { path: '/admin/events', icon: FaCalendarAlt, label: 'Manage Events' },
    {
      path: '/admin/attendance',
      icon: FaClipboardList,
      label: 'Attendance Reports',
    },
    { path: '/admin/feedback', icon: FaChartBar, label: 'Feedback Analytics' },
    { path: '/admin/companies', icon: FaBriefcase, label: 'Companies Setup' },
    { path: '/admin/monitor', icon: FaDesktop, label: 'Live Monitor' },
    { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
    { path: '/admin/queue', icon: FaListAlt, label: 'Queue Management' },
  ];
  return (
    <aside className="fixed left-0 top-16 z-40 mt-3 w-14 sm:w-20 md:w-20 lg:w-60 bg-white shadow-lg h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
      <div className="sm:p-2.5 h-full flex flex-col">
        {/* Header - Hide text on small screens */}
        <div className="mb-2 sm:mb-4 lg:mb-6 flex-shrink-0">
          <div className="lg:hidden flex justify-center"></div>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5 sm:space-y-1 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-center lg:justify-start px-1.5 sm:px-3 lg:px-3 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-all duration-200 relative sidebar-link ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={item.label} // Fallback tooltip
              >
                <Icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 lg:h-5 lg:w-5 flex-shrink-0 ${
                    isActive
                      ? 'text-red-700'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } lg:mr-3`}
                />
                <span className="hidden lg:block">{item.label}</span>
                {/* Custom tooltip for collapsed sidebar */}
                <div className="sidebar-tooltip lg:hidden">{item.label}</div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
