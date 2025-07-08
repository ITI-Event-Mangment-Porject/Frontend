import React from 'react';
import { FaChartLine, FaBuilding } from 'react-icons/fa';
import Tabs from '../../common/Tabs';
import GeneralDashboard from './GeneralDashboard';
import JobFairTabs from './JobFairTabs';

const Dashboard = () => {
  // Define tabs configuration
  const dashboardTabs = [
    {
      id: 'general',
      label: 'General Dashboard',
      icon: <FaChartLine />,
      content: <GeneralDashboard />,
    },
    {
      id: 'job-fair',
      label: 'Job Fair Analytics',
      icon: <FaBuilding />,
      content: <JobFairTabs />,
    },
  ];

  return <Tabs tabs={dashboardTabs} defaultTab="general" />;
};

export default Dashboard;
