import {
  FaQuestionCircle,
  FaUsers,
  FaCalendarAlt,
  FaBuilding,
  FaClipboardList,
} from 'react-icons/fa';

/* state */

/* data */

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

        <section className="mb-12"></section>
      </div>
    </div>
  );
};

export default Help;
