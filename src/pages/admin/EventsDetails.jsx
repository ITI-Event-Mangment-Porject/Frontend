import React from 'react';
import EventDetails from '../../components/admin/Event Management Components/EventDetails';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const EventsDetails = () => {
  useScrollToTop();

  return (
    <Layout>
      <div className="mt-1 bg-white shadow-lg duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
        <EventDetails />
      </div>
    </Layout>
  );
};

export default EventsDetails;