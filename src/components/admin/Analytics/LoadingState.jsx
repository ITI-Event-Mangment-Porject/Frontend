export const LoadingState = () => {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2 sm:w-1/4 mb-4 sm:mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shimmer-effect h-24 sm:h-32"></div>
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
  