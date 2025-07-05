import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import CardSkeleton from '../common/CardSkeleton';

const HomeUpcomingEvents = () => {
  // Always initialize events as an empty array
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 4;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Fetch all pages of events
        let allEvents = [];
        // let currentPage = 1;
        let lastPage = 1;

        // First API call to get the first page and determine total pages
        const firstResponse = await eventAPI.getAll();

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
              remainingRequests.push(eventAPI.getAll({ page }));
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

        console.log('All events from all pages:', allEvents);
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
      case 'ongoing':
        return 'bg-[var(--primary-500)]';
      case 'completed':
        return 'bg-[var(--gray-500)]';
      case 'cancelled':
        return 'bg-[var(--error-500)]';
      case 'draft':
        return 'bg-[var(--warning-500)]';
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
      {console.log(
        'Rendering with events:',
        events,
        'isArray:',
        Array.isArray(events),
        'length:',
        events?.length || 0
      )}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-secondary-500">
            Upcoming Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and register for our featured upcoming events
          </p>
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {getCurrentEvents().map((event, index) => (
                <div
                  key={event.id || index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:translate-y-[-8px] flex flex-col"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    animationDelay: `${index * 0.1}s`,
                    animationName: 'fadeIn',
                    animationDuration: '0.5s',
                    animationFillMode: 'both',
                    height: '100%',
                  }}
                >
                  <div className="relative">
                    {/* Event image */}
                    <img
                      src={
                        event.banner_image ||
                        `https://placehold.co/400x250?text=${encodeURIComponent(event.title)}`
                      }
                      alt={event.title}
                      className="w-full h-48 object-cover"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x250?text=${encodeURIComponent(event.title)}`;
                      }}
                    />

                    {/* Event type badge */}
                    {event.type && (
                      <span className="absolute top-4 right-4 bg-[var(--primary-500)] text-white text-xs px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                    )}

                    {/* Event status badge */}
                    {event.status && (
                      <span
                        className={`absolute bottom-4 left-4 ${getStatusColor(event.status)} text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {event.status}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2 text-[var(--secondary-500)] line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="flex items-center mb-3 text-sm text-gray-500">
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
                    </div>

                    <div className="flex items-center mb-4 text-sm text-gray-500">
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
                    </div>

                    <div className="mt-auto">
                      <Link
                        to={`/event-details/${event.id}`}
                        className="block text-center bg-[var(--primary-500)] text-white py-2 rounded-md hover:bg-[var(--primary-600)] transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:ring-offset-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              {/* Pagination navigation */}
              <div className="flex justify-center items-center mb-8 space-x-6">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full ${
                    currentPage === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                  } transition-all duration-300`}
                  aria-label="Previous page"
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
                </button>

                <span className="text-gray-600">
                  Page {currentPage + 1} of{' '}
                  {Math.max(1, Math.ceil(events.length / eventsPerPage))}
                </span>

                <button
                  onClick={nextPage}
                  disabled={(currentPage + 1) * eventsPerPage >= events.length}
                  className={`p-2 rounded-full ${
                    (currentPage + 1) * eventsPerPage >= events.length
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white'
                  } transition-all duration-300`}
                  aria-label="Next page"
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
                </button>
              </div>

              <Link
                to="/show-events"
                className="inline-flex items-center text-[var(--primary-500)] hover:text-[var(--primary-600)] font-medium transition-all duration-300 hover:translate-x-2 group"
              >
                View all events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
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
          </>
        )}
      </div>
    </section>
  );
};

export default HomeUpcomingEvents;
