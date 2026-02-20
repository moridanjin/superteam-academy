"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock, BookOpen } from "lucide-react";

interface ChallengeSolutionProps {
  solution: string;
  canReveal: boolean;
}

export function ChallengeSolution({
  solution,
  canReveal,
}: ChallengeSolutionProps) {
  const t = useTranslations("lesson");

  if (!canReveal) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] px-4 py-3 text-sm text-neutral-600">
        <Lock className="h-4 w-4 shrink-0" />
        <span>{t("solutionLocked")}</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="solution"
          className="border-solana-green/10 bg-solana-green/[0.03] rounded-lg border"
        >
          <AccordionTrigger className="cursor-pointer gap-2 px-4 py-3 text-sm hover:no-underline">
            <div className="text-solana-green flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{t("solutionLabel")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-0 pb-4">
            <pre className="overflow-x-auto rounded-md bg-neutral-900/80 p-4 font-mono text-[13px] leading-relaxed text-neutral-400">
              {solution}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
