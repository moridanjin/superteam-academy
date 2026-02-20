"use client";

import { useTranslations } from "next-intl";
import { Terminal } from "lucide-react";

interface ChallengePromptProps {
  prompt: string;
  expectedOutput: string;
}

export function ChallengePrompt({
  prompt,
  expectedOutput,
}: ChallengePromptProps) {
  const t = useTranslations("lesson");

  return (
    <div className="border-solana-purple/20 bg-solana-purple/[0.03] mt-6 rounded-lg border p-4">
      <div className="text-solana-purple mb-3 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        <h3 className="text-sm font-semibold">{t("challengePrompt")}</h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-neutral-400">{prompt}</p>
      <div>
        <span className="mb-1.5 block text-xs font-medium text-neutral-500">
          {t("expectedOutput")}
        </span>
        <pre className="overflow-x-auto rounded-md bg-neutral-900/60 px-3 py-2 font-mono text-xs leading-relaxed text-neutral-400">
          {expectedOutput}
        </pre>
      </div>
    </div>
  );
}
