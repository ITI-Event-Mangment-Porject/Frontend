// Data cleaning helper function
export const cleanUserData = userData => {
  const cleaned = {};

  // Only include non-empty values
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    if (key === 'is_active') {
      // Always include is_active as boolean, even if false
      cleaned[key] = Boolean(value);
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

  return cleaned;
};

// Initial user state
export const getInitialUserState = () => ({
  portal_user_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  profile_image: null,
  cv_path: null,
  bio: '',
  linkedin_url: '',
  github_url: '',
  portfolio_url: '',
  track_id: '',
  intake_year: '',
  graduation_year: '',
  is_active: true,
});
