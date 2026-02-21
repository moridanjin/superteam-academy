import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { CoursesTab } from "../_components/courses-tab";
import type { AdminCourseAnalytics } from "@/lib/services/admin-service";

const mockAnalytics: AdminCourseAnalytics[] = [
  {
    courseId: "c1",
    title: "Solana Fundamentals",
    enrollmentCount: 150,
    completionCount: 90,
    completionRate: 60,
    avgCompletionMinutes: 240,
  },
  {
    courseId: "c2",
    title: "Anchor Development",
    enrollmentCount: 80,
    completionCount: 40,
    completionRate: 50,
    avgCompletionMinutes: null,
  },
  {
    courseId: "c3",
    title: "DeFi Deep Dive",
    enrollmentCount: 200,
    completionCount: 100,
    completionRate: 50,
    avgCompletionMinutes: 360,
  },
];

describe("CoursesTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Positive ──
  it("renders course table with titles, enrollment counts, and completion rates", () => {
    render(<CoursesTab analytics={mockAnalytics} />);

    expect(screen.getByText("Solana Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("Anchor Development")).toBeInTheDocument();
    expect(screen.getByText("DeFi Deep Dive")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("240m")).toBeInTheDocument();
  });

  // ── Negative ──
  it("shows empty message when analytics is empty", () => {
    render(<CoursesTab analytics={[]} />);

    expect(screen.getByText("No course data available.")).toBeInTheDocument();
  });

  // ── Edge ──
  it("shows N/A when avgCompletionMinutes is null", () => {
    render(<CoursesTab analytics={mockAnalytics} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("sorting toggles direction on click", async () => {
    const user = userEvent.setup();
    render(<CoursesTab analytics={mockAnalytics} />);

    // Default sort is by enrollmentCount desc, so DeFi (200) should be first
    const rows = screen.getAllByText(/\d+%/);
    expect(rows[0]!.textContent).toBe("50%"); // DeFi is first (200 enrollments)

    // Click enrollments column again to toggle to asc
    const enrollmentsHeader = screen.getByRole("button", {
      name: /enrollments/i,
    });
    await user.click(enrollmentsHeader);

    // After toggling to asc, Anchor (80) should be first
    const rowsAfter = screen.getAllByText(/\d+%/);
    expect(rowsAfter[0]!.textContent).toBe("50%"); // Anchor is first (80 enrollments)
  });
});
