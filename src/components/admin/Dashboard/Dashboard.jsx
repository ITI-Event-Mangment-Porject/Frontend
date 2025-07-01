import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FaUsers, FaCalendarAlt, FaBuilding, FaClock } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import { userAPI, eventAPI, companyAPI } from '../../../services/api';
import StatCounterSkeleton from '../../common/StatCounterSkeleton';

// Sample data for charts - will be replaced with real data
const monthlyData = [
  { name: 'Jan', users: 240, events: 30, companies: 12 },
  { name: 'Feb', users: 300, events: 40, companies: 15 },
  { name: 'Mar', users: 450, events: 35, companies: 18 },
  { name: 'Apr', users: 600, events: 50, companies: 22 },
  { name: 'May', users: 800, events: 55, companies: 25 },
  { name: 'Jun', users: 950, events: 60, companies: 28 },
];

const queueData = [
  { name: '9 AM', time: 5 },
  { name: '10 AM', time: 10 },
  { name: '11 AM', time: 15 },
  { name: '12 PM', time: 20 },
  { name: '1 PM', time: 15 },
  { name: '2 PM', time: 10 },
  { name: '3 PM', time: 5 },
  { name: '4 PM', time: 5 },
];

// Define colors for the system metrics pie chart
const systemMetricsColors = {
  users: '#8884d8', // Purple for users
  events: '#82ca9d', // Green for events
  companies: '#ffc658', // Yellow for companies
};

// Month mapping for date processing
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

const Dashboard = () => {
  // Initialize the navigate function
  const navigate = useNavigate(); // API hooks for fetching data
  const usersApi = useApi();
  const eventsApi = useApi();
  const companiesApi = useApi();

  // State for actual data
  const [actualData, setActualData] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalCompanies: 0,
    queueTime: 0,
  });

  // State for event and company statistics by month
  const [statisticsData, setStatisticsData] = useState([]);

  // State for animated counters
  const [counters, setCounters] = useState({
    users: 0,
    events: 0,
    companies: 0,
    queueTime: 0,
  });
  // Refs for animation
  const counterRefs = {
    users: useRef(null),
    events: useRef(null),
    companies: useRef(null),
    queueTime: useRef(null),
  }; // Fetch dashboard data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel using Promise.all
        const [usersResult, eventsResult, companiesResult] = await Promise.all([
          usersApi.execute(() => userAPI.getAll()),
          eventsApi.execute(() => eventAPI.getAll()),
          companiesApi.execute(() => companyAPI.getAll()),
        ]);
        console.log('eventsResult', eventsResult);
        console.log('companiesResult', companiesResult);

        // Update state with all results at once
        setActualData(prev => ({
          ...prev,
          totalUsers: (usersResult && usersResult.data?.pagination?.total) || 0,
          totalEvents: (eventsResult && eventsResult.data?.result?.total) || 0,
          totalCompanies: (companiesResult && companiesResult.length) || 0,
          queueTime: 15, // Static value for now
        }));

        // Process events and companies data for monthly statistics
        if (eventsResult?.data?.result?.events && companiesResult) {
          // Process events data by month
          const eventsByMonth = {};
          const events = eventsResult.data.result.events;

          events.forEach(event => {
            if (event.date) {
              const date = new Date(event.date);
              const monthIdx = date.getMonth();
              const monthName = months[monthIdx];

              if (!eventsByMonth[monthName]) {
                eventsByMonth[monthName] = 0;
              }
              eventsByMonth[monthName]++;
            }
          });

          // Process companies data by month
          const companiesByMonth = {};
          const companies = companiesResult;

          companies.forEach(company => {
            if (company.createdAt) {
              const date = new Date(company.createdAt);
              const monthIdx = date.getMonth();
              const monthName = months[monthIdx];

              if (!companiesByMonth[monthName]) {
                companiesByMonth[monthName] = 0;
              }
              companiesByMonth[monthName]++;
            }
          });

          // Create monthly statistics array for the chart
          const chartData = months.map(month => ({
            name: month,
            events: eventsByMonth[month] || 0,
            companies: companiesByMonth[month] || 0,
          }));

          // Filter to only include months with data
          const filteredChartData = chartData.filter(
            item => item.events > 0 || item.companies > 0
          );

          // If no filtered data, use at least the last 6 months
          const dataToUse =
            filteredChartData.length > 0
              ? filteredChartData
              : chartData.slice(
                  Math.max(0, new Date().getMonth() - 5),
                  new Date().getMonth() + 1
                );

          setStatisticsData(dataToUse);
        } else {
          // Fallback to sample data if API data is not available
          setStatisticsData(monthlyData);
        }

        // Log any errors
        if (usersResult && usersResult.success === false) {
          console.error('Failed to fetch users:', usersResult.message);
        }
        if (eventsResult && eventsResult.success === false) {
          console.error('Failed to fetch events:', eventsResult.message);
        }
        if (companiesResult && companiesResult.success === false) {
          console.error('Failed to fetch companies:', companiesResult.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set to 0 to avoid showing stale data
        setActualData(prev => ({
          ...prev,
          totalUsers: 0,
          totalEvents: 0,
          totalCompanies: 0,
          queueTime: 0,
        }));
        // Use sample data if there's an error
        setStatisticsData(monthlyData);
      }
    };

    fetchDashboardData();
  }, []);

  // Animate the counters on component mount and when actual data changes
  useEffect(() => {
    const targetValues = {
      users: actualData.totalUsers,
      events: actualData.totalEvents,
      companies: actualData.totalCompanies,
      queueTime: 30,
    };

    const step = {
      users: Math.ceil(targetValues.users / 30),
      events: Math.ceil(targetValues.events / 30),
      companies: Math.ceil(targetValues.companies / 30),
      queueTime: Math.ceil(targetValues.queueTime / 30),
    };

    const interval = setInterval(() => {
      setCounters(prevCounters => {
        const newCounters = { ...prevCounters };
        let allDone = true;

        Object.keys(targetValues).forEach(key => {
          if (newCounters[key] < targetValues[key]) {
            newCounters[key] = Math.min(
              newCounters[key] + step[key],
              targetValues[key]
            );
            allDone = false;
          }
        });

        if (allDone) {
          clearInterval(interval);
          // Add animated class to all counter elements
          Object.keys(counterRefs).forEach(key => {
            if (counterRefs[key].current) {
              counterRefs[key].current.classList.add('animated');
            }
          });
        }

        return newCounters;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [actualData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {' '}
        <div
          className="bg-white rounded-lg border-primary hover:cursor-pointer shadow-sm p-6 transform transition-all duration-300 hover:shadow-md hover:scale-105 animate-fade-in stat-card"
          style={{ animationDelay: '0.1s' }}
          onClick={() => navigate('/admin/users')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>{' '}
              {usersApi.loading ? (
                <StatCounterSkeleton width="w-28" height="h-9" />
              ) : (
                <>
                  <p className="text-3xl font-semibold text-gray-900">
                    {usersApi.error ? (
                      <span className="text-red-500">
                        <span className="text-xl">!</span> Error
                      </span>
                    ) : (
                      <span
                        ref={counterRefs.users}
                        className="counter-animation"
                      >
                        {counters.users.toLocaleString()}
                      </span>
                    )}
                  </p>
                  <div
                    className={`text-sm mt-2 ${usersApi.error ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {usersApi.error
                      ? 'Failed to fetch'
                      : '↑ 12% from last month'}
                  </div>
                </>
              )}
            </div>
            <div className="bg-indigo-100 p-3 rounded-full animate-pulse">
              <FaUsers className="text-indigo-500 text-xl" />
            </div>
          </div>
        </div>{' '}
        <div
          className="bg-white rounded-lg shadow-sm p-6 hover:cursor-pointer border-primary transform transition-all duration-300 hover:shadow-md hover:scale-105 animate-fade-in stat-card"
          style={{ animationDelay: '0.2s' }}
          onClick={() => navigate('/admin/events')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Active Events
              </h3>{' '}
              {eventsApi.loading ? (
                <StatCounterSkeleton width="w-20" height="h-9" />
              ) : (
                <>
                  <p className="text-3xl font-semibold text-gray-900">
                    {eventsApi.error ? (
                      <span className="text-red-500">
                        <span className="text-xl">!</span> Error
                      </span>
                    ) : (
                      <span
                        ref={counterRefs.events}
                        className="counter-animation"
                      >
                        {counters.events}
                      </span>
                    )}
                  </p>
                  <div
                    className={`text-sm mt-2 ${eventsApi.error ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {eventsApi.error
                      ? 'Failed to fetch'
                      : '↑ 5% from last week'}
                  </div>
                </>
              )}
            </div>
            <div className="bg-green-100 p-3 rounded-full animate-pulse">
              <FaCalendarAlt className="text-green-500 text-xl" />
            </div>
          </div>
        </div>{' '}
        <div
          className="bg-white rounded-lg shadow-sm p-6 border-primary transform transition-all duration-300 hover:shadow-md hover:scale-105 animate-fade-in stat-card hover:cursor-pointer"
          style={{ animationDelay: '0.3s' }}
          onClick={() => navigate('/admin/companies')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Companies</h3>{' '}
              {companiesApi.loading ? (
                <StatCounterSkeleton width="w-24" height="h-9" />
              ) : (
                <>
                  <p className="text-3xl font-semibold text-gray-900">
                    {companiesApi.error ? (
                      <span className="text-red-500">
                        <span className="text-xl">!</span> Error
                      </span>
                    ) : (
                      <span
                        ref={counterRefs.companies}
                        className="counter-animation"
                      >
                        {counters.companies}
                      </span>
                    )}
                  </p>
                  <div
                    className={`text-sm mt-2 ${companiesApi.error ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {companiesApi.error
                      ? 'Failed to fetch'
                      : '↑ 8% from last month'}
                  </div>
                </>
              )}
            </div>
            <div className="bg-blue-100 p-3 rounded-full animate-pulse">
              <FaBuilding className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>{' '}
        <div
          className="bg-white rounded-lg shadow-sm p-6 border-primary transform transition-all duration-300 hover:shadow-md hover:scale-105 animate-fade-in stat-card hover:cursor-pointer"
          style={{ animationDelay: '0.4s' }}
          onClick={() => navigate('/admin/queue')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                Average Queue Time
              </h3>{' '}
              {queueData.length === 0 ? (
                <StatCounterSkeleton width="w-32" height="h-9" />
              ) : (
                <>
                  <p className="text-3xl font-semibold text-gray-900">
                    {counters.queueTime} mins
                  </p>
                  <div className="text-sm mt-2 text-green-600">
                    ↑ 10% from last week
                  </div>
                </>
              )}
            </div>
            <div className="bg-amber-100 p-3 rounded-full animate-pulse">
              <FaClock className="text-amber-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Trends */}
        <div
          className="bg-white rounded-lg shadow-sm p-6 animate-fade-in chart-container  border-primary"
          style={{ animationDelay: '0.5s' }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Growth Trends
          </h2>
          {usersApi.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-full h-64 animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : usersApi.error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-center">Error loading user data</p>
              <p className="text-sm text-center mt-1">Please try again later</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={statisticsData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="events"
                  name="Events"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Event & Company Statistics */}
        <div
          className="bg-white rounded-lg shadow-sm p-6 animate-fade-in chart-container  border-primary"
          style={{ animationDelay: '0.6s' }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Event & Company Statistics
          </h2>
          {eventsApi.loading || companiesApi.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-full h-64 animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : eventsApi.error || companiesApi.error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-center">Error loading chart data</p>
              <p className="text-sm text-center mt-1">Please try again later</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statisticsData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="events"
                  fill="#82ca9d"
                  name="Events"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="companies"
                  fill="#ffc658"
                  name="Companies"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8  ">
        {/* Queue Time Distribution */}
        <div
          className="bg-white rounded-lg shadow-sm p-6 animate-fade-in chart-container border-primary"
          style={{ animationDelay: '0.7s' }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Queue Time Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={queueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#ff8042"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Metrics Distribution */}
        <div
          className="bg-white rounded-lg shadow-sm p-6 animate-fade-in chart-container pie-chart-container border-primary"
          style={{ animationDelay: '0.8s' }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            System Metrics Distribution
          </h2>
          {usersApi.loading || eventsApi.loading || companiesApi.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-full h-64 animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : usersApi.error || eventsApi.error || companiesApi.error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-center">Error loading chart data</p>
              <p className="text-sm text-center mt-1">Please try again later</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Events',
                      value: actualData.totalEvents || 0,
                      color: systemMetricsColors.events,
                    },
                    {
                      name: 'Companies',
                      value: actualData.totalCompanies || 0,
                      color: systemMetricsColors.companies,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Object.values(systemMetricsColors).map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    const total =
                      (actualData.totalEvents || 0) +
                      (actualData.totalCompanies || 0);
                    const percentage =
                      total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return [`${value} (${percentage}%)`, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-fade-in border-primary"
        style={{ animationDelay: '0.9s' }}
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4 ">
          {[
            {
              action: 'New user registration',
              user: 'John Doe',
              time: '5 minutes ago',
              icon: <FaUsers className="text-indigo-500" />,
            },
            {
              action: 'Event created',
              user: 'Admin Alice',
              time: '1 hour ago',
              icon: <FaCalendarAlt className="text-green-500" />,
            },
            {
              action: 'Company profile updated',
              user: 'Tech Corp',
              time: '2 hours ago',
              icon: <FaBuilding className="text-blue-500" />,
            },
            {
              action: 'Queue status changed',
              user: 'Staff Bob',
              time: '3 hours ago',
              icon: <FaClock className="text-amber-500" />,
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center p-3 border-b last:border-0 transition-colors duration-200 hover:scale-101 rounded animate-slide-in-right"
              style={{ animationDelay: `${1.0 + index * 0.1}s` }}
            >
              <div className="mr-4">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">{activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
