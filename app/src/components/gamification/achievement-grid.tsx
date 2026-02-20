"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AchievementBadge } from "./achievement-badge";
import {
  ACHIEVEMENTS_CATALOG,
  ACHIEVEMENT_CATEGORIES,
  type AchievementCategory,
} from "./achievements-catalog";
type AchievementGridProps = {
  unlockedKeys: Set<string>;
  unlockedDates: Map<string, string>;
  category?: AchievementCategory;
};

export function AchievementGrid({
  unlockedKeys,
  unlockedDates,
  category: initialCategory,
}: AchievementGridProps) {
  const t = useTranslations("gamification");
  const [selected, setSelected] = useState<AchievementCategory | null>(
    initialCategory ?? null
  );

  const filtered = useMemo(() => {
    const list = selected
      ? ACHIEVEMENTS_CATALOG.filter((a) => a.category === selected)
      : ACHIEVEMENTS_CATALOG;

    return [...list].sort((a, b) => {
      const aUnlocked = unlockedKeys.has(a.key);
      const bUnlocked = unlockedKeys.has(b.key);
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return a.index - b.index;
    });
  }, [selected, unlockedKeys]);

  const countByCategory = useMemo(() => {
    const counts: Record<string, { total: number; unlocked: number }> = {};
    for (const a of ACHIEVEMENTS_CATALOG) {
      const cat = counts[a.category] ?? { total: 0, unlocked: 0 };
      cat.total++;
      if (unlockedKeys.has(a.key)) cat.unlocked++;
      counts[a.category] = cat;
    }
    return counts;
  }, [unlockedKeys]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selected === null ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelected(null)}
          className="h-7 text-xs"
        >
          {t("categoryAll")} ({unlockedKeys.size}/{ACHIEVEMENTS_CATALOG.length})
        </Button>
        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const c = countByCategory[cat];
          const label = t(
            `category${cat.charAt(0).toUpperCase()}${cat.slice(1)}` as Parameters<
              typeof t
            >[0]
          );
          return (
            <Button
              key={cat}
              variant={selected === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelected(cat)}
              className="h-7 text-xs"
            >
              {label} ({c?.unlocked ?? 0}/{c?.total ?? 0})
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map((def) => (
          <div key={def.key} className="flex items-center justify-center">
            <AchievementBadge
              definition={def}
              unlocked={unlockedKeys.has(def.key)}
              unlockedAt={unlockedDates.get(def.key)}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
