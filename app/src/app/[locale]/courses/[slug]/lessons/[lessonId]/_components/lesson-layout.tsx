"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Group as ResizablePanelGroup } from "react-resizable-panels";
import type { Course, Lesson } from "@/lib/cms/types";
import { LessonTopBar } from "./lesson-top-bar";
import { LessonContent } from "./lesson-content";
import { LessonSidebar } from "./lesson-sidebar";
import { LessonNav } from "./lesson-nav";
import { LessonCompletion } from "./lesson-completion";
import { LessonHints } from "./lesson-hints";
import { MobileSidebarSheet } from "./mobile-sidebar-sheet";

interface FlatLesson {
  lesson: Lesson;
  moduleTitle: string;
}

interface LessonLayoutProps {
  course: Course;
  currentLesson: Lesson;
  flatLessons: FlatLesson[];
  currentIndex: number;
  prevLessonId: number | null;
  nextLessonId: number | null;
}

export function LessonLayout({
  course,
  currentLesson,
  flatLessons,
  currentIndex,
  prevLessonId,
  nextLessonId,
}: LessonLayoutProps) {
  const t = useTranslations("lesson");
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(
    () => {
      if (typeof window === "undefined") return new Set<number>();
      const key = `completed-lessons-${course.id}`;
      const stored = localStorage.getItem(key);
      if (!stored) return new Set<number>();
      try {
        return new Set(JSON.parse(stored) as number[]);
      } catch {
        return new Set<number>();
      }
    }
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCurrentCompleted = completedLessonIds.has(currentLesson.id);
  const totalLessons = flatLessons.length;

  const handleComplete = useCallback(async () => {
    if (isCurrentCompleted || isCompleting) return;
    setIsCompleting(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));

    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      next.add(currentLesson.id);
      // Persist to localStorage
      const key = `completed-lessons-${course.id}`;
      localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });

    toast.success(t("xpEarned", { xp: currentLesson.xpReward }));
    setIsCompleting(false);
  }, [
    currentLesson.id,
    currentLesson.xpReward,
    course.id,
    isCurrentCompleted,
    isCompleting,
    t,
  ]);

  const sidebarProps = {
    modules: course.modules,
    courseSlug: course.slug,
    currentLessonId: currentLesson.id,
    completedLessonIds,
    totalLessons,
  };

  const contentArea = (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8 md:px-10">
        <LessonContent lesson={currentLesson} />

        {currentLesson.type === "challenge" && currentLesson.challenge && (
          <>
            <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="mb-2 text-sm font-semibold text-neutral-200">
                {t("challengePlaceholder")}
              </h3>
              <pre className="overflow-x-auto rounded-md bg-neutral-900 p-4 font-mono text-xs leading-relaxed text-neutral-400">
                {currentLesson.challenge.starterCode}
              </pre>
            </div>
            {currentLesson.challenge.hints && (
              <LessonHints hints={currentLesson.challenge.hints} />
            )}
          </>
        )}

        <LessonCompletion
          isCompleted={isCurrentCompleted}
          xpReward={currentLesson.xpReward}
          isLoading={isCompleting}
          onComplete={handleComplete}
        />

        <LessonNav
          courseSlug={course.slug}
          prevLessonId={prevLessonId}
          nextLessonId={nextLessonId}
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col bg-neutral-950 text-neutral-200">
      <LessonTopBar
        courseSlug={course.slug}
        courseTitle={course.title}
        lessonTitle={currentLesson.title}
        currentIndex={currentIndex}
        totalLessons={totalLessons}
        completedCount={completedLessonIds.size}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      {/* Desktop: resizable panels */}
      <div className="hidden flex-1 overflow-hidden lg:flex">
        <ResizablePanelGroup
          orientation="horizontal"
          className="flex h-full w-full"
        >
          <ResizablePanel defaultSize={70} minSize={50}>
            {contentArea}
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-white/[0.04]" />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full overflow-hidden border-l border-white/[0.06] bg-neutral-950/50">
              <LessonSidebar {...sidebarProps} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: stacked content + sheet sidebar */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        {contentArea}
      </div>

      <MobileSidebarSheet
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        {...sidebarProps}
      />
    </div>
  );
}
