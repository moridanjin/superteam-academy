"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServicesMaybe } from "@/lib/services";
import type { Credential } from "@/lib/services";
import { MOCK_CREDENTIALS } from "@/components/gamification/mock-data";

export function useCredentials(userId?: string) {
  const { user } = useAuth();
  const services = useServicesMaybe();
  const [data, setData] = useState<Credential[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const targetId = userId ?? user?.id;

  const fetch = useCallback(async () => {
    if (!targetId || !services) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const creds = await services.credentials.getCredentials(targetId);
      setData(creds);
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to load credentials")
      );
      setData(MOCK_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  }, [targetId, services]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
