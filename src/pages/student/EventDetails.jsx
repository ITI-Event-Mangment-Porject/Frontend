import { useState, useEffect } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const EventsDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: '',
    type: 'success',
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
  });
  const [showAllEvents, setShowAllEvents] = useState(false);

  const registeredEvents = [
    {
      title: 'Web Development Bootcamp',
      date: 'Feb 20, 2025',
      type: 'Workshop',
      status: 'Confirmed',
    },
    {
      title: 'Digital Marketing Summit',
      date: 'Mar 15, 2025',
      type: 'Conference',
      status: 'Pending',
    },
  ];

  const heroEvents = [
    {
      title: 'Annual Career Expo & Job Fair 2025',
      date: 'July 25, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Lecture Hall',
      description:
        'Connect with top employers and explore career opportunities',
      bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'AI & Data Science Summit',
      date: 'August 15, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Tech Center',
      description: 'Explore the future of AI and data science technologies',
      bg: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Startup Pitch Competition',
      date: 'September 10, 2025',
      time: '2:00 PM - 8:00 PM',
      location: 'Innovation Hub',
      description:
        'Watch innovative startups present their groundbreaking ideas',
      bg: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const events = [
    {
      title: 'Design Thinking Workshop',
      date: 'Mar 5, 2025',
      type: 'Workshop',
      location: 'Innovation Lab',
      img: 'https://picsum.photos/300/200?random=3',
    },
    {
      title: 'Global Leadership Seminar',
      date: 'May 12, 2025',
      type: 'Seminar',
      location: 'Business Center',
      img: 'https://picsum.photos/300/200?random=5',
    },
    {
      title: 'Finance & Banking Career Day',
      date: 'Jun 8, 2025',
      type: 'Career Fair',
      location: 'Finance Building',
      img: 'https://picsum.photos/300/200?random=6',
    },
  ];

  const speakers = [
    {
      name: 'Dr. Evelyn Reed',
      title: 'Quantum AI Labs',
      image: 'https://picsum.photos/200/200?random=speaker1',
    },
    {
      name: 'Marcus Thorne',
      title: 'Syncraft Solutions',
      image: 'https://picsum.photos/200/200?random=speaker2',
    },
    {
      name: 'Chloe Li',
      title: 'GeekTech Solutions',
      image: 'https://picsum.photos/200/200?random=speaker3',
    },
  ];

  const sponsors = [
    {
      name: 'TechCorp',
      logo: 'https://via.placeholder.com/150x80/0066CC/FFFFFF?text=TechCorp',
    },
    {
      name: 'Global Solutions',
      logo: 'https://via.placeholder.com/150x80/FF6600/FFFFFF?text=GlobalSol',
    },
    {
      name: 'Innovation Labs',
      logo: 'https://via.placeholder.com/150x80/00CC66/FFFFFF?text=InnoLabs',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(
      () => setPopup({ show: false, message: '', type: 'success' }),
      3000
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showPopup('Please fill in all required fields', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRegistered(true);
      setIsModalOpen(false);
      showPopup('Registration successful!');
    }, 2000);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Navbar />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 overflow-x-hidden w-full">
          {/* Hero Slider */}
          <div className="relative h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden">
            {heroEvents.map((event, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                  index === currentSlide
                    ? 'translate-x-0'
                    : index < currentSlide
                      ? '-translate-x-full'
                      : 'translate-x-full'
                }`}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${event.bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex items-center justify-center h-full text-white px-2 sm:px-6">
                  <div className="text-center max-w-2xl md:max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                      {event.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-4 sm:mb-8 text-sm sm:text-lg">
                      <span>
                        <i className="fa-solid fa-calendar mr-2"></i>
                        {event.date}
                      </span>
                      <span>
                        <i className="fa-solid fa-clock mr-2"></i>
                        {event.time}
                      </span>
                      <span>
                        <i className="fa-solid fa-location-dot mr-2"></i>
                        {event.location}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      disabled={isRegistered}
                      className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all ${
                        isRegistered
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                      }`}
                    >
                      {isRegistered ? '✓ Registered' : 'Register Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="px-2 sm:px-6 py-6 sm:py-8">
            {/* Speakers */}
            <section className="mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                  Featured Speakers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {speakers.map((speaker, i) => (
                    <div key={i} className="text-center">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-2 sm:mb-3 object-cover"
                      />
                      <h4 className="font-semibold text-gray-800">
                        {speaker.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-orange-600">
                        {speaker.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Sponsors */}
            <section className="mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">
                  Our Sponsors
                </h2>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
                    {sponsors.map((sponsor, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center p-2 sm:p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-8 sm:max-h-12 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Registered Events */}
            <section className="mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                  My Registered Events
                </h2>
                {registeredEvents.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {registeredEvents.map((event, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {event.title}
                          </h3>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <span className="mr-2 sm:mr-4">
                              <i className="fa-regular fa-calendar mr-1"></i>
                              {event.date}
                            </span>
                            <span className="text-orange-500">
                              {event.type}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`mt-2 sm:mt-0 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            event.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6 sm:py-8">
                    No registered events yet.
                  </p>
                )}
              </div>
            </section>

            {/* Events */}
            <section className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Upcoming Events
                </h2>
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {showAllEvents ? 'Show Less' : 'See More'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredEvents
                  .slice(0, showAllEvents ? filteredEvents.length : 3)
                  .map((event, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                      <img
                        src={event.img}
                        alt={event.title}
                        className="w-full h-36 sm:h-48 object-cover"
                      />
                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        <div className="text-xs text-orange-500 font-medium mb-1">
                          {event.type}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2">
                          {event.title}
                        </h3>
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">
                          <i className="fa-regular fa-calendar mr-1"></i>
                          {event.date}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          <i className="fa-solid fa-location-dot mr-1"></i>
                          {event.location}
                        </div>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-auto w-full bg-orange-500 text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-xs sm:max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Event Registration
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: 'name', label: 'Full Name *', type: 'text' },
                  { name: 'email', label: 'Email *', type: 'email' },
                  { name: 'phone', label: 'Phone *', type: 'tel' },
                  { name: 'university', label: 'University', type: 'text' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-base"
                    />
                  </div>
                ))}
                <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-2 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-2 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-xs sm:text-base"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup */}
      {popup.show && (
        <div className="fixed top-4 right-2 sm:right-4 z-50">
          <div
            className={`max-w-xs sm:max-w-sm w-full shadow-lg rounded-lg p-3 sm:p-4 ${
              popup.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            <div className="flex items-center">
              <i
                className={`fa-solid ${popup.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2 sm:mr-3`}
              ></i>
              <p className="text-xs sm:text-sm font-medium flex-1">
                {popup.message}
              </p>
              <button
                onClick={() =>
                  setPopup({ show: false, message: '', type: 'success' })
                }
                className="ml-1 sm:ml-2 text-white hover:text-gray-200"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsDetails;
