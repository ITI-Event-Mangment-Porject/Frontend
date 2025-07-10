/**
 * Clean event data for API submission
 * @param {Object} eventData - The event data to clean
 * @returns {Object} - Cleaned event data
 */
export const cleanEventData = eventData => {
  // Create a copy to avoid modifying the original
  const cleanedData = { ...eventData };

  // Remove any empty string values or undefined values
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === '' || cleanedData[key] === undefined) {
      delete cleanedData[key];
    }
  });

  // Handle dates
  if (cleanedData.start_date) {
    cleanedData.start_date = formatDateForAPI(cleanedData.start_date);
  }

  if (cleanedData.end_date) {
    cleanedData.end_date = formatDateForAPI(cleanedData.end_date);
  }

  // Convert capacity to number if it's a string
  if (cleanedData.capacity && typeof cleanedData.capacity === 'string') {
    cleanedData.capacity = parseInt(cleanedData.capacity, 10);
  }

  // Ensure created_by is set
  if (!cleanedData.created_by) {
    cleanedData.created_by = 1;
  }

  // Ensure status is set to draft for new events
  if (!cleanedData.id && !cleanedData.status) {
    cleanedData.status = 'draft';
  }

  // Handle visibility_config formatting
  if (
    cleanedData.visibility_type === 'role_based' &&
    !cleanedData.visibility_config
  ) {
    cleanedData.visibility_config = JSON.stringify({
      roles: ['student', 'alumni'],
    });
  } else if (
    cleanedData.visibility_type === 'track_based' &&
    !cleanedData.visibility_config
  ) {
    cleanedData.visibility_config = JSON.stringify({
      tracks: [1, 2, 3],
    });
  }

  // Convert visibility_config to string if it's an object
  if (
    cleanedData.visibility_config &&
    typeof cleanedData.visibility_config === 'object'
  ) {
    cleanedData.visibility_config = JSON.stringify(
      cleanedData.visibility_config
    );
  }

  return cleanedData;
};

/**
 * Format date for API submission (YYYY-MM-DD)
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
const formatDateForAPI = dateString => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get initial event state for forms
 * @returns {Object} - Initial event state
 */
export const getInitialEventState = () => {
  return {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    capacity: '',
    status: 'draft',
    type: 'Job Fair',
    image: null,
    visibility_type: 'role_based',
    visibility_config: JSON.stringify({
      roles: ['student', 'alumni'],
    }),
    created_by: 1,
  };
};
