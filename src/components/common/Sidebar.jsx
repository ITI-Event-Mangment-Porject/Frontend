import { NavLink, useParams, useLocation } from 'react-router-dom';
import { FaClipboardList, FaUsers, FaUserCheck, FaUser } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Sidebar = () => {
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

  const isApproved = companyData?.status === 'approved';
  const isActive = useLocation().pathname.includes(`/company/${companyId}`);

  return (
    <aside className="fixed top-[4rem] left-0 h-full w-72 bg-white/5 backdrop-blur-3xl border-r border-white/10 z-40 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
      
      {/* Floating orb effect */}
      <div className="absolute top-20 -left-10 w-32 h-32 bg-gradient-to-br from-[#901b20]/20 to-[#ad565a]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 -right-10 w-24 h-24 bg-gradient-to-br from-[#203947]/20 to-[#901b20]/20 rounded-full blur-2xl animate-pulse delay-1000" />
      
      <nav className="relative flex flex-col mt-12 px-8 space-y-4">
        <NavLink
          to={`/company/${companyId}/profile`}
          className={({ isActive }) =>
            `group flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-500 ease-out transform hover:-translate-y-1 font-medium text-sm tracking-wide relative overflow-hidden ${
              isActive 
                ? 'bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 text-white shadow-2xl shadow-[#901b20]/25 scale-105' 
                : 'text-slate-700 hover:bg-white/20 hover:text-[#901b20] hover:shadow-xl hover:shadow-black/10 backdrop-blur-sm'
            }`
          }
        >
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'
          }`}>
            <FaUser className="text-base" />
          </div>
          <span className="relative z-10">Company Profile</span>
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </NavLink>

        {jobFairId && (
          <>
            <NavLink
              to={`/company/${companyId}/job-fairs/${jobFairId}/setup`}
              className={({ isActive }) =>
                `group flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-500 ease-out transform hover:-translate-y-1 font-medium text-sm tracking-wide relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 text-white shadow-2xl shadow-[#901b20]/25 scale-105' 
                    : 'text-slate-700 hover:bg-white/20 hover:text-[#901b20] hover:shadow-xl hover:shadow-black/10 backdrop-blur-sm'
                }`
              }
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <FaClipboardList className="text-base" />
              </div>
              <span className="relative z-10">Participation Form</span>
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </NavLink>
            
            {isApproved && (
              <>
                <NavLink
                  to={`/company/${companyId}/job-fairs/${jobFairId}/requests`}
                  className={({ isActive }) =>
                    `group flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-500 ease-out transform hover:-translate-y-1 font-medium text-sm tracking-wide relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 text-white shadow-2xl shadow-[#901b20]/25 scale-105' 
                        : 'text-slate-700 hover:bg-white/20 hover:text-[#901b20] hover:shadow-xl hover:shadow-black/10 backdrop-blur-sm'
                    }`
                  }
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <FaUsers className="text-base" />
                  </div>
                  <span className="relative z-10">Manage Requests</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </NavLink>

                <NavLink
                  to={`/company/${companyId}/tracking`}
                  className={({ isActive }) =>
                    `group flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-500 ease-out transform hover:-translate-y-1 font-medium text-sm tracking-wide relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 text-white shadow-2xl shadow-[#901b20]/25 scale-105' 
                        : 'text-slate-700 hover:bg-white/20 hover:text-[#901b20] hover:shadow-xl hover:shadow-black/10 backdrop-blur-sm'
                    }`
                  }
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <FaUserCheck className="text-base" />
                  </div>
                  <span className="relative z-10">Interview Tracking</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;