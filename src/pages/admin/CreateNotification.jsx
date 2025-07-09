import React, { useState } from 'react';
import NotificationFormStandalone from '../../components/admin/Notification/NotificationFormStandalone';
import { useNavigate } from 'react-router-dom';
import { messageAPI } from '../../services/api';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const CreateNotification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useScrollToTop();

  // Handle form submission
  const handleSubmit = async notification => {
    try {
      setLoading(true);
      setError(null);

      // Transform the form data to match API structure
      const apiPayload = {
        title: notification.title,
        message: notification.message,
        target_criteria: {
          roles:
            notification.recipientType === 'all'
              ? ['student', 'company', 'staff']
              : notification.recipientType === 'specific'
                ? ['student'] // Default to students for specific recipients
                : [
                    notification.recipientType === 'students'
                      ? 'student'
                      : notification.recipientType === 'companies'
                        ? 'company'
                        : 'staff',
                  ],
          events: ['job_fair'], // Default to job_fair events
        },
        scheduled_at:
          notification.scheduledDate && notification.scheduledTime
            ? `${notification.scheduledDate} ${notification.scheduledTime}:00`
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
      if (!notification.scheduledDate) {
        console.log('Sending notification immediately:', notificationId);
        const sendResponse = await messageAPI.sendMessage(notificationId);
        console.log('Notification sent:', sendResponse);
      }

      // Show success message
      alert(
        notification.scheduledDate
          ? 'Notification scheduled successfully!'
          : 'Notification created and sent successfully!'
      );

      // Navigate back to notifications list
      navigate('/admin/notifications');
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

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 m-1 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <NotificationFormStandalone
          onSubmit={handleSubmit}
          submitLoading={loading}
          error={error}
        />
      </div>
    </Layout>
  );
};

export default CreateNotification;
