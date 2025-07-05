import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomeUpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Using the API endpoint from your project
        const response = await axios.get('http://127.0.0.1:8000/api/events', {
          params: {
            limit: 4, // Only get 4 upcoming events
            sort: 'start_date', // Sort by start date
            filter: 'upcoming', // Only get upcoming events
          },
        });

        // Handle pagination or direct response based on your API structure
        const eventData =
          response.data?.data?.result?.data || response.data?.data || [];
        setEvents(eventData);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load upcoming events');

        // Set fallback events in case of API failure
        setEvents([
          {
            id: 1,
            title: 'Tech Innovation Summit 2025',
            image: 'https://placehold.co/400x250?text=Tech+Summit',
            date: '2025-07-15',
            location: 'Cairo, Egypt',
          },
          {
            id: 2,
            title: 'Marketing Masters Workshop',
            image: 'https://placehold.co/400x250?text=Marketing+Workshop',
            date: '2025-07-20',
            location: 'Alexandria, Egypt',
          },
          {
            id: 3,
            title: 'Annual Job Fair & Career Expo',
            image: 'https://placehold.co/400x250?text=Career+Expo',
            date: '2025-08-05',
            location: 'Cairo, Egypt',
          },
          {
            id: 4,
            title: 'Data Science Conference',
            image: 'https://placehold.co/400x250?text=Data+Science',
            date: '2025-08-12',
            location: 'Online',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date function
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  return (
    <section className="py-20 bg-white" id="events">
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
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-gray-500 py-8">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="block mx-auto mt-4 text-primary-500 underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event, index) => (
                <div
                  key={event.id || index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
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
                      <span className="absolute top-4 right-4 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-secondary-500 line-clamp-2">
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
                      {formatDate(event.start_date || event.date)}
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
                      {event.location}
                    </div>

                    <Link
                      to={`/event-details/${event.id}`}
                      className="block text-center bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors"
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
                className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
              >
                View all events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
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
