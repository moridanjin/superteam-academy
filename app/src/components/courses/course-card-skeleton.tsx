import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-white/5 bg-neutral-900/50">
      <Skeleton className="h-36 rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="mt-auto flex gap-3 border-t border-white/5 pt-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-3 w-14" />
        </div>
      </div>
    </Card>
  );
}
