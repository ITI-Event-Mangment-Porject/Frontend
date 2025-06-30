import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        setEvent(data?.data?.result || null);
      } catch {
        setEvent(null);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  const handleRegister = () => {
    setIsRegistered(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        <span className="animate-pulse text-orange-600">
          Loading event details...
        </span>
      </div>
    );
  if (!event)
    return (
      <div className="flex justify-center items-center h-96 text-xl text-red-500">
        No event found.
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 w-full px-2 sm:px-8 py-8">
          {/* Popup */}
          {showPopup && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg text-lg font-semibold border border-green-700 animate-fade-in">
                This event has been registered
              </div>
            </div>
          )}

          {/* Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-10">
            <img
              src={
                event.banner_image ||
                'https://via.placeholder.com/1200x600?text=No+Image'
              }
              alt={event.title}
              className="w-full h-64 sm:h-96 object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
                {event.title}
              </h1>
              <span className="inline-block bg-white/90 text-gray-800 px-4 py-2 rounded-full text-base font-semibold mb-2 shadow">
                {event.type}
              </span>
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <i className="fa-regular fa-calendar text-orange-600"></i>
                  <span>
                    <span className="font-semibold">Duration:</span>{' '}
                    {new Date(event.start_date).toLocaleDateString()} -{' '}
                    {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <i className="fa-solid fa-clock text-orange-600"></i>
                  <span>
                    <span className="font-semibold">Time:</span>{' '}
                    {event.start_time?.slice(0, 5)} -{' '}
                    {event.end_time?.slice(0, 5)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <i className="fa-solid fa-location-dot text-orange-600"></i>
                  <span>
                    <span className="font-semibold">Location:</span>{' '}
                    {event.location}
                  </span>
                </div>
                {event.status && (
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${event.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
              {event.slido_qr_code && (
                <div className="flex flex-col items-center">
                  <img
                    src={event.slido_qr_code}
                    alt="Slido QR"
                    className="w-24 h-24 object-contain"
                  />
                  <span className="text-xs text-gray-500 mt-1">Slido QR</span>
                </div>
              )}
            </div>
            {/* Register Button */}
            <div className="flex justify-end mt-6">
              <button
                className={`px-6 py-2 rounded-lg font-semibold text-base shadow transition-colors ${
                  isRegistered
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
                onClick={isRegistered ? undefined : handleRegister}
                disabled={isRegistered}
              >
                {isRegistered ? 'Registered' : 'Register'}
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Registration Deadline */}
          {event.registration_deadline && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-10">
              <span className="font-semibold text-yellow-700">
                Registration Deadline:{' '}
              </span>
              <span className="text-yellow-800">
                {new Date(event.registration_deadline).toLocaleString()}
              </span>
            </div>
          )}

          {/* Slido Embed */}
          {event.slido_embed_url && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Live Q&A</h2>
              <iframe
                src={event.slido_embed_url}
                title="Slido"
                className="w-full h-96 border-0 rounded-lg shadow"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
