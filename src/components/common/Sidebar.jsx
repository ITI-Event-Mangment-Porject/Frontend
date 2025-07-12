'use client';

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Building2,
  Eye,
  Bell,
  UserCheck,
  BarChart3,
  FormInput,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
  List,
  Briefcase,
  Clock,
  User,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('role');

  // Navigation items based on role
  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            path: '/admin/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
          },
          { path: '/admin/users', icon: Users, label: 'User Management' },
          { path: '/admin/events', icon: Calendar, label: 'Manage Events' },
          {
            path: '/admin/attendance',
            icon: FileText,
            label: 'Attendance Reports',
          },
          {
            path: '/admin/jobfair',
            icon: Building2,
            label: 'Job Fair Management',
          },
          {
            path: '/admin/FeedbackAnalytics',
            icon: BarChart3,
            label: 'Feedback Analytics',
          },
          {
            path: '/admin/companies',
            icon: Building2,
            label: 'Companies Setup',
          },
          { path: '/admin/liveevents', icon: Eye, label: 'Events Monitoring' },
          { path: '/admin/brandingDay', icon: Zap, label: 'Branding Day' },
          { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
          {
            path: '/admin/LiveQueue',
            icon: UserCheck,
            label: 'Live Interview Queues',
          },
          {
            path: '/admin/createFeedbackForm',
            icon: FormInput,
            label: 'Create Feedback Form',
          },
        ];
      case 'student':
        return [
          {
            path: '/student/CompanyDirectory',
            icon: Briefcase,
            label: 'Job Fair Companies',
          },
          {
            path: '/student/interview-queue',
            icon: Clock,
            label: 'Queue Status',
          },
        ];
      case 'company_representative':
        return [
          {
            path: '/company/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
          },
          { path: '/company/setup', icon: Building2, label: 'Company Setup' },
          {
            path: '/company/interviews',
            icon: UserCheck,
            label: 'Interview Management',
          },
          {
            path: '/company/requests',
            icon: FileText,
            label: 'Manage Requests',
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Panel title based on role
  const getPanelTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Panel';
      case 'student':
        return 'Student Panel';
      case 'company_representative':
        return 'Company Panel';
      default:
        return 'Dashboard';
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  return (
    <>
      {/* Sidebar with proper spacing from navbar and aligned with content - Fixed z-index */}
      <div
        className={`fixed left-0 bg-white/95 backdrop-blur-lg border-r border-gray-200/80 transition-all duration-300 z-50 shadow-2xl ${
          isCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } top-16 sm:top-18 lg:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]`}
      >
        {/* Header - aligned with main content */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200/80 bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5">
          {!isCollapsed && (
            <div className="flex items-center gap-2 sm:gap-3 animate-slide-in-right">
              <div className="hidden sm:block">
                <h2 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">
                  {getPanelTitle()}
                </h2>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#901b20]" />
            </button>

            {/* Collapse/Expand button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#901b20]" />
              ) : (
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#901b20]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto flex-1 custom-scrollbar">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.path}
                className="animate-slide-in-left"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 group-hover:text-[#901b20]'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="font-medium text-sm sm:text-base">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-60 shadow-xl">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
