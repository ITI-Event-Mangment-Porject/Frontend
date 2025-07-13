"use client"

import { X, Brain, Zap, Loader2, CheckCircle, AlertCircle, Lightbulb, MessageSquare, Users } from "lucide-react"
import { formatDate } from "../../../utils/dateUtils"
import { isEmptyInsight } from "../../../utils/insightUtils"

export const InsightModal = ({
  insight,
  detailedInsight,
  onClose,
  onGenerateInsight,
  generatingInsight,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-6xl max-h-[98vh] sm:max-h-[95vh] rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-4 sm:p-6 lg:p-10 text-white overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10 touch-manipulation"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>

          <div className="relative max-w-4xl pr-12 sm:pr-16 lg:pr-20">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
              <span className="px-2 py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3 bg-white/20 rounded-full text-xs sm:text-sm lg:text-lg font-bold backdrop-blur-sm">
                ⭐ {insight.satisfaction_score}/5
              </span>
              <span className="px-2 py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3 bg-white/20 rounded-full text-xs sm:text-sm lg:text-lg font-bold backdrop-blur-sm">
                {insight.feedback_count} responses
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-5xl font-black mb-1 sm:mb-2 lg:mb-3 leading-tight">
              {insight.event.title}
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-xl font-medium">
              AI Insights • Generated {formatDate(insight.generated_at)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10">
            {isEmptyInsight(insight) ? (
              <EmptyInsightContent
                onGenerate={() => onGenerateInsight(insight.event.id)}
                generating={generatingInsight}
              />
            ) : detailedInsight ? (
              <DetailedInsightContent insight={detailedInsight} />
            ) : (
              <LoadingInsightContent />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const EmptyInsightContent = ({ onGenerate, generating }) => (
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
      onClick={onGenerate}
      disabled={generating}
      className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none min-h-[44px]"
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative flex items-center gap-2 sm:gap-3">
        {generating ? (
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
        ) : (
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
        {generating ? "Generating Analytics..." : "Create AI Analytics"}
      </div>
    </button>
  </div>
)

const LoadingInsightContent = () => (
  <div className="flex items-center justify-center h-48 sm:h-64">
    <div className="text-center">
      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#901b20] animate-spin mx-auto mb-3 sm:mb-4" />
      <p className="text-gray-600 font-medium text-sm sm:text-base">Loading detailed insights...</p>
    </div>
  </div>
)

const DetailedInsightContent = ({ insight }) => (
  <div className="space-y-6 sm:space-y-8 lg:space-y-12">
    {/* Summary */}
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
        <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#901b20] flex-shrink-0" />
        <span className="leading-tight">Executive Summary</span>
      </h2>
      <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
        {insight.insights.analysis.summary}
      </p>
    </div>

    {/* Key Strengths */}
    {insight.insights.analysis.key_strengths && (
      <InsightSection
        title="Key Strengths"
        icon={CheckCircle}
        iconColor="text-green-600"
        items={insight.insights.analysis.key_strengths}
        bgColor="bg-green-50"
        borderColor="border-green-200"
        textColor="text-green-800"
        itemBgColor="bg-green-500"
      />
    )}

    {/* Areas for Improvement */}
    {insight.insights.analysis.areas_for_improvement && (
      <InsightSection
        title="Areas for Improvement"
        icon={AlertCircle}
        iconColor="text-yellow-600"
        items={insight.insights.analysis.areas_for_improvement}
        bgColor="bg-yellow-50"
        borderColor="border-yellow-200"
        textColor="text-yellow-800"
        itemBgColor="bg-yellow-500"
      />
    )}

    {/* Recommendations */}
    {insight.insights.analysis.recommendations && (
      <div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-[#901b20] flex-shrink-0" />
          <span className="leading-tight">AI Recommendations</span>
        </h3>
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {insight.insights.analysis.recommendations.map((rec, index) => (
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
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">{rec.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Common Themes */}
    {insight.insights.analysis.common_themes && (
      <InsightSection
        title="Common Themes"
        icon={MessageSquare}
        iconColor="text-[#203947]"
        items={insight.insights.analysis.common_themes}
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        textColor="text-[#203947]"
        itemBgColor="bg-[#203947]"
      />
    )}

    {/* Additional Insights */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
      {insight.insights.analysis.attendance_insights && (
        <AdditionalInsightCard
          title="Attendance Insights"
          icon={Users}
          iconColor="text-[#ad565a]"
          content={insight.insights.analysis.attendance_insights}
        />
      )}

      {insight.insights.analysis.technical_feedback && (
        <AdditionalInsightCard
          title="Technical Feedback"
          icon={Zap}
          iconColor="text-[#cc9598]"
          content={insight.insights.analysis.technical_feedback}
        />
      )}
    </div>
  </div>
)

const InsightSection = ({
  title,
  icon: Icon,
  iconColor,
  items,
  bgColor,
  borderColor,
  textColor,
  itemBgColor,
}) => (
  <div>
    <h3
      className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3`}
    >
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor} flex-shrink-0`} />
      <span className="leading-tight">{title}</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className={`${bgColor} border-2 ${borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${itemBgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <p className={`${textColor} font-medium text-xs sm:text-sm lg:text-base leading-relaxed`}>{item}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const AdditionalInsightCard = ({ title, icon: Icon, iconColor, content }) => (
  <div className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300">
    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor} flex-shrink-0`} />
      <span className="leading-tight">{title}</span>
    </h3>
    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">{content}</p>
  </div>
)
