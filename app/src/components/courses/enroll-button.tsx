"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnrollState = "idle" | "enrolled";

export function EnrollButton({
  courseId,
  courseSlug,
  initialState = "idle",
  className,
}: {
  courseId: string;
  courseSlug: string;
  initialState?: EnrollState;
  className?: string;
}) {
  const t = useTranslations("courseDetail");
  const tEnroll = useTranslations("enrollment");
  const router = useRouter();
  const [state, setState] = useState<EnrollState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = () => {
    setError(null);
    startTransition(async () => {
      try {
        // TODO: check auth, redirect to /auth/sign-in if not authenticated
        // TODO: wire to services.enrollment.enroll(userId, courseId)
        console.log("Enrolling in course:", courseId);
        setState("enrolled");
        router.push(`/courses/${courseSlug}`);
      } catch {
        setError(tEnroll("enrollError"));
      }
    });
  };

  const handleContinue = () => {
    router.push(`/courses/${courseSlug}`);
  };

  if (state === "enrolled") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Button
          size="lg"
          onClick={handleContinue}
          className="from-solana-green to-solana-blue shadow-solana-green/20 hover:shadow-solana-green/30 w-full cursor-pointer bg-gradient-to-r text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          {t("continueLesson")}
        </Button>
        <p className="text-center text-xs text-neutral-500">
          <svg
            className="mr-1 inline-block h-3.5 w-3.5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="text-emerald-400">{t("enrolled")}</span>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        size="lg"
        onClick={handleEnroll}
        disabled={isPending}
        className="from-solana-purple to-solana-blue shadow-solana-purple/25 hover:shadow-solana-purple/35 w-full cursor-pointer bg-gradient-to-r text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : null}
        {t("enrollNow")}
      </Button>
      {error && <p className="text-center text-xs text-rose-400">{error}</p>}
    </div>
  );
}
