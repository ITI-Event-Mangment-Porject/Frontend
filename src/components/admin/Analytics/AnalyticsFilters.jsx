"use client"

import { Search, Filter, ChevronDown } from "lucide-react"

export const AnalyticsFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search by event title or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium placeholder-gray-400 bg-gray-50 focus:bg-white min-h-[44px]"
            />
          </div>
        </div>

        <div className="sm:w-64">
          <div className="relative group">
            <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
            <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-gray-50 focus:bg-white text-sm sm:text-base lg:text-lg font-medium cursor-pointer hover:border-[#901b20]/50 min-h-[44px]"
              style={{ backgroundImage: "none" }}
            >
              <option value="all">All Sentiment</option>
              <option value="positive">Positive</option>
              <option value="mixed">Mixed</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}