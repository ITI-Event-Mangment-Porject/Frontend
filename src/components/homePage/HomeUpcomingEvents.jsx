import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import CardSkeleton from '../common/CardSkeleton';

const HomeUpcomingEvents = () => {
  // Always initialize events as an empty array
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('Fetching events...');

        // Using the eventAPI service from the services folder
        const response = await eventAPI.getAll({
          limit: 6, // Get 6 events since we'll filter for published only
          sort: 'start_date', // Sort by start date
          // Note: Filter not working on the API side, so we'll filter client-side
        });

        console.log('Full API response:', response);

        // Handle pagination or direct response based on API structure
        // Make sure we're accessing the correct nesting level
        const eventData = response?.data?.result?.data || [];
        console.log('Event data extracted:', eventData);

        // Filter for published events only and ensure it's an array
        const publishedEvents = Array.isArray(eventData)
          ? eventData.filter(event => {
              console.log(`Event ${event.id} status:`, event.status);
              return event.status?.toLowerCase() === 'published';
            })
          : [];

        console.log('Published events filtered:', publishedEvents);
        setEvents(publishedEvents);
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
              {events &&
                events.map((event, index) => (
                  <div
                    key={event.id || index}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:translate-y-[-8px]"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      animationDelay: `${index * 0.1}s`,
                      animationName: 'fadeIn',
                      animationDuration: '0.5s',
                      animationFillMode: 'both',
                    }}
                  >
                    <div className="relative">
                      {/* Event image */}
                      <img
                        src={
                          event.banner_image ||
                          event.image ||
                          `https://placehold.co/400x250?text=${encodeURIComponent(event.title)}`
                        }
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />

                      {/* Event type badge */}
                      {event.type && (
                        <span className="absolute top-4 right-4 bg-[var(--primary-500)] text-white text-xs px-2 py-1 rounded-full">
                          {event.type}
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-[var(--secondary-500)] line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="flex items-center mb-3 text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
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
                          className="h-4 w-4 mr-2"
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
                        {event.location || 'TBD'}
                      </div>

                      <Link
                        to={`/event-details/${event.id}`}
                        className="block text-center bg-[var(--primary-500)] text-white py-2 rounded-md hover:bg-[var(--primary-600)] transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:ring-offset-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-center mt-12">
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
