import React, { useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Table from '../../common/Table.jsx';
import Modal from '../../common/Modal.jsx';
import Pagination from '../../common/Pagination.jsx';
import LoadingSpinner from '../../common/LoadingSpinner.jsx';
import TableSkeleton from '../../common/TableSkeleton.jsx';
import UserForm from './UserForm.jsx';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal.jsx';
import { userAPI } from '../../../services/api.js';
import { useUserManagement } from '../../../hooks/useUserManagement.js';
import { getUserTableColumns } from './userTableConfig.jsx';
import {
  cleanUserData,
  getInitialUserState,
} from '../../../utils/userUtils.js';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

        // Debug: Log what we're sending
        console.log('Profile image file:', newUser.profile_image);
        console.log('Cleaned data:', cleanedData);

        Object.keys(cleanedData).forEach(key => {
          if (key === 'profile_image' && cleanedData[key] instanceof File) {
            userData.append(key, cleanedData[key]);
          } else if (key === 'is_active') {
            // Explicitly handle boolean for FormData
            userData.append(key, cleanedData[key] ? '1' : '0');
          } else if (
            cleanedData[key] !== null &&
            cleanedData[key] !== '' &&
            cleanedData[key] !== undefined
          ) {
            userData.append(key, cleanedData[key]);
          }
        });

        // Debug: Log FormData contents
        console.log('FormData contents:');
        for (let [key, value] of userData.entries()) {
          console.log(key, value);
        }
      } else {
        // Otherwise use regular JSON
        userData = cleanUserData(newUser);
        // Remove profile_image if it's empty to avoid sending empty string
        if (userData.profile_image === '' || userData.profile_image === null) {
          delete userData.profile_image;
        }
        console.log('Sending JSON data:', userData);
      }

      const result = await submitUser(() => userAPI.create(userData));
      if (result.success) {
        // Show success toast
        toast.success(
          `User "${newUser.first_name} ${newUser.last_name}" created successfully!`
        );

        setIsAddModalOpen(false);
        setNewUser(getInitialUserState());
        setProfileImagePreview(null);
        loadUsers();
      } else {
        // Handle validation errors in API response
        if (result.errors && typeof result.errors === 'object') {
          const errorMessages = Object.entries(result.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n');
          setAddError(errorMessages || result.message || 'Validation failed');
        } else {
          setAddError(result.message || 'Failed to add user');
        }
      }
    } catch (error) {
      console.error('Add user error:', error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        console.error('Error response:', responseData);

        // Handle validation errors specifically
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Format validation errors
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setAddError(
            errorMessages || responseData.message || 'Validation failed'
          );
        } else {
          setAddError(responseData.message || 'Server validation error');
        }
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

        // Debug: Log what we're sending for edit
        console.log('Edit - Profile image file:', editUser.profile_image);
        console.log('Edit - Cleaned data:', cleanedData);

        Object.keys(cleanedData).forEach(key => {
          if (key === 'profile_image' && cleanedData[key] instanceof File) {
            userData.append(key, cleanedData[key]);
          } else if (key === 'is_active') {
            // Explicitly handle boolean for FormData
            userData.append(key, cleanedData[key] ? '1' : '0');
          } else if (
            cleanedData[key] !== null &&
            cleanedData[key] !== '' &&
            cleanedData[key] !== undefined
          ) {
            userData.append(key, cleanedData[key]);
          }
        });

        // Debug: Log FormData contents for edit
        console.log('Edit - FormData contents:');
        for (let [key, value] of userData.entries()) {
          console.log(key, value);
        }
      } else {
        // Otherwise use regular JSON
        userData = cleanUserData(editUser);
        // Handle profile image removal - send empty string to indicate removal
        if (editUser.profile_image === '') {
          userData.profile_image = '';
        } else if (
          editUser.profile_image === null ||
          editUser.profile_image === undefined
        ) {
          delete userData.profile_image;
        }
        console.log('Edit - Sending JSON data:', userData);
      }

      const result = await submitUser(() =>
        userAPI.update(selectedUser.id, userData)
      );
      if (result.success) {
        // Show success toast
        toast.success(
          `User "${editUser.first_name} ${editUser.last_name}" updated successfully!`
        );

        setIsEditModalOpen(false);
        setSelectedUser(null);
        setEditUser(getInitialUserState());
        setEditProfileImagePreview(null);
        loadUsers();
      } else {
        // Handle validation errors in API response
        if (result.errors && typeof result.errors === 'object') {
          const errorMessages = Object.entries(result.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n');
          setAddError(errorMessages || result.message || 'Validation failed');
        } else {
          setAddError(result.message || 'Failed to update user');
        }
      }
    } catch (error) {
      console.error('Edit user error:', error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        console.error('Error response:', responseData);

        // Handle validation errors specifically
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Format validation errors
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setAddError(
            errorMessages || responseData.message || 'Validation failed'
          );
        } else {
          setAddError(responseData.message || 'Server validation error');
        }
      } else {
        setAddError(
          error.message || 'An error occurred while updating the user'
        );
      }
    }
  };

  const handleDeleteUser = async user => {
    // Show the delete confirmation modal
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Function to actually delete the user after confirmation
  const confirmDeleteUser = async () => {
    try {
      await userAPI.delete(userToDelete.id);
      toast.success(
        `User "${userToDelete.first_name} ${userToDelete.last_name}" deleted successfully!`
      );
      loadUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);

      // Handle different error types
      if (error.status === 409 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.message) {
        // Handle other API errors with message
        toast.error(error.response.data.message);
      } else if (error.message) {
        // Handle general errors
        toast.error(`Error deleting user: ${error.message}`);
      } else {
        // Fallback error message
        toast.error('Failed to delete user. Please try again.');
      }

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Function to cancel user deletion
  const cancelDeleteUser = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
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
      is_active: user.is_active !== undefined ? user.is_active : true, // Preserve existing status
    });
    // Set the existing profile image as preview for editing - construct full URL
    if (user.profile_image && typeof user.profile_image === 'string') {
      setEditProfileImagePreview(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${user.profile_image}`
      );
    } else {
      setEditProfileImagePreview(null);
    }
    setIsEditModalOpen(true);
  };

  const handleUserAction = async action => {
    try {
      if (action === 'toggleStatus') {
        await userAPI.update(selectedUser.id, {
          is_active: !selectedUser.is_active,
        });
        const newStatus = !selectedUser.is_active ? 'activated' : 'deactivated';
        toast.success(
          `User "${selectedUser.first_name} ${selectedUser.last_name}" ${newStatus} successfully!`
        );
      } else if (action === 'delete') {
        await userAPI.delete(selectedUser.id);
        toast.success(
          `User "${selectedUser.first_name} ${selectedUser.last_name}" deleted successfully!`
        );
      }
      setIsActionModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('User action error:', error);
      toast.error(
        `Failed to perform action: ${error.message || 'An error occurred'}`
      );
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
    <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-[var(--gray-200)] rounded-lg shadow-md transition-all duration-300 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 w-full transform transition-all duration-300 ease-out">
        <h1 className="text-xl sm:text-2xl  font-bold  leading-6 sm:leading-8 text-[var(--gray-900)] w-full sm:w-auto text-left">
          User Management
        </h1>
        <div className="w-full sm:w-auto flex justify-stretch sm:justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="button w-full sm:w-auto hover:shadow-md text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            <FaUser className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-transform duration-200 ease-out" />
            <span className="hidden sm:inline">Add New User</span>
            <span className="sm:hidden w-100 text-start">Add New User</span>
          </button>
        </div>
      </div>
      {/* Filters */}
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full animate-fade-in"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Search Input */}
        <div className="w-full lg:flex-1 min-w-0 lg:min-w-[15rem] xl:min-w-[18rem] transform transition-all duration-300 ease-out hover:scale-[1.01]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 w-3 h-3 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-[var(--gray-300)] rounded-md focus:outline-none focus:border-0 hover:shadow-md transition-all duration-200 ease-out focus:border-[var(--primary-500)] hover:border-[var(--gray-500)] focus:shadow-md"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Track Filter */}
        <select
          className="w-full sm:w-auto lg:w-32 xl:w-52 border border-[var(--gray-300)] rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:border-0 hover:shadow-md focus:border-[var(--primary-500)] transition-all duration-200 ease-out hover:border-[var(--gray-500)] focus:shadow-md"
          value={selectedTrack}
          onChange={e => setSelectedTrack(e.target.value)}
          disabled={trackLoading}
        >
          <option value="">All Tracks</option>
          {tracks.map(track => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="w-full sm:w-auto lg:w-28 xl:w-32 border border-[var(--gray-300)] rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none hover:shadow-md transition-all duration-200 ease-out hover:border-[var(--gray-500)] focus:border-[var(--primary-500)] focus:border-0 focus:shadow-md"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 border border-[var(--gray-300)] rounded-md focus:border-0 hover:shadow-md transform hover:scale-103 active:scale-95 whitespace-nowrap"
        >
          <span className="hidden sm:inline">Clear Filters</span>
          <span className="sm:hidden">Clear</span>
        </button>
      </div>{' '}
      {/* Content */}
      {loading ? (
        <div className="w-full animate-fade-in">
          <TableSkeleton
            rows={5}
            columns={5}
            showProfileColumn={true}
            showActionsColumn={true}
          />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 animate-fade-in px-4">
          <div className="text-red-500 text-base sm:text-lg mb-2 animate-bounce text-center">
            ⚠️ No Users Found
          </div>
          <p
            className="text-gray-600 mb-4 text-center text-sm sm:text-base animate-fade-in max-w-md"
            style={{ animationDelay: '0.2s' }}
          >
            There was an error loading the users or no users match your
            criteria.
          </p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700  focus:outline-none focus:ring-2  focus:ring-gray-500 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 animate-fade-in text-sm sm:text-base"
            style={{ animationDelay: '0.4s' }}
          >
            Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 animate-fade-in px-4">
          <div className="text-gray-500 text-base sm:text-lg mb-2 animate-bounce text-center">
            👥 No Users Found
          </div>
          <p
            className="text-gray-600 mb-4 text-center text-sm sm:text-base animate-fade-in max-w-md"
            style={{ animationDelay: '0.2s' }}
          >
            No users match your current search and filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 animate-fade-in text-sm sm:text-base"
            style={{ animationDelay: '0.4s' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className="w-full animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Mobile Card View for small screens */}
          <div className="block md:hidden space-y-4 mb-4">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <FaUser className="w-1/2 h-1/2 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                  <div className="truncate">
                    <span className="font-medium">Intake Year:</span>{' '}
                    {user.intake_year ? user.intake_year : 'N/A'}
                  </div>
                  <div className="flex justify-end">
                    <span
                      className="px-2 py-1 rounded-full text-xs whitespace-nowrap"
                      style={{
                        backgroundColor: `${user.track?.color || '#6B7280'}20`,
                        color: user.track?.color || '#6B7280',
                      }}
                    >
                      {user.track?.name || 'No Track'}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Email:</span>{' '}
                    {user.email || 'N/A'}
                  </div>
                  <div className="truncate text-right">
                    <span className="font-medium">ID:</span>{' '}
                    {user.portal_user_id || 'N/A'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="flex-1 py-2 bg-gray-600 text-white rounded- hover:bg-gray-700  text-xs transition-colors min-h-[2rem]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsActionModalOpen(true);
                    }}
                    className="flex-1 py-2 bg-[var(--secondary-400)] text-white rounded text-xs hover:bg-[var(--secondary-500)] transition-colors min-h-[2rem]"
                  >
                    Actions
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto transform transition-all duration-300 ease-out hover:shadow-lg rounded-lg">
            <Table columns={columns} data={users} />
          </div>

          <div
            className="mt-4 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
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
        {' '}
        <div className="space-y-4 animate-fade-in">
          {actionError && (
            <div className="p-2 text-red-600 bg-red-50 rounded-md text-sm animate-shake">
              {actionError}
            </div>
          )}
          <button
            onClick={() => handleUserAction('toggleStatus')}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={submitLoading}
          >
            <span className="transition-colors duration-200">
              {selectedUser?.is_active ? 'Deactivate User' : 'Activate User'}
            </span>
            {submitLoading && (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
          <button
            onClick={() => handleUserAction('delete')}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-red-100 text-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={submitLoading}
          >
            <span className="transition-colors duration-200">Delete User</span>
            {submitLoading && (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            )}
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
        size="lg"
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
        size="lg"
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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <DeleteConfirmationModal
          user={userToDelete}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagementComponent;
