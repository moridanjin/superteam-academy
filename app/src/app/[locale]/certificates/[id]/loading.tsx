import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateDetailLoading() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-12 w-64" />
      </div>
    </AppShell>
  );
}
