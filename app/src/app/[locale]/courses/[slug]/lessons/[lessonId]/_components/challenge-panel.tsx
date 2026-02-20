"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/lib/cms/types";
import { ChallengePrompt } from "./challenge-prompt";
import { ChallengeTestCases } from "./challenge-test-cases";
import { LessonHints } from "./lesson-hints";
import { ChallengeSolution } from "./challenge-solution";
import { fireChallengeConfetti } from "./challenge-confetti";

type ChallengeStatus = "idle" | "running" | "verifying" | "passed" | "failed";

interface ChallengePanelProps {
  challenge: Challenge;
  onChallengePass: () => void;
}

export function ChallengePanel({
  challenge,
  onChallengePass,
}: ChallengePanelProps) {
  const t = useTranslations("lesson");
  const [status, setStatus] = useState<ChallengeStatus>("idle");
  const [attemptCount, setAttemptCount] = useState(0);

  const testStatus =
    status === "running"
      ? "running"
      : status === "passed"
        ? "passed"
        : status === "failed"
          ? "failed"
          : "idle";

  const canRevealSolution = status === "passed" || attemptCount >= 3;

  const handleRunTests = useCallback(async () => {
    setStatus("running");
    // Simulated test run delay
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("verifying");
  }, []);

  const handleVerifyPass = useCallback(() => {
    setStatus("passed");
    fireChallengeConfetti();
    toast.success(t("challengeSuccess"));
    onChallengePass();
  }, [t, onChallengePass]);

  const handleVerifyFail = useCallback(() => {
    setStatus("failed");
    setAttemptCount((c) => c + 1);
    toast.error(t("challengeFailed"));
    // Reset to idle after brief delay so user can try again
    setTimeout(() => setStatus("idle"), 1500);
  }, [t]);

  return (
    <div>
      <ChallengePrompt
        prompt={challenge.prompt}
        expectedOutput={challenge.expectedOutput}
      />

      <ChallengeTestCases testCases={challenge.testCases} status={testStatus} />

      {/* Run / Verify controls */}
      <div className="mt-4 space-y-3">
        {status === "verifying" ? (
          <div className="border-solana-blue/20 bg-solana-blue/[0.03] rounded-lg border p-4">
            <p className="mb-3 text-sm text-neutral-300">
              {t("verifyResults")}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleVerifyPass}
                className="bg-solana-green/20 text-solana-green hover:bg-solana-green/30 gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {t("testsPassed")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleVerifyFail}
                className="gap-1.5 border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="h-3.5 w-3.5" />
                {t("testsFailed")}
              </Button>
            </div>
          </div>
        ) : status !== "passed" ? (
          <Button
            onClick={handleRunTests}
            disabled={status === "running"}
            className={cn(
              "from-solana-purple to-solana-blue w-full gap-2 bg-gradient-to-r text-white",
              "hover:from-solana-purple/90 hover:to-solana-blue/90",
              "disabled:opacity-50"
            )}
          >
            {status === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {status === "running" ? t("running") : t("runTests")}
          </Button>
        ) : null}

        {attemptCount > 0 && status !== "passed" && (
          <p className="text-center text-xs text-neutral-600">
            {t("attemptsCount", { count: attemptCount })}
          </p>
        )}
      </div>

      {challenge.hints && <LessonHints hints={challenge.hints} />}

      <ChallengeSolution
        solution={challenge.solution}
        canReveal={canRevealSolution}
      />
    </div>
  );
}
