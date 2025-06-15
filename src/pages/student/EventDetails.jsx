import { useState } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const Card = ({ title, date, type, location, img }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <img src={img} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <div className="text-xs text-orange-500 font-medium mb-1">{type}</div>
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
      <div className="text-sm text-gray-600 mb-1">
        <i className="fa-regular fa-calendar mr-1"></i>
        {date}
      </div>
      <div className="text-sm text-gray-600">
        <i className="fa-solid fa-location-dot mr-1"></i>
        {location}
      </div>
      <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
        Register Now
      </button>
    </div>
  </div>
);

const recommendedEvents = [
  {
    title: 'AI & Data Science Summit',
    date: 'Jan 20, 2025',
    type: 'Conference',
    location: 'Tech Center',
    img: 'https://picsum.photos/300/200?random=1',
  },
  {
    title: 'Sustainability Engineering Forum',
    date: 'Feb 10, 2025',
    type: 'Forum',
    location: 'Green Campus',
    img: 'https://picsum.photos/300/200?random=2',
  },
  {
    title: 'Design Thinking Workshop',
    date: 'Mar 5, 2025',
    type: 'Workshop',
    location: 'Innovation Lab',
    img: 'https://picsum.photos/300/200?random=3',
  },
  {
    title: 'Startup Pitch Competition',
    date: 'Apr 1, 2025',
    type: 'Competition',
    location: 'Main Hall',
    img: 'https://picsum.photos/300/200?random=4',
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
    company: 'Quantum AI Labs',
    image: 'https://picsum.photos/200/200?random=speaker1',
  },
  {
    name: 'Marcus Thorne',
    title: 'Senior Software Engineer at Syncraft Solutions',
    company: 'Syncraft Solutions',
    image: 'https://picsum.photos/200/200?random=speaker2',
  },
  {
    name: 'Chloe Li',
    title: 'UX/UI Designer and Lead at GeekTech Solutions',
    company: 'GeekTech Solutions',
    image: 'https://picsum.photos/200/200?random=speaker3',
  },
  {
    name: 'David Chung',
    title: 'Head of Product Management at Global Connect Ltd',
    company: 'Global Connect Ltd',
    image: 'https://picsum.photos/200/200?random=speaker4',
  },
];

const sponsors = [
  {
    name: 'TechCorp',
    logo: 'https://via.placeholder.com/150x80/0066CC/FFFFFF?text=TechCorp',
    tier: 'Platinum',
  },
  {
    name: 'Global Solutions',
    logo: 'https://via.placeholder.com/150x80/FF6600/FFFFFF?text=GlobalSol',
    tier: 'Gold',
  },
  {
    name: 'Innovation Labs',
    logo: 'https://via.placeholder.com/150x80/00CC66/FFFFFF?text=InnoLabs',
    tier: 'Gold',
  },
  {
    name: 'NextGen Tech',
    logo: 'https://via.placeholder.com/150x80/CC0066/FFFFFF?text=NextGen',
    tier: 'Silver',
  },
  {
    name: 'Future Works',
    logo: 'https://via.placeholder.com/150x80/6600CC/FFFFFF?text=FutureWorks',
    tier: 'Silver',
  },
  {
    name: 'Smart Systems',
    logo: 'https://via.placeholder.com/150x80/CC6600/FFFFFF?text=SmartSys',
    tier: 'Bronze',
  },
];

const EventsDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = recommendedEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 overflow-x-hidden w-full max-w-full">
          {/* Hero Section */}
          <div
            className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-35 mb-6"
            style={{
              backgroundImage:
                "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQwEPZVZAzC3l5O9DWD7qm-8R0NlSllb7ROnmS6P3kyoIw67ZCihGjH0d9H0m5AteKK6RqgZ1v4C2KsE3FGDgMxTXqqbQzlwxxoWkSfoej791sWy15kFB0FEs7dJ3ajBcaXdIs-22eeTGgeQeHgoKnSF_BcQI4CyXPakC7zjl5hh9an_5-ohjvc_7DNNs/s800/%D8%AF%D9%88%D8%B1%D8%A7%D8%AA%20%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D8%B0%D8%A7%D8%AA.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
            }}
          >
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-6">
                Annual Career Expo & Job Fair 2025
              </h1>
              <p className="text-lg mb-6 opacity-90">
                <i className="fa-solid mx-3 fa-calendar"></i> July 25, 2025,
                10:00 AM - 4:00 PM
                <i className="fa-solid mx-3 fa-location-dot"></i> Lecture Hall
              </p>
              <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Register Now →
              </button>
            </div>
          </div>

          <div className="px-6">
            {/* Event Registration Card with About Section */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 p-2 rounded">
                          <i className="fa-solid fa-calendar text-orange-600"></i>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Date</div>
                          <div className="font-medium">Dec 15, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 p-2 rounded">
                          <i className="fa-solid fa-clock text-orange-600"></i>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Time</div>
                          <div className="font-medium">
                            10:00 AM - 5:00 PM PST
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 p-2 rounded">
                          <i className="fa-solid fa-location-dot text-orange-600"></i>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Location</div>
                          <div className="font-medium">
                            Hybrid: Virtual & Campus
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 p-2 rounded">
                          <i className="fa-solid fa-briefcase text-orange-600"></i>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Type</div>
                          <div className="font-medium">Career Fair</div>
                        </div>
                      </div>
                    </div>

                    {/* About Section moved here */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        About This Event
                      </h3>
                      <div className="text-gray-700 leading-relaxed text-sm">
                        <p className="mb-3">
                          Welcome to the{' '}
                          <strong>"Annual Career Expo & Job Fair 2024"</strong>,
                          EventHub's premier event connecting students with top
                          employers! This hybrid event offers both a dynamic
                          virtual platform and an on-campus experience, designed
                          to maximize your networking opportunities and career
                          prospects across a wide array of full-time positions,
                          internships, and co-op opportunities across various
                          industries like Tech, Healthcare, Finance, Consulting,
                          Engineering.
                        </p>
                        <p className="mb-3">
                          <strong>Event Flow:</strong> Explore company profiles,
                          watch presentations, and chat live with recruiters
                          from leading organizations.
                        </p>
                        <p className="mb-3">
                          <strong>Pro-Candidate Resources:</strong> Participate
                          in on-the-spot interview opportunities, and expand
                          your professional network.
                        </p>
                        <p>
                          <strong>Workshops & Valuable Insights:</strong> Get
                          valuable insights from industry leaders on topics like
                          resume building, interview skills, and career
                          development.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 w-full lg:w-80">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Event Registration
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Secure your spot for this exciting event.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <i className="fa-solid fa-star text-yellow-500"></i>
                      <span className="text-sm font-medium text-gray-800">
                        Event starts in:
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-4">
                      Event has started!
                    </div>
                    <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors mb-3">
                      Register Now
                    </button>
                    <p className="text-xs text-gray-500">
                      Limited spots available. Don't miss out!
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Event Host
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        EventHub Team, Career Services
                      </p>
                      <p className="text-sm text-gray-600">
                        <i className="fa-solid fa-envelope mr-1"></i>
                        info@eventhub.com
                      </p>
                      <p className="text-sm text-gray-600">
                        <i className="fa-solid fa-phone mr-1"></i>
                        +1 (123) 456-7890
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Event Agenda */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Event Agenda
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">
                      Opening Ceremony & Keynote Address
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">Virtual Booth</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">
                      Workshop: Resume Optimization for 2025
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">
                      Panel Discussion: Navigating Your First Job
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">
                      Lunch Break & Informal Networking
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">
                      On-Campus Company Presentations
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-800">
                      Mock Interview Sessions (Pre-booked)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-800">
                      Closing Remarks & Raffle Draw
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Meet the Speakers */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Meet the Speakers
                </h2>

                {/* Speakers Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {speakers.map((speaker, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-lg mb-1">
                              {speaker.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {speaker.title}
                            </p>
                            <p className="text-sm text-orange-600 font-medium mb-3">
                              {speaker.company}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {index === 0 &&
                                'Dr. Evelyn Reed is a groundbreaking researcher in quantum machine learning and AI ethics.'}
                              {index === 1 &&
                                'Marcus Thorne specializes in scalable backend architectures and has extensive experience in software engineering.'}
                              {index === 2 &&
                                'Chloe Li designs initiative and accessible user experiences for diverse communities with innovative solutions.'}
                              {index === 3 &&
                                'David Chung has a keen eye for identifying and nurturing top talent in the tech industry.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Event Sponsors */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Event Sponsors
                </h2>

                <div className="flex justify-center">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {sponsors.map((sponsor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-12 max-w-24 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* You Might Also Like */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  You Might Also Like
                </h2>
              </div>

              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {filteredEvents.map((event, index) => (
                    <Card key={`event-${index}`} {...event} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No matching events found.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default EventsDetails;
