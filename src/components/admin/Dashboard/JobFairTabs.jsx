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
import { eventAPI, jobFairAPI } from '@/services/api';

// Predefined industry categories with vibrant, distinct colors
const INDUSTRY_CATEGORIES = {
  'Software House': '#6366f1', // Indigo
  'Business Services': '#10b981', // Emerald
  Healthcare: '#f59e0b', // Amber
  Finance: '#ef4444', // Red
  'E-commerce': '#3b82f6', // Blue
  Education: '#8b5cf6', // Violet
  Manufacturing: '#f97316', // Orange
  Retail: '#ec4899', // Pink
  Consulting: '#06b6d4', // Cyan
  Technology: '#84cc16', // Lime
  'Non-Profit': '#a855f7', // Purple
  Government: '#64748b', // Slate
  Media: '#f43f5e', // Rose
  'Real Estate': '#0ea5e9', // Sky
  Transportation: '#22c55e', // Green
  Energy: '#eab308', // Yellow
  Other: '#6b7280', // Gray
};

// Generate a vibrant color for unknown industries
const generateVibrantColor = industry => {
  const vibrantColors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#ffeaa7',
    '#dda0dd',
    '#98d8c8',
    '#f7dc6f',
    '#bb8fce',
    '#85c1e9',
    '#f8c471',
    '#82e0aa',
    '#f1948a',
    '#85c1e9',
    '#d7bde2',
  ];

  // Use string hash to consistently assign the same color to the same industry
  let hash = 0;
  for (let i = 0; i < industry.length; i++) {
    hash = industry.charCodeAt(i) + ((hash << 5) - hash);
  }

  return vibrantColors[Math.abs(hash) % vibrantColors.length];
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
        const params = {
          'filter[type]': 'Job Fair',
        };
        const response = await eventAPI.getAll(params);
        console.log('Job Fair events response:', response);

        // Debug log to see exact structure
        console.log('Response structure check:', {
          hasData: !!response.data,
          dataType: typeof response.data,
          hasNestedData: response.data && !!response.data.data,
          hasNestedResult:
            response.data && response.data.data && !!response.data.data.result,
          hasNestedResultData:
            response.data &&
            response.data.data &&
            response.data.data.result &&
            !!response.data.data.result.data,
        });

        // Check if we have data in the expected format
        // The API returns nested data structure that can vary
        let eventsData = [];

        if (response && response.data) {
          // Try to extract events from various possible response structures
          if (
            response.data.data &&
            response.data.data.result &&
            response.data.data.result.data
          ) {
            // Structure: response.data.data.result.data (from the jobfair response)
            eventsData = response.data.data.result.data;
          } else if (response.data.data) {
            // Structure: response.data.data (original expected format)
            eventsData = response.data.data;
          } else if (response.data.result && response.data.result.data) {
            // Structure: response.data.result.data (from the event response)
            eventsData = response.data.result.data;
          } else if (Array.isArray(response.data)) {
            // Structure: response.data (direct array)
            eventsData = response.data;
          }

          console.log('Extracted events data:', eventsData);

          if (eventsData && eventsData.length > 0) {
            // Format the events for display
            const formattedEvents = eventsData.map(event => ({
              id: event.id,
              title: event.title,
              date: new Date(event.start_date).toLocaleDateString(),
              location: event.location || 'Not specified',
              company_count: event.companies_count || 0,
              start_date: event.start_date,
              end_date: event.end_date,
              status: event.status,
              description: event.description,
            }));

            setEvents(formattedEvents);
            // Set the first event as active by default
            setActiveEvent(formattedEvents[0]);
            console.log('Formatted events:', formattedEvents);
            console.log('Active event:', formattedEvents[0]);
          } else {
            setEvents([]);
          }
        } else {
          console.error('Unexpected API response format:', response);
          setError('Failed to fetch events: Unexpected response format');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to fetch events: ${err.message}`);
        setLoading(false);

        // Use mock data if API fails completely
        const mockEvents = [
          {
            id: 1,
            title: 'Mock Job Fair 2025',
            date: new Date().toLocaleDateString(),
            location: 'Mock Location',
            company_count: 15,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 86400000).toISOString(),
            status: 'published',
            description:
              'This is a mock event created because the API fetch failed.',
          },
        ];
        setEvents(mockEvents);
        setActiveEvent(mockEvents[0]);
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
        console.log('Fetching companies for event ID:', activeEvent.id);

        // Fetch real company data from API
        const response = await jobFairAPI.getParticipations(activeEvent.id);
        console.log('Company participations full response:', response);

        // Check if we have data in the expected format - try multiple potential structures
        let participations = [];

        if (response && response.data) {
          if (response.data.result) {
            // Direct result structure
            participations = response.data.result || [];
          } else if (response.data.data && response.data.data.result) {
            // Nested data.result structure
            participations = response.data.data.result || [];
          } else if (Array.isArray(response.data)) {
            // Direct array structure
            participations = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // Nested data array structure
            participations = response.data.data;
          }

          console.log('Extracted participations:', participations);
          console.log('Participations found:', participations.length);

          // Map the participations to companies
          const companies = participations
            .filter(p => p.company) // Only include participations with company data
            .map(p => {
              const company = p.company;
              return {
                id: company.id,
                name: company.name,
                logo:
                  company.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`,
                industry: company.industry || 'Other',
                website: company.website || '#',
                contact_email: company.contact_email || 'N/A',
                contact_phone: company.contact_phone || 'N/A',
                description: company.description || 'No description available',
                status: p.status || 'pending',
              };
            });

          console.log('Processed companies:', companies);

          // Set the companies to state
          setEventCompanies(companies);

          // Generate interview data based on real companies
          const interviewDataPromises = companies.map(async company => {
            try {
              // Fetch real queue data for each company
              const queueResponse = await jobFairAPI.getCompanyQueue(
                activeEvent.id,
                company.id
              );

              if (queueResponse.data && queueResponse.data.data) {
                const queueData = queueResponse.data.data;
                const queue = queueData.queue || [];
                const summary = queueData.summary || {};

                // Calculate average time from actual slot data
                let calculatedAvgTime = 0;
                let totalInterviews = 0;

                if (queue.length > 0) {
                  let totalMinutes = 0;
                  let validSlots = 0;

                  queue.forEach(item => {
                    if (
                      item.slot &&
                      item.slot.start_time &&
                      item.slot.end_time
                    ) {
                      // Parse time strings (HH:MM:SS format)
                      const [startHours, startMinutes] = item.slot.start_time
                        .split(':')
                        .map(Number);
                      const [endHours, endMinutes] = item.slot.end_time
                        .split(':')
                        .map(Number);

                      // Convert to total minutes
                      const startTotalMinutes = startHours * 60 + startMinutes;
                      const endTotalMinutes = endHours * 60 + endMinutes;

                      // Calculate duration in minutes
                      const duration = endTotalMinutes - startTotalMinutes;

                      if (duration > 0) {
                        totalMinutes += duration;
                        validSlots++;
                      }
                    }
                  });

                  // Calculate average
                  if (validSlots > 0) {
                    calculatedAvgTime = Math.round(totalMinutes / validSlots);
                  }

                  // Count total interviews (could be from summary or queue length)
                  totalInterviews = summary.total || queue.length;
                }

                // Use calculated average time, fallback to summary if calculation fails
                const avgTime =
                  calculatedAvgTime > 0
                    ? calculatedAvgTime
                    : summary.average_interview_time_minutes || 0;

                console.log(
                  `Company ${company.name}: Calculated avg time: ${calculatedAvgTime}min, Total interviews: ${totalInterviews}`
                );

                // Calculate efficiency based on new thresholds
                let efficiencyStatus = null;
                if (avgTime <= 30) {
                  efficiencyStatus = 'okay';
                } else if (avgTime > 60) {
                  efficiencyStatus = 'too_long';
                }

                return {
                  companyId: company.id,
                  companyName: company.name,
                  industry: company.industry,
                  actualDuration: avgTime,
                  targetDuration: 30, // Updated target to 30 minutes
                  totalInterviews: totalInterviews,
                  efficiencyStatus: efficiencyStatus,
                  isEfficient: avgTime <= 30, // Keep for backward compatibility
                  trafficFlag: summary.traffic_flag || 'ok',
                  totalInQueue: summary.total || queue.length,
                  waitingInQueue:
                    summary.waiting ||
                    queue.filter(item => item.status === 'waiting').length,
                  currentInterviewee: summary.in_interview_student_name || null,
                  queueData: queue, // Store queue data for debugging
                };
              } else {
                // Fallback to mock data for this company if API fails
                const mockAvgTime = 15 + Math.floor(Math.random() * 45); // Random 15-60 minutes for realistic range
                const mockTotalInterviews = 5 + Math.floor(Math.random() * 15); // Random 5-20 interviews

                let efficiencyStatus = null;
                if (mockAvgTime <= 30) {
                  efficiencyStatus = 'okay';
                } else if (mockAvgTime > 60) {
                  efficiencyStatus = 'too_long';
                }

                return {
                  companyId: company.id,
                  companyName: company.name,
                  industry: company.industry,
                  actualDuration: mockAvgTime,
                  targetDuration: 30,
                  totalInterviews: mockTotalInterviews,
                  efficiencyStatus: efficiencyStatus,
                  isEfficient: mockAvgTime <= 30,
                  trafficFlag: 'ok',
                  totalInQueue: Math.floor(Math.random() * 10),
                  waitingInQueue: Math.floor(Math.random() * 5),
                  currentInterviewee: null,
                  queueData: [], // Empty queue data for mock
                };
              }
            } catch (error) {
              console.error(
                `Error fetching queue data for company ${company.id}:`,
                error
              );
              // Fallback to mock data for this company
              const mockAvgTime = 15 + Math.floor(Math.random() * 45); // Random 15-60 minutes
              const mockTotalInterviews = 5 + Math.floor(Math.random() * 15); // Random 5-20 interviews

              let efficiencyStatus = null;
              if (mockAvgTime <= 30) {
                efficiencyStatus = 'okay';
              } else if (mockAvgTime > 60) {
                efficiencyStatus = 'too_long';
              }

              return {
                companyId: company.id,
                companyName: company.name,
                industry: company.industry,
                actualDuration: mockAvgTime,
                targetDuration: 30,
                totalInterviews: mockTotalInterviews,
                efficiencyStatus: efficiencyStatus,
                isEfficient: mockAvgTime <= 30,
                trafficFlag: 'ok',
                totalInQueue: Math.floor(Math.random() * 10),
                waitingInQueue: Math.floor(Math.random() * 5),
                currentInterviewee: null,
                queueData: [], // Empty queue data for mock
              };
            }
          });

          // Wait for all queue data to be fetched
          const interviewData = await Promise.all(interviewDataPromises);

          setInterviewData(interviewData);
          setSelectedCompanies(interviewData.map(c => c.companyId));
        } else {
          // Fallback to mock data if API doesn't return expected format
          console.warn(
            "API didn't return expected data format, using fallback mock data"
          );
          generateMockCompanyData();
        }

        setCompanyLoading(false);
      } catch (err) {
        console.error('Error fetching companies:', err);
        console.error('Error details:', err.response?.data || err.message);
        setCompanyError(
          `Failed to fetch companies for this event: ${err.message}`
        );
        setCompanyLoading(false);
        // Fallback to mock data on error
        generateMockCompanyData();
      }
    };

    // Fallback function to generate mock data if API fails
    const generateMockCompanyData = async () => {
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

      // Try to fetch real queue data for mock companies, fallback to mock data if needed
      const interviewDataPromises = mockCompanies.map(async company => {
        try {
          if (activeEvent?.id) {
            const queueResponse = await jobFairAPI.getCompanyQueue(
              activeEvent.id,
              company.id
            );

            if (queueResponse.data && queueResponse.data.data) {
              const queueData = queueResponse.data.data;
              const summary = queueData.summary || {};

              return {
                companyId: company.id,
                companyName: company.name,
                industry: company.industry,
                actualDuration: summary.average_interview_time_minutes || 0,
                targetDuration: 15,
                totalInterviews: summary.completed || 0,
                isEfficient:
                  (summary.average_interview_time_minutes || 0) <= 15,
                trafficFlag: summary.traffic_flag || 'ok',
                totalInQueue: summary.total || 0,
                waitingInQueue: summary.waiting || 0,
                currentInterviewee: summary.in_interview_student_name || null,
              };
            }
          }
        } catch (error) {
          console.log(error);
          console.log(
            `No queue data available for mock company ${company.id}, using fallback`
          );
        }

        // Fallback to completely mock data
        const actualDuration = 10 + Math.floor(Math.random() * 20);
        const targetDuration = 15;
        const totalInterviews = 10 + Math.floor(Math.random() * 40);

        return {
          companyId: company.id,
          companyName: company.name,
          industry: company.industry,
          actualDuration,
          targetDuration,
          totalInterviews,
          isEfficient: actualDuration <= targetDuration,
          trafficFlag: 'ok',
          totalInQueue: Math.floor(Math.random() * 10),
          waitingInQueue: Math.floor(Math.random() * 5),
          currentInterviewee: Math.random() > 0.5 ? 'John Doe' : null,
        };
      });

      const interviewData = await Promise.all(interviewDataPromises);
      setInterviewData(interviewData);
      // Initially select all companies
      setSelectedCompanies(interviewData.map(c => c.companyId));
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
      // Fallback data if no companies - show only first 5 categories
      return Object.keys(INDUSTRY_CATEGORIES)
        .slice(0, 5)
        .map(industry => ({
          name: industry,
          value: Math.floor(Math.random() * 5) + 1, // Random count between 1-5
          color: INDUSTRY_CATEGORIES[industry],
        }));
    }

    return companiesByIndustry
      .filter(([companies]) => companies.length > 0) // Only include industries with companies
      .map(([industry, companies]) => ({
        name: industry,
        value: companies.length,
        color: INDUSTRY_CATEGORIES[industry] || generateVibrantColor(industry),
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

  // Function to handle event tab changes
  const handleEventChange = event => {
    console.log('Switching to event:', event);

    // Reset states when changing events
    setCompanyError(null); // Clear any previous errors
    setCompanyLoading(true); // Show loading state
    setEventCompanies([]); // Clear previous companies
    setInterviewData([]); // Clear previous interview data
    setSelectedCompanies([]); // Clear selected companies

    // Set the new active event
    setActiveEvent(event);

    // Companies will be fetched in the useEffect that depends on activeEvent
    console.log('Event changed, new active event:', event);
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
    name,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    // Only show label if it's significant enough (>= 5%)
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
        style={{
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        }}
      >
        {name.length > 12 ? name.substring(0, 12) + '...' : name}
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
              onClick={() => handleEventChange(event)}
              className={`px-7 py-4 rounded-lg whitespace-nowrap transition-all ${
                activeEvent?.id === event.id
                  ? 'bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] text-white shadow-md '
                  : 'bg-white text-gray-700 border border-primary hover:bg-[var(--gray-50)] hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{event.title}</span>
                <div className="flex items-center mt-1">
                  <span
                    className={`px-1.5 py-0.5 text-xs rounded-full ${
                      event.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-700'
                          : event.status === 'completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {event.status === 'published' ? 'Upcoming' : event.status}
                  </span>
                  <span className="text-xs text-gray-50 ml-2">
                    {event.date}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Active Event Details */}
      {activeEvent && (
        <motion.div
          className="mb-8 bg-white rounded-lg shadow-md p-6 border hover:shadow-lg border-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {activeEvent.title}
            <span
              className={`ml-3 px-2 py-1 text-xs rounded-full inline-flex items-center ${
                activeEvent.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : activeEvent.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-700'
                    : activeEvent.status === 'completed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {activeEvent.status === 'published'
                ? 'Upcoming'
                : activeEvent.status}
            </span>
          </h2>

          {activeEvent.description && (
            <div className="mb-4 text-gray-600 text-sm border-l-4 border-gray-200 pl-3 italic">
              {activeEvent.description}
            </div>
          )}

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
              <div className="p-4">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{activeEvent.date}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activeEvent.start_date).toLocaleDateString()} -{' '}
                  {new Date(activeEvent.end_date).toLocaleDateString()}
                </p>
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
                <p className="font-medium">
                  {activeEvent.company_count || eventCompanies.length}
                </p>
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:shadow-lg ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Companies by Industry
            </h3>
          </div>

          {/* Industry Legend - Show only industries present in data */}
          <div className="mb-4 flex flex-wrap gap-2">
            {prepareIndustryChartData.map(({ name: industry, color }) => (
              <span
                key={industry}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
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
            <div className="h-90">
              {' '}
              {/* Increased height to accommodate chart and legend */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareIndustryChartData}
                    cx="50%"
                    cy="50%" /* Moved the pie chart up to make room for legend below */
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100} /* Slightly reduced the radius */
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {prepareIndustryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={value => [
                      `${value} ${value === 1 ? 'Company' : 'Companies'}`,
                      'Count',
                    ]}
                    labelFormatter={label => `Industry: ${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '12px',
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                    itemStyle={{
                      color: '#6b7280',
                      fontSize: '14px',
                    }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <div className="flex items-center mb-2">
                              <span
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: data.color }}
                              ></span>
                              <span className="font-semibold text-gray-800">
                                {label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{data.value}</span>{' '}
                              {data.value === 1 ? 'Company' : 'Companies'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(
                                (data.value /
                                  prepareIndustryChartData.reduce(
                                    (sum, item) => sum + item.value,
                                    0
                                  )) *
                                100
                              ).toFixed(1)}
                              % of total
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '30px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Interview Duration Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:shadow-lg">
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
                    formatter={value => {
                      return [`${value} minutes`, 'Average Time'];
                    }}
                    labelFormatter={label => `Company: ${label}`}
                  />
                  <Bar
                    dataKey="actualDuration"
                    fill="#8884d8"
                    // name="Average Time"
                  >
                    <LabelList
                      dataKey="actualDuration"
                      position="top"
                      style={{ fontSize: 10 }}
                    />
                  </Bar>
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
                      Average Time
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
                      <td className="px-4 py-2 whitespace-nowrap">
                        {company.efficiencyStatus ? (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              company.efficiencyStatus === 'okay'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {company.efficiencyStatus === 'okay' ? (
                              <>
                                <FaCheck className="w-3 h-3 mr-1" /> Okay
                              </>
                            ) : (
                              <>
                                <FaTimes className="w-3 h-3 mr-1" /> Too Long
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No Data is Avaliable
                          </span>
                        )}
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
                className="bg-white rounded-lg shadow-sm p-6 border border-primary hover:shadow-lg"
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
