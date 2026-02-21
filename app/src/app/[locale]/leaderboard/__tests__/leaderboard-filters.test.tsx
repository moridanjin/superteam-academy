import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import {
  LeaderboardFilters,
  type TimeFilter,
} from "../_components/leaderboard-filters";

function renderFilters(overrides?: {
  timeFilter?: TimeFilter;
  searchQuery?: string;
  onTimeFilterChange?: (f: TimeFilter) => void;
  onSearchChange?: (q: string) => void;
}) {
  const props = {
    timeFilter: "all" as TimeFilter,
    onTimeFilterChange: vi.fn(),
    searchQuery: "",
    onSearchChange: vi.fn(),
    ...overrides,
  };
  const result = render(<LeaderboardFilters {...props} />);
  return { ...result, ...props };
}

describe("LeaderboardFilters", () => {
  // ── Positive ──
  it("renders all three time filter buttons", () => {
    renderFilters();

    expect(screen.getByText("All Time")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    renderFilters();

    expect(
      screen.getByPlaceholderText("Search learners...")
    ).toBeInTheDocument();
  });

  it("calls onTimeFilterChange when a filter button is clicked", async () => {
    const user = userEvent.setup();
    const { onTimeFilterChange } = renderFilters();

    await user.click(screen.getByText("Monthly"));
    expect(onTimeFilterChange).toHaveBeenCalledWith("monthly");
  });

  it("calls onSearchChange when typing in search", async () => {
    const user = userEvent.setup();
    const { onSearchChange } = renderFilters();

    const input = screen.getByPlaceholderText("Search learners...");
    await user.type(input, "L");

    expect(onSearchChange).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalledWith("L");
  });

  it("highlights the active filter", () => {
    renderFilters({ timeFilter: "weekly" });

    const weeklyBtn = screen.getByText("Weekly");
    expect(weeklyBtn.className).toContain("text-solana-purple");
  });

  // ── Negative ──
  it("does not call onTimeFilterChange for other click targets", async () => {
    const user = userEvent.setup();
    const { onTimeFilterChange } = renderFilters();

    const input = screen.getByPlaceholderText("Search learners...");
    await user.click(input);

    expect(onTimeFilterChange).not.toHaveBeenCalled();
  });

  // ── Edge ──
  it("shows current search query value", () => {
    renderFilters({ searchQuery: "existing query" });

    const input = screen.getByPlaceholderText(
      "Search learners..."
    ) as HTMLInputElement;
    expect(input.value).toBe("existing query");
  });

  it("calls onTimeFilterChange with 'all' when All Time is clicked", async () => {
    const user = userEvent.setup();
    const { onTimeFilterChange } = renderFilters({ timeFilter: "monthly" });

    await user.click(screen.getByText("All Time"));
    expect(onTimeFilterChange).toHaveBeenCalledWith("all");
  });
});
