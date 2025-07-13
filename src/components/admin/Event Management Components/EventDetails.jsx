'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaCalendarPlus,
  FaArchive,
  FaGlobe,
  FaLock,
  FaFileAlt,
  
  FaSearch,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { eventAPI, attendanceAPI } from '../../../services/api';
import { ClipLoader } from 'react-spinners';
// import Attendance_Reports from '../Attendance_ReportsComponent/Attendance_Reports';
// import AttendanceReports from '@/pages/admin/AttendanceReports';
import AttendanceTable from './AttendanceTable';
import ParticipatingCompaniesTab from './ParticipationCompaniesTab';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active tab from URL, default to 'details'
  const activeTab = searchParams.get('tab') || 'details';

  // Event Details State
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Attendance State
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 10;

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendanceData();
    }
  }, [activeTab, id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventAPI.getById(id);

      if (response.data.success) {
        setEvent(response.data.data.result);
      } else {
        setError('Failed to fetch event details');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getReports();

      if (response?.data?.success) {
        setAttendanceData(response.data.data.result);
        //  // Set first event as active by default
        //  if (response.data.data.result.length > 0) {
        //    setActiveEventTab(response.data.data.result[0].event);
        //  }
      } else {
        console.error(
          'Failed to fetch attendance data:',
          response?.data?.message || 'Unknown error'
        );
        toast.error('Failed to load attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Error loading attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = tab => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
    setSearchParams(newSearchParams);

    // Reset pagination when switching tabs
    if (tab === 'attendance') {
      setCurrentPage(1);
      setSearchTerm('');
    }
  };

  const handleExportAttendance = async () => {
    try {
      const response = await attendanceAPI.exportAttendance('xlsx');

      if (response?.data) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_report.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Attendance report exported successfully!');
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error exporting attendance:', error);
      toast.error('Failed to export attendance report');
    }
  };

  const handlePublish = async () => {
    try {
      setActionLoading(true);
      await eventAPI.publish(event.id);
      toast.success(`Event "${event.title}" published successfully!`);
      fetchEventDetails();
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error('Failed to publish event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      setActionLoading(true);
      await eventAPI.archive(event.id);
      toast.success(`Event "${event.title}" archived successfully!`);
      fetchEventDetails();
    } catch (error) {
      console.error('Error archiving event:', error);
      toast.error('Failed to archive event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/admin/events', { state: { editEventId: event.id } });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        setActionLoading(true);
        await eventAPI.delete(event.id);
        toast.success(`Event "${event.title}" deleted successfully!`);
        navigate('/admin/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        setActionLoading(false);
      }
    }
  };

  // Filter attendees based on search term
  const filteredAttendees = attendanceData.filter(attendee => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      attendee.name?.toLowerCase().includes(searchLower) ||
      attendee.email?.toLowerCase().includes(searchLower) ||
      attendee.phone?.toLowerCase().includes(searchLower)
    );
  });

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = timeString => {
    if (!timeString) return 'N/A';

    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':');
      const hour = Number.parseInt(hours, 10);
      const minute = Number.parseInt(minutes, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
    }

    return timeString;
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={50} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Event
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/events')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </button>
              <div className="h-6 border-l border-gray-300 hidden sm:block"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {event.title}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {activeTab === 'attendance' && (
                <button
                  onClick={handleExportAttendance}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                  <FaFileAlt className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}

              {event.status?.toLowerCase() === 'draft' && (
                <button
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  <FaCalendarPlus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Publish</span>
                </button>
              )}

              {event.status?.toLowerCase() === 'completed' && (
                <button
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 text-sm"
                >
                  <FaArchive className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Archive</span>
                </button>
              )}

              <button
                onClick={handleEdit}
                disabled={actionLoading}
                className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 text-sm"
              >
                <FaEdit className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 text-sm"
              >
                <FaTrash className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => handleTabChange('details')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                Event Details
              </button>
              <button
                onClick={() => handleTabChange('attendance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'attendance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUsers className="inline w-4 h-4 mr-2" />
                Attendance & Reports
              </button>
              <button
                onClick={() => handleTabChange('companies')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'companies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Participating Companies
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 sm:px-6 lg:px-8 py-8">
        {activeTab === 'details' && (
          <EventDetailsTab
            event={event}
            formatDate={formatDate}
            formatTime={formatTime}
            getStatusColor={getStatusColor}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab event={event} formatDate={formatDate} />
        )}
        

        {activeTab === 'companies' && (
          <ParticipatingCompaniesTab event={event} />
        )}
      </div>
    </div>
  );
};

// Event Details Tab Component
const EventDetailsTab = ({ event, formatDate, formatTime, getStatusColor }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Main Content */}
    <div className="lg:col-span-2 space-y-6">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {event.banner_image && (
          <div className="mb-6">
            <img
              src={
                event.banner_image.startsWith('http')
                  ? event.banner_image
                  : `http://127.0.0.1:8000${event.banner_image}`
              }
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 mr-1" />
                {event.type}
              </span>
              <span className="flex items-center">
                <FaUsers className="w-4 h-4 mr-1" />
                Created by User #{event.created_by}
              </span>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}
          >
            {event.status || 'Draft'}
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <div className="text-gray-700 whitespace-pre-wrap">
            {event.description}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {(event.slido_qr_code || event.slido_embed_url) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Interactive Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.slido_qr_code && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Slido QR Code
                </h4>
                <img
                  src={event.slido_qr_code || '/placeholder.svg'}
                  alt="Slido QR Code"
                  className="w-32 h-32 border rounded-lg"
                />
              </div>
            )}
            {event.slido_embed_url && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Slido Embed URL
                </h4>
                <a
                  href={event.slido_embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline break-all"
                >
                  {event.slido_embed_url}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Sidebar */}
    <div className="space-y-6">
      {/* Event Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Start Date</p>
              <p className="text-gray-600">{formatDate(event.start_date)}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">End Date</p>
              <p className="text-gray-600">{formatDate(event.end_date)}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaClock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Time</p>
              <p className="text-gray-600">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-gray-600">{event.location}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            {event.visibility_type === 'all' ? (
              <FaGlobe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            ) : (
              <FaLock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium text-gray-900">Visibility</p>
              <p className="text-gray-600">
                {event.visibility_type === 'all' ? 'Public' : 'Restricted'}
              </p>
            </div>
          </div>

          {event.registration_deadline && (
            <div className="flex items-start space-x-3">
              <FaClock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  Registration Deadline
                </p>
                <p className="text-gray-600">
                  {formatDate(event.registration_deadline)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-900">Created</p>
            <p className="text-gray-600">
              {new Date(event.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Last Updated</p>
            <p className="text-gray-600">
              {new Date(event.updated_at).toLocaleString()}
            </p>
          </div>
          {event.archived_at && (
            <div>
              <p className="font-medium text-gray-900">Archived</p>
              <p className="text-gray-600">
                {new Date(event.archived_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AttendanceTab = ({ event, formatDate }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await attendanceAPI.getReports();
        const allEvents = response?.data?.data?.result || [];

        const normalize = str => str?.trim().toLowerCase().replace(/\s+/g, ' ');
        const matchedEvent = allEvents.find(
          e => normalize(e.event) === normalize(event.title)
        );

        if (matchedEvent) {
          const attendees = matchedEvent.attendees.map(a => ({
            ...a,
            date: new Date(matchedEvent.event_date).toLocaleDateString(),
          }));
          setAttendanceData(attendees);
        } else {
          setAttendanceData([]);
          console.warn('No matched event found for:', event.title);
        }
      } catch (err) {
        console.error('Failed to load attendance data', err);
        toast.error('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [event.title]);

  // Filtering
  const filteredAttendees = attendanceData.filter(attendee => {
    const search = searchTerm.toLowerCase();
    return (
      attendee.name?.toLowerCase().includes(search) ||
      attendee.email?.toLowerCase().includes(search) ||
      attendee.phone?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * attendeesPerPage,
    currentPage * attendeesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ClipLoader size={40} color="#3B82F6" />
        <p className="mt-4 text-gray-600">Loading attendance data...</p>
      </div>
    );
  }

  return (
    <AttendanceTable
      event={event}
      attendanceData={attendanceData}
      filteredAttendees={filteredAttendees}
      paginatedAttendees={paginatedAttendees}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      attendeesPerPage={attendeesPerPage}
      formatDate={formatDate}
    />
  );
};

export default EventDetails;
