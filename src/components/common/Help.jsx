import { useState } from 'react';
import {
  FaQuestionCircle,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaCalendarAlt,
  FaBuilding,
  FaClipboardList,
} from 'react-icons/fa';

/* data */
// FAQ data - you can move this to a separate file later
const faqData = [
  {
    id: 1,
    category: 'Events',
    question: 'How do I register for an event?',
    answer:
      'To register for an event, navigate to the Events page, find your desired event, and click the "Register" button. You must be logged in with your ITI Portal account to register.',
  },
  {
    id: 2,
    category: 'Job Fair',
    question: 'How do I request an interview with a company?',
    answer:
      'During a Job Fair event, go to the Company Directory, browse available companies and their job profiles, then click "Request Interview" on the positions you\'re interested in.',
  },
  {
    id: 3,
    category: 'Queue',
    question: 'How can I check my interview queue status?',
    answer:
      'Visit the Interview Queue Status page during active Job Fair events to see your current position, estimated wait time, and company schedule.',
  },
  {
    id: 4,
    category: 'Profile',
    question: 'Can I update my profile information?',
    answer:
      'Basic profile information is synced from ITI Portal and cannot be changed directly. However, you can upload your CV and update notification preferences in the Profile section.',
  },
  {
    id: 5,
    category: 'Technical',
    question: 'What browsers are supported?',
    answer:
      'ITIVENT works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date for the best experience.',
  },
  {
    id: 6,
    category: 'Feedback',
    question: 'How do I submit feedback for an event?',
    answer:
      'After attending an event, you\'ll receive a notification to submit feedback. You can also access feedback forms from your dashboard under "My Events".',
  },
];

// Quick help categories
const helpCategories = [
  {
    icon: FaCalendarAlt,
    title: 'Events',
    description: 'Learn about event registration and participation',
    color: 'var(--primary-500)',
  },
  {
    icon: FaBuilding,
    title: 'Job Fairs',
    description: 'Guide to job fair participation and interviews',
    color: 'var(--secondary-500)',
  },
  {
    icon: FaUsers,
    title: 'Profile',
    description: 'Manage your profile and preferences',
    color: 'var(--primary-400)',
  },
  {
    icon: FaClipboardList,
    title: 'Feedback',
    description: 'Submit and view event feedback',
    color: 'var(--primary-300)',
  },
];

/* functionalitiy */

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredFAQs = faqData.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = id => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <FaQuestionCircle
              className="mx-auto text-6xl mb-4 animate-float"
              style={{ color: 'var(--primary-500)' }}
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support
              team
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Help Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <category.icon
                  className="text-3xl mb-4 group-hover:animate-bounce"
                  style={{ color: category.color }}
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>

            <div className="relative mb-8">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                style={{
                  focusRingColor: 'var(--primary-500)',
                  '--tw-ring-color': 'var(--primary-500)',
                }}
              />
            </div>

            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map(faq => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
                    >
                      <div>
                        <span
                          className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2"
                          style={{
                            backgroundColor: 'var(--primary-200)',
                            color: 'var(--primary-500)',
                          }}
                        >
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      {expandedFaq === faq.id ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 py-4 bg-white animate-fade-in">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <p className="text-xl text-gray-600">No results found.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
