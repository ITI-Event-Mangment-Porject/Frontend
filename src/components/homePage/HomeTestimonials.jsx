import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote:
      'communITI completely transformed how we manage our tech conferences. The intuitive dashboard provided insights that helped us improve our attendee experience dramatically.',
    name: 'Sarah Chen',
    position: 'Event Director, TechCorp',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    company: 'TechCorp',
  },
  {
    id: 2,
    quote:
      "We use communITI across all countries for our workshops and seminars. The platform's flexibility and robust reporting capabilities make planning easier than ever before.",
    name: 'David Lee',
    position: 'Global Events Manager',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    rating: 5,
    company: 'EventsPro',
  },
  {
    id: 3,
    quote:
      'The simple registration process and attendee management features saved us countless hours of manual work. communITI is now essential for all our events.',
    name: 'Emily Carter',
    position: 'Marketing Director',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5,
    company: 'CreativeHub',
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
    <section className="py-12 bg-gradient-to-br from-[var(--primary-200)] via-white to-[var(--primary-300)] relative overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-300)] via-transparent to-[var(--primary-400)] opacity-40"></div>

        {/* Animated geometric shapes - smaller sizes */}
        <motion.div
          className="absolute-top-10-left-10 w-20 h-20 bg-[var(--primary-200)] rounded-full opacity-20"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute-bottom-10-right-10 w-30 h-30 bg-[var(--secondary-200)] rounded-full opacity-15"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-[var(--primary-300)] rounded-full opacity-15"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Additional decorative elements - smaller */}
        <motion.div
          className="absolute top-20 right-1/3 w-8 h-8 bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] rounded-lg opacity-15"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-32 left-1/3 w-6 h-6 bg-[var(--secondary-400)] opacity-20"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
          animate={{
            rotate: [0, -360],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary-500) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, var(--secondary-500) 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px, 25px 25px',
          }}
        />

        {/* Floating particles - smaller */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--primary-400)] rounded-full opacity-25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.25, 0.4, 0.25],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Glowing orbs - smaller */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-radial from-[var(--primary-300)] to-transparent opacity-15 rounded-full blur-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/5 w-12 h-12 bg-gradient-radial from-[var(--secondary-300)] to-transparent opacity-10 rounded-full blur-md"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 bg-[var(--primary-500)] rounded-full mb-4"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 text-[var(--secondary-500)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Loved by{' '}
            <span className="text-[var(--primary-500)]">Thousands</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Don't just take our word for it - hear what companies are saying
            about their experience with communITI
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Cards */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="flex justify-center"
                  initial={{ opacity: 0, x: 100, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -100, rotateY: -90 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <div className="w-full max-w-3xl">
                    <motion.div
                      className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Decorative elements */}
                      <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] rounded-full opacity-10"></div>
                      <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-br from-[var(--secondary-400)] to-[var(--secondary-600)] rounded-full opacity-10"></div>

                      {/* Star Rating */}
                      <motion.div
                        className="flex justify-center mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {[...Array(testimonials[activeIndex].rating)].map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * i }}
                            >
                              <svg
                                className="w-6 h-6 text-yellow-400 mx-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </motion.div>
                          )
                        )}
                      </motion.div>

                      {/* Quote */}
                      <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <div className="text-4xl text-[var(--primary-300)] mb-3 font-serif">
                          "
                        </div>
                        <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed italic">
                          {testimonials[activeIndex].quote}
                        </p>
                        <div className="text-4xl text-[var(--primary-300)] mt-3 font-serif rotate-180 inline-block">
                          "
                        </div>
                      </motion.div>

                      {/* Author */}
                      <motion.div
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <motion.div
                          className="relative mr-6"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] p-1">
                            <img
                              src={testimonials[activeIndex].avatar}
                              alt={testimonials[activeIndex].name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        </motion.div>
                        <div className="text-left">
                          <h4 className="font-bold text-lg text-[var(--secondary-500)] mb-1">
                            {testimonials[activeIndex].name}
                          </h4>
                          <p className="text-[var(--primary-600)] font-medium text-sm">
                            {testimonials[activeIndex].position}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {testimonials[activeIndex].company}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <motion.div
              className="flex justify-center items-center mt-8 space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                onClick={() =>
                  setActiveIndex(
                    activeIndex === 0
                      ? testimonials.length - 1
                      : activeIndex - 1
                  )
                }
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 text-[var(--primary-500)] transition-all duration-300"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'var(--primary-500)',
                  color: 'white',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? 'bg-[var(--primary-500)] scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                onClick={() =>
                  setActiveIndex(
                    activeIndex === testimonials.length - 1
                      ? 0
                      : activeIndex + 1
                  )
                }
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 text-[var(--primary-500)] transition-all duration-300"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'var(--primary-500)',
                  color: 'white',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
