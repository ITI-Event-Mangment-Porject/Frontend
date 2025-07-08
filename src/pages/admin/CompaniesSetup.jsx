import React from 'react';
import Layout from '../../components/common/Layout';

import CompaniesSetUp from '../../components/admin/CompaniesSetup/CompaniesSetup';

const CompaniesSetup = () => {
  return (
    <Layout>
      <div className="min-h-screen ">
        <CompaniesSetUp />
      </div>
    </Layout>
  );
};

export default CompaniesSetup;
