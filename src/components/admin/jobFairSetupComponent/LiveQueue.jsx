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

      const response = await fetch(`http://127.0.0.1:8000/api/job-fairs/${jobFairId}/participations`, {
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
        // Get all companies (approved and pending for admin view)
        const allCompanies = data.data.result
        setCompanies(allCompanies)
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

      const matchesStatus = statusFilter === "all" || participation.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [companies, searchTerm, statusFilter])

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
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-32 shimmer-effect"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-64 shimmer-effect"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Queue Data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchCompanies}
              className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-4">
              {selectedCompany && (
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 text-[#901b20] hover:text-[#7a1619] font-semibold transition-colors duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Companies
                </button>
              )}
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent mb-2">
                  {selectedCompany ? `${selectedCompany.company.name} Queue` : "Live Interview Queues"}
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  {selectedCompany
                    ? "Monitor and manage interview queue in real-time"
                    : "Monitor all company interview queues for the job fair"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Last updated: {formatTime(lastUpdated)}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                {refreshing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                )}
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Companies Grid View */}
        {!selectedCompany && (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Companies</p>
                  <p className="text-3xl font-black text-[#901b20]">{overallStats.total}</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Approved</p>
                  <p className="text-3xl font-black text-green-600">{overallStats.approved}</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending</p>
                  <p className="text-3xl font-black text-yellow-600">{overallStats.pending}</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Industries</p>
                  <p className="text-3xl font-black text-[#203947]">{overallStats.industries}</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Search companies by name, industry, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium placeholder-gray-400 bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none pl-12 pr-8 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-white text-lg font-medium cursor-pointer hover:border-[#901b20]/50 min-w-[160px]"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies Grid */}
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-24 h-24 text-gray-300 mx-auto mb-6 animate-float" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {companies.length === 0 ? "No Companies Found" : "No Companies Match Your Filters"}
                </h3>
                <p className="text-xl text-gray-600 mb-8">
                  {companies.length === 0
                    ? "No companies are participating in this job fair yet."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {companies.length === 0 && (
                  <button
                    onClick={handleRefresh}
                    className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    Refresh Companies
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((participation, index) => (
                  <div
                    key={participation.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden animate-slide-in-left border border-gray-100 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleCompanySelect(participation)}
                  >
                    {/* Company Header */}
                    <div className="h-32 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                      {participation.company.logo_path ? (
                        <img
                          src={participation.company.logo_path || "/placeholder.svg"}
                          alt={participation.company.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                        </div>
                      )}

                      {/* Company Size Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getCompanySizeColor(participation.company.size)}`}
                        >
                          {participation.company.size}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border-2 backdrop-blur-sm ${getStatusColor(participation.status)}`}
                        >
                          {participation.status}
                        </span>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-black text-[#203947] mb-3 line-clamp-1 group-hover:text-[#901b20] transition-colors duration-300">
                        {participation.company.name}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          <div className="w-8 h-8 bg-[#901b20]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Building2 className="w-4 h-4 text-[#901b20]" />
                          </div>
                          <span className="font-medium text-sm truncate">{participation.company.industry}</span>
                        </div>

                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          <div className="w-8 h-8 bg-[#203947]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <MapPin className="w-4 h-4 text-[#203947]" />
                          </div>
                          <span className="font-medium text-sm truncate">{participation.company.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          <div className="w-8 h-8 bg-[#ad565a]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Users className="w-4 h-4 text-[#ad565a]" />
                          </div>
                          <span className="font-medium text-sm">
                            {participation.status === "approved" ? "Queue Active" : "Queue Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">
                          {participation.need_branding ? (
                            <span className="text-orange-600 font-semibold">Needs Branding</span>
                          ) : (
                            <span className="text-green-600 font-semibold">Ready</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[#901b20] font-bold">
                          <span>View Queue</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Company Queue Detail View */}
        {selectedCompany && (
          <div className="space-y-8">
            {queueLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#901b20] mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 font-medium">Loading queue data...</p>
              </div>
            ) : (
              <>
                {/* Company Info Header */}
                <div className="bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-3xl p-8 text-white">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        {selectedCompany.company.logo_path ? (
                          <img
                            src={selectedCompany.company.logo_path || "/placeholder.svg"}
                            alt={selectedCompany.company.name}
                            className="w-16 h-16 object-contain rounded-xl"
                          />
                        ) : (
                          <Building2 className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black mb-2">{selectedCompany.company.name}</h2>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-sm">
                            {selectedCompany.company.industry}
                          </span>
                          <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-sm">
                            {selectedCompany.company.size}
                          </span>
                          <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-sm">
                            {selectedCompany.company.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {selectedCompany.company.website && (
                        <a
                          href={selectedCompany.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-all duration-200 backdrop-blur-sm"
                        >
                          <Globe className="w-4 h-4" />
                          <span className="font-medium">Website</span>
                        </a>
                      )}
                      {selectedCompany.company.linkedin_url && (
                        <a
                          href={selectedCompany.company.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-all duration-200 backdrop-blur-sm"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="font-medium">LinkedIn</span>
                        </a>
                      )}
                      {selectedCompany.company.contact_email && (
                        <a
                          href={`mailto:${selectedCompany.company.contact_email}`}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-all duration-200 backdrop-blur-sm"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">Email</span>
                        </a>
                      )}
                      {selectedCompany.company.contact_phone && (
                        <a
                          href={`tel:${selectedCompany.company.contact_phone}`}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-all duration-200 backdrop-blur-sm"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">Phone</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Queue Stats */}
                {companyQueue && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total</p>
                          <p className="text-3xl font-black text-blue-600">{companyQueue.summary.total}</p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Waiting</p>
                          <p className="text-3xl font-black text-yellow-600">{companyQueue.summary.waiting}</p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</p>
                          <p className="text-3xl font-black text-green-600">{companyQueue.summary.completed}</p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Timer className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Time</p>
                          <p className="text-3xl font-black text-purple-600">
                            {companyQueue.summary.average_interview_time_minutes}m
                          </p>
                        </div>
                      </div>

                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                              <Activity className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const trafficDisplay = getTrafficFlagDisplay(companyQueue.summary.traffic_flag)
                              const IconComponent = trafficDisplay.icon
                              return (
                                <>
                                  <IconComponent className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm font-bold text-gray-900">{trafficDisplay.label}</span>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Interview */}
                    {companyQueue.summary.in_interview_student_name && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 animate-pulse-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                              <UserCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-green-800 mb-1">Interview in Progress</h3>
                              <p className="text-green-700 font-medium text-lg">
                                {companyQueue.summary.in_interview_student_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span>LIVE</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Queue List */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          Interview Queue
                        </h3>
                        <div className="text-sm text-gray-500 font-medium">
                          {companyQueue.queue.length} students in queue
                        </div>
                      </div>

                      {companyQueue.queue.length === 0 ? (
                        <div className="text-center py-16">
                          <UserX className="w-24 h-24 text-gray-300 mx-auto mb-6 animate-float" />
                          <h4 className="text-2xl font-bold text-gray-900 mb-3">No Students in Queue</h4>
                          <p className="text-gray-600 text-lg">
                            The interview queue is currently empty. Students can join the queue to schedule interviews.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {companyQueue.queue.map((student, index) => (
                            <div
                              key={student.id || index}
                              className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                  {index + 1}
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">
                                    {student.name || `Student ${index + 1}`}
                                  </h4>
                                  <p className="text-gray-600 font-medium">{student.email || "No email provided"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Wait Time</p>
                                  <p className="text-lg font-bold text-gray-900">{student.wait_time || "~15min"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-4 py-2 rounded-full text-sm font-bold ${
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
