import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="group">
      <div className="relative bg-card rounded-sm overflow-hidden luxury-border">
        {/* Image skeleton */}
        <div className="aspect-square">
          <Skeleton className="w-full h-full" />
        </div>
        
        {/* Product info skeleton */}
        <div className="p-4 space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-full" />
            ))}
            <Skeleton className="h-3 w-8 ml-1" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}