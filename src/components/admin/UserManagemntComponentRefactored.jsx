import React, { useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import UserForm from './UserForm';
import { userAPI } from '../../services/api';
import { useUserManagement } from '../../hooks/useUserManagement';
import { getUserTableColumns } from './userTableConfig.jsx';
import { cleanUserData, getInitialUserState } from '../../utils/userUtils';

const UserManagementComponent = () => {
  // Custom hook for user management logic
  const {
    users,
    tracks,
    searchTerm,
    setSearchTerm,
    selectedTrack,
    setSelectedTrack,
    selectedStatus,
    setSelectedStatus,
    pagination,
    loading,
    error,
    submitLoading,
    trackLoading,
    loadUsers,
    handlePageChange,
    submitUser,
  } = useUserManagement();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState(getInitialUserState());
  const [editUser, setEditUser] = useState(getInitialUserState());
  const [actionError, setActionError] = useState('');
  const [addError, setAddError] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [editProfileImagePreview, setEditProfileImagePreview] = useState(null);

  // User actions
  const handleAddUser = async e => {
    e.preventDefault();
    setAddError('');
    try {
      let userData;

      // If there's a profile image file, use FormData
      if (newUser.profile_image instanceof File) {
        userData = new FormData();
        const cleanedData = cleanUserData(newUser);
        Object.keys(cleanedData).forEach(key => {
          if (key === 'profile_image' && cleanedData[key] instanceof File) {
            userData.append(key, cleanedData[key]);
          } else if (cleanedData[key] !== null && cleanedData[key] !== '') {
            userData.append(key, cleanedData[key]);
          }
        });
        console.log('Sending FormData with profile image');
      } else {
        // Otherwise use regular JSON
        userData = cleanUserData(newUser);
        console.log('Sending JSON data:', userData);
      }

      const result = await submitUser(() => userAPI.create(userData));
      if (result.success) {
        setIsAddModalOpen(false);
        setNewUser(getInitialUserState());
        setProfileImagePreview(null);
        loadUsers();
      } else {
        setAddError(result.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Add user error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setAddError(error.response.data.message || 'Server validation error');
      } else {
        setAddError(error.message || 'An error occurred while adding the user');
      }
    }
  };

  const handleEditUser = async e => {
    e.preventDefault();
    setAddError('');
    try {
      let userData;

      // If there's a profile image file, use FormData
      if (editUser.profile_image instanceof File) {
        userData = new FormData();
        const cleanedData = cleanUserData(editUser);
        Object.keys(cleanedData).forEach(key => {
          if (key === 'profile_image' && cleanedData[key] instanceof File) {
            userData.append(key, cleanedData[key]);
          } else if (cleanedData[key] !== null && cleanedData[key] !== '') {
            userData.append(key, cleanedData[key]);
          }
        });
      } else {
        // Otherwise use regular JSON
        userData = cleanUserData(editUser);
      }

      const result = await submitUser(() =>
        userAPI.update(selectedUser.id, userData)
      );
      if (result.success) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setEditUser(getInitialUserState());
        setEditProfileImagePreview(null);
        loadUsers();
      } else {
        setAddError(result.message || 'Failed to update user');
      }
    } catch (error) {
      setAddError(error.message || 'An error occurred while updating the user');
    }
  };

  const handleDeleteUser = async user => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}?`
      )
    ) {
      try {
        await userAPI.delete(user.id);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  const handleEditClick = user => {
    setSelectedUser(user);
    setEditUser({
      portal_user_id: user.portal_user_id || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      profile_image: user.profile_image || null,
      cv_path: user.cv_path || null,
      bio: user.bio || '',
      linkedin_url: user.linkedin_url || '',
      github_url: user.github_url || '',
      portfolio_url: user.portfolio_url || '',
      track_id: user.track_id || '',
      intake_year: user.intake_year || '',
      graduation_year: user.graduation_year || '',
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    // Set the existing profile image as preview for editing
    setEditProfileImagePreview(user.profile_image || null);
    setIsEditModalOpen(true);
  };

  const handleUserAction = async action => {
    try {
      if (action === 'toggleStatus') {
        await userAPI.update(selectedUser.id, {
          is_active: !selectedUser.is_active,
        });
      } else if (action === 'delete') {
        await userAPI.delete(selectedUser.id);
      }
      setIsActionModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      setActionError(error.message || 'An error occurred');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedTrack('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  const columns = getUserTableColumns(handleEditClick, handleDeleteUser);

  return (
    <div className="p-4 md:p-6 mx-auto w-full max-w-[1184px] min-h-[896px] bg-white flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 mb-6 w-full">
        <h1 className="text-2xl font-bold font-['Archivo'] leading-8 text-[#242524FF] w-full sm:w-auto text-center sm:text-left">
          User Management
        </h1>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="button w-full sm:w-auto"
          >
            <FaUser className="w-4 h-4 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 mb-6 w-full">
        <div className="w-full lg:flex-1 min-w-0 lg:min-w-[300px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <select
          className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={selectedTrack}
          onChange={e => setSelectedTrack(e.target.value)}
          disabled={trackLoading}
        >
          <option value="">
            {trackLoading ? 'Loading tracks...' : 'All Tracks'}
          </option>
          {tracks.map(track => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>

        <select
          className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
        >
          Clear Filters
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-600">Error: {error}</div>
      ) : (
        <div className="w-full">
          <div className="overflow-x-auto">
            <Table columns={columns} data={users} />
          </div>
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedUser(null);
          setActionError('');
        }}
        title="User Actions"
        size="sm"
        showFooter={false}
      >
        <div className="space-y-4">
          {actionError && (
            <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm">
              {actionError}
            </div>
          )}
          <button
            onClick={() => handleUserAction('toggleStatus')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
            disabled={submitLoading}
          >
            {selectedUser?.is_active ? 'Deactivate User' : 'Activate User'}
          </button>
          <button
            onClick={() => handleUserAction('delete')}
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 rounded-md"
            disabled={submitLoading}
          >
            Delete User
          </button>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewUser(getInitialUserState());
          setProfileImagePreview(null);
          setAddError('');
        }}
        title="Add New User"
        size="md"
        showFooter={false}
      >
        <UserForm
          user={newUser}
          setUser={setNewUser}
          tracks={tracks}
          trackLoading={trackLoading}
          onSubmit={handleAddUser}
          submitLoading={submitLoading}
          error={addError}
          profileImagePreview={profileImagePreview}
          setProfileImagePreview={setProfileImagePreview}
          isEdit={false}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
          setEditUser(getInitialUserState());
          setEditProfileImagePreview(null);
          setAddError('');
        }}
        title="Edit User"
        size="md"
        showFooter={false}
      >
        <UserForm
          user={editUser}
          setUser={setEditUser}
          tracks={tracks}
          trackLoading={trackLoading}
          onSubmit={handleEditUser}
          submitLoading={submitLoading}
          error={addError}
          profileImagePreview={editProfileImagePreview}
          setProfileImagePreview={setEditProfileImagePreview}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default UserManagementComponent;
