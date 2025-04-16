import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
      </div>

      <Skeleton className="mt-6 h-12 w-full" />

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-80 w-full rounded-lg lg:col-span-4" />
        <Skeleton className="h-80 w-full rounded-lg lg:col-span-3" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
      </div>

      <Skeleton className="mt-6 h-64 w-full rounded-lg" />
    </div>
  )
}

