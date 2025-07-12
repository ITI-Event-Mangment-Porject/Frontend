import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { eventAPI } from '../../services/api';
import CardSkeleton from '../../components/common/CardSkeleton';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import HomeFooter from '../../components/homePage/HomeFooter';
import useScrollToTop from '../../hooks/useScrollToTop';

const AllEvents = () => {
  useScrollToTop();
  const navigate = useNavigate();

  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const eventsPerPage = 8;

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let allEvents = [];
        let lastPage = 1;

        const params = {
          'filter[status]': 'published',
        };

        const firstResponse = await eventAPI.getAll(params);

        if (firstResponse?.data?.data?.result) {
          const { result } = firstResponse.data.data;

          if (Array.isArray(result.data)) {
            allEvents = [...result.data];
          }

          lastPage = result.last_page || 1;

          if (lastPage > 1) {
            const remainingRequests = [];
            for (let page = 2; page <= lastPage; page++) {
              remainingRequests.push(eventAPI.getAll({ ...params, page }));
            }

            const responses = await Promise.all(remainingRequests);
            responses.forEach(response => {
              const pageEvents = response?.data?.data?.result?.data;
              if (Array.isArray(pageEvents)) {
                allEvents = [...allEvents, ...pageEvents];
              }
            });
          }
        }
        setEvents(allEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    fetchEvents();
  }, []);

  // Get gradient colors for event placeholder
  const getEventGradient = index => {
    const gradients = [
      'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
      'linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-500) 100%)',
      'linear-gradient(45deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
      'linear-gradient(225deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
    ];
    return gradients[index % gradients.length];
  };

  // Format date function
  const formatDate = dateString => {
    try {
      if (!dateString) return 'TBD';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.log('Date formatting error:', error);
      return dateString || 'TBD';
    }
  };

  // Filter events
  const getFilteredEvents = () => {
    if (!Array.isArray(events)) return [];

    let filtered = events;
    if (selectedFilter !== 'all') {
      filtered = events.filter(
        event => event.type?.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    return filtered;
  };

  // Get current events for pagination
  const getCurrentEvents = () => {
    const filtered = getFilteredEvents();
    const start = currentPage * eventsPerPage;
    const end = start + eventsPerPage;
    return filtered.slice(start, end);
  };

  // Navigation functions
  const nextPage = () => {
    const totalEvents = getFilteredEvents().length;
    if ((currentPage + 1) * eventsPerPage < totalEvents) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle filter change
  const handleFilterChange = filter => {
    setSelectedFilter(filter);
    setCurrentPage(0);
  };

  // Get unique event types for filters
  const getEventTypes = () => {
    const types = events.map(event => event.type).filter(Boolean);
    return [...new Set(types)];
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 text-[var(--primary-500)]">
        <Calendar className="w-full h-full" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-3">
        No Events Found
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {selectedFilter === 'all'
          ? 'There are no events available at the moment. Please check back later for new opportunities.'
          : `No ${selectedFilter} events found. Try selecting a different filter or check back later.`}
      </p>
    </div>
  );

  const filteredEvents = getFilteredEvents();
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Calendar className="h-4 w-4 mr-2" />
            Discover Amazing Events
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            All Events
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore all upcoming events, workshops, and opportunities available
            at CommunITI
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
                {events.length}
              </div>
              <div className="text-white/80">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {getEventTypes().length}
              </div>
              <div className="text-white/80">Event Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Registration</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedFilter === 'all'
                  ? 'bg-[var(--primary-500)] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            {getEventTypes().map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 capitalize ${
                  selectedFilter === type
                    ? 'bg-[var(--primary-500)] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <CardSkeleton count={8} />
            </div>
          ) : error || filteredEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Events Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {getCurrentEvents().map((event, index) => (
                  <motion.div
                    key={event.id || index}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <div className="relative">
                      {/* Event image */}
                      {event.banner_image ? (
                        <img
                          src={event.banner_image}
                          alt={event.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}

                      {/* Colorful placeholder for events without banner */}
                      <div
                        className={`w-full h-48 ${!event.banner_image ? 'block' : 'hidden'} relative overflow-hidden`}
                        style={{
                          background: getEventGradient(index),
                        }}
                      >
                        {/* Decorative elements */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute -top-8 -left-8 w-24 h-24 bg-white rounded-full"></div>
                          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white rounded-full"></div>
                          <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full"></div>
                          <div className="absolute bottom-8 left-8 w-12 h-12 bg-white rounded-full"></div>
                        </div>

                        {/* Main content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center px-4">
                            <div className="relative inline-block mb-3">
                              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                              <div className="relative bg-white/10 rounded-full p-3 backdrop-blur-sm">
                                <Calendar className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                              <p className="text-white text-sm font-semibold leading-tight">
                                {event.title.length > 25
                                  ? event.title.substring(0, 25) + '...'
                                  : event.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Event type badge */}
                      {event.type && (
                        <span className="absolute top-4 right-4 bg-[var(--primary-500)] text-white text-xs px-3 py-1 rounded-full font-medium">
                          {event.type}
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-xl mb-3 text-[var(--secondary-500)] line-clamp-2 group-hover:text-[var(--primary-500)] transition-colors duration-300">
                        {event.title}
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          {formatDate(event.start_date)}
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {event.location || 'TBD'}
                          </span>
                        </div>

                        {event.start_time && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            {event.start_time.substring(0, 5)}
                            {event.end_time &&
                              ` - ${event.end_time.substring(0, 5)}`}
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() =>
                            navigate(`/student/event-details/${event.id}`)
                          }
                          className="w-full bg-[var(--primary-500)] text-white py-3 px-4 rounded-lg hover:bg-[var(--primary-600)] transition-all duration-300 font-medium group-hover:shadow-lg"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center space-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-3 rounded-full ${
                      currentPage === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                    } transition-all duration-300`}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <span className="text-gray-600 font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={currentPage + 1 >= totalPages}
                    className={`p-3 rounded-full ${
                      currentPage + 1 >= totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                    } transition-all duration-300`}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
      <HomeFooter />
    </div>
  );
};

export default AllEvents;
