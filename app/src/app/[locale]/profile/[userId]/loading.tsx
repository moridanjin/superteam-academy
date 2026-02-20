import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfileLoading() {
  return (
    <AppShell>
      <div className="border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-32" />
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
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </AppShell>
  );
}
