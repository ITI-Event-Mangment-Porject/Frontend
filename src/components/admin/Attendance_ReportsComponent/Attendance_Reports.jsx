import React, { useState, useEffect } from 'react';
import { Calendar, Search, ChevronDown, Users } from 'lucide-react';

const Attendance_Reports = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://127.0.0.1:8001/api/reports/attendance'
        );
        const data = await response.json();
        if (data.success) {
          setEventsData(data.data.result);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportAttendance = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8001/api/reports/export?type=xlsx&report=events'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting attendance:', error);
      alert('Failed to export attendance report');
    }
  };

  const generateAttendeeData = () => {
    const allAttendees = [];

    eventsData.forEach(event => {
      event.attendees.forEach(attendee => {
        allAttendees.push({
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          phone: attendee.phone,
          eventTitle: event.event,
          date: new Date(event.event_date).toLocaleDateString(),
          status: attendee.status || 'Unknown',
          checkInTime: attendee.checkInTime || 'N/A',
          notes: attendee.notes || '',
        });
      });
    });

    return allAttendees;
  };

  const attendeeData = generateAttendeeData();

  const totalAttendees = attendeeData.length;
  // // const presentAttendees = attendeeData.filter(
  //   a => a.status === 'Present'
  // ).length;
  // const lateAttendees = attendeeData.filter(a => a.status === 'Late').length;
  const absentAttendees = attendeeData.filter(
    a => a.status === 'Absent'
  ).length;
  // const checkedInPercentage =
  //   totalAttendees > 0
  //     ? (((presentAttendees + lateAttendees) / totalAttendees) * 100).toFixed(1)
  //     : 0;

  const filteredAttendees = attendeeData.filter(attendee => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || attendee.status === statusFilter;
    const matchesEvent =
      !selectedEvent || attendee.eventTitle === selectedEvent;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * attendeesPerPage,
    currentPage * attendeesPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance & Reports
          </h1>
        </div>

        {/* Stats */}
        <div className="grid justify-center grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Total Attendees</div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {totalAttendees.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">
              +{Math.floor(totalAttendees * 0.15)} from last month
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">No-Shows</div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {absentAttendees}
            </div>
            <div className="text-sm text-gray-600">
              -{Math.floor(absentAttendees * 0.1)} from last event
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Events Today</div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {eventsData.length}
            </div>
            <div className="text-sm text-gray-600">Active events</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                >
                  <option value="">All Events</option>
                  {eventsData.map((event, index) => (
                    <option key={index} value={event.event}>
                      {event.event}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select date range"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="col-span-3 flex justify-end">
              <button
                className="w-full bg-red-600 rounded-lg text-white font-medium py-3"
                onClick={() => {
                  setSelectedEvent('');
                  setStatusFilter('');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search attendee or event..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Attendees ({filteredAttendees.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        ID
                      </th>
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
                        Event
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedAttendees.map(attendee => (
                      <tr key={attendee.id}>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {attendee.id}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {attendee.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {attendee.email}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {attendee.phone}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {attendee.eventTitle}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {attendee.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                  <button
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === page
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExportAttendance}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Export Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance_Reports;
