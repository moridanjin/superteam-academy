import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/app-shell";
import { FadeIn } from "@/components/motion";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CertificatesContent } from "./_components/certificates-content";

export const metadata = {
  title: "Certificates | Superteam Academy",
  description: "View your earned credentials and on-chain proof of learning.",
};

function PageHeader() {
  const t = useTranslations("certificates");

  return (
    <div className="relative border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-solana-purple/10 absolute -top-20 left-1/4 h-[300px] w-[500px] rounded-full blur-[100px]" />
        <div className="bg-solana-blue/8 absolute -top-10 right-1/4 h-[250px] w-[400px] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <FadeIn>
          <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-500">
            {t("subtitle")}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AppShell>
      <ProtectedRoute>
        <PageHeader />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <CertificatesContent />
        </div>
      </ProtectedRoute>
    </AppShell>
  );
}
