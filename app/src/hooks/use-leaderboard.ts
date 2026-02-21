"use client";

import { useCallback, useEffect, useState } from "react";
import { useServicesMaybe } from "@/lib/services";
import type { LeaderboardEntry } from "@/lib/services";
import { MOCK_LEADERBOARD } from "@/components/gamification/mock-data";

const PAGE_SIZE = 50;

export function useLeaderboard(page = 0) {
  const services = useServicesMaybe();
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!services) {
      const start = page * PAGE_SIZE;
      setData(MOCK_LEADERBOARD.slice(start, start + PAGE_SIZE));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const entries = await services.leaderboard.getLeaderboard(
        PAGE_SIZE,
        page * PAGE_SIZE
      );
      setData(entries);
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to load leaderboard")
      );
      const start = page * PAGE_SIZE;
      setData(MOCK_LEADERBOARD.slice(start, start + PAGE_SIZE));
    } finally {
      setLoading(false);
    }
  }, [services, page]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
