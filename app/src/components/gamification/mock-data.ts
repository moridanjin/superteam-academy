import type {
  XPSummary,
  StreakInfo,
  AchievementInfo,
  CourseProgress,
  LeaderboardEntry,
  Credential,
} from "@/lib/services";

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

export const MOCK_COURSE_PROGRESS: CourseProgress[] = [
  {
    courseId: "c1",
    courseSlug: "solana-fundamentals",
    courseTitle: "Solana Fundamentals",
    progressPct: 65,
    completedLessons: 13,
    totalLessons: 20,
    status: "active",
    enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    completedAt: null,
  },
  {
    courseId: "c2",
    courseSlug: "defi-on-solana",
    courseTitle: "DeFi on Solana",
    progressPct: 30,
    completedLessons: 6,
    totalLessons: 20,
    status: "active",
    enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    completedAt: null,
  },
  {
    courseId: "c0",
    courseSlug: "intro-to-solana",
    courseTitle: "Intro to Solana",
    progressPct: 100,
    completedLessons: 10,
    totalLessons: 10,
    status: "completed",
    enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
];

export const MOCK_USER_RANK: LeaderboardEntry = {
  userId: "mock",
  displayName: "You",
  avatarUrl: null,
  totalXp: 2750,
  level: 7,
  rank: 42,
};

const MOCK_NAMES = [
  "Alex Chen",
  "Maria Santos",
  "Raj Patel",
  "Luna Kim",
  "Omar Hassan",
  "Sofia Rodriguez",
  "Yuki Tanaka",
  "Priya Sharma",
  "James O'Brien",
  "Amara Osei",
  "Viktor Petrov",
  "Ines Martinez",
  "Tariq Al-Farsi",
  "Mia Johansson",
  "Liam Park",
  "Fatima Zahra",
  "Diego Ruiz",
  "Aiko Sato",
  "Carlos Mendez",
  "Zara Ahmed",
  "Nikolai Volkov",
  "Elena Costa",
  "Arjun Nair",
  "Chloe Dubois",
  "Marcus Williams",
  "Hana Lee",
  "Thiago Oliveira",
  "Naomi Brooks",
  "Kenji Mori",
  "Isla Campbell",
  "Andrei Popescu",
  "Layla Ibrahim",
  "Felix Braun",
  "Ava Mitchell",
  "Ravi Kumar",
  "Camila Perez",
  "Oscar Lindqvist",
  "Nadia Khoury",
  "Dante Rossi",
  "Mei Wong",
  "Lucas Fischer",
  "Sana Begum",
  "Hugo Laurent",
  "Anya Ivanova",
  "Mateo Diaz",
  "Freya Andersen",
  "Sahil Desai",
  "Clara Novak",
  "Emeka Okonkwo",
  "Lena Mueller",
];

function generateMockLeaderboard(): LeaderboardEntry[] {
  return MOCK_NAMES.map((name, i) => ({
    userId: `user-${i + 1}`,
    displayName: name,
    avatarUrl: null,
    totalXp: Math.max(100, 12000 - i * 200 - Math.floor(Math.random() * 100)),
    level: Math.max(1, Math.floor((12000 - i * 200) / 500)),
    rank: i + 1,
  }));
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = generateMockLeaderboard();

export const MOCK_CREDENTIALS: Credential[] = [
  {
    courseId: "c0",
    courseTitle: "Intro to Solana",
    track: "Solana Fundamentals",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    onChain: true,
    mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  },
  {
    courseId: "c1",
    courseTitle: "Anchor Framework Mastery",
    track: "Solana Fundamentals",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    onChain: true,
    mintAddress: "3Mc6vR8DBSa5EhBJnPJZ5bGm4qXRHAo97wUMEFTXGyrk",
  },
  {
    courseId: "c2",
    courseTitle: "DeFi on Solana",
    track: "DeFi Developer",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    onChain: false,
    mintAddress: null,
  },
  {
    courseId: "c3",
    courseTitle: "Token-2022 & NFTs",
    track: "Full Stack Solana",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    onChain: true,
    mintAddress: "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
  },
];
