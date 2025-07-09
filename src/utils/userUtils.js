// Data cleaning helper function
export const cleanUserData = userData => {
  const cleaned = {};

  // Only include non-empty values
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    if (key === 'is_active') {
      // Always include is_active as boolean, default to true if not specified
      cleaned[key] = value !== undefined ? Boolean(value) : true;
    } else if (key === 'profile_image') {
      // Handle profile image specifically - include File objects and empty strings for removal
      if (value instanceof File) {
        cleaned[key] = value;
      } else if (value === '') {
        cleaned[key] = ''; // Empty string indicates removal
      }
      // Don't include null or undefined profile_image
    } else if (value !== null && value !== '' && value !== undefined) {
      if (
        key === 'track_id' ||
        key === 'intake_year' ||
        key === 'graduation_year'
      ) {
        // Ensure numeric fields are numbers or omit them
        const num = parseInt(value);
        if (!isNaN(num) && num > 0) {
          cleaned[key] = num;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });

  // Ensure is_active is always included, default to true
  // eslint-disable-next-line no-prototype-builtins
  if (!cleaned.hasOwnProperty('is_active')) {
    cleaned.is_active = true;
  }

  return cleaned;
};

// Initial user state
export const getInitialUserState = () => ({
  portal_user_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  profile_image: '',
  cv_path: '',
  bio: '',
  linkedin_url: '',
  github_url: '',
  portfolio_url: '',
  track_id: '',
  intake_year: '',
  graduation_year: '',
  is_active: true, // Default to active
});
