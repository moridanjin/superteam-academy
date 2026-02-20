"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseProgress } from "@/lib/services";

type CompletedCoursesProps = {
  courses: CourseProgress[] | null;
};

export function CompletedCourses({ courses }: CompletedCoursesProps) {
  const t = useTranslations("profile");
  const completed = courses?.filter((c) => c.status === "completed") ?? [];

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-200">
          {t("completedCourses")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completed.length > 0 ? (
          <div className="space-y-3">
            {completed.map((course) => (
              <Link
                key={course.courseId}
                href={`/courses/${course.courseSlug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-solana-green h-4 w-4" />
                  <span className="text-sm text-neutral-200">
                    {course.courseTitle}
                  </span>
                </div>
                {course.completedAt && (
                  <span className="text-xs text-neutral-500">
                    {t("completedOn", {
                      date: new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(course.completedAt)),
                    })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-neutral-500">
            {t("noCompletedCourses")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
