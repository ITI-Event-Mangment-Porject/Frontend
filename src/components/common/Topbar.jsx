import { Bell, Settings } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const { companyId } = useParams();
  const [jobFairId, setJobFairId] = useState(localStorage.getItem('jobFairId'));
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchLatestPublishedJobFair = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/job-fairs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

        setCompanyData(company || null);
        
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

      const data = res.data.data;

      setCompanyData(prev => ({
        ...prev, // عشان نحتفظ بالـ status من الـ API الأول
        logo_path: data.logo_path 
    ? data.logo_path.startsWith('http')
      ? data.logo_path
      : `http://127.0.0.1:8000/storage/${data.logo_path}`
    : ''
      }));
    } catch (err) {
      console.error('Failed to fetch full company data:', err);
    }
  };

  fetchCompanyDetails();
  
}, [companyId]);


  const isApproved = companyData?.status === 'approved';
  const isActive = useLocation().pathname.includes(companyId);

  const navItems = [
    { label: "Profile", path: "profile", show: true },
    { label: "Participation Form", path: `job-fairs/${jobFairId}/setup`, show: !!jobFairId },
    { label: "Requests", path: `job-fairs/${jobFairId}/requests`, show: isApproved && !!jobFairId },
    { label: "Tracking", path: "tracking", show: isApproved },
  ].filter(item => item.show);

  return (
    <header className="fixed w-full bg-white/10 backdrop-blur-3xl border-b border-white/20 px-8 py-4 z-50 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      {/* Floating orb effects */}
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-[#901b20]/15 to-[#ad565a]/15 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-0 right-1/3 w-16 h-16 bg-gradient-to-br from-[#203947]/15 to-[#901b20]/15 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-12">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#901b20]/20 to-[#ad565a]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="relative h-40 transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
        </div>

        {/* Navigation */}
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
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <button className="group relative p-3 rounded-2xl text-slate-600 hover:text-[#901b20] transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-black/10 backdrop-blur-sm transform hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <Bell size={18} className="relative z-10" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full animate-pulse" />
          </button>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#901b20]/50 to-[#ad565a]/50 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
<img 
  src={
    companyData?.logo_path
      ? companyData.logo_path
      : "https://i.pravatar.cc/32"
  } 
  alt="Company Logo" 
  className="relative w-10 h-10 rounded-full border-2 border-white/30 transition-transform duration-300 group-hover:scale-110 cursor-pointer"
/>




            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;