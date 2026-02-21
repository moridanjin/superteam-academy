"use client";

import { useTranslations } from "next-intl";
import { Users, UserCheck, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminOverviewStats } from "@/lib/services/admin-service";

type StatsCardsProps = {
  stats: AdminOverviewStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  const t = useTranslations("admin");

  const cards = [
    {
      label: t("statTotalUsers"),
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-solana-purple",
    },
    {
      label: t("statActiveUsers7d"),
      value: stats.activeUsers7d.toLocaleString(),
      icon: UserCheck,
      color: "text-solana-green",
    },
    {
      label: t("statTotalEnrollments"),
      value: stats.totalEnrollments.toLocaleString(),
      icon: GraduationCap,
      color: "text-solana-blue",
    },
    {
      label: t("statCompletionRate"),
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-white/[0.06] bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-white">{card.value}</p>
              <p className="truncate text-xs text-neutral-500">{card.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
