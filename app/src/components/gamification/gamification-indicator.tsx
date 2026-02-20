"use client";

import { useAuth } from "@/hooks/use-auth";
import { useXP } from "@/hooks/use-xp";
import { useStreak } from "@/hooks/use-streak";
import { Skeleton } from "@/components/ui/skeleton";
import { XPLevelBadge } from "./xp-level-badge";
import { StreakCounter } from "./streak-counter";

export function GamificationIndicator() {
  const { user, loading: authLoading } = useAuth();
  const { data: xp, loading: xpLoading } = useXP();
  const { data: streak, loading: streakLoading } = useStreak();

  if (authLoading) return null;
  if (!user) return null;

  if (xpLoading || streakLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="h-4 w-px bg-white/10" />
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>
    );
  }

  if (!xp || !streak) return null;

  return (
    <div className="flex items-center gap-2">
      <XPLevelBadge totalXp={xp.totalXp} level={xp.level} />
      <div className="h-4 w-px bg-white/10" />
      <StreakCounter currentStreak={streak.currentStreak} />
    </div>
  );
}
