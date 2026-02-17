"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LearningPlatformServices } from "./types";
import {
  SupabaseProgressService,
  SupabaseXPService,
  SupabaseStreakService,
  SupabaseLeaderboardService,
  SupabaseCredentialService,
  SupabaseEnrollmentService,
  SupabaseAchievementService,
} from "./supabase-services";

const ServicesContext = createContext<LearningPlatformServices | null>(null);

function createSupabaseServices(): LearningPlatformServices {
  const db = createClient();
  return {
    progress: new SupabaseProgressService(db),
    xp: new SupabaseXPService(db),
    streak: new SupabaseStreakService(db),
    leaderboard: new SupabaseLeaderboardService(db),
    credentials: new SupabaseCredentialService(db),
    enrollment: new SupabaseEnrollmentService(db),
    achievements: new SupabaseAchievementService(db),
  };
}

export function ServicesProvider({ children }: { children: ReactNode }) {
  // Lazy initialization — avoids calling createClient() during SSG
  const ref = useRef<LearningPlatformServices | null>(null);

  if (!ref.current && typeof window !== "undefined") {
    ref.current = createSupabaseServices();
  }

  return (
    <ServicesContext.Provider value={ref.current}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): LearningPlatformServices {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error(
      "useServices must be used within a ServicesProvider (client-side only)"
    );
  }
  return ctx;
}
