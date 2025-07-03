import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import useApi from './useApi';

export const useEventManagement = () => {
  // State
  const [allEvents, setAllEvents] = useState([]); // Store all events from API
  const [events, setEvents] = useState([]); // Filtered events for display
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

  // Frontend filtering function
  const filterEvents = (
    eventsToFilter,
    search,
    status,
    start,
    end,
    page = 1,
    perPage = 15
  ) => {
    let filtered = [...eventsToFilter];

    // Filter by search term
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        event =>
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower) ||
          event.type?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (status && status.trim()) {
      filtered = filtered.filter(
        event => event.status?.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by date range
    if (start || end) {
      filtered = filtered.filter(event => {
        if (!event.start_date) return false;

        const eventStartDate = new Date(event.start_date);
        const eventEndDate = event.end_date
          ? new Date(event.end_date)
          : eventStartDate;

        // Normalize dates to compare only date parts (ignore time)
        const normalizeDate = date => {
          const normalized = new Date(date);
          normalized.setHours(0, 0, 0, 0);
          return normalized;
        };

        const eventStart = normalizeDate(eventStartDate);
        const eventEnd = normalizeDate(eventEndDate);

        let withinRange = true;

        if (start) {
          const filterStartDate = normalizeDate(new Date(start));
          // Event should end on or after the filter start date
          withinRange = withinRange && eventEnd >= filterStartDate;
        }

        if (end) {
          const filterEndDate = normalizeDate(new Date(end));
          // Event should start on or before the filter end date
          withinRange = withinRange && eventStart <= filterEndDate;
        }

        return withinRange;
      });
    }

    // Calculate pagination
    const total = filtered.length;
    const lastPage = Math.ceil(total / perPage);
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    // Get paginated results
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedEvents = filtered.slice(startIndex, endIndex);

    return {
      events: paginatedEvents,
      pagination: {
        currentPage: page,
        lastPage: Math.max(lastPage, 1),
        perPage,
        total,
        from: total > 0 ? from : 0,
        to: total > 0 ? to : 0,
      },
    };
  };

  // Data loading function - fetch all events without filters
  const loadEvents = async () => {
    try {
      // Fetch all events without any filters
      const params = {
        per_page: 1000, // Large number to get all events
      };
      const result = await fetchEvents(() => eventAPI.getAll(params));
      console.log('Fetched events:', result);
      if (result.success) {
        let fetchedEvents = [];
        // Handle the nested structure - events are in data.result.data
        if (
          result.data?.result?.data &&
          Array.isArray(result.data.result.data)
        ) {
          fetchedEvents = result.data.result.data;
        } else {
          // Fallback options if structure is different
          fetchedEvents =
            result.data?.events || result.data?.result || result.data || [];
        }

        // Store all events
        setAllEvents(fetchedEvents);

        // Apply filters and pagination
        const filtered = filterEvents(
          fetchedEvents,
          searchTerm,
          selectedStatus,
          startDate,
          endDate,
          pagination.currentPage,
          pagination.perPage
        );

        setEvents(filtered.events);
        setPagination(filtered.pagination);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setAllEvents([]);
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

  // Apply filters whenever search term, status, or dates change
  useEffect(() => {
    if (allEvents.length > 0) {
      const filtered = filterEvents(
        allEvents,
        searchTerm,
        selectedStatus,
        startDate,
        endDate,
        1, // Reset to page 1 when filters change
        pagination.perPage
      );

      setEvents(filtered.events);
      setPagination(filtered.pagination);
    }
  }, [searchTerm, selectedStatus, startDate, endDate, allEvents]);

  // Handle pagination changes
  useEffect(() => {
    if (allEvents.length > 0) {
      const filtered = filterEvents(
        allEvents,
        searchTerm,
        selectedStatus,
        startDate,
        endDate,
        pagination.currentPage,
        pagination.perPage
      );

      setEvents(filtered.events);
      setPagination(prev => ({
        ...prev,
        ...filtered.pagination,
        currentPage: pagination.currentPage,
      }));
    }
  }, [pagination.currentPage]);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

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
