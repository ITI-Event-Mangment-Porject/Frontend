import React from 'react';
import Layout from '../../components/common/Layout';
import DashboardComponent from '../../components/admin/Dashboard/Dashboard';
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../../hooks/useScrollToTop';

const Dashboard = () => {
  const navigate = useNavigate();
  useScrollToTop();

  return (
    <Layout>
      <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in  border-primary rounded-lg shadow-md transition-all duration-300 ease-out">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 animate-fade-in">
          Dashboard
        </h1>
        <DashboardComponent />

        {/* Quick Actions */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in "
          style={{ animationDelay: '0.3s' }}
        >
          <button
            onClick={() => navigate('/admin/events/create')}
            className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 hover:cursor-pointer  border-primary transition-all duration-200 transform hover:scale-105 hover:shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Create New Event
            </h3>
            <p className="text-gray-500 text-sm">
              Set up a new job fair or recruitment event
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 hover:cursor-pointer  border-primary transition-all duration-200 transform hover:scale-105 hover:shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Manage Users
            </h3>
            <p className="text-gray-500 text-sm">
              Add, remove, or update user accounts
            </p>
          </button>

          <button
            onClick={() => navigate('/admin/reports')}
            className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 hover:cursor-pointer border border-[var(--gray-200)] transition-all duration-200 transform hover:scale-105 hover:shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              View Reports
            </h3>
            <p className="text-gray-500 text-sm">
              Access analytics and attendance reports
            </p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
