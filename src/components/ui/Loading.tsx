/**
 * Loading spinner component
 * Displays a centered loading spinner with optional text
 */
export function Loading({ text = 'Ładowanie...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

/**
 * Loading skeleton for cards
 */
export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

/**
 * Loading state for lists
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

