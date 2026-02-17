import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Enable static rendering
  params.then(({ locale }) => setRequestLocale(locale));
  const t = useTranslations("home");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-3">
        <div className="from-solana-purple to-solana-green h-10 w-10 rounded-lg bg-gradient-to-br" />
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>
      <p className="max-w-md text-center text-neutral-400">
        {t("description")}
      </p>
    </div>
  );
}
