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

// Sample data for queue times - will be replaced with real data
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

  // State for total users data for Growth Trends chart
  const [userGrowthData, setUserGrowthData] = useState([]);

  // State for API results to use in Recent Activity
  const [apiResults, setApiResults] = useState({
    users: null,
    events: null,
    companies: null,
  });

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
        console.log('userResult', usersResult);
        console.log('eventsResult', eventsResult);
        console.log('companiesResult', companiesResult);

        // Store API results in state for use in Recent Activity
        setApiResults({
          users: usersResult,
          events: eventsResult,
          companies: companiesResult,
        });

        // Update state with all results at once
        setActualData(prev => ({
          ...prev,
          totalUsers: (usersResult && usersResult.data?.pagination?.total) || 0,
          totalEvents: (eventsResult && eventsResult.data?.result?.total) || 0,
          totalCompanies:
            (companiesResult && companiesResult.data?.total_count) || 0,
          queueTime: 15, // Static value for now
        }));

        // Process users data to show growth over time
        if (usersResult && usersResult.data?.pagination?.total) {
          const totalUsers = usersResult.data.pagination.total;
          const users = usersResult.data.users || [];

          // Get current month and create a 6-month range
          const currentDate = new Date();
          const chartData = [];

          // Generate data for the past 6 months
          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const monthName = `${months[monthIdx]} ${year}`;

            // Count users created in this month
            const usersInMonth = users.filter(user => {
              if (!user.created_at) return false;
              const userDate = new Date(user.created_at);
              return (
                userDate.getMonth() === monthIdx &&
                userDate.getFullYear() === year
              );
            }).length;

            // If this is the last month (current), show total users
            // For previous months, show simulated growth pattern
            const usersValue =
              i === 0
                ? totalUsers
                : Math.max(
                    0,
                    Math.floor(totalUsers * (0.7 + (0.3 * (5 - i)) / 5))
                  );

            chartData.push({
              name: monthName,
              users: usersValue,
              newUsers:
                i === 0
                  ? usersInMonth
                  : Math.floor(totalUsers * 0.05 * (1 + i / 10)),
            });
          }

          setUserGrowthData(chartData);
        } else {
          // Fallback if no user data available
          const currentDate = new Date();
          const chartData = [];

          // Generate sample data for the past 6 months
          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const monthName = `${months[monthIdx]} ${year}`;

            chartData.push({
              name: monthName,
              users: 0,
              newUsers: 0,
            });
          }

          setUserGrowthData(chartData);
        }

        // Process events and companies data for monthly statistics
        if (
          eventsResult?.data?.result?.data &&
          companiesResult?.data?.companies?.data
        ) {
          // Get current month and create a 6-month range for consistency
          const currentDate = new Date();
          const monthData = {};

          // Initialize data for the past 6 months
          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const monthName = `${months[monthIdx]} ${year}`;

            // Initialize counts for this month
            if (!monthData[monthName]) {
              monthData[monthName] = {
                name: monthName,
                events: 0,
                companies: 0,
              };
            }
          }

          // Process events data by month
          const events = eventsResult.data.result.data || [];
          events.forEach(event => {
            if (event.created_at) {
              const date = new Date(event.created_at);
              const monthIdx = date.getMonth();
              const year = date.getFullYear();
              const monthName = `${months[monthIdx]} ${year}`;

              if (monthData[monthName]) {
                monthData[monthName].events++;
              }
            }
          });

          // Process companies data by month using the companies data array
          const companies = companiesResult.data.companies.data || [];
          companies.forEach(company => {
            if (company.created_at) {
              const date = new Date(company.created_at);
              const monthIdx = date.getMonth();
              const year = date.getFullYear();
              const monthName = `${months[monthIdx]} ${year}`;

              if (monthData[monthName]) {
                monthData[monthName].companies++;
              }
            }
          });

          // Convert the monthData object to an array for the chart
          const chartData = Object.values(monthData);

          // Sort by month and year for proper chronological display
          chartData.sort((a, b) => {
            const [aMonth, aYear] = a.name.split(' ');
            const [bMonth, bYear] = b.name.split(' ');

            // Compare years first
            if (aYear !== bYear) {
              return parseInt(aYear) - parseInt(bYear);
            }

            // If years are the same, compare months
            return months.indexOf(aMonth) - months.indexOf(bMonth);
          });

          setStatisticsData(chartData);
        } else {
          // If API data is not available, create empty chart data with proper month labels
          const currentDate = new Date();
          const chartData = [];

          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(currentDate.getMonth() - i);
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const monthName = `${months[monthIdx]} ${year}`;

            chartData.push({
              name: monthName,
              events: 0,
              companies: 0,
            });
          }

          setStatisticsData(chartData);
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

        // Reset statistics data to empty
        setStatisticsData([]);

        // Reset user growth data
        console.log('Resetting user growth data due to error');
        setUserGrowthData([{ name: 'No Data', users: 0, newUsers: 0 }]);
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
                  <p className="text-xl mt-3 font-semibold text-gray-900">
                    {usersApi.error ? (
                      <span className="text-gray-400 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        No data
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
                    className={`text-sm mt-2 ${usersApi.error ? 'text-gray-400' : 'text-green-600'}`}
                  >
                    {usersApi.error
                      ? 'Data unavailable'
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
                  <p className="text-xl mt-3 font-semibold text-gray-900">
                    {eventsApi.error ? (
                      <span className="text-gray-400 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        No data
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
                    className={`text-sm mt-2 ${eventsApi.error ? 'text-gray-400' : 'text-green-600'}`}
                  >
                    {eventsApi.error
                      ? 'Data unavailable'
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
                  <p className="text-xl mt-3 font-semibold text-gray-900">
                    {companiesApi.error ? (
                      <span className="text-gray-400 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        No data
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
                    className={`text-sm mt-2 ${companiesApi.error ? 'text-gray-400' : 'text-green-600'}`}
                  >
                    {companiesApi.error
                      ? 'Data unavailable'
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
            User Growth Over Time
          </h2>
          {usersApi.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-full h-64 animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : usersApi.error ||
            userGrowthData.length === 0 ||
            (userGrowthData.length === 1 && userGrowthData[0].users === 0) ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-center font-medium">No data to display</p>
              <p className="text-sm text-center mt-1">
                User data is currently unavailable
              </p>
            </div>
          ) : (
            <div className="h-64">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-indigo-500">
                    {actualData.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-gray-500">Total Users</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-green-500">
                    {userGrowthData.length > 0
                      ? `+${userGrowthData[userGrowthData.length - 1]?.newUsers || 0}`
                      : '0'}
                  </div>
                  <p className="text-gray-500">New this month</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={userGrowthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    domain={[0, 'dataMax + 20']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Total Users"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="New Users"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
          ) : eventsApi.error ||
            companiesApi.error ||
            statisticsData.length === 0 ||
            statisticsData.every(
              item => item.events === 0 && item.companies === 0
            ) ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-center font-medium">No data to display</p>
              <p className="text-sm text-center mt-1">
                Event and company statistics are currently unavailable
              </p>
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
          {queueData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-center font-medium">No data to display</p>
              <p className="text-sm text-center mt-1">
                Queue time data is currently unavailable
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={queueData}
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
          )}
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
          ) : usersApi.error ||
            eventsApi.error ||
            companiesApi.error ||
            (actualData.totalEvents === 0 &&
              actualData.totalCompanies === 0) ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
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
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              <p className="text-center font-medium">No data to display</p>
              <p className="text-sm text-center mt-1">
                System metrics are currently unavailable
              </p>
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
        {usersApi.loading || eventsApi.loading || companiesApi.loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(index => (
              <div
                key={index}
                className="flex items-center p-3 border-b last:border-0 animate-pulse"
              >
                <div className="mr-4 w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : usersApi.error ||
          eventsApi.error ||
          companiesApi.error ||
          (!apiResults.users?.data?.users?.length &&
            !apiResults.events?.data?.result?.data?.length &&
            !apiResults.companies?.data?.companies?.data?.length) ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <p className="text-center font-medium">No recent activity</p>
            <p className="text-sm text-center mt-1">
              Activity data is currently unavailable
            </p>
          </div>
        ) : (
          <div className="space-y-4 ">
            {[
              {
                action: 'New user registration',
                user: apiResults.users?.data?.users?.[0]?.first_name
                  ? `${apiResults.users.data.users[0].first_name} ${apiResults.users.data.users[0].last_name || ''}`.trim()
                  : 'John Doe',
                time: apiResults.users?.data?.users?.[0]?.created_at
                  ? new Date(
                      apiResults.users.data.users[0].created_at
                    ).toLocaleDateString()
                  : '5 minutes ago',
                icon: <FaUsers className="text-indigo-500" />,
              },
              {
                action: 'Event created',
                user:
                  apiResults.events?.data?.result?.data?.[0]?.title ||
                  'Tech Conference',
                time: apiResults.events?.data?.result?.data?.[0]?.created_at
                  ? new Date(
                      apiResults.events.data.result.data[0].created_at
                    ).toLocaleDateString()
                  : '1 hour ago',
                icon: <FaCalendarAlt className="text-green-500" />,
              },
              {
                action: 'Company registered',
                user:
                  apiResults.companies?.data?.companies?.data?.[0]?.name ||
                  'Tech Corp',
                time: apiResults.companies?.data?.companies?.data?.[0]
                  ?.created_at
                  ? new Date(
                      apiResults.companies.data.companies.data[0].created_at
                    ).toLocaleDateString()
                  : '2 hours ago',
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
