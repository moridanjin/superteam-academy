"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { xpProgressInLevel } from "@/lib/gamification";
import { cn } from "@/lib/utils";

type XPLevelBadgeProps = {
  totalXp: number;
  level: number;
  className?: string;
};

export function XPLevelBadge({ totalXp, level, className }: XPLevelBadgeProps) {
  const t = useTranslations("gamification");
  const progress = xpProgressInLevel(totalXp, level);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "bg-solana-purple/10 flex items-center gap-1.5 rounded-full px-2.5 py-1",
            className
          )}
        >
          <Zap className="text-solana-purple h-3.5 w-3.5" />
          <span className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-xs font-semibold text-transparent">
            {t("level", { level })}
          </span>
          <span className="text-xs text-neutral-400">
            {t("totalXp", { xp: totalXp })}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {t("xpProgress", {
            current: progress.current,
            required: progress.required,
          })}
        </p>
        <p className="text-neutral-400">
          {t("xpToNextLevel", { xp: progress.required - progress.current })}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
