"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CourseProgress } from "@/lib/services";
import { CourseProgressCard } from "./course-progress-card";

type CourseProgressListProps = {
  courses: CourseProgress[] | null;
};

export function CourseProgressList({ courses }: CourseProgressListProps) {
  const t = useTranslations("dashboard");
  const active = courses?.filter((c) => c.status === "active") ?? [];

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-200">
          {t("currentCourses")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {active.length > 0 ? (
          active.map((course) => (
            <CourseProgressCard key={course.courseId} course={course} />
          ))
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <BookOpen className="h-8 w-8 text-neutral-600" />
            <p className="text-sm text-neutral-500">{t("noCourses")}</p>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses">{t("startLearning")}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
