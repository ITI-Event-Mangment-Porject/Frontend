export const getSimpleSentiment = (sentimentAnalysis) => {
    const text = sentimentAnalysis.toLowerCase()
    if (text.includes("positive") && !text.includes("negative")) return "Positive"
    if (text.includes("negative") && !text.includes("positive")) return "Negative"
    if (text.includes("mixed") || (text.includes("positive") && text.includes("negative"))) return "Mixed"
    if (text.includes("neutral")) return "Neutral"
    return "Mixed" // Default fallback
  }
  
  export const getSentimentColor = (sentiment) => {
    const simple = getSimpleSentiment(sentiment)
    if (simple === "Positive") return "text-green-600 bg-green-100"
    if (simple === "Negative") return "text-red-600 bg-red-100"
    if (simple === "Mixed") return "text-orange-600 bg-orange-100"
    return "text-gray-600 bg-gray-100"
  }
  
  export const getSatisfactionColor = (score) => {
    const numScore = Number.parseFloat(score)
    if (numScore >= 4.5) return "text-green-600 bg-green-100"
    if (numScore >= 3.5) return "text-blue-600 bg-blue-100"
    if (numScore >= 2.5) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }
  