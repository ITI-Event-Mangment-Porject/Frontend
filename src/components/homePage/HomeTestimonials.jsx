import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    quote:
      'ITIvent completely transformed how we manage our tech conferences. The intuitive dashboard provided insights that helped us improve our attendee experience dramatically.',
    name: 'Sarah Chen',
    position: 'Event Director, TechCorp',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    quote:
      "We use ITIvent across all countries for our workshops and seminars. The platform's flexibility and robust reporting capabilities make planning easier than ever before.",
    name: 'David Lee',
    position: 'Global Events Manager',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
  },
  {
    id: 3,
    quote:
      'The simple registration process and attendee management features saved us countless hours of manual work. ITIvent is now essential for all our events.',
    name: 'Emily Carter',
    position: 'Marketing Director',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

const HomeTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-secondary-500">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from event planners who've transformed their events with our
            platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="min-w-full px-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                      {/* Quote icon */}
                      <div className="text-primary-300 mb-6">
                        <svg
                          width="45"
                          height="36"
                          className="fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.415.43c-2.523 0-4.121 1.438-4.795 2.693C7.505 5.434 6.846 8.052 6.57 9.676c-.407 2.427-.475 4.163-.21 6.106.907 6.62 6.033 7.957 9.27 8.137 3.478.192 6.013-1.397 7.526-3.953 1.62-2.739 1.928-5.887.888-8.605-1.045-2.727-3.306-4.483-5.863-5.23.468-2.994-1.548-5.7-4.764-5.7zm22.665 0c-2.523 0-4.121 1.438-4.795 2.693-1.115 2.311-1.774 4.929-2.05 6.553-.407 2.427-.476 4.163-.21 6.106.907 6.62 6.033 7.957 9.27 8.137 3.478.192 6.013-1.397 7.526-3.953 1.62-2.739 1.928-5.887.888-8.605-1.045-2.727-3.306-4.483-5.864-5.23.47-2.994-1.547-5.7-4.764-5.7z"
                            fill-rule="nonzero"
                          />
                        </svg>
                      </div>

                      {/* Testimonial */}
                      <p className="text-gray-600 text-lg italic mb-6">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-secondary-500">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`mx-1 w-3 h-3 rounded-full transition-colors ${
                    activeIndex === index ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
