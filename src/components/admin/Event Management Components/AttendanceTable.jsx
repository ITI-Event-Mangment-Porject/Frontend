import React from 'react';
import { FaSearch, FaUsers } from 'react-icons/fa';

const AttendanceTable = ({
  event,
  attendanceData,
  filteredAttendees,
  paginatedAttendees,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  totalPages,
  attendeesPerPage,
  formatDate,
}) => {
  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Event Date</p>
            <p className="text-lg font-bold text-blue-900">
              {formatDate(event.start_date)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Total Attendees</p>
            <p className="text-lg font-bold text-green-900">
              {attendanceData.length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Location</p>
            <p className="text-lg font-bold text-purple-900">
              {event.location || 'N/A'}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-orange-600">Status</p>
            <p className="text-lg font-bold text-orange-900 capitalize">
              {event.status || 'Draft'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Attendee Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendees ({filteredAttendees.length})
          </h2>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Attendees Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'No attendees match your search criteria.'
                : 'No attendees have registered for this event yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Phone
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAttendees.map((attendee, index) => (
                  <tr key={`${attendee.id}-${index}`} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{attendee.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{attendee.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{attendee.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{attendee.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;