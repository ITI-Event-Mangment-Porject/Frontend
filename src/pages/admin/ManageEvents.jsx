import React from 'react';
import EventManagementComponent from '../../components/admin/Event Management Components/EventManagementComponent';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const ManageEvents = () => {
  // Use our custom hook to scroll to top when component mounts
  useScrollToTop();

  return (
    <Layout>
      <div className="min-h-screen">
        <EventManagementComponent />
      </div>
    </Layout>
  );
};

export default ManageEvents;
