import { NavLink, useParams } from 'react-router-dom';
import { FaClipboardList, FaUsers, FaUserCheck, FaUser } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Sidebar = () => {
  const { companyId } = useParams();
  const [jobFairId, setJobFairId] = useState(localStorage.getItem('jobFairId'));

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

        {jobFairId && (
          <>
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
          </>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;
