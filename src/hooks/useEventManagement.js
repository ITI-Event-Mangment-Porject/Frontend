import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import useApi from './useApi';

export const useEventManagement = () => {
  // State
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  // API hooks
  const { loading, error, execute: fetchEvents } = useApi();
  const { loading: submitLoading, execute: submitEvent } = useApi();

  // Data loading function
  const loadEvents = async () => {
    try {
      const params = {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        search: searchTerm || undefined,
        status: selectedStatus || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };
      const result = await fetchEvents(() => eventAPI.getAll(params));
      console.log('Fetched events:', result);
      if (result.success) {
        // Handle the nested structure - events are in data.result.data
        if (
          result.data?.result?.data &&
          Array.isArray(result.data.result.data)
        ) {
          setEvents(result.data.result.data);
        } else {
          // Fallback options if structure is different
          setEvents(
            result.data?.events || result.data?.result || result.data || []
          );
        }

        // Set pagination data - also nested in data.result
        if (result.data?.result) {
          setPagination({
            currentPage: result.data.result.current_page,
            lastPage: result.data.result.last_page,
            perPage: result.data.result.per_page,
            total: result.data.result.total,
            from: result.data.result.from,
            to: result.data.result.to,
          });
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
      // Set default pagination on error
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        lastPage: 1,
        total: 0,
        from: 0,
        to: 0,
      }));
    }
  };

  // Effects
  useEffect(() => {
    loadEvents();
  }, [selectedStatus, pagination.currentPage, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination handler
  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  return {
    // State
    events,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    pagination,

    // Loading states
    loading,
    error,
    submitLoading,

    // Functions
    loadEvents,
    handlePageChange,

    // API functions
    submitEvent,
  };
};
