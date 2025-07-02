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

  // Handle dates and times
  if (cleanedData.start_date && cleanedData.start_time) {
    // Combine date and time for API submission if needed
    // Some APIs expect a full ISO date-time string
    const startDate = new Date(cleanedData.start_date);
    const [hours, minutes] = cleanedData.start_time.split(':');
    startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    cleanedData.start_datetime = startDate.toISOString();
  }

  if (cleanedData.end_date && cleanedData.end_time) {
    // Combine date and time for API submission if needed
    const endDate = new Date(cleanedData.end_date);
    const [hours, minutes] = cleanedData.end_time.split(':');
    endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    cleanedData.end_datetime = endDate.toISOString();
  }

  // Convert capacity to number if it's a string
  if (cleanedData.capacity && typeof cleanedData.capacity === 'string') {
    cleanedData.capacity = parseInt(cleanedData.capacity, 10);
  }

  return cleanedData;
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
    start_time: '',
    end_time: '',
    location: '',
    capacity: '',
    status: 'draft',
    type: 'general',
    image: null,
  };
};
