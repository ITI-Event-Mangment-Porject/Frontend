export const isEmptyInsight = (insight) => {
    return (
      insight.summary === "No summary available" ||
      insight.sentiment_analysis === "Not available" ||
      insight.feedback_count === 0
    )
  }
  