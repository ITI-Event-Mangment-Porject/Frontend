import React from 'react';
import { FaUser } from 'react-icons/fa';

// Reusable input style for consistency
const inputClass =
  'mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-[var(--primary-500)]  focus:bg-[var(--primary-50)] sm:text-sm transition-all duration-200 hover:border-[var(--primary-500)] hover:shadow-lg transform focus:scale-[1.01]';

// Reusable select style for consistency
const selectClass =
  'mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-[var(--primary-500)]  focus:outline-none focus:bg-[var(--primary-50)] sm:text-sm transition-all duration-200 hover:border-[var(--primary-500)] hover:shadow-md cursor-pointer appearance-none bg-white bg-no-repeat bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236B7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/%3E%3C/svg%3E\')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] pr-10 transform focus:scale-[1.01]';

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
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-red-600 bg-red-50 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}
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
              className="block pl-2 w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[var(--primary-500)] hover:file:bg-blue-100 hover:file:shadow-md focus:outline-none file:transition-all file:duration-200 cursor-pointer py-2 border border-gray-300 rounded-md hover:border-[var(--primary-500)]"
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
          </label>
          <input
            type="text"
            value={user.portal_user_id}
            onChange={e =>
              setUser(prev => ({ ...prev, portal_user_id: e.target.value }))
            }
            className={inputClass}
            required
          />
        </div>
      )}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          First Name
        </label>
        <input
          type="text"
          value={user.first_name}
          onChange={e =>
            setUser(prev => ({ ...prev, first_name: e.target.value }))
          }
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Last Name
        </label>
        <input
          type="text"
          value={user.last_name}
          onChange={e =>
            setUser(prev => ({ ...prev, last_name: e.target.value }))
          }
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={user.email}
          onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={user.phone}
          onChange={e => setUser(prev => ({ ...prev, phone: e.target.value }))}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={user.bio}
          onChange={e => setUser(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className="mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none sm:text-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md"
          placeholder="Brief description about the user"
        />
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
          className={inputClass}
          placeholder="https://linkedin.com/in/username"
        />
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
          className={inputClass}
          placeholder="https://github.com/username"
        />
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
          className={inputClass}
          placeholder="https://your-portfolio.com"
        />
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
          className={inputClass}
          min="2020"
          max="2030"
        />
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
          className={inputClass}
          min="2020"
          max="2035"
        />
      </div>{' '}
      <div>
        {' '}
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Status
        </label>
        <select
          value={user.is_active ? '1' : '0'}
          onChange={e =>
            setUser(prev => ({ ...prev, is_active: e.target.value === '1' }))
          }
          className={selectClass}
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Track</label>
        <select
          value={user.track_id}
          onChange={e =>
            setUser(prev => ({ ...prev, track_id: e.target.value }))
          }
          className={selectClass}
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
      </div>{' '}
      <div className="mt-5 sm:mt-6">
        <button
          type="submit"
          className="inline-flex w-full justify-center items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md hover:shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
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
