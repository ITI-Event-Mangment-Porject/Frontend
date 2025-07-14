"use client"

import { ClipLoader } from 'react-spinners';
const APP_URL = import.meta.env.VITE_API_BASE_URL;

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import {
  Users,
  Search,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  User,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react"

const RegistrationsTabEnhanced = ({ event }) => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchRegistrations = async (page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${APP_URL}/api/events/${event.id}/registrations?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setRegistrations(Array.isArray(response.data.data.result.data) ? response.data.data.result.data : [])
          setTotalPages(response.data.data.result.last_page)
        } else {
          toast.error("Failed to load registrations")
          setError("Failed to load registrations")
        }
      } catch (error) {
        console.error(error)
        toast.error("Error fetching registrations")
        setError("Error fetching registrations")
      } finally {
        setLoading(false)
      }
    }

    if (event?.id) {
      fetchRegistrations(currentPage)
    }
  }, [event?.id, currentPage])

  const handleRefresh = async () => {
    setRefreshing(true)
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/events/${event.id}/registrations?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        setRegistrations(Array.isArray(response.data.data.result.data) ? response.data.data.result.data : [])
        setTotalPages(response.data.data.result.last_page)
        toast.success("Registrations refreshed successfully!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error refreshing registrations")
    } finally {
      setRefreshing(false)
    }
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getStatusColor = (registration) => {
    if (registration.cancelled_at) {
      return "bg-red-100 text-red-800 border-red-200"
    }
    if (registration.checked_in_at) {
      return "bg-green-100 text-green-800 border-green-200"
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200"
  }

  const getStatusIcon = (registration) => {
    if (registration.cancelled_at) {
      return <XCircle className="w-4 h-4" />
    }
    if (registration.checked_in_at) {
      return <CheckCircle className="w-4 h-4" />
    }
    return <Clock className="w-4 h-4" />
  }

  const getStatusText = (registration) => {
    if (registration.cancelled_at) {
      return "Cancelled"
    }
    if (registration.checked_in_at) {
      return "Checked In"
    }
    return "Registered"
  }

  const filteredAndSortedRegistrations = registrations
    .filter((registration) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        (registration.user.first_name + " " + registration.user.last_name).toLowerCase().includes(searchLower) ||
        registration.user.email.toLowerCase().includes(searchLower) ||
        (registration.user.phone && registration.user.phone.toLowerCase().includes(searchLower))

      if (statusFilter === "all") return matchesSearch
      if (statusFilter === "checked_in") return matchesSearch && registration.checked_in_at
      if (statusFilter === "cancelled") return matchesSearch && registration.cancelled_at
      if (statusFilter === "registered")
        return matchesSearch && !registration.checked_in_at && !registration.cancelled_at

      return matchesSearch
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0

      const aValue = sortConfig.key.includes(".")
        ? sortConfig.key.split(".").reduce((o, i) => o[i], a)
        : a[sortConfig.key]
      const bValue = sortConfig.key.includes(".")
        ? sortConfig.key.split(".").reduce((o, i) => o[i], b)
        : b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />
    }
    return sortConfig.direction === "asc" ? (
      <ChevronDown className="w-4 h-4 text-[#901b20] rotate-180" />
    ) : (
      <ChevronDown className="w-4 h-4 text-[#901b20]" />
    )
  }

  // Calculate stats
  const stats = {
    total: registrations.length,
    checkedIn: registrations.filter((r) => r.checked_in_at).length,
    cancelled: registrations.filter((r) => r.cancelled_at).length,
    registered: registrations.filter((r) => !r.checked_in_at && !r.cancelled_at).length,
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 lg:p-6">
          <div className="animate-pulse">
            <div className="h-6 lg:h-8 bg-gray-300 rounded w-1/2 lg:w-1/3 mb-4 lg:mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl lg:rounded-2xl h-24 lg:h-32 shimmer-effect"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-16 shimmer-effect"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Error Loading Registrations</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center lg:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-[#901b20] to-[#901b20] bg-clip-text text-transparent mb-1 lg:mb-2 leading-tight">
              Event Registrations
            </h2>
            <p className="text-sm lg:text-lg text-gray-600 font-medium">
              Manage and monitor event registrations and attendance
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group relative overflow-hidden bg-gradient-to-r from-[#203947] to-[#467c9b] hover:from-[#1a2f3a] hover:to-[#203947] disabled:from-gray-400 disabled:to-gray-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-500 transform hover:scale-105 lg:hover:scale-105 hover:shadow-xl lg:hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-1.5 lg:gap-3">
                {refreshing ? (
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-180 transition-transform duration-500" />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </div>
            </button>

            <button className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-500 transform hover:scale-105 lg:hover:scale-105 hover:shadow-xl lg:hover:shadow-2xl">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-1.5 lg:gap-3">
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Export</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Total Registrations
            </p>
            <p className="text-xl lg:text-3xl font-black text-[#901b20]">{stats.total}</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <UserCheck className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Checked In
            </p>
            <p className="text-xl lg:text-3xl font-black text-green-600">{stats.checkedIn}</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Registered
            </p>
            <p className="text-xl lg:text-3xl font-black text-yellow-600">{stats.registered}</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <UserX className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Cancelled
            </p>
            <p className="text-xl lg:text-3xl font-black text-red-600">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-lg border border-gray-100">
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 lg:pl-12 pr-4 lg:pr-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-sm lg:text-lg font-medium placeholder-gray-400 bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2 lg:gap-4">
            <div className="relative group flex-1 lg:flex-none">
              <Filter className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-white text-sm lg:text-lg font-medium cursor-pointer hover:border-[#901b20]/50 w-full lg:min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="registered">Registered</option>
                <option value="checked_in">Checked In</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Registrations Table */}
      {filteredAndSortedRegistrations.length === 0 ? (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="text-center py-16 lg:py-20">
            <Users className="w-16 h-16 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 lg:mb-6 animate-float" />
            <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">No Registrations Found</h3>
            <p className="text-sm lg:text-xl text-gray-600 mb-6 lg:mb-8 px-4">
              {searchTerm || statusFilter !== "all"
                ? "No registrations match your search criteria."
                : "No registrations have been made for this event yet."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 lg:px-8 py-4 lg:py-6 border-b bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white">
            <h2 className="text-lg lg:text-xl font-bold flex items-center gap-3">
              <Users className="w-5 h-5 lg:w-6 lg:h-6" />
              Registrations ({filteredAndSortedRegistrations.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    onClick={() => handleSort("id")}
                    className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                  >
                    <div className="flex items-center gap-2">
                      ID
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("user.first_name")}
                    className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon("user.first_name")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("user.email")}
                    className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {getSortIcon("user.email")}
                    </div>
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th
                    onClick={() => handleSort("registered_at")}
                    className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                  >
                    <div className="flex items-center gap-2">
                      Registration Date
                      {getSortIcon("registered_at")}
                    </div>
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Check-in Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedRegistrations.map((registration, index) => (
                  <tr
                    key={registration.id}
                    className="hover:bg-gray-50 transition-colors duration-200 animate-slide-in-left"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-lg flex items-center justify-center text-white font-bold text-xs lg:text-sm">
                          {registration.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm lg:text-base font-bold text-gray-900">
                            {registration.user.first_name} {registration.user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm lg:text-base text-gray-900 font-medium">
                          {registration.user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      {registration.user.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm lg:text-base text-gray-900 font-medium">
                            {registration.user.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm lg:text-base">-</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm lg:text-base text-gray-900 font-medium">
                          {new Date(registration.registered_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold border-2 ${getStatusColor(registration)}`}
                      >
                        {getStatusIcon(registration)}
                        {getStatusText(registration)}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                      <div className="space-y-1">
                        {registration.checked_in_at && (
                          <div className="text-xs lg:text-sm text-gray-600">
                            <strong>Checked in:</strong> {new Date(registration.checked_in_at).toLocaleDateString()}
                          </div>
                        )}
                        {registration.check_in_method && (
                          <div className="text-xs lg:text-sm text-gray-600">
                            <strong>Method:</strong> {registration.check_in_method}
                          </div>
                        )}
                        {registration.cancelled_at && (
                          <div className="text-xs lg:text-sm text-red-600">
                            <strong>Cancelled:</strong> {new Date(registration.cancelled_at).toLocaleDateString()}
                          </div>
                        )}
                        {registration.cancellation_reason && (
                          <div className="text-xs lg:text-sm text-red-600">
                            <strong>Reason:</strong> {registration.cancellation_reason}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-b-2xl p-6 lg:p-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-sm lg:text-lg text-gray-600 font-medium text-center sm:text-left">
                  Page <span className="font-bold text-[#901b20]">{currentPage}</span> of{" "}
                  <span className="font-bold text-[#901b20]">{totalPages}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-2">
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
                          className={`px-3 lg:px-4 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                            currentPage === pageNum
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
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                      currentPage === totalPages
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
        </div>
      )}
    </div>
  )
}

export default RegistrationsTabEnhanced
