"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
} from "react-icons/fa"
import { toast } from "react-toastify"
import { eventAPI } from "../../services/api"
import { ClipLoader } from "react-spinners"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

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

  const handlePublish = async () => {
    try {
      setActionLoading(true)
      await eventAPI.publish(event.id)
      toast.success(`Event "${event.title}" published successfully!`)
      fetchEventDetails() // Refresh data
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
      fetchEventDetails() // Refresh data
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

    // Handle HH:MM:SS format
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/events")}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {event.status?.toLowerCase() === "draft" && (
                <button
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  <FaCalendarPlus className="w-4 h-4 mr-2" />
                  Publish
                </button>
              )}

              {event.status?.toLowerCase() === "completed" && (
                <button
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                  <FaArchive className="w-4 h-4 mr-2" />
                  Archive
                </button>
              )}

              <button
                onClick={handleEdit}
                disabled={actionLoading}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                <FaTrash className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                        className="text-blue-500 hover:text-blue-700 underline"
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
                  <FaCalendarAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Start Date</p>
                    <p className="text-gray-600">{formatDate(event.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FaCalendarAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">End Date</p>
                    <p className="text-gray-600">{formatDate(event.end_date)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FaClock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-gray-600">
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  {event.visibility_type === "all" ? (
                    <FaGlobe className="w-5 h-5 text-gray-400 mt-0.5" />
                  ) : (
                    <FaLock className="w-5 h-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Visibility</p>
                    <p className="text-gray-600">{event.visibility_type === "all" ? "Public" : "Restricted"}</p>
                  </div>
                </div>

                {event.registration_deadline && (
                  <div className="flex items-start space-x-3">
                    <FaClock className="w-5 h-5 text-gray-400 mt-0.5" />
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
      </div>
    </div>
  )
}

export default EventDetails
