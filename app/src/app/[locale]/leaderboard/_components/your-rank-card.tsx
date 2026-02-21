"use client";

import { useTranslations } from "next-intl";
import type { LeaderboardEntry } from "@/lib/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Zap } from "lucide-react";

type YourRankCardProps = {
  rank: LeaderboardEntry | null;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function YourRankCard({ rank }: YourRankCardProps) {
  const t = useTranslations("leaderboard");
  const tGamification = useTranslations("gamification");

  if (!rank) {
    return (
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardContent className="flex items-center gap-3 py-4">
          <Trophy className="h-5 w-5 text-neutral-600" />
          <p className="text-sm text-neutral-500">{t("notRanked")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-solana-purple/20 bg-solana-purple/[0.04]">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>

        <div className="flex flex-1 items-center gap-3">
          <Avatar className="h-9 w-9">
            {rank.avatarUrl && (
              <AvatarImage src={rank.avatarUrl} alt={rank.displayName} />
            )}
            <AvatarFallback className="bg-neutral-800 text-xs text-neutral-300">
              {getInitials(rank.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {rank.displayName}
            </p>
            <p className="text-xs text-neutral-400">{t("yourRank")}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xl font-bold text-white">#{rank.rank}</p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-1">
              <Zap className="text-solana-green h-3.5 w-3.5" />
              <span className="text-sm font-medium text-neutral-200">
                {rank.totalXp.toLocaleString()}
              </span>
            </div>
            <span className="bg-solana-purple/10 text-solana-purple rounded-full px-2 py-0.5 text-xs font-semibold">
              {tGamification("level", { level: rank.level })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
