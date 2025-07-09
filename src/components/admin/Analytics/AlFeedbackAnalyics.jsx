"use client"

import { getFriendlyErrorMessage } from "../../../utils/errorMessages"
import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Brain,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Lightbulb,
  Zap,
  Clock,
  X,
} from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  LineChart,
  Line,
} from "recharts"
import { useNavigate } from "react-router-dom"

const FeedbackAnalytics = () => {
  const [insights, setInsights] = useState([])
  const [selectedInsight, setSelectedInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generatingInsight, setGeneratingInsight] = useState(false)
  const [detailedInsight, setDetailedInsight] = useState(null)
  const [eventsNeedingInsights, setEventsNeedingInsights] = useState([])
  const [autoGenerating, setAutoGenerating] = useState(false)
  const itemsPerPage = 6

  // Static admin token as provided
  const ADMIN_TOKEN = localStorage.getItem("token")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login") // redirect to login if token is missing
    }
  }, [navigate])

  const fetchAllInsights = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8000/api/ai-insights/all", {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setInsights(data.data || [])
      } else {
        throw new Error(data.message || "Failed to fetch insights")
      }
    } catch (err) {
      setError(err.message || "Error loading insights")
      console.error("Error fetching insights:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetailedInsight = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/ai-insights/events/${eventId}/detailed`, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setDetailedInsight(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch detailed insight")
      }
    } catch (err) {
      console.error("Error fetching detailed insight:", err)
      setError(err.message || "Error loading detailed insight")
    }
  }

  const generateInsight = async (eventId) => {
    try {
      setGeneratingInsight(true)
      const response = await fetch(`http://localhost:8000/api/ai-insights/events/${eventId}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regenerate: true }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Refresh insights after generation
        await fetchAllInsights()
        // Close modal and show success
        setIsModalOpen(false)
        // You could add a success toast here if needed
      } else {
        throw new Error(data.message || "Failed to generate insight")
      }
    } catch (err) {
      console.error("Error generating insight:", err)
      setError(err.message || "Error generating insight")
    } finally {
      setGeneratingInsight(false)
    }
  }

  const fetchEventsNeedingInsights = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ai-insights/events-needing-insights", {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setEventsNeedingInsights(data.data || [])
      }
    } catch (err) {
      console.error("Error fetching events needing insights:", err)
    }
  }

  const autoGenerateAllInsights = async () => {
    try {
      setAutoGenerating(true)
      const response = await fetch("http://localhost:8000/api/ai-insights/auto-generate-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Refresh insights and events needing insights after generation
        await fetchAllInsights()
        await fetchEventsNeedingInsights()
      } else {
        throw new Error(data.message || "Failed to auto-generate insights")
      }
    } catch (err) {
      console.error("Error auto-generating insights:", err)
      setError(err.message || "Error auto-generating insights")
    } finally {
      setAutoGenerating(false)
    }
  }

  const isEmptyInsight = (insight) => {
    return (
      insight.summary === "No summary available" ||
      insight.sentiment_analysis === "Not available" ||
      insight.feedback_count === 0
    )
  }

  // Extract simple sentiment from complex analysis
  const getSimpleSentiment = (sentimentAnalysis) => {
    const text = sentimentAnalysis.toLowerCase()
    if (text.includes("positive") && !text.includes("negative")) return "Positive"
    if (text.includes("negative") && !text.includes("positive")) return "Negative"
    if (text.includes("mixed") || (text.includes("positive") && text.includes("negative"))) return "Mixed"
    if (text.includes("neutral")) return "Neutral"
    return "Mixed" // Default fallback
  }

  useEffect(() => {
    fetchAllInsights()
    fetchEventsNeedingInsights()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType])

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

  // Analytics data for charts
  const analyticsData = useMemo(() => {
    const satisfactionData = insights.map((insight) => ({
      name: insight.event.title.substring(0, 15) + "...",
      score: Number.parseFloat(insight.satisfaction_score),
      feedbackCount: insight.feedback_count,
    }))

    const sentimentData = [
      {
        name: "Positive",
        value: insights.filter((i) => getSimpleSentiment(i.sentiment_analysis) === "Positive").length,
        color: "#10b981",
      },
      {
        name: "Mixed",
        value: insights.filter((i) => getSimpleSentiment(i.sentiment_analysis) === "Mixed").length,
        color: "#f59e0b",
      },
      {
        name: "Negative",
        value: insights.filter((i) => getSimpleSentiment(i.sentiment_analysis) === "Negative").length,
        color: "#ef4444",
      },
      {
        name: "Neutral",
        value: insights.filter((i) => getSimpleSentiment(i.sentiment_analysis) === "Neutral").length,
        color: "#6b7280",
      },
    ]

    const feedbackTrends = insights
      .sort((a, b) => new Date(a.generated_at) - new Date(b.generated_at))
      .slice(-7)
      .map((insight) => ({
        date: new Date(insight.generated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        satisfaction: Number.parseFloat(insight.satisfaction_score),
        feedbackCount: insight.feedback_count,
      }))

    return { satisfactionData, sentimentData, feedbackTrends }
  }, [insights])

  const handleRefresh = () => {
    setCurrentPage(1)
    fetchAllInsights()
    fetchEventsNeedingInsights()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getSentimentColor = (sentiment) => {
    const simple = getSimpleSentiment(sentiment)
    if (simple === "Positive") return "text-green-600 bg-green-100"
    if (simple === "Negative") return "text-red-600 bg-red-100"
    if (simple === "Mixed") return "text-orange-600 bg-orange-100"
    return "text-gray-600 bg-gray-100"
  }

  const getSatisfactionColor = (score) => {
    const numScore = Number.parseFloat(score)
    if (numScore >= 4.5) return "text-green-600 bg-green-100"
    if (numScore >= 3.5) return "text-blue-600 bg-blue-100"
    if (numScore >= 2.5) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const handleViewDetails = async (insight) => {
    setSelectedInsight(insight)
    setIsModalOpen(true)
    setDetailedInsight(null)
    await fetchDetailedInsight(insight.event.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2 sm:w-1/4 mb-4 sm:mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shimmer-effect h-24 sm:h-32"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shimmer-effect"
                >
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-16 sm:h-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    const message = getFriendlyErrorMessage(error)
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Enhanced Mobile-First Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-primary mb-2">Feedback Analytics</h1>
              <p className="text-lg text-gray-600 font-medium">
                AI-powered insights from event feedback and satisfaction scores
              </p>
            </div>
            <button
              onClick={handleRefresh}
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

        {/* Enhanced Mobile-Responsive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 flex-shrink-0">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2 leading-tight">
                Total Insights
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#901b20] animate-pulse">
                {insights.length}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2 leading-tight">
                Avg Satisfaction
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-green-600 animate-pulse">
                {insights.length > 0
                  ? (
                      insights.reduce((sum, insight) => sum + Number.parseFloat(insight.satisfaction_score), 0) /
                      insights.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:w-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 flex-shrink-0">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2 leading-tight">
                Total Feedback
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#203947]">
                {insights.reduce((sum, insight) => sum + insight.feedback_count, 0)}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 flex-shrink-0">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2 leading-tight">
                Need Insights
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-600">
                {eventsNeedingInsights.length}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile-Responsive Alert Banner */}
        {eventsNeedingInsights.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-12 animate-fade-in">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-orange-800 mb-1 sm:mb-2">
                    {eventsNeedingInsights.length} Event
                    {eventsNeedingInsights.length !== 1 ? "s" : ""} Need AI Insights
                  </h3>
                  <p className="text-orange-700 font-medium text-sm sm:text-base leading-relaxed">
                    Generate AI-powered analytics for events with feedback but no insights yet.
                  </p>
                </div>
              </div>
              <button
                onClick={autoGenerateAllInsights}
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
        )}

        {/* Enhanced Mobile-Responsive Filters */}
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
                  style={{
                    backgroundImage: "none",
                  }}
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

        {/* Enhanced Mobile-Responsive Insights Grid */}
        {paginatedInsights.length === 0 ? (
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
                onClick={handleRefresh}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-h-[44px]"
              >
                Refresh Analytics
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
              {paginatedInsights.map((insight, index) => (
                <div
                  key={insight.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden animate-slide-in-left flex flex-col h-full border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced Mobile-Responsive Header */}
                  <div className="h-48 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <Brain className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>

                    {/* Mobile-Optimized Badges */}
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
                        <span className="font-medium text-xs sm:text-sm lg:text-base">
                          {formatDate(insight.event.date)}
                        </span>
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
                        <span className="font-medium text-xs sm:text-sm lg:text-base">
                          {formatDate(insight.generated_at)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-gray-700 text-xs sm:text-sm lg:text-base line-clamp-3 leading-relaxed">
                        {insight.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 sm:pt-4 lg:pt-6 border-t border-gray-100 mt-auto">
                      <button
                        onClick={() => handleViewDetails(insight)}
                        className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-sm lg:text-base min-h-[40px] sm:min-h-[44px] flex items-center justify-center"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="relative">View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Mobile-Responsive Pagination */}
            {totalFilteredPages > 1 && (
              <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 lg:mb-12">
                <div className="flex flex-col gap-4">
                  <div className="text-xs sm:text-sm lg:text-lg text-gray-600 font-medium text-center">
                    Showing <span className="font-bold text-[#901b20]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-bold text-[#901b20]">
                      {Math.min(currentPage * itemsPerPage, filteredInsights.length)}
                    </span>{" "}
                    of <span className="font-bold text-[#901b20]">{filteredInsights.length}</span> insights
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm lg:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300 font-medium min-h-[40px] sm:min-h-[44px]"
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {[...Array(Math.min(3, totalFilteredPages))].map((_, i) => {
                        let pageNum
                        if (totalFilteredPages <= 3) {
                          pageNum = i + 1
                        } else if (currentPage <= 2) {
                          pageNum = i + 1
                        } else if (currentPage >= totalFilteredPages - 1) {
                          pageNum = totalFilteredPages - 2 + i
                        } else {
                          pageNum = currentPage - 1 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
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
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalFilteredPages))}
                      disabled={currentPage === totalFilteredPages}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm lg:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300 font-medium min-h-[40px] sm:min-h-[44px]"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enhanced Mobile-Responsive Analytics Section */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 animate-fade-in">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-4xl font-black text-primary mb-4">Feedback Analytics Dashboard</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 font-medium leading-relaxed">
              Comprehensive insights and trends from event feedback
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Mobile-Responsive Satisfaction Scores Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="leading-tight">Satisfaction Scores</span>
                </h3>
              </div>
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: 600 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 10, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid var(--primary-400)",
                        borderRadius: "12px",
                        boxShadow: "0 0 10px var(--primary-400)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="score" fill="var(--secondary-400)" name="Satisfaction Score" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mobile-Responsive Sentiment Analysis */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="leading-tight">Sentiment Analysis</span>
                </h3>
              </div>
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid #901b20",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Feedback Trends */}
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#ad565a] to-[#cc9598] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span className="leading-tight">Satisfaction Trends</span>
              </h3>
            </div>
            <div className="h-48 sm:h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.feedbackTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 600 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10, fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #901b20",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="#901b20"
                    strokeWidth={3}
                    dot={{ fill: "#901b20", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#901b20", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile-Responsive Modal */}
        {isModalOpen && selectedInsight && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fade-in">
            <div className="bg-white w-full max-w-6xl max-h-[98vh] sm:max-h-[95vh] rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              {/* Enhanced Mobile-Responsive Header */}
              <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-4 sm:p-6 lg:p-10 text-white overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-black/10"></div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 touch-manipulation"
                  style={{ minHeight: "44px", minWidth: "44px" }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                </button>

                <div className="relative max-w-4xl pr-12 sm:pr-16 lg:pr-20">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
                    <span className="px-2 py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3 bg-white/20 rounded-full text-xs sm:text-sm lg:text-lg font-bold backdrop-blur-sm">
                      ⭐ {selectedInsight.satisfaction_score}/5
                    </span>
                    <span className="px-2 py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3 bg-white/20 rounded-full text-xs sm:text-sm lg:text-lg font-bold backdrop-blur-sm">
                      {selectedInsight.feedback_count} responses
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-5xl font-black mb-1 sm:mb-2 lg:mb-3 leading-tight">
                    {selectedInsight.event.title}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-xl font-medium">
                    AI Insights • Generated {formatDate(selectedInsight.generated_at)}
                  </p>
                </div>
              </div>

              {/* Enhanced Mobile-Responsive Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 sm:p-6 lg:p-10">
                  {isEmptyInsight(selectedInsight) ? (
                    <div className="text-center py-8 sm:py-12 lg:py-16">
                      <div className="text-gray-300 mb-4 sm:mb-6 lg:mb-8 animate-float">
                        <Brain className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 mx-auto" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                        No AI Analytics Available
                      </h3>
                      <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                        Generate AI-powered insights and analytics for this event's feedback.
                      </p>
                      <button
                        onClick={() => generateInsight(selectedInsight.event.id)}
                        disabled={generatingInsight}
                        className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none min-h-[44px]"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2 sm:gap-3">
                          {generatingInsight ? (
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                          ) : (
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                          {generatingInsight ? "Generating Analytics..." : "Create AI Analytics"}
                        </div>
                      </button>
                    </div>
                  ) : detailedInsight ? (
                    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
                      {/* Summary */}
                      <div className="bg-gray-50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                          <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#901b20] flex-shrink-0" />
                          <span className="leading-tight">Executive Summary</span>
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                          {detailedInsight.insights.analysis.summary}
                        </p>
                      </div>

                      {/* Key Strengths */}
                      {detailedInsight.insights.analysis.key_strengths && (
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                            <span className="leading-tight">Key Strengths</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                            {detailedInsight.insights.analysis.key_strengths.map((strength, index) => (
                              <div
                                key={index}
                                className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                                  </div>
                                  <p className="text-green-800 font-medium text-xs sm:text-sm lg:text-base leading-relaxed">
                                    {strength}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Areas for Improvement */}
                      {detailedInsight.insights.analysis.areas_for_improvement && (
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0" />
                            <span className="leading-tight">Areas for Improvement</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                            {detailedInsight.insights.analysis.areas_for_improvement.map((area, index) => (
                              <div
                                key={index}
                                className="bg-yellow-50 border-2 border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                                  </div>
                                  <p className="text-yellow-800 font-medium text-xs sm:text-sm lg:text-base leading-relaxed">
                                    {area}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {detailedInsight.insights.analysis.recommendations && (
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-[#901b20] flex-shrink-0" />
                            <span className="leading-tight">AI Recommendations</span>
                          </h3>
                          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                            {detailedInsight.insights.analysis.recommendations.map((rec, index) => (
                              <div
                                key={index}
                                className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300 ${
                                  rec.priority === "high"
                                    ? "bg-red-50 border-red-200"
                                    : rec.priority === "medium"
                                      ? "bg-blue-50 border-blue-200"
                                      : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <div className="flex items-start gap-3 sm:gap-4">
                                  <div
                                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                                      rec.priority === "high"
                                        ? "bg-red-500 text-white"
                                        : rec.priority === "medium"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-500 text-white"
                                    }`}
                                  >
                                    {rec.priority}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg leading-tight">
                                      {rec.action}
                                    </h4>
                                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                                      {rec.impact}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Common Themes */}
                      {detailedInsight.insights.analysis.common_themes && (
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#203947] flex-shrink-0" />
                            <span className="leading-tight">Common Themes</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                            {detailedInsight.insights.analysis.common_themes.map((theme, index) => (
                              <div
                                key={index}
                                className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-[#203947] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                                  </div>
                                  <p className="text-[#203947] font-medium text-xs sm:text-sm lg:text-base leading-relaxed">
                                    {theme}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Insights */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {/* Attendance Insights */}
                        {detailedInsight.insights.analysis.attendance_insights && (
                          <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#ad565a] flex-shrink-0" />
                              <span className="leading-tight">Attendance Insights</span>
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
                              {detailedInsight.insights.analysis.attendance_insights}
                            </p>
                          </div>
                        )}

                        {/* Technical Feedback */}
                        {detailedInsight.insights.analysis.technical_feedback && (
                          <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#cc9598] flex-shrink-0" />
                              <span className="leading-tight">Technical Feedback</span>
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
                              {detailedInsight.insights.analysis.technical_feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 sm:h-64">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#901b20] animate-spin mx-auto mb-3 sm:mb-4" />
                        <p className="text-gray-600 font-medium text-sm sm:text-base">Loading detailed insights...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackAnalytics
