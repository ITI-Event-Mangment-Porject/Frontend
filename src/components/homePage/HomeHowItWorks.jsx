import React from 'react';

const steps = [
  {
    title: 'Create Your Event',
    description:
      'Define event details, schedule, location, and registration settings through our user-friendly interface.',
    image: 'https://placehold.co/600x400?text=Event+Creation',
  },
  {
    title: 'Manage Registrations',
    description:
      'Monitor attendee sign-ups, view details, and manage invitation flows with advanced filtering options.',
    image: 'https://placehold.co/600x400?text=Registration+Management',
  },
  {
    title: 'Analyze Performance',
    description:
      'Gain valuable insights into attendance patterns and overall event success through comprehensive reports.',
    image: 'https://placehold.co/600x400?text=Analytics+Dashboard',
  },
];

const HomeHowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-secondary-500">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow our simple process to create and manage successful events
            from start to finish
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-16 items-center`}
            >
              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div
                  className={`
                  p-1 rounded-lg 
                  ${index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}
                `}
                >
                  <h3 className="text-2xl font-bold mb-4 text-primary-500 flex items-center">
                    <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                      {index + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2 relative">
                <div
                  className={`
                  bg-white p-3 rounded-lg shadow-lg 
                  transform transition duration-500 hover:scale-105
                  ${index % 2 === 0 ? 'lg:translate-x-6' : 'lg:-translate-x-6'}
                `}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded"
                  />
                </div>
                {/* Decorative elements */}
                <div
                  className={`absolute rounded-full w-20 h-20 bg-primary-100 z-0 
                  ${index % 2 === 0 ? '-bottom-10 -left-10' : '-top-10 -right-10'}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorks;
