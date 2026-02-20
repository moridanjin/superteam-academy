"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "./achievement-badge";
import type {
  AchievementDefinition,
  AchievementCategory,
} from "./achievements-catalog";
import { cn } from "@/lib/utils";

const CATEGORY_BORDER: Record<AchievementCategory, string> = {
  progress: "border-solana-green/30",
  streaks: "border-orange-400/30",
  skills: "border-solana-purple/30",
  community: "border-solana-blue/30",
  special: "border-amber-400/30",
};

type AchievementCardProps = {
  definition: AchievementDefinition;
  unlocked: boolean;
  unlockedAt?: string;
};

export function AchievementCard({
  definition,
  unlocked,
  unlockedAt,
}: AchievementCardProps) {
  const t = useTranslations("gamification");

  const name = t(
    `achievements.${definition.key}.name` as Parameters<typeof t>[0]
  );
  const description = t(
    `achievements.${definition.key}.description` as Parameters<typeof t>[0]
  );
  const categoryLabel = t(
    `category${definition.category.charAt(0).toUpperCase()}${definition.category.slice(1)}` as Parameters<
      typeof t
    >[0]
  );

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4 transition-colors",
        unlocked
          ? `border-white/[0.06] ${CATEGORY_BORDER[definition.category]} bg-white/[0.02]`
          : "border-white/[0.04] bg-white/[0.01] opacity-60"
      )}
    >
      <AchievementBadge definition={definition} unlocked={unlocked} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-200">{name}</p>
        <p className="text-xs text-neutral-400">{description}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {categoryLabel}
          </Badge>
          <span className="flex items-center gap-0.5 text-xs text-neutral-500">
            <Zap className="h-3 w-3" />
            {definition.xpReward} XP
          </span>
          {unlocked && unlockedAt && (
            <span className="text-xs text-neutral-500">
              {t("achievementsUnlockedAt", {
                date: new Date(unlockedAt).toLocaleDateString(),
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
