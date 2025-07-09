import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';
import defaultEvent from '../../assets/images/Business-Event1.jpg';


const API_BASE_URL = 'http://127.0.0.1:8000';

const eventTypeColors = {
  Workshop: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  Seminar: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
  Conference: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
  'Career Fair': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
  Default: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
};

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/events`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        setEvents(
          Array.isArray(data?.data?.result?.data) ? data.data.result.data : []
        );
      } catch {
        setEvents([]);
        setError('Failed to load events.');
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const eventTypes = ['All', ...Array.from(new Set(events.map(e => e.type)))];

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const filteredEvents = events
    .filter(
      e =>
        (filterType === 'All' || e.type === filterType) &&
        (e.title?.toLowerCase().includes(search.toLowerCase()) ||
          e.location?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.start_date) - new Date(b.start_date);
      }
      if (sortBy === 'type') {
        return (a.type || '').localeCompare(b.type || '');
      }
      return 0;
    });

  const now = new Date();
  const upcomingEvents = filteredEvents.filter(
    event => new Date(event.start_date) >= now
  );
  const pastEvents = filteredEvents.filter(
    event => new Date(event.start_date) < now
  );

  const latestEventId = events.reduce((max, e) => (e.id > max ? e.id : max), 0);

 const EventCard = ({ event, isPast = false }) => (
  <div className={`group relative flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${isPast ? 'opacity-75' : ''}`}>
    {event.id === latestEventId && !isPast && (
      <div className="absolute top-4 right-4 z-20">
        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          NEW
        </span>
      </div>
    )}

    <div className="relative overflow-hidden">
      <img
        src={
          event.banner_image
            ? `${API_BASE_URL}/storage/${event.banner_image}`
            : defaultEvent
        }
        alt={event.title}
        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300"
      />


      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>      
      <div className="absolute bottom-4 left-4">
        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
          eventTypeColors[event.type] || eventTypeColors.Default
        }`}>
          {event.type}
        </span>
      </div>
    </div>

    <div className="flex flex-col justify-between flex-1 p-6">
      <div>
        <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-[#901b20] transition-colors">
          {event.title}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <i className="fa-regular fa-calendar text-[#901b20] mr-2"></i>
            <span className="text-sm font-medium">{formatDate(event.start_date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <i className="fa-solid fa-location-dot text-[#901b20] mr-2"></i>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="mt-auto flex justify-end">
        <Link
          to={`/student/event-details/${event.id}`}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#901b20] to-[#6e1417] text-white text-sm font-semibold rounded-xl hover:from-[#6e1417] hover:to-[#901b20] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span>View Details</span>
          <i className="fa-solid fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  </div>
);


  const SectionHeader = ({ title, count, icon, color }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-3 rounded-xl ${color}`}>
        <i className={`${icon} text-2xl text-white`}></i>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500">{count} events available</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore workshops, seminars, conferences and career fairs that will boost your career
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by title or location..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20] text-sm min-w-32"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20] text-sm min-w-32"
                >
                  <option value="date">Sort by Date</option>
                  <option value="type">Sort by Type</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
              <div className="flex items-center">
                <i className="fa-solid fa-exclamation-circle mr-3"></i>
                <span><strong>Error:</strong> {error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#901b20] mb-4"></div>
              <span className="text-[#901b20] text-xl font-semibold">Loading events...</span>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Upcoming Events Section */}
              <section>
                <SectionHeader 
                  title="Upcoming Events" 
                  count={upcomingEvents.length}
                  icon="fa-solid fa-calendar-plus"
                  color="bg-gradient-to-r from-green-500 to-green-600"
                />
                
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <i className="fa-solid fa-calendar-xmark text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 text-lg">No upcoming events found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </section>

              {/* Past Events Section */}
              <section>
                <SectionHeader 
                  title="Past Events" 
                  count={pastEvents.length}
                  icon="fa-solid fa-calendar-check"
                  color="bg-gradient-to-r from-gray-500 to-gray-600"
                />
                
                {pastEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <i className="fa-solid fa-calendar-xmark text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 text-lg">No past events found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map(event => (
                      <EventCard key={event.id} event={event} isPast={true} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default ShowEvents;