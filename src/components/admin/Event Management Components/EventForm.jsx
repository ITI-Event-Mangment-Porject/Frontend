import React, { useState, useRef, useEffect } from 'react';
import {
  FaImage,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaUpload,
  FaEdit,
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

  // Create a ref for the form
  const formRef = useRef(null);

  // Effect to scroll to the field with an error when API returns errors
  useEffect(() => {
    if (error && formRef.current) {
      // Scroll to top of form with a slight delay to ensure DOM is updated
      setTimeout(() => {
        // First scroll to the error message at the top
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Now look for specific field errors and focus on the first one found
        const errorFields = [
          { pattern: 'title:', selector: 'input[name="title"]' },
          { pattern: 'description:', selector: 'textarea' },
          {
            pattern: 'start_date:',
            selector: 'input[type="date"]:first-of-type',
          },
          { pattern: 'end_date:', selector: 'input[type="date"]:last-of-type' },
          { pattern: 'start_time:', selector: 'input[name="start_time"]' },
          { pattern: 'end_time:', selector: 'input[name="end_time"]' },
          { pattern: 'location:', selector: 'input[name="location"]' },
          { pattern: 'capacity:', selector: 'input[name="capacity"]' },
          { pattern: 'visibility_type:', selector: 'select' },
        ];

        // Check if error contains end_date in JSON format
        let hasEndDateError = false;
        if (typeof error === 'string' && error.includes('"end_date"')) {
          hasEndDateError = true;
          const endDateInput = formRef.current.querySelector(
            'input[type="date"]:last-of-type'
          );
          if (endDateInput) {
            // Scroll the element into view
            endDateInput.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });

            // Add a highlight effect
            endDateInput.classList.add(
              'border-red-500',
              'ring-2',
              'ring-red-200'
            );

            // Focus on the input
            endDateInput.focus();

            // Remove highlight effect after 2 seconds
            setTimeout(() => {
              endDateInput.classList.remove('ring-2', 'ring-red-200');
            }, 2000);
          }
        }

        // Only search for other errors if end_date error wasn't already handled
        if (!hasEndDateError) {
          // Find the first field that has an error
          for (const field of errorFields) {
            if (error.includes(field.pattern)) {
              const errorInput = formRef.current.querySelector(field.selector);
              if (errorInput) {
                // Scroll the element into view
                errorInput.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });

                // Add a highlight effect
                errorInput.classList.add(
                  'border-red-500',
                  'ring-2',
                  'ring-red-200'
                );

                // Focus on the input
                errorInput.focus();

                // Remove highlight effect after 2 seconds
                setTimeout(() => {
                  errorInput.classList.remove('ring-2', 'ring-red-200');
                }, 2000);

                break; // Stop after finding the first error
              }
            }
          }
        }
      }, 100);
    }
  }, [error]);

  // Helper function to validate time format (H:i)
  const validateTimeFormat = timeStr => {
    if (!timeStr) return false;
    // Accept both H:i (24-hour) format like "14:30" or "09:00"
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  };

  // Helper function to format time to H:i format
  const formatTimeToHi = timeStr => {
    if (!timeStr) return '';

    // If already in H:i format, return as is
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      // Ensure leading zero for hours if needed
      const [hours, minutes] = timeStr.split(':');
      return `${hours.padStart(2, '0')}:${minutes}`;
    }

    // If in HH:MM format from input[type="time"], convert to H:i
    if (/^[0-2][0-9]:[0-5][0-9]$/.test(timeStr)) {
      return timeStr; // Already in correct format
    }

    return timeStr;
  };

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

    // Time validation only for new events (not editing)
    if (!isEdit) {
      if (!event.start_time || event.start_time.trim() === '') {
        newErrors.start_time = 'Start time is required';
      } else if (!validateTimeFormat(event.start_time)) {
        newErrors.start_time = 'Start time must be in H:i format (e.g., 14:30)';
      }

      if (!event.end_time || event.end_time.trim() === '') {
        newErrors.end_time = 'End time is required';
      } else if (!validateTimeFormat(event.end_time)) {
        newErrors.end_time = 'End time must be in H:i format (e.g., 16:30)';
      }

      // Validate that end time is after start time on the same day
      if (
        event.start_time &&
        event.end_time &&
        validateTimeFormat(event.start_time) &&
        validateTimeFormat(event.end_time) &&
        event.start_date === event.end_date
      ) {
        const [startHour, startMin] = event.start_time.split(':').map(Number);
        const [endHour, endMin] = event.end_time.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        if (endMinutes <= startMinutes) {
          newErrors.end_time = 'End time must be after start time';
        }
      }
    }

    if (!event.location || event.location.trim() === '') {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Submit button clicked, validating form...');

    // Check for missing required fields
    let newErrors = {};
    if (!event.start_date) {
      console.error('Start date is missing');
      newErrors.start_date = 'Start date is required';
    }
    if (!event.end_date) {
      console.error('End date is missing');
      newErrors.end_date = 'End date is required';

      // Log the specific JSON error format for missing end_date
      console.error(
        'JSON formatted error:',
        JSON.stringify({ end_date: 'End date is required' })
      );
    }

    // Time validation only for new events (not editing)
    if (!isEdit) {
      if (!event.start_time) {
        console.error('Start time is missing');
        newErrors.start_time = 'Start time is required';
      }
      if (!event.end_time) {
        console.error('End time is missing');
        newErrors.end_time = 'End time is required';
      }
    }

    if (!event.title) {
      console.error('Title is missing');
      newErrors.title = 'Title is required';
    }
    if (!event.location) {
      console.error('Location is missing');
      newErrors.location = 'Location is required';
    }
    if (!event.description) {
      console.error('Description is missing');
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log('Form validation failed, errors:', newErrors);

      // If end_date is missing, format error as requested JSON format
      if (newErrors.end_date) {
        // This will be passed to the parent component and displayed
        const jsonErrorFormat = JSON.stringify({
          end_date: 'End date is required',
        });
        console.error('Formatted JSON error for end_date:', jsonErrorFormat);
      }

      // Scroll to the first field with an error
      setTimeout(() => {
        // Get all error fields
        const errorFields = Object.keys(newErrors);
        if (errorFields.length > 0) {
          // Find the first field with an error
          const firstErrorField = errorFields[0];

          let errorElement;

          // Handle different fields that might have different selectors
          if (
            firstErrorField === 'start_date' ||
            firstErrorField === 'end_date'
          ) {
            errorElement = formRef.current.querySelector(
              `input[type="date"][value="${event[firstErrorField] || ''}"]`
            );
            if (!errorElement) {
              // If can't find by value, try to find by position
              if (firstErrorField === 'start_date') {
                errorElement = formRef.current.querySelector(
                  'input[type="date"]:first-of-type'
                );
              } else if (firstErrorField === 'end_date') {
                errorElement = formRef.current.querySelector(
                  'input[type="date"]:last-of-type'
                );
              }
            }
          } else if (
            firstErrorField === 'start_time' ||
            firstErrorField === 'end_time'
          ) {
            errorElement = formRef.current.querySelector(
              `input[name="${firstErrorField}"]`
            );
          } else if (firstErrorField === 'description') {
            errorElement = formRef.current.querySelector('textarea');
          } else {
            // Generic case for other fields
            errorElement = formRef.current.querySelector(
              `[name="${firstErrorField}"]`
            );
            if (!errorElement) {
              errorElement = formRef.current.querySelector(
                `input[placeholder*="${firstErrorField}"]`
              );
            }
          }

          if (errorElement) {
            // Scroll to the error element
            errorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });

            // Add a highlight effect
            errorElement.classList.add(
              'border-red-500',
              'ring-2',
              'ring-red-200'
            );

            // Focus on the error element
            errorElement.focus();

            // Remove highlight effect after 2 seconds
            setTimeout(() => {
              errorElement.classList.remove('ring-2', 'ring-red-200');
            }, 2000);
          }
        }
      }, 100);

      return;
    }

    if (validateForm()) {
      console.log('Form validation passed, submitting event data:', event);

      // Ensure created_by is set to 1 (System Administrator)
      const eventData = {
        ...event,
        created_by: 1,
        // Make sure these fields are properly formatted
        start_date: formatDateForInput(event.start_date),
        end_date: formatDateForInput(event.end_date),
        visibility_type: event.visibility_type || 'role_based',
      };

      // Format time fields for new events only (backend expects H:i format)
      if (!isEdit) {
        if (event.start_time) {
          eventData.start_time = formatTimeToHi(event.start_time);
        }
        if (event.end_time) {
          eventData.end_time = formatTimeToHi(event.end_time);
        }
      }

      console.log('Event data for submission:', eventData);

      // Properly handle visibility_config
      if (
        !eventData.visibility_config &&
        eventData.visibility_type === 'role_based'
      ) {
        eventData.visibility_config = JSON.stringify({
          roles: ['student', 'alumni'],
        });
      } else if (typeof eventData.visibility_config === 'object') {
        eventData.visibility_config = JSON.stringify(
          eventData.visibility_config
        );
      }

      // Convert capacity to number if it's a string
      if (eventData.capacity && typeof eventData.capacity === 'string') {
        eventData.capacity = parseInt(eventData.capacity, 10);
      }

      console.log(
        'Event data with created_by prepared for submission:',
        eventData
      );
      onSubmit(e, eventData);
    } else {
      console.log('Form validation failed, errors:', errors);
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

    // Format as YYYY-MM-DD for input field
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Parse API error message if it's in a specific format (field: message)
  const getFieldErrorFromApiError = fieldName => {
    if (!error) return null;
    // Check if error is in JSON format like { "end_date": "End date is required" }
    try {
      // Check if error is already a parsed JSON object
      if (typeof error === 'object' && error !== null) {
        return error[fieldName] || null;
      }

      // Try to parse error as JSON string
      if (error.includes('{') && error.includes('}')) {
        const jsonMatch = error.match(/\{.*\}/s);
        if (jsonMatch) {
          const errorObj = JSON.parse(jsonMatch[0]);
          return errorObj[fieldName] || null;
        }
      }
    } catch (e) {
      console.log('Error parsing JSON error:', e);
      // Continue with line-by-line parsing if JSON parsing fails
    }

    // Fall back to line-by-line parsing if not JSON
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
      <p className="text-sm text-gray-500 mb-6 animate-[fadeIn_0.5s_0s_forwards] opacity-0">
        Fill out the details below to {isEdit ? 'update' : 'create'} an event.
        All fields with * are required.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm mb-6 animate-[fadeIn_0.5s_0.1s_forwards] opacity-0">
          {error.includes('"end_date"') ? (
            <div>
              <p className="font-medium">Validation Error:</p>
              <code className="block mt-1 p-2 bg-red-100 rounded">{error}</code>
              <p className="mt-2">Please check the end date field below.</p>
            </div>
          ) : (
            error
          )}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="form-container">
        {/* Hidden input for created_by */}
        <input type="hidden" name="created_by" value="1" />

        <div className="space-y-8">
          {/* Event Title */}
          <div className="animate-[fadeIn_0.5s_0.2s_forwards] opacity-0">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
              Event Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEdit
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 animate-[fadeIn_0.3s_0.2s_forwards] ${
                  errors.title || getFieldErrorFromApiError('title')
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              />
              <input
                type="text"
                name="title"
                value={event.title || ''}
                onChange={e => setEvent({ ...event, title: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:border-0 focus:border-blue-500 animate-[fadeIn_0.3s_0.2s_forwards] ${
                  errors.title || getFieldErrorFromApiError('title')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="e.g., Annual Tech Summit 2024"
              />
            </div>
            {(errors.title || getFieldErrorFromApiError('title')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title || getFieldErrorFromApiError('title')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_0.4s_forwards] opacity-0">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 animate-[fadeIn_0.3s_0.2s_forwards]" />
                <input
                  type="date"
                  name="start_date"
                  value={formatDateForInput(event.start_date)}
                  onChange={e =>
                    setEvent({ ...event, start_date: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:border-0 focus:border-blue-500 animate-[fadeIn_0.3s_0.2s_forwards] ${
                    errors.start_date || getFieldErrorFromApiError('start_date')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {(errors.start_date ||
                getFieldErrorFromApiError('start_date')) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.start_date || getFieldErrorFromApiError('start_date')}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 animate-[fadeIn_0.3s_0.2s_forwards]" />
                <input
                  type="date"
                  name="end_date"
                  value={formatDateForInput(event.end_date)}
                  onChange={e =>
                    setEvent({ ...event, end_date: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:border-0 focus:border-blue-500 animate-[fadeIn_0.3s_0.2s_forwards] ${
                    errors.end_date || getFieldErrorFromApiError('end_date')
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {(errors.end_date || getFieldErrorFromApiError('end_date')) && (
                <div className="mt-1 text-sm text-red-600">
                  <p className="font-medium">
                    {errors.end_date || getFieldErrorFromApiError('end_date')}
                  </p>
                  {error && error.includes('"end_date"') && (
                    <p className="text-xs mt-1 italic">
                      {'{ "end_date": "End date is required" }'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Time Fields - Only show when creating new events */}
          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_0.6s_forwards] opacity-0">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaClock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 animate-[fadeIn_0.3s_0.2s_forwards] ${
                      errors.start_time ||
                      getFieldErrorFromApiError('start_time')
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="time"
                    name="start_time"
                    value={event.start_time || ''}
                    onChange={e =>
                      setEvent({ ...event, start_time: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:border-0 focus:border-blue-500 animate-[fadeIn_0.3s_0.2s_forwards] ${
                      errors.start_time ||
                      getFieldErrorFromApiError('start_time')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                {(errors.start_time ||
                  getFieldErrorFromApiError('start_time')) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.start_time ||
                      getFieldErrorFromApiError('start_time')}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
                  End Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaClock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 animate-[fadeIn_0.3s_0.2s_forwards] ${
                      errors.end_time || getFieldErrorFromApiError('end_time')
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="time"
                    name="end_time"
                    value={event.end_time || ''}
                    onChange={e =>
                      setEvent({ ...event, end_time: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:border-0 focus:border-blue-500 animate-[fadeIn_0.3s_0.2s_forwards] ${
                      errors.end_time || getFieldErrorFromApiError('end_time')
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                {(errors.end_time || getFieldErrorFromApiError('end_time')) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.end_time || getFieldErrorFromApiError('end_time')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="animate-[fadeIn_0.5s_0.8s_forwards] opacity-0">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={event.description || ''}
              onChange={e =>
                setEvent({ ...event, description: e.target.value })
              }
              rows="4"
              className={`w-full p-2 border rounded-md focus:border-0 animate-[fadeIn_0.3s_0.2s_forwards] ${
                errors.description || getFieldErrorFromApiError('description')
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="Provide a detailed description of the event."
            />
            {(errors.description ||
              getFieldErrorFromApiError('description')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description || getFieldErrorFromApiError('description')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_1.0s_forwards] opacity-0">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
                Event Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={event.type}
                  onChange={e => setEvent({ ...event, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-0 focus:border-blue-500 appearance-none pr-8 animate-[fadeIn_0.3s_0.2s_forwards]"
                >
                  <option value="Job Fair">Job Fair</option>
                  <option value="Tech">Tech</option>
                  <option value="Fun">Fun</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={event.status || 'draft'}
                  onChange={e => setEvent({ ...event, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-0 appearance-none pr-8 animate-[fadeIn_0.3s_0.2s_forwards]"
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

          {/* Visibility Settings */}
          <div className="animate-[fadeIn_0.5s_1.2s_forwards] opacity-0">
            <label className="block text-sm font-medium text-gray-700 mb-3 animate-[fadeIn_0.3s_0.2s_forwards]">
              Visibility Settings
            </label>
            <div className="flex items-center space-x-2 animate-[fadeIn_0.3s_0.2s_forwards]">
              <div className="flex items-center h-5">
                <input
                  id="public-visibility"
                  type="checkbox"
                  checked={event.visibility_type === 'all'}
                  onChange={e => {
                    const visibilityType = e.target.checked
                      ? 'all'
                      : 'role_based';
                    let visibilityConfig = null;

                    // Set default visibility config if role_based
                    if (visibilityType === 'role_based') {
                      visibilityConfig = JSON.stringify({
                        roles: ['student', 'alumni'],
                      });
                    }

                    setEvent({
                      ...event,
                      visibility_type: visibilityType,
                      visibility_config: visibilityConfig,
                    });
                  }}
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
            <p className="text-xs text-gray-500 mt-1 animate-[fadeIn_0.3s_0.2s_forwards]">
              When enabled, this event will be visible to all users. When
              disabled, it will only be visible to students and alumni.
            </p>
          </div>

          {/* Location */}
          <div className="animate-[fadeIn_0.5s_1.4s_forwards] opacity-0">
            <label className="block text-sm font-medium text-gray-700 mb-1 animate-[fadeIn_0.3s_0.2s_forwards]">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaMapMarkerAlt
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 animate-[fadeIn_0.3s_0.2s_forwards] ${
                  errors.location || getFieldErrorFromApiError('location')
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              />
              <input
                type="text"
                name="location"
                value={event.location || ''}
                onChange={e => setEvent({ ...event, location: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:border-0 focus:border-blue-500 animate-[fadeIn_0.3s_0.2s_forwards] ${
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

          {/* Event Banner */}
          <div className="animate-[fadeIn_0.5s_1.6s_forwards] opacity-0">
            <label className="block text-sm font-medium text-gray-700 mb-2 animate-[fadeIn_0.3s_0.2s_forwards]">
              Event Banner
            </label>
            <div className="border-2 border-gray-300 border-dashed rounded-md p-6 flex flex-col items-center justify-center animate-[fadeIn_0.3s_0.2s_forwards]">
              {imagePreview ? (
                <div className="relative w-full max-w-md mx-auto animate-[fadeIn_0.3s_0.2s_forwards]">
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
                  <div className="text-center animate-[fadeIn_0.3s_0.2s_forwards]">
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

          <div className="flex justify-between pt-5 border-t border-gray-200 animate-[fadeIn_0.5s_1.8s_forwards] opacity-0">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
              onClick={() => {
                /* Cancel logic */
              }}
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-400)] hover:bg-[var(--secondary-500)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-0 disabled:opacity-50 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
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
                  <span>{isEdit ? 'Update Event' : 'Create Event'}</span>
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
