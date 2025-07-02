import React, { useState, useRef, useEffect } from 'react';
import {
  FaTimes,
  FaUserAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaPaperPlane,
  FaHeading,
  FaEnvelope,
  FaCheck,
} from 'react-icons/fa';

// Helper function to parse and extract field-specific errors
const getFieldErrorFromApiError = (error, fieldName) => {
  if (!error) return null;
  const regex = new RegExp(`${fieldName}:\\s*([^\\n]+)`, 'i');
  const match = error.match(regex);
  return match ? match[1] : null;
};

const NotificationForm = ({
  isOpen,
  onClose,
  onSubmit,
  error = null,
  isLoading = false,
}) => {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    recipientType: 'all',
    specificRecipients: [],
    scheduledDate: '',
    scheduledTime: '',
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setNotification({
        title: '',
        message: '',
        recipientType: 'all',
        specificRecipients: [],
        scheduledDate: '',
        scheduledTime: '',
      });
      setErrors({});
    }
  }, [isOpen]);

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

        // Look for specific field errors and focus on the first one found
        const errorFields = [
          { pattern: 'title:', selector: 'input[name="title"]' },
          { pattern: 'message:', selector: 'textarea[name="message"]' },
          { pattern: 'recipients:', selector: 'div[data-field="recipients"]' },
        ];

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
      }, 100);
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {};
    if (!notification.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!notification.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (
      notification.recipientType === 'specific' &&
      notification.specificRecipients.length === 0
    ) {
      newErrors.specificRecipients = 'Please select at least one recipient';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...notification,
        status: 'pending',
        sentDate: notification.scheduledDate || new Date().toLocaleDateString(),
        sentTime: notification.scheduledTime || new Date().toLocaleTimeString(),
      });
    } else {
      // Scroll to the first field with an error
      setTimeout(() => {
        // Get all error fields
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          // Find the first field with an error
          const firstErrorField = errorFields[0];
          const errorElement = formRef.current.querySelector(
            `[name="${firstErrorField}"]`
          );

          if (errorElement) {
            // Scroll to the error element
            errorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            // Focus on the error element
            errorElement.focus();
          } else if (firstErrorField === 'specificRecipients') {
            // Handle recipients selection
            const recipientsField = formRef.current.querySelector(
              '[data-field="recipients"]'
            );
            if (recipientsField) {
              recipientsField.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }
        }
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/30 backdrop-blur-md flex items-center justify-center z-50 overflow-y-auto p-4 transition-all duration-300 ease-in-out">
      <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-3xl mx-auto relative transform transition-all duration-300 ease-in-out scale-100 opacity-100 animate-modal-in">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">
            Create New Notification
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Error Message from API (if any) */}
        {error && (
          <div className="mx-6 mt-4 p-4 border-l-4 border-red-500 bg-red-50/90 rounded-md backdrop-blur-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There was an error with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          {/* Notification Title */}
          <div className="mb-5 opacity-0 animate-[fadeIn_0.3s_0.1s_forwards]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaHeading className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="title"
                value={notification.title}
                onChange={e =>
                  setNotification({ ...notification, title: e.target.value })
                }
                className={`w-full p-2 pl-10 border rounded-md focus:outline-none focus:border-0 focus:ring-[var(--primary-400)] ${
                  errors.title || getFieldErrorFromApiError(error, 'title')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Enter notification title"
              />
            </div>
            {(errors.title || getFieldErrorFromApiError(error, 'title')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title || getFieldErrorFromApiError(error, 'title')}
              </p>
            )}
          </div>

          {/* Notification Message */}
          <div className="mb-5 opacity-0 animate-[fadeIn_0.3s_0.2s_forwards]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-500">
                <FaEnvelope className="h-4 w-4" />
              </span>
              <textarea
                name="message"
                value={notification.message}
                onChange={e =>
                  setNotification({ ...notification, message: e.target.value })
                }
                rows={4}
                className={`w-full p-2 pl-10 border rounded-md focus:outline-none focus:border-0 focus:ring-[var(--primary-400)] ${
                  errors.message || getFieldErrorFromApiError(error, 'message')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Enter notification message"
              />
            </div>
            {(errors.message ||
              getFieldErrorFromApiError(error, 'message')) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.message || getFieldErrorFromApiError(error, 'message')}
              </p>
            )}
          </div>

          {/* Recipients Selection */}
          <div
            data-field="recipients"
            className="mb-5 opacity-0 animate-[fadeIn_0.3s_0.3s_forwards]"
          >
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Recipients
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div
                className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                  notification.recipientType === 'all'
                    ? 'bg-[var(--primary-50)] border-[var(--primary-500)] text-[var(--primary-700)]'
                    : 'border-gray-300 hover:border-[var(--primary-300)]'
                }`}
                onClick={() =>
                  setNotification({ ...notification, recipientType: 'all' })
                }
              >
                <div
                  className={`p-2 rounded-full mr-3 ${
                    notification.recipientType === 'all'
                      ? 'bg-[var(--primary-100)]'
                      : 'bg-gray-100'
                  }`}
                >
                  <FaUsers
                    className={`h-4 w-4 ${
                      notification.recipientType === 'all'
                        ? 'text-[var(--primary-500)]'
                        : 'text-gray-500'
                    }`}
                  />
                </div>
                <span className="font-medium">All Users</span>
                {notification.recipientType === 'all' && (
                  <FaCheck className="ml-auto text-[var(--primary-500)]" />
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                  notification.recipientType === 'students'
                    ? 'bg-[var(--primary-50)] border-[var(--primary-500)] text-[var(--primary-700)]'
                    : 'border-gray-300 hover:border-[var(--primary-300)]'
                }`}
                onClick={() =>
                  setNotification({
                    ...notification,
                    recipientType: 'students',
                  })
                }
              >
                <div
                  className={`p-2 rounded-full mr-3 ${
                    notification.recipientType === 'students'
                      ? 'bg-[var(--primary-100)]'
                      : 'bg-gray-100'
                  }`}
                >
                  <FaUserAlt
                    className={`h-4 w-4 ${
                      notification.recipientType === 'students'
                        ? 'text-[var(--primary-500)]'
                        : 'text-gray-500'
                    }`}
                  />
                </div>
                <span className="font-medium">Students</span>
                {notification.recipientType === 'students' && (
                  <FaCheck className="ml-auto text-[var(--primary-500)]" />
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                  notification.recipientType === 'companies'
                    ? 'bg-[var(--primary-50)] border-[var(--primary-500)] text-[var(--primary-700)]'
                    : 'border-gray-300 hover:border-[var(--primary-300)]'
                }`}
                onClick={() =>
                  setNotification({
                    ...notification,
                    recipientType: 'companies',
                  })
                }
              >
                <div
                  className={`p-2 rounded-full mr-3 ${
                    notification.recipientType === 'companies'
                      ? 'bg-[var(--primary-100)]'
                      : 'bg-gray-100'
                  }`}
                >
                  <FaBuilding
                    className={`h-4 w-4 ${
                      notification.recipientType === 'companies'
                        ? 'text-[var(--primary-500)]'
                        : 'text-gray-500'
                    }`}
                  />
                </div>
                <span className="font-medium">Companies</span>
                {notification.recipientType === 'companies' && (
                  <FaCheck className="ml-auto text-[var(--primary-500)]" />
                )}
              </div>

              <div
                className={`flex items-center p-2 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                  notification.recipientType === 'specific'
                    ? 'bg-[var(--primary-50)] border-[var(--primary-500)] text-[var(--primary-700)]'
                    : 'border-gray-300 hover:border-[var(--primary-300)]'
                }`}
                onClick={() =>
                  setNotification({
                    ...notification,
                    recipientType: 'specific',
                  })
                }
              >
                <div
                  className={`p-2 rounded-full mr-3 ${
                    notification.recipientType === 'specific'
                      ? 'bg-[var(--primary-100)]'
                      : 'bg-gray-100'
                  }`}
                >
                  <FaUserAlt
                    className={`h-4 w-4 ${
                      notification.recipientType === 'specific'
                        ? 'text-[var(--primary-500)]'
                        : 'text-gray-500'
                    }`}
                  />
                </div>
                <span className="font-medium">Specific Users</span>
                {notification.recipientType === 'specific' && (
                  <FaCheck className="ml-auto text-[var(--primary-500)]" />
                )}
              </div>
            </div>
          </div>

          {/* Specific Recipients (shown only when 'specific' is selected) */}
          {notification.recipientType === 'specific' && (
            <div className="mb-5 opacity-0 animate-[fadeIn_0.3s_0.4s_forwards]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Recipients <span className="text-red-500">*</span>
              </label>
              <select
                multiple
                name="specificRecipients"
                className={`w-full p-2 border rounded-md focus:outline-none focus:border-0 focus:ring-[var(--primary-400)] ${
                  errors.specificRecipients ||
                  getFieldErrorFromApiError(error, 'recipients')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                value={notification.specificRecipients}
                onChange={e => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    option => option.value
                  );
                  setNotification({
                    ...notification,
                    specificRecipients: values,
                  });
                }}
              >
                <option value="user1">John Smith</option>
                <option value="user2">Jane Doe</option>
                <option value="user3">Bob Johnson</option>
                <option value="user4">Tech Solutions Inc.</option>
                <option value="user5">Global Innovations</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl (or Cmd) to select multiple recipients
              </p>
              {(errors.specificRecipients ||
                getFieldErrorFromApiError(error, 'recipients')) && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.specificRecipients ||
                    getFieldErrorFromApiError(error, 'recipients')}
                </p>
              )}
            </div>
          )}

          {/* Scheduled Delivery Option */}
          <div className="border-t pt-5 mb-5 opacity-0 animate-[fadeIn_0.3s_0.5s_forwards]">
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                checked={!!notification.scheduledDate}
                onChange={e => {
                  if (e.target.checked) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const dateStr = tomorrow.toISOString().split('T')[0];
                    const timeStr = '09:00';
                    setNotification({
                      ...notification,
                      scheduledDate: dateStr,
                      scheduledTime: timeStr,
                    });
                  } else {
                    setNotification({
                      ...notification,
                      scheduledDate: '',
                      scheduledTime: '',
                    });
                  }
                }}
                className="h-4 w-4 text-[var(--primary-600)] focus:ring-[var(--primary-500)] border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Schedule for later
              </span>
            </label>

            {notification.scheduledDate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <FaCalendarAlt className="h-4 w-4" />
                    </span>
                    <input
                      type="date"
                      value={notification.scheduledDate}
                      onChange={e =>
                        setNotification({
                          ...notification,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-0 focus:ring-[var(--primary-400)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={notification.scheduledTime}
                    onChange={e =>
                      setNotification({
                        ...notification,
                        scheduledTime: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-0 focus:ring-[var(--primary-400)]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t opacity-0 animate-[fadeIn_0.3s_0.6s_forwards]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:border-0 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[var(--primary-500)] text-white rounded-md hover:bg-[var(--primary-600)] focus:outline-none focus:border-0 focus:ring-offset-2 focus:ring-[var(--primary-600)] flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
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
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  {notification.scheduledDate ? 'Schedule' : 'Send Now'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
