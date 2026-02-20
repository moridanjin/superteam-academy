"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useXP } from "@/hooks/use-xp";
import { useStreak } from "@/hooks/use-streak";
import { useAchievements } from "@/hooks/use-achievements";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useCredentials } from "@/hooks/use-credentials";
import { useServicesMaybe } from "@/lib/services";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

const MOCK_PROFILE: Tables<"users"> = {
  id: "mock",
  display_name: "Solana Learner",
  bio: "Learning to build on Solana",
  avatar_url: null,
  wallet_address: null,
  locale: "en",
  total_xp: 2750,
  level: 7,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  updated_at: new Date().toISOString(),
};
import type { AchievementInfo, XPSummary } from "@/lib/services";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeInStagger, FadeInItem } from "@/components/motion";
import { ProfileHeader } from "./profile-header";
import { CompletedCourses } from "./completed-courses";
import { CredentialList } from "./credential-list";
import { AchievementGrid } from "@/components/gamification/achievement-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type ProfileContentProps = {
  userId?: string;
  isOwnProfile: boolean;
};

export function ProfileContent({ userId, isOwnProfile }: ProfileContentProps) {
  const t = useTranslations("profile");
  const { profile } = useAuth();
  const services = useServicesMaybe();

  // Own-profile hooks
  const { data: xp, loading: xpLoading } = useXP();
  const { data: streak } = useStreak();
  const { data: ownAchievements, loading: ownAchLoading } = useAchievements();
  const { data: ownCourses, loading: ownCoursesLoading } = useCourseProgress();
  const { data: ownCredentials, loading: ownCredsLoading } = useCredentials();

  // Public-profile state
  const [publicProfile, setPublicProfile] = useState<Tables<"users"> | null>(
    null
  );
  const [publicXp, setPublicXp] = useState<XPSummary | null>(null);
  const [publicAchievements, setPublicAchievements] = useState<
    AchievementInfo[] | null
  >(null);
  const [publicLoading, setPublicLoading] = useState(!isOwnProfile);

  const loadPublicProfile = useCallback(async () => {
    if (isOwnProfile || !userId) return;
    setPublicLoading(true);
    try {
      const supabase = createClient();
      const { data: userRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      setPublicProfile(userRow as Tables<"users"> | null);

      if (services && userRow) {
        const [xpData, achData] = await Promise.all([
          services.xp.getXP(userId),
          services.achievements.getAchievements(userId),
        ]);
        setPublicXp(xpData);
        setPublicAchievements(achData);
      }
    } catch {
      // Graceful fallback — show what we have
    } finally {
      setPublicLoading(false);
    }
  }, [isOwnProfile, userId, services]);

  useEffect(() => {
    void loadPublicProfile();
  }, [loadPublicProfile]);

  const { data: pubCredentials, loading: pubCredsLoading } = useCredentials(
    isOwnProfile ? undefined : userId
  );

  // Resolve active data
  const activeProfile = isOwnProfile
    ? (profile ?? MOCK_PROFILE)
    : publicProfile;
  const activeXp = isOwnProfile ? xp : publicXp;
  const activeAchievements = isOwnProfile
    ? ownAchievements
    : publicAchievements;
  const activeCourses = isOwnProfile ? ownCourses : null;
  const activeCredentials = isOwnProfile ? ownCredentials : pubCredentials;

  const loading = isOwnProfile
    ? xpLoading || ownAchLoading || ownCoursesLoading || ownCredsLoading
    : publicLoading || pubCredsLoading;

  const unlockedKeys = useMemo(
    () => new Set((activeAchievements ?? []).map((a) => a.key)),
    [activeAchievements]
  );

  const unlockedDates = useMemo(
    () => new Map((activeAchievements ?? []).map((a) => [a.key, a.unlockedAt])),
    [activeAchievements]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!activeProfile) return null;

  return (
    <FadeInStagger className="space-y-8">
      <FadeInItem>
        <ProfileHeader
          profile={activeProfile}
          xpSummary={activeXp}
          streak={streak}
          isOwnProfile={isOwnProfile}
        />
      </FadeInItem>

      {activeAchievements && activeAchievements.length > 0 && (
        <FadeInItem>
          <Card className="border-white/[0.06] bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-200">
                {t("achievements")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AchievementGrid
                unlockedKeys={unlockedKeys}
                unlockedDates={unlockedDates}
              />
            </CardContent>
          </Card>
        </FadeInItem>
      )}

      {isOwnProfile && (
        <FadeInItem>
          <CompletedCourses courses={activeCourses} />
        </FadeInItem>
      )}

      <FadeInItem>
        <CredentialList credentials={activeCredentials} />
      </FadeInItem>
    </FadeInStagger>
  );
}
