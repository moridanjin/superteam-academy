"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useServicesMaybe } from "@/lib/services";
import type { CourseProgress } from "@/lib/services";
import { MOCK_COURSE_PROGRESS } from "@/components/gamification/mock-data";

export function useCourseProgress() {
  const { user } = useAuth();
  const services = useServicesMaybe();
  const [data, setData] = useState<CourseProgress[] | null>(null);
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
      const progress = await services.progress.getProgress(user.id);
      setData(progress);
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to load course progress")
      );
      setData(MOCK_COURSE_PROGRESS);
    } finally {
      setLoading(false);
    }
  }, [user, services]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
