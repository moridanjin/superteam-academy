import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <AppShell>
      <div className="border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </AppShell>
  );
}
