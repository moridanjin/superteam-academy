import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <AppShell>
      {/* Header skeleton */}
      <div className="border-b border-white/5 pt-12 pb-10">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-4 w-28" />
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-12">
            <div className="flex-1">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-9 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <div className="mt-6 flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="w-full shrink-0 md:w-80">
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-6 w-40" />
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-36" />
            <div className="mt-4 flex flex-col gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
