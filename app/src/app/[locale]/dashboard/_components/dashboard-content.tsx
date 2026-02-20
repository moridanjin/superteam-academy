"use client";

import { useTranslations } from "next-intl";
import { useXP } from "@/hooks/use-xp";
import { useStreak } from "@/hooks/use-streak";
import { useAchievements } from "@/hooks/use-achievements";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useUserRank } from "@/hooks/use-user-rank";
import { XPLevelCard } from "@/components/gamification/xp-level-card";
import { StreakCard } from "@/components/gamification/streak-card";
import { XPEventFeed } from "@/components/gamification/xp-event-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";
import { FadeInStagger, FadeInItem } from "@/components/motion";
import { QuickStats } from "./quick-stats";
import { CourseProgressList } from "./course-progress-list";
import { RecentAchievements } from "./recent-achievements";

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const { data: xp, loading: xpLoading } = useXP();
  const { data: streak, loading: streakLoading } = useStreak();
  const { data: achievements, loading: achievementsLoading } =
    useAchievements();
  const { data: courses, loading: coursesLoading } = useCourseProgress();
  const { data: rank, loading: rankLoading } = useUserRank();

  const loading =
    xpLoading ||
    streakLoading ||
    achievementsLoading ||
    coursesLoading ||
    rankLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <FadeInStagger className="space-y-6">
      <FadeInItem>
        <QuickStats courses={courses} xp={xp} streak={streak} rank={rank} />
      </FadeInItem>

      <FadeInItem>
        <div className="grid gap-6 lg:grid-cols-2">
          {xp && (
            <div className="relative">
              <XPLevelCard xpSummary={xp} />
              {rank && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-500">
                    {t("rankValue", { rank: rank.rank })}
                  </span>
                </div>
              )}
            </div>
          )}
          {streak && (
            <StreakCard
              streakInfo={streak}
              activityDates={streak.activityDates}
            />
          )}
        </div>
      </FadeInItem>

      <FadeInItem>
        <CourseProgressList courses={courses} />
      </FadeInItem>

      <FadeInItem>
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAchievements achievements={achievements} />
          <Card className="border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-200">
                {t("recentActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {xp?.recentEvents.length ? (
                <XPEventFeed events={xp.recentEvents} limit={5} />
              ) : (
                <p className="text-sm text-neutral-500">{t("noActivity")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeInItem>
    </FadeInStagger>
  );
}
