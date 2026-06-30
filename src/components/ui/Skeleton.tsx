export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} aria-hidden="true" />
}

export function MentorCardSkeleton() {
  return (
    <div className="fade-in-section overflow-hidden rounded-xl border border-border/80 bg-surface shadow-sm">
      <div className="border-b border-border bg-surface-alt/70 px-6 pb-5 pt-6">
        <div className="flex items-start justify-between">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-5 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-4 w-28" />
        <Skeleton className="mt-3 h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
