"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { FileText, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChallengeTabsProps {
  contentSlot: ReactNode;
  playgroundSlot: ReactNode;
}

export function ChallengeTabs({
  contentSlot,
  playgroundSlot,
}: ChallengeTabsProps) {
  const t = useTranslations("lesson");
  const [activeTab, setActiveTab] = useState<"content" | "playground">(
    "content"
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 border-b border-white/[0.06]">
        <button
          onClick={() => setActiveTab("content")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "content"
              ? "border-solana-purple border-b-2 text-neutral-200"
              : "text-neutral-500 hover:text-neutral-400"
          )}
        >
          <FileText className="h-4 w-4" />
          {t("tabContent")}
        </button>
        <button
          onClick={() => setActiveTab("playground")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "playground"
              ? "border-solana-purple border-b-2 text-neutral-200"
              : "text-neutral-500 hover:text-neutral-400"
          )}
        >
          <Terminal className="h-4 w-4" />
          {t("tabPlayground")}
        </button>
      </div>

      {/* Both slots stay mounted to preserve iframe state */}
      <div
        className={cn(
          "flex-1 overflow-hidden",
          activeTab !== "content" && "hidden"
        )}
      >
        {contentSlot}
      </div>
      <div
        className={cn(
          "flex-1 overflow-hidden",
          activeTab !== "playground" && "hidden"
        )}
      >
        {playgroundSlot}
      </div>
    </div>
  );
}
