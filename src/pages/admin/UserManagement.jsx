import React from 'react';
import UserManagementComponent from '../../components/admin/User Managment Components/UserManagemntComponentRefactored';
import Layout from '../../components/common/Layout';

const UserManagement = () => {
  return (
    <Layout>
      <div className="min-h-screen ">
        <UserManagementComponent />
      </div>
    </Layout>
  );
};

export default UserManagement;
