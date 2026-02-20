"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServicesMaybe } from "@/lib/services";
import type { XPSummary } from "@/lib/services";
import { MOCK_XP_SUMMARY } from "@/components/gamification/mock-data";

export function useXP() {
  const { user } = useAuth();
  const services = useServicesMaybe();
  const [data, setData] = useState<XPSummary | null>(null);
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
      const xp = await services.xp.getXP(user.id);
      setData(xp);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load XP"));
      setData(MOCK_XP_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, [user, services]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
