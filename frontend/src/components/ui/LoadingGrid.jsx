// frontend/src/components/ui/LoadingGrid.jsx
export default function LoadingGrid({ count = 3 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-200 animate-shimmer" />

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer" />
              <div className="h-4 bg-gray-200 rounded w-16 animate-shimmer" />
            </div>

            <div className="h-6 bg-gray-200 rounded mb-3 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded mb-3 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded mb-3 w-2/3 animate-shimmer" />

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-shimmer" />
                <div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-shimmer" />
                  <div className="h-2 bg-gray-200 rounded w-12 animate-shimmer" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-12 animate-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
