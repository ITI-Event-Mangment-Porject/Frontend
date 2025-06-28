import React, { useState, useEffect } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const eventTypeColors = {
  Workshop: 'bg-blue-100 text-blue-700',
  Seminar: 'bg-purple-100 text-purple-700',
  Conference: 'bg-green-100 text-green-700',
  'Career Fair': 'bg-yellow-100 text-yellow-700',
  Default: 'bg-gray-100 text-gray-700',
};

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setEvents(data.data?.result?.events || []);
      } catch {
        setEvents([]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const eventTypes = ['All', ...Array.from(new Set(events.map(e => e.type)))];

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

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 w-full px-2 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                All Events
              </h1>
              <p className="text-gray-500">
                Browse and discover upcoming events.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="text"
                placeholder="Search by title or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-orange-500 text-xl font-semibold animate-pulse">
                Loading events...
              </span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-gray-400 text-lg">No events found.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col overflow-hidden"
                >
                  <img
                    src={
                      event.banner_image ||
                      'https://picsum.photos/400/200?random=' + event.id
                    }
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                        eventTypeColors[event.type] || eventTypeColors.Default
                      }`}
                    >
                      {event.type}
                    </div>
                    <h2 className="font-bold text-lg text-gray-800 mb-1">
                      {event.title}
                    </h2>
                    <div className="text-sm text-gray-500 mb-2 flex flex-wrap gap-2">
                      <span>
                        <i className="fa-regular fa-calendar mr-1"></i>
                        {event.start_date}
                      </span>
                      <span>
                        <i className="fa-solid fa-location-dot mr-1"></i>
                        {event.location}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm flex-1 mb-3 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex justify-end">
                      <a
                        href={`/student/event-details/${event.id}`}
                        className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ShowEvents;
