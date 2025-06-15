import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export const getUserTableColumns = (handleEditClick, handleDeleteUser) => [
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
    render: user => (
      <div className="flex gap-2">
        <button
          onClick={e => {
            e.stopPropagation();
            handleEditClick(user);
          }}
          className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center"
          title="Edit User"
        >
          <FaEdit className="w-3 h-3 mr-1" />
          Edit
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            handleDeleteUser(user);
          }}
          className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center"
          title="Delete User"
        >
          <FaTrash className="w-3 h-3 mr-1" />
          Delete
        </button>
      </div>
    ),
  },
];
