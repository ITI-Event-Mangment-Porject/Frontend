"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import {
  Building2,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Download,
  Loader2,
} from "lucide-react"

const ParticipatingCompaniesTabEnhanced = ({ event }) => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/job-fairs/${event.id}/participations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.data.success) {
          setCompanies(response.data.data.result)
        } else {
          toast.error("Failed to load companies")
        }
      } catch (error) {
        console.error(error)
        toast.error("Error fetching participating companies")
      } finally {
        setLoading(false)
      }
    }

    if (event?.id) {
      fetchCompanies()
    }
  }, [event?.id])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/job-fairs/${event.id}/participations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        setCompanies(response.data.data.result)
        toast.success("Companies refreshed successfully!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error refreshing companies")
    } finally {
      setRefreshing(false)
    }
  }

  const getSizeColorClasses = (size) => {
    const normalizedSize = size.toLowerCase()

    switch (normalizedSize) {
      case "startup":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "small":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "large":
        return "bg-green-100 text-green-800 border-green-200"
      case "enterprise":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleApprove = async (jobFairId, participationId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("You must be logged in")
        return
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/job-fairs/${jobFairId}/participations/${participationId}`,
        {
          status: "approved",
          review_notes: "Meets all requirements.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data?.success) {
        toast.success("Company approved successfully")
        setCompanies((prev) => prev.map((p) => (p.id === participationId ? { ...p, status: "approved" } : p)))
      } else {
        toast.error("Failed to approve company")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error approving company")
    }
  }

  const filteredAndSortedCompanies = companies
    .filter((participation) => {
      const company = participation.company
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        company.name.toLowerCase().includes(searchLower) ||
        company.industry.toLowerCase().includes(searchLower) ||
        company.location.toLowerCase().includes(searchLower) ||
        company.size.toLowerCase().includes(searchLower)

      if (statusFilter === "all") return matchesSearch
      return matchesSearch && participation.status.toLowerCase() === statusFilter
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0

      const aValue = a.company[sortConfig.key]
      const bValue = b.company[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCompanies = filteredAndSortedCompanies.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAndSortedCompanies.length / itemsPerPage)

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
    total: companies.length,
    approved: companies.filter((c) => c.status === "approved").length,
    pending: companies.filter((c) => c.status === "pending").length,
    rejected: companies.filter((c) => c.status === "rejected").length,
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
                <div key={i} className="bg-gray-200 rounded-xl h-20 shimmer-effect"></div>
              ))}
            </div>
          </div>
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
              Participating Companies
            </h2>
            <p className="text-sm lg:text-lg text-gray-600 font-medium">
              Manage company participations and approvals for this job fair
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
                <Building2 className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Total Companies
            </p>
            <p className="text-xl lg:text-3xl font-black text-[#901b20]">{stats.total}</p>
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
            <p className="text-xl lg:text-3xl font-black text-green-600">{stats.approved}</p>
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
            <p className="text-xl lg:text-3xl font-black text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <AlertCircle className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">
              Rejected
            </p>
            <p className="text-xl lg:text-3xl font-black text-red-600">{stats.rejected}</p>
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
                placeholder="Search companies..."
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Companies Table */}
      {filteredAndSortedCompanies.length === 0 ? (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="text-center py-16 lg:py-20">
            <Building2 className="w-16 h-16 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 lg:mb-6 animate-float" />
            <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">
              {searchTerm || statusFilter !== "all" ? "No Companies Found" : "No Companies Registered Yet"}
            </h3>
            <p className="text-sm lg:text-xl text-gray-600 mb-6 lg:mb-8 px-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria."
                : "Companies will appear here once they register for the event."}
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
        <>
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 lg:px-8 py-4 lg:py-6 border-b bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white">
              <h2 className="text-lg lg:text-xl font-bold flex items-center gap-3">
                <Building2 className="w-5 h-5 lg:w-6 lg:h-6" />
                Companies ({filteredAndSortedCompanies.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      onClick={() => handleSort("name")}
                      className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                    >
                      <div className="flex items-center gap-2">
                        Company Name
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("industry")}
                      className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                    >
                      <div className="flex items-center gap-2">
                        Industry
                        {getSortIcon("industry")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("size")}
                      className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                    >
                      <div className="flex items-center gap-2">
                        Size
                        {getSortIcon("size")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("location")}
                      className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none group"
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {getSortIcon("location")}
                      </div>
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCompanies.map((participation, index) => {
                    const company = participation.company
                    return (
                      <tr
                        key={participation.id}
                        className="hover:bg-gray-50 transition-colors duration-200 animate-slide-in-left"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl flex items-center justify-center">
                              <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                            <div className="text-sm lg:text-base font-bold text-gray-900">{company.name}</div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs lg:text-sm font-bold bg-blue-100 text-blue-800 border-2 border-blue-200">
                            {company.industry}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-2 rounded-xl text-xs lg:text-sm font-bold border-2 ${getSizeColorClasses(company.size)}`}
                          >
                            {company.size}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm lg:text-base text-gray-900 font-medium">{company.location}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold border-2 ${getStatusColor(participation.status)}`}
                          >
                            {getStatusIcon(participation.status)}
                            {participation.status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a
                                href={`mailto:${company.contact_email}`}
                                className="text-sm lg:text-base text-[#901b20] hover:text-[#7a1619] font-medium transition-colors duration-200"
                              >
                                {company.contact_email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a
                                href={`tel:${company.contact_phone}`}
                                className="text-sm lg:text-base text-[#901b20] hover:text-[#7a1619] font-medium transition-colors duration-200"
                              >
                                {company.contact_phone}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#901b20] hover:text-[#7a1619] font-medium transition-colors duration-200"
                              >
                                <Globe className="w-4 h-4" />
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {participation.status !== "approved" && (
                              <button
                                onClick={() => handleApprove(participation.event_id, participation.id)}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-bold text-xs lg:text-sm transition-all duration-300 transform hover:scale-105"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-b-2xl p-6 lg:p-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="text-sm lg:text-lg text-gray-600 font-medium text-center sm:text-left">
                    Showing <span className="font-bold text-[#901b20]">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-bold text-[#901b20]">
                      {Math.min(indexOfLastItem, filteredAndSortedCompanies.length)}
                    </span>{" "}
                    of <span className="font-bold text-[#901b20]">{filteredAndSortedCompanies.length}</span> companies
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 lg:px-4 py-2 lg:py-3 rounded-xl border-2 text-sm lg:text-base font-bold transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white border-[#901b20] shadow-lg transform scale-110"
                              : "bg-white text-gray-700 hover:bg-[#901b20] hover:text-white border-gray-200 hover:border-[#901b20] transform hover:scale-105"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
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
        </>
      )}
    </div>
  )
}

export default ParticipatingCompaniesTabEnhanced
