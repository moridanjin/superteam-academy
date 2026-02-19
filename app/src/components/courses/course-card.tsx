"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Course } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
} as const;

const TRACK_CONFIG: Record<
  string,
  { gradient: string; pattern: string; icon: string }
> = {
  "Solana Fundamentals": {
    gradient: "from-solana-purple via-solana-blue/80 to-solana-blue",
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(153,69,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,209,255,0.2) 0%, transparent 50%)",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
  "DeFi Developer": {
    gradient: "from-solana-green via-emerald-500/60 to-solana-blue",
    pattern:
      "radial-gradient(circle at 70% 30%, rgba(20,241,149,0.3) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(0,209,255,0.15) 0%, transparent 50%)",
    icon: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z",
  },
  "Full Stack Solana": {
    gradient: "from-solana-pink via-fuchsia-500/60 to-solana-purple",
    pattern:
      "radial-gradient(circle at 50% 50%, rgba(249,70,255,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(153,69,255,0.2) 0%, transparent 50%)",
    icon: "M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3",
  },
};

const DEFAULT_TRACK = {
  gradient: "from-neutral-700 via-neutral-600 to-neutral-700",
  pattern:
    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
  icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
};

function getTotalLessons(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function CourseCard({
  course,
  progress,
}: {
  course: Course;
  progress?: number;
}) {
  const t = useTranslations("courses");
  const totalLessons = getTotalLessons(course);
  const config = TRACK_CONFIG[course.track ?? ""] ?? DEFAULT_TRACK;

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden border-white/[0.06] bg-neutral-900/60 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-neutral-900/90 hover:shadow-xl hover:shadow-black/30">
        {/* Thumbnail with mesh gradient + noise + track icon */}
        <div
          className={cn(
            "relative h-40 overflow-hidden bg-gradient-to-br",
            config.gradient
          )}
        >
          {/* Mesh gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: config.pattern }}
          />
          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            }}
          />
          {/* Track-specific icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-20 w-20 text-white/[0.12] transition-transform duration-500 group-hover:scale-110 group-hover:text-white/[0.18]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={config.icon}
              />
            </svg>
          </div>
          {/* Diagonal decorative line */}
          <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full border border-white/[0.06]" />
          <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full border border-white/[0.04]" />

          {/* Progress bar */}
          {progress != null && progress > 0 && (
            <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/30">
              <div
                className="bg-solana-green h-full shadow-[0_0_8px_rgba(20,241,149,0.4)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] uppercase",
                DIFFICULTY_COLORS[course.difficulty]
              )}
            >
              {t(
                `filter${course.difficulty.charAt(0).toUpperCase()}${course.difficulty.slice(1)}` as
                  | "filterBeginner"
                  | "filterIntermediate"
                  | "filterAdvanced"
              )}
            </Badge>
            {course.track && (
              <Badge
                variant="outline"
                className="border-white/[0.08] text-[10px] text-neutral-500"
              >
                {course.track}
              </Badge>
            )}
            {progress != null && progress > 0 && (
              <Badge
                variant="outline"
                className="border-solana-green/20 bg-solana-green/10 text-solana-green text-[10px]"
              >
                {t("progress", { pct: progress })}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold text-white">
            {course.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-neutral-500">
            {course.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 border-t border-white/[0.05] pt-3 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {t("duration", { hours: course.duration })}
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                />
              </svg>
              {t("lessons", { count: totalLessons })}
            </span>
            <span className="from-solana-purple to-solana-green ml-auto bg-gradient-to-r bg-clip-text font-semibold text-transparent">
              {t("xpReward", { xp: course.xpReward })}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
