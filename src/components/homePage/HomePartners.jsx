import React from 'react';

// Import logos if you have them, or create placeholders
const partnersData = [
  { name: 'Microsoft', logo: '/logo-placeholder.svg' },
  { name: 'Google', logo: '/logo-placeholder.svg' },
  { name: 'Apple', logo: '/logo-placeholder.svg' },
  { name: 'Amazon', logo: '/logo-placeholder.svg' },
  { name: 'IBM', logo: '/logo-placeholder.svg' },
  { name: 'Oracle', logo: '/logo-placeholder.svg' },
  { name: 'Samsung', logo: '/logo-placeholder.svg' },
  { name: 'Adobe', logo: '/logo-placeholder.svg' },
];

const HomePartners = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-500">
            Our Trusted Partners
          </h2>
          <p className="text-gray-600 text-lg">
            We collaborate with industry leaders to bring you the best
            opportunities and experiences in our events.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partnersData.map((partner, index) => (
            <div
              key={index}
              className="w-full h-24 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              style={{
                animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
                opacity: 0,
              }}
            >
              <div className="flex items-center justify-center h-full w-full grayscale hover:grayscale-0 transition-all duration-300">
                {/* Replace with actual logo or create a placeholder */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-primary-500 font-bold">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {partner.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePartners;
