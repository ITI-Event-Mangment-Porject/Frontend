// CompanyDirectory.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import HomeFooter from '../../components/homePage/HomeFooter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { eventAPI } from '../../services/api';
import {
  Building2,
  Search,
  Filter,
  Briefcase,
  Clock,
  CheckCircle,
  X,
  Send,
  Calendar,
  ChevronRight,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ImageWithFallback = ({ src, alt, className, fallbackText }) => {
  const [hasError, setHasError] = useState(false);

  const createPlaceholderSVG = text => {
    const initials = text
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

    // Get the primary color from CSS variables, fallback to a blue color
    const primaryColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-500')
        ?.trim() || '#3b82f6';

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${primaryColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="25" font-weight="bold">${initials}</text>
      </svg>`
    )}`;
  };

  if (!src || src.includes('via.placeholder.com') || hasError) {
    return (
      <img
        src={createPlaceholderSVG(fallbackText || alt || 'Company')}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

const CompanyDirectory = () => {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(0);
  const [filters, setFilters] = useState({ industry: 'All', jobTitle: 'All' });
  const [allJobProfiles, setAllJobProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [registeringJobs, setRegisteringJobs] = useState(new Set());
  const [appliedProfiles, setAppliedProfiles] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // New state for job fair events
  const [jobFairEvents, setJobFairEvents] = useState([]);
  const [selectedJobFairId, setSelectedJobFairId] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch job fair events
  useEffect(() => {
    const fetchJobFairEvents = async () => {
      setLoadingEvents(true);
      const params = {
        'filter[type]': 'Job Fair',
      };
      try {
        const response = await eventAPI.getAll(params);
        console.log('Job Fair events response:', response);

        // Updated path based on the actual API response structure
        const events =
          response.data?.data?.result?.data ||
          response.data?.data?.data ||
          response.data?.data ||
          [];

        console.log('Extracted events:', events);

        // Filter for job fair events and only published ones
        const jobFairEvents = Array.isArray(events)
          ? events.filter(
              event =>
                event.type === 'Job Fair' &&
                (event.status === 'published' || event.status === 'ongoing')
            )
          : [];

        console.log('Filtered job fair events:', jobFairEvents);
        setJobFairEvents(jobFairEvents);

        // Set the first job fair as default if available
        if (jobFairEvents.length > 0 && !selectedJobFairId) {
          setSelectedJobFairId(jobFairEvents[0].id);
        }
      } catch (err) {
        console.error('Error fetching job fair events:', err);
        toast.error('Failed to load job fair events');
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchJobFairEvents();
  }, [selectedJobFairId]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(response.data?.data?.companies?.data || []);
      } catch (err) {
        console.error('Error fetching companies:', err);
        toast.error('Failed to load companies');
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchJobProfiles = async () => {
      if (!selectedJobFairId) return;

      setLoadingProfiles(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/job-fairs/${selectedJobFairId}/job-profiles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllJobProfiles(response.data?.data?.job_profiles || []);
      } catch (error) {
        console.error('Error fetching job profiles:', error);
        toast.error('Failed to load job profiles');
        setAllJobProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchJobProfiles();
  }, [selectedJobFairId]);

  const industries = useMemo(
    () => [
      'All',
      ...Array.from(new Set(companies.map(c => c.industry).filter(Boolean))),
    ],
    [companies]
  );
  const jobTitles = useMemo(
    () => [
      'All',
      ...Array.from(new Set(allJobProfiles.map(p => p.title).filter(Boolean))),
    ],
    [allJobProfiles]
  );

  const filtered = useMemo(() => {
    if (!selectedJobFairId || !allJobProfiles.length) return [];

    // Get unique company IDs from job profiles
    const companyIdsWithJobs = new Set(
      allJobProfiles.map(profile => profile.company?.id).filter(Boolean)
    );

    return companies.filter(c => {
      const hasJobsInSelectedFair = companyIdsWithJobs.has(c.id);
      const matchesSearch =
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.industry &&
          c.industry.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesIndustry =
        filters.industry === 'All' || c.industry === filters.industry;
      const hasMatchingJob =
        filters.jobTitle === 'All' ||
        allJobProfiles.some(
          profile =>
            profile.company?.id === c.id && profile.title === filters.jobTitle
        );
      return (
        hasJobsInSelectedFair &&
        matchesSearch &&
        matchesIndustry &&
        hasMatchingJob
      );
    });
  }, [companies, filters, allJobProfiles, searchTerm, selectedJobFairId]);

  const company = filtered[selected] || {};

  const currentJobProfiles = useMemo(() => {
    if (!company.id || !allJobProfiles.length) return [];
    return allJobProfiles.filter(profile => profile.company?.id === company.id);
  }, [company.id, allJobProfiles]);

  const getJobProfilesCount = companyId => {
    if (!companyId || !allJobProfiles.length) return 0;
    return allJobProfiles.filter(profile => profile.company?.id === companyId)
      .length;
  };

  const handleModalSubmit = async () => {
    if (!selectedProfileId) return;

    // Validate application message
    if (applicationMessage && applicationMessage.trim().length === 0) {
      toast.error('Please write a valid message or leave it empty.');
      return;
    }

    setRegisteringJobs(prev => new Set([...prev, selectedProfileId]));
    console.log(registeringJobs);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE_URL}/api/job-fairs/${selectedJobFairId}/interview-requests`,
        {
          job_profile_id: selectedProfileId,
          message: applicationMessage?.trim() || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Interview request submitted successfully!');
      setAppliedProfiles(prev => new Set([...prev, selectedProfileId]));
      setShowModal(false);
      setApplicationMessage('');
      setSelectedProfileId(null);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 409) {
        toast.warning('You have already applied for this position!');
        setAppliedProfiles(prev => new Set([...prev, selectedProfileId]));
      } else {
        toast.error(
          'Failed to submit application, please make sure you upload your resume.'
        );
      }
    } finally {
      setRegisteringJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedProfileId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (filtered.length > 0 && selected >= filtered.length) {
      setSelected(0);
    }
  }, [filtered.length, selected]);

  return (
    <>
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Explore Career Opportunities
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Company Directory
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover exciting career opportunities with top companies
            participating in our job fairs
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {companies.length}
              </div>
              <div className="text-white/80">Total Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {allJobProfiles.length}
              </div>
              <div className="text-white/80">Open Positions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Application</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Job Fair Event Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-500)] border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white" />
                    <h3 className="font-semibold text-white">
                      Job Fair Events
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  {loadingEvents ? (
                    <div className="flex gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded-lg w-48"></div>
                        </div>
                      ))}
                    </div>
                  ) : jobFairEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-medium">
                        No Job Fair Events Available
                      </p>
                      <p className="text-sm">
                        Please check back later for upcoming events
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {jobFairEvents.map(event => (
                        <motion.button
                          key={event.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedJobFairId(event.id);
                            setSelected(0); // Reset company selection
                          }}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 min-w-0 ${
                            selectedJobFairId === event.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-[var(--secondary-400)] hover:bg-[var(--gray-100)]'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                selectedJobFairId === event.id
                                  ? 'bg-[var(--secondary-400)] text-white'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <Briefcase className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 truncate text-sm">
                              {event.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {new Date(event.start_date).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  event.status === 'published'
                                    ? 'bg-green-500'
                                    : 'bg-yellow-500'
                                }`}
                              />
                              <span className="text-xs text-gray-500 capitalize">
                                {event.status}
                              </span>
                            </div>
                          </div>
                          {selectedJobFairId === event.id && (
                            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Show message if no job fair is selected */}
            {!selectedJobFairId ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center justify-center h-96 text-center">
                  <div>
                    <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                      Select a Job Fair Event
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a job fair event from the tabs above to view
                      participating companies and available positions.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="lg:w-96 w-full space-y-6"
                >
                  {/* Search Bar */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        Search Companies
                      </h3>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by company name or industry..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Filter className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        Filters ({filtered.length} companies)
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry
                        </label>
                        <select
                          className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={filters.industry}
                          onChange={e =>
                            setFilters(f => ({
                              ...f,
                              industry: e.target.value,
                            }))
                          }
                        >
                          {industries.map(ind => (
                            <option key={ind} value={ind}>
                              {ind === 'All' ? 'All Industries' : ind}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Position
                        </label>
                        <select
                          className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={filters.jobTitle}
                          onChange={e =>
                            setFilters(f => ({
                              ...f,
                              jobTitle: e.target.value,
                            }))
                          }
                        >
                          {jobTitles.map(title => (
                            <option key={title} value={title}>
                              {title === 'All' ? 'All Positions' : title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Companies List */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">
                          Companies
                        </h3>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {loadingCompanies || loadingProfiles ? (
                        <div className="p-8 text-center">
                          <LoadingSpinner />
                          <p className="text-gray-500 mt-2">
                            {loadingCompanies
                              ? 'Loading companies...'
                              : 'Loading job profiles...'}
                          </p>
                        </div>
                      ) : filtered.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="font-medium">No companies found</p>
                          <p className="text-sm">
                            {selectedJobFairId
                              ? 'No companies are participating in this job fair or try adjusting your filters'
                              : 'Try adjusting your search or filters'}
                          </p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {filtered.map((c, i) => (
                            <motion.div
                              key={c.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.05, duration: 0.3 }}
                              className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 border-l-4 hover:bg-blue-50 ${
                                selected === i
                                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                                  : 'border-transparent hover:border-blue-200'
                              }`}
                              onClick={() => setSelected(i)}
                            >
                              <ImageWithFallback
                                src={c.logo_path}
                                alt={c.name}
                                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                fallbackText={c.name}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">
                                  {c.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {c.industry}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Briefcase className="w-3 h-3 text-blue-500" />
                                  <span className="text-xs text-blue-600 font-medium">
                                    {getJobProfilesCount(c.id)} Positions
                                  </span>
                                </div>
                              </div>
                              {selected === i && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-blue-500 rounded-full"
                                />
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {company?.name ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                      >
                        {/* Company Header */}
                        <div className="bg-gradient-to-r from-[var(--secondary-400)] to-[var(--secondary-500)] text-white p-8">
                          <div className="flex items-start gap-6">
                            <div className="bg-white p-3 rounded-xl shadow-lg">
                              <ImageWithFallback
                                src={company.logo_path}
                                alt={company.name}
                                className="w-16 h-16 rounded-lg object-cover"
                                fallbackText={company.name}
                              />
                            </div>
                            <div className="flex-1">
                              <h1 className="text-3xl font-bold mb-2">
                                {company.name}
                              </h1>
                              <div className="flex items-center gap-4 text-blue-100 mb-2">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4" />
                                  <span>{company.industry}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  <span>
                                    {currentJobProfiles.length} Open Positions
                                  </span>
                                </div>
                              </div>
                              {/* Job Fair Info */}
                              {selectedJobFairId &&
                                jobFairEvents.find(
                                  e => e.id === selectedJobFairId
                                ) && (
                                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      Participating in:{' '}
                                      {
                                        jobFairEvents.find(
                                          e => e.id === selectedJobFairId
                                        )?.title
                                      }
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Company Content */}
                        <div className="p-8">
                          {/* Available Positions */}
                          <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                              <Briefcase className="w-6 h-6 text-blue-600" />
                              <h2 className="text-2xl font-bold text-gray-900">
                                Available Positions
                              </h2>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {currentJobProfiles.length} positions
                              </span>
                              {loadingProfiles && (
                                <div className="flex items-center gap-2 text-gray-500">
                                  <LoadingSpinner size="sm" />
                                  <span className="text-sm">Loading...</span>
                                </div>
                              )}
                            </div>

                            {loadingProfiles ? (
                              <div className="grid gap-4">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="animate-pulse">
                                    <div className="bg-gray-100 rounded-xl p-6">
                                      <div className="flex justify-between items-start mb-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : currentJobProfiles.length > 0 ? (
                              <div className="grid gap-6">
                                {currentJobProfiles.map((profile, index) => (
                                  <motion.div
                                    key={profile.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: index * 0.1,
                                      duration: 0.4,
                                    }}
                                    className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                          {profile.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                              {profile.employment_type}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {profile.employment_type}
                                      </span>
                                    </div>

                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                      {profile.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                      {!appliedProfiles.has(profile.id) ? (
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          disabled={registeringJobs.has(
                                            profile.id
                                          )}
                                          onClick={() => {
                                            setSelectedProfileId(profile.id);
                                            setShowModal(true);
                                          }}
                                          className="flex items-center gap-2 bg-gradient-to-r from-[var(--secondary-400)] to-[var(--secondary-500)] text-white px-6 py-3 rounded-lg font-medium  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                        >
                                          {registeringJobs.has(profile.id) ? (
                                            <></>
                                          ) : (
                                            <>
                                              <Send className="w-4 h-4" />
                                              <span>Apply Now</span>
                                            </>
                                          )}
                                        </motion.button>
                                      ) : (
                                        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                                          <CheckCircle className="w-5 h-5" />
                                          <span className="font-semibold">
                                            Applied Successfully
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                              >
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                  No Positions Available
                                </h3>
                                <p className="text-gray-500">
                                  This company doesn't have any open positions
                                  at the moment.
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-96 text-center"
                    >
                      <div>
                        <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                          Select a Company
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          Choose a company from the list to view their details
                          and available positions.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Enhanced Modal for Application Message */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[var(--secondary-400)] to-[var(--secondary-500)] text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Application Message</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setApplicationMessage('');
                      setSelectedProfileId(null);
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Write a personalized message to increase your chances of
                  getting noticed.
                </p>
              </div>

              <div className="p-6">
                <textarea
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell them why you're interested in this position and what makes you a great fit... (optional)"
                  value={applicationMessage}
                  onChange={e => setApplicationMessage(e.target.value)}
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setApplicationMessage('');
                      setSelectedProfileId(null);
                    }}
                    className="px-6 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleModalSubmit}
                    className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-[var(--secondary-400)] to-[var(--secondary-500)] text-white  transition-all font-medium shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Submit Application
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HomeFooter />
    </>
  );
};

export default CompanyDirectory;
