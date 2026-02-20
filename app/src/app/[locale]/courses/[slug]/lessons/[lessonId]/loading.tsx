import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="flex h-dvh flex-col bg-neutral-950">
      {/* Top bar skeleton */}
      <div className="shrink-0 border-b border-white/[0.06]">
        <div className="flex h-12 items-center gap-3 px-4">
          <Skeleton className="h-4 w-24" />
          <div className="mx-2 h-4 w-px bg-white/[0.06]" />
          <Skeleton className="h-4 w-48 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-0.5 w-full rounded-none" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-10">
          <div className="mx-auto max-w-3xl">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-2/3" />
            <Skeleton className="mt-8 h-6 w-48" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-5/6" />
            <Skeleton className="mt-6 h-32 w-full rounded-lg" />
            <Skeleton className="mt-8 h-6 w-40" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-4/5" />
          </div>
        </div>

        {/* Sidebar skeleton (desktop) */}
        <div className="hidden w-72 border-l border-white/[0.06] p-4 lg:block">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
