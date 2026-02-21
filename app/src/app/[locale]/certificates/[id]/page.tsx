import { setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { CertificateDetail } from "./_components/certificate-detail";

export const metadata = {
  title: "Certificate | Superteam Academy",
  description: "View your credential and on-chain proof of learning.",
};

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <CertificateDetail courseId={id} />
      </div>
    </AppShell>
  );
}
