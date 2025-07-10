import React from 'react';
import CreateFeedbackForms from '../../components/admin/feedback_form/CreateFeedbackForms';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const FeedbackFormsCreaton = () => {
  useScrollToTop();

  return (
    <Layout>
      <div className="mt-1 bg-white shadow-lg duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
        <CreateFeedbackForms />
      </div>
    </Layout>
  );
};

export default FeedbackFormsCreaton;