"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowRight } from "lucide-react";
import type { Credential } from "@/lib/services";

type CertificateListCardProps = {
  credential: Credential;
};

export function CertificateListCard({ credential }: CertificateListCardProps) {
  const t = useTranslations("certificates");

  const issuedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(credential.issuedAt));

  return (
    <Link href={`/certificates/${credential.courseId}`}>
      <Card className="group cursor-pointer border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div className="bg-solana-purple/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Award className="text-solana-purple h-5 w-5" />
            </div>
            <Badge
              variant={credential.onChain ? "default" : "secondary"}
              className={
                credential.onChain
                  ? "bg-solana-green/10 text-solana-green border-0 text-xs"
                  : "text-xs"
              }
            >
              {credential.onChain ? t("onChain") : t("offChain")}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-200">
              {credential.courseTitle}
            </h3>
            {credential.track && (
              <p className="mt-0.5 text-xs text-neutral-500">
                {credential.track}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">{issuedDate}</p>
            <span className="flex items-center gap-1 text-xs text-neutral-500 transition-colors group-hover:text-neutral-300">
              {t("viewCertificate")}
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
