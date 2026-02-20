"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServicesMaybe } from "@/lib/services";
import type { LeaderboardEntry } from "@/lib/services";
import { MOCK_USER_RANK } from "@/components/gamification/mock-data";

export function useUserRank() {
  const { user } = useAuth();
  const services = useServicesMaybe();
  const [data, setData] = useState<LeaderboardEntry | null>(null);
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
      const rank = await services.leaderboard.getUserRank(user.id);
      setData(rank);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load user rank"));
      setData(MOCK_USER_RANK);
    } finally {
      setLoading(false);
    }
  }, [user, services]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
