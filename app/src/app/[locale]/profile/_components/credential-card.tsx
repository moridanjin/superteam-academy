"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Credential } from "@/lib/services";

type CredentialCardProps = {
  credential: Credential;
};

export function CredentialCard({ credential }: CredentialCardProps) {
  const t = useTranslations("profile");

  const issuedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(credential.issuedAt));

  const truncatedMint = credential.mintAddress
    ? `${credential.mintAddress.slice(0, 4)}...${credential.mintAddress.slice(-4)}`
    : null;

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-solana-purple h-4 w-4" />
            <span className="text-sm font-medium text-neutral-200">
              {credential.courseTitle}
            </span>
          </div>
          <Badge
            variant={credential.onChain ? "default" : "secondary"}
            className="text-xs"
          >
            {credential.onChain ? t("onChain") : t("offChain")}
          </Badge>
        </div>

        {credential.track && (
          <p className="text-xs text-neutral-500">{credential.track}</p>
        )}

        <p className="text-xs text-neutral-500">{issuedDate}</p>

        {truncatedMint && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500">
              {t("mintAddress")}: {truncatedMint}
            </span>
            <a
              href={`https://explorer.solana.com/address/${credential.mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-solana-purple inline-flex items-center gap-0.5 text-xs hover:underline"
            >
              {t("viewOnExplorer")}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
