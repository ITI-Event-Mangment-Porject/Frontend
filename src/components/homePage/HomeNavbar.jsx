import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Link component to remove focus styles
const CustomLink = ({ to, className, children }) => {
  return (
    <Link to={to} className={`${className} focus:outline-none`}>
      {children}
    </Link>
  );
};

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle navbar color change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <CustomLink to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ITIvent" className="h-20 w-25" />
          {/* <span className={`font-bold text-xl ${isScrolled ? 'text-secondary-500' : 'text-white'}`}>
            Communiti
          </span> */}
        </CustomLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <CustomLink
            to="/#features"
            className={`hover:text-[var(--primary-500)] font-medium transition-colors ${
              isScrolled ? 'text-[var(--gray-700)]' : 'text-white'
            }`}
          >
            Features
          </CustomLink>
          <CustomLink
            to="/#how-it-works"
            className={`hover:text-[var(--primary-500)] font-medium transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            How It Works
          </CustomLink>
          <CustomLink
            to="/#events"
            className={`hover:text-[var(--primary-500)] font-medium transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Events
          </CustomLink>
          <CustomLink
            to="/about"
            className={`hover:text-[var(--primary-500)] font-medium transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            About Us
          </CustomLink>
          <CustomLink
            to="/contact"
            className={`hover:text-[var(--primary-500)] font-medium transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            Contact Us
          </CustomLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <CustomLink
            to="/login"
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isScrolled
                ? 'text-[var(--primary-500)] hover:text-primary-600'
                : 'text-white hover:text-[var(--primary-300)]'
            }`}
          >
            Login
          </CustomLink>
          <CustomLink
            to="/register"
            className="px-4 py-2 rounded-md font-medium bg-[var(--primary-600)] text-white hover:bg-[var(--primary-600)] transition-colors animate-fade-in"
          >
            Sign Up
          </CustomLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-in-right">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <CustomLink
              to="/#features"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              Features
            </CustomLink>
            <CustomLink
              to="/#how-it-works"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              How It Works
            </CustomLink>
            <CustomLink
              to="/#events"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              Events
            </CustomLink>
            <CustomLink
              to="/about"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              About Us
            </CustomLink>
            <CustomLink
              to="/contact"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              Contact Us
            </CustomLink>
            <div className="pt-4 border-t flex flex-col gap-3 ">
              <CustomLink
                to="/login"
                className="block w-full py-2 text-center text-[var(--primary-500)] border border-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white rounded-md"
              >
                Login
              </CustomLink>
              <CustomLink
                to="/register"
                className="block w-full py-2 text-center bg-[var(--primary-500)] text-white rounded-md"
              >
                Sign Up
              </CustomLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
