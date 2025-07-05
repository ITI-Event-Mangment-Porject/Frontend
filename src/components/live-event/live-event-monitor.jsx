"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  User,
  QrCode,
  ExternalLink,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"

const LiveEventMonitor = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState("")
  const [actionError, setActionError] = useState("")
  const itemsPerPage = 6 // Declare itemsPerPage variable

  // Static admin token as provided
  const ADMIN_TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTE3MzgwNzIsImV4cCI6MTc1MTc0MTY3MiwibmJmIjoxNzUxNzM4MDcyLCJqdGkiOiJuZUtrTkpFZHhrTmZqcHp4Iiwic3ViIjoiMTU3IiwicHJ2IjoiMTNlOGQwMjhiMzkxZjNiN2I2M2YyMTkzM2RiYWQ0NThmZjIxMDcyZSJ9.Xk3SbhDhMZlpvtN9899sbjARBb6I1SXh_04ssVZpBI4"

  // Add this function before the useEffect
  const fetchAllActiveEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      let allActiveEvents = []
      let currentPage = 1
      let totalPages = 1

      // Fetch all pages to get complete data
      do {
        const response = await fetch(`http://127.0.0.1:8000/api/events?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          // Filter for only ongoing and published events from this page
          const activeEventsFromPage = data.data.result.data.filter(
            (event) => event.status === "published" || event.status === "ongoing",
          )

          allActiveEvents = [...allActiveEvents, ...activeEventsFromPage]
          totalPages = data.data.result.last_page
          currentPage++
        } else {
          throw new Error(data.message || "Failed to fetch events")
        }
      } while (currentPage <= totalPages)

      // Sort events by created date (newest first) and then by status (ongoing first)
      allActiveEvents.sort((a, b) => {
        // First sort by status - ongoing events first
        if (a.status === "ongoing" && b.status !== "ongoing") return -1
        if (b.status === "ongoing" && a.status !== "ongoing") return 1

        // Then sort by start date (upcoming events first)
        const dateA = new Date(a.start_date)
        const dateB = new Date(b.start_date)
        return dateA - dateB
      })

      setEvents(allActiveEvents)
      setTotalEvents(allActiveEvents.length)
    } catch (err) {
      setError(err.message || "Error loading events")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  // Replace the existing useEffect with this:
  useEffect(() => {
    fetchAllActiveEvents()
  }, []) // Remove currentPage dependency since we're fetching all pages

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === "all" || event.type === selectedType

      return matchesSearch && matchesType
    })
  }, [events, searchTerm, selectedType])

  // Update the pagination logic - replace the existing paginatedEvents useMemo:
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredEvents, currentPage])

  // Update totalFilteredPages calculation:
  const totalFilteredPages = Math.ceil(filteredEvents.length / itemsPerPage)

  // Add a refresh function for manual refresh:
  const handleRefresh = () => {
    setCurrentPage(1) // Reset to first page
    fetchAllActiveEvents()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200"
      case "published":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Job Fair":
        return "bg-[#901b20] text-white"
      case "Tech":
        return "bg-[#203947] text-white"
      case "Fun":
        return "bg-[#ad565a] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
    setActionSuccess("")
    setActionError("")
  }

  const handleStartEvent = async () => {
    if (!selectedEvent) return

    setActionLoading(true)
    setActionError("")
    setActionSuccess("")

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/test/live/events/${selectedEvent.id}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Update the event status in the local state
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === selectedEvent.id ? { ...event, status: "ongoing" } : event)),
        )
        setSelectedEvent((prev) => ({ ...prev, status: "ongoing" }))
        setActionSuccess("Event started successfully! 🎉")
      } else {
        setActionError(data.message || "Failed to start event")
      }
    } catch (error) {
      console.error("Error starting event:", error)
      setActionError("Network error occurred while starting the event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEndEvent = async () => {
    if (!selectedEvent) return

    setActionLoading(true)
    setActionError("")
    setActionSuccess("")

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/test/live/events/${selectedEvent.id}/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        // Remove the event from active events since it's now completed
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id))
        setActionSuccess("Event ended successfully! The event has been completed.")

        // Close modal after a short delay
        setTimeout(() => {
          setIsModalOpen(false)
        }, 2000)
      } else {
        setActionError(data.message || "Failed to end event")
      }
    } catch (error) {
      console.error("Error ending event:", error)
      setActionError("Network error occurred while ending the event")
    } finally {
      setActionLoading(false)
    }
  }

  const canStartEvent = (event) => {
    return event.status === "published"
  }

  const canEndEvent = (event) => {
    return event.status === "ongoing"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
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
      <div className="min-h-screen bg-[#ebebeb] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg p-6 text-center shadow-lg">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Events</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#901b20] hover:bg-[#7a1619] text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Update to include refresh button */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-[#203947]">Live Event Monitor</h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-[#901b20] hover:bg-[#7a1619] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
          <p className="text-gray-600">Monitor and manage all active events in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Stats Cards - Update the first card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active Events</p>
                <p className="text-2xl font-bold text-[#203947]">{events.length}</p>
              </div>
              <Eye className="w-8 h-8 text-[#901b20]" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ongoing Events</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredEvents.filter((e) => e.status === "ongoing").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Job Fairs</p>
                <p className="text-2xl font-bold text-[#901b20]">
                  {filteredEvents.filter((e) => e.type === "Job Fair").length}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#901b20]" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tech Events</p>
                <p className="text-2xl font-bold text-[#203947]">
                  {filteredEvents.filter((e) => e.type === "Tech").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-[#203947] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="Job Fair">Job Fair</option>
                  <option value="Tech">Tech</option>
                  <option value="Fun">Fun</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {/* Update the no events message */}
        {paginatedEvents.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {events.length === 0 ? "No Active Events Found" : "No Events Match Your Filters"}
            </h3>
            <p className="text-gray-600 mb-4">
              {events.length === 0
                ? "There are no published or ongoing events at the moment."
                : searchTerm || selectedType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No events found."}
            </p>
            {events.length === 0 && (
              <button
                onClick={handleRefresh}
                className="bg-[#901b20] hover:bg-[#7a1619] text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh Events
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  {/* Event Banner */}
                  <div className="h-48 bg-gradient-to-r from-[#901b20] to-[#ad565a] relative">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}
                      >
                        {event.status === "ongoing" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse inline-block"></div>
                        )}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>

                    {/* Event Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#203947] mb-3 line-clamp-2">{event.title}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-[#901b20]" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-[#901b20]" />
                        <span>
                          {formatDate(event.start_date)}
                          {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-[#901b20]" />
                        <span>
                          {formatTime(event.start_time)} - {formatTime(event.end_time)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500">
                        Created by {event.creator.first_name} {event.creator.last_name}
                      </div>

                      <button
                        onClick={() => handleViewDetails(event)}
                        className="bg-[#901b20] hover:bg-[#7a1619] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, totalFilteredPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm rounded-lg ${
                              currentPage === pageNum
                                ? "bg-[#901b20] text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages))}
                      disabled={currentPage === totalFilteredPages}
                      className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enhanced Event Details Modal */}
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden animate-modal-in">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#901b20] to-[#ad565a] p-8 text-white">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(selectedEvent.type)}`}>
                      {selectedEvent.type}
                    </span>
                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium flex items-center gap-2">
                      {selectedEvent.status === "ongoing" && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                      {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{selectedEvent.title}</h1>
                  <p className="text-white/80 text-lg">Event ID: #{selectedEvent.id}</p>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-280px)]">
                <div className="p-8">
                  {/* Action Status Messages */}
                  {(actionSuccess || actionError) && (
                    <div className="mb-6">
                      {actionSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800 font-medium">{actionSuccess}</span>
                        </div>
                      )}
                      {actionError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-800 font-medium">{actionError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <MapPin className="w-8 h-8 text-[#901b20] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-600 text-sm">{selectedEvent.location}</p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <Calendar className="w-8 h-8 text-[#203947] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Date</h3>
                      <p className="text-gray-600 text-sm">
                        {formatDate(selectedEvent.start_date)}
                        {selectedEvent.start_date !== selectedEvent.end_date && (
                          <span className="block">to {formatDate(selectedEvent.end_date)}</span>
                        )}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <Clock className="w-8 h-8 text-[#ad565a] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Time</h3>
                      <p className="text-gray-600 text-sm">
                        {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <User className="w-8 h-8 text-[#cc9598] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Created By</h3>
                      <p className="text-gray-600 text-sm">
                        {selectedEvent.creator.first_name} {selectedEvent.creator.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description */}
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                      </div>

                      {/* Interactive Features */}
                      {(selectedEvent.slido_qr_code || selectedEvent.slido_embed_url) && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Features</h3>
                          <div className="space-y-4">
                            {selectedEvent.slido_qr_code && (
                              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <QrCode className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">QR Code Access</h4>
                                    <p className="text-sm text-gray-600">Scan to join interactive session</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => window.open(selectedEvent.slido_qr_code, "_blank")}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                  View QR
                                </button>
                              </div>
                            )}

                            {selectedEvent.slido_embed_url && (
                              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                    <ExternalLink className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">Slido Integration</h4>
                                    <p className="text-sm text-gray-600">Join live Q&A and polls</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => window.open(selectedEvent.slido_embed_url, "_blank")}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                  Open Slido
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Event Settings */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Event Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Visibility</label>
                            <p className="text-gray-900 capitalize">
                              {selectedEvent.visibility_type.replace("_", " ")}
                            </p>
                          </div>

                          {selectedEvent.registration_deadline && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Deadline</label>
                              <p className="text-gray-900">
                                {new Date(selectedEvent.registration_deadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium text-gray-500">Event Slug</label>
                            <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {selectedEvent.slug}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                            <div>
                              <p className="font-medium text-gray-900">Created</p>
                              <p className="text-sm text-gray-600">
                                {new Date(selectedEvent.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                            <div>
                              <p className="font-medium text-gray-900">Last Updated</p>
                              <p className="text-sm text-gray-600">
                                {new Date(selectedEvent.updated_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Footer Actions */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {canStartEvent(selectedEvent) && "Ready to start this event"}
                    {canEndEvent(selectedEvent) && "Event is currently running"}
                    {!canStartEvent(selectedEvent) &&
                      !canEndEvent(selectedEvent) &&
                      "No actions available for this event"}
                  </div>

                  <div className="flex gap-3">
                    {canStartEvent(selectedEvent) && (
                      <button
                        onClick={handleStartEvent}
                        disabled={actionLoading}
                        className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 text-base font-medium rounded-lg transition-colors"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-5 h-5 mr-2" />
                        )}
                        {actionLoading ? "Starting..." : "Start Event"}
                      </button>
                    )}

                    {canEndEvent(selectedEvent) && (
                      <button
                        onClick={handleEndEvent}
                        disabled={actionLoading}
                        className="flex items-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-8 py-3 text-base font-medium rounded-lg transition-colors"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Square className="w-5 h-5 mr-2" />
                        )}
                        {actionLoading ? "Ending..." : "End Event"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveEventMonitor
