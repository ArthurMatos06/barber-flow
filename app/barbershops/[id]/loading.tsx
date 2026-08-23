import { Skeleton } from "@/app/components/ui/skeleton"

export default function BarbershopPageLoading() {
  return (
    <div>
      <Skeleton className="h-62.5 w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
