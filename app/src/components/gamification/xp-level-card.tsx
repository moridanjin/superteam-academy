"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { xpProgressInLevel } from "@/lib/gamification";
import type { XPSummary } from "@/lib/services";

type XPLevelCardProps = {
  xpSummary: XPSummary;
};

export function XPLevelCard({ xpSummary }: XPLevelCardProps) {
  const t = useTranslations("gamification");
  const { totalXp, level } = xpSummary;
  const progress = xpProgressInLevel(totalXp, level);

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            {t("level", { level })}
          </span>
          <span className="flex items-center gap-1 text-sm text-neutral-400">
            <Zap className="text-solana-purple h-4 w-4" />
            {t("totalXp", { xp: totalXp })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress
          value={progress.pct}
          className="[&>[data-slot=progress-indicator]]:from-solana-purple [&>[data-slot=progress-indicator]]:to-solana-green h-2 bg-white/[0.06] [&>[data-slot=progress-indicator]]:bg-gradient-to-r"
        />
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>
            {t("xpProgress", {
              current: progress.current,
              required: progress.required,
            })}
          </span>
          <span>
            {t("xpToNextLevel", {
              xp: progress.required - progress.current,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
