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
import {
  MessageSquare,
  Plus,
  Brain,
  Star,
  User,
  Calendar,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  UsersIcon,
  Lightbulb,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { toast } from "react-toastify"
import { eventAPI, attendanceAPI } from "../../../services/api"
import { ClipLoader } from "react-spinners"
import EventForm from "./EventForm.jsx"

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

  // Feedback State
  const [feedbackData, setFeedbackData] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [showCreateFeedbackModal, setShowCreateFeedbackModal] = useState(false)
  const [showAIAnalyticsModal, setShowAIAnalyticsModal] = useState(false)
  const [aiAnalytics, setAiAnalytics] = useState(null)
  const [creatingFeedbackForm, setCreatingFeedbackForm] = useState(false)
  const [generatingAnalytics, setGeneratingAnalytics] = useState(false)
  const [feedbackPagination, setFeedbackPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  })
  const [feedbackCurrentPage, setFeedbackCurrentPage] = useState(1)

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editError, setEditError] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  const ADMIN_TOKEN = localStorage.getItem("token")

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendanceData()
    } else if (activeTab === "feedbacks") {
      fetchFeedbackData(feedbackCurrentPage)
    }
  }, [activeTab, id, feedbackCurrentPage])

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

  const fetchFeedbackData = async (page = 1) => {
    try {
      setFeedbackLoading(true)
      const response = await fetch(`http://localhost:8000/api/feedback/events/${id}/responses?page=${page}`, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFeedbackData(data.data)
          // Handle pagination data
          if (data.data.responses) {
            setFeedbackPagination({
              current_page: data.data.responses.current_page || 1,
              last_page: data.data.responses.last_page || 1,
              per_page: data.data.responses.per_page || 10,
              total: data.data.responses.total || 0,
              from: data.data.responses.from || 0,
              to: data.data.responses.to || 0,
            })
          }
        } else {
          setFeedbackData(null)
        }
      } else if (response.status === 404) {
        setFeedbackData(null)
      } else {
        throw new Error("Failed to fetch feedback data")
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error)
      setFeedbackData(null)
    } finally {
      setFeedbackLoading(false)
    }
  }

  const handleFeedbackPageChange = (page) => {
    setFeedbackCurrentPage(page)
    fetchFeedbackData(page)
  }

  const fetchAIAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/ai-insights/events/${id}/detailed`, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAiAnalytics(data.data)
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error fetching AI analytics:", error)
      return false
    }
  }

  const createFeedbackForm = async (formData) => {
    try {
      setCreatingFeedbackForm(true)
      const response = await fetch(`http://localhost:8000/api/feedback/events/${id}/forms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success("Feedback form created successfully!")
          setShowCreateFeedbackModal(false)
          fetchFeedbackData(feedbackCurrentPage) // Refresh feedback data
          return true
        }
      }
      throw new Error("Failed to create feedback form")
    } catch (error) {
      console.error("Error creating feedback form:", error)
      toast.error("Failed to create feedback form")
      return false
    } finally {
      setCreatingFeedbackForm(false)
    }
  }

  const generateAIAnalytics = async () => {
    try {
      setGeneratingAnalytics(true)
      const response = await fetch(`http://localhost:8000/api/ai-insights/events/${id}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regenerate: true }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success("AI analytics generated successfully!")
          await fetchAIAnalytics()
          return true
        }
      }
      throw new Error("Failed to generate AI analytics")
    } catch (error) {
      console.error("Error generating AI analytics:", error)
      toast.error("Failed to generate AI analytics")
      return false
    } finally {
      setGeneratingAnalytics(false)
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

  const handleEditEvent = async (e, eventData) => {
    e.preventDefault()
    setEditError("")
    try {
      setEditLoading(true)

      let updateData
      if (eventData.image instanceof File) {
        updateData = new FormData()
        Object.keys(eventData).forEach((key) => {
          if (key === "image" && eventData[key] instanceof File) {
            updateData.append("event_image", eventData[key])
          } else if (eventData[key] !== null && eventData[key] !== "") {
            updateData.append(key, eventData[key])
          }
        })
      } else {
        updateData = { ...eventData }
        delete updateData.image // Remove image if it's not a file
      }

      const response = await eventAPI.update(event.id, updateData)

      if (response.data.success) {
        toast.success(`Event "${eventData.title}" updated successfully!`)
        setShowEditModal(false)
        setEditEvent(null)
        setEditImagePreview(null)
        fetchEventDetails() // Refresh event details
        return true
      } else {
        throw new Error(response.data.message || "Failed to update event")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join("\n")
        setEditError(errorMessages)
      } else {
        setEditError(error.response?.data?.message || error.message || "Failed to update event")
      }
      return false
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = () => {
    setEditEvent({
      title: event.title || "",
      description: event.description || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      location: event.location || "",
      capacity: event.capacity || "",
      type: event.type || "Job Fair",
      visibility_type: event.visibility_type || "role_based",
      visibility_config: event.visibility_config || null,
    })
    setEditImagePreview(event.banner_image || null)
    setShowEditModal(true)
  }

  const handleEdit = () => {
    handleEditClick()
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
              {(event.status?.toLowerCase() === "completed" || event.status?.toLowerCase() === "draft") && (
                <button
                  onClick={() => handleTabChange("feedbacks")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === "feedbacks"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Feedbacks
                  {feedbackData?.responses?.length > 0 && (
                    <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {feedbackData.responses.length}
                    </span>
                  )}
                </button>
              )}
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
        ) : activeTab === "attendance" ? (
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
        ) : (
          <FeedbacksTab
            event={event}
            feedbackData={feedbackData}
            feedbackLoading={feedbackLoading}
            feedbackPagination={feedbackPagination}
            feedbackCurrentPage={feedbackCurrentPage}
            handleFeedbackPageChange={handleFeedbackPageChange}
            showCreateFeedbackModal={showCreateFeedbackModal}
            setShowCreateFeedbackModal={setShowCreateFeedbackModal}
            showAIAnalyticsModal={showAIAnalyticsModal}
            setShowAIAnalyticsModal={setShowAIAnalyticsModal}
            aiAnalytics={aiAnalytics}
            createFeedbackForm={createFeedbackForm}
            generateAIAnalytics={generateAIAnalytics}
            fetchAIAnalytics={fetchAIAnalytics}
            creatingFeedbackForm={creatingFeedbackForm}
            generatingAnalytics={generatingAnalytics}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Edit Event</h2>
                  <p className="text-blue-100">{event.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditEvent(null)
                    setEditImagePreview(null)
                    setEditError("")
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <EventForm
                event={editEvent}
                setEvent={setEditEvent}
                onSubmit={handleEditEvent}
                submitLoading={editLoading}
                error={editError}
                imagePreview={editImagePreview}
                setImagePreview={setEditImagePreview}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}
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

// Feedbacks Tab Component
const FeedbacksTab = ({
  event,
  feedbackData,
  feedbackLoading,
  feedbackPagination,
  feedbackCurrentPage,
  handleFeedbackPageChange,
  showCreateFeedbackModal,
  setShowCreateFeedbackModal,
  showAIAnalyticsModal,
  setShowAIAnalyticsModal,
  aiAnalytics,
  createFeedbackForm,
  generateAIAnalytics,
  fetchAIAnalytics,
  creatingFeedbackForm,
  generatingAnalytics,
  formatDate,
}) => {
  const [hasAIAnalytics, setHasAIAnalytics] = useState(false)

  useEffect(() => {
    if (feedbackData?.responses?.length > 0) {
      checkAIAnalytics()
    }
  }, [feedbackData])

  const checkAIAnalytics = async () => {
    const hasAnalytics = await fetchAIAnalytics()
    setHasAIAnalytics(hasAnalytics)
  }

  const handleShowAIAnalytics = async () => {
    await fetchAIAnalytics()
    setShowAIAnalyticsModal(true)
  }

  const handleGenerateAIAnalytics = async () => {
    const success = await generateAIAnalytics()
    if (success) {
      setHasAIAnalytics(true)
    }
  }

  if (feedbackLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ClipLoader size={40} color="#3B82F6" />
          <p className="mt-4 text-gray-600">Loading feedback data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Responses</p>
                <p className="text-lg font-bold text-blue-900">{feedbackData?.total_responses || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-600">Average Rating</p>
                <p className="text-lg font-bold text-green-900">
                  {feedbackData?.average_rating ? Number(feedbackData.average_rating).toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-600">Event Date</p>
                <p className="text-lg font-bold text-purple-900">{formatDate(event.start_date)}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-orange-600">AI Analytics</p>
                <p className="text-lg font-bold text-orange-900">{hasAIAnalytics ? "Available" : "Not Generated"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Feedback Form */}
      {!feedbackData && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Feedback Form Available</h3>
            <p className="text-gray-600 mb-6">
              Create a feedback form to collect participant responses for this event.
            </p>
            <button
              onClick={() => setShowCreateFeedbackModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Feedback Form
            </button>
          </div>
        </div>
      )}

      {/* Feedback Responses */}
      {feedbackData && (
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end">
            {feedbackData.responses?.length > 0 && (
              <>
                {hasAIAnalytics ? (
                  <button
                    onClick={handleShowAIAnalytics}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Show AI Analytics
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateAIAnalytics}
                    disabled={generatingAnalytics}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {generatingAnalytics ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                    {generatingAnalytics ? "Generating..." : "AI Analysis"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Feedback Form Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{feedbackData.form?.title}</h3>
            {feedbackData.form?.description && <p className="text-gray-600 mb-4">{feedbackData.form.description}</p>}
            <div className="text-sm text-gray-500">
              Form created: {new Date(feedbackData.form?.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Responses List */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Feedback Responses ({feedbackData.responses?.data?.length || 0} of {feedbackPagination.total})
              </h2>
            </div>

            {!feedbackData.responses?.data?.length ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Responses Yet</h3>
                <p className="text-gray-600">Participants haven't submitted feedback responses yet.</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {feedbackData.responses.data.map((response, index) => {
                    const responses = JSON.parse(response.responses)
                    return (
                      <div key={response.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {response.user?.first_name} {response.user?.last_name}
                              </h4>
                              <p className="text-sm text-gray-600">{response.user?.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{response.overall_rating}/5</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(response.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(responses).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-gray-700 mb-1 capitalize">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm text-gray-900">
                                {typeof value === "number" && key.includes("rating") ? `${value}/5` : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {feedbackPagination.last_page > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50 gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {feedbackPagination.from} to {feedbackPagination.to} of {feedbackPagination.total}{" "}
                      responses
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFeedbackPageChange(feedbackCurrentPage - 1)}
                        disabled={feedbackCurrentPage === 1}
                        className={`px-3 py-1 rounded border text-sm ${
                          feedbackCurrentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Previous
                      </button>

                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, feedbackPagination.last_page) }, (_, i) => {
                          let pageNum
                          if (feedbackPagination.last_page <= 5) {
                            pageNum = i + 1
                          } else if (feedbackCurrentPage <= 3) {
                            pageNum = i + 1
                          } else if (feedbackCurrentPage >= feedbackPagination.last_page - 2) {
                            pageNum = feedbackPagination.last_page - 4 + i
                          } else {
                            pageNum = feedbackCurrentPage - 2 + i
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handleFeedbackPageChange(pageNum)}
                              className={`px-3 py-1 rounded border text-sm ${
                                feedbackCurrentPage === pageNum
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
                        onClick={() => handleFeedbackPageChange(feedbackCurrentPage + 1)}
                        disabled={feedbackCurrentPage === feedbackPagination.last_page}
                        className={`px-3 py-1 rounded border text-sm ${
                          feedbackCurrentPage === feedbackPagination.last_page
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
        </>
      )}

      {/* Create Feedback Form Modal */}
      {showCreateFeedbackModal && (
        <CreateFeedbackFormModal
          event={event}
          onClose={() => setShowCreateFeedbackModal(false)}
          onSubmit={createFeedbackForm}
          isSubmitting={creatingFeedbackForm}
        />
      )}

      {/* AI Analytics Modal */}
      {showAIAnalyticsModal && aiAnalytics && (
        <AIAnalyticsModal event={event} analytics={aiAnalytics} onClose={() => setShowAIAnalyticsModal(false)} />
      )}
    </div>
  )
}

// Create Feedback Form Modal Component
const CreateFeedbackFormModal = ({ event, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: `${event.title} - Feedback Form`,
    description: "We'd love your thoughts to help improve future events.",
    form_config: [
      {
        question: "How would you rate the event content?",
        type: "rating",
      },
      {
        question: "How would you rate the event organization?",
        type: "rating",
      },
      {
        question: "What did you like most about the event?",
        type: "text",
      },
      {
        question: "What could be improved for future events?",
        type: "text",
      },
    ],
  })

  const questionTypes = [
    { value: "text", label: "Text Answer" },
    { value: "rating", label: "Rating (1-5)" },
  ]

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      form_config: [
        ...prev.form_config,
        {
          question: "",
          type: "text",
        },
      ],
    }))
  }

  const handleRemoveQuestion = (index) => {
    if (index < 4) return // Can't remove static questions
    setFormData((prev) => ({
      ...prev,
      form_config: prev.form_config.filter((_, i) => i !== index),
    }))
  }

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      form_config: prev.form_config.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Form title is required"
    }
    if (!formData.description.trim()) {
      return "Form description is required"
    }

    // Validate all questions have content
    for (let i = 0; i < formData.form_config.length; i++) {
      if (!formData.form_config[i].question.trim()) {
        return `Question ${i + 1} cannot be empty`
      }
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }

    const success = await onSubmit(formData)
    if (success) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create Feedback Form</h2>
              <p className="text-blue-100">for {event.title}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Form Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Form Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                placeholder="Enter form title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Form Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Enter form description"
                required
              />
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Questions</h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {formData.form_config.map((question, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500/30 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500">
                          Question {index + 1}
                          {index < 4 && <span className="text-blue-500"> (Required)</span>}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                        disabled={index < 4} // Static questions can't be edited
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                          index < 4 ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter question"
                        required
                      />

                      <div className="relative">
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                          disabled={index < 4} // Static question types can't be changed
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
                            index < 4 ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {questionTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {index >= 4 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="text-red-500 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Create Form
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// AI Analytics Modal Component
const AIAnalyticsModal = ({ event, analytics, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <p className="text-blue-100">AI Analytics Report</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              Executive Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {analytics.insights?.analysis?.summary || "No summary available"}
            </p>
          </div>

          {/* Key Strengths */}
          {analytics.insights?.analysis?.key_strengths && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Key Strengths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.insights.analysis.key_strengths.map((strength, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-green-800 font-medium">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Areas for Improvement */}
          {analytics.insights?.analysis?.areas_for_improvement && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                Areas for Improvement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.insights.analysis.areas_for_improvement.map((area, index) => (
                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-800 font-medium">{area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analytics.insights?.analysis?.recommendations && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-purple-500" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                {analytics.insights.analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${
                      rec.priority === "high"
                        ? "bg-red-50 border-red-200"
                        : rec.priority === "medium"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          rec.priority === "high"
                            ? "bg-red-500 text-white"
                            : rec.priority === "medium"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-500 text-white"
                        }`}
                      >
                        {rec.priority}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{rec.action}</h4>
                        <p className="text-gray-600">{rec.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Themes */}
          {analytics.insights?.analysis?.common_themes && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-500" />
                Common Themes
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {analytics.insights.analysis.common_themes.map((theme, index) => (
                  <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-indigo-800 font-medium">{theme}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Insights */}
            {analytics.insights?.analysis?.attendance_insights && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-green-500" />
                  Attendance Insights
                </h3>
                <p className="text-gray-700">{analytics.insights.analysis.attendance_insights}</p>
              </div>
            )}

            {/* Technical Feedback */}
            {analytics.insights?.analysis?.technical_feedback && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Technical Feedback
                </h3>
                <p className="text-gray-700">{analytics.insights.analysis.technical_feedback}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
