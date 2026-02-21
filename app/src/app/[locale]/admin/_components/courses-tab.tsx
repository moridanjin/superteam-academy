"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FadeInStagger, FadeInItem } from "@/components/motion";
import type { AdminCourseAnalytics } from "@/lib/services/admin-service";

type SortField = "enrollmentCount" | "completionRate" | "avgCompletionMinutes";
type SortDir = "asc" | "desc";

type CoursesTabProps = {
  analytics: AdminCourseAnalytics[];
};

export function CoursesTab({ analytics }: CoursesTabProps) {
  const t = useTranslations("admin");
  const [sortField, setSortField] = useState<SortField>("enrollmentCount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...analytics].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [analytics, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3 w-3" />
    ) : (
      <ChevronDown className="inline h-3 w-3" />
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
        <p className="text-sm text-neutral-500">{t("coursesEmpty")}</p>
      </div>
    );
  }

  return (
    <FadeInStagger className="space-y-4">
      <FadeInItem>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 border-b border-white/[0.06] px-4 py-3 text-xs font-medium text-neutral-500">
            <span>{t("colCourse")}</span>
            <button
              type="button"
              onClick={() => handleSort("enrollmentCount")}
              className="text-right hover:text-neutral-300"
            >
              {t("colEnrollments")} {renderSortIcon("enrollmentCount")}
            </button>
            <button
              type="button"
              onClick={() => handleSort("completionRate")}
              className="text-right hover:text-neutral-300"
            >
              {t("colCompletionRate")} {renderSortIcon("completionRate")}
            </button>
            <button
              type="button"
              onClick={() => handleSort("avgCompletionMinutes")}
              className="text-right hover:text-neutral-300"
            >
              {t("colAvgTime")} {renderSortIcon("avgCompletionMinutes")}
            </button>
          </div>

          {sorted.map((course) => (
            <div
              key={course.courseId}
              className="grid grid-cols-[1fr_120px_120px_120px] items-center gap-4 border-b border-white/[0.04] px-4 py-3 last:border-b-0"
            >
              <p className="truncate text-sm font-medium text-white">
                {course.title}
              </p>
              <p className="text-right text-sm text-neutral-300">
                {course.enrollmentCount.toLocaleString()}
              </p>
              <p className="text-right text-sm text-neutral-300">
                {course.completionRate}%
              </p>
              <p className="text-right text-sm text-neutral-300">
                {course.avgCompletionMinutes != null
                  ? `${course.avgCompletionMinutes}m`
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </FadeInItem>
    </FadeInStagger>
  );
}
