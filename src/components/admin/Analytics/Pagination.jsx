"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 lg:mb-12">
      <div className="flex flex-col gap-4">
        <div className="text-xs sm:text-sm lg:text-lg text-gray-600 font-medium text-center">
          Showing <span className="font-bold text-[#901b20]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="font-bold text-[#901b20]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
          <span className="font-bold text-[#901b20]">{totalItems}</span> insights
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm lg:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300 font-medium min-h-[40px] sm:min-h-[44px]"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {[...Array(Math.min(3, totalPages))].map((_, i) => {
              let pageNum
              if (totalPages <= 3) {
                pageNum = i + 1
              } else if (currentPage <= 2) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i
              } else {
                pageNum = currentPage - 1 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl font-bold transition-all duration-300 min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white shadow-lg transform scale-105 sm:scale-110"
                      : "border-2 border-gray-200 hover:border-[#901b20] hover:bg-[#901b20] hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm lg:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300 font-medium min-h-[40px] sm:min-h-[44px]"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
