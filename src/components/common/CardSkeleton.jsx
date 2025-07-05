import React from 'react';

const CardSkeleton = ({ count = 1 }) => {
  const skeletons = Array(count).fill(0);

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow-md"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 skeleton-wave"></div>
          </div>

          {/* Content skeleton */}
          <div className="p-5">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-wave"></div>
            </div>

            {/* Date line */}
            <div className="flex items-center mb-3">
              <div className="h-4 w-4 mr-2 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 skeleton-wave"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 skeleton-wave"></div>
              </div>
            </div>

            {/* Location line */}
            <div className="flex items-center mb-4">
              <div className="h-4 w-4 mr-2 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 skeleton-wave"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 skeleton-wave"></div>
              </div>
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 skeleton-wave"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
