"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Globe, Moon, Bell, Flame } from "lucide-react";

export function PreferencesSection() {
  const t = useTranslations("settings");
  const tLang = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);

  function switchLocale(newLocale: string) {
    localStorage.setItem("preferred-locale", newLocale);
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-neutral-200">
            {t("preferencesTitle")}
          </CardTitle>
          <p className="text-sm text-neutral-500">
            {t("preferencesDescription")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-200">
                  {t("languageTitle")}
                </p>
                <p className="text-xs text-neutral-500">
                  {t("languageDescription")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    locale === loc
                      ? "border-solana-purple bg-solana-purple/10 text-solana-purple"
                      : "border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:border-white/[0.12] hover:text-neutral-200"
                  }`}
                >
                  {tLang(loc)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-200">
                  {t("themeTitle")}
                </p>
                <p className="text-xs text-neutral-500">
                  {t("themeDescription")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="border-solana-purple bg-solana-purple/10 text-solana-purple border text-xs"
              >
                {t("themeDark")}
              </Badge>
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-200">
                  {t("notificationsTitle")}
                </p>
                <p className="text-xs text-neutral-500">
                  {t("notificationsDescription")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <Bell className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-300">
                      {t("notifyEmail")}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {t("notifyEmailDescription")}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-300">
                      {t("notifyStreak")}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {t("notifyStreakDescription")}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={streakReminders}
                  onCheckedChange={setStreakReminders}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
