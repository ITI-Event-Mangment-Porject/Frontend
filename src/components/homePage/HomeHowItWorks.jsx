import React from 'react';

const steps = [
  {
    title: 'Create Your Event',
    description:
      'Define event details, schedule, location, and registration settings through our user-friendly interface.',
    image: 'public/createEvents.png',
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
    <section
      className="py-20 bg-[var(--primary-200)] relative overflow-hidden"
      id="how-it-works"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-[var(--primary-500)] opacity-10"
          style={{ animation: 'float 7s infinite' }}
        ></div>
        <div
          className="absolute top-2/3 right-24 w-6 h-6 rounded-full bg-[var(--secondary-500)] opacity-10"
          style={{ animation: 'float 5s infinite 1s' }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-5 h-5 rounded-full bg-[var(--primary-400)] opacity-10"
          style={{ animation: 'float 6s infinite 0.5s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-8 h-8 rounded bg-[var(--primary-500)] opacity-5"
          style={{ animation: 'float 8s infinite 2s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-[var(--secondary-500)]">
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
                  <h3 className="text-2xl font-bold mb-4 text-[var(--primary-500)] flex items-center group">
                    <span className="w-8 h-8 bg-[var(--primary-500)] text-white rounded-full flex items-center justify-center mr-3 text-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                      {index + 1}
                    </span>
                    <span className="relative">
                      {step.title}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-500)] transition-all duration-300 group-hover:w-full opacity-60"></span>
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg transition-all duration-300 hover:text-[var(--secondary-500)]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="w-full lg:w-1/2 relative">
                <div
                  className={`
                  bg-white p-3 rounded-lg shadow-lg 
                  transform transition-all duration-500 hover:scale-105 hover:rotate-0 hover:shadow-xl
                  ${
                    index % 2 === 0
                      ? 'lg:translate-x-6 rotate-3'
                      : 'lg:-translate-x-6 -rotate-3'
                  }
                `}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition:
                      'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow =
                      '0 15px 35px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow =
                      '0 10px 30px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded"
                  />
                </div>
                {/* Decorative elements */}
                <div
                  className={`absolute rounded-full w-20 h-20 bg-[var(--primary-300)] opacity-20 z-0 transition-transform duration-700
                  ${index % 2 === 0 ? '-bottom-10 -left-10' : '-top-10 -right-10'}`}
                  style={{
                    animation: `pulse 3s infinite ${index * 0.7}s`,
                  }}
                ></div>

                {/* Additional decorative element */}
                <div
                  className={`absolute w-10 h-10 border-4 border-[var(--primary-500)] opacity-30 z-0 transition-transform duration-700
                  ${index % 2 === 0 ? '-top-6 right-20 rounded-md' : '-bottom-6 left-20 rounded-full'}`}
                  style={{
                    animation: `float 4s ease-in-out infinite ${index * 0.5}s`,
                  }}
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
