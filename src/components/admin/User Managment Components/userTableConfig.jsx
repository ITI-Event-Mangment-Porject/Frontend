import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';

export const getUserTableColumns = (handleEditClick, handleDeleteClick) => {
  // Define column configurations
  return [
    {
      header: 'Name',
      accessor: 'name',
      render: user => (
        <div className="flex items-center">
          <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center overflow-hidden">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.first_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{user.first_name.charAt(0)}</span>
            )}
          </div>
          <span className="ml-2 text-sm ">
            {user.first_name} {user.last_name}
          </span>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: user => (
        <div className="text-left text-sm text-[#8C8D8BFF]">{user.email}</div>
      ),
    },
    {
      header: 'Track',
      accessor: 'track',
      render: user => (
        <div className="flex gap-1">
          {user.track && (
            <span
              className="px-2 py-1 rounded-full text-xs"
              style={{
                backgroundColor: `${user.track.color}20`,
                color: user.track.color,
              }}
            >
              {user.track.name}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Intake Year',
      accessor: 'intake_year',
      render: user => (
        <div className="text-left text-sm text-[#8C8D8BFF]">
          {user.intake_year || 'N/A'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: user => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-[#DE3B40FF] text-white'
          }`}
        >
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessor: 'last_login_at',
      render: user => (
        <div className="text-left text-sm text-[#8C8D8BFF]">
          {user.last_login_at
            ? new Date(user.last_login_at)
                .toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
                .replace(/\//g, '-')
                .replace(',', '')
            : 'Never'}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      Render: user => {
        // We use React's useState hook inside a render function
        // This is a bit unconventional but works for this specific case
        const [showDeleteModal, setShowDeleteModal] = useState(false);

        // Handle the delete button click
        const handleDeleteButtonClick = e => {
          e.stopPropagation();
          setShowDeleteModal(true);
        };

        // Handle confirmation of deletion
        const handleConfirmDelete = () => {
          handleDeleteClick(user);
          setShowDeleteModal(false);
        };

        // Handle cancellation of deletion
        const handleCancelDelete = () => {
          setShowDeleteModal(false);
        };

        return (
          <div>
            <div className="flex gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleEditClick(user);
                }}
                className="px-3 py-1 text-sm bg-[var(--secondary-400)] text-white rounded-md hover:bg-[var(--secondary-500)] flex items-center"
                title="Edit User"
              >
                <FaEdit className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDeleteButtonClick}
                className="px-3 py-1 text-sm rounded-md bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] flex items-center"
                title="Delete User"
              >
                <FaTrash className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>

            {/* Render modal conditionally */}
            {showDeleteModal && (
              <DeleteConfirmationModal
                user={user}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
              />
            )}
          </div>
        );
      },
    },
  ];
};
