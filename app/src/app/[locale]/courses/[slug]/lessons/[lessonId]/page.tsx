import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getCourseBySlug, getCoursesSlugs } from "@/lib/cms";
import type { Lesson } from "@/lib/cms/types";
import { Toaster } from "@/components/ui/sonner";
import { LessonLayout } from "./_components/lesson-layout";

// ── Static params ──

export async function generateStaticParams() {
  const slugs = await getCoursesSlugs();
  const params: Array<{ slug: string; lessonId: string }> = [];

  for (const slug of slugs) {
    const course = await getCourseBySlug(slug);
    if (!course) continue;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        params.push({ slug, lessonId: String(lesson.id) });
      }
    }
  }

  return params;
}

// ── Metadata ──

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Lesson Not Found" };

  const lessonIdNum = parseInt(lessonId, 10);
  let lessonTitle = "Lesson";
  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.id === lessonIdNum);
    if (found) {
      lessonTitle = found.title;
      break;
    }
  }

  return {
    title: `${lessonTitle} — ${course.title} | Superteam Academy`,
    description: course.description,
  };
}

// ── Helpers ──

interface FlatLesson {
  lesson: Lesson;
  moduleTitle: string;
}

function flattenLessons(
  modules: { title: string; lessons: Lesson[] }[]
): FlatLesson[] {
  return modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ lesson, moduleTitle: mod.title }))
  );
}

// ── Page ──

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; lessonId: string }>;
}) {
  const { locale, slug, lessonId } = await params;
  setRequestLocale(locale);

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const lessonIdNum = parseInt(lessonId, 10);
  if (isNaN(lessonIdNum)) notFound();

  const flatLessons = flattenLessons(course.modules);
  const currentIndex = flatLessons.findIndex(
    (fl) => fl.lesson.id === lessonIdNum
  );

  if (currentIndex === -1) notFound();

  const currentLesson = flatLessons[currentIndex]!.lesson;
  const prevLessonId =
    currentIndex > 0 ? flatLessons[currentIndex - 1]!.lesson.id : null;
  const nextLessonId =
    currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]!.lesson.id
      : null;

  return (
    <>
      <LessonLayout
        course={course}
        currentLesson={currentLesson}
        flatLessons={flatLessons}
        currentIndex={currentIndex}
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
      />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "bg-neutral-900 border-white/[0.08] text-neutral-200 text-sm",
        }}
      />
    </>
  );
}
