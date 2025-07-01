import React from 'react';

const StatCounterSkeleton = ({
  width = 'w-24',
  height = 'h-8',
  style = {},
}) => {
  return (
    <div className="animate-pulse space-y-2">
      {/* Main stat number skeleton */}
      <div
        className={`${height} ${width} bg-gray-200 rounded-md shimmer-effect`}
        style={style}
      ></div>

      {/* Trend indicator skeleton */}
      <div className="flex items-center space-x-1">
        <div className="h-3 w-3 bg-gray-200 rounded-sm shimmer-effect"></div>
        <div className="h-3 w-16 bg-gray-200 rounded-md shimmer-effect"></div>
      </div>
    </div>
  );
};

export default StatCounterSkeleton;
