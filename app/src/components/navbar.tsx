"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "@/components/auth/user-menu";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="from-solana-purple to-solana-green flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Superteam Academy
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/courses"
              className="rounded-md px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {t("courses")}
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-md px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {t("leaderboard")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
