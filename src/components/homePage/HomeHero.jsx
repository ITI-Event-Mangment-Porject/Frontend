import React from 'react';
import { Link } from 'react-router-dom';

// Custom animation styles
const animationStyles = `
  @keyframes slideInFromLeft {
    from {
      transform: translateX(-50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideInFromBottom {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes popIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    70% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const HomeHero = () => {
  return (
    <section className="relative bg-gradient-to-r from-[var(--secondary-500)] to-[var(--primary-500)] text-white pt-40 pb-35 overflow-hidden">
      {/* Inject custom animations */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      {/* Enhanced Background Elements with Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-1/4 left-1/3 w-48 h-48 rounded-full bg-[var(--primary-400)] opacity-20 animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-[var(--secondary-400)] opacity-10 animate-float"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/5 w-32 h-32 rounded-full bg-white opacity-5 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>

        {/* Additional Animated Elements */}
        <div
          className="absolute top-20 right-40 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div
          className="absolute bottom-40 left-1/4 animate-bounce"
          style={{ animationDelay: '1.5s', animationDuration: '3s' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div
          className="absolute top-40 right-1/4 animate-spin"
          style={{ animationDelay: '1s', animationDuration: '10s' }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15.6 7.8L22 8.4L17 12.6L18.2 19L12 15.6L5.8 19L7 12.6L2 8.4L8.4 7.8L12 2Z"
              stroke="white"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 relative z-10">
        {/* Hero Content with Enhanced Animation */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0">
          <div className="overflow-hidden">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight transform transition-all duration-700"
              style={{
                animation: 'slideInFromLeft 0.8s ease-out forwards',
              }}
            >
              Manage Your Events{' '}
              <span className="relative">
                Seamlessly
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ animation: 'drawLine 1.5s ease-out forwards 0.8s' }}
                >
                  <path
                    d="M0 4C50 0 150 0 200 4"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                </svg>
              </span>{' '}
              with CommunITI
            </h1>
          </div>

          <p
            className="text-lg md:text-xl opacity-0 mb-8 max-w-lg mx-auto lg:mx-0"
            style={{ animation: 'fadeIn 0.8s ease-out forwards 0.4s' }}
          >
            Create and manage perfect event experiences for your attendees with
            our powerful planning platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto sm:justify-center lg:justify-start">
            <Link
              to="/login"
              className="btn px-8 py-3 bg-white text-[var(--primary-500)] hover:bg-gray-100 transition-all duration-300 font-semibold rounded-md text-center hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="btn px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[var(--primary-500)] transition-all duration-300 font-semibold rounded-md text-center hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Image with Enhanced Animation */}
        <div
          className="flex-1 hidden lg:flex items-center justify-center opacity-0 "
          style={{ animation: 'fadeIn 1s ease-out forwards 0.6s' }}
        >
          <div className="relative bg-white p-3 rounded-lg shadow-xl transform rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:shadow-2xl">
            <img
              src="/event.png"
              alt="Event Management Dashboard"
              className="rounded max-w-full h-auto"
            />
            <div
              className="absolute -bottom-4 -left-4 bg-[var(--primary-500)] text-white py-2 px-4 rounded-lg text-sm font-medium shadow-lg transform-rotate-2 transition-all duration-300 hover:rotate-0 hover:scale-105 opacity-0"
              style={{
                animation: 'slideInFromBottom 0.5s ease-out forwards 1.5s',
              }}
            >
              Seamless Experience
            </div>
          </div>
        </div>
      </div>

      {/* Wave Shape Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 text-white"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.17,96.92,165.17,69.9,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HomeHero;
