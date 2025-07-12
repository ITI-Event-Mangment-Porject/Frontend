import { Bell, User, LogOut } from 'lucide-react';
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { db, collection, onSnapshot } from '../../../Firebase';

const Topbar = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [jobFairId, setJobFairId] = useState(localStorage.getItem('jobFairId'));
  const [companyData, setCompanyData] = useState(null);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchLatestPublishedJobFair = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/job-fairs`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allFairs = response.data.data?.result || [];
        const publishedFairs = allFairs.filter(fair => fair.status === "published");
        const latestFair = publishedFairs[publishedFairs.length - 1];

        if (latestFair?.id) {
          localStorage.setItem('jobFairId', latestFair.id);
          setJobFairId(latestFair.id);
        } else {
          localStorage.removeItem('jobFairId');
          setJobFairId(null);
        }
      } catch (error) {
        console.error('Failed to fetch job fair ID:', error);
      }
    };

    if (!jobFairId) {
      fetchLatestPublishedJobFair();
    }
  }, [companyId, jobFairId]);

  useEffect(() => {
    const fetchCompanyStatus = async () => {
      try {
        if (!jobFairId || !companyId) return;
        const token = localStorage.getItem('token');
        const res = await api.get(`/job-fairs/${jobFairId}/companies`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const companies = res.data.data?.result || [];
        const company = companies.find(c => String(c.companyId) === String(companyId));

        setCompanyData(prev => ({
          ...prev,
          ...company
        }));
      } catch (err) {
        console.error('Failed to fetch company status:', err);
      }
    };

    fetchCompanyStatus();
  }, [jobFairId, companyId]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        if (!companyId) return;
        const token = localStorage.getItem('token');
        const res = await api.get(`/companies/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data.data?.result || {};

        setCompanyData(prev => ({
          ...prev,
          logo_path: data.logo_path
            ? data.logo_path.startsWith('http')
              ? data.logo_path
              : `http://127.0.0.1:8000/storage/${data.logo_path}`
            : '',
          name: data.name || prev?.name,
          email: data.email || prev?.email,
        }));
      } catch (err) {
        console.error('Failed to fetch full company data:', err);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  // Firebase notifications
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(fetched.reverse());
      },
      (err) => console.error('Error fetching notifications:', err)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.notification-dropdown') &&
        !event.target.closest('.bell-button')
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isApproved = companyData?.status === 'approved';
  const navItems = [
    { label: "Profile", path: "profile", show: true },
    { label: "Participation Form", path: `job-fairs/${jobFairId}/setup`, show: !!jobFairId },
    { label: "Requests", path: `job-fairs/${jobFairId}/requests`, show: isApproved && !!jobFairId },
    { label: "Tracking", path: "tracking", show: isApproved },
  ].filter(item => item.show);

  return (
    <header className="fixed w-full bg-white/10 backdrop-blur-3xl border-b border-white/20 px-8 py-4 z-50 overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-[#901b20]/15 to-[#ad565a]/15 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-0 right-1/3 w-16 h-16 bg-gradient-to-br from-[#203947]/15 to-[#901b20]/15 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center justify-center h-12">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#901b20]/20 to-[#ad565a]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src="/logo.png"
              alt="Company Logo"
              onClick={() => navigate("/")}
              className="relative h-40 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        <nav className="hidden md:flex gap-2 text-sm font-medium">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={`/company/${companyId}/${path}`}
              end
              className={({ isActive }) =>
                `group relative px-6 py-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide overflow-hidden ${
                  isActive
                    ? "text-white bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 shadow-xl shadow-[#901b20]/25"
                    : "text-slate-700 hover:text-[#901b20] hover:bg-white/20 hover:shadow-lg hover:shadow-black/10 backdrop-blur-sm"
                }`
              }
            >
              <span className="relative z-10">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 relative">
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bell-button group relative p-3 rounded-2xl text-slate-600 hover:text-[#901b20] transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-black/10 backdrop-blur-sm transform hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <Bell size={18} className="relative z-10" />
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notification-dropdown absolute right-14 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto animate-scale-up">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3 border-b last:border-none hover:bg-gray-50">
                    <p className="text-sm text-gray-800">{notif.title || "No Title"}</p>
                    <p className="text-xs text-gray-500">{notif.body || "No Body"}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
              className="flex items-center focus:outline-none group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#901b20]/50 to-[#ad565a]/50 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={
                  companyData?.logo_path && companyData.logo_path !== ''
                    ? companyData.logo_path
                    : "https://i.pravatar.cc/32"
                }
                alt="Company Logo"
                className="relative w-10 h-10 rounded-full border-2 border-white/30 transition-transform duration-300 group-hover:scale-110 cursor-pointer object-cover"
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/32";
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </button>

            {isCompanyMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up z-50">
                <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {companyData?.name || 'Company Name'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {companyData?.email || 'company@email.com'}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => navigate(`/company/${companyId}/profile`)}
                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-[#901b20] rounded-xl transition-all duration-200"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
