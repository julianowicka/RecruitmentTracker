interface SkeletonCardProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="flex gap-4 mb-4 items-center">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
      </div>

      <div className="h-5 w-56 bg-gray-200 rounded mb-3" />

      <div className="h-4 w-48 bg-gray-200 rounded mb-2" />

      <div className="h-3.5 w-32 bg-gray-200 rounded" />
    </div>
  );
}

export function SkeletonCards({ count = 3 }: SkeletonCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

