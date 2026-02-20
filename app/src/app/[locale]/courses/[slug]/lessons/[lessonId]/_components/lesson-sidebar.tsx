"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Check, FileText, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Module } from "@/lib/cms/types";

interface LessonSidebarProps {
  modules: Module[];
  courseSlug: string;
  currentLessonId: number;
  completedLessonIds: Set<number>;
  totalLessons: number;
}

export function LessonSidebar({
  modules,
  courseSlug,
  currentLessonId,
  completedLessonIds,
  totalLessons,
}: LessonSidebarProps) {
  const t = useTranslations("lesson");
  const completedCount = completedLessonIds.size;
  const progressPct =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/[0.06] p-4">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          {t("moduleOverview")}
        </h3>
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-neutral-500">
            <span>{t("courseProgress")}</span>
            <span>
              {t("completedCount", {
                completed: completedCount,
                total: totalLessons,
              })}
            </span>
          </div>
          <Progress
            value={progressPct}
            className="[&>[data-slot=progress-indicator]]:from-solana-purple [&>[data-slot=progress-indicator]]:to-solana-green h-1.5 bg-white/[0.06] [&>[data-slot=progress-indicator]]:bg-gradient-to-r"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <Accordion
          type="multiple"
          defaultValue={modules.map((m) => String(m.id))}
          className="space-y-1"
        >
          {modules.map((mod, moduleIdx) => (
            <AccordionItem
              key={mod.id}
              value={String(mod.id)}
              className="rounded-lg border-none"
            >
              <AccordionTrigger className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs hover:bg-white/[0.03] hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <div className="flex flex-1 items-center gap-2 text-left">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/[0.06] text-[10px] font-bold text-neutral-400">
                    {moduleIdx + 1}
                  </span>
                  <span className="truncate font-medium text-neutral-300">
                    {mod.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-1">
                <div className="flex flex-col gap-0.5 pl-2">
                  {mod.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isCompleted = completedLessonIds.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] transition-colors",
                          isCurrent
                            ? "bg-solana-purple/10 text-solana-purple"
                            : "text-neutral-500 hover:bg-white/[0.03] hover:text-neutral-300"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="text-solana-green h-3.5 w-3.5 shrink-0" />
                        ) : lesson.type === "challenge" ? (
                          <Terminal
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isCurrent
                                ? "text-solana-purple"
                                : "text-neutral-600"
                            )}
                          />
                        ) : (
                          <FileText
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isCurrent
                                ? "text-solana-purple"
                                : "text-neutral-600"
                            )}
                          />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
