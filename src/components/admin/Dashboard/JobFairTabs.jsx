import React, { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FaBuilding,
  FaIndustry,
  FaClock,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import TableSkeleton from '../../common/TableSkeleton';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

// Predefined industry categories with colors
const INDUSTRY_CATEGORIES = {
  'Software House': '#8884d8',
  'Business Services': '#82ca9d',
  Healthcare: '#ffc658',
  Finance: '#ff8042',
  'E-commerce': '#0088fe',
  Education: '#00C49F',
  Manufacturing: '#FFBB28',
  Other: '#FF8042',
};

const JobFairTabs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventCompanies, setEventCompanies] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState(null);
  const [interviewData, setInterviewData] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Mock data for events - replace with actual API call
        const mockEvents = [
          {
            id: 1,
            title: 'Summer Job Fair 2025',
            date: '2025-07-15',
            location: 'Main Campus',
            company_count: 24,
          },
          {
            id: 2,
            title: 'Winter Recruitment Drive',
            date: '2025-01-10',
            location: 'Online',
            company_count: 18,
          },
          {
            id: 3,
            title: 'Tech Career Expo',
            date: '2025-04-22',
            location: 'Innovation Center',
            company_count: 32,
          },
        ];

        setEvents(mockEvents);
        setActiveEvent(mockEvents[0]);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch companies when active event changes
  useEffect(() => {
    const fetchEventCompanies = async () => {
      if (!activeEvent) return;

      try {
        setCompanyLoading(true);

        // Generate mock companies data with industry distribution
        const industries = Object.keys(INDUSTRY_CATEGORIES);
        const mockCompanies = Array.from({ length: 20 }, (_, i) => {
          // Determine company industry based on patterns in the id
          const industryIndex = i % industries.length;
          const industry = industries[industryIndex];

          return {
            id: i + 1,
            name: `${industry} Corp ${i + 1}`,
            logo: `https://ui-avatars.com/api/?name=${industry.split(' ').join('+')}&background=random`,
            industry: industry,
            website: `https://www.example${i}.com`,
            contact_email: `contact@company${i}.com`,
            contact_phone: `+1 (555) 000-${1000 + i}`,
            description: `A leading ${industry.toLowerCase()} company specializing in innovative solutions.`,
            status: i % 5 === 0 ? 'pending' : 'confirmed',
          };
        });

        setEventCompanies(mockCompanies);

        // Generate interview duration data
        const interviewData = mockCompanies.map(company => {
          const actualDuration = 10 + Math.floor(Math.random() * 20); // 10-30 minutes
          const targetDuration = 15; // 15 minutes target
          const totalInterviews = 10 + Math.floor(Math.random() * 40); // 10-50 interviews

          return {
            companyId: company.id,
            companyName: company.name,
            industry: company.industry,
            actualDuration,
            targetDuration,
            totalInterviews,
            isEfficient: actualDuration <= targetDuration,
          };
        });

        setInterviewData(interviewData);
        // Initially select all companies
        setSelectedCompanies(interviewData.map(c => c.companyId));
        setCompanyLoading(false);
      } catch (err) {
        console.log(err);
        setCompanyError('Failed to fetch companies for this event');
        setCompanyLoading(false);
      }
    };

    fetchEventCompanies();
  }, [activeEvent]);

  // Group companies by industry
  const companiesByIndustry = useMemo(() => {
    const grouped = {};

    // First, initialize all predefined categories with empty arrays
    Object.keys(INDUSTRY_CATEGORIES).forEach(industry => {
      grouped[industry] = [];
    });

    // Then populate with companies
    eventCompanies.forEach(company => {
      const industry = company.industry || 'Other';
      if (!grouped[industry]) {
        grouped[industry] = [];
      }
      grouped[industry].push(company);
    });

    // Filter out empty industries
    return Object.entries(grouped)
      .filter(([companies]) => companies.length > 0)
      .sort((a, b) => b[1].length - a[1].length); // Sort by number of companies
  }, [eventCompanies]);

  // Prepare data for industry chart
  const prepareIndustryChartData = useMemo(() => {
    if (!companiesByIndustry.length) {
      // Fallback data if no companies
      return Object.keys(INDUSTRY_CATEGORIES).map(industry => ({
        name: industry,
        value: Math.floor(Math.random() * 10) + 1, // Random count between 1-10
        color: INDUSTRY_CATEGORIES[industry],
      }));
    }

    return companiesByIndustry.map(([industry, companies]) => ({
      name: industry,
      value: companies.length,
      color: INDUSTRY_CATEGORIES[industry] || '#ccc',
    }));
  }, [companiesByIndustry]);

  // Toggle company selection for chart
  const toggleCompanySelection = companyId => {
    setSelectedCompanies(prev => {
      if (prev.includes(companyId)) {
        return prev.filter(id => id !== companyId);
      } else {
        return [...prev, companyId];
      }
    });
  };

  // Select all companies
  const selectAllCompanies = () => {
    setSelectedCompanies(interviewData.map(c => c.companyId));
  };

  // Clear all company selections
  const clearAllCompanies = () => {
    setSelectedCompanies([]);
  };

  // Filter interview data to only show selected companies
  const filteredInterviewData = useMemo(() => {
    return interviewData.filter(company =>
      selectedCompanies.includes(company.companyId)
    );
  }, [interviewData, selectedCompanies]);

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Show empty state when no data is available
  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <FaBuilding className="text-gray-300 text-5xl mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  // Show error state when data fetching fails
  const ErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <FaTimes className="text-red-500 text-5xl mb-4" />
      <p className="text-red-500 text-lg">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!events.length) {
    return <EmptyState message="No job fair events found" />;
  }

  return (
    <div className="job-fair-dashboard">
      {/* Event Selection Tabs */}
      <motion.div
        className="mb-8 overflow-x-auto hide-scrollbar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex space-x-2 pb-2">
          {events.map(event => (
            <button
              key={event.id}
              onClick={() => setActiveEvent(event)}
              className={`px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeEvent?.id === event.id
                  ? 'bg-[var(--primary-500)] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {event.title}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Active Event Details */}
      {activeEvent && (
        <motion.div
          className="mb-8 bg-white rounded-lg shadow-md p-6 border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {activeEvent.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center text-gray-600">
              <div className="p-3 rounded-full bg-blue-50 mr-4 text-blue-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{activeEvent.date}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="p-3 rounded-full bg-green-50 mr-4 text-green-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{activeEvent.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="p-3 rounded-full bg-purple-50 mr-4 text-purple-500">
                <FaBuilding className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Companies</p>
                <p className="font-medium">{activeEvent.company_count}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chart Section */}
      <motion.div
        className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Companies by Industry Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Companies by Industry
          </h3>

          {/* Industry Legend */}
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(INDUSTRY_CATEGORIES).map(([industry, color]) => (
              <span
                key={industry}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${color}20`,
                  color: color,
                  border: `1px solid ${color}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                ></span>
                {industry}
              </span>
            ))}
          </div>

          {companyLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-500)]"></div>
            </div>
          ) : companyError ? (
            <div className="h-64 flex items-center justify-center text-red-500">
              <p>{companyError}</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareIndustryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareIndustryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={value => [`${value} Companies`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Interview Duration Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Average Interview Duration
          </h3>

          {/* Company Selection Tabs */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Select Companies to Display:
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllCompanies}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Select All
                </button>
                <button
                  onClick={clearAllCompanies}
                  className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar p-2 border border-gray-100 rounded-md">
              {interviewData.map(company => (
                <button
                  key={company.companyId}
                  onClick={() => toggleCompanySelection(company.companyId)}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    selectedCompanies.includes(company.companyId)
                      ? 'bg-[var(--primary-500)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {company.companyName.length > 20
                    ? company.companyName.substring(0, 20) + '...'
                    : company.companyName}
                </button>
              ))}
            </div>
          </div>

          {companyLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-500)]"></div>
            </div>
          ) : filteredInterviewData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500">
              <FaBuilding className="w-10 h-10 mb-2 text-gray-300" />
              <p>Select companies to display interview data</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredInterviewData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="companyName"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    tickFormatter={value => value.substring(0, 10) + '...'}
                  />
                  <YAxis
                    label={{
                      value: 'Minutes',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return [
                        `${value} minutes`,
                        name === 'actualDuration'
                          ? 'Actual Time'
                          : 'Target Time',
                      ];
                    }}
                    labelFormatter={label => `Company: ${label}`}
                  />
                  <Bar
                    dataKey="actualDuration"
                    fill="#8884d8"
                    name="Actual Time"
                  >
                    <LabelList
                      dataKey="actualDuration"
                      position="top"
                      style={{ fontSize: 10 }}
                    />
                  </Bar>
                  <Bar
                    dataKey="targetDuration"
                    fill="#82ca9d"
                    name="Target Time"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats Table */}
          {filteredInterviewData.length > 0 && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviews
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviewData.map(company => (
                    <tr key={company.companyId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {company.companyName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {company.actualDuration} min
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {company.targetDuration} min
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            company.isEfficient
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {company.isEfficient ? (
                            <>
                              <FaCheck className="w-3 h-3 mr-1" /> Efficient
                            </>
                          ) : (
                            <>
                              <FaClock className="w-3 h-3 mr-1" /> Needs
                              Improvement
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {company.totalInterviews}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Companies by Industry Section */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Companies by Industry
        </h2>

        {companyLoading ? (
          <TableSkeleton columns={4} rows={4} />
        ) : companyError ? (
          <ErrorState message={companyError} />
        ) : companiesByIndustry.length === 0 ? (
          <EmptyState message="No companies found for this event" />
        ) : (
          <div className="space-y-8">
            {companiesByIndustry.map(([industry, companies]) => (
              <motion.div
                key={industry}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaIndustry className="mr-2 text-gray-400" />
                    {industry}
                    <span
                      className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${INDUSTRY_CATEGORIES[industry]}20`,
                        color: INDUSTRY_CATEGORIES[industry],
                        border: `1px solid ${INDUSTRY_CATEGORIES[industry]}`,
                      }}
                    >
                      {companies.length}
                    </span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Website
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companies.map(company => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={company.logo}
                                  alt={company.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {company.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {company.contact_email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {company.contact_phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {company.website.replace(/^https?:\/\//, '')}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                company.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {company.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobFairTabs;
