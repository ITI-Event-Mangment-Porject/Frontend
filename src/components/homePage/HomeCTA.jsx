import React from 'react';
import { Link } from 'react-router-dom';

const HomeCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with color overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] opacity-90"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
            Ready to streamline your events?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 md:mb-10">
            Join thousands of successful event organizers who transformed their
            events management with Comuniti.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-primary-600 border-primary font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-center"
            >
              Get Started
            </Link>
            <Link
              to="/show-events"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:text-[var(--gray-900)] hover:bg-white hover:bg-opacity-10 transition duration-300 text-center"
            >
              Browse Events
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-sm opacity-80">Events Managed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-sm opacity-80">Attendees</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-80">Satisfaction Rate</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
