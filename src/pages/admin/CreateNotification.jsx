import React from 'react';
import NotificationFormStandalone from '../../components/admin/Notification/NotificationFormStandalone';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const CreateNotification = () => {
  const navigate = useNavigate();
  useScrollToTop();

  // Handle form submission
  const handleSubmit = notification => {
    // In a real app, this would send the data to an API
    console.log('Notification to be sent:', notification);

    // Show success message
    alert('Notification created successfully!');

    // Navigate back to notifications list
    navigate('/admin/notifications');
  };

  return (
    <Layout>
      <div className="p-4 m-1 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <NotificationFormStandalone
          onSubmit={handleSubmit}
          submitLoading={false}
        />
      </div>
    </Layout>
  );
};

export default CreateNotification;
