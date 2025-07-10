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
} from "lucide-react"

const BrandingDay = () => {
  const [candidates, setCandidates] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [scheduleData, setScheduleData] = useState({
    branding_day_date: "2025-06-25",
    slots: [],
  })

  // Fetch candidates and existing schedule
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Mock API calls - replace with actual endpoints
      const candidatesResponse = {
        success: true,
        data: {
          result: [
            {
              id: 4,
              company_id: 8,
              company_name: "Marvin, Walter and Koelpin",
              need_branding: true,
              status: "approved",
              speaker: {
                id: 2,
                speaker_name: "Miss Margret Feil",
                position: "Lay-Out Worker",
                mobile: "1-562-835-5197",
                photo: "https://via.placeholder.com/640x480.png/005533?text=people+id",
              },
            },
            {
              id: 7,
              company_id: 14,
              company_name: "Cummerata, Howell and Fadel",
              need_branding: true,
              status: "approved",
              speaker: {
                id: 4,
                speaker_name: "Vicky Dickens V",
                position: "Food Preparation Worker",
                mobile: "(915) 843-9003",
                photo: "https://via.placeholder.com/640x480.png/00ddaa?text=people+numquam",
              },
            },
          ],
        },
      }

      const scheduleResponse = {
        success: true,
        data: {
          result: [
            {
              id: 4,
              company_id: 14,
              company_name: "Cummerata, Howell and Fadel",
              participation_id: 7,
              branding_day_date: "2025-08-08",
              start_time: "02:52:39",
              end_time: "23:27:32",
              order: 5,
              speaker: {
                id: 4,
                speaker_name: "Vicky Dickens V",
                position: "Food Preparation Worker",
                mobile: "(915) 843-9003",
                photo: "https://via.placeholder.com/640x480.png/00ddaa?text=people+numquam",
              },
            },
          ],
        },
      }

      setCandidates(candidatesResponse.data.result)
      setSchedule(scheduleResponse.data.result)
    } catch (error) {
      console.error("Error fetching data:", error)
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
          participation_id: candidate.id,
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

    const slots = selectedCompanies.map((candidate, index) => ({
      company_id: candidate.company_id,
      participation_id: candidate.id,
      company_name: candidate.company_name,
      speaker: candidate.speaker,
      start_time: `${9 + Math.floor(index * 0.5)}:${(index % 2) * 30 < 10 ? "0" : ""}${(index % 2) * 30}`,
      end_time: `${9 + Math.floor((index + 1) * 0.5)}:${((index + 1) % 2) * 30 < 10 ? "0" : ""}${((index + 1) % 2) * 30}`,
      order: schedule.length + index + 1,
    }))

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

    try {
      // Mock API call - replace with actual endpoint
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

      console.log("Submitting schedule:", payload)

      // Update local state
      setSchedule([
        ...schedule,
        ...scheduleData.slots.map((slot) => ({
          ...slot,
          id: Date.now() + Math.random(),
          branding_day_date: scheduleData.branding_day_date,
        })),
      ])

      setShowScheduleForm(false)
      setSelectedCompanies([])
    } catch (error) {
      console.error("Error creating schedule:", error)
    }
  }

  const handleDeleteScheduleSlot = async (slotId) => {
    try {
      // Mock API call - replace with actual endpoint
      console.log("Deleting schedule slot:", slotId)
      setSchedule(schedule.filter((slot) => slot.id !== slotId))
    } catch (error) {
      console.error("Error deleting schedule slot:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Branding Day Schedule</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Schedule branding day slots for approved companies with speakers
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {selectedCompanies.length > 0 && (
              <button
                onClick={handleBulkSchedule}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4" />
                Schedule Selected ({selectedCompanies.length})
              </button>
            )}
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#901b20] text-white rounded-xl hover:bg-[#7a1619] transition-colors text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Available Companies</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{unscheduledCandidates.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Scheduled Slots</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{schedule.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Speakers</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{candidates.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {candidates.length > 0 ? Math.round((schedule.length / candidates.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#901b20]/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#901b20]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Available Companies */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Available Companies for Scheduling</h2>
          <p className="text-sm text-gray-600 mt-1">Companies with approved speakers that haven't been scheduled yet</p>
        </div>

        {unscheduledCandidates.length > 0 ? (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {unscheduledCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={candidate.speaker?.photo || "/placeholder.svg?height=60&width=60"}
                      alt={candidate.speaker?.speaker_name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">
                        {candidate.company_name}
                      </h3>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{candidate.speaker?.speaker_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{candidate.speaker?.position}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{candidate.speaker?.mobile}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
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
                      className="rounded border-gray-300 text-[#901b20] focus:ring-[#901b20]"
                    />
                    <button
                      onClick={() => handleScheduleCompany(candidate)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#901b20] text-white rounded-xl hover:bg-[#7a1619] transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">All companies scheduled</h3>
            <p className="text-sm sm:text-base text-gray-600">
              All available companies have been scheduled for branding day
            </p>
          </div>
        )}
      </div>

      {/* Current Schedule */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Current Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">Scheduled branding day slots</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {schedule.map((slot) => (
                <div key={slot.id} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={slot.speaker?.photo || "/placeholder.svg?height=50&width=50"}
                        alt={slot.speaker?.speaker_name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">
                          {slot.company_name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{slot.speaker?.speaker_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{slot.speaker?.position}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{slot.branding_day_date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteScheduleSlot(slot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Schedule Branding Day Slots</h2>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branding Day Date</label>
                  <input
                    type="date"
                    value={scheduleData.branding_day_date}
                    onChange={(e) => setScheduleData({ ...scheduleData, branding_day_date: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent"
                    required
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Slots</h3>
                  <div className="space-y-4">
                    {scheduleData.slots.map((slot, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={slot.speaker?.photo || "/placeholder.svg?height=50&width=50"}
                            alt={slot.speaker?.speaker_name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{slot.company_name}</h4>
                              <p className="text-sm text-gray-600">
                                {slot.speaker?.speaker_name} - {slot.speaker?.position}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#901b20] text-white rounded-xl hover:bg-[#7a1619] transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Schedule
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
