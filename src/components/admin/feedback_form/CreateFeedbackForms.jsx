"use client"

import { getFriendlyErrorMessage } from "../../../utils/errorMessages"
import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  FileText,
  ChevronDown,
  Filter,
  Users,
  Building2,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const CreateFeedbackForms = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
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

  const ADMIN_TOKEN = localStorage.getItem("token")
  const navigate = useNavigate()

  const questionTypes = [
    { value: "text", label: "Text Answer" },
    { value: "rating", label: "Rating (1-5)" },
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  const fetchCompletedEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8000/api/events?filter[status]=completed", {
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
        // Filter only events without feedback forms
        const eventsWithoutForms = data.data.result.data.filter((event) => !event.has_feedback_form)
        setEvents(eventsWithoutForms || [])
      } else {
        throw new Error(data.message || "Failed to fetch events")
      }
    } catch (err) {
      setError(err.message || "Error loading events")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletedEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === "all" || event.type === selectedType

      return matchesSearch && matchesType
    })
  }, [events, searchTerm, selectedType])

  const eventTypes = useMemo(() => {
    const types = [...new Set(events.map((event) => event.type))]
    return types.sort()
  }, [events])

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
    if (!selectedEvent) {
      setError("Please select an event")
      return false
    }
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

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:8000/api/feedback/events/${selectedEvent}/forms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data) {
        // Success - reset form and refresh events
        setSelectedEvent("")
        setFormData({
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
        setShowConfirmModal(false)
        // Refresh events to remove the one we just created a form for
        await fetchCompletedEvents()
      } else {
        throw new Error("Failed to create feedback form")
      }
    } catch (err) {
      setError(err.message || "Error creating feedback form")
      console.error("Error creating form:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "Job Fair":
        return Building2
      case "Tech":
        return Zap
      case "Fun":
        return Users
      default:
        return Calendar
    }
  }

  const selectedEventData = events.find((e) => e.id.toString() === selectedEvent)

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !events.length) {
    const message = getFriendlyErrorMessage(error)
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-lg">
          <div className="text-red-500 mb-6">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Events</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#901b20] mb-2">Create Feedback Forms</h1>
              <p className="text-lg text-gray-600">Create custom feedback forms for completed events</p>
            </div>
            <button
              onClick={fetchCompletedEvents}
              disabled={loading}
              className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              <div className="flex items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                <span>{loading ? "Loading..." : "Refresh"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Events</p>
            <p className="text-3xl font-bold text-[#901b20]">{events.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Need Forms</p>
            <p className="text-3xl font-bold text-green-600">{filteredEvents.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Job Fairs</p>
            <p className="text-3xl font-bold text-[#203947]">{events.filter((e) => e.type === "Job Fair").length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tech Events</p>
            <p className="text-3xl font-bold text-orange-600">{events.filter((e) => e.type === "Tech").length}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by event title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-base font-medium placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium cursor-pointer hover:border-[#901b20]/50"
                  style={{ backgroundImage: "none" }}
                >
                  <option value="all">All Event Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-lg mb-8">
            <div className="text-gray-300 mb-8">
              <FileText className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {events.length === 0 ? "No Events Need Feedback Forms" : "No Events Match Your Filters"}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {events.length === 0
                ? "All completed events already have feedback forms created."
                : searchTerm || selectedType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No events found."}
            </p>
            {events.length === 0 && (
              <button
                onClick={fetchCompletedEvents}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Refresh Events
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredEvents.map((event) => {
              const EventIcon = getEventTypeIcon(event.type)
              const isSelected = selectedEvent === event.id.toString()

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id.toString())}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden ${
                    isSelected ? "ring-4 ring-[#901b20]/20 border-2 border-[#901b20]" : "border border-gray-100"
                  }`}
                >
                  {/* Event Header */}
                  <div className="h-48 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <EventIcon className="w-20 h-20 text-white opacity-30" />
                    </div>

                    {/* Event Type Badge */}
                    <div className="absolute top-6 right-6">
                      <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur-sm">
                        {event.type}
                      </span>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-6 left-6">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-[#901b20]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 h-14">{event.title}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 bg-[#901b20]/10 rounded-xl flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 text-[#901b20]" />
                        </div>
                        <span className="font-medium">
                          {formatDate(event.start_date)} - {formatDate(event.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 bg-[#203947]/10 rounded-xl flex items-center justify-center mr-3">
                          <Clock className="w-5 h-5 text-[#203947]" />
                        </div>
                        <span className="font-medium">
                          {event.start_time} - {event.end_time}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <div className="w-10 h-10 bg-[#ad565a]/10 rounded-xl flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-[#ad565a]" />
                        </div>
                        <span className="font-medium line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 text-sm line-clamp-3">{event.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Form Builder - Only show when event is selected */}
        {selectedEvent && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#901b20]" />
              Form Configuration
            </h2>

            {/* Form Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Form Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300"
                  placeholder="Enter form title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Form Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 resize-none"
                  placeholder="Enter form description"
                />
              </div>
            </div>

            {/* Questions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Questions</h3>
                <button
                  onClick={handleAddQuestion}
                  className="bg-[#901b20] hover:bg-[#7a1619] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Question
                </button>
              </div>

              <div className="space-y-6">
                {formData.form_config.map((question, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-6">
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
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 ${
                            index < 4 ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                          placeholder="Enter question"
                        />

                        <div className="relative">
                          <select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                            disabled={index < 4} // Static question types can't be changed
                            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 appearance-none ${
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

            {/* Submit Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!selectedEvent || submitting}
              className="w-full bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                <Save className="w-6 h-6" />
                Create Feedback Form
              </div>
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedEventData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#901b20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-[#901b20]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Confirm Form Creation</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to create this feedback form for "{selectedEventData.title}"? This action will
                  make the form available for participants.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      {submitting ? "Creating..." : "Confirm"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateFeedbackForms
