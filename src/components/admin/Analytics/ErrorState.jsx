"use client"

import { AlertCircle } from "lucide-react"

export const ErrorState = ({ message }) => {
  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-shake">
        <div className="text-red-500 mb-4 sm:mb-6 animate-bounce">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Error Loading Analytics</h3>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
