import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getCourseBySlug, getCoursesSlugs, getCourses } from "@/lib/cms";
import type { Course } from "@/lib/cms/types";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { EnrollButton } from "@/components/courses/enroll-button";
import { CourseCard } from "@/components/courses/course-card";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion";
import { cn } from "@/lib/utils";
import { CourseModules } from "./_components/course-modules";
import { MobileEnrollCTA } from "./_components/mobile-enroll-cta";

// ── Metadata ──

export async function generateStaticParams() {
  const slugs = await getCoursesSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} | Superteam Academy`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      type: "website",
    },
  };
}

// ── Helpers ──

const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
} as const;

const TRACK_GRADIENTS: Record<string, string> = {
  "Solana Fundamentals": "from-solana-purple to-solana-blue",
  "DeFi Developer": "from-solana-green to-solana-blue",
  "Full Stack Solana": "from-solana-pink to-solana-purple",
};

function getTotalLessons(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

function getChallengeCount(course: Course): number {
  return course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.type === "challenge").length,
    0
  );
}

// ── Hero / Header ──

function CourseHeader({ course }: { course: Course }) {
  const t = useTranslations("courseDetail");
  const tc = useTranslations("courses");
  const gradient =
    TRACK_GRADIENTS[course.track ?? ""] ?? "from-neutral-600 to-neutral-700";

  return (
    <section className="relative overflow-hidden border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute -top-32 -left-20 h-[500px] w-[600px] rounded-full opacity-15 blur-[120px]",
            `bg-gradient-to-br ${gradient}`
          )}
        />
        <div className="absolute -right-20 bottom-0 h-[300px] w-[400px] rounded-full bg-white/[0.02] blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Back link */}
        <FadeIn>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors duration-200 hover:text-neutral-300"
          >
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            {t("backToCourses")}
          </Link>
        </FadeIn>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left: Course info */}
          <FadeIn className="flex-1" delay={0.1}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] uppercase",
                  DIFFICULTY_COLORS[course.difficulty]
                )}
              >
                {tc(
                  `filter${course.difficulty.charAt(0).toUpperCase()}${course.difficulty.slice(1)}` as
                    | "filterBeginner"
                    | "filterIntermediate"
                    | "filterAdvanced"
                )}
              </Badge>
              {course.track && (
                <Badge
                  variant="outline"
                  className="border-white/10 text-[10px] text-neutral-400"
                >
                  {course.track}
                </Badge>
              )}
              <Badge
                variant="outline"
                className="border-white/10 text-[10px] text-neutral-400"
              >
                {tc("free")}
              </Badge>
            </div>

            <h1 className="mt-4 text-2xl leading-tight font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
              {course.description}
            </p>

            {/* Meta stats */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
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
                {t("totalDuration", { hours: course.duration })}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
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
                {t("lessonsCount", { count: getTotalLessons(course) })}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
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
                {t("challengesCount", { count: getChallengeCount(course) })}
              </span>
              <span
                className={cn(
                  "bg-gradient-to-r bg-clip-text font-semibold text-transparent",
                  gradient
                )}
              >
                {t("xpToEarn", { xp: course.xpReward })}
              </span>
            </div>
          </FadeIn>

          {/* Right: Enrollment card (glassmorphism) */}
          <FadeIn className="w-full shrink-0 lg:w-80" delay={0.2}>
            <div
              id="enroll-card"
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full border border-white/[0.04]" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full border border-white/[0.03]" />

              {/* Visual indicator with noise */}
              <div
                className={cn(
                  "relative mb-5 h-32 overflow-hidden rounded-xl bg-gradient-to-br",
                  gradient
                )}
              >
                <div
                  className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                  }}
                />
                <div className="flex h-full items-center justify-center opacity-30">
                  <svg
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>
              </div>

              <EnrollButton
                courseId={String(course.id)}
                courseSlug={course.slug}
              />

              {/* Quick stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.04] px-3 py-2.5 text-center">
                  <div className="text-lg font-bold text-white">
                    {course.modules.length}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {t("modulesLabel")}
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.04] px-3 py-2.5 text-center">
                  <div className="text-lg font-bold text-white">
                    {getTotalLessons(course)}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {t("lessonsLabel")}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── What You'll Learn ──

function WhatYoullLearn({ course }: { course: Course }) {
  const t = useTranslations("courseDetail");

  const learningPoints = course.modules.flatMap((m) =>
    m.lessons.slice(0, 2).map((l) => l.title)
  );

  return (
    <FadeIn>
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white">
          {t("whatYoullLearn")}
        </h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {learningPoints.map((point) => (
            <div key={point} className="flex items-start gap-2.5">
              <svg
                className="text-solana-green mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              <span className="text-sm leading-snug text-neutral-400">
                {point}
              </span>
            </div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

// ── Prerequisites ──

function Prerequisites() {
  const t = useTranslations("courseDetail");

  return (
    <FadeIn delay={0.1}>
      <section>
        <h2 className="text-lg font-semibold text-white">
          {t("prerequisites")}
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {t("prerequisitesNone")}
        </p>
      </section>
    </FadeIn>
  );
}

// ── Reviews (mock) ──

function Reviews() {
  const t = useTranslations("courseDetail");

  const reviews = [
    {
      author: t("reviewAuthor1"),
      role: t("reviewRole1"),
      text: t("reviewText1"),
      initials: "MS",
      gradient: "from-solana-purple to-solana-blue",
    },
    {
      author: t("reviewAuthor2"),
      role: t("reviewRole2"),
      text: t("reviewText2"),
      initials: "JL",
      gradient: "from-solana-green to-solana-blue",
    },
    {
      author: t("reviewAuthor3"),
      role: t("reviewRole3"),
      text: t("reviewText3"),
      initials: "AK",
      gradient: "from-solana-pink to-solana-purple",
    },
  ];

  return (
    <section>
      <FadeIn>
        <h2 className="text-lg font-semibold text-white">{t("reviews")}</h2>
      </FadeIn>
      <FadeInStagger className="mt-4 grid gap-4 sm:grid-cols-3">
        {reviews.map((review) => (
          <FadeInItem key={review.author}>
            <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]">
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-3.5 w-3.5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="mt-3 flex-1 text-xs leading-relaxed text-neutral-400">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-2.5 border-t border-white/5 pt-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white",
                    review.gradient
                  )}
                >
                  {review.initials}
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-300">
                    {review.author}
                  </div>
                  <div className="text-[10px] text-neutral-600">
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}

// ── Related Courses ──

async function RelatedCourses({
  currentSlug,
  track,
}: {
  currentSlug: string;
  track: string | null;
}) {
  const t = await getTranslations("courseDetail");
  const allCourses = await getCourses();

  const related = allCourses
    .filter((c) => c.slug !== currentSlug)
    .filter((c) => (track ? c.track === track : true))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-white/5 pt-10">
      <FadeIn>
        <h2 className="text-lg font-semibold text-white">
          {t("relatedCourses")}
        </h2>
      </FadeIn>
      <FadeInStagger className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((course) => (
          <FadeInItem key={course.id}>
            <CourseCard course={course} />
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}

// ── Page ──

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <AppShell>
      <CourseHeader course={course} />

      <div className="mx-auto max-w-6xl px-4 py-10 pb-24 lg:pb-10">
        <div className="flex flex-col gap-10">
          <WhatYoullLearn course={course} />

          <FadeIn delay={0.1}>
            <CourseModules modules={course.modules} courseSlug={course.slug} />
          </FadeIn>

          <Prerequisites />
          <Reviews />
          <RelatedCourses currentSlug={course.slug} track={course.track} />
        </div>
      </div>

      <MobileEnrollCTA courseId={String(course.id)} courseSlug={course.slug} />
    </AppShell>
  );
}
