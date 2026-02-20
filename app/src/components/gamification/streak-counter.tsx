"use client";

import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function streakColor(count: number): string {
  if (count >= 100) return "text-solana-green";
  if (count >= 30) return "text-amber-400";
  if (count >= 7) return "text-orange-500";
  if (count >= 1) return "text-orange-400";
  return "text-neutral-600";
}

type StreakCounterProps = {
  currentStreak: number;
  className?: string;
};

export function StreakCounter({
  currentStreak,
  className,
}: StreakCounterProps) {
  const t = useTranslations("gamification");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1", className)}>
          <Flame className={cn("h-4 w-4", streakColor(currentStreak))} />
          <span className="text-xs font-semibold text-neutral-200">
            {currentStreak}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {currentStreak > 0
            ? t("streakDays", { count: currentStreak })
            : t("streakInactive")}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
