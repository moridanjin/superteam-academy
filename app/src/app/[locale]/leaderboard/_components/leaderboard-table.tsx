"use client";

import { useTranslations } from "next-intl";
import type { LeaderboardEntry } from "@/lib/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
  startRank?: number;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRankDisplay(rank: number): string {
  return `#${rank}`;
}

export function LeaderboardTable({
  entries,
  currentUserId,
  startRank = 1,
}: LeaderboardTableProps) {
  const t = useTranslations("leaderboard");
  const tGamification = useTranslations("gamification");

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
        <p className="text-sm text-neutral-500">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
      {/* Header */}
      <div className="grid grid-cols-[3rem_1fr_5rem_4rem] gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs font-medium text-neutral-500 sm:grid-cols-[4rem_1fr_6rem_5rem]">
        <span>{t("rank")}</span>
        <span>{t("player")}</span>
        <span className="text-right">{t("xp")}</span>
        <span className="text-right">{t("level")}</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.04]">
        {entries.map((entry, i) => {
          const isCurrentUser = entry.userId === currentUserId;
          const rank = entry.rank || startRank + i;

          return (
            <div
              key={entry.userId}
              className={cn(
                "grid grid-cols-[3rem_1fr_5rem_4rem] items-center gap-2 px-4 py-3 transition-colors sm:grid-cols-[4rem_1fr_6rem_5rem]",
                isCurrentUser
                  ? "bg-solana-purple/[0.08] border-l-solana-purple border-l-2"
                  : "hover:bg-white/[0.02]"
              )}
            >
              {/* Rank */}
              <span
                className={cn(
                  "text-sm font-semibold",
                  rank <= 3 ? "text-amber-400" : "text-neutral-400"
                )}
              >
                {getRankDisplay(rank)}
              </span>

              {/* Player */}
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar className="h-8 w-8 shrink-0">
                  {entry.avatarUrl && (
                    <AvatarImage
                      src={entry.avatarUrl}
                      alt={entry.displayName}
                    />
                  )}
                  <AvatarFallback className="bg-neutral-800 text-xs text-neutral-300">
                    {getInitials(entry.displayName)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "truncate text-sm font-medium",
                    isCurrentUser ? "text-solana-purple" : "text-neutral-200"
                  )}
                >
                  {entry.displayName}
                  {isCurrentUser && (
                    <span className="ml-1.5 text-xs text-neutral-500">
                      ({t("yourRank")})
                    </span>
                  )}
                </span>
              </div>

              {/* XP */}
              <div className="flex items-center justify-end gap-1">
                <Zap className="text-solana-green h-3.5 w-3.5 shrink-0" />
                <span className="text-sm font-medium text-neutral-200">
                  {entry.totalXp.toLocaleString()}
                </span>
              </div>

              {/* Level */}
              <div className="flex justify-end">
                <span className="bg-solana-purple/10 text-solana-purple rounded-full px-2 py-0.5 text-xs font-semibold">
                  {tGamification("level", { level: entry.level })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
