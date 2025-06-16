import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API requests with loading, error, and success states
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Execute an API call with loading and error handling
   * @param {Function} apiCall - The API function to call
   * @param {Object} options - Optional configuration
   * @returns {Promise} - The result of the API call
   */
  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      onSuccess,
      onError,
      resetOnExecute = true,
      transformData = data => data,
    } = options;

    try {
      setLoading(true);
      if (resetOnExecute) {
        setError(null);
        setData(null);
      }

      const response = await apiCall();
      const transformedData = transformData(response.data);

      setData(transformedData);

      if (onSuccess) {
        onSuccess(transformedData);
      }

      return transformedData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred';

      // Handle validation errors
      const errorData = err.response?.data || {};

      setError(errorMessage);
      if (onError) {
        onError(errorMessage, errorData);
      }

      // Return both the message and validation errors if available
      return {
        success: false,
        message: errorMessage,
        errors: errorData.errors || null,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};

export default useApi;
