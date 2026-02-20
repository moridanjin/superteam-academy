"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Group as ResizablePanelGroup } from "react-resizable-panels";
import type { Course, Lesson } from "@/lib/cms/types";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { LessonTopBar } from "./lesson-top-bar";
import { LessonContent } from "./lesson-content";
import { LessonSidebar } from "./lesson-sidebar";
import { LessonNav } from "./lesson-nav";
import { LessonCompletion } from "./lesson-completion";
import { MobileSidebarSheet } from "./mobile-sidebar-sheet";
import { ChallengePanel } from "./challenge-panel";
import { ChallengeTabs } from "./challenge-tabs";
import { SolanaPlayground } from "./solana-playground";
import { PlaygroundFallback } from "./playground-fallback";

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
  const isMobile = useIsMobile();
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
  const [challengePassed, setChallengePassed] = useState(false);
  const [playgroundError, setPlaygroundError] = useState(false);

  const isChallenge =
    currentLesson.type === "challenge" && !!currentLesson.challenge;
  const isCurrentCompleted = completedLessonIds.has(currentLesson.id);
  const totalLessons = flatLessons.length;

  const handleComplete = useCallback(async () => {
    if (isCurrentCompleted || isCompleting) return;
    setIsCompleting(true);

    await new Promise((r) => setTimeout(r, 500));

    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      next.add(currentLesson.id);
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

  const completionDisabled =
    isChallenge && !challengePassed && !isCurrentCompleted;

  const contentArea = (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8 md:px-10">
        <LessonContent lesson={currentLesson} />

        {isChallenge && currentLesson.challenge && (
          <ChallengePanel
            challenge={currentLesson.challenge}
            onChallengePass={() => setChallengePassed(true)}
          />
        )}

        <LessonCompletion
          isCompleted={isCurrentCompleted}
          xpReward={currentLesson.xpReward}
          isLoading={isCompleting}
          onComplete={handleComplete}
          disabled={completionDisabled}
        />

        <LessonNav
          courseSlug={course.slug}
          prevLessonId={prevLessonId}
          nextLessonId={nextLessonId}
        />
      </div>
    </div>
  );

  const playgroundPanel = isChallenge && currentLesson.challenge && (
    <div className="h-full w-full border-l border-white/[0.06] bg-neutral-950/50">
      {playgroundError || isMobile ? (
        <PlaygroundFallback starterCode={currentLesson.challenge.starterCode} />
      ) : (
        <SolanaPlayground
          starterCode={currentLesson.challenge.starterCode}
          onLoadError={() => setPlaygroundError(true)}
        />
      )}
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
        alwaysShowMenu={isChallenge}
      />

      {/* Desktop layout */}
      <div className="hidden flex-1 overflow-hidden lg:flex">
        <ResizablePanelGroup
          orientation="horizontal"
          className="flex h-full w-full"
        >
          <ResizablePanel
            defaultSize={isChallenge ? 45 : 70}
            minSize={isChallenge ? 30 : 50}
          >
            {contentArea}
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-white/[0.04]" />
          <ResizablePanel
            defaultSize={isChallenge ? 55 : 30}
            minSize={isChallenge ? 30 : 20}
            maxSize={isChallenge ? 70 : 40}
          >
            {isChallenge ? (
              playgroundPanel
            ) : (
              <div className="h-full overflow-hidden border-l border-white/[0.06] bg-neutral-950/50">
                <LessonSidebar {...sidebarProps} />
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        {isChallenge ? (
          <ChallengeTabs
            contentSlot={contentArea}
            playgroundSlot={playgroundPanel}
          />
        ) : (
          contentArea
        )}
      </div>

      <MobileSidebarSheet
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        {...sidebarProps}
      />
    </div>
  );
}
