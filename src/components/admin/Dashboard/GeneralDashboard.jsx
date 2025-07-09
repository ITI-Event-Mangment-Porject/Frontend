import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaCalendarAlt,
  FaBuilding,
  FaChartLine,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  const [companyStatsData, setCompanyStatsData] = useState([]);

  // API hooks
  const usersApi = useApi();
  const eventsApi = useApi();
  const companiesApi = useApi();

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

  // Helper function to fetch all pages of companies
  const fetchAllCompanies = async () => {
    let allCompanies = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        console.log(`Fetching companies page ${currentPage}...`);
        const result = await companiesApi.execute(() =>
          companyAPI.getAll({ page: currentPage, per_page: 100 })
        );

        if (result?.data?.companies?.data) {
          allCompanies = [...allCompanies, ...result.data.companies.data];

          // Check if there are more pages
          const pagination = result.data.companies;
          if (pagination.current_page < pagination.last_page) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`Error fetching companies page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    console.log(
      `Fetched total of ${allCompanies.length} companies across all pages`
    );
    return allCompanies;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');

        // Fetch all data in parallel, but companies needs special handling for pagination
        const [usersResult, eventsResult, allCompanies] = await Promise.all([
          usersApi.execute(() => userAPI.getAll()),
          eventsApi.execute(() => eventAPI.getAll()),
          fetchAllCompanies(),
        ]);

        console.log('Users:', usersResult);
        console.log('Events:', eventsResult);
        console.log('All Companies:', allCompanies);

        // Process metrics data
        const metricsData = {
          totalUsers: usersResult?.data?.pagination?.total || 0,
          totalEvents: eventsResult?.data?.result?.total || 0,
          totalCompanies: allCompanies?.length || 0,
          activeEvents:
            eventsResult?.data?.result?.data?.filter(
              e => e.status === 'published'
            )?.length || 0,
          pendingCompanies:
            allCompanies?.filter(c => c.status === 'pending')?.length || 0,
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

        // Process company statistics data
        console.log('Processing company statistics data...');
        if (allCompanies && allCompanies.length > 0) {
          console.log('Found companies:', allCompanies.length);

          // Count companies by approval status
          const statusCounts = {
            approved: 0,
            rejected: 0,
            pending: 0,
          };

          allCompanies.forEach(company => {
            const status =
              company.status || company.approval_status || 'pending';
            // eslint-disable-next-line no-prototype-builtins
            if (statusCounts.hasOwnProperty(status)) {
              statusCounts[status]++;
            } else {
              // Handle variations in status naming
              if (status === 'accepted' || status === 'active') {
                statusCounts.approved++;
              } else if (status === 'declined' || status === 'inactive') {
                statusCounts.rejected++;
              } else {
                statusCounts.pending++;
              }
            }
          });

          const chartData = [
            {
              status: 'Approved',
              count: statusCounts.approved,
              color: '#10b981', // Green
            },
            {
              status: 'Pending',
              count: statusCounts.pending,
              color: '#f59e0b', // Yellow/Orange
            },
            {
              status: 'Rejected',
              count: statusCounts.rejected,
              color: '#ef4444', // Red
            },
          ];

          console.log('Company statistics chart data:', chartData);
          setCompanyStatsData(chartData);
        } else {
          console.log('No company data found from API');
          // Set empty array if no data from API
          setCompanyStatsData([]);
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
          // Set empty array if no data from API
          setEventDistributionData([]);
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
        {/* Event Distribution */}
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

        {/* Company Statistics Chart */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Company Approval Status
          </h3>
          <div className="h-64">
            {companyStatsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <FaBuilding className="text-gray-300 text-4xl mb-2" />
                <p className="text-gray-400">No company data available</p>
                <p className="text-gray-400 text-sm">
                  Data will appear when companies register
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={companyStatsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} companies`,
                      props.payload.status,
                    ]}
                    labelFormatter={label => `Status: ${label}`}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={entry => entry.color}
                    radius={[4, 4, 0, 0]}
                  >
                    {companyStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
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
