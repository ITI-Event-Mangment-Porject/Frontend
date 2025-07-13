"use client"

import { RefreshCw, Loader2 } from "lucide-react"

export const AnalyticsHeader = ({ onRefresh, loading }) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary mb-2">Feedback Analytics</h1>
          <p className="text-lg text-gray-600 font-medium">
            AI-powered insights from event feedback and satisfaction scores
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
            )}
            <span className="text-sm sm:text-base">{loading ? "Loading..." : "Refresh"}</span>
          </div>
        </button>
      </div>
    </div>
  )
}
