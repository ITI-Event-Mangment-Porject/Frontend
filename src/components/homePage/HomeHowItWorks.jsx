import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Create Your Event',
    description:
      'Define event details, schedule, location, and registration settings through our user-friendly interface.',
    image: 'createEvents.png',
  },
  {
    title: 'Manage Registrations',
    description:
      'Monitor attendee sign-ups, view details with exporting attendees data.',
    image: 'attendance.png',
  },
  {
    title: 'Analyze Performance',
    description:
      'Gain valuable insights into average interview duration and overall event success through comprehensive reports.',
    image: 'analytics.png',
  },
];

const HomeHowItWorks = () => {
  return (
    <section
      className="py-20 bg-gradient-to-br from-[var(--primary-300)] via-white to-[var(--primary-300)] relative overflow-hidden"
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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[var(--secondary-500)]">
            How It Works
          </h2>
          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-[var(--primary-400)] to-[var(--secondary-400)] rounded-full  mx-auto mb-4"
            initial={{ width: 0 }}
            animate={{ width: '5rem' }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow our simple process to create and manage successful events
            from start to finish
          </p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-16 items-center`}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: 'easeOut',
              }}
            >
              {/* Content */}
              <motion.div
                className="w-full lg:w-1/2"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2 + 0.2,
                  ease: 'easeOut',
                }}
              >
                <div
                  className={`
                  p-1 rounded-lg 
                  ${index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}
                `}
                >
                  <motion.h3
                    className="text-2xl font-bold mb-4 text-[var(--primary-500)] flex items-center group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      className="w-8 h-8 bg-[var(--primary-500)] text-white rounded-full flex items-center justify-center mr-3 text-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md"
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                        boxShadow: '0 0 20px rgba(var(--primary-500), 0.5)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {index + 1}
                    </motion.span>
                    <span className="relative">
                      {step.title}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary-500)] transition-all duration-300 group-hover:w-full opacity-60"></span>
                    </span>
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 mb-6 text-lg transition-all duration-300 hover:text-[var(--secondary-500)]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.6, duration: 0.4 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </motion.div>

              {/* Image */}
              <motion.div
                className="w-full lg:w-1/2 relative"
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? 50 : -50,
                  scale: 0.8,
                }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2 + 0.4,
                  ease: 'easeOut',
                }}
              >
                <motion.div
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
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  }}
                  transition={{ duration: 0.3 }}
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
                </motion.div>
                {/* Decorative elements */}
                <motion.div
                  className={`absolute rounded-full w-20 h-20 bg-[var(--primary-300)] opacity-20 z-0 transition-transform duration-700
                  ${index % 2 === 0 ? '-bottom-10 -left-10' : '-top-10 -right-10'}`}
                  style={{
                    animation: `pulse 3s infinite ${index * 0.7}s`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.2 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.8, duration: 0.5 }}
                ></motion.div>

                {/* Additional decorative element */}
                <motion.div
                  className={`absolute w-10 h-10 border-4 border-[var(--primary-500)] opacity-30 z-0 transition-transform duration-700
                  ${index % 2 === 0 ? '-top-6 right-20 rounded-md' : '-bottom-6 left-20 rounded-full'}`}
                  style={{
                    animation: `float 4s ease-in-out infinite ${index * 0.5}s`,
                  }}
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  whileInView={{ scale: 1, opacity: 0.3, rotate: 360 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 1, duration: 0.6 }}
                ></motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorks;
