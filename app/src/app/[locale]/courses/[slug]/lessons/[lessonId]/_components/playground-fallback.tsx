"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";

interface PlaygroundFallbackProps {
  starterCode: string;
}

export function PlaygroundFallback({ starterCode }: PlaygroundFallbackProps) {
  const t = useTranslations("lesson");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(starterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <p className="text-sm text-neutral-500">{t("playgroundFallback")}</p>

      <div className="relative flex-1 overflow-auto rounded-lg border border-white/[0.06] bg-neutral-900/80">
        <pre className="p-4 font-mono text-[13px] leading-relaxed text-neutral-400">
          {starterCode}
        </pre>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-1.5 border-white/[0.08] bg-white/[0.02]"
        >
          {copied ? (
            <Check className="text-solana-green h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? t("codeCopied") : t("copyCode")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-1.5 border-white/[0.08] bg-white/[0.02]"
        >
          <a
            href="https://beta.solpg.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("openInPlayground")}
          </a>
        </Button>
      </div>
    </div>
  );
}
