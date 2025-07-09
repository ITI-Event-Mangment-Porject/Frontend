import React from 'react';
import Layout from '../../components/common/Layout';

import BrandingDay from '../../components/admin/BrandingDayComponent/BrandingDay';
const BrandingDaySetup= () => {
  return (
    <Layout>
      <div className="min-h-screen ">
        <BrandingDay />
      </div>
    </Layout>
  );
};

export default BrandingDaySetup;
