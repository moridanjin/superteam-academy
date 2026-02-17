"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  GoogleSignInButton,
  GitHubSignInButton,
} from "@/components/auth/sign-in-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const t = useTranslations("auth");

  return (
    <Card className="w-full max-w-sm border-white/10 bg-neutral-900/80 shadow-2xl backdrop-blur">
      <CardHeader className="text-center">
        <div className="from-solana-purple to-solana-green shadow-solana-purple/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
          <span className="text-lg font-bold text-white">S</span>
        </div>
        <CardTitle className="text-xl">{t("welcomeBack")}</CardTitle>
        <CardDescription>{t("signInDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {error && (
          <p className="rounded-md bg-red-950/50 p-2 text-center text-sm text-red-400">
            {t("authFailed")}
          </p>
        )}
        <GoogleSignInButton />
        <GitHubSignInButton />
        <Separator className="my-1" />
        <p className="text-center text-xs text-neutral-500">
          {t("walletNote")}
        </p>
      </CardContent>
    </Card>
  );
}

function BrandingPanel() {
  const t = useTranslations("auth");

  return (
    <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden lg:flex">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-solana-purple/15 absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-solana-green/10 absolute bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center gap-6 px-8 text-center">
        <div className="from-solana-purple to-solana-green shadow-solana-purple/30 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl">
          <span className="text-2xl font-bold text-white">S</span>
        </div>
        <h2 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {t("signInHeadline")}
        </h2>
        <p className="text-base leading-relaxed text-neutral-500">
          {t("signInSubline")}
        </p>

        {/* Decorative grid */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            "from-solana-purple/20 to-solana-blue/20",
            "from-solana-blue/20 to-solana-green/20",
            "from-solana-green/20 to-solana-purple/20",
            "from-solana-blue/20 to-solana-green/20",
            "from-solana-purple/20 to-solana-pink/20",
            "from-solana-green/20 to-solana-blue/20",
          ].map((gradient, i) => (
            <div
              key={i}
              className={`h-16 w-16 rounded-lg bg-gradient-to-br ${gradient} border border-white/5`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Left: Branding panel (desktop only) */}
      <BrandingPanel />

      {/* Right: Sign-in form */}
      <div className="flex flex-1 flex-col items-center justify-center border-l border-white/5 p-4 lg:max-w-lg">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Superteam Academy
        </Link>

        <Suspense
          fallback={
            <div className="border-t-solana-purple h-8 w-8 animate-spin rounded-full border-2 border-neutral-700" />
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
