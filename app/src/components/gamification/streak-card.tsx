"use client";

import { Flame, Snowflake, Check, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StreakCalendar } from "./streak-calendar";
import type { StreakInfo } from "@/lib/services";
import { cn } from "@/lib/utils";

const MILESTONES = [7, 30, 100] as const;

type StreakCardProps = {
  streakInfo: StreakInfo;
  activityDates: string[];
};

export function StreakCard({ streakInfo, activityDates }: StreakCardProps) {
  const t = useTranslations("gamification");

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
              {streakInfo.currentStreak}
            </span>
            <span className="text-sm text-neutral-400">{t("streak")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Snowflake className="h-3.5 w-3.5" />
            {t("streakFreezes", { count: streakInfo.freezeCount })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-neutral-400">
          {t("longestStreak", { count: streakInfo.longestStreak })}
        </div>

        <div className="flex items-center gap-2">
          {MILESTONES.map((m) => {
            const reached = streakInfo.longestStreak >= m;
            return (
              <div
                key={m}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                  reached
                    ? "border-solana-green/30 bg-solana-green/10 text-solana-green"
                    : "border-white/[0.06] text-neutral-500"
                )}
              >
                {reached ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {m === 7 && t("streakMilestone7")}
                {m === 30 && t("streakMilestone30")}
                {m === 100 && t("streakMilestone100")}
              </div>
            );
          })}
        </div>

        <StreakCalendar activityDates={activityDates} />
      </CardContent>
    </Card>
  );
}
