import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/lib/supabase/database.types";
import type {
  ProgressService,
  XPService,
  StreakService,
  LeaderboardService,
  CredentialService,
  EnrollmentService,
  AchievementService,
  CourseProgress,
  LessonProgress,
  LessonCompletionResult,
  XPSummary,
  StreakInfo,
  LeaderboardEntry,
  Credential,
  EnrollmentResult,
  AchievementInfo,
} from "./types";

// ── Helpers ───────────────────────────────────────────────────────────

type Enrollment = Tables<"enrollments">;
type Streak = Tables<"streaks">;

/** XP required to reach a given level: 100 * level * (level + 1) / 2 */
function xpForLevel(level: number): number {
  return 100 * level * ((level + 1) / 2);
}

function levelFromXp(totalXp: number): number {
  let level = 0;
  while (xpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

function todayUTC(): string {
  return new Date().toISOString().split("T")[0]!;
}

// ── Progress Service ──────────────────────────────────────────────────

export class SupabaseProgressService implements ProgressService {
  constructor(private db: SupabaseClient<Database>) {}

  async getProgress(userId: string): Promise<CourseProgress[]> {
    const { data, error } = await this.db
      .from("enrollments")
      .select("*, courses(title)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((row) => {
      const e = row as unknown as Enrollment & {
        courses: { title: string } | null;
      };
      return {
        courseId: e.course_id,
        courseTitle: e.courses?.title ?? "",
        progressPct: e.progress_pct,
        completedLessons: 0,
        totalLessons: 0,
        status: e.status,
        enrolledAt: e.enrolled_at,
        completedAt: e.completed_at,
      };
    });
  }

  async getCourseProgress(
    userId: string,
    courseId: string
  ): Promise<CourseProgress | null> {
    const { data, error } = await this.db
      .from("enrollments")
      .select("*, courses(title)")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (error?.code === "PGRST116") return null;
    if (error) throw error;
    if (!data) return null;

    const e = data as unknown as Enrollment & {
      courses: { title: string } | null;
    };

    const { count: completedCount } = await this.db
      .from("lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completed", true);

    const moduleIds = await this.getModuleIds(courseId);

    const { count: totalCount } = await this.db
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .in("module_id", moduleIds);

    return {
      courseId: e.course_id,
      courseTitle: e.courses?.title ?? "",
      progressPct: e.progress_pct,
      completedLessons: completedCount ?? 0,
      totalLessons: totalCount ?? 0,
      status: e.status,
      enrolledAt: e.enrolled_at,
      completedAt: e.completed_at,
    };
  }

  async getLessonProgress(
    userId: string,
    courseId: string
  ): Promise<LessonProgress[]> {
    const moduleIds = await this.getModuleIds(courseId);

    const { data: lessons } = await this.db
      .from("lessons")
      .select("id")
      .in("module_id", moduleIds);

    if (!lessons?.length) return [];

    const lessonIds = lessons.map((l) => l.id);

    const { data: progress } = await this.db
      .from("lesson_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", userId)
      .in("lesson_id", lessonIds);

    const progressMap = new Map((progress ?? []).map((p) => [p.lesson_id, p]));

    return lessonIds.map((id) => {
      const p = progressMap.get(id);
      return {
        lessonId: id,
        completed: p?.completed ?? false,
        completedAt: p?.completed_at ?? null,
      };
    });
  }

  async completeLesson(
    userId: string,
    lessonId: string
  ): Promise<LessonCompletionResult> {
    const now = new Date().toISOString();

    const { data: lessonRow, error: lessonErr } = await this.db
      .from("lessons")
      .select("id, xp_reward, module_id")
      .eq("id", lessonId)
      .single();

    if (lessonErr || !lessonRow)
      throw lessonErr ?? new Error("Lesson not found");

    const lesson = lessonRow as Tables<"lessons">;

    // Upsert lesson_progress
    await this.db.from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: now,
      },
      { onConflict: "user_id,lesson_id" }
    );

    const xpAwarded = lesson.xp_reward;

    if (xpAwarded > 0) {
      await this.db.from("xp_events").insert({
        user_id: userId,
        amount: xpAwarded,
        source: "lesson_completion" as const,
        reference_id: lessonId,
      });
    }

    const { data: userRow } = await this.db
      .from("users")
      .select("total_xp")
      .eq("id", userId)
      .single();

    const currentXp = (userRow as Tables<"users"> | null)?.total_xp ?? 0;
    const newTotalXp = currentXp + xpAwarded;

    await this.db
      .from("users")
      .update({ total_xp: newTotalXp, level: levelFromXp(newTotalXp) })
      .eq("id", userId);

    // Calculate course progress
    const { data: moduleRow } = await this.db
      .from("modules")
      .select("course_id")
      .eq("id", lesson.module_id)
      .single();

    const courseId = (moduleRow as Tables<"modules"> | null)?.course_id ?? "";
    const moduleIds = await this.getModuleIds(courseId);

    const { count: totalLessons } = await this.db
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .in("module_id", moduleIds);

    const { data: courseLessons } = await this.db
      .from("lessons")
      .select("id")
      .in("module_id", moduleIds);

    const courseLessonIds = (courseLessons ?? []).map((l) => l.id);

    const { count: completedLessons } = await this.db
      .from("lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completed", true)
      .in("lesson_id", courseLessonIds);

    const total = totalLessons ?? 1;
    const completed = completedLessons ?? 0;
    const courseProgressPct = Math.round((completed / total) * 100);
    const courseCompleted = courseProgressPct >= 100;

    await this.db
      .from("enrollments")
      .update({
        progress_pct: courseProgressPct,
        ...(courseCompleted
          ? { status: "completed" as const, completed_at: now }
          : {}),
      })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    return {
      xpAwarded,
      newTotalXp,
      courseProgressPct,
      courseCompleted,
    };
  }

  private async getModuleIds(courseId: string): Promise<string[]> {
    const { data } = await this.db
      .from("modules")
      .select("id")
      .eq("course_id", courseId);
    return data?.map((m) => m.id) ?? [];
  }
}

// ── XP Service ────────────────────────────────────────────────────────

export class SupabaseXPService implements XPService {
  constructor(private db: SupabaseClient<Database>) {}

  async getXP(userId: string): Promise<XPSummary> {
    const { data: userRow } = await this.db
      .from("users")
      .select("total_xp, level")
      .eq("id", userId)
      .single();

    const user = userRow as Tables<"users"> | null;
    const totalXp = user?.total_xp ?? 0;
    const level = user?.level ?? levelFromXp(totalXp);
    const xpToNextLevel = xpForLevel(level + 1) - totalXp;

    const { data: events } = await this.db
      .from("xp_events")
      .select("amount, source, reference_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    return {
      totalXp,
      level,
      xpToNextLevel: Math.max(0, xpToNextLevel),
      recentEvents: (events ?? []).map((row) => {
        const e = row as Tables<"xp_events">;
        return {
          amount: e.amount,
          source: e.source,
          referenceId: e.reference_id,
          createdAt: e.created_at,
        };
      }),
    };
  }
}

// ── Streak Service ────────────────────────────────────────────────────

export class SupabaseStreakService implements StreakService {
  constructor(private db: SupabaseClient<Database>) {}

  async getStreak(userId: string): Promise<StreakInfo> {
    const { data: row } = await this.db
      .from("streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    const s = row as Streak | null;

    return {
      currentStreak: s?.current_streak ?? 0,
      longestStreak: s?.longest_streak ?? 0,
      lastActivityDate: s?.last_activity_date ?? null,
      freezeCount: s?.freeze_count ?? 0,
    };
  }

  async recordActivity(userId: string): Promise<StreakInfo> {
    const today = todayUTC();

    const { data: row } = await this.db
      .from("streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    const existing = row as Streak | null;

    if (!existing) {
      await this.db.from("streaks").insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today,
      });
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        freezeCount: 0,
      };
    }

    if (existing.last_activity_date === today) {
      return {
        currentStreak: existing.current_streak,
        longestStreak: existing.longest_streak,
        lastActivityDate: existing.last_activity_date,
        freezeCount: existing.freeze_count,
      };
    }

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0]!;

    const isConsecutive = existing.last_activity_date === yesterdayStr;
    const newStreak = isConsecutive ? existing.current_streak + 1 : 1;
    const newLongest = Math.max(existing.longest_streak, newStreak);

    await this.db
      .from("streaks")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_activity_date: today,
      })
      .eq("user_id", userId);

    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActivityDate: today,
      freezeCount: existing.freeze_count,
    };
  }
}

// ── Leaderboard Service ───────────────────────────────────────────────

export class SupabaseLeaderboardService implements LeaderboardService {
  constructor(private db: SupabaseClient<Database>) {}

  async getLeaderboard(limit = 50, offset = 0): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.db
      .from("users")
      .select("id, display_name, avatar_url, total_xp, level")
      .order("total_xp", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data ?? []).map((row, i) => {
      const u = row as Tables<"users">;
      return {
        userId: u.id,
        displayName: u.display_name ?? "Anonymous",
        avatarUrl: u.avatar_url,
        totalXp: u.total_xp,
        level: u.level,
        rank: offset + i + 1,
      };
    });
  }

  async getUserRank(userId: string): Promise<LeaderboardEntry | null> {
    const { data: row } = await this.db
      .from("users")
      .select("id, display_name, avatar_url, total_xp, level")
      .eq("id", userId)
      .single();

    const user = row as Tables<"users"> | null;
    if (!user) return null;

    const { count } = await this.db
      .from("users")
      .select("*", { count: "exact", head: true })
      .gt("total_xp", user.total_xp);

    return {
      userId: user.id,
      displayName: user.display_name ?? "Anonymous",
      avatarUrl: user.avatar_url,
      totalXp: user.total_xp,
      level: user.level,
      rank: (count ?? 0) + 1,
    };
  }
}

// ── Credential Service ────────────────────────────────────────────────

export class SupabaseCredentialService implements CredentialService {
  constructor(private db: SupabaseClient<Database>) {}

  async getCredentials(userId: string): Promise<Credential[]> {
    const { data } = await this.db
      .from("enrollments")
      .select("course_id, completed_at, courses(title, track)")
      .eq("user_id", userId)
      .eq("status", "completed");

    return (data ?? []).map((row) => {
      const e = row as unknown as Enrollment & {
        courses: { title: string; track: string | null } | null;
      };
      return {
        courseId: e.course_id,
        courseTitle: e.courses?.title ?? "",
        track: e.courses?.track ?? null,
        issuedAt: e.completed_at ?? "",
        onChain: false,
        mintAddress: null,
      };
    });
  }
}

// ── Enrollment Service ────────────────────────────────────────────────

export class SupabaseEnrollmentService implements EnrollmentService {
  constructor(private db: SupabaseClient<Database>) {}

  async enroll(userId: string, courseId: string): Promise<EnrollmentResult> {
    const { data: row, error } = await this.db
      .from("enrollments")
      .insert({
        user_id: userId,
        course_id: courseId,
        status: "active" as const,
        progress_pct: 0,
      })
      .select()
      .single();

    if (error) throw error;

    const e = row as Enrollment | null;
    if (!e) throw new Error("Failed to create enrollment");

    return {
      enrollmentId: e.id,
      courseId: e.course_id,
      status: e.status,
    };
  }

  async unenroll(userId: string, courseId: string): Promise<void> {
    const { error } = await this.db
      .from("enrollments")
      .update({ status: "dropped" as const })
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) throw error;
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { count } = await this.db
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("status", "active");

    return (count ?? 0) > 0;
  }
}

// ── Achievement Service ───────────────────────────────────────────────

export class SupabaseAchievementService implements AchievementService {
  constructor(private db: SupabaseClient<Database>) {}

  async getAchievements(userId: string): Promise<AchievementInfo[]> {
    const { data } = await this.db
      .from("achievements")
      .select("achievement_key, unlocked_at")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    return (data ?? []).map((row) => {
      const a = row as Tables<"achievements">;
      return {
        key: a.achievement_key,
        unlockedAt: a.unlocked_at,
      };
    });
  }

  async claimAchievement(
    userId: string,
    achievementKey: string
  ): Promise<AchievementInfo> {
    const now = new Date().toISOString();

    const { data: row, error } = await this.db
      .from("achievements")
      .insert({
        user_id: userId,
        achievement_key: achievementKey,
        unlocked_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    const a = row as Tables<"achievements"> | null;
    if (!a) throw new Error("Failed to claim achievement");

    return {
      key: a.achievement_key,
      unlockedAt: a.unlocked_at,
    };
  }
}
