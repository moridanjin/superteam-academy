import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";

export default function CoursesLoading() {
  return (
    <AppShell>
      {/* Header skeleton */}
      <div className="border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-3 h-4 w-80" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
