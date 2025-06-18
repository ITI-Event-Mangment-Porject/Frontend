import React from 'react';
import UserManagementComponent from '../../components/admin/User Managment Components/UserManagemntComponentRefactored';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const UserManagement = () => {
  // Use our custom hook to scroll to top when component mounts
  useScrollToTop();

  return (
    <Layout>
      <div className="min-h-screen py-6">
        <UserManagementComponent />
      </div>
    </Layout>
  );
};

export default UserManagement;
