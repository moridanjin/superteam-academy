"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function CourseEmptyState({ onClear }: { onClear: () => void }) {
  const t = useTranslations("courses");

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <svg
          className="h-8 w-8 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-300">
          {t("emptyTitle")}
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{t("emptyDescription")}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="cursor-pointer border-white/10 text-xs"
      >
        {t("clearFilters")}
      </Button>
    </div>
  );
}
