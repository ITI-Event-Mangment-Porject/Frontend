"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getFriendlyErrorMessage } from "../../../utils/errorMessages"
import { AnalyticsHeader } from "./AnalyticsHeader"
import { AnalyticsStats } from "./AnalyticsStats"
import { AlertBanner } from "./AlertBanner"
import { AnalyticsFilters } from "./AnalyticsFilters"
import { InsightsGrid } from "./InsightsGrid"
import { AnalyticsCharts } from "./AnalyticsCharts"
import { InsightModal } from "./InsightModal"
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"
import { useAnalyticsData } from "../../../hooks/useAnalyticsData"

const FeedbackAnalytics = () => {
  const navigate = useNavigate()
  const {
    insights,
    eventsNeedingInsights,
    loading,
    error,
    fetchAllInsights,
    fetchEventsNeedingInsights,
    generateInsight,
    autoGenerateAllInsights,
    fetchDetailedInsight,
  } = useAnalyticsData()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInsight, setSelectedInsight] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generatingInsight, setGeneratingInsight] = useState(false)
  const [detailedInsight, setDetailedInsight] = useState(null)
  const [autoGenerating, setAutoGenerating] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  useEffect(() => {
    fetchAllInsights()
    fetchEventsNeedingInsights()
  }, [])

  const handleRefresh = () => {
    setCurrentPage(1)
    fetchAllInsights()
    fetchEventsNeedingInsights()
  }

  const handleViewDetails = async (insight) => {
    setSelectedInsight(insight)
    setIsModalOpen(true)
    setDetailedInsight(null)
    await fetchDetailedInsight(insight.event.id)
  }

  const handleGenerateInsight = async (eventId) => {
    setGeneratingInsight(true)
    try {
      await generateInsight(eventId)
      setIsModalOpen(false)
    } finally {
      setGeneratingInsight(false)
    }
  }

  const handleAutoGenerate = async () => {
    setAutoGenerating(true)
    try {
      await autoGenerateAllInsights()
    } finally {
      setAutoGenerating(false)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    const message = getFriendlyErrorMessage(error)
    return <ErrorState message={message} />
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <AnalyticsHeader onRefresh={handleRefresh} loading={loading} />

        <AnalyticsStats insights={insights} eventsNeedingInsights={eventsNeedingInsights} />

        {eventsNeedingInsights.length > 0 && (
          <AlertBanner
            eventsCount={eventsNeedingInsights.length}
            onAutoGenerate={handleAutoGenerate}
            autoGenerating={autoGenerating}
          />
        )}

        <AnalyticsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <InsightsGrid
          insights={insights}
          searchTerm={searchTerm}
          selectedType={selectedType}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onViewDetails={handleViewDetails}
          onRefresh={handleRefresh}
        />

        <AnalyticsCharts insights={insights} />

        {isModalOpen && selectedInsight && (
          <InsightModal
            insight={selectedInsight}
            detailedInsight={detailedInsight}
            onClose={() => setIsModalOpen(false)}
            onGenerateInsight={handleGenerateInsight}
            generatingInsight={generatingInsight}
          />
        )}
      </div>
    </div>
  )
}

export default FeedbackAnalytics
