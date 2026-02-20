import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <AppShell>
      <div className="border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </AppShell>
  );
}
