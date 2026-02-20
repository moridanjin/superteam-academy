import type { Enums } from "@/lib/supabase/database.types";

// ── Domain Types ──────────────────────────────────────────────────────

export type CourseProgress = {
  courseId: string;
  courseTitle: string;
  progressPct: number;
  completedLessons: number;
  totalLessons: number;
  status: Enums<"enrollment_status">;
  enrolledAt: string;
  completedAt: string | null;
};

export type LessonProgress = {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
};

export type XPSummary = {
  totalXp: number;
  level: number;
  xpToNextLevel: number;
  recentEvents: Array<{
    amount: number;
    source: Enums<"xp_source">;
    referenceId: string | null;
    createdAt: string;
  }>;
};

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  freezeCount: number;
};

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalXp: number;
  level: number;
  rank: number;
};

export type Credential = {
  courseId: string;
  courseTitle: string;
  track: string | null;
  issuedAt: string;
  onChain: boolean;
  mintAddress: string | null;
};

export type AchievementInfo = {
  key: string;
  unlockedAt: string;
};

export type EnrollmentResult = {
  enrollmentId: string;
  courseId: string;
  status: Enums<"enrollment_status">;
};

export type LessonCompletionResult = {
  xpAwarded: number;
  newTotalXp: number;
  courseProgressPct: number;
  courseCompleted: boolean;
};

// ── Service Interfaces ────────────────────────────────────────────────

export interface ProgressService {
  /** Get progress for all enrolled courses */
  getProgress(userId: string): Promise<CourseProgress[]>;

  /** Get progress for a specific course */
  getCourseProgress(
    userId: string,
    courseId: string
  ): Promise<CourseProgress | null>;

  /** Get completion status for lessons in a course */
  getLessonProgress(
    userId: string,
    courseId: string
  ): Promise<LessonProgress[]>;

  /** Mark a lesson as completed */
  completeLesson(
    userId: string,
    lessonId: string
  ): Promise<LessonCompletionResult>;
}

export interface XPService {
  /** Get XP summary for a user */
  getXP(userId: string): Promise<XPSummary>;
}

export interface StreakService {
  /** Get streak info for a user */
  getStreak(userId: string): Promise<StreakInfo>;

  /** Record activity to update streak */
  recordActivity(userId: string): Promise<StreakInfo>;

  /** Get distinct activity dates since a given date (YYYY-MM-DD) */
  getActivityDates(userId: string, since: string): Promise<string[]>;
}

export interface LeaderboardService {
  /** Get the top N users by XP */
  getLeaderboard(limit?: number, offset?: number): Promise<LeaderboardEntry[]>;

  /** Get a user's rank on the leaderboard */
  getUserRank(userId: string): Promise<LeaderboardEntry | null>;
}

export interface CredentialService {
  /** Get all credentials for a user */
  getCredentials(userId: string): Promise<Credential[]>;
}

export interface EnrollmentService {
  /** Enroll a user in a course */
  enroll(userId: string, courseId: string): Promise<EnrollmentResult>;

  /** Unenroll a user from a course */
  unenroll(userId: string, courseId: string): Promise<void>;

  /** Check if a user is enrolled in a course */
  isEnrolled(userId: string, courseId: string): Promise<boolean>;
}

export interface AchievementService {
  /** Get all achievements for a user */
  getAchievements(userId: string): Promise<AchievementInfo[]>;

  /** Claim an achievement */
  claimAchievement(
    userId: string,
    achievementKey: string
  ): Promise<AchievementInfo>;
}

/** Aggregated service interface for the learning platform */
export interface LearningPlatformServices {
  progress: ProgressService;
  xp: XPService;
  streak: StreakService;
  leaderboard: LeaderboardService;
  credentials: CredentialService;
  enrollment: EnrollmentService;
  achievements: AchievementService;
}
