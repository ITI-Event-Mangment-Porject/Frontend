import React, { useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

// Reusable input style for consistency
const inputClass =
  'mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-[var(--primary-500)]  focus:bg-[var(--primary-50)] sm:text-sm transition-all duration-200 hover:border-[var(--primary-500)] hover:shadow-lg transform focus:scale-[1.01]';

// Reusable select style for consistency
const selectClass =
  'mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-[var(--primary-500)]  focus:outline-none focus:bg-[var(--primary-50)] sm:text-sm transition-all duration-200 hover:border-[var(--primary-500)] hover:shadow-md cursor-pointer appearance-none bg-white bg-no-repeat bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236B7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/%3E%3C/svg%3E\')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] pr-10 transform focus:scale-[1.01]';

// Helper component for required field indicator
const RequiredStar = () => (
  <span className="text-red-600 ml-1 text-lg font-bold" title="Required field">
    *
  </span>
);

// Helper function to parse and extract field-specific errors
const getFieldError = (error, fieldName) => {
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
  // Create a ref for the form
  const formRef = useRef(null);

  // Effect to scroll to top when there's an error
  useEffect(() => {
    if (error && formRef.current) {
      // Scroll to top of form with a slight delay to ensure DOM is updated
      setTimeout(() => {
        // Try multiple scroll methods for better compatibility
        // 1. Using scrollIntoView
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // 2. Using window.scrollTo as a fallback
        const formTop = formRef.current.getBoundingClientRect().top;
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: formTop + scrollTop - 100, // Offset by 100px to show some context
          behavior: 'smooth',
        });

        // Add a flash animation to highlight the error message
        const errorDiv = formRef.current.querySelector('.error-message');
        if (errorDiv) {
          errorDiv.classList.add('animate-shake');
          // Remove the animation class after it completes
          setTimeout(() => {
            errorDiv.classList.remove('animate-shake');
          }, 1000);
        }

        // Try to focus the first input that has an error
        if (error.includes('email:')) {
          const emailInput = formRef.current.querySelector(
            'input[type="email"]'
          );
          if (emailInput) emailInput.focus();
        } else if (error.includes('first_name:')) {
          const firstNameInput = formRef.current.querySelector(
            'input[name="first_name"]'
          );
          if (firstNameInput) firstNameInput.focus();
        } else if (error.includes('last_name:')) {
          const lastNameInput = formRef.current.querySelector(
            'input[name="last_name"]'
          );
          if (lastNameInput) lastNameInput.focus();
        } else if (error.includes('portal_user_id:')) {
          const portalInput = formRef.current.querySelector(
            'input[name="portal_user_id"]'
          );
          if (portalInput) portalInput.focus();
        }
      }, 100);
    }
  }, [error]);

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
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Profile Image
        </label>
        <div className="mt-4 flex items-center space-x-4">
          {profileImagePreview ? (
            <div className="relative">
              <img
                src={profileImagePreview}
                alt="Profile preview"
                className="h-20 w-20 rounded-full object-cover border-2 border-[var(--gray-300)]"
              />
              <button
                type="button"
                onClick={removeProfileImage}
                className="absolute-top-2-right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : isEdit && user.profile_image ? (
            <div className="relative">
              <img
                src={user.profile_image}
                alt="Current profile"
                className="h-20 w-20 rounded-full object-cover border-2 border-[var(--gray-300)]"
              />
              <button
                type="button"
                onClick={removeProfileImage}
                className="absolute-top-2-right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="h-10 w-10 text-gray-400" />
            </div>
          )}
          <div className="flex-1 ">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="block pl-2 w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[var(--primary-500)] file:text-white hover:file:bg-[var(--primary-600)]hover:file:shadow-md focus:outline-none file:transition-all file:duration-200 cursor-pointer py-2 border border-gray-300 rounded-md hover:border-[var(--primary-500)]"
            />
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </div>{' '}
      {!isEdit && (
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-1">
            Portal User ID
            <RequiredStar />
          </label>
          <input
            type="text"
            name="portal_user_id"
            value={user.portal_user_id}
            onChange={e =>
              setUser(prev => ({ ...prev, portal_user_id: e.target.value }))
            }
            className={`${inputClass} ${
              getFieldError(error, 'portal_user_id')
                ? 'border-red-500 bg-red-50'
                : ''
            }`}
          />
          {getFieldError(error, 'portal_user_id') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1 inline-block"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {getFieldError(error, 'portal_user_id')}
            </p>
          )}
        </div>
      )}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          First Name
          <RequiredStar />
        </label>
        <input
          type="text"
          name="first_name"
          value={user.first_name}
          onChange={e =>
            setUser(prev => ({ ...prev, first_name: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'first_name') ? 'border-red-500 bg-red-50' : ''
          }`}
        />
        {getFieldError(error, 'first_name') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'first_name')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Last Name
          <RequiredStar />
        </label>
        <input
          type="text"
          name="last_name"
          value={user.last_name}
          onChange={e =>
            setUser(prev => ({ ...prev, last_name: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'last_name') ? 'border-red-500 bg-red-50' : ''
          }`}
        />
        {getFieldError(error, 'last_name') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'last_name')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Email
          <RequiredStar />
        </label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))}
          className={`${inputClass} ${
            getFieldError(error, 'email') ? 'border-red-500 bg-red-50' : ''
          }`}
        />
        {getFieldError(error, 'email') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'email')}
          </p>
        )}
      </div>
      <div>
        {' '}
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={user.phone}
          onChange={e => setUser(prev => ({ ...prev, phone: e.target.value }))}
          className={`${inputClass} ${
            getFieldError(error, 'phone') ? 'border-red-500 bg-red-50' : ''
          }`}
        />
        {getFieldError(error, 'phone') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'phone')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>{' '}
        <textarea
          value={user.bio}
          onChange={e => setUser(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className={`mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none sm:text-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md ${
            getFieldError(error, 'bio') ? 'border-red-500 bg-red-50' : ''
          }`}
          placeholder="Brief description about the user"
        />
        {getFieldError(error, 'bio') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'bio')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          LinkedIn URL
        </label>
        <input
          type="url"
          value={user.linkedin_url}
          onChange={e =>
            setUser(prev => ({ ...prev, linkedin_url: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'linkedin_url')
              ? 'border-red-500 bg-red-50'
              : ''
          }`}
          placeholder="https://linkedin.com/in/username"
        />
        {getFieldError(error, 'linkedin_url') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'linkedin_url')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          GitHub URL
        </label>
        <input
          type="url"
          value={user.github_url}
          onChange={e =>
            setUser(prev => ({ ...prev, github_url: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'github_url') ? 'border-red-500 bg-red-50' : ''
          }`}
          placeholder="https://github.com/username"
        />
        {getFieldError(error, 'github_url') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'github_url')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Portfolio URL
        </label>
        <input
          type="url"
          value={user.portfolio_url}
          onChange={e =>
            setUser(prev => ({ ...prev, portfolio_url: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'portfolio_url')
              ? 'border-red-500 bg-red-50'
              : ''
          }`}
          placeholder="https://your-portfolio.com"
        />
        {getFieldError(error, 'portfolio_url') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'portfolio_url')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Intake Year
        </label>
        <input
          type="number"
          value={user.intake_year}
          onChange={e =>
            setUser(prev => ({ ...prev, intake_year: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'intake_year')
              ? 'border-red-500 bg-red-50'
              : ''
          }`}
          min="2020"
          max="2030"
        />
        {getFieldError(error, 'intake_year') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'intake_year')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Graduation Year
        </label>
        <input
          type="number"
          value={user.graduation_year}
          onChange={e =>
            setUser(prev => ({ ...prev, graduation_year: e.target.value }))
          }
          className={`${inputClass} ${
            getFieldError(error, 'graduation_year')
              ? 'border-red-500 bg-red-50'
              : ''
          }`}
          min="2020"
          max="2035"
        />
        {getFieldError(error, 'graduation_year') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'graduation_year')}
          </p>
        )}
      </div>{' '}
      <div>
        {' '}
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Status
          <RequiredStar />
        </label>
        <select
          value={user.is_active ? '1' : '0'}
          onChange={e =>
            setUser(prev => ({ ...prev, is_active: e.target.value === '1' }))
          }
          className={`${selectClass} ${
            getFieldError(error, 'is_active') ? 'border-red-500 bg-red-50' : ''
          }`}
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        {getFieldError(error, 'is_active') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'is_active')}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Track
          <RequiredStar />
        </label>
        <select
          value={user.track_id}
          onChange={e =>
            setUser(prev => ({ ...prev, track_id: e.target.value }))
          }
          className={`${selectClass} ${
            getFieldError(error, 'track_id') ? 'border-red-500 bg-red-50' : ''
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
        {getFieldError(error, 'track_id') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {getFieldError(error, 'track_id')}
          </p>
        )}
      </div>{' '}
      <div className="mt-5 sm:mt-6">
        <button
          type="submit"
          className="inline-flex w-full justify-center items-center rounded-md border border-transparent bg-[var(--secondary-400)] px-6 py-3 text-base font-medium text-white shadow-md hover:shadow-xl hover:bg-[var(--secondary-500)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 "
          disabled={submitLoading}
        >
          {submitLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          )}
          {submitLoading
            ? isEdit
              ? 'Updating...'
              : 'Adding...'
            : isEdit
              ? 'Update User'
              : 'Add User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
