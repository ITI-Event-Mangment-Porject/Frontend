import React from 'react';
import { FaUser } from 'react-icons/fa';

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
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Image
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {profileImagePreview ? (
            <div className="relative">
              <img
                src={profileImagePreview}
                alt="Profile preview"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removeProfileImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : isEdit && user.profile_image ? (
            <div className="relative">
              <img
                src={user.profile_image}
                alt="Current profile"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removeProfileImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </div>{' '}
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portal User ID
          </label>
          <input
            type="text"
            value={user.portal_user_id}
            onChange={e =>
              setUser(prev => ({ ...prev, portal_user_id: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          value={user.first_name}
          onChange={e =>
            setUser(prev => ({ ...prev, first_name: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          value={user.last_name}
          onChange={e =>
            setUser(prev => ({ ...prev, last_name: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={user.email}
          onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={user.phone}
          onChange={e => setUser(prev => ({ ...prev, phone: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={user.bio}
          onChange={e => setUser(prev => ({ ...prev, bio: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          min="2020"
          max="2035"
        />
      </div>{' '}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={user.is_active ? '1' : '0'}
          onChange={e =>
            setUser(prev => ({ ...prev, is_active: e.target.value === '1' }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
          disabled={submitLoading}
        >
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
