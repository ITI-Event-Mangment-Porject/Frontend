import React, { useState } from 'react';
import {
  FaImage,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaUpload,
} from 'react-icons/fa';

const EventForm = ({
  event,
  setEvent,
  onSubmit,
  submitLoading,
  error,
  imagePreview,
  setImagePreview,
  isEdit,
}) => {
  const [errors, setErrors] = useState({});

  // Validation function for all fields
  const validateForm = () => {
    const newErrors = {};

    if (!event.title || event.title.trim() === '') {
      newErrors.title = 'Event title is required';
    }

    if (!event.description || event.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    if (!event.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!event.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (
      event.start_date &&
      new Date(event.end_date) < new Date(event.start_date)
    ) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (!event.location || event.location.trim() === '') {
      newErrors.location = 'Location is required';
    }

    if (event.capacity && (isNaN(event.capacity) || event.capacity < 0)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setEvent({ ...event, image: file });

      // Create URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDateForInput = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = timeString => {
    if (!timeString) return '';
    const time = new Date(timeString);
    if (isNaN(time.getTime())) return '';
    return time.toTimeString().slice(0, 5);
  };

  // Parse API error message if it's in a specific format (field: message)
  const getFieldErrorFromApiError = fieldName => {
    if (!error) return null;

    const lines = error.split('\n');
    for (const line of lines) {
      if (line.startsWith(fieldName + ':')) {
        return line.substring(fieldName.length + 1).trim();
      }
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-sm text-gray-500 mb-6">
        Fill out the details below to create a new event. All fields with * are
        required.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={event.title || ''}
              onChange={e => setEvent({ ...event, title: e.target.value })}
              className={`w-full p-2 border rounded-md focus:border-0 focus:border-blue-500 ${
                errors.title || getFieldErrorFromApiError('title')
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="e.g., Annual Tech Summit 2024"
            />
            {(errors.title || getFieldErrorFromApiError('title')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title || getFieldErrorFromApiError('title')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="date"
                    value={formatDateForInput(event.start_date)}
                    onChange={e =>
                      setEvent({ ...event, start_date: e.target.value })
                    }
                    className={`w-full p-2 border rounded-md focus:border-0 focus:border-blue-500 ${
                      errors.start_date ||
                      getFieldErrorFromApiError('start_date')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {(errors.start_date ||
                    getFieldErrorFromApiError('start_date')) && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.start_date ||
                        getFieldErrorFromApiError('start_date')}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={formatTimeForInput(event.start_time)}
                      onChange={e =>
                        setEvent({ ...event, start_time: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={formatTimeForInput(event.end_time)}
                      onChange={e =>
                        setEvent({ ...event, end_time: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center h-5">
                    <input
                      id="public-visibility"
                      type="checkbox"
                      checked={event.visibility_type === 'all'}
                      onChange={e =>
                        setEvent({
                          ...event,
                          visibility_type: e.target.checked
                            ? 'all'
                            : 'role_based',
                        })
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:border-0"
                    />
                  </div>
                  <label
                    htmlFor="public-visibility"
                    className="text-sm text-gray-700"
                  >
                    Public Visibility
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={event.description || ''}
                onChange={e =>
                  setEvent({ ...event, description: e.target.value })
                }
                rows="4"
                className={`w-full p-2 border rounded-md focus:border-0 ${
                  errors.description || getFieldErrorFromApiError('description')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Provide a detailed description of the event."
              />
              {(errors.description ||
                getFieldErrorFromApiError('description')) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description ||
                    getFieldErrorFromApiError('description')}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <div className="relative">
                <select
                  value={event.type || 'general'}
                  onChange={e => setEvent({ ...event, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500 appearance-none pr-8"
                >
                  <option value="general">General</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="conference">Conference</option>
                  <option value="job_fair">Job Fair</option>
                  <option value="networking">Networking</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  value={event.status || 'draft'}
                  onChange={e => setEvent({ ...event, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-0 appearance-none pr-8"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speakers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speakers
              </label>
              <div className="relative">
                <select className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500 appearance-none pr-8">
                  <option value="" disabled selected>
                    Add speakers (e.g., Dr. Jane Doe)
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Associated Companies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Associated Companies
              </label>
              <div className="relative">
                <select className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500 appearance-none pr-8">
                  <option value="" disabled selected>
                    Add companies (e.g., Innovate Corp)
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned Staff */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Staff
              </label>
              <div className="relative">
                <select className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500 appearance-none pr-8">
                  <option value="" disabled selected>
                    Add staff (e.g., Alice Brown)
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={event.location || ''}
                  onChange={e =>
                    setEvent({ ...event, location: e.target.value })
                  }
                  className={`w-full p-2 border rounded-md focus:border-0 focus:border-blue-500 ${
                    errors.location || getFieldErrorFromApiError('location')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter location"
                />
                {(errors.location || getFieldErrorFromApiError('location')) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location || getFieldErrorFromApiError('location')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Banner
            </label>
            <div className="border-2 border-gray-300 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setEvent({ ...event, image: null });
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop an image here, or{' '}
                      <span className="text-blue-500">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                  <input
                    type="file"
                    id="event-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById('event-image').click()
                    }
                    className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Upload Banner
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-5 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                /* Cancel logic */
              }}
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-400)] hover:bg-[var(--secondary-500)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-0 disabled:opacity-50"
              >
                {submitLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>{isEdit ? 'Save & Publish' : 'Save & Publish'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
