"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TimeFilter = "all" | "monthly" | "weekly";

type LeaderboardFiltersProps = {
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

const TIME_FILTERS: { key: TimeFilter; i18nKey: string }[] = [
  { key: "all", i18nKey: "filterAll" },
  { key: "monthly", i18nKey: "filterMonthly" },
  { key: "weekly", i18nKey: "filterWeekly" },
];

export function LeaderboardFilters({
  timeFilter,
  onTimeFilterChange,
  searchQuery,
  onSearchChange,
}: LeaderboardFiltersProps) {
  const t = useTranslations("leaderboard");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
        {TIME_FILTERS.map(({ key, i18nKey }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 rounded-md px-3 text-xs font-medium transition-colors",
              timeFilter === key
                ? "bg-solana-purple/20 text-solana-purple"
                : "text-neutral-400 hover:text-neutral-200"
            )}
            onClick={() => onTimeFilterChange(key)}
          >
            {t(i18nKey)}
          </Button>
        ))}
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 border-white/[0.06] bg-white/[0.02] pl-9 text-sm text-neutral-200 placeholder:text-neutral-500"
        />
      </div>
    </div>
  );
}
