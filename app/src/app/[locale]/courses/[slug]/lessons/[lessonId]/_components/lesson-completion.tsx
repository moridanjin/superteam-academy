"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonCompletionProps {
  isCompleted: boolean;
  xpReward: number;
  isLoading: boolean;
  onComplete: () => void;
}

export function LessonCompletion({
  isCompleted,
  xpReward,
  isLoading,
  onComplete,
}: LessonCompletionProps) {
  const t = useTranslations("lesson");

  if (isCompleted) {
    return (
      <div className="border-solana-green/20 bg-solana-green/5 mt-6 flex items-center gap-2 rounded-lg border px-4 py-3">
        <Check className="text-solana-green h-4 w-4" />
        <span className="text-solana-green text-sm font-medium">
          {t("completed")}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Button
        onClick={onComplete}
        disabled={isLoading}
        className={cn(
          "from-solana-purple to-solana-blue w-full gap-2 bg-gradient-to-r text-white",
          "hover:from-solana-purple/90 hover:to-solana-blue/90",
          "disabled:opacity-50"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        {t("markComplete")}
        {xpReward > 0 && (
          <span className="ml-1 text-xs opacity-70">+{xpReward} XP</span>
        )}
      </Button>
    </div>
  );
}
