import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import NotificationStats from '../../components/admin/Notification/NotificationStats';
import NotificationFilter from '../../components/admin/Notification/NotificationFilter';
import NotificationTable from '../../components/admin/Notification/NotificationTable';
import NotificationDetail from '../../components/admin/Notification/NotificationDetail';
import NotificationForm from '../../components/admin/Notification/NotificationForm';
import { generateMockNotifications } from '../../utils/notificationUtils';
import { messageAPI } from '../../services/api';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useScrollToTop();

  // Load mock notifications on component mount
  useEffect(() => {
    const mockData = generateMockNotifications();
    setNotifications(mockData);
    setFilteredNotifications(mockData);
  }, []);

  // Calculate statistics
  const totalCount = notifications.length;
  const successCount = notifications.filter(
    n => n.status.toLowerCase() === 'success'
  ).length;
  const failedCount = notifications.filter(
    n => n.status.toLowerCase() === 'failed'
  ).length;

  // View notification details
  const handleViewDetails = notification => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  // Resend notification
  const handleResend = notification => {
    // In a real app, this would send the notification again
    alert(`Notification "${notification.title}" will be resent.`);
  };

  // Delete notification
  const handleDelete = notification => {
    if (
      window.confirm(`Are you sure you want to delete "${notification.title}"?`)
    ) {
      const updated = notifications.filter(n => n.id !== notification.id);
      setNotifications(updated);
      setFilteredNotifications(updated);
    }
  };

  // Create new notification
  const handleCreateNotification = async newNotification => {
    try {
      setFormLoading(true);
      setFormError(null);

      // Transform the form data to match API structure
      const apiPayload = {
        title: newNotification.title,
        message: newNotification.message,
        target_criteria: {
          roles:
            newNotification.recipientType === 'all'
              ? ['student', 'company', 'staff']
              : newNotification.recipientType === 'specific'
                ? ['student'] // Default to students for specific recipients
                : [
                    newNotification.recipientType === 'students'
                      ? 'student'
                      : newNotification.recipientType === 'companies'
                        ? 'company'
                        : 'staff',
                  ],
          events: ['job_fair'], // Default to job_fair events
        },
        scheduled_at:
          newNotification.scheduledDate && newNotification.scheduledTime
            ? `${newNotification.scheduledDate} ${newNotification.scheduledTime}:00`
            : null,
      };

      console.log('Creating notification with payload:', apiPayload);

      // Step 1: Create the notification
      const createResponse = await messageAPI.create(apiPayload);
      console.log('Notification created:', createResponse);

      let notificationId;
      if (createResponse.data?.data?.id) {
        notificationId = createResponse.data.data.id;
      } else if (createResponse.data?.id) {
        notificationId = createResponse.data.id;
      } else {
        throw new Error('Failed to get notification ID from response');
      }

      // Step 2: Send the notification if not scheduled
      if (!newNotification.scheduledDate) {
        console.log('Sending notification immediately:', notificationId);
        const sendResponse = await messageAPI.sendMessage(notificationId);
        console.log('Notification sent:', sendResponse);
      }

      // Update local state with the new notification
      const completeNotification = {
        id: notificationId,
        title: newNotification.title,
        message: newNotification.message,
        recipientType: newNotification.recipientType,
        recipients:
          newNotification.recipientType === 'specific'
            ? newNotification.specificRecipients.join(', ')
            : newNotification.recipientType === 'all'
              ? 'All Users'
              : `All ${newNotification.recipientType}`,
        status: newNotification.scheduledDate ? 'scheduled' : 'sent',
        sentDate:
          newNotification.scheduledDate || new Date().toLocaleDateString(),
        sentTime:
          newNotification.scheduledTime || new Date().toLocaleTimeString(),
        scheduledDate: newNotification.scheduledDate,
        scheduledTime: newNotification.scheduledTime,
      };

      const updatedNotifications = [completeNotification, ...notifications];
      setNotifications(updatedNotifications);
      setFilteredNotifications(updatedNotifications);

      // Close form and show success
      setIsFormOpen(false);
      alert(
        newNotification.scheduledDate
          ? 'Notification scheduled successfully!'
          : 'Notification created and sent successfully!'
      );
    } catch (error) {
      console.error('Error creating/sending notification:', error);

      // Extract error message
      let errorMessage = 'Failed to create notification';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-[var(--gray-200)] rounded-lg shadow-md transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2  text-white rounded-md bg-[var(--primary-500)] hover:bg-[var(--primary-600)] flex items-center"
          >
            <FaPlus className="mr-2" />
            New Notification
          </button>
        </div>

        {/* Stats Cards */}
        <NotificationStats
          totalCount={totalCount}
          successCount={successCount}
          failedCount={failedCount}
        />

        {/* Notification Table */}
        <NotificationTable
          notifications={filteredNotifications}
          onViewDetails={handleViewDetails}
          onResend={handleResend}
          onDelete={handleDelete}
        />

        {/* Notification Detail Modal */}
        {isDetailOpen && (
          <NotificationDetail
            notification={selectedNotification}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedNotification(null);
            }}
          />
        )}

        {/* Notification Form Modal */}
        <NotificationForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setFormError(null); // Clear error when closing
          }}
          onSubmit={handleCreateNotification}
          isLoading={formLoading}
          error={formError}
        />
      </div>
    </Layout>
  );
};

export default Notifications;
