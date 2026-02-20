"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AchievementBadge } from "@/components/gamification/achievement-badge";
import { ACHIEVEMENTS_BY_KEY } from "@/components/gamification/achievements-catalog";
import type { AchievementInfo } from "@/lib/services";

type RecentAchievementsProps = {
  achievements: AchievementInfo[] | null;
};

export function RecentAchievements({ achievements }: RecentAchievementsProps) {
  const t = useTranslations("dashboard");

  const recent = useMemo(() => {
    if (!achievements?.length) return [];
    return [...achievements]
      .sort(
        (a, b) =>
          new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
      )
      .slice(0, 5);
  }, [achievements]);

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-neutral-200">
          {t("recentAchievements")}
        </CardTitle>
        {recent.length > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <Link href="/profile">{t("viewAllAchievements")}</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {recent.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {recent.map((a) => {
              const def = ACHIEVEMENTS_BY_KEY.get(a.key);
              if (!def) return null;
              return (
                <AchievementBadge
                  key={a.key}
                  definition={def}
                  unlocked
                  unlockedAt={a.unlockedAt}
                  size="sm"
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <Trophy className="h-6 w-6 text-neutral-600" />
            <p className="text-sm text-neutral-500">{t("noAchievements")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
