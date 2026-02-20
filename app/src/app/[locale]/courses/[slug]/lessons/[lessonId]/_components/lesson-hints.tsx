"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";

interface LessonHintsProps {
  hints: string;
}

export function LessonHints({ hints }: LessonHintsProps) {
  const t = useTranslations("lesson");

  const hintList = hints
    .split("\n")
    .map((h) => h.trim())
    .filter(Boolean);

  if (hintList.length === 0) return null;

  return (
    <div className="mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="hints"
          className="rounded-lg border border-amber-500/10 bg-amber-500/[0.03]"
        >
          <AccordionTrigger className="cursor-pointer gap-2 px-4 py-3 text-sm hover:no-underline">
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="h-4 w-4" />
              <span className="font-medium">{t("hints")}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-0 pb-4">
            <div className="space-y-2">
              {hintList.map((hint, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-neutral-400"
                >
                  <span className="shrink-0 text-xs font-medium text-amber-500/60">
                    {t("hintLabel", { number: i + 1 })}:
                  </span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
