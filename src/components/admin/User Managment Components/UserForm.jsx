import React, { useRef, useEffect, useState } from 'react';
import {
  FaUser,
  FaUpload,
  FaEnvelope,
  FaIdCard,
  FaPhoneAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaCalendarAlt,
  FaUserGraduate,
} from 'react-icons/fa';

// Helper function to parse and extract field-specific errors
const getFieldErrorFromApiError = (error, fieldName) => {
  if (!error) return null;

  // Check if the error contains field-specific errors
  const regex = new RegExp(`${fieldName}:\\s*([^\\n]+)`, 'i');
  const match = error.match(regex);

  return match ? match[1] : null;
};

const UserForm = ({
  user,
  setUser,
  tracks,
  trackLoading,
  onSubmit,
  submitLoading,
  error,
  profileImagePreview,
  setProfileImagePreview,
  isEdit = false,
}) => {
  // Local form validation state
  const [errors, setErrors] = useState({});

  // Create a ref for the form
  const formRef = useRef(null);

  // Validation function for all fields
  const validateForm = () => {
    const newErrors = {};

    if (
      !isEdit &&
      (!user.portal_user_id || user.portal_user_id.trim() === '')
    ) {
      newErrors.portal_user_id = 'Portal User ID is required';
    }

    if (!user.first_name || user.first_name.trim() === '') {
      newErrors.first_name = 'First name is required';
    }

    if (!user.last_name || user.last_name.trim() === '') {
      newErrors.last_name = 'Last name is required';
    }

    if (!user.email || user.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (user.phone && !/^\+?[0-9]{10,15}$/.test(user.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!user.track_id) {
      newErrors.track_id = 'Track is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Effect to scroll to the field with an error when API returns errors
  useEffect(() => {
    if (error && formRef.current) {
      // Scroll to top of form with a slight delay to ensure DOM is updated
      setTimeout(() => {
        // First scroll to the error message at the top
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Now look for specific field errors and focus on the first one found
        const errorFields = [
          { pattern: 'email:', selector: 'input[name="email"]' },
          { pattern: 'first_name:', selector: 'input[name="first_name"]' },
          { pattern: 'last_name:', selector: 'input[name="last_name"]' },
          {
            pattern: 'portal_user_id:',
            selector: 'input[name="portal_user_id"]',
          },
          { pattern: 'phone:', selector: 'input[type="tel"]' },
          { pattern: 'bio:', selector: 'textarea' },
          {
            pattern: 'track_id:',
            selector: 'select[value="' + user.track_id + '"]',
          },
          {
            pattern: 'linkedin_url:',
            selector: 'input[value="' + (user.linkedin_url || '') + '"]',
          },
          {
            pattern: 'github_url:',
            selector: 'input[value="' + (user.github_url || '') + '"]',
          },
          {
            pattern: 'portfolio_url:',
            selector: 'input[value="' + (user.portfolio_url || '') + '"]',
          },
          { pattern: 'is_active:', selector: 'select' },
        ];

        // Find the first field that has an error
        for (const field of errorFields) {
          if (error.includes(field.pattern)) {
            const errorInput = formRef.current.querySelector(field.selector);
            if (errorInput) {
              // Scroll the element into view
              errorInput.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });

              // Add a highlight effect
              errorInput.classList.add(
                'border-red-500',
                'ring-2',
                'ring-red-200'
              );

              // Focus on the input
              errorInput.focus();

              // Remove highlight effect after 2 seconds
              setTimeout(() => {
                errorInput.classList.remove('ring-2', 'ring-red-200');
              }, 2000);

              break; // Stop after finding the first error
            }
          }
        }
      }, 100);
    }
  }, [
    error,
    user.track_id,
    user.linkedin_url,
    user.github_url,
    user.portfolio_url,
  ]);

  // Handle form submission with validation
  const handleSubmit = e => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      onSubmit(e);
    } else {
      // Scroll to the first field with an error
      setTimeout(() => {
        // Get all error fields
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          // Find the first field with an error
          const firstErrorField = errorFields[0];
          const errorElement = formRef.current.querySelector(
            `[name="${firstErrorField}"]`
          );

          if (errorElement) {
            // Scroll to the error element
            errorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            // Focus on the error element
            errorElement.focus();
          } else if (firstErrorField === 'track_id') {
            // Handle select elements that might not have a name attribute
            const trackSelect = formRef.current.querySelector('select');
            if (trackSelect) {
              trackSelect.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
              trackSelect.focus();
            }
          }
        }
      }, 100);
    }
  };

  // File handling functions
  const handleProfileImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setUser(prev => ({ ...prev, profile_image: file }));
      const reader = new FileReader();
      reader.onload = e => setProfileImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setUser(prev => ({ ...prev, profile_image: null }));
    setProfileImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-sm text-gray-500 mb-6">
        Fill out the details below to {isEdit ? 'update' : 'create'} a user. All
        fields with * are required.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="border-2 border-gray-300 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
            {profileImagePreview ? (
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="h-44 w-44 object-cover rounded-full mx-auto"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute top-0 right-1/2 transform translate-x-16 -translate-y-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : isEdit && user.profile_image ? (
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={user.profile_image}
                  alt="Current profile"
                  className="h-44 w-44 object-cover rounded-full mx-auto"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute top-0 right-1/2 transform translate-x-16 -translate-y-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop an image here, or{' '}
                    <span className="text-blue-500">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('profile-image').click()
                  }
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Upload Photo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaUser className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="first_name"
                value={user.first_name || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, first_name: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.first_name ||
                  getFieldErrorFromApiError(error, 'first_name')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="John"
              />
            </div>
            {(errors.first_name ||
              getFieldErrorFromApiError(error, 'first_name')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.first_name ||
                  getFieldErrorFromApiError(error, 'first_name')}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaUser className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="last_name"
                value={user.last_name || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, last_name: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.last_name ||
                  getFieldErrorFromApiError(error, 'last_name')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
            </div>
            {(errors.last_name ||
              getFieldErrorFromApiError(error, 'last_name')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.last_name ||
                  getFieldErrorFromApiError(error, 'last_name')}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaEnvelope className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                value={user.email || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, email: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.email || getFieldErrorFromApiError(error, 'email')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="example@domain.com"
              />
            </div>
            {(errors.email || getFieldErrorFromApiError(error, 'email')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email || getFieldErrorFromApiError(error, 'email')}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaPhoneAlt className="h-4 w-4" />
              </span>
              <input
                type="tel"
                value={user.phone || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, phone: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.phone || getFieldErrorFromApiError(error, 'phone')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {(errors.phone || getFieldErrorFromApiError(error, 'phone')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone || getFieldErrorFromApiError(error, 'phone')}
              </p>
            )}
          </div>
        </div>

        {/* Portal User ID - only for new users */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portal User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaIdCard className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="portal_user_id"
                value={user.portal_user_id || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, portal_user_id: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.portal_user_id ||
                  getFieldErrorFromApiError(error, 'portal_user_id')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="User ID from portal"
              />
            </div>
            {(errors.portal_user_id ||
              getFieldErrorFromApiError(error, 'portal_user_id')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.portal_user_id ||
                  getFieldErrorFromApiError(error, 'portal_user_id')}
              </p>
            )}
          </div>
        )}

        {/* Biography */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={user.bio || ''}
            onChange={e => setUser(prev => ({ ...prev, bio: e.target.value }))}
            rows="4"
            className={`w-full p-2 border rounded-md focus:border-0 ${
              errors.bio || getFieldErrorFromApiError(error, 'bio')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Provide a brief description about the user"
          />
          {(errors.bio || getFieldErrorFromApiError(error, 'bio')) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bio || getFieldErrorFromApiError(error, 'bio')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Intake Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intake Year
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaCalendarAlt className="h-4 w-4" />
              </span>
              <input
                type="number"
                value={user.intake_year || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, intake_year: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.intake_year ||
                  getFieldErrorFromApiError(error, 'intake_year')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="2023"
                min="2020"
                max="2030"
              />
            </div>
            {(errors.intake_year ||
              getFieldErrorFromApiError(error, 'intake_year')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.intake_year ||
                  getFieldErrorFromApiError(error, 'intake_year')}
              </p>
            )}
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaUserGraduate className="h-4 w-4" />
              </span>
              <input
                type="number"
                value={user.graduation_year || ''}
                onChange={e =>
                  setUser(prev => ({
                    ...prev,
                    graduation_year: e.target.value,
                  }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.graduation_year ||
                  getFieldErrorFromApiError(error, 'graduation_year')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="2024"
                min="2020"
                max="2035"
              />
            </div>
            {(errors.graduation_year ||
              getFieldErrorFromApiError(error, 'graduation_year')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.graduation_year ||
                  getFieldErrorFromApiError(error, 'graduation_year')}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaLinkedin className="h-4 w-4" />
              </span>
              <input
                type="url"
                value={user.linkedin_url || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, linkedin_url: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.linkedin_url ||
                  getFieldErrorFromApiError(error, 'linkedin_url')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            {(errors.linkedin_url ||
              getFieldErrorFromApiError(error, 'linkedin_url')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.linkedin_url ||
                  getFieldErrorFromApiError(error, 'linkedin_url')}
              </p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaGithub className="h-4 w-4" />
              </span>
              <input
                type="url"
                value={user.github_url || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, github_url: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.github_url ||
                  getFieldErrorFromApiError(error, 'github_url')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="https://github.com/username"
              />
            </div>
            {(errors.github_url ||
              getFieldErrorFromApiError(error, 'github_url')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.github_url ||
                  getFieldErrorFromApiError(error, 'github_url')}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaGlobe className="h-4 w-4" />
              </span>
              <input
                type="url"
                value={user.portfolio_url || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, portfolio_url: e.target.value }))
                }
                className={`w-full p-2 pl-10 border rounded-md focus:border-0 ${
                  errors.portfolio_url ||
                  getFieldErrorFromApiError(error, 'portfolio_url')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="https://your-portfolio.com"
              />
            </div>
            {(errors.portfolio_url ||
              getFieldErrorFromApiError(error, 'portfolio_url')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.portfolio_url ||
                  getFieldErrorFromApiError(error, 'portfolio_url')}
              </p>
            )}
          </div>

          {/* Track */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Track <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={user.track_id || ''}
                onChange={e =>
                  setUser(prev => ({ ...prev, track_id: e.target.value }))
                }
                className={`w-full p-2 border rounded-md focus:border-0 appearance-none pr-8 ${
                  errors.track_id ||
                  getFieldErrorFromApiError(error, 'track_id')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                required
                disabled={trackLoading}
              >
                <option value="" disabled>
                  {trackLoading ? 'Loading tracks...' : 'Select a track'}
                </option>
                {tracks.map(track => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {(errors.track_id ||
              getFieldErrorFromApiError(error, 'track_id')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.track_id ||
                  getFieldErrorFromApiError(error, 'track_id')}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={user.is_active ? '1' : '0'}
              onChange={e =>
                setUser(prev => ({
                  ...prev,
                  is_active: e.target.value === '1',
                }))
              }
              className={`w-full p-2 border rounded-md focus:border-0 appearance-none pr-8 ${
                errors.is_active ||
                getFieldErrorFromApiError(error, 'is_active')
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {(errors.is_active ||
            getFieldErrorFromApiError(error, 'is_active')) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.is_active ||
                getFieldErrorFromApiError(error, 'is_active')}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-5 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => {
              /* Cancel logic */
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-400)] hover:bg-[var(--secondary-500)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span>{isEdit ? 'Update User' : 'Create User'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
