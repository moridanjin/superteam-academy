"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";
import { User, Shield, SlidersHorizontal, AlertTriangle } from "lucide-react";
import { ProfileSection } from "./profile-section";
import { AccountSection } from "./account-section";
import { PreferencesSection } from "./preferences-section";
import { DangerZoneSection } from "./danger-zone-section";

export function SettingsContent() {
  const t = useTranslations("settings");
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">{t("notAuthenticated")}</p>
      </div>
    );
  }

  return (
    <FadeIn>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList
          variant="line"
          className="mb-8 w-full justify-start border-b border-white/[0.06] pb-px"
        >
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {t("tabProfile")}
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Shield className="h-4 w-4" />
            {t("tabAccount")}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t("tabPreferences")}
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t("tabDanger")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection user={user} profile={profile} />
        </TabsContent>

        <TabsContent value="account">
          <AccountSection user={user} profile={profile} />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesSection />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZoneSection />
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
}
