import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { eventAPI } from '../../services/api';
import CardSkeleton from '../common/CardSkeleton';
import Modal from '../common/Modal';

const HomeUpcomingEvents = () => {
  // Always initialize events as an empty array
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 4;
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Function to open modal with event details
  const openEventModal = event => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Fetch all pages of events with published status filter
        let allEvents = [];
        let lastPage = 1;

        // Create params object with the status filter
        const params = {
          'filter[status]': 'published',
        };

        // First API call to get the first page and determine total pages
        const firstResponse = await eventAPI.getAll(params);

        if (firstResponse?.data?.data?.result) {
          const { result } = firstResponse.data.data;

          // Add first page events
          if (Array.isArray(result.data)) {
            allEvents = [...result.data];
          }

          // Get pagination info
          lastPage = result.last_page || 1;

          // Fetch remaining pages if there are more
          if (lastPage > 1) {
            const remainingRequests = [];

            // Create an array of promises for pages 2 to lastPage
            for (let page = 2; page <= lastPage; page++) {
              remainingRequests.push(eventAPI.getAll({ ...params, page }));
            }

            // Wait for all requests to complete
            const responses = await Promise.all(remainingRequests);

            // Process each response and add events to allEvents array
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
        console.error('Error details:', err.response?.data || err.message);
        setError('Failed to load upcoming events');
        setEvents([]); // Reset events to empty array on error
      } finally {
        // Delay the loading state change slightly to show skeleton for at least 600ms
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    fetchEvents();
  }, []);

  // Navigation functions
  const nextPage = () => {
    if ((currentPage + 1) * eventsPerPage < events.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Get current events for pagination
  const getCurrentEvents = () => {
    if (!Array.isArray(events) || events.length === 0) return [];

    const start = currentPage * eventsPerPage;
    const end = start + eventsPerPage;
    return events.slice(start, end);
  };

  // Format date function
  const formatDate = dateString => {
    try {
      if (!dateString) return 'TBD';
      const date = new Date(dateString);
      // Check if the date is valid
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

  // Get status badge color
  const getStatusColor = status => {
    if (!status) return 'bg-gray-500';

    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-[var(--success-500)]';
      default:
        return 'bg-[var(--gray-500)]';
    }
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-20 h-15 mb-4 text-[var(--primary-500)] animate-float">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-3">
        No Events Available
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        There are no upcoming events at the moment. Please check back later for
        new opportunities.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-5 py-2 text-sm font-medium rounded-md text-white bg-[var(--primary-500)] hover:bg-[var(--primary-600)] transition-all duration-300"
      >
        Get Notified About New Events
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );

  return (
    <section className="py-20 bg-white" id="events">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-secondary-500">
            Upcoming Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and register for our featured upcoming events
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CardSkeleton count={4} />
          </div>
        ) : error && (!events || events.length === 0) ? (
          <EmptyState />
        ) : !events || events.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              {getCurrentEvents().map((event, index) => (
                <motion.div
                  key={event.id || index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  style={{
                    height: '100%',
                  }}
                >
                  <div className="relative">
                    {/* Event image */}
                    <motion.img
                      src={
                        event.banner_image ||
                        `https://placehold.co/400x250?text=${encodeURIComponent(event.title)}`
                      }
                      alt={event.title}
                      className="w-full h-48 object-cover"
                      initial={{ scale: 1.1 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x250?text=${encodeURIComponent(event.title)}`;
                      }}
                    />

                    {/* Event type badge */}
                    {event.type && (
                      <motion.span
                        className="absolute top-4 right-4 bg-[var(--primary-500)] text-white text-xs px-2 py-1 rounded-full"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                      >
                        {event.type}
                      </motion.span>
                    )}

                    {/* Event status badge */}
                    {/* {event.status && (
                      <span
                        className={`absolute bottom-4 left-4 ${getStatusColor(event.status)} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {event.status}
                      </span>
                    )} */}
                  </div>

                  <motion.div
                    className="p-5 flex flex-col flex-grow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    <motion.h3
                      className="font-bold text-lg mb-2 text-[var(--secondary-500)] line-clamp-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                    >
                      {event.title}
                    </motion.h3>

                    <motion.div
                      className="flex items-center mb-3 text-sm text-gray-500"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(event.start_date)}
                    </motion.div>

                    <motion.div
                      className="flex items-center mb-4 text-sm text-gray-500"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="line-clamp-1">
                        {event.location || 'TBD'}
                      </span>
                    </motion.div>

                    <div className="mt-auto">
                      <button
                        onClick={() => openEventModal(event)}
                        className="block w-full text-center bg-[var(--primary-500)] text-white py-2 rounded-md hover:bg-[var(--primary-600)] transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:ring-offset-2"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Pagination navigation */}
              <motion.div
                className="flex justify-center items-center mb-8 space-x-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full ${
                    currentPage === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                  } transition-all duration-300`}
                  aria-label="Previous page"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                </motion.button>

                <motion.span
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {/* Page {currentPage + 1} of{' '} */}
                  {/* {Math.max(1, Math.ceil(events.length / eventsPerPage))} */}
                </motion.span>

                <motion.button
                  onClick={nextPage}
                  disabled={(currentPage + 1) * eventsPerPage >= events.length}
                  className={`p-2 rounded-full ${
                    (currentPage + 1) * eventsPerPage >= events.length
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                  } transition-all duration-300`}
                  aria-label="Next page"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              ></motion.div>
            </motion.div>
          </>
        )}

        {/* Modal for event details */}
        {isModalOpen && selectedEvent && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeEventModal}
            title={selectedEvent?.title || 'Event Details'}
            size="lg"
            showFooter={false}
          >
            {selectedEvent && (
              <motion.div
                className="event-details-modal relative overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Enhanced Background with animated gradient overlay */}
                <div className="absolute inset-0  opacity-50 "></div>

                {/* Decorative elements with enhanced animations */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[var(--primary-300)] opacity-10 animate-float-slow"></div>
                <div className="absolute bottom-5 -left-10 w-24 h-24 rounded-full bg-[var(--secondary-300)] opacity-10 animate-float"></div>
                <div className="absolute top-1/3 -left-5 w-16 h-16 rounded-full bg-[var(--primary-400)] opacity-5 animate-float-reverse"></div>
                <div className="absolute bottom-1/4 right-5 w-20 h-20 rounded-full bg-[var(--secondary-400)] opacity-5 animate-float-slow"></div>

                {/* Additional decorative elements */}
                <div className="absolute top-1/2 right-0 w-1 h-20 bg-gradient-to-b from-[var(--primary-300)] to-transparent opacity-30"></div>
                <div className="absolute bottom-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-[var(--secondary-300)] to-transparent opacity-30"></div>

                {/* Content container with relative position */}
                <div className="relative z-10 p-2">
                  {/* Event Image with enhanced animation */}
                  <motion.div
                    className="mb-6 overflow-hidden rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <img
                      src={
                        selectedEvent.banner_image ||
                        `https://placehold.co/800x400?text=${encodeURIComponent(selectedEvent.title)}`
                      }
                      alt={selectedEvent.title}
                      className="w-full h-64 object-cover rounded-lg transition-all duration-700 hover:saturate-150"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/800x400?text=${encodeURIComponent(
                          selectedEvent.title
                        )}`;
                      }}
                    />
                    {/* Gradient overlay on image for depth */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg opacity-60"></div> */}
                  </motion.div>

                  {/* Event Status Badge with enhanced styling */}
                  <motion.div
                    className="mb-4 flex flex-wrap gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {selectedEvent.status && (
                      <motion.span
                        className={`inline-block ${getStatusColor(
                          selectedEvent.status
                        )} text-white text-sm px-4 py-1.5 rounded-full shadow-md`}
                        whileHover={{
                          y: -2,
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {selectedEvent.status}
                      </motion.span>
                    )}

                    {selectedEvent.type && (
                      <motion.span
                        className="inline-block bg-[var(--primary-500)] text-white text-sm px-4 py-1.5 rounded-full shadow-md"
                        whileHover={{
                          y: -2,
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {selectedEvent.type}
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Event Title with enhanced animation and styling */}
                  <motion.div
                    className="relative mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--secondary-600)]">
                      {selectedEvent.title}
                    </h3>
                    <motion.div
                      className="h-1 w-20 bg-gradient-to-r from-[var(--primary-400)] to-[var(--secondary-400)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '5rem' }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </motion.div>

                  {/* Event Meta Information with enhanced layout and animation */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-md border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    <motion.div
                      className="flex items-center text-gray-700"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="p-3 rounded-full bg-[var(--primary-100)] mr-4 text-[var(--primary-500)]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--secondary-500)]">
                          Date
                        </div>
                        <div className="text-gray-600">
                          {formatDate(selectedEvent.start_date)}
                          {selectedEvent.end_date &&
                          selectedEvent.end_date !== selectedEvent.start_date
                            ? ` - ${formatDate(selectedEvent.end_date)}`
                            : ''}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center text-gray-700"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="p-3 rounded-full bg-[var(--primary-100)] mr-4 text-[var(--primary-500)]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
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
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--secondary-500)]">
                          Time
                        </div>
                        <div className="text-gray-600">
                          {selectedEvent.start_time
                            ? selectedEvent.start_time.substring(0, 5)
                            : 'TBD'}
                          {selectedEvent.end_time
                            ? ` - ${selectedEvent.end_time.substring(0, 5)}`
                            : ''}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center text-gray-700"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="p-3 rounded-full bg-[var(--primary-100)] mr-4 text-[var(--primary-500)]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--secondary-500)]">
                          Location
                        </div>
                        <div className="text-gray-600">
                          {selectedEvent.location || 'TBD'}
                        </div>
                      </div>
                    </motion.div>

                    {selectedEvent.registration_deadline && (
                      <motion.div
                        className="flex items-center text-gray-700"
                        whileHover={{ x: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <div className="p-3 rounded-full bg-[var(--primary-100)] mr-4 text-[var(--primary-500)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
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
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--secondary-500)]">
                            Registration Deadline
                          </div>
                          <div className="text-gray-600">
                            {formatDate(selectedEvent.registration_deadline)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Event Description with enhanced styling */}
                  <motion.div
                    className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                  >
                    <h4 className="text-xl font-semibold mb-4 text-[var(--secondary-500)] flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
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
                      Description
                    </h4>
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedEvent.description}
                    </div>
                  </motion.div>

                  {/* Event Creator with enhanced styling */}
                  {selectedEvent.creator && (
                    <motion.div
                      className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-gray-100 flex items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.6 }}
                      whileHover={{
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-300)] to-[var(--primary-500)] flex items-center justify-center text-white mr-4 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--secondary-500)]">
                          Organized by
                        </h4>
                        <div className="text-gray-700">
                          {selectedEvent.creator.first_name}{' '}
                          {selectedEvent.creator.last_name}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Button with enhanced animation and styling */}
                  <motion.div
                    className="mt-8 flex justify-end"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/event-details/${selectedEvent.id}`}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white font-medium rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:ring-offset-2 group"
                      >
                        <span className="mr-2">Register for Event</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </Modal>
        )}
      </div>
    </section>
  );
};

export default HomeUpcomingEvents;
