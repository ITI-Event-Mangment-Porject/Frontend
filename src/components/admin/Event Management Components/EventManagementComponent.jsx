import React, { useState } from 'react';
import {
  FaSearch,
  FaCalendarPlus,
  FaCalendar,
  FaCalendarAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Table from '../../common/Table.jsx';
import Modal from '../../common/Modal.jsx';
import Pagination from '../../common/Pagination.jsx';
import TableSkeleton from '../../common/TableSkeleton.jsx';
import EventForm from './EventForm.jsx';
import { eventAPI } from '../../../services/api.js';
import { useEventManagement } from '../../../hooks/useEventManagement.js';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal.jsx';
import { getEventTableColumns } from './eventTableConfig.jsx';
import {
  cleanEventData,
  getInitialEventState,
} from '../../../utils/eventUtils.js';

const EventManagementComponent = () => {
  // Custom hook for event management logic
  const {
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
    loading,
    error,
    submitLoading,
    loadEvents,
    handlePageChange,
    submitEvent,
  } = useEventManagement();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Form states
  const [newEvent, setNewEvent] = useState(getInitialEventState());
  const [editEvent, setEditEvent] = useState(getInitialEventState());
  const [actionError, setActionError] = useState('');
  const [addError, setAddError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Event actions
  const handleAddEvent = async (e, eventWithCreatedBy) => {
    e.preventDefault();
    console.log('handleAddEvent called with data:', eventWithCreatedBy);
    setAddError('');
    try {
      let eventData;

      // Use the event data from the form with created_by field
      const eventToSubmit = eventWithCreatedBy || {
        ...newEvent,
        created_by: 1, // Ensure created_by is set
      };

      console.log('Processing event submission:', eventToSubmit);

      // If there's an image file, use FormData
      if (eventToSubmit.image instanceof File) {
        console.log('Creating FormData for image upload');
        eventData = new FormData();
        const cleanedData = cleanEventData(eventToSubmit);
        console.log('Cleaned data:', cleanedData);

        // Add image with correct field name
        eventData.append('event_image', eventToSubmit.image);
        console.log('Added event_image to FormData');

        // Add all other fields
        Object.keys(cleanedData).forEach(key => {
          if (key !== 'image') {
            // For visibility_config, ensure it's properly stringified
            if (
              key === 'visibility_config' &&
              typeof cleanedData[key] === 'object'
            ) {
              eventData.append(key, JSON.stringify(cleanedData[key]));
              console.log(
                `Added ${key} as JSON string:`,
                JSON.stringify(cleanedData[key])
              );
            } else {
              eventData.append(key, cleanedData[key]);
              console.log(`Added ${key}:`, cleanedData[key]);
            }
          }
        });

        // Explicitly add created_by to ensure it's included
        eventData.append('created_by', 1);
        console.log('Added created_by=1 to FormData');

        console.log('Sending FormData with image');
      } else {
        // Otherwise use regular JSON
        eventData = cleanEventData(eventToSubmit);
        // Ensure created_by is set
        eventData.created_by = 1;

        // Double check end_date is present
        if (!eventData.end_date) {
          console.error('End date is missing in form submission');
          setAddError(JSON.stringify({ end_date: 'End date is required' }));
          return false;
        }

        console.log('Sending JSON data:', eventData);
      }

      console.log('About to call submitEvent with API call');
      console.log('Making API call to create event with data:', eventData);
      try {
        const result = await submitEvent(() => {
          console.log('Executing eventAPI.create with:', eventData);
          return eventAPI.create(eventData);
        });
        console.log('API response:', result);

        // Check if we have a response with data
        if (result && (result.success || (result.data && !result.message))) {
          console.log('Event created successfully:', result);

          // Show success toast
          toast.success(`Event "${eventToSubmit.title}" created successfully!`);

          // Reset state and close modal
          setIsAddModalOpen(false);
          setNewEvent(getInitialEventState());
          setImagePreview(null);

          // Explicitly reload events after a small delay to ensure API has completed
          setTimeout(() => {
            console.log('Reloading events after successful creation');
            loadEvents();
          }, 500);

          return true;
        } else {
          console.error('Failed to create event:', result);
          // Handle validation errors in API response
          if (result.errors && typeof result.errors === 'object') {
            // Check specifically for end_date error in the format { "end_date": "End date is required" }
            if (result.errors.end_date) {
              const jsonError = JSON.stringify({
                end_date: result.errors.end_date,
              });
              console.log('Formatted end_date error as JSON:', jsonError);
              setAddError(jsonError);
            } else {
              const errorMessages = Object.entries(result.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
                )
                .join('\n');
              setAddError(
                errorMessages || result.message || 'Validation failed'
              );
            }
          } else {
            setAddError(result.message || 'Failed to add event');
          }
          return false;
        }
      } catch (apiError) {
        console.error('Exception during API call:', apiError);
        setAddError(
          'An unexpected error occurred. Please check the console for details.'
        );
        return false;
      }
    } catch (error) {
      console.error('Add event error:', error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        console.error('Error response:', responseData);

        // Handle validation errors specifically
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Format validation errors
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setAddError(
            errorMessages || responseData.message || 'Validation failed'
          );
        } else {
          setAddError(responseData.message || 'Server validation error');
        }
      } else {
        setAddError(
          error.message || 'An error occurred while adding the event'
        );
      }
    }
  };

  const handleDeleteEvent = async event => {
    // Show the delete confirmation modal
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  // Function to actually delete the event after confirmation
  const confirmDeleteEvent = async () => {
    try {
      await eventAPI.delete(eventToDelete.id);
      toast.success(`Event "${eventToDelete.title}" deleted successfully!`);
      loadEvents();
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);

      // Handle 409 conflict error (event related to session)
      if (error.status === 409 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.message) {
        // Handle other API errors with message
        toast.error(error.response.data.message);
      } else if (error.message) {
        // Handle general errors
        toast.error(`Error deleting event: ${error.message}`);
      } else {
        // Fallback error message
        toast.error('Failed to delete event. Please try again.');
      }

      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  // Function to cancel event deletion
  const cancelDeleteEvent = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleEditEvent = async e => {
    e.preventDefault();
    setAddError('');
    try {
      let eventData;

      // If there's an image file, use FormData
      if (editEvent.image instanceof File) {
        eventData = new FormData();
        const cleanedData = cleanEventData(editEvent);
        Object.keys(cleanedData).forEach(key => {
          if (key === 'image' && cleanedData[key] instanceof File) {
            eventData.append('event_image', cleanedData[key]);
          } else if (cleanedData[key] !== null && cleanedData[key] !== '') {
            eventData.append(key, cleanedData[key]);
          }
        });
      } else {
        // Otherwise use regular JSON
        eventData = cleanEventData(editEvent);
      }

      const result = await submitEvent(() =>
        eventAPI.update(selectedEvent.id, eventData)
      );
      if (result.success) {
        // Show success toast
        toast.success(`Event "${editEvent.title}" updated successfully!`);

        setIsEditModalOpen(false);
        setSelectedEvent(null);
        setEditEvent(getInitialEventState());
        setEditImagePreview(null);
        loadEvents();
      } else {
        // Handle validation errors in API response
        if (result.errors && typeof result.errors === 'object') {
          const errorMessages = Object.entries(result.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n');
          setAddError(errorMessages || result.message || 'Validation failed');
        } else {
          setAddError(result.message || 'Failed to update event');
        }
      }
    } catch (error) {
      console.error('Edit event error:', error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        console.error('Error response:', responseData);

        // Handle validation errors specifically
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Format validation errors
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setAddError(
            errorMessages || responseData.message || 'Validation failed'
          );
        } else {
          setAddError(responseData.message || 'Server validation error');
        }
      } else {
        setAddError(
          error.message || 'An error occurred while updating the event'
        );
      }
    }
  };

  const handleEditClick = event => {
    setSelectedEvent(event);
    setEditEvent({
      title: event.title || '',
      description: event.description || '',
      start_date: event.start_date || '',
      end_date: event.end_date || '',
      location: event.location || '',
      capacity: event.capacity || '',
      status: event.status || 'draft',
      type: event.type || 'general',
    });
    // Set the existing image as preview for editing
    setEditImagePreview(event.banner_image || event.image_url || null);
    setIsEditModalOpen(true);
  };

  const handleEventAction = async action => {
    try {
      if (action === 'toggleStatus') {
        const newStatus =
          selectedEvent.status === 'ongoing' ? 'draft' : 'ongoing';
        await eventAPI.update(selectedEvent.id, { status: newStatus });
        toast.success(
          `Event "${selectedEvent.title}" status changed to ${newStatus} successfully!`
        );
      } else if (action === 'delete') {
        await eventAPI.delete(selectedEvent.id);
        toast.success(`Event "${selectedEvent.title}" deleted successfully!`);
      }
      setIsActionModalOpen(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (error) {
      console.error('Event action error:', error);
      toast.error(
        `Failed to perform action: ${error.message || 'An error occurred'}`
      );
      setActionError(error.message || 'An error occurred');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedStatus('');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    // Reset pagination to first page when clearing filters
    handlePageChange(1);
  };

  const columns = getEventTableColumns(handleEditClick, handleDeleteEvent);

  return (
    <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-[var(--gray-200)] rounded-lg shadow-md transition-all duration-300 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 w-full transform transition-all duration-300 ease-out">
        <h1 className="text-xl sm:text-2xl font-bold leading-6 sm:leading-8 text-[var(--gray-900)] w-full sm:w-auto text-left">
          Event Management
        </h1>
        <div className="w-full sm:w-auto flex justify-stretch sm:justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="button w-full sm:w-auto hover:shadow-md text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            <FaCalendarPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-transform duration-200 ease-out" />
            <span className="hidden sm:inline">Add New Event</span>
            <span className="sm:hidden w-100 text-start">Add New Event</span>
          </button>
        </div>
      </div>

      {/* Filter Results Indicator */}
      {(searchTerm || selectedStatus || startDate || endDate) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-blue-800 font-medium">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                From: {new Date(startDate).toLocaleDateString()}
                <button
                  onClick={() => setStartDate('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                To: {new Date(endDate).toLocaleDateString()}
                <button
                  onClick={() => setEndDate('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            <span className="text-blue-700">
              ({pagination.total} result{pagination.total !== 1 ? 's' : ''}{' '}
              found)
            </span>
            <button
              onClick={clearFilters}
              className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full animate-fade-in"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Search Input */}
        <div className="w-full lg:flex-1 min-w-0 lg:min-w-[15rem] xl:min-w-[18rem] transform transition-all duration-300 ease-out hover:scale-[1.01]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 w-3 h-3 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-[var(--gray-300)] rounded-md focus:outline-none focus:border-0 hover:shadow-md transition-all duration-200 ease-out focus:border-[var(--primary-500)] hover:border-[var(--gray-500)] focus:shadow-md"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          className="w-full sm:w-auto lg:w-28 xl:w-32 border border-[var(--gray-300)] rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none hover:shadow-md transition-all duration-200 ease-out hover:border-[var(--gray-500)] focus:border-[var(--primary-500)] focus:border-0 focus:shadow-md"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="draft">Draft</option>
        </select>

        {/* Date Filters */}
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <FaCalendar className="text-gray-400 hidden sm:block" />
          <input
            type="date"
            placeholder="Start date"
            className="flex-1 px-3 py-2 text-sm sm:text-base border border-[var(--gray-300)] rounded-md focus:outline-none focus:border-0 hover:shadow-md transition-all duration-200 ease-out focus:border-[var(--primary-500)] hover:border-[var(--gray-500)] focus:shadow-md"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto flex items-center space-x-2">
          <span className="text-gray-400 hidden sm:block">-</span>
          <input
            type="date"
            placeholder="End date"
            className="flex-1 px-3 py-2 text-sm sm:text-base border border-[var(--gray-300)] rounded-md focus:outline-none focus:border-0 hover:shadow-md transition-all duration-200 ease-out focus:border-[var(--primary-500)] hover:border-[var(--gray-500)] focus:shadow-md"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 border border-[var(--gray-300)] rounded-md focus:border-0 hover:shadow-md transform hover:scale-103 active:scale-95 whitespace-nowrap"
        >
          <span className="hidden sm:inline">Clear Filters</span>
          <span className="sm:hidden">Clear</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="w-full animate-fade-in">
          <TableSkeleton
            rows={5}
            columns={5}
            showProfileColumn={true}
            showActionsColumn={true}
          />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 animate-fade-in px-4">
          <div className="text-red-500 text-base sm:text-lg mb-2 animate-bounce text-center">
            ⚠️ No Events Found
          </div>
          <p
            className="text-gray-600 mb-4 text-center text-sm sm:text-base animate-fade-in max-w-md"
            style={{ animationDelay: '0.2s' }}
          >
            There was an error loading the events or no events match your
            criteria.
          </p>
          <button
            onClick={loadEvents}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 animate-fade-in text-sm sm:text-base"
            style={{ animationDelay: '0.4s' }}
          >
            Retry
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 animate-fade-in px-4">
          <div className="text-gray-500 text-base sm:text-lg mb-2 animate-bounce text-center">
            📅 No Events Found
          </div>
          <p
            className="text-gray-600 mb-4 text-center text-sm sm:text-base animate-fade-in max-w-md"
            style={{ animationDelay: '0.2s' }}
          >
            No events match your current search and filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 animate-fade-in text-sm sm:text-base"
            style={{ animationDelay: '0.4s' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className="w-full animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Results Summary */}
          <div className="mb-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {pagination.from}-{pagination.to} of {pagination.total}{' '}
              events
            </span>
            {(searchTerm || selectedStatus || startDate || endDate) && (
              <span className="text-blue-600 font-medium">
                Filtered results
              </span>
            )}
          </div>
          {/* Mobile Card View for small screens */}
          <div className="block md:hidden space-y-4 mb-4">
            {Array.isArray(events) &&
              events.map(event => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {' '}
                      {event.banner_image || event.image_url ? (
                        <img
                          src={event.banner_image || event.image_url}
                          alt={event.title}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <FaCalendarAlt className="w-1/2 h-1/2 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {new Date(event.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        event.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {event.status || 'Draft'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <div className="truncate">
                      <span className="font-medium">Location:</span>{' '}
                      {event.location ? event.location : 'N/A'}
                    </div>
                    <div className="truncate text-right">
                      <span className="font-medium">Capacity:</span>{' '}
                      {event.capacity || 'Unlimited'}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Start Date:</span>{' '}
                      {event.start_date
                        ? new Date(event.start_date).toLocaleDateString()
                        : 'N/A'}
                    </div>
                    <div className="truncate text-right">
                      <span className="font-medium">End Date:</span>{' '}
                      {event.end_date
                        ? new Date(event.end_date).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(event)}
                      className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs transition-colors min-h-[2rem]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsActionModalOpen(true);
                      }}
                      className="flex-1 py-2 bg-[var(--secondary-400)] text-white rounded text-xs hover:bg-[var(--secondary-500)] transition-colors min-h-[2rem]"
                    >
                      Actions
                    </button>
                  </div>
                </div>
              ))}
          </div>{' '}
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto transform transition-all duration-300 ease-out hover:shadow-lg rounded-lg">
            <Table
              columns={columns}
              data={Array.isArray(events) ? events : []}
            />
          </div>
          <div
            className="mt-4 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedEvent(null);
          setActionError('');
        }}
        title="Event Actions"
        size="sm"
        showFooter={false}
      >
        <div className="space-y-4 animate-fade-in">
          {actionError && (
            <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm animate-shake">
              {actionError}
            </div>
          )}
          <button
            onClick={() => handleEventAction('toggleStatus')}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={submitLoading}
          >
            <span className="transition-colors duration-200">
              {selectedEvent?.status === 'active'
                ? 'Set as Draft'
                : 'Set as Active'}
            </span>
            {submitLoading && (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
          <button
            onClick={() => handleEventAction('delete')}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-red-100 text-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={submitLoading}
          >
            <span className="transition-colors duration-200">Delete Event</span>
            {submitLoading && (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        </div>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewEvent(getInitialEventState());
          setImagePreview(null);
          setAddError('');
        }}
        title="Add New Event"
        size="lg"
        showFooter={false}
      >
        <EventForm
          event={newEvent}
          setEvent={setNewEvent}
          onSubmit={handleAddEvent}
          submitLoading={submitLoading}
          error={addError}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          isEdit={false}
        />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
          setEditEvent(getInitialEventState());
          setEditImagePreview(null);
          setAddError('');
        }}
        title="Edit Event"
        size="lg"
        showFooter={false}
      >
        <EventForm
          event={editEvent}
          setEvent={setEditEvent}
          onSubmit={handleEditEvent}
          submitLoading={submitLoading}
          error={addError}
          imagePreview={editImagePreview}
          setImagePreview={setEditImagePreview}
          isEdit={true}
        />
      </Modal>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && eventToDelete && (
        <DeleteConfirmationModal
          object={eventToDelete}
          onConfirm={confirmDeleteEvent}
          onCancel={cancelDeleteEvent}
        />
      )}
    </div>
  );
};

export default EventManagementComponent;
