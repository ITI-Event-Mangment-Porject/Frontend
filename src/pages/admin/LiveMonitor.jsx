import React from 'react';
import LiveEventMonitor from '../../components/live-event/live-event-monitor';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const LiveMonitor = () => {
  useScrollToTop();

  return (
    <Layout>
      <div className="mt-1 bg-white shadow-lg duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
        <LiveEventMonitor />
      </div>
    </Layout>
  );
};

export default LiveMonitor;