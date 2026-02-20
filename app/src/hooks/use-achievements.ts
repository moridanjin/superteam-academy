"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServicesMaybe } from "@/lib/services";
import type { AchievementInfo } from "@/lib/services";
import { MOCK_ACHIEVEMENTS } from "@/components/gamification/mock-data";

export function useAchievements() {
  const { user } = useAuth();
  const services = useServicesMaybe();
  const [data, setData] = useState<AchievementInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!user || !services) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const achievements = await services.achievements.getAchievements(user.id);
      setData(achievements);
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to load achievements")
      );
      setData(MOCK_ACHIEVEMENTS);
    } finally {
      setLoading(false);
    }
  }, [user, services]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
