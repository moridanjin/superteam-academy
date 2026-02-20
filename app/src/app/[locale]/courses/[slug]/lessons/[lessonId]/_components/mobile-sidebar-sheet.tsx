"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LessonSidebar } from "./lesson-sidebar";
import type { Module } from "@/lib/cms/types";
import { useTranslations } from "next-intl";

interface MobileSidebarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: Module[];
  courseSlug: string;
  currentLessonId: number;
  completedLessonIds: Set<number>;
  totalLessons: number;
}

export function MobileSidebarSheet({
  open,
  onOpenChange,
  modules,
  courseSlug,
  currentLessonId,
  completedLessonIds,
  totalLessons,
}: MobileSidebarSheetProps) {
  const t = useTranslations("lesson");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80 border-white/[0.06] bg-neutral-950 p-0"
      >
        <SheetTitle className="sr-only">{t("moduleOverview")}</SheetTitle>
        <LessonSidebar
          modules={modules}
          courseSlug={courseSlug}
          currentLessonId={currentLessonId}
          completedLessonIds={completedLessonIds}
          totalLessons={totalLessons}
        />
      </SheetContent>
    </Sheet>
  );
}
