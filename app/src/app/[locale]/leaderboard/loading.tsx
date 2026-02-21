import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
  return (
    <AppShell>
      <div className="border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Podium skeleton */}
        <div className="flex items-end justify-center gap-4">
          <Skeleton className="h-32 w-28 rounded-xl" />
          <Skeleton className="h-40 w-28 rounded-xl" />
          <Skeleton className="h-28 w-28 rounded-xl" />
        </div>
        {/* Table skeleton */}
        <Skeleton className="h-12 rounded-xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </AppShell>
  );
}
