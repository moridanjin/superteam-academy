"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type LeaderboardPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
};

export function LeaderboardPagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: LeaderboardPaginationProps) {
  const t = useTranslations("leaderboard");

  if (totalPages <= 1) return null;

  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-neutral-500">{t("showing", { from, to })}</p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-xs text-neutral-400">
          {t("page")} {page + 1} {t("of")} {totalPages}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
