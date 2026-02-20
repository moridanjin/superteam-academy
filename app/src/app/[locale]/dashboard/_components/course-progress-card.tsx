"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { CourseProgress } from "@/lib/services";

type CourseProgressCardProps = {
  course: CourseProgress;
};

export function CourseProgressCard({ course }: CourseProgressCardProps) {
  const t = useTranslations("dashboard");

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm font-medium text-neutral-200">
            {course.courseTitle}
          </p>
          <Progress
            value={course.progressPct}
            className="[&>[data-slot=progress-indicator]]:from-solana-purple [&>[data-slot=progress-indicator]]:to-solana-green h-1.5 bg-white/[0.06] [&>[data-slot=progress-indicator]]:bg-gradient-to-r"
          />
          <p className="text-xs text-neutral-500">
            {course.completedLessons} / {course.totalLessons} &middot;{" "}
            {course.progressPct}%
          </p>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0" asChild>
          <Link href={`/courses/${course.courseSlug}`}>
            {t("continueCourse")}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
