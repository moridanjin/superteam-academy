"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
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
  const [services] = useState<LearningPlatformServices | null>(() =>
    typeof window !== "undefined" ? createSupabaseServices() : null
  );

  return (
    <ServicesContext.Provider value={services}>
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

export function useServicesMaybe(): LearningPlatformServices | null {
  return useContext(ServicesContext);
}
