"use client";

import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FadeInStagger, FadeInItem } from "@/components/motion";
import { CertificateListCard } from "./certificate-list-card";

export function CertificatesContent() {
  const t = useTranslations("certificates");
  const { data: credentials, loading } = useCredentials();

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!credentials || credentials.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Award className="h-12 w-12 text-neutral-600" />
        <p className="max-w-sm text-center text-sm text-neutral-500">
          {t("noCertificates")}
        </p>
        <Button asChild>
          <Link href="/courses">{t("startLearning")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {credentials.map((cred) => (
        <FadeInItem key={cred.courseId}>
          <CertificateListCard credential={cred} />
        </FadeInItem>
      ))}
    </FadeInStagger>
  );
}
