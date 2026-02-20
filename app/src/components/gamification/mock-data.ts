import type { XPSummary, StreakInfo, AchievementInfo } from "@/lib/services";

export const MOCK_XP_SUMMARY: XPSummary = {
  totalXp: 2750,
  level: 7,
  xpToNextLevel: 450,
  recentEvents: [
    {
      amount: 50,
      source: "lesson_completion",
      referenceId: "lesson-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      amount: 200,
      source: "course_completion",
      referenceId: "course-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      amount: 25,
      source: "streak_bonus",
      referenceId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      amount: 100,
      source: "achievement",
      referenceId: "week_warrior",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      amount: 50,
      source: "referral",
      referenceId: "user-abc",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
  ],
};

export const MOCK_STREAK_INFO: StreakInfo = {
  currentStreak: 12,
  longestStreak: 23,
  lastActivityDate: new Date().toISOString().split("T")[0]!,
  freezeCount: 2,
};

export const MOCK_ACHIEVEMENTS: AchievementInfo[] = [
  {
    key: "first_steps",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    key: "five_lessons",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    key: "first_course",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    key: "week_warrior",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    key: "early_adopter",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
];

/** Generate ~84 days of mock activity dates with ~60% active */
function generateMockActivityDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 84; i++) {
    if (Math.random() < 0.6) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().split("T")[0]!);
    }
  }
  return dates.reverse();
}

export const MOCK_ACTIVITY_DATES: string[] = generateMockActivityDates();
