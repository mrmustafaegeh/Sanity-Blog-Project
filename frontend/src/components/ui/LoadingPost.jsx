// frontend/src/components/ui/LoadingPost.jsx
export default function LoadingPost() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button Skeleton */}
      <div className="h-4 bg-gray-200 rounded w-24 animate-shimmer" />

      {/* Header Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-shimmer" />
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-shimmer" />
        </div>

        <div className="h-12 bg-gray-200 rounded w-3/4 animate-shimmer" />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-shimmer" />
            <div className="h-3 bg-gray-200 rounded w-20 animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-shimmer" />
            <div className="h-3 bg-gray-200 rounded w-24 animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-shimmer" />
            <div className="h-3 bg-gray-200 rounded w-16 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="h-96 bg-gray-200 rounded-2xl animate-shimmer" />

      {/* Action Buttons Skeleton */}
      <div className="flex justify-between py-4 border-y border-gray-200">
        <div className="flex gap-4">
          <div className="h-8 bg-gray-200 rounded w-16 animate-shimmer" />
          <div className="h-8 bg-gray-200 rounded w-16 animate-shimmer" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* TOC Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-shimmer" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded w-full animate-shimmer"
              />
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-shimmer" />
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded w-full animate-shimmer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
