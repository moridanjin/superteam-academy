import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { AdminContent } from "../_components/admin-content";
import type { AdminData } from "@/lib/services/admin-service";

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

const mockData: AdminData = {
  stats: {
    totalUsers: 100,
    activeUsers7d: 42,
    totalEnrollments: 250,
    completionRate: 68,
  },
  users: [
    {
      id: "u1",
      displayName: "Alice",
      totalXp: 5000,
      level: 12,
      isAdmin: true,
      createdAt: "2026-01-01T00:00:00Z",
    },
  ],
  courseAnalytics: [
    {
      courseId: "c1",
      title: "Solana 101",
      enrollmentCount: 50,
      completionCount: 30,
      completionRate: 60,
      avgCompletionMinutes: 120,
    },
  ],
  userGrowth: [{ date: "2026-02-01", count: 5 }],
  dailyActive: [{ date: "2026-02-15", count: 10 }],
};

describe("AdminContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Positive ──
  it("renders 3 tab triggers", () => {
    render(<AdminContent initialData={mockData} />);

    expect(screen.getByRole("tab", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /users/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /courses/i })).toBeInTheDocument();
  });

  it("overview is the default active tab", () => {
    render(<AdminContent initialData={mockData} />);

    const overviewTab = screen.getByRole("tab", { name: /overview/i });
    expect(overviewTab).toHaveAttribute("data-state", "active");
  });

  // ── Negative ──
  it("shows load error when data is null", () => {
    render(<AdminContent initialData={null} />);

    expect(screen.getByText("Failed to load admin data.")).toBeInTheDocument();
  });

  // ── Edge ──
  it("tab switching changes visible content", async () => {
    const user = userEvent.setup();
    render(<AdminContent initialData={mockData} />);

    const usersTab = screen.getByRole("tab", { name: /users/i });
    await user.click(usersTab);

    expect(usersTab).toHaveAttribute("data-state", "active");
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});
