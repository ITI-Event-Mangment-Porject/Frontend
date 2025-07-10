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
  ArrowRight,
} from "lucide-react"

const BrandingDay = () => {
  const [candidates, setCandidates] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [editingSlot, setEditingSlot] = useState(null)
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

  const handleDeleteScheduleSlot = async (slotId) => {
    if (!confirm("Are you sure you want to delete this schedule slot?")) return

    setActionLoading(true)
    setActionError("")
    setActionSuccess("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/job-fairs/1/branding-day/schedule/${slotId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setActionSuccess("Schedule slot deleted successfully! 🗑️")
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Access denied component
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ebebeb] via-[#f5f5f5] to-[#e0e0e0] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl border border-gray-200/50">
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
      <div className="min-h-screen bg-gradient-to-br from-[#ebebeb] via-[#f5f5f5] to-[#e0e0e0] p-6">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebebeb] via-[#f5f5f5] to-[#e0e0e0] space-y-6">
      {/* Success/Error Messages */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {actionError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{actionError}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-white via-white to-gray-50/50 rounded-3xl shadow-xl border border-gray-200/50 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent mb-2">
              Branding Day Schedule
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule branding day slots for approved companies with speakers
            </p>
            <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedCompanies.length > 0 && (
              <button
                onClick={handleBulkSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Schedule Selected ({selectedCompanies.length})
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-xl hover:from-[#7a1619] hover:to-[#8a4548] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl border border-blue-200/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Available Companies</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {unscheduledCandidates.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl shadow-xl border border-green-200/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Scheduled Slots</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {schedule.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl shadow-xl border border-purple-200/30 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Speakers</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {candidates.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#901b20]/10 rounded-2xl shadow-xl border border-[#901b20]/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent">
                {candidates.length > 0 ? Math.round((schedule.length / candidates.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-r from-white via-white to-gray-50/50 rounded-2xl shadow-xl border border-gray-200/50 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent bg-white/80 backdrop-blur-sm shadow-inner"
          />
        </div>
      </div>

      {/* Available Companies */}
      <div className="bg-gradient-to-r from-white via-white to-gray-50/50 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#901b20]" />
            Available Companies for Scheduling
          </h2>
          <p className="text-gray-600 mt-1">Companies with approved speakers that haven't been scheduled yet</p>
        </div>

        {unscheduledCandidates.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {unscheduledCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-gradient-to-br from-white to-gray-50/30 border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={candidate.speaker?.photo || "/placeholder.svg?height=60&width=60"}
                        alt={candidate.speaker?.speaker_name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#901b20] transition-colors">
                        {candidate.company_name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#901b20]" />
                          <span className="font-medium">{candidate.speaker?.speaker_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span>{candidate.speaker?.position}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{candidate.speaker?.mobile}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200/50">
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
                      className="rounded border-gray-300 text-[#901b20] focus:ring-[#901b20] w-4 h-4"
                    />
                    <button
                      onClick={() => handleScheduleCompany(candidate)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-xl hover:from-[#7a1619] hover:to-[#8a4548] transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All companies scheduled!</h3>
            <p className="text-gray-600">All available companies have been scheduled for branding day</p>
          </div>
        )}
      </div>

      {/* Current Schedule */}
      {schedule.length > 0 && (
        <div className="bg-gradient-to-r from-white via-white to-gray-50/50 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#901b20]" />
              Current Schedule
            </h2>
            <p className="text-gray-600 mt-1">Scheduled branding day slots</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {schedule
                .sort((a, b) => a.order - b.order)
                .map((slot, index) => (
                  <div
                    key={slot.id}
                    className="bg-gradient-to-br from-white to-gray-50/30 border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                            {slot.order}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#901b20] transition-colors">
                            {slot.company_name}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-[#901b20]" />
                              <span className="font-medium">{slot.speaker?.speaker_name || "Speaker TBD"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-mono">
                                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-green-500" />
                              <span>{slot.speaker?.position || "Position TBD"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              <span>{slot.branding_day_date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSlot(slot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit slot"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScheduleSlot(slot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
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
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent w-full"
                    required
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Slots</h3>
                  <div className="space-y-4">
                    {scheduleData.slots.map((slot, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50/50 to-white"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={slot.speaker?.photo || "/placeholder.svg?height=50&width=50"}
                            alt={slot.speaker?.speaker_name}
                            className="w-12 h-12 rounded-xl object-cover shadow-lg"
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) => updateSlotTime(index, "end_time", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
                                <input
                                  type="number"
                                  value={slot.order}
                                  onChange={(e) => updateSlotTime(index, "order", Number.parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-xl hover:from-[#7a1619] hover:to-[#8a4548] transition-all duration-300 transform hover:scale-105 shadow-lg font-medium disabled:opacity-50"
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={editingSlot.end_time}
                    onChange={(e) => setEditingSlot({ ...editingSlot, end_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-xl hover:from-[#7a1619] hover:to-[#8a4548] transition-all duration-300 transform hover:scale-105 shadow-lg font-medium disabled:opacity-50"
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
