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
  FaPlay,
  FaStop,
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
  Clock,
  MapPin,
  Activity,
  Trash2,
  ChevronDown,
  Building2,
  UserCheck,
} from "lucide-react"
import { toast } from "react-toastify"
import { eventAPI, attendanceAPI } from "../../../services/api"
import { ClipLoader } from "react-spinners"
import EventForm from "./EventForm.jsx"
import RegistrationsTabEnhanced from "./RegistrationsTab.jsx"
import AttendanceTableEnhanced from "./AttendanceTable.jsx"
import ParticipatingCompaniesTabEnhanced from "./ParticipationCompaniesTab.jsx"
import JobFairLiveQueue from "./job-fair-live-queue"

const EventDetailsEnhanced = () => {
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

  // Confirmation Modal States
  const [showStartConfirmModal, setShowStartConfirmModal] = useState(false)
  const [showEndConfirmModal, setShowEndConfirmModal] = useState(false)
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false)

  const ADMIN_TOKEN = localStorage.getItem("token")

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendanceData()
    }
  }, [activeTab, id])

  // Add useEffect for feedback data fetching
  useEffect(() => {
    if (activeTab === "feedbacks" && event) {
      fetchFeedbackData(feedbackCurrentPage)
    }
  }, [activeTab, event, id])

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
      const response = await attendanceAPI.getReports()

      if (response?.data?.success) {
        setAttendanceData(response.data.data.result)
      } else {
        console.error("Failed to fetch attendance data:", response?.data?.message || "Unknown error")
        toast.error("Failed to load attendance data")
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast.error("Error loading attendance data")
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

          // Check for AI analytics after feedback data is loaded
          if (data.data.responses?.data?.length > 0) {
            checkAIAnalytics()
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
        if (data.success && data.data) {
          setAiAnalytics(data.data)
          return true
        }
      }
      setAiAnalytics(null)
      return false
    } catch (error) {
      console.error("Error fetching AI analytics:", error)
      setAiAnalytics(null)
      return false
    }
  }

  const checkAIAnalytics = async () => {
    const hasAnalytics = await fetchAIAnalytics()
    return hasAnalytics
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

  const handleStartEvent = async () => {
    try {
      setActionLoading(true)
      const response = await eventAPI.startEvent(event.id)
      if (response && response.data) {
        toast.success(`Event "${event.title}" started successfully!`)
        fetchEventDetails() // Refresh event details
      }
    } catch (error) {
      console.error("Error starting event:", error)
      toast.error(`Failed to start event: ${error.message || "Unknown error"}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEndEvent = async () => {
    try {
      setActionLoading(true)
      const response = await eventAPI.endEvent(event.id)
      if (response && response.data) {
        toast.success(`Event "${event.title}" ended successfully!`)
        fetchEventDetails() // Refresh event details
      }
    } catch (error) {
      console.error("Error ending event:", error)
      toast.error(`Failed to end event: ${error.message || "Unknown error"}`)
    } finally {
      setActionLoading(false)
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
    if (tab === "feedbacks") {
      setFeedbackCurrentPage(1)
    }
  }

  const handleExportAttendance = async () => {
    try {
      const response = await attendanceAPI.exportAttendance("xlsx")

      if (response?.data) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "attendance_report.xlsx"
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

  const formatTimeWithoutSeconds = (timeStr) => {
    if (!timeStr) return ""
    return timeStr.slice(0, 5) // "09:00:00" → "09:00"
  }

  const handleEditClick = () => {
    console.log("Raw start_time:", event.start_time)
    console.log("Formatted start_time:", formatTime(event.start_time))
    setEditEvent({
      title: event.title || "",
      description: event.description || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      start_time: formatTimeWithoutSeconds(event.start_time) || "",
      end_time: formatTimeWithoutSeconds(event.end_time) || "",
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
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2 sm:w-1/4 mb-4 sm:mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shimmer-effect h-24 sm:h-32"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shimmer-effect"
                >
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-16 sm:h-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-shake">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Error Loading Event</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">{error}</p>
          <button
            onClick={() => navigate("/admin/events")}
            className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Event Not Found</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/events")}
            className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/events")}
                className="group flex items-center text-gray-600 hover:text-[#901b20] transition-all duration-300 transform hover:scale-105"
              >
                <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Events
              </button>
              <div className="h-6 border-l border-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#901b20] mb-2">{event.title}</h1>
                <p className="text-lg text-gray-600 font-medium">Event Details & Management</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {activeTab === "attendance" && (
                <button
                  onClick={handleExportAttendance}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <FaFileAlt className="w-4 h-4 relative" />
                  <span className="hidden sm:inline relative">Export</span>
                </button>
              )}

              {event.status?.toLowerCase() === "draft" && (
                <button
                  onClick={() => setShowPublishConfirmModal(true)}
                  disabled={actionLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none text-sm flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin relative" />
                  ) : (
                    <FaCalendarPlus className="w-4 h-4 relative" />
                  )}
                  <span className="hidden sm:inline relative">Publish</span>
                </button>
              )}

              {event.status?.toLowerCase() === "published" && (
                <button
                  onClick={() => setShowStartConfirmModal(true)}
                  disabled={actionLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none text-sm flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin relative" />
                  ) : (
                    <FaPlay className="w-4 h-4 relative" />
                  )}
                  <span className="hidden sm:inline relative">Start</span>
                </button>
              )}

              {event.status?.toLowerCase() === "ongoing" && (
                <button
                  onClick={() => setShowEndConfirmModal(true)}
                  disabled={actionLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none text-sm flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin relative" />
                  ) : (
                    <FaStop className="w-4 h-4 relative" />
                  )}
                  <span className="hidden sm:inline relative">End</span>
                </button>
              )}

              {event.status?.toLowerCase() === "completed" && (
                <button
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="group relative overflow-hidden bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none text-sm flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin relative" />
                  ) : (
                    <FaArchive className="w-4 h-4 relative" />
                  )}
                  <span className="hidden sm:inline relative">Archive</span>
                </button>
              )}

              <button
                onClick={handleEdit}
                disabled={actionLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-[#ad565a] to-[#cc9598] hover:from-[#8a4548] hover:to-[#ad565a] disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none text-sm flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <FaEdit className="w-4 h-4 relative" />
                <span className="hidden sm:inline relative">Edit</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none text-sm flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <FaTrash className="w-4 h-4 relative" />
                <span className="hidden sm:inline relative">Delete</span>
              </button>
            </div>
          </div>
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mb-8 animate-fade-in shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Data</h3>
                  <p className="text-red-700 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange("details")}
              className={`group py-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeTab === "details"
                  ? "border-[#901b20] text-[#901b20]"
                  : "border-transparent text-gray-500 hover:text-[#901b20] hover:border-[#901b20]/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === "details"
                    ? "bg-[#901b20] text-white"
                    : "bg-gray-200 text-gray-500 group-hover:bg-[#901b20]/10 group-hover:text-[#901b20]"
                }`}
              >
                <FaCalendarAlt className="w-4 h-4" />
              </div>
              Event Details
            </button>
            <button
              onClick={() => handleTabChange("attendance")}
              className={`group py-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeTab === "attendance"
                  ? "border-[#901b20] text-[#901b20]"
                  : "border-transparent text-gray-500 hover:text-[#901b20] hover:border-[#901b20]/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === "attendance"
                    ? "bg-[#901b20] text-white"
                    : "bg-gray-200 text-gray-500 group-hover:bg-[#901b20]/10 group-hover:text-[#901b20]"
                }`}
              >
                <FaUsers className="w-4 h-4" />
              </div>
              Attendance & Reports
              {attendanceData.length > 0 && (
                <span className="ml-1 bg-[#901b20] text-white px-2 py-1 rounded-full text-xs font-bold">
                  {attendanceData.length}
                </span>
              )}
            </button>
            {/* Show feedback tab for all events, not just completed ones */}
            <button
              onClick={() => handleTabChange("feedbacks")}
              className={`group py-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeTab === "feedbacks"
                  ? "border-[#901b20] text-[#901b20]"
                  : "border-transparent text-gray-500 hover:text-[#901b20] hover:border-[#901b20]/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === "feedbacks"
                    ? "bg-[#901b20] text-white"
                    : "bg-gray-200 text-gray-500 group-hover:bg-[#901b20]/10 group-hover:text-[#901b20]"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              Feedbacks
              {feedbackData?.responses?.data?.length > 0 && (
                <span className="ml-1 bg-[#901b20] text-white px-2 py-1 rounded-full text-xs font-bold">
                  {feedbackData.responses.data.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange("registrations")}
              className={`group py-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeTab === "registrations"
                  ? "border-[#901b20] text-[#901b20]"
                  : "border-transparent text-gray-500 hover:text-[#901b20] hover:border-[#901b20]/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === "registrations"
                    ? "bg-[#901b20] text-white"
                    : "bg-gray-200 text-gray-500 group-hover:bg-[#901b20]/10 group-hover:text-[#901b20]"
                }`}
              >
                <UserCheck className="w-4 h-4" />
              </div>
              Registrations
            </button>
            {event.type === "Job Fair" && (
              <button
                onClick={() => handleTabChange("companies")}
                className={`group py-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "companies"
                    ? "border-[#901b20] text-[#901b20]"
                    : "border-transparent text-gray-500 hover:text-[#901b20] hover:border-[#901b20]/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeTab === "companies"
                      ? "bg-[#901b20] text-white"
                      : "bg-gray-200 text-gray-500 group-hover:bg-[#901b20]/10 group-hover:text-[#901b20]"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                Participating Companies
              </button>
            )}
            {/* Add Live Queue tab for Job Fair events only */}
            {event.type === "Job Fair" && (
              <button
                onClick={() => handleTabChange("live-queue")}
                className={`group py-3 px-1 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "live-queue"
                    ? "border-[#901b20] text-[#901b20]"
                    : "border-transparent text-gray-500 hover:text-[#901b20] hover:border-[#901b20]/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeTab === "live-queue"
                      ? "bg-[#901b20] text-white"
                      : "bg-gray-200 text-gray-500 group-hover:bg-[#901b20]/10 group-hover:text-[#901b20]"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>
                Live Queue
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </button>
            )}
          </nav>
        </div>

        {activeTab === "details" && (
          <EventDetailsTab
            event={event}
            formatDate={formatDate}
            formatTime={formatTime}
            getStatusColor={getStatusColor}
          />
        )}

        {activeTab === "attendance" && <AttendanceTab event={event} formatDate={formatDate} />}

        {activeTab === "companies" && <ParticipatingCompaniesTabEnhanced event={event} />}

        {activeTab === "registrations" && <RegistrationsTabEnhanced event={event} />}

        {/* Add Live Queue Tab Content */}
        {activeTab === "live-queue" && event.type === "Job Fair" && <JobFairLiveQueue event={event} />}

        {/* Add the FeedbacksTab rendering */}
        {activeTab === "feedbacks" && (
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

        {/* Enhanced Edit Event Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fade-in">
            <div className="bg-white w-full max-w-6xl max-h-[98vh] sm:max-h-[95vh] rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-4 sm:p-6 lg:p-10 text-white overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-black/10"></div>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditEvent(null)
                    setEditImagePreview(null)
                    setEditError("")
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
                  style={{ minHeight: "44px", minWidth: "44px" }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </button>

                <div className="relative max-w-4xl pr-12 sm:pr-16 lg:pr-20">
                  <h1 className="text-xl sm:text-2xl lg:text-5xl font-black mb-1 sm:mb-2 lg:mb-3 leading-tight">
                    Edit Event
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-xl font-medium">{event.title}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 sm:p-6 lg:p-10">
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
          </div>
        )}

        {/* Start Event Confirmation Modal */}
        {showStartConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaPlay className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Start Event</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to start the event <strong>"{event.title}"</strong>? This will change its status
                to ongoing and participants will be able to join.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowStartConfirmModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowStartConfirmModal(false)
                    handleStartEvent()
                  }}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaPlay className="w-4 h-4" />}
                  Start Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End Event Confirmation Modal */}
        {showEndConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaStop className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">End Event</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to end the event <strong>"{event.title}"</strong>? This will change its status to
                completed and no new participants can join.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowEndConfirmModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEndConfirmModal(false)
                    handleEndEvent()
                  }}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaStop className="w-4 h-4" />}
                  End Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Publish Event Confirmation Modal */}
        {showPublishConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaCalendarPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Publish Event</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to publish the event <strong>"{event.title}"</strong>? This will make it visible
                to participants and allow registrations.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowPublishConfirmModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPublishConfirmModal(false)
                    handlePublish()
                  }}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaCalendarPlus className="w-4 h-4" />
                  )}
                  Publish Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced Event Details Tab Component
const EventDetailsTab = ({ event, formatDate, formatTime, getStatusColor }) => (
  <div className="space-y-6 sm:space-y-8 lg:space-y-12 animate-fade-in">
    {/* Enhanced Stats Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Event Type</p>
          <p className="text-3xl font-black text-[#901b20]">{event.type}</p>
        </div>
      </div>

      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
          <p className="text-3xl font-black text-[#203947] capitalize">{event.status || "Draft"}</p>
        </div>
      </div>

      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ad565a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ad565a] to-[#cc9598] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</p>
          <p className="text-lg font-black text-[#ad565a] truncate">{event.location}</p>
        </div>
      </div>

      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#cc9598]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#cc9598] to-[#901b20] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Created By</p>
          <p className="text-lg font-black text-[#cc9598]">User #{event.created_by}</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Enhanced Event Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
          {event.banner_image && (
            <div className="mb-8">
              <img
                src={
                  event.banner_image.startsWith("http")
                    ? event.banner_image
                    : `http://127.0.0.1:8000${event.banner_image}`
                }
                alt={event.title}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-black text-[#203947] mb-4 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center bg-[#901b20]/10 px-3 py-2 rounded-xl">
                  <FaCalendarAlt className="w-4 h-4 mr-2 text-[#901b20]" />
                  {event.type}
                </span>
                <span className="flex items-center bg-[#203947]/10 px-3 py-2 rounded-xl">
                  <FaUsers className="w-4 h-4 mr-2 text-[#203947]" />
                  Created by User #{event.created_by}
                </span>
              </div>
            </div>

            <div
              className={`px-6 py-3 rounded-2xl text-lg font-bold border-2 shadow-lg ${getStatusColor(event.status)}`}
            >
              {event.status || "Draft"}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#901b20] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              Description
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{event.description}</div>
          </div>
        </div>

        {/* Enhanced Additional Details */}
        {event.slido_embed_url && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ad565a] to-[#cc9598] rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Interactive Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.slido_embed_url && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Slido Embed URL</h4>
                  <a
                    href={event.slido_embed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all font-medium transition-colors duration-300"
                  >
                    {event.slido_embed_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Sidebar */}
      <div className="space-y-6">
        {/* Enhanced Event Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="w-4 h-4 text-white" />
            </div>
            Event Information
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#901b20]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaCalendarAlt className="w-5 h-5 text-[#901b20]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Start Date</p>
                <p className="text-gray-600 font-medium">{formatDate(event.start_date)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#203947]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaCalendarAlt className="w-5 h-5 text-[#203947]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">End Date</p>
                <p className="text-gray-600 font-medium">{formatDate(event.end_date)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#ad565a]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaClock className="w-5 h-5 text-[#ad565a]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Time</p>
                <p className="text-gray-600 font-medium">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#cc9598]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="w-5 h-5 text-[#cc9598]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Location</p>
                <p className="text-gray-600 font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                {event.visibility_type === "all" ? (
                  <FaGlobe className="w-5 h-5 text-gray-600" />
                ) : (
                  <FaLock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Visibility</p>
                <p className="text-gray-600 font-medium">{event.visibility_type === "all" ? "Public" : "Restricted"}</p>
              </div>
            </div>

            {event.registration_deadline && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaClock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Registration Deadline</p>
                  <p className="text-gray-600 font-medium">{formatDate(event.registration_deadline)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Timestamps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            Timestamps
          </h3>
          <div className="space-y-4 text-sm">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="font-bold text-green-800 text-base">Created</p>
              <p className="text-green-600 font-medium">{new Date(event.created_at).toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="font-bold text-blue-800 text-base">Last Updated</p>
              <p className="text-blue-600 font-medium">{new Date(event.updated_at).toLocaleString()}</p>
            </div>
            {event.archived_at && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-bold text-gray-800 text-base">Archived</p>
                <p className="text-gray-600 font-medium">{new Date(event.archived_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)

const AttendanceTab = ({ event, formatDate }) => {
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const attendeesPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await attendanceAPI.getReports()
        const allEvents = response?.data?.data?.result || []

        const normalize = (str) => str?.trim().toLowerCase().replace(/\s+/g, " ")
        const matchedEvent = allEvents.find((e) => normalize(e.event) === normalize(event.title))

        if (matchedEvent) {
          const attendees = matchedEvent.attendees.map((a) => ({
            ...a,
            date: new Date(matchedEvent.event_date).toLocaleDateString(),
          }))
          setAttendanceData(attendees)
        } else {
          setAttendanceData([])
          console.warn("No matched event found for:", event.title)
        }
      } catch (err) {
        console.error("Failed to load attendance data", err)
        toast.error("Failed to load attendance data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [event.title])

  // Filtering
  const filteredAttendees = attendanceData.filter((attendee) => {
    const search = searchTerm.toLowerCase()
    return (
      attendee.name?.toLowerCase().includes(search) ||
      attendee.email?.toLowerCase().includes(search) ||
      attendee.phone?.toLowerCase().includes(search)
    )
  })

  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage)
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * attendeesPerPage,
    currentPage * attendeesPerPage,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ClipLoader size={40} color="#3B82F6" />
        <p className="mt-4 text-gray-600">Loading attendance data...</p>
      </div>
    )
  }

  return (
    <AttendanceTableEnhanced
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
  )
}

// Enhanced Feedbacks Tab Component
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
  const handleShowAIAnalytics = async () => {
    await fetchAIAnalytics()
    setShowAIAnalyticsModal(true)
  }

  const handleGenerateAIAnalytics = async () => {
    const success = await generateAIAnalytics()
    // aiAnalytics state will be updated by generateAIAnalytics calling fetchAIAnalytics
  }

  if (feedbackLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ClipLoader size={40} color="#901b20" />
          <p className="mt-4 text-gray-600 font-medium">Loading feedback data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12 animate-fade-in">
      {/* Enhanced Event Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-2xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          Feedback Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Total Responses</p>
                <p className="text-lg font-black text-blue-900">{feedbackData?.total_responses || 0}</p>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-600 uppercase tracking-wider">Average Rating</p>
                <p className="text-lg font-black text-green-900">
                  {feedbackData?.average_rating ? Number(feedbackData.average_rating).toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-600 uppercase tracking-wider">Event Date</p>
                <p className="text-lg font-black text-purple-900">{formatDate(event.start_date)}</p>
              </div>
            </div>
          </div>
          <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-wider">AI Analytics</p>
                <p className="text-lg font-black text-orange-900">{aiAnalytics ? "Available" : "Not Generated"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Feedback Form */}
      {!feedbackData && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="text-center py-20">
            <div className="text-gray-300 mb-8 animate-float">
              <MessageSquare className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Feedback Form Available</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Create a feedback form to collect participant responses for this event.
            </p>
            <button
              onClick={() => setShowCreateFeedbackModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 mx-auto"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 relative" />
              <span className="relative">Create Feedback Form</span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback Responses */}
      {feedbackData && (
        <>
          {/* Enhanced Action Buttons - Fixed Logic */}
          <div className="flex flex-wrap gap-4 justify-end">
            {feedbackData.responses?.data?.length > 0 && (
              <>
                {aiAnalytics ? (
                  <button
                    onClick={handleShowAIAnalytics}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <BarChart3 className="w-5 h-5 relative" />
                    <span className="relative">Show AI Analytics</span>
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateAIAnalytics}
                    disabled={generatingAnalytics}
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none flex items-center gap-3"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    {generatingAnalytics ? (
                      <Loader2 className="w-5 h-5 animate-spin relative" />
                    ) : (
                      <Brain className="w-5 h-5 relative" />
                    )}
                    <span className="relative">{generatingAnalytics ? "Generating..." : "Generate AI Analytics"}</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Enhanced Feedback Form Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              {feedbackData.form?.title}
            </h3>
            {feedbackData.form?.description && (
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{feedbackData.form.description}</p>
            )}
            <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 font-medium">
              Form created: {new Date(feedbackData.form?.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Enhanced Responses List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="px-8 py-6 border-b bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                Feedback Responses ({feedbackData.responses?.data?.length || 0} of {feedbackPagination.total})
              </h2>
            </div>

            {!feedbackData.responses?.data?.length ? (
              <div className="text-center py-20">
                <div className="text-gray-300 mb-8 animate-float">
                  <MessageSquare className="w-24 h-24 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Responses Yet</h3>
                <p className="text-gray-600 text-lg">Participants haven't submitted feedback responses yet.</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {feedbackData.responses.data.map((response, index) => {
                    const responses = JSON.parse(response.responses)
                    return (
                      <div key={response.id} className="p-8 hover:bg-gray-50 transition-colors duration-300">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">
                                {response.user?.first_name} {response.user?.last_name}
                              </h4>
                              <p className="text-sm text-gray-600 font-medium">{response.user?.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-lg font-bold text-gray-900">{response.overall_rating}/5</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(response.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(responses).map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                              <p className="text-sm font-bold text-gray-700 mb-2 capitalize">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm text-gray-900 font-medium">
                                {typeof value === "number" && key.includes("rating") ? `${value}/5` : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Enhanced Pagination */}
                {feedbackPagination.last_page > 1 && (
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-b-2xl p-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div className="text-lg text-gray-600 font-medium text-center sm:text-left">
                        Showing <span className="font-bold text-[#901b20]">{feedbackPagination.from}</span> to{" "}
                        <span className="font-bold text-[#901b20]">{feedbackPagination.to}</span> of{" "}
                        <span className="font-bold text-[#901b20]">{feedbackPagination.total}</span> responses
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleFeedbackPageChange(feedbackCurrentPage - 1)}
                          disabled={feedbackCurrentPage === 1}
                          className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${
                            feedbackCurrentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                              : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                          }`}
                        >
                          Previous
                        </button>

                        <div className="flex space-x-2">
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
                                className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${
                                  feedbackCurrentPage === pageNum
                                    ? "bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white border-[#901b20] shadow-lg transform scale-110"
                                    : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
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
                          className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${
                            feedbackCurrentPage === feedbackPagination.last_page
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                              : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Enhanced Create Feedback Modal */}
      {showCreateFeedbackModal && (
        <CreateFeedbackModal
          onClose={() => setShowCreateFeedbackModal(false)}
          onSubmit={createFeedbackForm}
          loading={creatingFeedbackForm}
        />
      )}

      {/* Enhanced AI Analytics Modal */}
      {showAIAnalyticsModal && aiAnalytics && (
        <AIAnalyticsModal analytics={aiAnalytics} onClose={() => setShowAIAnalyticsModal(false)} />
      )}
    </div>
  )
}

// Enhanced Create Feedback Modal Component
const CreateFeedbackModal = ({ onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "Event Feedback",
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

  const [error, setError] = useState("")

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
      setError("Form title is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Form description is required")
      return false
    }

    // Validate all questions have content
    for (let i = 0; i < formData.form_config.length; i++) {
      if (!formData.form_config[i].question.trim()) {
        setError(`Question ${i + 1} cannot be empty`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    const success = await onSubmit(formData)
    if (success) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
        <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-4 sm:p-6 lg:p-10 text-white overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>

          <div className="relative max-w-4xl pr-12 sm:pr-16 lg:pr-20">
            <h1 className="text-xl sm:text-2xl lg:text-5xl font-black mb-1 sm:mb-2 lg:mb-3 leading-tight">
              Create Feedback Form
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-xl font-medium">
              Design a feedback form to collect participant responses
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 animate-fade-in">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Form Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
                    placeholder="Enter form title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Form Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 resize-none text-lg font-medium"
                    placeholder="Enter form description"
                    required
                  />
                </div>
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Questions</h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-[#901b20] hover:bg-[#7a1619] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.form_config.map((question, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#901b20]/30 transition-colors duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500">
                              Question {index + 1}
                              {index < 4 && <span className="text-[#901b20]"> (Required)</span>}
                            </span>
                          </div>

                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                            disabled={index < 4} // Static questions can't be edited
                            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium ${
                              index < 4 ? "bg-gray-50 cursor-not-allowed" : ""
                            }`}
                            placeholder="Enter question"
                          />

                          <div className="relative">
                            <select
                              value={question.type}
                              onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                              disabled={index < 4} // Static question types can't be changed
                              className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 appearance-none text-lg font-medium ${
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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none flex items-center gap-3"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin relative" />
                  ) : (
                    <CheckCircle className="w-5 h-5 relative" />
                  )}
                  <span className="relative">{loading ? "Creating..." : "Create Form"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced AI Analytics Modal Component
const AIAnalyticsModal = ({ analytics, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
        <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-4 sm:p-6 lg:p-10 text-white overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>

          <div className="relative max-w-4xl pr-12 sm:pr-16 lg:pr-20">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-6 py-3 bg-white/20 rounded-full text-lg font-bold backdrop-blur-sm flex items-center gap-3">
                <Star className="w-5 h-5" />
                {analytics.insights.satisfaction_score}/5
              </span>
              <span className="px-6 py-3 bg-white/20 rounded-full text-lg font-bold backdrop-blur-sm">
                {analytics.feedback_count} responses
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-5xl font-black mb-1 sm:mb-2 lg:mb-3 leading-tight">
              AI Analytics Report
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-xl font-medium">
              Generated {new Date(analytics.generated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10">
            <div className="space-y-8">
              {/* Executive Summary */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Brain className="w-7 h-7 text-[#901b20]" />
                  Executive Summary
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {analytics.insights.analysis.summary || "No summary available"}
                </p>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-[#203947]" />
                  Sentiment Analysis
                </h3>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-blue-800 font-medium text-lg leading-relaxed">
                    {analytics.insights.analysis.sentiment_analysis || "Sentiment analysis not available"}
                  </p>
                </div>
              </div>

              {/* Detailed Insights - Check if insights exist and have analysis */}
              {analytics.insights && analytics.insights.analysis && (
                <div className="space-y-6">
                  {/* Key Strengths */}
                  {analytics.insights.analysis.key_strengths &&
                    analytics.insights.analysis.key_strengths.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          Key Strengths
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analytics.insights.analysis.key_strengths.map((strength, index) => (
                            <div
                              key={index}
                              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-green-800 font-medium text-base leading-relaxed">{strength}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Areas for Improvement */}
                  {analytics.insights.analysis.areas_for_improvement &&
                    analytics.insights.analysis.areas_for_improvement.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <AlertCircle className="w-6 h-6 text-yellow-600" />
                          Areas for Improvement
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analytics.insights.analysis.areas_for_improvement.map((area, index) => (
                            <div
                              key={index}
                              className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-yellow-800 font-medium text-base leading-relaxed">{area}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Recommendations */}
                  {analytics.insights.analysis.recommendations &&
                    analytics.insights.analysis.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <Lightbulb className="w-6 h-6 text-[#901b20]" />
                          AI Recommendations
                        </h3>
                        <div className="space-y-4">
                          {analytics.insights.analysis.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                                rec.priority === "high"
                                  ? "bg-red-50 border-red-200"
                                  : rec.priority === "medium"
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                                    rec.priority === "high"
                                      ? "bg-red-500 text-white"
                                      : rec.priority === "medium"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-500 text-white"
                                  }`}
                                >
                                  {rec.priority}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{rec.action}</h4>
                                  <p className="text-gray-600 text-base leading-relaxed">{rec.impact}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Common Themes */}
                  {analytics.insights.analysis.common_themes &&
                    analytics.insights.analysis.common_themes.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <MessageSquare className="w-6 h-6 text-[#203947]" />
                          Common Themes
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {analytics.insights.analysis.common_themes.map((theme, index) => (
                            <div
                              key={index}
                              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#203947] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-[#203947] font-medium text-base leading-relaxed">{theme}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Additional Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Attendance Insights */}
                {analytics.insights &&
                  analytics.insights.analysis &&
                  analytics.insights.analysis.attendance_insights && (
                    <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                        <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ad565a] flex-shrink-0" />
                        <span className="leading-tight">Attendance Insights</span>
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
                        {analytics.insights.analysis.attendance_insights}
                      </p>
                    </div>
                  )}

                {/* Technical Feedback */}
                {analytics.insights &&
                  analytics.insights.analysis &&
                  analytics.insights.analysis.technical_feedback && (
                    <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#cc9598] flex-shrink-0" />
                        <span className="leading-tight">Technical Feedback</span>
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
                        {analytics.insights.analysis.technical_feedback}
                      </p>
                    </div>
                  )}
              </div>

              {/* Fallback message if no detailed insights are available */}
              {(!analytics.insights || !analytics.insights.analysis) && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">Limited Analytics Available</h3>
                  <p className="text-yellow-700 leading-relaxed">
                    Some detailed insights may not be available for this event. The AI analysis is based on the
                    available feedback data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsEnhanced
