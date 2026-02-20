"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type StreakCalendarProps = {
  activityDates: string[];
  weeks?: number;
};

export function StreakCalendar({
  activityDates,
  weeks = 12,
}: StreakCalendarProps) {
  const t = useTranslations("gamification");

  const grid = useMemo(() => {
    const activeDays = new Set(activityDates);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]!;

    // Build grid starting from (weeks * 7) days ago, aligned to start on Sunday
    const totalDays = weeks * 7;
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - totalDays + 1);
    // Align to previous Sunday
    const dayOfWeek = startDate.getUTCDay();
    startDate.setUTCDate(startDate.getUTCDate() - dayOfWeek);

    const cells: Array<{
      date: string;
      active: boolean;
      isToday: boolean;
    }> = [];

    const d = new Date(startDate);
    const endDate = new Date(today);
    endDate.setUTCDate(endDate.getUTCDate() + (6 - today.getUTCDay()));

    while (d <= endDate) {
      const dateStr = d.toISOString().split("T")[0]!;
      cells.push({
        date: dateStr,
        active: activeDays.has(dateStr),
        isToday: dateStr === todayStr,
      });
      d.setUTCDate(d.getUTCDate() + 1);
    }

    return cells;
  }, [activityDates, weeks]);

  const numCols = Math.ceil(grid.length / 7);

  return (
    <div
      className="grid gap-[3px]"
      style={{
        gridTemplateRows: "repeat(7, 1fr)",
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
        gridAutoFlow: "column",
      }}
    >
      {grid.map((cell) => (
        <Tooltip key={cell.date}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "h-3 w-3 rounded-sm",
                cell.active ? "bg-solana-green/60" : "bg-white/[0.04]",
                cell.isToday && "ring-solana-blue ring-1"
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {cell.date} —{" "}
              {cell.active
                ? t("streakCalendarActivity")
                : t("streakCalendarNoActivity")}
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
