import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const CustomLink = ({ to, className, children }) => {
  return (
    <Link to={to} className={`${className} focus:outline-none`}>
      {children}
    </Link>
  );
};

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

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

  // Check for user data on component mount
  useEffect(() => {
    try {
      // Get user directly from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
    }
  }, []);

  // Handle logout
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  // Navigate to dashboard based on user role
  const navigateToDashboard = () => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'student':
        navigate('/student/show-events');
        break;
      case 'company_representative':
        navigate('/company/dashboard');
        break;
      default:
        navigate('/');
    }
    setIsProfileMenuOpen(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isProfileMenuOpen &&
        !event.target.closest('.profile-menu-container')
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <CustomLink to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ITIvent" className="h-20 w-30" />
        </CustomLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <CustomLink
            to="/"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-[var(--gray-700)] hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            Home
          </CustomLink>
          <CustomLink
            to="/about"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            About Us
          </CustomLink>
          <CustomLink
            to="/contact"
            className={`hover:text-[var(--gray-300)] font-medium transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:text-[var(--primary-500)]'
                : 'text-white'
            }`}
          >
            Contact Us
          </CustomLink>
        </div>

        {/* Auth Buttons or User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            // Show login/signup buttons if no user
            <>
              <CustomLink
                to="/login"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isScrolled
                    ? 'text-[var(--gray-700)] hover:text-[var(--primary-600)]'
                    : 'text-white hover:text-[var(--gray-300)]'
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
            </>
          ) : (
            // Show user profile if logged in
            <div className="profile-menu-container relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100 hover:bg-opacity-20'
                    : 'text-white hover:bg-[var(--primary-500)]'
                } `}
              >
                <FaUserCircle className="w-5 h-5" />
                <span className="font-medium">
                  {user.first_name || user.name || 'User'}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in-down">
                  <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                    <p className="font-medium">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.role && (
                      <p className="text-xs text-gray-500 mt-1 capitalize bg-gray-100 px-2 py-1 rounded inline-block">
                        {user.role}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={navigateToDashboard}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaTachometerAlt className="mr-3 h-4 w-4 text-gray-400" />
                    Dashboard
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
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
              to="/"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              Home
            </CustomLink>
            <CustomLink
              to="/#how-it-works"
              className="block py-2 text-gray-700 hover:text-[var(--primary-500)]"
            >
              How It Works
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
            <div className="pt-4 border-t">
              {!user ? (
                // Show login/signup buttons if no user
                <div className="flex flex-col gap-3">
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
              ) : (
                // Show user options if logged in
                <div className="flex flex-col gap-3">
                  <div className="py-2 px-3 bg-gray-50 rounded-md">
                    <p className="font-medium text-gray-800">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={navigateToDashboard}
                    className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaTachometerAlt className="mr-3 h-4 w-4 text-gray-400" />
                    Dashboard
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
