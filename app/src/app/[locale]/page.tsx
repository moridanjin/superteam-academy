import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative flex flex-col items-center px-4 pt-20 pb-16 text-center md:pt-32 md:pb-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-solana-purple/20 absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-solana-green/10 absolute top-20 left-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <div className="from-solana-purple via-solana-blue to-solana-green inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r bg-clip-text px-4 py-1.5 text-xs font-medium text-transparent">
          <span className="bg-solana-green inline-block h-1.5 w-1.5 rounded-full" />
          <span className="text-neutral-400">Built on Solana</span>
        </div>

        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-6xl md:leading-tight">
          {t("heroHeadline")}
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
          {t("heroSubline")}
        </p>

        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
          <Button
            size="lg"
            className="from-solana-purple to-solana-blue shadow-solana-purple/25 hover:shadow-solana-purple/30 bg-gradient-to-r px-8 text-white shadow-lg transition-shadow hover:shadow-xl"
            asChild
          >
            <Link href="/auth/sign-in">{t("ctaStart")}</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/10 px-8"
            asChild
          >
            <Link href="/courses">{t("ctaExplore")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const t = useTranslations("home");

  const stats = [
    { value: "1,200+", label: t("statsLearners") },
    { value: "15+", label: t("statsCourses") },
    { value: "3,400+", label: t("statsCredentials") },
  ];

  return (
    <section className="border-y border-white/5 bg-neutral-950/50">
      <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-white/5 py-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 px-4"
          >
            <span className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              {stat.value}
            </span>
            <span className="text-xs text-neutral-500 md:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const t = useTranslations("home");

  const features = [
    {
      title: t("featureCredentials"),
      description: t("featureCredentialsDesc"),
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      ),
      gradient: "from-solana-purple to-solana-blue",
    },
    {
      title: t("featureInteractive"),
      description: t("featureInteractiveDesc"),
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      gradient: "from-solana-blue to-solana-green",
    },
    {
      title: t("featureGamified"),
      description: t("featureGamifiedDesc"),
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
          />
        </svg>
      ),
      gradient: "from-solana-green to-solana-purple",
    },
    {
      title: t("featureOpen"),
      description: t("featureOpenDesc"),
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      gradient: "from-solana-pink to-solana-purple",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-white/5 bg-neutral-900/50 p-6 transition-colors hover:border-white/10 hover:bg-neutral-900/80"
          >
            <div
              className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
            >
              {feature.icon}
            </div>
            <h3 className="mb-2 text-sm font-semibold text-white">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-500">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const t = useTranslations("home");

  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
        <div className="flex items-center gap-2">
          <div className="from-solana-purple to-solana-green flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br">
            <span className="text-[10px] font-bold text-white">S</span>
          </div>
          <span className="text-xs text-neutral-600">
            {t("footerBuiltBy")} Superteam {t("footerOnSolana")}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  params.then(({ locale }) => setRequestLocale(locale));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
