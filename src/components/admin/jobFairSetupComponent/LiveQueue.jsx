"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Building2,
  User,
  Timer,
  Activity,
  MapPin,
  Globe,
  Linkedin,
  ChevronRight,
  UserCheck,
  UserX,
  Phone,
  Mail,
  BarChart3,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react"

const LiveQueueManagement = ({ jobFairId = 1, className = "" }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [companyQueue, setCompanyQueue] = useState(null)
  const [queueLoading, setQueueLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Static admin token
  const ADMIN_TOKEN = localStorage.getItem('token');
  // Fetch participating companies
  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters for backend filtering
      const queryParams = new URLSearchParams()
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter)
      }

      const url = `http://127.0.0.1:8000/api/job-fairs/${jobFairId}/participations${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

      const response = await fetch(url, {
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
        setCompanies(data.data.result)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.message || "Failed to fetch companies")
      }
    } catch (err) {
      setError(err.message || "Error loading companies")
      console.error("Error fetching companies:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch specific company queue
  const fetchCompanyQueue = async (companyId) => {
    try {
      setQueueLoading(true)

      const response = await fetch(`http://127.0.0.1:8000/api/job-fairs/${jobFairId}/queues/company/${companyId}`, {
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
        setCompanyQueue(data.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.message || "Failed to fetch queue")
      }
    } catch (err) {
      console.error("Error fetching company queue:", err)
      // Set empty queue on error
      setCompanyQueue({
        queue: [],
        summary: {
          total: 0,
          waiting: 0,
          completed: 0,
          in_interview_student_name: null,
          average_interview_time_minutes: 0,
          traffic_flag: "ok",
        },
      })
    } finally {
      setQueueLoading(false)
    }
  }

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompany(company)
    fetchCompanyQueue(company.company.id)
  }

  // Handle back to companies list
  const handleBackToList = () => {
    setSelectedCompany(null)
    setCompanyQueue(null)
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    if (selectedCompany) {
      await fetchCompanyQueue(selectedCompany.company.id)
    } else {
      await fetchCompanies()
    }
    setRefreshing(false)
  }

  // Filter companies based on search and status
  const filteredCompanies = useMemo(() => {
    return companies.filter((participation) => {
      const matchesSearch =
        participation.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participation.company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participation.company.location.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [companies, searchTerm])

  // Get traffic flag color and icon
  const getTrafficFlagDisplay = (flag) => {
    switch (flag) {
      case "ok":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          label: "Normal",
        }
      case "busy":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
          label: "Busy",
        }
      case "overloaded":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: AlertCircle,
          label: "Overloaded",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Activity,
          label: "Unknown",
        }
    }
  }

  // Get company size badge color
  const getCompanySizeColor = (size) => {
    switch (size) {
      case "startup":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get participation status color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const approvedCompanies = companies.filter((c) => c.status === "approved")
    const pendingCompanies = companies.filter((c) => c.status === "pending")
    const industries = new Set(companies.map((c) => c.company.industry))

    return {
      total: companies.length,
      approved: approvedCompanies.length,
      pending: pendingCompanies.length,
      industries: industries.size,
    }
  }, [companies])

  // Initialize component
  useEffect(() => {
    fetchCompanies()
  }, [jobFairId])

  // Auto-refresh every 30 seconds when viewing a specific company queue
  useEffect(() => {
    if (selectedCompany) {
      const interval = setInterval(() => {
        fetchCompanyQueue(selectedCompany.company.id)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [selectedCompany])

  // Add this useEffect after the existing ones
  useEffect(() => {
    fetchCompanies()
  }, [statusFilter])

  // Format time for display
  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-4 lg:p-6">
          <div className="animate-pulse">
            <div className="h-6 lg:h-8 bg-gray-300 rounded w-1/2 lg:w-1/3 mb-4 lg:mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl lg:rounded-2xl h-24 lg:h-32 shimmer-effect"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl lg:rounded-2xl h-48 lg:h-64 shimmer-effect"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-4 lg:p-6">
          <div className="text-center py-8 lg:py-12">
            <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 lg:mb-4 animate-bounce" />
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">Error Loading Queue Data</h3>
            <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base px-4">{error}</p>
            <button
              onClick={fetchCompanies}
              className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 lg:p-6">
        {/* Mobile-Optimized Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center lg:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-4xl font-black bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent mb-1 lg:mb-2 leading-tight">
                {selectedCompany ? (
                  <span className="block lg:inline">
                    <span className="block lg:inline">{selectedCompany.company.name}</span>
                    <span className="block lg:inline lg:ml-2">Queue</span>
                  </span>
                ) : (
                  "Live Interview Queues"
                )}
              </h1>
              <p className="text-sm lg:text-lg text-gray-600 font-medium mb-1 lg:mb-0">
                {selectedCompany
                  ? "Monitor and manage interview queue in real-time"
                  : "Monitor all company interview queues for the job fair"}
              </p>
              <p className="text-xs lg:text-sm text-gray-500">Last updated: {formatTime(lastUpdated)}</p>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {selectedCompany && (
                <button
                  onClick={handleBackToList}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#203947] to-[#ad565a] hover:from-[#1a2f3a] hover:to-[#8a4548] text-white px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-500 transform hover:scale-105 lg:hover:scale-110 hover:shadow-xl lg:hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-1.5 lg:gap-3">
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="hidden sm:inline">Back to Companies</span>
                    <span className="sm:hidden">Back</span>
                  </div>
                </button>
              )}

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-500 transform hover:scale-105 lg:hover:scale-110 hover:shadow-xl lg:hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-1.5 lg:gap-3">
                  {refreshing ? (
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
                  <span className="sm:hidden">{refreshing ? "..." : "↻"}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Companies Grid View */}
        {!selectedCompany && (
          <>
            {/* Mobile-Optimized Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Building2 className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                    Total Companies
                  </p>
                  <p className="text-xl lg:text-3xl font-black text-[#901b20]">{overallStats.total}</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <CheckCircle className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                    Approved
                  </p>
                  <p className="text-xl lg:text-3xl font-black text-green-600">{overallStats.approved}</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Clock className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                    Pending
                  </p>
                  <p className="text-xl lg:text-3xl font-black text-yellow-600">{overallStats.pending}</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                    Industries
                  </p>
                  <p className="text-xl lg:text-3xl font-black text-[#203947]">{overallStats.industries}</p>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Search and Filter */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-lg border border-gray-100">
              <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                <div className="flex-1">
                  <div className="relative group">
                    <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Companies Grid */}
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-12 lg:py-16">
                <Building2 className="w-16 h-16 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 lg:mb-6 animate-float" />
                <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">
                  {companies.length === 0 ? "No Companies Found" : "No Companies Match Your Filters"}
                </h3>
                <p className="text-sm lg:text-xl text-gray-600 mb-6 lg:mb-8 px-4">
                  {companies.length === 0
                    ? "No companies are participating in this job fair yet."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {companies.length === 0 && (
                  <button
                    onClick={handleRefresh}
                    className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    Refresh Companies
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredCompanies.map((participation, index) => (
                  <div
                    key={participation.id}
                    className="group bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 lg:hover:-translate-y-3 overflow-hidden animate-slide-in-left border border-gray-100 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleCompanySelect(participation)}
                  >
                    {/* Mobile-Optimized Company Header */}
                    <div className="h-24 lg:h-32 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                      {participation.company.logo_path ? (
                        <img
                          src={participation.company.logo_path || "/placeholder.svg"}
                          alt={participation.company.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 lg:w-16 lg:h-16 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                        </div>
                      )}

                      {/* Mobile-Optimized Badges */}
                      <div className="absolute top-2 lg:top-4 left-2 lg:left-4">
                        <span
                          className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getCompanySizeColor(participation.company.size)}`}
                        >
                          {participation.company.size}
                        </span>
                      </div>

                      <div className="absolute top-2 lg:top-4 right-2 lg:right-4">
                        <span
                          className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold border-2 backdrop-blur-sm ${getStatusColor(participation.status)}`}
                        >
                          {participation.status}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-black text-[#203947] mb-3 line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300 min-h-[3.5rem] lg:min-h-[3.5rem] flex items-start">
                        {participation.company.name}
                      </h3>

                      <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#901b20]/10 rounded-lg flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                            <Building2 className="w-3 h-3 lg:w-4 lg:h-4 text-[#901b20]" />
                          </div>
                          <span className="font-medium text-xs lg:text-sm truncate">
                            {participation.company.industry}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#203947]/10 rounded-lg flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                            <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-[#203947]" />
                          </div>
                          <span className="font-medium text-xs lg:text-sm truncate">
                            {participation.company.location}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#ad565a]/10 rounded-lg flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                            <Users className="w-3 h-3 lg:w-4 lg:h-4 text-[#ad565a]" />
                          </div>
                          <span className="font-medium text-xs lg:text-sm">
                            {participation.status === "approved" ? "Queue Active" : "Queue Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-100">
                        <div className="text-xs lg:text-sm text-gray-500 font-medium">
                          {participation.need_branding ? (
                            <span className="text-orange-600 font-semibold">Needs Branding</span>
                          ) : (
                            <span className="text-green-600 font-semibold">Ready</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2 text-[#901b20] font-bold text-sm lg:text-base">
                          <span>View Queue</span>
                          <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Mobile-Optimized Company Queue Detail View */}
        {selectedCompany && (
          <div className="space-y-6 lg:space-y-8">
            {queueLoading ? (
              <div className="text-center py-8 lg:py-12">
                <Loader2 className="w-8 h-8 lg:w-12 lg:h-12 text-[#901b20] mx-auto mb-3 lg:mb-4 animate-spin" />
                <p className="text-gray-600 font-medium text-sm lg:text-base">Loading queue data...</p>
              </div>
            ) : (
              <>
                {/* Mobile-Optimized Company Info Header */}
                <div className="bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-2xl lg:rounded-3xl p-4 lg:p-8 text-white">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <div className="flex items-center gap-3 lg:gap-6">
                      <div className="w-12 h-12 lg:w-20 lg:h-20 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                        {selectedCompany.company.logo_path ? (
                          <img
                            src={selectedCompany.company.logo_path || "/placeholder.svg"}
                            alt={selectedCompany.company.name}
                            className="w-10 h-10 lg:w-16 lg:h-16 object-contain rounded-lg lg:rounded-xl"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl lg:text-3xl font-black mb-1 lg:mb-2 leading-tight">
                          {selectedCompany.company.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                          <span className="bg-white/20 rounded-full px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm font-bold backdrop-blur-sm">
                            {selectedCompany.company.industry}
                          </span>
                          <span className="bg-white/20 rounded-full px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm font-bold backdrop-blur-sm">
                            {selectedCompany.company.size}
                          </span>
                          <span className="bg-white/20 rounded-full px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm font-bold backdrop-blur-sm">
                            {selectedCompany.company.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:gap-4">
                      {selectedCompany.company.website && (
                        <a
                          href={selectedCompany.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 lg:gap-2 bg-white/20 hover:bg-white/30 rounded-lg lg:rounded-xl px-2.5 lg:px-4 py-1.5 lg:py-2 transition-all duration-200 backdrop-blur-sm text-xs lg:text-sm"
                        >
                          <Globe className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium">Website</span>
                        </a>
                      )}
                      {selectedCompany.company.linkedin_url && (
                        <a
                          href={selectedCompany.company.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 lg:gap-2 bg-white/20 hover:bg-white/30 rounded-lg lg:rounded-xl px-2.5 lg:px-4 py-1.5 lg:py-2 transition-all duration-200 backdrop-blur-sm text-xs lg:text-sm"
                        >
                          <Linkedin className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium">LinkedIn</span>
                        </a>
                      )}
                      {selectedCompany.company.contact_email && (
                        <a
                          href={`mailto:${selectedCompany.company.contact_email}`}
                          className="flex items-center gap-1.5 lg:gap-2 bg-white/20 hover:bg-white/30 rounded-lg lg:rounded-xl px-2.5 lg:px-4 py-1.5 lg:py-2 transition-all duration-200 backdrop-blur-sm text-xs lg:text-sm"
                        >
                          <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium">Email</span>
                        </a>
                      )}
                      {selectedCompany.company.contact_phone && (
                        <a
                          href={`tel:${selectedCompany.company.contact_phone}`}
                          className="flex items-center gap-1.5 lg:gap-2 bg-white/20 hover:bg-white/30 rounded-lg lg:rounded-xl px-2.5 lg:px-4 py-1.5 lg:py-2 transition-all duration-200 backdrop-blur-sm text-xs lg:text-sm"
                        >
                          <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-medium">Phone</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile-Optimized Queue Stats */}
                {companyQueue && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2 lg:mb-4">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Users className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                            Total
                          </p>
                          <p className="text-xl lg:text-3xl font-black text-blue-600">{companyQueue.summary.total}</p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2 lg:mb-4">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Clock className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                            Waiting
                          </p>
                          <p className="text-xl lg:text-3xl font-black text-yellow-600">
                            {companyQueue.summary.waiting}
                          </p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2 lg:mb-4">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <CheckCircle className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                            Completed
                          </p>
                          <p className="text-xl lg:text-3xl font-black text-green-600">
                            {companyQueue.summary.completed}
                          </p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2 lg:mb-4">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Timer className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                            Avg Time
                          </p>
                          <p className="text-xl lg:text-3xl font-black text-purple-600">
                            {companyQueue.summary.average_interview_time_minutes}m
                          </p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100 col-span-2 sm:col-span-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2 lg:mb-4">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Activity className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
                            Status
                          </p>
                          <div className="flex items-center gap-1.5 lg:gap-2">
                            {(() => {
                              const trafficDisplay = getTrafficFlagDisplay(companyQueue.summary.traffic_flag)
                              const IconComponent = trafficDisplay.icon
                              return (
                                <>
                                  <IconComponent className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                                  <span className="text-xs lg:text-sm font-bold text-gray-900">
                                    {trafficDisplay.label}
                                  </span>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile-Optimized Current Interview */}
                    {companyQueue.summary.in_interview_student_name && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl lg:rounded-2xl p-4 lg:p-8 border-2 border-green-200 animate-pulse-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <UserCheck className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg lg:text-2xl font-bold text-green-800 mb-0.5 lg:mb-1">
                                Interview in Progress
                              </h3>
                              <p className="text-green-700 font-medium text-sm lg:text-lg truncate">
                                {companyQueue.summary.in_interview_student_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 lg:gap-2 bg-green-500 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-bold text-sm lg:text-base flex-shrink-0">
                            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full animate-pulse"></div>
                            <span>LIVE</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile-Optimized Queue List */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-8 shadow-lg border border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-8 gap-2 lg:gap-4">
                        <h3 className="text-lg lg:text-2xl font-bold text-gray-900 flex items-center gap-2 lg:gap-3">
                          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl lg:rounded-2xl flex items-center justify-center">
                            <Users className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                          Interview Queue
                        </h3>
                        <div className="text-xs lg:text-sm text-gray-500 font-medium">
                          {companyQueue.queue.length} students in queue
                        </div>
                      </div>

                      {companyQueue.queue.length === 0 ? (
                        <div className="text-center py-12 lg:py-16">
                          <UserX className="w-16 h-16 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 lg:mb-6 animate-float" />
                          <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                            No Students in Queue
                          </h4>
                          <p className="text-gray-600 text-sm lg:text-lg px-4">
                            The interview queue is currently empty. Students can join the queue to schedule interviews.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 lg:space-y-4">
                          {companyQueue.queue.map((student, index) => (
                            <div
                              key={student.id || index}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                            >
                              <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-lg lg:rounded-xl flex items-center justify-center text-white font-bold text-sm lg:text-lg flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-gray-900 text-sm lg:text-lg truncate">
                                    {student.name || `Student ${index + 1}`}
                                  </h4>
                                  <p className="text-gray-600 font-medium text-xs lg:text-base truncate">
                                    {student.email || "No email provided"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-3 lg:gap-4 flex-shrink-0">
                                <div className="text-center sm:text-right">
                                  <p className="text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    Wait Time
                                  </p>
                                  <p className="text-sm lg:text-lg font-bold text-gray-900">
                                    {student.wait_time || "~15min"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2.5 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-bold ${
                                      student.status === "waiting"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : student.status === "in_progress"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {student.status || "waiting"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveQueueManagement
