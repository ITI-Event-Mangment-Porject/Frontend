import React from 'react';
import LiveQueueManagement from '../../components/admin/jobFairSetupComponent/LiveQueue';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const LiveQueue = () => {
  useScrollToTop();

  return (
    <Layout>
      <div className="mt-1 bg-white shadow-lg duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
        <LiveQueueManagement />
      </div>
    </Layout>
  );
};

export default LiveQueue;