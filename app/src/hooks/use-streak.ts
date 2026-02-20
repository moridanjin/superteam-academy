"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServicesMaybe } from "@/lib/services";
import type { StreakInfo } from "@/lib/services";
import {
  MOCK_STREAK_INFO,
  MOCK_ACTIVITY_DATES,
} from "@/components/gamification/mock-data";

type StreakData = StreakInfo & { activityDates: string[] };

export function useStreak() {
  const { user } = useAuth();
  const services = useServicesMaybe();
  const [data, setData] = useState<StreakData | null>(null);
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
      const since = new Date();
      since.setUTCDate(since.getUTCDate() - 84);
      const sinceStr = since.toISOString().split("T")[0]!;

      const [streak, activityDates] = await Promise.all([
        services.streak.getStreak(user.id),
        services.streak.getActivityDates(user.id, sinceStr),
      ]);
      setData({ ...streak, activityDates });
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load streak"));
      setData({ ...MOCK_STREAK_INFO, activityDates: MOCK_ACTIVITY_DATES });
    } finally {
      setLoading(false);
    }
  }, [user, services]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
