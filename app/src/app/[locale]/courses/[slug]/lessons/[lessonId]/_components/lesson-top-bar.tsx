"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonTopBarProps {
  courseSlug: string;
  courseTitle: string;
  lessonTitle: string;
  currentIndex: number;
  totalLessons: number;
  completedCount: number;
  onMenuToggle: () => void;
  alwaysShowMenu?: boolean;
}

export function LessonTopBar({
  courseSlug,
  courseTitle,
  lessonTitle,
  currentIndex,
  totalLessons,
  completedCount,
  onMenuToggle,
  alwaysShowMenu,
}: LessonTopBarProps) {
  const t = useTranslations("lesson");
  const progressPct =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="shrink-0 border-b border-white/[0.06] bg-neutral-950">
      <div className="flex h-12 items-center gap-3 px-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          title={courseTitle}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("backToCourse")}</span>
        </Link>

        <div className="mx-2 h-4 w-px bg-white/[0.06]" />

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-200">
          {lessonTitle}
        </span>

        <span className="shrink-0 text-xs text-neutral-500">
          {t("lessonProgress", {
            current: currentIndex + 1,
            total: totalLessons,
          })}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", alwaysShowMenu ? "" : "lg:hidden")}
          onClick={onMenuToggle}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <Progress
        value={progressPct}
        className="[&>[data-slot=progress-indicator]]:from-solana-purple [&>[data-slot=progress-indicator]]:to-solana-green h-0.5 rounded-none bg-white/[0.04] [&>[data-slot=progress-indicator]]:bg-gradient-to-r"
      />
    </div>
  );
}
