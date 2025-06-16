import React from 'react';
import UserManagementComponent from '../../components/admin/UserManagemntComponentRefactored';
import Layout from '../../components/common/Layout';

const UserManagement = () => {
  return (
    <Layout>
      <div className="min-h-screen py-6">
        <UserManagementComponent />
      </div>
    </Layout>
  );
};

export default UserManagement;
