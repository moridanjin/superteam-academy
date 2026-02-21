"use client";

import { useTranslations } from "next-intl";
import type { LeaderboardEntry } from "@/lib/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

type PodiumProps = {
  entries: LeaderboardEntry[];
};

const PODIUM_CONFIG = [
  {
    index: 1,
    height: "h-28",
    avatarSize: "h-14 w-14",
    nameSize: "text-sm",
    gradient: "from-neutral-400 to-neutral-300",
    ring: "ring-neutral-400/50",
    bgGlow: "bg-neutral-400/5",
    medalColor: "text-neutral-300",
    order: "order-1",
    i18nKey: "podiumSecond" as const,
  },
  {
    index: 0,
    height: "h-36",
    avatarSize: "h-16 w-16",
    nameSize: "text-base",
    gradient: "from-amber-400 to-yellow-300",
    ring: "ring-amber-400/50",
    bgGlow: "bg-amber-400/5",
    medalColor: "text-amber-400",
    order: "order-2",
    i18nKey: "podiumFirst" as const,
  },
  {
    index: 2,
    height: "h-24",
    avatarSize: "h-12 w-12",
    nameSize: "text-sm",
    gradient: "from-orange-600 to-orange-400",
    ring: "ring-orange-500/50",
    bgGlow: "bg-orange-500/5",
    medalColor: "text-orange-400",
    order: "order-3",
    i18nKey: "podiumThird" as const,
  },
] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Podium({ entries }: PodiumProps) {
  const t = useTranslations("leaderboard");

  if (entries.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-3 pb-4 sm:gap-6">
      {PODIUM_CONFIG.map((config) => {
        const entry = entries[config.index];
        if (!entry) return null;

        return (
          <div
            key={entry.userId}
            className={cn("flex flex-col items-center gap-2", config.order)}
          >
            <div className="relative">
              {config.index === 0 && (
                <Crown className="absolute -top-5 left-1/2 h-5 w-5 -translate-x-1/2 text-amber-400" />
              )}
              <Avatar className={cn(config.avatarSize, "ring-2", config.ring)}>
                {entry.avatarUrl && (
                  <AvatarImage src={entry.avatarUrl} alt={entry.displayName} />
                )}
                <AvatarFallback className="bg-neutral-800 text-neutral-300">
                  {getInitials(entry.displayName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="text-center">
              <p className={cn("font-semibold text-white", config.nameSize)}>
                {entry.displayName}
              </p>
              <p className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-xs font-medium text-transparent">
                {entry.totalXp.toLocaleString()} XP
              </p>
            </div>

            <div
              className={cn(
                "flex w-20 flex-col items-center justify-end rounded-t-xl border border-white/[0.06] sm:w-24",
                config.bgGlow,
                config.height
              )}
            >
              <div className="flex flex-col items-center gap-1 pb-3">
                <Medal className={cn("h-5 w-5", config.medalColor)} />
                <span
                  className={cn(
                    "bg-gradient-to-b bg-clip-text text-lg font-bold text-transparent",
                    config.gradient
                  )}
                >
                  {t(config.i18nKey)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
