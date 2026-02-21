import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { LeaderboardTable } from "../_components/leaderboard-table";
import type { LeaderboardEntry } from "@/lib/services";

function makeEntries(count: number, startRank = 1): LeaderboardEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    userId: `user-${startRank + i}`,
    displayName: `User ${startRank + i}`,
    avatarUrl: null,
    totalXp: 10000 - i * 500,
    level: Math.max(1, 10 - i),
    rank: startRank + i,
  }));
}

describe("LeaderboardTable", () => {
  // ── Positive ──
  it("renders column headers", () => {
    const entries = makeEntries(3);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Learner")).toBeInTheDocument();
    expect(screen.getByText("XP")).toBeInTheDocument();
    expect(screen.getByText("Level")).toBeInTheDocument();
  });

  it("renders all entries with rank, name, XP, and level", () => {
    const entries = makeEntries(5);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 5")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#5")).toBeInTheDocument();
    expect(screen.getByText("10,000")).toBeInTheDocument();
  });

  it("highlights the current user row", () => {
    const entries = makeEntries(5);
    render(<LeaderboardTable entries={entries} currentUserId="user-3" />);

    expect(screen.getByText("(Your Rank)")).toBeInTheDocument();
  });

  it("shows amber color for top 3 ranks", () => {
    const entries = makeEntries(5);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    const rank1 = screen.getByText("#1");
    expect(rank1.className).toContain("text-amber-400");
    const rank4 = screen.getByText("#4");
    expect(rank4.className).toContain("text-neutral-400");
  });

  it("displays avatar initials for users without avatar URLs", () => {
    const entries = makeEntries(3);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.getByText("U1")).toBeInTheDocument();
    expect(screen.getByText("U2")).toBeInTheDocument();
  });

  it("formats XP with locale string", () => {
    const entries: LeaderboardEntry[] = [
      {
        userId: "u1",
        displayName: "Big XP",
        avatarUrl: null,
        totalXp: 1234567,
        level: 99,
        rank: 1,
      },
    ];
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  // ── Negative ──
  it("shows empty state message when entries is empty", () => {
    render(<LeaderboardTable entries={[]} currentUserId={null} />);

    expect(screen.getByText("No learners found")).toBeInTheDocument();
  });

  it("does not highlight any row when currentUserId is null", () => {
    const entries = makeEntries(3);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.queryByText("(Your Rank)")).not.toBeInTheDocument();
  });

  it("does not highlight any row when currentUserId doesn't match", () => {
    const entries = makeEntries(3);
    render(<LeaderboardTable entries={entries} currentUserId="non-existent" />);

    expect(screen.queryByText("(Your Rank)")).not.toBeInTheDocument();
  });

  // ── Edge ──
  it("uses startRank when entry.rank is 0", () => {
    const entries: LeaderboardEntry[] = [
      {
        userId: "u1",
        displayName: "Zero Rank",
        avatarUrl: null,
        totalXp: 100,
        level: 1,
        rank: 0,
      },
    ];
    render(
      <LeaderboardTable entries={entries} currentUserId={null} startRank={51} />
    );

    expect(screen.getByText("#51")).toBeInTheDocument();
  });

  it("handles single entry", () => {
    const entries = makeEntries(1);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  it("shows level badge using gamification i18n", () => {
    const entries = makeEntries(1);
    render(<LeaderboardTable entries={entries} currentUserId={null} />);

    expect(screen.getByText("Lv.10")).toBeInTheDocument();
  });
});
