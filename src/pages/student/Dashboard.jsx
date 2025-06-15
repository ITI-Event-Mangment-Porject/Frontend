import { useState } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Card from '../../components/student/Card';
import Footer from '../../components/student/Footer';
import { Link } from 'react-router-dom';

const myEvents = [
  {
    title: 'Annual Tech Career Open 2024',
    date: 'Nov 9, 2024 | 2:00 PM',
    type: 'Conference',
    location: 'Innovation Center',
    img: 'https://picsum.photos/300/200?random=1',
  },
  {
    title: 'Marketing Strategy Summit',
    date: 'Nov 12, 2024 | 10:00 AM',
    type: 'Workshop',
    location: 'Business Hall',
    img: 'https://picsum.photos/300/200?random=2',
  },
];

const recommendedEvents = [
  {
    title: 'Advanced Machine Learning',
    date: 'Nov 15, 2024 | 3:00 PM',
    type: 'Lecture',
    location: 'Tech Building',
    img: 'https://picsum.photos/300/200?random=3',
  },
  {
    title: 'Startup Pitch Competition',
    date: 'Nov 18, 2024 | 1:00 PM',
    type: 'Competition',
    location: 'Main Auditorium',
    img: 'https://picsum.photos/300/200?random=4',
  },
  {
    title: 'UX/UI Design Workshop',
    date: 'Nov 20, 2024 | 11:00 AM',
    type: 'Workshop',
    location: 'Design Studio',
    img: 'https://picsum.photos/300/200?random=5',
  },
  {
    title: 'Cybersecurity Fundamentals',
    date: 'Nov 22, 2024 | 9:00 AM',
    type: 'Course',
    location: 'Security Lab',
    img: 'https://picsum.photos/300/200?random=6',
  },
  {
    title: 'Leadership Development',
    date: 'Nov 25, 2024 | 4:00 PM',
    type: 'Seminar',
    location: 'Leadership Center',
    img: 'https://picsum.photos/300/200?random=7',
  },
  {
    title: 'Creative Arts & Design Showcase',
    date: 'Nov 28, 2024 | 6:00 PM',
    type: 'Exhibition',
    location: 'Art Gallery',
    img: 'https://picsum.photos/300/200?random=8',
  },
];

const UpcomingEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMyEvents = myEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecommendedEvents = recommendedEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasAnyResults =
    filteredMyEvents.length > 0 || filteredRecommendedEvents.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Event sections */}
        <main className="flex-1 overflow-x-hidden w-full max-w-full">
          {/* Hero Section */}
          <div
            className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-35 mb-6"
            style={{
              backgroundImage:
                "url('https://headshots-inc.com/wp-content/uploads/2023/11/event-photography-tips-candid-moments-1.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
            }}
          >
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-4">Hello, Alice!</h1>
              <p className="text-lg mb-6 opacity-90">
                Welcome to your EventHub dashboard where you can discover and
                manage your event experience.
              </p>
              <Link
                to="/event-details"
                className="inline-block bg-red-800 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Events Now →
              </Link>
            </div>
          </div>

          <div className="px-6">
            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-orange-500 text-2xl mb-2">📅</div>
                  <p className="text-sm font-medium text-gray-700">
                    Browse Events
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-orange-500 text-2xl mb-2">📁</div>
                  <p className="text-sm font-medium text-gray-700">
                    View Directory
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-orange-500 text-2xl mb-2">⏰</div>
                  <p className="text-sm font-medium text-gray-700">
                    Check Queue
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-orange-500 text-2xl mb-2">👤</div>
                  <p className="text-sm font-medium text-gray-700">
                    Update Profile
                  </p>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <section className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-orange-500 text-xl mr-3">📅</div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">8</p>
                      <p className="text-sm text-gray-600">Upcoming Events</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-orange-500 text-xl mr-3">📋</div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">3</p>
                      <p className="text-sm text-gray-600">
                        Reservations Booked
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-orange-500 text-xl mr-3">📤</div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">12</p>
                      <p className="text-sm text-gray-600">Invitations Sent</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {searchQuery.trim() && !hasAnyResults ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center w-300 flex items-center justify-center">
                <div>
                  <p className="text-gray-500 text-lg mb-2">No events found</p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your search terms
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* My Upcoming Events Section */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800">
                      My Upcoming Events
                    </h2>
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                      See All
                    </button>
                  </div>

                  {filteredMyEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredMyEvents.map((event, index) => (
                        <Card key={`my-event-${index}`} {...event} />
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center min-h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        No matching events in your upcoming events.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center min-h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">No upcoming events found.</p>
                    </div>
                  )}
                </section>

                {/* Recommended Events Section */}
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800">
                      Recommended Events
                    </h2>
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                      See All
                    </button>
                  </div>

                  {filteredRecommendedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredRecommendedEvents.map((event, index) => (
                        <Card key={`recommended-event-${index}`} {...event} />
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center min-h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        No matching events in recommended events.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center min-h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        No recommended events found.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UpcomingEvents;
