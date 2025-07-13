import { Brain, Star, MessageSquare, AlertCircle } from "lucide-react"

export const AnalyticsStats = ({ insights, eventsNeedingInsights }) => {
  const avgSatisfaction =
    insights.length > 0
      ? (
          insights.reduce((sum, insight) => sum + Number.parseFloat(insight.satisfaction_score), 0) / insights.length
        ).toFixed(1)
      : "0.0"

  const totalFeedback = insights.reduce((sum, insight) => sum + insight.feedback_count, 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Brain}
        title="Total Insights"
        value={insights.length}
        color="from-[#901b20] to-[#ad565a]"
        bgColor="from-[#901b20]/5"
      />

      <StatCard
        icon={Star}
        title="Avg Satisfaction"
        value={avgSatisfaction}
        color="from-green-500 to-green-600"
        bgColor="from-green-500/5"
      />

      <StatCard
        icon={MessageSquare}
        title="Total Feedback"
        value={totalFeedback}
        color="from-[#203947] to-[#ad565a]"
        bgColor="from-[#203947]/5"
      />

      <StatCard
        icon={AlertCircle}
        title="Need Insights"
        value={eventsNeedingInsights.length}
        color="from-orange-500 to-orange-600"
        bgColor="from-orange-500/5"
      />
    </div>
  )
}

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${color} rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 flex-shrink-0`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2 leading-tight">
          {title}
        </p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-black text-primary animate-pulse">{value}</p>
      </div>
    </div>
  )
}
