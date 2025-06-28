import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';

const quickActions = [
  {
    icon: '📅',
    title: 'Browse Events',
    bg: 'from-orange-50 to-orange-100',
    link: '/event-details',
  },
  {
    icon: '📁',
    title: 'View Directory',
    bg: 'from-blue-50 to-blue-100',
    link: '/company-directory',
  },
  {
    icon: '⏰',
    title: 'Check Queue',
    bg: 'from-purple-50 to-purple-100',
    link: '/interview-queue',
  },
  {
    icon: '👤',
    title: 'Update Profile',
    bg: 'from-green-50 to-green-100',
    link: '/profile',
  },
];

const stats = [
  { icon: '📅', value: '8', label: 'Upcoming Events', color: 'orange' },
  { icon: '📋', value: '3', label: 'Reservations Booked', color: 'blue' },
  { icon: '📤', value: '12', label: 'Invitations Sent', color: 'green' },
];

const Card = ({ title, date, type, location, img }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img
      src={img || 'https://via.placeholder.com/400x200?text=No+Image'}
      alt={title}
      className="w-full h-32 sm:h-40 md:h-48 object-cover"
    />
    <div className="p-3 sm:p-4">
      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-1">
        {new Date(date).toLocaleDateString()}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 mb-1">{type}</p>
      <p className="text-xs sm:text-sm text-gray-600">{location}</p>
    </div>
  </div>
);

const UpcomingEvents = () => {
  const [events, setEvents] = useState({ my: [], recommended: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMyEvents, setShowAllMyEvents] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://127.0.0.1:8000/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const allEvents = res.data?.data?.result?.data || [];
        setEvents({ my: allEvents, recommended: allEvents });
      })
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const userName = 'Alice';
  const filterEvents = list =>
    list.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const EventSection = ({ title, eventList, showAll, setShowAll }) => {
    const displayEvents = showAll ? eventList : eventList.slice(0, 4);
    return (
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            {title}
          </h2>
          {eventList.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-orange-500 hover:text-orange-600 font-medium px-3 py-2 sm:px-4 rounded-lg hover:bg-orange-50 transition-colors text-sm sm:text-base"
            >
              {showAll ? 'Show Less' : 'See All'} →
            </button>
          )}
        </div>
        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {displayEvents.map((event, i) => (
              <Card
                key={event.id || i}
                title={event.title}
                date={event.start_date}
                type={event.type}
                location={event.location}
                img={event.banner_image}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 text-center">
            <p className="text-gray-500 text-base sm:text-lg">
              {searchQuery.trim()
                ? 'No matching events found.'
                : 'No events found.'}
            </p>
          </div>
        )}
      </section>
    );
  };

  const filteredMyEvents = filterEvents(events.my);
  const filteredRecommendedEvents = filterEvents(events.recommended);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden w-full">
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://headshots-inc.com/wp-content/uploads/2023/11/event-photography-tips-candid-moments-1.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-red-600/70 to-purple-600/60" />
            <div className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-300 drop-shadow-lg mb-4 sm:mb-6">
                Hello, {userName}!
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-2xl drop-shadow-md mb-6 sm:mb-8">
                Welcome to your{' '}
                <span className="font-semibold text-yellow-300">CommunITI</span>{' '}
                dashboard.
              </p>
              <Link
                to="/event-details"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black bg-gradient-to-r from-white to-yellow-300 rounded-full hover:from-yellow-300 hover:to-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Explore Events Now</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-12 w-full">
            {/* Quick Actions */}
            <section className="mb-6 sm:mb-8 -mt-6 sm:-mt-8">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center"></h2>
                <div className="flex flex-col gap-5 sm:hidden">
                  {quickActions.map((action, i) => (
                    <Link
                      key={i}
                      to={action.link}
                      className={`group bg-gradient-to-br ${action.bg} p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block`}
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <p className="font-medium text-gray-700 text-sm">
                        {action.title}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {quickActions.map((action, i) => (
                    <Link
                      key={i}
                      to={action.link}
                      className={`group bg-gradient-to-br ${action.bg} p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block`}
                    >
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <p className="font-medium text-gray-700 text-xs sm:text-sm lg:text-base">
                        {action.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="mb-6 sm:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-l-4 border-orange-500"
                  >
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 sm:p-3 rounded-full text-orange-600 text-lg sm:text-xl lg:text-2xl mr-3 sm:mr-4 flex-shrink-0">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base truncate">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Search */}
            <section className="mb-6 sm:mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
                  Search Events
                </h2>
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base lg:text-lg"
                  />
                </div>
              </div>
            </section>

            {/* Event Sections */}
            {searchQuery.trim() &&
            !filteredMyEvents.length &&
            !filteredRecommendedEvents.length ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg sm:text-xl mb-2">
                  No events found
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <>
                <EventSection
                  title="My Upcoming Events"
                  eventList={filteredMyEvents}
                  showAll={showAllMyEvents}
                  setShowAll={setShowAllMyEvents}
                />
                <EventSection
                  title="Recommended Events"
                  eventList={filteredRecommendedEvents}
                  showAll={showAllRecommended}
                  setShowAll={setShowAllRecommended}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-auto">
        <div className="px-4 sm:px-6 py-4 text-center text-gray-600 w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
