export type AchievementCategory =
  | "progress"
  | "streaks"
  | "skills"
  | "community"
  | "special";

export type AchievementDefinition = {
  key: string;
  category: AchievementCategory;
  icon: string;
  xpReward: number;
  index: number;
};

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  "progress",
  "streaks",
  "skills",
  "community",
  "special",
];

export const ACHIEVEMENTS_CATALOG: AchievementDefinition[] = [
  // Progress (10)
  {
    key: "first_steps",
    category: "progress",
    icon: "Footprints",
    xpReward: 50,
    index: 0,
  },
  {
    key: "five_lessons",
    category: "progress",
    icon: "BookOpen",
    xpReward: 100,
    index: 1,
  },
  {
    key: "ten_lessons",
    category: "progress",
    icon: "BookMarked",
    xpReward: 200,
    index: 2,
  },
  {
    key: "twenty_five_lessons",
    category: "progress",
    icon: "Library",
    xpReward: 500,
    index: 3,
  },
  {
    key: "fifty_lessons",
    category: "progress",
    icon: "Layers",
    xpReward: 1000,
    index: 4,
  },
  {
    key: "hundred_lessons",
    category: "progress",
    icon: "Crown",
    xpReward: 2000,
    index: 5,
  },
  {
    key: "first_course",
    category: "progress",
    icon: "GraduationCap",
    xpReward: 200,
    index: 6,
  },
  {
    key: "five_courses",
    category: "progress",
    icon: "Award",
    xpReward: 500,
    index: 7,
  },
  {
    key: "ten_courses",
    category: "progress",
    icon: "Medal",
    xpReward: 1000,
    index: 8,
  },
  {
    key: "speed_runner",
    category: "progress",
    icon: "Timer",
    xpReward: 300,
    index: 9,
  },

  // Streaks (6)
  {
    key: "week_warrior",
    category: "streaks",
    icon: "Flame",
    xpReward: 100,
    index: 10,
  },
  {
    key: "two_week_streak",
    category: "streaks",
    icon: "Flame",
    xpReward: 200,
    index: 11,
  },
  {
    key: "monthly_master",
    category: "streaks",
    icon: "Flame",
    xpReward: 500,
    index: 12,
  },
  {
    key: "two_month_streak",
    category: "streaks",
    icon: "Flame",
    xpReward: 1000,
    index: 13,
  },
  {
    key: "consistency_king",
    category: "streaks",
    icon: "Flame",
    xpReward: 2000,
    index: 14,
  },
  {
    key: "streak_freeze_saved",
    category: "streaks",
    icon: "Snowflake",
    xpReward: 50,
    index: 15,
  },

  // Skills (8)
  {
    key: "rust_rookie",
    category: "skills",
    icon: "Wrench",
    xpReward: 100,
    index: 16,
  },
  {
    key: "anchor_apprentice",
    category: "skills",
    icon: "Anchor",
    xpReward: 200,
    index: 17,
  },
  {
    key: "anchor_expert",
    category: "skills",
    icon: "Anchor",
    xpReward: 1000,
    index: 18,
  },
  {
    key: "frontend_builder",
    category: "skills",
    icon: "Layout",
    xpReward: 200,
    index: 19,
  },
  {
    key: "defi_starter",
    category: "skills",
    icon: "Coins",
    xpReward: 200,
    index: 20,
  },
  {
    key: "defi_expert",
    category: "skills",
    icon: "Coins",
    xpReward: 1000,
    index: 21,
  },
  {
    key: "full_stack_starter",
    category: "skills",
    icon: "Code",
    xpReward: 300,
    index: 22,
  },
  {
    key: "full_stack_solana",
    category: "skills",
    icon: "Rocket",
    xpReward: 2000,
    index: 23,
  },

  // Community (3)
  {
    key: "helper",
    category: "community",
    icon: "Heart",
    xpReward: 100,
    index: 24,
  },
  {
    key: "first_comment",
    category: "community",
    icon: "MessageSquare",
    xpReward: 50,
    index: 25,
  },
  {
    key: "bug_hunter",
    category: "community",
    icon: "Bug",
    xpReward: 200,
    index: 26,
  },

  // Special (3)
  {
    key: "early_adopter",
    category: "special",
    icon: "Sparkles",
    xpReward: 500,
    index: 27,
  },
  {
    key: "perfect_score",
    category: "special",
    icon: "Star",
    xpReward: 500,
    index: 28,
  },
  {
    key: "completionist",
    category: "special",
    icon: "Trophy",
    xpReward: 5000,
    index: 29,
  },
];

export const ACHIEVEMENTS_BY_KEY = new Map(
  ACHIEVEMENTS_CATALOG.map((a) => [a.key, a])
);
