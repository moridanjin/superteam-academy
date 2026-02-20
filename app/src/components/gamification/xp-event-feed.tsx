"use client";

import {
  BookOpen,
  GraduationCap,
  Flame,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { XPSummary } from "@/lib/services";
import type { Enums } from "@/lib/supabase/database.types";

type XPEvent = XPSummary["recentEvents"][number];

const SOURCE_ICONS: Record<Enums<"xp_source">, typeof BookOpen> = {
  lesson_completion: BookOpen,
  course_completion: GraduationCap,
  streak_bonus: Flame,
  achievement: Trophy,
  referral: Users,
};

function timeAgo(
  dateStr: string,
  t: ReturnType<typeof useTranslations<"gamification.timeAgo">>
): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("daysAgo", { count: days });
}

type XPEventFeedProps = {
  events: XPEvent[];
  limit?: number;
};

export function XPEventFeed({ events, limit = 10 }: XPEventFeedProps) {
  const tTime = useTranslations("gamification.timeAgo");
  const tSource = useTranslations("gamification.xpSource");
  const display = events.slice(0, limit);

  return (
    <div className="space-y-2">
      {display.map((event, i) => {
        const Icon = SOURCE_ICONS[event.source] ?? Zap;
        return (
          <div
            key={`${event.createdAt}-${i}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04]">
              <Icon className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-neutral-200">
                {tSource(event.source)}
              </p>
              <p className="text-xs text-neutral-500">
                {timeAgo(event.createdAt, tTime)}
              </p>
            </div>
            <span className="text-solana-green shrink-0 text-sm font-semibold">
              +{event.amount} XP
            </span>
          </div>
        );
      })}
    </div>
  );
}
