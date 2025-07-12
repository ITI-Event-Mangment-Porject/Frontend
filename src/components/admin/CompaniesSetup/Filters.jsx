"use client"

import { Search, Filter, RefreshCw, ChevronDown } from "lucide-react"

const Filters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onSearch, onRefresh }) => (
  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
    <div className="flex flex-col lg:flex-row gap-6">
      <form onSubmit={onSearch} className="flex-1">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search companies by name..."
            className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium placeholder-gray-400 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>

      <div className="flex gap-4">
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
          <select
            className="appearance-none pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-white text-lg font-medium cursor-pointer hover:border-[#901b20]/50 min-w-[160px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ backgroundImage: "none" }}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Refresh</span>
          </div>
        </button>
      </div>
    </div>
  </div>
)

export default Filters
