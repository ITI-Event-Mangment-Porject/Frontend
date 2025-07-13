"use client"

import { useMemo } from "react"
import { Brain } from "lucide-react"
import { InsightCard } from "./InsightCard"
import { Pagination } from "./Pagination"
import { getSimpleSentiment } from "../../../utils/sentimentUtils"



export const InsightsGrid = ({
  insights,
  searchTerm,
  selectedType,
  currentPage,
  setCurrentPage,
  onViewDetails,
  onRefresh,
}) => {
  const itemsPerPage = 6

  const filteredInsights = useMemo(() => {
    return insights.filter((insight) => {
      const matchesSearch =
        insight.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.summary.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesSentiment = true
      if (selectedType !== "all") {
        const simpleSentiment = getSimpleSentiment(insight.sentiment_analysis)
        matchesSentiment = simpleSentiment.toLowerCase() === selectedType.toLowerCase()
      }

      return matchesSearch && matchesSentiment
    })
  }, [insights, searchTerm, selectedType])

  const paginatedInsights = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredInsights.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredInsights, currentPage])

  const totalFilteredPages = Math.ceil(filteredInsights.length / itemsPerPage)

  if (paginatedInsights.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-16 text-center shadow-xl animate-fade-in mb-8 sm:mb-12 lg:mb-16">
        <div className="text-gray-300 mb-4 sm:mb-6 lg:mb-8 animate-float">
          <Brain className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 mx-auto" />
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
          {insights.length === 0 ? "No Insights Available" : "No Insights Match Your Filters"}
        </h3>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
          {insights.length === 0
            ? "Generate AI insights for your events to see analytics here."
            : searchTerm || selectedType !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No insights found."}
        </p>
        {insights.length === 0 && (
          <button
            onClick={onRefresh}
            className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-h-[44px]"
          >
            Refresh Analytics
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
        {paginatedInsights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} onViewDetails={onViewDetails} />
        ))}
      </div>

      {totalFilteredPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalFilteredPages}
          totalItems={filteredInsights.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}
