"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LessonNavProps {
  courseSlug: string;
  prevLessonId: number | null;
  nextLessonId: number | null;
}

export function LessonNav({
  courseSlug,
  prevLessonId,
  nextLessonId,
}: LessonNavProps) {
  const t = useTranslations("lesson");

  return (
    <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
      {prevLessonId != null ? (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-neutral-400"
          asChild
        >
          <Link href={`/courses/${courseSlug}/lessons/${prevLessonId}`}>
            <ChevronLeft className="h-4 w-4" />
            {t("prevLesson")}
          </Link>
        </Button>
      ) : (
        <div />
      )}

      {nextLessonId != null ? (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-neutral-400"
          asChild
        >
          <Link href={`/courses/${courseSlug}/lessons/${nextLessonId}`}>
            {t("nextLesson")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}
