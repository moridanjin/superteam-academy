import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <AppShell>
      <div className="border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </AppShell>
  );
}
