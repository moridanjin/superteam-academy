"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Module } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function CourseModules({ modules }: { modules: Module[] }) {
  const t = useTranslations("courseDetail");

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-white">
          {t("courseContent")}
        </h2>
        <span className="text-xs text-neutral-500">
          {t("modulesCount", { count: modules.length })} &middot;{" "}
          {t("lessonsCount", { count: totalLessons })}
        </span>
      </div>

      <Accordion
        type="multiple"
        defaultValue={modules.map((m) => String(m.id))}
        className="mt-4 space-y-2"
      >
        {modules.map((mod, moduleIdx) => (
          <AccordionItem
            key={mod.id}
            value={String(mod.id)}
            className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-200 data-[state=open]:bg-white/[0.03]"
          >
            <AccordionTrigger className="cursor-pointer gap-3 px-5 py-4 text-sm hover:no-underline [&[data-state=open]>svg]:rotate-180">
              <div className="flex flex-1 items-center gap-3 text-left">
                <span className="from-solana-purple to-solana-blue flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white">
                  {moduleIdx + 1}
                </span>
                <div>
                  <div className="font-medium text-neutral-200">
                    {mod.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">
                    {t("lessonsCount", { count: mod.lessons.length })}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pt-0 pb-4">
              <div className="flex flex-col gap-0.5">
                {mod.lessons.map((lesson, lessonIdx) => (
                  <div
                    key={lesson.id}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.03]"
                  >
                    {/* Lesson number */}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-[10px] font-medium text-neutral-500">
                      {lessonIdx + 1}
                    </span>

                    {/* Lesson type icon */}
                    {lesson.type === "challenge" ? (
                      <svg
                        className="h-4 w-4 shrink-0 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 shrink-0 text-neutral-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                    )}

                    {/* Title */}
                    <span className="flex-1 text-xs text-neutral-400 transition-colors duration-150 group-hover:text-neutral-300">
                      {lesson.title}
                    </span>

                    {/* Type badge */}
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-medium",
                        lesson.type === "challenge"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-white/[0.04] text-neutral-600"
                      )}
                    >
                      {lesson.type === "challenge"
                        ? t("challenge")
                        : t("lesson")}
                    </span>

                    {/* XP */}
                    {lesson.xpReward > 0 && (
                      <span className="text-[10px] font-medium text-neutral-600">
                        +{lesson.xpReward} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
