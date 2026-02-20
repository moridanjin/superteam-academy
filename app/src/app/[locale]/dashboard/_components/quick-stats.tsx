"use client";

import { GraduationCap, BookOpen, Zap, Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import type {
  CourseProgress,
  XPSummary,
  LeaderboardEntry,
} from "@/lib/services";

type StreakData = { longestStreak: number };

type QuickStatsProps = {
  courses: CourseProgress[] | null;
  xp: XPSummary | null;
  streak: StreakData | null;
  rank: LeaderboardEntry | null;
};

export function QuickStats({ courses, xp, streak }: QuickStatsProps) {
  const t = useTranslations("dashboard");

  const completedCount =
    courses?.filter((c) => c.status === "completed").length ?? 0;
  const lessonsCount =
    courses?.reduce((sum, c) => sum + c.completedLessons, 0) ?? 0;
  const totalXp = xp?.totalXp ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;

  const stats = [
    {
      label: t("coursesCompleted"),
      value: completedCount,
      icon: GraduationCap,
      color: "text-solana-green",
    },
    {
      label: t("lessonsCompleted"),
      value: lessonsCount,
      icon: BookOpen,
      color: "text-solana-blue",
    },
    {
      label: "Total XP",
      value: totalXp.toLocaleString(),
      icon: Zap,
      color: "text-solana-purple",
    },
    {
      label: t("longestStreak"),
      value: t("longestStreakDays", { count: longestStreak }),
      icon: Flame,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="truncate text-xs text-neutral-500">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
