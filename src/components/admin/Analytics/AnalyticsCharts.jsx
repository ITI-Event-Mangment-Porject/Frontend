"use client"

import { useMemo } from "react"
import { BarChart3, PieChart, TrendingUp } from "lucide-react"
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
import { getSimpleSentiment } from "../../../utils/sentimentUtils"

export const AnalyticsCharts = ({ insights }) => {
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

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h2 className="text-4xl font-black text-primary mb-4">Feedback Analytics Dashboard</h2>
        <p className="text-sm sm:text-lg lg:text-xl text-gray-600 font-medium leading-relaxed">
          Comprehensive insights and trends from event feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Satisfaction Scores Chart */}
        <ChartCard title="Satisfaction Scores" icon={BarChart3} iconColor="from-[#901b20] to-[#ad565a]">
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
        </ChartCard>

        {/* Sentiment Analysis */}
        <ChartCard title="Sentiment Analysis" icon={PieChart} iconColor="from-[#203947] to-[#ad565a]">
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
        </ChartCard>
      </div>

      {/* Feedback Trends */}
      <ChartCard title="Satisfaction Trends" icon={TrendingUp} iconColor="from-[#ad565a] to-[#cc9598]" fullWidth>
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
      </ChartCard>
    </div>
  )
}

const ChartCard = ({ title, icon: Icon, iconColor, children, fullWidth }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 ${fullWidth ? "col-span-full" : ""}`}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${iconColor} rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <span className="leading-tight">{title}</span>
        </h3>
      </div>
      <div className="h-48 sm:h-64 lg:h-80">{children}</div>
    </div>
  )
}
