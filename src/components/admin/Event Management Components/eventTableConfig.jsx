import React from 'react';
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
} from 'react-icons/fa';

export const getEventTableColumns = (handleEditClick, handleDeleteEvent) => [
  {
    header: 'Event',
    accessor: 'title',
    render: event => (
      <div className="flex items-center">
        <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center overflow-hidden">
          {' '}
          {event.banner_image || event.image_url ? (
            <img
              src={event.banner_image || event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FaCalendarAlt className="text-gray-500" />
          )}
        </div>
        <span className="ml-2 text-sm font-medium">{event.title}</span>
      </div>
    ),
  },
  {
    header: 'Date & Time',
    accessor: 'date',
    render: event => (
      <div className="text-left text-sm text-[#8C8D8BFF]">
        <div>{new Date(event.start_date).toLocaleDateString('en-GB')}</div>
        <div className="text-xs">
          {new Date(event.start_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      </div>
    ),
  },
  {
    header: 'Location',
    accessor: 'location',
    render: event => (
      <div className="flex items-center text-sm text-[#8C8D8BFF]">
        <FaMapMarkerAlt className="text-gray-400 mr-1" size={12} />
        {event.location || 'N/A'}
      </div>
    ),
  },
  {
    header: 'Capacity',
    accessor: 'capacity',
    render: event => (
      <div className="text-left text-sm text-[#8C8D8BFF]">
        <div className="flex items-center">
          <FaUserFriends className="text-gray-400 mr-1" size={12} />
          {event.capacity || 'Unlimited'}
        </div>
        {event.registered_count && (
          <div className="text-xs mt-1">
            {event.registered_count} registered
          </div>
        )}
      </div>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    render: event => {
      let statusColor = 'bg-gray-100 text-gray-800';

      switch (event.status?.toLowerCase()) {
        case 'published':
          statusColor = 'bg-blue-100 text-blue-800';
          break;
        case 'active':
        case 'ongoing':
          statusColor = 'bg-green-100 text-green-800';
          break;
        case 'cancelled':
          statusColor = 'bg-red-100 text-red-800';
          break;
        case 'completed':
          statusColor = 'bg-purple-100 text-purple-800';
          break;
        case 'draft':
          statusColor = 'bg-gray-100 text-gray-800';
          break;
        default:
          statusColor = 'bg-gray-100 text-gray-800';
      }

      return (
        <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
          {event.status || 'Draft'}
        </span>
      );
    },
  },
  {
    header: 'Actions',
    accessor: 'actions',
    render: event => (
      <div className="flex gap-2">
        <button
          onClick={e => {
            e.stopPropagation();
            handleEditClick(event);
          }}
          className="px-3 py-1 text-sm bg-[var(--secondary-400)] text-white rounded-md hover:bg-[var(--secondary-500)] flex items-center"
          title="Edit Event"
        >
          <FaEdit className="w-3 h-3 mr-1" />
          Edit
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            handleDeleteEvent(event);
          }}
          className="px-3 py-1 text-sm rounded-md bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] flex items-center"
          title="Delete Event"
        >
          <FaTrash className="w-3 h-3 mr-1" />
          Delete
        </button>
      </div>
    ),
  },
];
