import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { YourRankCard } from "../_components/your-rank-card";
import type { LeaderboardEntry } from "@/lib/services";

const MOCK_RANK: LeaderboardEntry = {
  userId: "mock",
  displayName: "Test User",
  avatarUrl: null,
  totalXp: 2750,
  level: 7,
  rank: 42,
};

describe("YourRankCard", () => {
  // ── Positive ──
  it("renders user rank information", () => {
    render(<YourRankCard rank={MOCK_RANK} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("Your Rank")).toBeInTheDocument();
    expect(screen.getByText("2,750")).toBeInTheDocument();
    expect(screen.getByText("Lv.7")).toBeInTheDocument();
  });

  it("shows avatar initials when no avatar URL", () => {
    render(<YourRankCard rank={MOCK_RANK} />);

    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  // ── Negative ──
  it("shows 'not ranked' message when rank is null", () => {
    render(<YourRankCard rank={null} />);

    expect(screen.getByText("Not ranked yet")).toBeInTheDocument();
    expect(screen.queryByText("#")).not.toBeInTheDocument();
  });

  // ── Edge ──
  it("handles rank of 1 (top user)", () => {
    const topRank: LeaderboardEntry = {
      ...MOCK_RANK,
      rank: 1,
      totalXp: 99999,
      level: 50,
    };
    render(<YourRankCard rank={topRank} />);

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("99,999")).toBeInTheDocument();
    expect(screen.getByText("Lv.50")).toBeInTheDocument();
  });

  it("handles very high rank number", () => {
    const highRank: LeaderboardEntry = {
      ...MOCK_RANK,
      rank: 10000,
      totalXp: 50,
      level: 1,
    };
    render(<YourRankCard rank={highRank} />);

    expect(screen.getByText("#10000")).toBeInTheDocument();
  });

  it("renders without crashing when avatar URL is provided", () => {
    const withAvatar: LeaderboardEntry = {
      ...MOCK_RANK,
      avatarUrl: "https://example.com/avatar.png",
    };
    const { container } = render(<YourRankCard rank={withAvatar} />);

    // Component should render without error; Radix Avatar handles image loading
    expect(container.querySelector('[data-slot="avatar"]')).toBeTruthy();
  });
});
