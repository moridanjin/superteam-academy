import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/lib/supabase/database.types";

// ── Types ────────────────────────────────────────────────────────────

export type AdminOverviewStats = {
  totalUsers: number;
  activeUsers7d: number;
  totalEnrollments: number;
  completionRate: number;
};

export type AdminUserRow = {
  id: string;
  displayName: string;
  totalXp: number;
  level: number;
  isAdmin: boolean;
  createdAt: string;
};

export type AdminCourseAnalytics = {
  courseId: string;
  title: string;
  enrollmentCount: number;
  completionCount: number;
  completionRate: number;
  avgCompletionMinutes: number | null;
};

export type UserGrowthPoint = {
  date: string;
  count: number;
};

export type DailyActivePoint = {
  date: string;
  count: number;
};

export type AdminData = {
  stats: AdminOverviewStats;
  users: AdminUserRow[];
  courseAnalytics: AdminCourseAnalytics[];
  userGrowth: UserGrowthPoint[];
  dailyActive: DailyActivePoint[];
};

// ── Service ──────────────────────────────────────────────────────────

export class AdminService {
  constructor(private db: SupabaseClient<Database>) {}

  async getOverviewStats(): Promise<AdminOverviewStats> {
    const { count: totalUsers } = await this.db
      .from("users")
      .select("*", { count: "exact", head: true });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const since = sevenDaysAgo.toISOString();

    const { data: activeData } = await this.db
      .from("xp_events")
      .select("user_id")
      .gte("created_at", since);

    const uniqueActive = new Set(
      (activeData ?? []).map((r) => (r as Tables<"xp_events">).user_id)
    );

    const { count: totalEnrollments } = await this.db
      .from("enrollments")
      .select("*", { count: "exact", head: true });

    const { count: completedEnrollments } = await this.db
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    const total = totalEnrollments ?? 0;
    const completed = completedEnrollments ?? 0;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalUsers: totalUsers ?? 0,
      activeUsers7d: uniqueActive.size,
      totalEnrollments: total,
      completionRate,
    };
  }

  async getUsers(search?: string): Promise<AdminUserRow[]> {
    let query = this.db
      .from("users")
      .select("id, display_name, total_xp, level, is_admin, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (search?.trim()) {
      query = query.ilike("display_name", `%${search.trim()}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row) => {
      const u = row as Tables<"users">;
      return {
        id: u.id,
        displayName: u.display_name ?? "Anonymous",
        totalXp: u.total_xp,
        level: u.level,
        isAdmin: u.is_admin,
        createdAt: u.created_at,
      };
    });
  }

  async getCourseAnalytics(): Promise<AdminCourseAnalytics[]> {
    const { data: courses } = await this.db
      .from("courses")
      .select("id, title")
      .order("created_at", { ascending: false });

    if (!courses?.length) return [];

    const { data: enrollments } = await this.db
      .from("enrollments")
      .select("course_id, status, enrolled_at, completed_at");

    const enrollmentMap = new Map<
      string,
      { total: number; completed: number; completionTimes: number[] }
    >();

    for (const row of enrollments ?? []) {
      const e = row as Tables<"enrollments">;
      const existing = enrollmentMap.get(e.course_id) ?? {
        total: 0,
        completed: 0,
        completionTimes: [],
      };
      existing.total++;
      if (e.status === "completed") {
        existing.completed++;
        if (e.completed_at) {
          const enrolled = new Date(e.enrolled_at).getTime();
          const completed = new Date(e.completed_at).getTime();
          const minutes = Math.round((completed - enrolled) / 60000);
          existing.completionTimes.push(minutes);
        }
      }
      enrollmentMap.set(e.course_id, existing);
    }

    return courses.map((c) => {
      const course = c as Tables<"courses">;
      const stats = enrollmentMap.get(course.id);
      const total = stats?.total ?? 0;
      const completed = stats?.completed ?? 0;
      const times = stats?.completionTimes ?? [];
      const avg =
        times.length > 0
          ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
          : null;

      return {
        courseId: course.id,
        title: course.title,
        enrollmentCount: total,
        completionCount: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        avgCompletionMinutes: avg,
      };
    });
  }

  async getUserGrowth(days = 30): Promise<UserGrowthPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await this.db
      .from("users")
      .select("created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    const buckets = new Map<string, number>();
    for (const row of data ?? []) {
      const date = (row as Tables<"users">).created_at.split("T")[0]!;
      buckets.set(date, (buckets.get(date) ?? 0) + 1);
    }

    const result: UserGrowthPoint[] = [];
    const cursor = new Date(since);
    const today = new Date();
    while (cursor <= today) {
      const dateStr = cursor.toISOString().split("T")[0]!;
      result.push({ date: dateStr, count: buckets.get(dateStr) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }

  async getDailyActive(days = 14): Promise<DailyActivePoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await this.db
      .from("xp_events")
      .select("user_id, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    const buckets = new Map<string, Set<string>>();
    for (const row of data ?? []) {
      const e = row as Tables<"xp_events">;
      const date = e.created_at.split("T")[0]!;
      const set = buckets.get(date) ?? new Set<string>();
      set.add(e.user_id);
      buckets.set(date, set);
    }

    const result: DailyActivePoint[] = [];
    const cursor = new Date(since);
    const today = new Date();
    while (cursor <= today) {
      const dateStr = cursor.toISOString().split("T")[0]!;
      result.push({ date: dateStr, count: buckets.get(dateStr)?.size ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }
}

// ── Mock Data ────────────────────────────────────────────────────────

export function getMockAdminData(): AdminData {
  return {
    stats: {
      totalUsers: 0,
      activeUsers7d: 0,
      totalEnrollments: 0,
      completionRate: 0,
    },
    users: [],
    courseAnalytics: [],
    userGrowth: [],
    dailyActive: [],
  };
}
