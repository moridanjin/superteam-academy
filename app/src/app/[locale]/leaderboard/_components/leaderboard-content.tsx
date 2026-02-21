"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useUserRank } from "@/hooks/use-user-rank";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeInStagger, FadeInItem } from "@/components/motion";
import { Podium } from "./podium";
import { LeaderboardTable } from "./leaderboard-table";
import { LeaderboardFilters, type TimeFilter } from "./leaderboard-filters";
import { LeaderboardPagination } from "./leaderboard-pagination";
import { YourRankCard } from "./your-rank-card";

const PAGE_SIZE = 50;

export function LeaderboardContent() {
  const t = useTranslations("leaderboard");
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: entries, loading: entriesLoading } = useLeaderboard(page);
  const { data: userRank, loading: rankLoading } = useUserRank();

  const loading = entriesLoading || rankLoading;

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.displayName.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  const totalItems = entries?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-center gap-4">
          <Skeleton className="h-32 w-28 rounded-xl" />
          <Skeleton className="h-40 w-28 rounded-xl" />
          <Skeleton className="h-28 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
        <p className="text-sm text-neutral-500">{t("emptyState")}</p>
      </div>
    );
  }

  return (
    <FadeInStagger className="space-y-6">
      <FadeInItem>
        <Podium entries={entries} />
      </FadeInItem>

      <FadeInItem>
        <YourRankCard rank={userRank} />
      </FadeInItem>

      <FadeInItem>
        <LeaderboardFilters
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </FadeInItem>

      <FadeInItem>
        <LeaderboardTable
          entries={filteredEntries}
          currentUserId={user?.id ?? userRank?.userId ?? null}
          startRank={page * PAGE_SIZE + 1}
        />
      </FadeInItem>

      <FadeInItem>
        <LeaderboardPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      </FadeInItem>
    </FadeInStagger>
  );
}
