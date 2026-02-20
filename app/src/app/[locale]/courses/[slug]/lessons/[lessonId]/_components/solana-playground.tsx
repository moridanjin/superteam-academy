"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface SolanaPlaygroundProps {
  starterCode: string;
  onLoadError?: () => void;
}

export function SolanaPlayground({
  starterCode,
  onLoadError,
}: SolanaPlaygroundProps) {
  const t = useTranslations("lesson");
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleLoad = useCallback(() => {
    setLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Best-effort starter code injection via postMessage
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "solpg-set-code", code: starterCode },
        "https://beta.solpg.io"
      );
    } catch {
      // Silent failure is acceptable
    }
  }, [starterCode]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setLoading(false);
        onLoadError?.();
      }
    }, 15000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading, onLoadError]);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-950">
          <Loader2 className="text-solana-purple h-6 w-6 animate-spin" />
          <span className="text-sm text-neutral-500">
            {t("playgroundLoading")}
          </span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="https://beta.solpg.io/"
        title={t("playground")}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
        onLoad={handleLoad}
      />
    </div>
  );
}
