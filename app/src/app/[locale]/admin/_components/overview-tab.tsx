"use client";

import { FadeInStagger, FadeInItem } from "@/components/motion";
import type {
  AdminOverviewStats,
  UserGrowthPoint,
  DailyActivePoint,
  AdminCourseAnalytics,
} from "@/lib/services/admin-service";
import { StatsCards } from "./stats-cards";
import {
  UserGrowthChart,
  DailyActiveChart,
  PopularCoursesChart,
} from "./admin-charts";

type OverviewTabProps = {
  stats: AdminOverviewStats;
  userGrowth: UserGrowthPoint[];
  dailyActive: DailyActivePoint[];
  courseAnalytics: AdminCourseAnalytics[];
};

export function OverviewTab({
  stats,
  userGrowth,
  dailyActive,
  courseAnalytics,
}: OverviewTabProps) {
  return (
    <FadeInStagger className="space-y-6">
      <FadeInItem>
        <StatsCards stats={stats} />
      </FadeInItem>

      <FadeInItem>
        <div className="grid gap-6 lg:grid-cols-2">
          <UserGrowthChart data={userGrowth} />
          <DailyActiveChart data={dailyActive} />
        </div>
      </FadeInItem>

      <FadeInItem>
        <PopularCoursesChart data={courseAnalytics} />
      </FadeInItem>
    </FadeInStagger>
  );
}
