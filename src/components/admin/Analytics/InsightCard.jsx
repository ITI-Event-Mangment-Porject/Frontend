"use client"

import { Brain, Calendar, Activity, Clock } from "lucide-react"
import { getSentimentColor, getSatisfactionColor } from "../../../utils/sentimentUtils"
import { formatDate } from "../../../utils/dateUtils"
import { getSimpleSentiment } from "../../../utils/sentimentUtils"

export const InsightCard = ({ insight, index, onViewDetails }) => {
  return (
    <div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden animate-slide-in-left flex flex-col h-full border border-gray-100"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="h-48 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <Brain className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        </div>

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 lg:top-6 right-2 sm:right-3 lg:right-6">
          <span
            className={`px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-bold border-2 backdrop-blur-sm ${getSatisfactionColor(insight.satisfaction_score)} shadow-lg`}
          >
            ⭐ {insight.satisfaction_score}/5
          </span>
        </div>

        <div className="absolute top-2 sm:top-3 lg:top-6 left-2 sm:left-3 lg:left-6">
          <span className="px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg bg-white/20 text-white backdrop-blur-sm">
            {insight.feedback_count} responses
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg lg:text-xl font-black text-[#203947] mb-3 sm:mb-4 line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300 h-10 sm:h-12 lg:h-14 flex items-start leading-tight">
          {insight.event.title}
        </h3>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
          <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#901b20]/10 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#901b20]" />
            </div>
            <span className="font-medium text-xs sm:text-sm lg:text-base">{formatDate(insight.event.date)}</span>
          </div>

          <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#203947]/10 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#203947]" />
            </div>
            <span
              className={`font-medium text-xs sm:text-sm lg:text-base px-2 py-1 rounded-full ${getSentimentColor(insight.sentiment_analysis)}`}
            >
              {getSimpleSentiment(insight.sentiment_analysis)}
            </span>
          </div>

          <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#ad565a]/10 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#ad565a]" />
            </div>
            <span className="font-medium text-xs sm:text-sm lg:text-base">{formatDate(insight.generated_at)}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-gray-700 text-xs sm:text-sm lg:text-base line-clamp-3 leading-relaxed">
            {insight.summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 sm:pt-4 lg:pt-6 border-t border-gray-100 mt-auto">
          <button
            onClick={() => onViewDetails(insight)}
            className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-sm lg:text-base min-h-[40px] sm:min-h-[44px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="relative">View Details</span>
          </button>
        </div>
      </div>
    </div>
  )
}
