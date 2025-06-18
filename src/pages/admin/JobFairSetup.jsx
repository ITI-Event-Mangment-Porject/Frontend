import React from 'react';
import Layout from '../../components/common/Layout';
import JobFairSetUp from '../../components/admin/JobFairSetUpComponent/JobFairSetUp';

const JobFairSetup = () => {
  return (
    <Layout>
      <div className="min-h-screen ">
        <JobFairSetUp/>
      </div>
    </Layout>
  );
};

export default JobFairSetup;
