"use client";

import { useTranslations } from "next-intl";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Credential } from "@/lib/services";
import { CredentialCard } from "./credential-card";

type CredentialListProps = {
  credentials: Credential[] | null;
};

export function CredentialList({ credentials }: CredentialListProps) {
  const t = useTranslations("profile");

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-200">
          {t("credentials")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {credentials && credentials.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {credentials.map((cred) => (
              <CredentialCard key={cred.courseId} credential={cred} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <Award className="h-6 w-6 text-neutral-600" />
            <p className="text-sm text-neutral-500">{t("noCredentials")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
