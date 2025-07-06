import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

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
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to streamline your events?
          </motion.h2>
          <motion.p
            className="text-xl text-white opacity-90 mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of successful event organizers who transformed their
            events management with CommunITI.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/login"
                className="w-full block px-8 py-3 bg-white text-primary-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-center transform hover:shadow-xl"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/show-events"
                className="w-full block px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition duration-300 text-center"
              >
                Browse Events
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white"
            ref={statsRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="flex flex-col items-center transform transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {eventCount}+
              </motion.div>
              <div className="text-sm opacity-80">Events Managed</div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center transform transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                {attendeeCount}+
              </motion.div>
              <div className="text-sm opacity-80">Attendees</div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center transform transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                {satisfactionRate}%
              </motion.div>
              <div className="text-sm opacity-80">Satisfaction Rate</div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center transform transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.3 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                {supportHours}/7
              </motion.div>
              <div className="text-sm opacity-80">Support</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeCTA;
