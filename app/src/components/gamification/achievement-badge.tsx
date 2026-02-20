"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Footprints,
  BookOpen,
  BookMarked,
  Library,
  Layers,
  Crown,
  GraduationCap,
  Award,
  Medal,
  Timer,
  Flame,
  Snowflake,
  Wrench,
  Anchor,
  Layout,
  Coins,
  Code,
  Rocket,
  Heart,
  MessageSquare,
  Bug,
  Sparkles,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  AchievementDefinition,
  AchievementCategory,
} from "./achievements-catalog";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Footprints,
  BookOpen,
  BookMarked,
  Library,
  Layers,
  Crown,
  GraduationCap,
  Award,
  Medal,
  Timer,
  Flame,
  Snowflake,
  Wrench,
  Anchor,
  Layout,
  Coins,
  Code,
  Rocket,
  Heart,
  MessageSquare,
  Bug,
  Sparkles,
  Star,
  Trophy,
};

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  progress: "bg-solana-green/20 text-solana-green",
  streaks: "bg-orange-400/20 text-orange-400",
  skills: "bg-solana-purple/20 text-solana-purple",
  community: "bg-solana-blue/20 text-solana-blue",
  special: "bg-amber-400/20 text-amber-400",
};

const SIZES = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
} as const;

const ICON_SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

type AchievementBadgeProps = {
  definition: AchievementDefinition;
  unlocked: boolean;
  unlockedAt?: string;
  size?: keyof typeof SIZES;
};

export function AchievementBadge({
  definition,
  unlocked,
  size = "md",
}: AchievementBadgeProps) {
  const t = useTranslations("gamification");
  const Icon = useMemo(
    () => ICON_MAP[definition.icon] ?? Award,
    [definition.icon]
  );

  const name = t(
    `achievements.${definition.key}.name` as Parameters<typeof t>[0]
  );
  const description = t(
    `achievements.${definition.key}.description` as Parameters<typeof t>[0]
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full transition-opacity",
            SIZES[size],
            unlocked
              ? CATEGORY_COLORS[definition.category]
              : "bg-white/[0.04] text-neutral-600"
          )}
        >
          <Icon className={cn(ICON_SIZES[size], !unlocked && "opacity-40")} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{name}</p>
        <p className="text-neutral-400">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
