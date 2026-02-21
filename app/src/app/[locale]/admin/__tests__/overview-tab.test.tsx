import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { OverviewTab } from "../_components/overview-tab";
import type {
  AdminOverviewStats,
  UserGrowthPoint,
  DailyActivePoint,
  AdminCourseAnalytics,
} from "@/lib/services/admin-service";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const baseStats: AdminOverviewStats = {
  totalUsers: 1234,
  activeUsers7d: 567,
  totalEnrollments: 890,
  completionRate: 75,
};

const baseGrowth: UserGrowthPoint[] = [
  { date: "2026-02-01", count: 10 },
  { date: "2026-02-02", count: 15 },
];

const baseDailyActive: DailyActivePoint[] = [
  { date: "2026-02-14", count: 20 },
  { date: "2026-02-15", count: 25 },
];

const baseCourseAnalytics: AdminCourseAnalytics[] = [
  {
    courseId: "c1",
    title: "Solana 101",
    enrollmentCount: 50,
    completionCount: 30,
    completionRate: 60,
    avgCompletionMinutes: 120,
  },
];

describe("OverviewTab", () => {
  // ── Positive ──
  it("renders 4 stat cards with correct values", () => {
    render(
      <OverviewTab
        stats={baseStats}
        userGrowth={baseGrowth}
        dailyActive={baseDailyActive}
        courseAnalytics={baseCourseAnalytics}
      />
    );

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("567")).toBeInTheDocument();
    expect(screen.getByText("890")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders chart containers", () => {
    render(
      <OverviewTab
        stats={baseStats}
        userGrowth={baseGrowth}
        dailyActive={baseDailyActive}
        courseAnalytics={baseCourseAnalytics}
      />
    );

    expect(screen.getByText("User Growth (30d)")).toBeInTheDocument();
    expect(screen.getByText("Daily Active Learners (14d)")).toBeInTheDocument();
    expect(screen.getByText("Top Courses by Enrollment")).toBeInTheDocument();
  });

  // ── Negative ──
  it("displays 0 for zero stats", () => {
    const zeroStats: AdminOverviewStats = {
      totalUsers: 0,
      activeUsers7d: 0,
      totalEnrollments: 0,
      completionRate: 0,
    };

    render(
      <OverviewTab
        stats={zeroStats}
        userGrowth={[]}
        dailyActive={[]}
        courseAnalytics={[]}
      />
    );

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders without error when chart arrays are empty", () => {
    render(
      <OverviewTab
        stats={baseStats}
        userGrowth={[]}
        dailyActive={[]}
        courseAnalytics={[]}
      />
    );

    expect(screen.getByText("User Growth (30d)")).toBeInTheDocument();
  });

  // ── Edge ──
  it("shows 100% completion rate", () => {
    const perfectStats: AdminOverviewStats = {
      totalUsers: 10,
      activeUsers7d: 10,
      totalEnrollments: 5,
      completionRate: 100,
    };

    render(
      <OverviewTab
        stats={perfectStats}
        userGrowth={baseGrowth}
        dailyActive={baseDailyActive}
        courseAnalytics={baseCourseAnalytics}
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
