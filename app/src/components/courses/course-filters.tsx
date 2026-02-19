"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/cms/types";

type DifficultyFilter = Difficulty | "all";

const DIFFICULTIES: DifficultyFilter[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

const DIFFICULTY_KEY_MAP: Record<DifficultyFilter, string> = {
  all: "filterAll",
  beginner: "filterBeginner",
  intermediate: "filterIntermediate",
  advanced: "filterAdvanced",
};

export type CourseFilters = {
  search: string;
  difficulty: DifficultyFilter;
  track: string;
};

export function CourseFiltersBar({
  tracks,
  filters,
  onChange,
}: {
  tracks: string[];
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
}) {
  const t = useTranslations("courses");
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange({ ...filters, search: value });
      }, 300);
    },
    [filters, onChange]
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <Input
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-10 border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-neutral-500 focus-visible:border-white/20 focus-visible:ring-1 focus-visible:ring-white/10"
        />
      </div>

      {/* Difficulty pills + Track select */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...filters, difficulty: d })}
              className={cn(
                "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                "focus-visible:ring-solana-purple focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none",
                filters.difficulty === d
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
              )}
            >
              {t(DIFFICULTY_KEY_MAP[d])}
            </button>
          ))}
        </div>

        {tracks.length > 0 && (
          <div className="ml-auto">
            <select
              value={filters.track}
              onChange={(e) => onChange({ ...filters, track: e.target.value })}
              className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 transition-colors duration-200 outline-none hover:border-white/20 focus-visible:border-white/20 focus-visible:ring-1 focus-visible:ring-white/10"
            >
              <option value="">{t("filterAllTracks")}</option>
              {tracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
