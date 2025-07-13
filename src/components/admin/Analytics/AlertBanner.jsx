"use client"

import { AlertCircle, Zap, Loader2 } from "lucide-react"

export const AlertBanner = ({ eventsCount, onAutoGenerate, autoGenerating }) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-12 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-orange-800 mb-1 sm:mb-2">
              {eventsCount} Event{eventsCount !== 1 ? "s" : ""} Need AI Insights
            </h3>
            <p className="text-orange-700 font-medium text-sm sm:text-base leading-relaxed">
              Generate AI-powered analytics for events with feedback but no insights yet.
            </p>
          </div>
        </div>
        <button
          onClick={onAutoGenerate}
          disabled={autoGenerating}
          className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none min-h-[44px] w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center gap-2">
            {autoGenerating ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="text-sm sm:text-base">
              {autoGenerating ? "Generating All..." : "Generate All Insights"}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
