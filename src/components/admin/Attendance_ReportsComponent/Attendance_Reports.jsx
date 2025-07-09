import React, { useState, useEffect } from 'react';
import { Calendar, Search, ChevronDown, Users, FileText } from 'lucide-react';

const Attendance_Reports = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEventTab, setActiveEventTab] = useState('');
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
          // Set first event as active by default
          if (data.data.result.length > 0) {
            setActiveEventTab(data.data.result[0].event);
          }
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
        'http://127.0.0.1:8001/api/reports/export?type=xlsx&report=attendance'
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

  const getActiveEventData = () => {
    return eventsData.find(event => event.event === activeEventTab);
  };

  const getActiveEventAttendees = () => {
    const activeEvent = getActiveEventData();
    if (!activeEvent) return [];

    return activeEvent.attendees.map(attendee => ({
      id: attendee.id,
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      eventTitle: activeEvent.event,
      date: new Date(activeEvent.event_date).toLocaleDateString(),
    }));
  };

  const getAllAttendeesData = () => {
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
        });
      });
    });
    return allAttendees;
  };

  const attendeeData =
    activeEventTab === 'all'
      ? getAllAttendeesData()
      : getActiveEventAttendees();
  const activeEvent = getActiveEventData();

  const filteredAttendees = attendeeData.filter(attendee => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || attendee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * attendeesPerPage,
    currentPage * attendeesPerPage
  );

  // Reset pagination when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeEventTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-gray-200 rounded-lg shadow-md transition-all duration-300 ease-out">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Attendance Reports
            </h1>
            <button
              onClick={handleExportAttendance}
              className="bg-(--primary-500) hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export Attendance
            </button>
          </div>

          {/* Event Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveEventTab('all')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeEventTab === 'all'
                      ? 'border-(--primary-600) text-(--primary-600)'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Events ({getAllAttendeesData().length})
                </button>
                {eventsData.map((event, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveEventTab(event.event)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeEventTab === event.event
                        ? 'border-(--primary-500) text-(--primary-500)'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {event.event} ({event.attendees.length})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Event Details (only show when specific event is selected) */}
          {activeEventTab !== 'all' && activeEvent && (
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Event Name
                  </label>
                  <p className="text-gray-900">{activeEvent.event}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(activeEvent.event_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Total Registered
                  </label>
                  <p className="text-gray-900">
                    {activeEvent.attendees.length} attendees
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or event..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <button
                  className="w-full bg-(--primary-500) rounded-lg text-white font-medium py-3 transition-colors"
                  onClick={() => {
                    setStatusFilter('');
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Attendees ({filteredAttendees.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
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
                    {activeEventTab === 'all' && (
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        Event
                      </th>
                    )}
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedAttendees.map(attendee => (
                    <tr key={`${attendee.id}-${attendee.eventTitle}`}>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {attendee.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {attendee.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {attendee.phone}
                      </td>
                      {activeEventTab === 'all' && (
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {attendee.eventTitle}
                        </td>
                      )}
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {attendee.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === page
                            ? 'bg-(--primary-600) text-white'
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
      </div>
    </div>
  );
};

export default Attendance_Reports;
