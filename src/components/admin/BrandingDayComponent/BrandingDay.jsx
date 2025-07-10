"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Users,
  Building2,
  Phone,
  User,
  Save,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Edit3,
  X,
  Plus,
} from "lucide-react"

const BrandingDay = () => {
  const [candidates, setCandidates] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [editingSlot, setEditingSlot] = useState(null)
  const [deletingSlot, setDeletingSlot] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState("")
  const [actionError, setActionError] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [userRole, setUserRole] = useState(null)
  const [accessDenied, setAccessDenied] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    branding_day_date: "2025-06-25",
    slots: [],
  })

  const BASE_URL = "http://127.0.0.1:8000/api"

  // Authentication check
  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (!storedRole || !storedUser || !storedToken) {
      setAccessDenied(true)
      setLoading(false)
      return
    }

    if (storedRole !== "admin") {
      setAccessDenied(true)
      setLoading(false)
      return
    }

    setUserRole(storedRole)
  }, [])

  // Fetch data when authenticated
  useEffect(() => {
    if (userRole === "admin") {
      fetchData()
    }
  }, [userRole])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (userRole !== "admin") return

    const interval = setInterval(
      () => {
        fetchData()
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [userRole])

  // Auto-hide success/error messages
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [actionSuccess])

  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [actionError])

  const fetchData = async () => {
    try {
      setLoading(true)
      setActionError("")
      const token = localStorage.getItem("token")

      if (!token) {
        setAccessDenied(true)
        return
      }

      // Fetch candidates
      const candidatesResponse = await fetch(`${BASE_URL}/job-fairs/1/branding-day/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!candidatesResponse.ok) {
        throw new Error(`HTTP error! status: ${candidatesResponse.status}`)
      }

      const candidatesData = await candidatesResponse.json()

      // Fetch schedule
      const scheduleResponse = await fetch(`${BASE_URL}/job-fairs/1/branding-day/schedule`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!scheduleResponse.ok) {
        throw new Error(`HTTP error! status: ${scheduleResponse.status}`)
      }

      const scheduleData = await scheduleResponse.json()

      if (candidatesData.success) {
        setCandidates(candidatesData.data.result || [])
      }

      if (scheduleData.success) {
        // Merge speaker data from candidates into schedule
        const scheduleWithSpeakers = scheduleData.data.result.map((slot) => {
          const candidate = candidatesData.data.result.find((c) => c.company_id === slot.company_id)
          return {
            ...slot,
            speaker: candidate?.speaker || null,
          }
        })
        setSchedule(scheduleWithSpeakers || [])
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching data:", error)
      setActionError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get unscheduled companies
  const unscheduledCandidates = candidates.filter(
    (candidate) =>
      !schedule.some((slot) => slot.company_id === candidate.company_id) &&
      candidate.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleScheduleCompany = (candidate) => {
    setSelectedCompanies([candidate])
    setScheduleData({
      branding_day_date: "2025-06-25",
      slots: [
        {
          company_id: candidate.company_id,
          participation_id: candidate.job_fair_participation_id,
          company_name: candidate.company_name,
          speaker: candidate.speaker,
          start_time: "09:00",
          end_time: "09:30",
          order: schedule.length + 1,
        },
      ],
    })
    setShowScheduleForm(true)
  }

  const handleBulkSchedule = () => {
    if (selectedCompanies.length === 0) return

    const slots = selectedCompanies.map((candidate, index) => {
      const startHour = 9 + Math.floor(index * 0.5)
      const startMinute = (index % 2) * 30
      const endHour = 9 + Math.floor((index + 1) * 0.5)
      const endMinute = ((index + 1) % 2) * 30

      return {
        company_id: candidate.company_id,
        participation_id: candidate.job_fair_participation_id,
        company_name: candidate.company_name,
        speaker: candidate.speaker,
        start_time: `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`,
        end_time: `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`,
        order: schedule.length + index + 1,
      }
    })

    setScheduleData({
      branding_day_date: "2025-06-25",
      slots,
    })
    setShowScheduleForm(true)
  }

  const updateSlotTime = (index, field, value) => {
    const updatedSlots = [...scheduleData.slots]
    updatedSlots[index] = { ...updatedSlots[index], [field]: value }
    setScheduleData({ ...scheduleData, slots: updatedSlots })
  }

  const removeSlot = (index) => {
    const updatedSlots = scheduleData.slots.filter((_, i) => i !== index)
    setScheduleData({ ...scheduleData, slots: updatedSlots })
  }

  const handleSubmitSchedule = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError("")
    setActionSuccess("")

    try {
      const token = localStorage.getItem("token")
      const payload = {
        schedule: scheduleData.slots.map((slot) => ({
          company_id: slot.company_id,
          participation_id: slot.participation_id,
          branding_day_date: scheduleData.branding_day_date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          order: slot.order,
        })),
      }

      const response = await fetch(`${BASE_URL}/job-fairs/1/branding-day/schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setActionSuccess("Schedule created successfully! 🎉")
        setShowScheduleForm(false)
        setSelectedCompanies([])
        fetchData() // Refresh data
      } else {
        setActionError(data.message || "Failed to create schedule")
      }
    } catch (error) {
      console.error("Error creating schedule:", error)
      setActionError("Network error occurred while creating the schedule")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditSlot = (slot) => {
    setEditingSlot({
      ...slot,
      start_time: slot.start_time.substring(0, 5), // Remove seconds
      end_time: slot.end_time.substring(0, 5), // Remove seconds
    })
    setShowEditModal(true)
    setActionSuccess("")
    setActionError("")
  }

  const handleUpdateSlot = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError("")
    setActionSuccess("")

    try {
      const token = localStorage.getItem("token")
      const payload = {
        start_time: editingSlot.start_time,
        end_time: editingSlot.end_time,
      }

      const response = await fetch(`${BASE_URL}/job-fairs/1/branding-day/schedule/${editingSlot.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setActionSuccess("Schedule updated successfully! ✅")
        setShowEditModal(false)
        setEditingSlot(null)
        fetchData() // Refresh data
      } else {
        setActionError(data.message || "Failed to update schedule")
      }
    } catch (error) {
      console.error("Error updating schedule:", error)
      setActionError("Network error occurred while updating the schedule")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteClick = (slot) => {
    setDeletingSlot(slot)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingSlot) return

    setActionLoading(true)
    setActionError("")
    setActionSuccess("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/job-fairs/1/branding-day/schedule/${deletingSlot.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setActionSuccess("Schedule slot deleted successfully! 🗑️")
        setShowDeleteModal(false)
        setDeletingSlot(null)
        fetchData() // Refresh data
      } else {
        setActionError(data.message || "Failed to delete schedule slot")
      }
    } catch (error) {
      console.error("Error deleting schedule slot:", error)
      setActionError("Network error occurred while deleting the schedule slot")
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    return timeString.substring(0, 5) // Remove seconds
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Search skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  // Access denied component
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#ebebeb] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl border border-gray-200/50">
          <div className="text-red-500 mb-6 animate-bounce">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h3>
          <p className="text-gray-600 mb-6">You don't have permission to access this page. Admin access required.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] p-6">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] space-y-6">
      {/* Success/Error Messages */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {actionError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{actionError}</span>
          </div>
        </div>
      )}

      {/* Header - Matching Events Monitor exactly */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Branding Day Schedule</h1>
            <p className="text-gray-600">Schedule branding day slots for approved companies with speakers</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1619] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards - Matching Events Monitor layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">AVAILABLE COMPANIES</p>
              <p className="text-3xl font-bold text-[#901b20] mt-2">{unscheduledCandidates.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#901b20] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">SCHEDULED</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{schedule.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">TOTAL SPEAKERS</p>
              <p className="text-3xl font-bold text-[#901b20] mt-2">{candidates.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#901b20] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">COMPLETION</p>
              <p className="text-3xl font-bold text-gray-700 mt-2">
                {candidates.length > 0 ? Math.round((schedule.length / candidates.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter - Matching Events Monitor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies by name, speaker, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
            />
          </div>
          {selectedCompanies.length > 0 && (
            <button
              onClick={handleBulkSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Schedule Selected ({selectedCompanies.length})
            </button>
          )}
        </div>
      </div>

      {/* Available Companies Grid - Matching Events Monitor card style */}
      {unscheduledCandidates.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {unscheduledCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg shadow-sm border border-gray-200 p-6 text-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded">Available</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCompanies.some((c) => c.id === candidate.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCompanies([...selectedCompanies, candidate])
                    } else {
                      setSelectedCompanies(selectedCompanies.filter((c) => c.id !== candidate.id))
                    }
                  }}
                  className="rounded border-white/30 text-[#901b20] focus:ring-white/50 bg-white/20"
                />
              </div>

              <h3 className="text-lg font-bold mb-4">{candidate.company_name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{candidate.speaker?.speaker_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{candidate.speaker?.position}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{candidate.speaker?.mobile}</span>
                </div>
              </div>

              <button
                onClick={() => handleScheduleCompany(candidate)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
              >
                <Calendar className="w-4 h-4" />
                Schedule Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Available Companies Message */}
      {unscheduledCandidates.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All companies scheduled!</h3>
          <p className="text-gray-600">All available companies have been scheduled for branding day</p>
        </div>
      )}

      {/* Current Schedule */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Current Schedule</h2>
            <p className="text-gray-600 mt-1">Scheduled branding day slots</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {schedule
                .sort((a, b) => a.order - b.order)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg p-6 text-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded">
                          Slot #{slot.order}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSlot(slot)}
                          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                          title="Edit slot"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(slot)}
                          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                          title="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4">{slot.company_name}</h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" />
                        <span>{slot.speaker?.speaker_name || "Speaker TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{slot.branding_day_date}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Schedule Slot</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete the schedule slot for{" "}
                <span className="font-semibold">{deletingSlot.company_name}</span>? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingSlot(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Schedule Branding Day Slots</h2>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branding Day Date</label>
                  <input
                    type="date"
                    value={scheduleData.branding_day_date}
                    onChange={(e) => setScheduleData({ ...scheduleData, branding_day_date: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent w-full"
                    required
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Slots</h3>
                  <div className="space-y-4">
                    {scheduleData.slots.map((slot, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={slot.speaker?.photo || "/placeholder.svg?height=50&width=50"}
                            alt={slot.speaker?.speaker_name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">{slot.company_name}</h4>
                              <p className="text-sm text-gray-600">
                                {slot.speaker?.speaker_name} - {slot.speaker?.position}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) => updateSlotTime(index, "start_time", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) => updateSlotTime(index, "end_time", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
                                <input
                                  type="number"
                                  value={slot.order}
                                  onChange={(e) => updateSlotTime(index, "order", Number.parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-sm"
                                  min="1"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          {scheduleData.slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSlot(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1619] transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {actionLoading ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Schedule Slot</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateSlot} className="p-6">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">{editingSlot.company_name}</h3>
                  <p className="text-sm text-gray-600">{editingSlot.branding_day_date}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={editingSlot.start_time}
                    onChange={(e) => setEditingSlot({ ...editingSlot, start_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={editingSlot.end_time}
                    onChange={(e) => setEditingSlot({ ...editingSlot, end_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#901b20] text-white rounded-lg hover:bg-[#7a1619] transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {actionLoading ? "Updating..." : "Update Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandingDay
