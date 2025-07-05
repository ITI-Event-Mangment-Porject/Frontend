import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomeCTA = () => {
  // Reference to the stats section for intersection observer
  const statsRef = useRef(null);

  // State for each counter
  const [eventCount, setEventCount] = useState(0);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(0);
  const [supportHours, setSupportHours] = useState(0);

  // Animation trigger state
  const [isVisible, setIsVisible] = useState(false);

  // Counter animation function
  const animateCounter = (startValue, endValue, setValue, duration) => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();
      const remainingTime = Math.max(endTime - now, 0);
      const progress = 1 - remainingTime / duration;

      // Using easeOutQuad easing function for a natural feel
      const easedProgress = 1 - (1 - progress) * (1 - progress);

      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easedProgress
      );
      setValue(currentValue);

      if (now < endTime) {
        requestAnimationFrame(updateCounter);
      } else {
        setValue(endValue);
      }
    };

    updateCounter();
  };

  // Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isVisible]);

  // Start counter animation when section becomes visible
  useEffect(() => {
    if (isVisible) {
      animateCounter(0, 100, setEventCount, 2500);
      animateCounter(0, 1000, setAttendeeCount, 2500);
      animateCounter(0, 98, setSatisfactionRate, 2500);
      animateCounter(0, 24, setSupportHours, 1500);
    }
  }, [isVisible]);
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] opacity-90 animate-gradient-x"></div>

      {/* Decorative elements with animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white opacity-10 animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white opacity-5 animate-float-reverse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white opacity-10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight animate-fadeIn">
            Ready to streamline your events?
          </h2>
          <p
            className="text-xl text-white opacity-90 mb-8 md:mb-10 animate-fadeIn"
            style={{ animationDelay: '0.3s' }}
          >
            Join thousands of successful event organizers who transformed their
            events management with Comuniti.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-primary-600 border-primary font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-center transform hover:scale-105 hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/show-events"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[var(--primary-600)] transition duration-300 text-center transform hover:scale-105"
            >
              Browse Events
            </Link>
          </div>

          <div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white"
            ref={statsRef}
          >
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2">{eventCount}+</div>
              <div className="text-sm opacity-80">Events Managed</div>
            </div>
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2">{attendeeCount}+</div>
              <div className="text-sm opacity-80">Attendees</div>
            </div>
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2">{satisfactionRate}%</div>
              <div className="text-sm opacity-80">Satisfaction Rate</div>
            </div>
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="text-4xl font-bold mb-2">{supportHours}/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
