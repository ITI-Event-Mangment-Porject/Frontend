import React from 'react';
import FeedbackAnalytics from '../../components/admin/Analytics/AlFeedbackAnalyics';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const AlFeedbackAnalyics = () => {
  useScrollToTop();

  return (
    <Layout>
      <div className="mt-1 bg-white shadow-lg duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
        <FeedbackAnalytics />
      </div>
    </Layout>
  );
};

export default AlFeedbackAnalyics;