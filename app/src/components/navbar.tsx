"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { UserMenu } from "@/components/auth/user-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/courses", key: "courses" },
  { href: "/leaderboard", key: "leaderboard" },
] as const;

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm transition-colors duration-200",
        active
          ? "bg-white/10 font-medium text-white"
          : "text-neutral-400 hover:bg-white/5 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="mr-1 h-9 w-9 p-0 md:hidden"
          aria-label="Open menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-white/10 bg-neutral-950">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left">
            <div className="from-solana-purple to-solana-green flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <span className="text-sm font-semibold">Superteam Academy</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.key === "courses" && (
                  <svg
                    className="h-4 w-4"
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
                )}
                {link.key === "leaderboard" && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.52.587 6.023 6.023 0 0 1-2.52-.587"
                    />
                  </svg>
                )}
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-center justify-between px-3">
            <LanguageSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <MobileNav />
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
          >
            <div className="from-solana-purple to-solana-green flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              Superteam Academy
            </span>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.key}
                href={link.href}
                active={pathname.startsWith(link.href)}
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
