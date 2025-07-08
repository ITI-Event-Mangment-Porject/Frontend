import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaCalendarAlt,
  FaBuilding,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaFilter,
  FaInfoCircle,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import StatCounterSkeleton from '../../common/StatCounterSkeleton';
import useApi from '../../../hooks/useApi';
import { userAPI, eventAPI, companyAPI } from '../../../services/api';

const GeneralDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [eventDistributionData, setEventDistributionData] = useState([]);

  // API hooks
  const usersApi = useApi();
  const eventsApi = useApi();
  const companiesApi = useApi();

  // Function to get month name
  const getMonthName = monthIndex => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[monthIndex];
  };

  // Helper function to determine event status
  const determineEventStatus = event => {
    const today = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (event.status === 'completed') {
      return 'completed';
    } else if (event.status === 'ongoing') {
      return 'ongoing';
    } else if (today >= startDate && today <= endDate) {
      return 'ongoing';
    } else if (startDate > today) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');

        // Fetch all data in parallel using Promise.all
        const [usersResult, eventsResult, companiesResult] = await Promise.all([
          usersApi.execute(() => userAPI.getAll()),
          eventsApi.execute(() => eventAPI.getAll()),
          companiesApi.execute(() => companyAPI.getAll()),
        ]);

        console.log('Users:', usersResult);
        console.log('Events:', eventsResult);
        console.log('Companies:', companiesResult);

        // Process metrics data
        const metricsData = {
          totalUsers: usersResult?.data?.pagination?.total || 0,
          totalEvents: eventsResult?.data?.result?.total || 0,
          totalCompanies: companiesResult?.data?.companies?.total || 0,
          activeEvents:
            eventsResult?.data?.result?.data?.filter(
              e => e.status === 'published'
            )?.length || 0,
          pendingCompanies:
            companiesResult?.data?.companies?.data?.filter(
              c => c.status === 'pending'
            )?.length || 0,
          avgWaitTime: '24 min',
        };

        console.log('Metrics data:', metricsData);

        setMetrics(metricsData);

        // Process recent events data
        if (eventsResult?.data?.result?.data) {
          const events = eventsResult.data.result.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4)
            .map(event => ({
              id: event.id,
              title: event.title,
              date: new Date(event.start_date).toISOString().split('T')[0],
              location: event.location || 'Online',
              status: determineEventStatus(event),
              companies: event.companies_count || 0,
            }));

          setRecentEvents(events);
        }

        // Process user growth data
        if (usersResult?.data?.pagination?.data) {
          const users = usersResult.data.pagination.data || [];
          const currentDate = new Date();
          const chartData = [];

          // Generate data for the past 6 months
          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const monthName = getMonthName(monthIdx);

            // Count users by role created in this month
            const usersInMonth = users.filter(user => {
              if (!user.created_at) return false;
              const userDate = new Date(user.created_at);
              return (
                userDate.getMonth() === monthIdx &&
                userDate.getFullYear() === year
              );
            });

            const studentsCount = usersInMonth.filter(
              u => u.role === 'student'
            ).length;
            const companiesCount = usersInMonth.filter(
              u => u.role === 'company'
            ).length;

            chartData.push({
              month: monthName,
              students: studentsCount,
              companies: companiesCount,
            });
          }
        } else {
          // Generate placeholder data for user growth
          const currentDate = new Date();
          const chartData = [];

          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const monthName = getMonthName(date.getMonth());

            chartData.push({
              month: monthName,
              students: Math.floor(Math.random() * 100) + 100,
              companies: Math.floor(Math.random() * 20) + 10,
              staff: Math.floor(Math.random() * 10) + 5,
            });
          }
        }

        // Map events by ID for easy lookup
        const eventsById = {};
        if (eventsResult?.data?.result?.data) {
          eventsResult.data.result.data.forEach(event => {
            eventsById[event.id] = event;
          });
        }

        // Process event distribution data
        if (eventsResult?.data?.result?.data) {
          const events = eventsResult.data.result.data || [];

          // Count events by type
          const eventTypes = {};
          events.forEach(event => {
            const type = event.type || 'Job Fair';
            eventTypes[type] = (eventTypes[type] || 0) + 1;
          });

          // Generate pie chart data
          const colors = [
            '#8884d8',
            '#82ca9d',
            '#ffc658',
            '#ff8042',
            '#0088fe',
          ];
          const chartData = Object.entries(eventTypes).map(
            ([name, value], index) => ({
              name,
              value,
              color: colors[index % colors.length],
            })
          );

          setEventDistributionData(chartData);
        } else {
          // Fallback data
          setEventDistributionData([
            { name: 'Job Fair', value: 45, color: '#8884d8' },
            { name: 'Workshop', value: 25, color: '#82ca9d' },
            { name: 'Webinar', value: 15, color: '#ffc658' },
            { name: 'Networking', value: 10, color: '#ff8042' },
            { name: 'Other', value: 5, color: '#0088fe' },
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <StatCounterSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div className="text-red-500 text-5xl mb-4">
          <FaChartLine />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Data Loading Error
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          There was a problem loading your dashboard data. Please try refreshing
          the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--primary-500)] text-white rounded hover:bg-[var(--primary-600)] transition duration-200"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="general-dashboard">
      {/* Dashboard Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Total Users */}
        <motion.div
          onClick={() => navigate('/admin/users')}
          className=" cursor-pointer bg-white rounded-lg shadow-md p-6 border border-gray-100 flex items-center"
          whileHover={{
            y: -5,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-4 rounded-full bg-blue-100 mr-4">
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">
              {metrics.totalUsers}
            </p>
          </div>
        </motion.div>

        {/* Total Events */}
        <motion.div
          onClick={() => navigate('/admin/events')}
          className=" cursor-pointer bg-white rounded-lg shadow-md p-6 border border-gray-100 flex items-center"
          whileHover={{
            y: -5,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-4 rounded-full bg-green-100 mr-4">
            <FaCalendarAlt className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-800">
              {metrics.totalEvents}
            </p>
            <p className="text-xs text-green-500">
              {metrics.activeEvents} active now
            </p>
          </div>
        </motion.div>

        {/* Total Companies */}
        <motion.div
          onClick={() => navigate('/admin/companies')}
          className=" cursor-pointer bg-white rounded-lg shadow-md p-6 border border-gray-100 flex items-center"
          whileHover={{
            y: -5,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-4 rounded-full bg-[var(--gray-300)] mr-4">
            <FaBuilding className="text-[var(--gray-700)] text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Companies</p>
            <p className="text-2xl font-bold text-gray-800">
              {metrics.totalCompanies}
            </p>
            <p className="text-xs text-yellow-500">
              {metrics.pendingCompanies} pending approval
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts & Graphs Section */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Distribution (keep existing) */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Event Distribution
          </h3>
          <div className="h-64">
            {eventDistributionData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <FaChartLine className="text-gray-300 text-4xl mb-2" />
                <p className="text-gray-400">
                  No event distribution data available
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {eventDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} events`, name]}
                  />
                  <Legend
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Events Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Events</h2>
          <button
            onClick={() => navigate('/admin/events')}
            className="text-sm text-[var(--primary-500)] hover:text-[var(--primary-600)] hover:cursor-pointer font-medium"
          >
            View All
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaCalendarAlt className="text-gray-300 text-4xl mb-3" />
              <p className="text-gray-500 font-medium mb-1">No recent events</p>
              <p className="text-gray-400 text-sm">
                Create new events to see them here
              </p>
              <button
                onClick={() => navigate('/admin/events')}
                className="mt-4 px-4 py-2 bg-[var(--primary-500)] text-white rounded hover:bg-[var(--primary-600)] transition duration-200"
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Companies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEvents.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      className="hover:bg-gray-50 "
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {event.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {event.companies}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {' '}
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'upcoming'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'ongoing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GeneralDashboard;
