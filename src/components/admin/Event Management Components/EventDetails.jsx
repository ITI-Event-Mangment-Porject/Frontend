"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
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
} from "react-icons/fa"
import { toast } from "react-toastify"
import { eventAPI, attendanceAPI } from "../../../services/api"
import { ClipLoader } from "react-spinners"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active tab from URL, default to 'details'
  const activeTab = searchParams.get("tab") || "details"

  // Event Details State
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Attendance State
  const [attendanceData, setAttendanceData] = useState([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const attendeesPerPage = 10

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendanceData()
    }
  }, [activeTab, id])

  const fetchEventDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventAPI.getById(id)

      if (response.data.success) {
        setEvent(response.data.data.result)
      } else {
        setError("Failed to fetch event details")
      }
    } catch (err) {
      console.error("Error fetching event details:", err)
      setError("Failed to load event details")
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceData = async () => {
    try {
      setAttendanceLoading(true)
      const response = await attendanceAPI.getEventAttendance(id)

      if (response?.data?.success) {
        setAttendanceData(response.data.data.result || [])
      } else {
        console.error("Failed to fetch attendance data:", response?.data?.message)
        setAttendanceData([])
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      setAttendanceData([])
    } finally {
      setAttendanceLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("tab", tab)
    setSearchParams(newSearchParams)

    // Reset pagination when switching tabs
    if (tab === "attendance") {
      setCurrentPage(1)
      setSearchTerm("")
    }
  }

  const handleExportAttendance = async () => {
    try {
      const response = await attendanceAPI.exportAttendance("xlsx", id)

      if (response?.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${event?.title || "event"}_attendance_report.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Attendance report exported successfully!")
      } else {
        throw new Error("No data received from server")
      }
    } catch (error) {
      console.error("Error exporting attendance:", error)
      toast.error("Failed to export attendance report")
    }
  }

  const handlePublish = async () => {
    try {
      setActionLoading(true)
      await eventAPI.publish(event.id)
      toast.success(`Event "${event.title}" published successfully!`)
      fetchEventDetails()
    } catch (error) {
      console.error("Error publishing event:", error)
      toast.error("Failed to publish event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleArchive = async () => {
    try {
      setActionLoading(true)
      await eventAPI.archive(event.id)
      toast.success(`Event "${event.title}" archived successfully!`)
      fetchEventDetails()
    } catch (error) {
      console.error("Error archiving event:", error)
      toast.error("Failed to archive event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = () => {
    navigate("/admin/events", { state: { editEventId: event.id } })
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        setActionLoading(true)
        await eventAPI.delete(event.id)
        toast.success(`Event "${event.title}" deleted successfully!`)
        navigate("/admin/events")
      } catch (error) {
        console.error("Error deleting event:", error)
        toast.error("Failed to delete event")
        setActionLoading(false)
      }
    }
  }

  // Filter attendees based on search term
  const filteredAttendees = attendanceData.filter((attendee) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      attendee.name?.toLowerCase().includes(searchLower) ||
      attendee.email?.toLowerCase().includes(searchLower) ||
      attendee.phone?.toLowerCase().includes(searchLower)
    )
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage)
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * attendeesPerPage,
    currentPage * attendeesPerPage,
  )

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"

    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(":")
      const hour = Number.parseInt(hours, 10)
      const minute = Number.parseInt(minutes, 10)
      const period = hour >= 12 ? "PM" : "AM"
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`
    }

    return timeString
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "active":
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={50} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Event</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/events")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/events")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/events")}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </button>
              <div className="h-6 border-l border-gray-300 hidden sm:block"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{event.title}</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {activeTab === "attendance" && (
                <button
                  onClick={handleExportAttendance}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                  <FaFileAlt className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}

              {event.status?.toLowerCase() === "draft" && (
                <button
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  <FaCalendarPlus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Publish</span>
                </button>
              )}

              {event.status?.toLowerCase() === "completed" && (
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
                onClick={() => handleTabChange("details")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                Event Details
              </button>
              <button
                onClick={() => handleTabChange("attendance")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "attendance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaUsers className="inline w-4 h-4 mr-2" />
                Attendance & Reports
                {attendanceData.length > 0 && (
                  <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {attendanceData.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "details" ? (
          <EventDetailsTab
            event={event}
            formatDate={formatDate}
            formatTime={formatTime}
            getStatusColor={getStatusColor}
          />
        ) : (
          <AttendanceTab
            event={event}
            attendanceData={attendanceData}
            attendanceLoading={attendanceLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredAttendees={filteredAttendees}
            paginatedAttendees={paginatedAttendees}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            attendeesPerPage={attendeesPerPage}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  )
}

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
                event.banner_image.startsWith("http")
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
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

          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
            {event.status || "Draft"}
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{event.description}</div>
        </div>
      </div>

      {/* Additional Details */}
      {(event.slido_qr_code || event.slido_embed_url) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.slido_qr_code && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Slido QR Code</h4>
                <img
                  src={event.slido_qr_code || "/placeholder.svg"}
                  alt="Slido QR Code"
                  className="w-32 h-32 border rounded-lg"
                />
              </div>
            )}
            {event.slido_embed_url && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Slido Embed URL</h4>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
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
            {event.visibility_type === "all" ? (
              <FaGlobe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            ) : (
              <FaLock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium text-gray-900">Visibility</p>
              <p className="text-gray-600">{event.visibility_type === "all" ? "Public" : "Restricted"}</p>
            </div>
          </div>

          {event.registration_deadline && (
            <div className="flex items-start space-x-3">
              <FaClock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Registration Deadline</p>
                <p className="text-gray-600">{formatDate(event.registration_deadline)}</p>
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
            <p className="text-gray-600">{new Date(event.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Last Updated</p>
            <p className="text-gray-600">{new Date(event.updated_at).toLocaleString()}</p>
          </div>
          {event.archived_at && (
            <div>
              <p className="font-medium text-gray-900">Archived</p>
              <p className="text-gray-600">{new Date(event.archived_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

// Attendance Tab Component
const AttendanceTab = ({
  event,
  attendanceData,
  attendanceLoading,
  searchTerm,
  setSearchTerm,
  filteredAttendees,
  paginatedAttendees,
  currentPage,
  setCurrentPage,
  totalPages,
  attendeesPerPage,
  formatDate,
}) => {
  if (attendanceLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ClipLoader size={40} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaCalendarAlt className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-600">Event Date</p>
                <p className="text-lg font-bold text-blue-900">{formatDate(event.start_date)}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaUsers className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-600">Total Attendees</p>
                <p className="text-lg font-bold text-green-900">{attendanceData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaMapMarkerAlt className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-600">Location</p>
                <p className="text-lg font-bold text-purple-900">{event.location || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaClock className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-orange-600">Status</p>
                <p className="text-lg font-bold text-orange-900 capitalize">{event.status || "Draft"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Attendees</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            onClick={() => {
              setSearchTerm("")
              setCurrentPage(1)
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Attendees ({filteredAttendees.length})</h2>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendees Found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No attendees match your search criteria."
                : "No attendees have registered for this event yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Phone</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedAttendees.map((attendee, index) => (
                    <tr key={`${attendee.id}-${index}`} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{attendee.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{attendee.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{attendee.phone}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {attendee.date || formatDate(event.start_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {paginatedAttendees.map((attendee, index) => (
                <div key={`${attendee.id}-${index}`} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{attendee.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{attendee.email}</p>
                      <p className="text-sm text-gray-600">{attendee.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Registered</p>
                      <p className="text-sm font-medium text-gray-900">
                        {attendee.date || formatDate(event.start_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * attendeesPerPage + 1} to{" "}
                  {Math.min(currentPage * attendeesPerPage, filteredAttendees.length)} of {filteredAttendees.length}{" "}
                  attendees
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded border text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default EventDetails
