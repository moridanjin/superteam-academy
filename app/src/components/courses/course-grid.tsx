"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Course } from "@/lib/cms/types";
import { CourseCard } from "./course-card";
import { CourseFiltersBar, type CourseFilters } from "./course-filters";
import { CourseEmptyState } from "./course-empty-state";
import { FadeInStagger, FadeInItem } from "@/components/motion";

const INITIAL_FILTERS: CourseFilters = {
  search: "",
  difficulty: "all",
  track: "",
};

export function CourseGrid({ courses }: { courses: Course[] }) {
  const t = useTranslations("courses");
  const [filters, setFilters] = useState<CourseFilters>(INITIAL_FILTERS);

  const tracks = useMemo(() => {
    const set = new Set<string>();
    for (const c of courses) {
      if (c.track) set.add(c.track);
    }
    return Array.from(set).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (filters.difficulty !== "all" && c.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.track && c.track !== filters.track) {
        return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.track?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [courses, filters]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.difficulty !== "all" ||
    filters.track !== "";

  return (
    <div className="flex flex-col gap-6">
      <CourseFiltersBar
        tracks={tracks}
        filters={filters}
        onChange={setFilters}
      />

      {/* Result count */}
      {hasActiveFilters && filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            {filtered.length} of {courses.length} {t("title").toLowerCase()}
          </p>
          <button
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="cursor-pointer text-xs text-neutral-500 underline underline-offset-2 transition-colors duration-200 hover:text-neutral-300"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <CourseEmptyState onClear={() => setFilters(INITIAL_FILTERS)} />
      ) : (
        <FadeInStagger
          key={`${filters.difficulty}-${filters.track}-${filters.search}`}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((course) => (
            <FadeInItem key={course.id}>
              <CourseCard course={course} />
            </FadeInItem>
          ))}
        </FadeInStagger>
      )}
    </div>
  );
}
