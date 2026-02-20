"use client";

import { useTranslations } from "next-intl";
import { Circle, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TestStatus = "idle" | "running" | "passed" | "failed";

interface ChallengeTestCasesProps {
  testCases: string;
  status: TestStatus;
}

const statusConfig: Record<
  TestStatus,
  { icon: typeof Circle; className: string }
> = {
  idle: { icon: Circle, className: "text-neutral-600" },
  running: { icon: Loader2, className: "text-solana-blue animate-spin" },
  passed: { icon: CheckCircle, className: "text-solana-green" },
  failed: { icon: XCircle, className: "text-red-400" },
};

export function ChallengeTestCases({
  testCases,
  status,
}: ChallengeTestCasesProps) {
  const t = useTranslations("lesson");
  const cases = testCases
    .split("\n")
    .map((c) => c.trim())
    .filter(Boolean);

  if (cases.length === 0) return null;

  const { icon: StatusIcon, className: iconClass } = statusConfig[status];

  return (
    <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <h4 className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {t("testCases")}
      </h4>
      <ol className="space-y-2">
        {cases.map((tc, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-neutral-400"
          >
            <StatusIcon className={cn("mt-0.5 h-4 w-4 shrink-0", iconClass)} />
            <span>{tc}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
