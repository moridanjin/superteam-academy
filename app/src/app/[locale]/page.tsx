import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion";

/* ────────────────────────────────────────── Hero ────────────────────────────── */

function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative flex flex-col items-center px-4 pt-20 pb-16 text-center md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-solana-purple/20 absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-solana-green/10 absolute top-20 left-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      <FadeIn className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
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
            className="from-solana-purple to-solana-blue shadow-solana-purple/25 hover:shadow-solana-purple/30 cursor-pointer bg-gradient-to-r px-8 text-white shadow-lg transition-shadow hover:shadow-xl"
            asChild
          >
            <Link href="/auth/sign-in">{t("ctaStart")}</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer border-white/10 px-8"
            asChild
          >
            <Link href="/courses">{t("ctaExplore")}</Link>
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}

/* ────────────────────────────────────────── Stats ───────────────────────────── */

function StatsSection() {
  const t = useTranslations("home");

  const stats = [
    { value: "1,200+", label: t("statsLearners") },
    { value: "15+", label: t("statsCourses") },
    { value: "3,400+", label: t("statsCredentials") },
  ];

  return (
    <section className="border-y border-white/5 bg-neutral-950/50">
      <FadeInStagger className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-white/5 py-8">
        {stats.map((stat) => (
          <FadeInItem
            key={stat.label}
            className="flex flex-col items-center gap-1 px-4"
          >
            <span className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              {stat.value}
            </span>
            <span className="text-xs text-neutral-500 md:text-sm">
              {stat.label}
            </span>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}

/* ────────────────────────────────── How It Works ────────────────────────────── */

function HowItWorksSection() {
  const t = useTranslations("home");

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Desc"),
      gradient: "from-solana-purple to-solana-blue",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Desc"),
      gradient: "from-solana-blue to-solana-green",
      icon: (
        <svg
          className="h-6 w-6"
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
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Desc"),
      gradient: "from-solana-green to-solana-purple",
      icon: (
        <svg
          className="h-6 w-6"
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
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <FadeIn className="mb-12 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          {t("howItWorksTitle")}
        </h2>
        <p className="mx-auto max-w-lg text-neutral-400">
          {t("howItWorksSubline")}
        </p>
      </FadeIn>

      <FadeInStagger className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <FadeInItem key={step.number}>
            <div className="group relative rounded-xl border border-white/5 bg-neutral-900/50 p-6 transition-colors hover:border-white/10 hover:bg-neutral-900/80">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
                >
                  {step.icon}
                </div>
                <span className="text-xs font-bold tracking-wider text-neutral-600 uppercase">
                  {t("step")} {step.number}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                {step.description}
              </p>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}

/* ──────────────────────────────── Features ──────────────────────────────────── */

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
      <FadeIn className="mb-12 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          {t("featuresTitle")}
        </h2>
        <p className="mx-auto max-w-lg text-neutral-400">
          {t("featuresSubline")}
        </p>
      </FadeIn>

      <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FadeInItem key={feature.title}>
            <div className="group rounded-xl border border-white/5 bg-neutral-900/50 p-6 transition-colors hover:border-white/10 hover:bg-neutral-900/80">
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
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}

/* ──────────────────────────── Learning Paths ────────────────────────────────── */

function LearningPathsSection() {
  const t = useTranslations("home");

  const paths = [
    {
      title: t("pathFundamentals"),
      description: t("pathFundamentalsDesc"),
      lessons: 12,
      duration: t("pathDuration1"),
      level: t("levelBeginner"),
      progress: 0,
      gradient: "from-solana-purple to-solana-blue",
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
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
    {
      title: t("pathDeFi"),
      description: t("pathDeFiDesc"),
      lessons: 18,
      duration: t("pathDuration2"),
      level: t("levelIntermediate"),
      progress: 0,
      gradient: "from-solana-blue to-solana-green",
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
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
      ),
    },
    {
      title: t("pathFullStack"),
      description: t("pathFullStackDesc"),
      lessons: 24,
      duration: t("pathDuration3"),
      level: t("levelAdvanced"),
      progress: 0,
      gradient: "from-solana-green to-solana-purple",
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
            d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
          />
        </svg>
      ),
    },
  ];

  const levelColors: Record<string, string> = {
    [t("levelBeginner")]: "bg-solana-green/10 text-solana-green",
    [t("levelIntermediate")]: "bg-solana-blue/10 text-solana-blue",
    [t("levelAdvanced")]: "bg-solana-purple/10 text-solana-purple",
  };

  return (
    <section className="border-y border-white/5 bg-neutral-900/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            {t("pathsTitle")}
          </h2>
          <p className="mx-auto max-w-lg text-neutral-400">
            {t("pathsSubline")}
          </p>
        </FadeIn>

        <FadeInStagger className="grid gap-6 md:grid-cols-3">
          {paths.map((path) => (
            <FadeInItem key={path.title}>
              <Link
                href="/courses"
                className="group flex h-full cursor-pointer flex-col rounded-xl border border-white/5 bg-neutral-950/80 p-6 transition-colors hover:border-white/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${path.gradient} text-white shadow-lg`}
                  >
                    {path.icon}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${levelColors[path.level] ?? "bg-white/5 text-neutral-400"}`}
                  >
                    {path.level}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-semibold text-white">
                  {path.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-500">
                  {path.description}
                </p>

                <div className="mt-auto space-y-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${path.gradient}`}
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>
                      {path.lessons} {t("lessons")}
                    </span>
                    <span>{path.duration}</span>
                  </div>
                </div>
              </Link>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

/* ─────────────────────────── Social Proof ───────────────────────────────────── */

function TestimonialsSection() {
  const t = useTranslations("home");

  const testimonials = [
    {
      name: "Lucas Oliveira",
      role: t("testimonial1Role"),
      quote: t("testimonial1Quote"),
      avatar: "L",
    },
    {
      name: "María García",
      role: t("testimonial2Role"),
      quote: t("testimonial2Quote"),
      avatar: "M",
    },
    {
      name: "Alex Chen",
      role: t("testimonial3Role"),
      quote: t("testimonial3Quote"),
      avatar: "A",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <FadeIn className="mb-12 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          {t("testimonialsTitle")}
        </h2>
        <p className="mx-auto max-w-lg text-neutral-400">
          {t("testimonialsSubline")}
        </p>
      </FadeIn>

      <FadeInStagger className="grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <FadeInItem key={item.name}>
            <div className="flex h-full flex-col rounded-xl border border-white/5 bg-neutral-900/50 p-6">
              <svg
                className="text-solana-purple/30 mb-4 h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-400">
                {item.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="from-solana-purple to-solana-blue flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-neutral-500">{item.role}</p>
                </div>
              </div>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}

/* ─────────────────────────── Partner Logos ──────────────────────────────────── */

function PartnersSection() {
  const t = useTranslations("home");

  return (
    <section className="border-y border-white/5 bg-neutral-950/50 py-12">
      <FadeIn className="mx-auto max-w-4xl px-4 text-center">
        <p className="mb-8 text-xs font-semibold tracking-wider text-neutral-600 uppercase">
          {t("partnersTitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {/* Solana */}
          <div className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-300">
            <svg
              className="h-5 w-5"
              viewBox="0 0 397.7 311.7"
              fill="currentColor"
            >
              <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
              <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
              <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
            </svg>
            <span className="text-sm font-medium">Solana</span>
          </div>
          {/* Superteam */}
          <div className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-300">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/20">
              <span className="text-xs font-bold text-indigo-400">S</span>
            </div>
            <span className="text-sm font-medium">Superteam</span>
          </div>
          {/* Helius */}
          <div className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-300">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <span className="text-sm font-medium">Helius</span>
          </div>
          {/* Metaplex */}
          <div className="flex items-center gap-2 text-neutral-500 transition-colors hover:text-neutral-300">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-medium">Metaplex</span>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ──────────────────────────── Final CTA ─────────────────────────────────────── */

function CtaSection() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-solana-purple/10 absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      </div>

      <FadeIn className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
          {t("ctaTitle")}
        </h2>
        <p className="mb-8 text-neutral-400">{t("ctaSubline")}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="from-solana-purple to-solana-blue shadow-solana-purple/25 hover:shadow-solana-purple/30 cursor-pointer bg-gradient-to-r px-8 text-white shadow-lg transition-shadow hover:shadow-xl"
            asChild
          >
            <Link href="/auth/sign-in">{t("ctaStart")}</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer border-white/10 px-8"
            asChild
          >
            <Link href="/courses">{t("ctaExplore")}</Link>
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}

/* ──────────────────────────── Page ──────────────────────────────────────────── */

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  params.then(({ locale }) => setRequestLocale(locale));

  return (
    <AppShell>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <LearningPathsSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </AppShell>
  );
}
