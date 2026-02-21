import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Podium } from "../_components/podium";
import type { LeaderboardEntry } from "@/lib/services";

function makeEntries(count: number): LeaderboardEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    userId: `user-${i + 1}`,
    displayName: `User ${i + 1}`,
    avatarUrl: null,
    totalXp: 10000 - i * 1000,
    level: 10 - i,
    rank: i + 1,
  }));
}

describe("Podium", () => {
  // ── Positive ──
  it("renders top 3 users with names and XP", () => {
    const entries = makeEntries(5);
    render(<Podium entries={entries} />);

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("User 3")).toBeInTheDocument();
  });

  it("displays medal labels 1st, 2nd, 3rd", () => {
    const entries = makeEntries(5);
    render(<Podium entries={entries} />);

    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.getByText("3rd")).toBeInTheDocument();
  });

  it("shows XP values formatted with commas", () => {
    const entries = makeEntries(5);
    render(<Podium entries={entries} />);

    expect(screen.getByText("10,000 XP")).toBeInTheDocument();
    expect(screen.getByText("9,000 XP")).toBeInTheDocument();
    expect(screen.getByText("8,000 XP")).toBeInTheDocument();
  });

  it("displays avatar initials when no avatar URL", () => {
    const entries = makeEntries(3);
    render(<Podium entries={entries} />);

    // "User 1" → "U1"
    expect(screen.getByText("U1")).toBeInTheDocument();
    expect(screen.getByText("U2")).toBeInTheDocument();
    expect(screen.getByText("U3")).toBeInTheDocument();
  });

  // ── Negative ──
  it("renders nothing when fewer than 3 entries", () => {
    const entries = makeEntries(2);
    const { container } = render(<Podium entries={entries} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when entries is empty", () => {
    const { container } = render(<Podium entries={[]} />);

    expect(container.firstChild).toBeNull();
  });

  // ── Edge ──
  it("handles exactly 3 entries", () => {
    const entries = makeEntries(3);
    render(<Podium entries={entries} />);

    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.getByText("3rd")).toBeInTheDocument();
  });

  it("handles very long display names gracefully", () => {
    const entries = makeEntries(3);
    entries[0]!.displayName = "A".repeat(100);
    render(<Podium entries={entries} />);

    expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
  });
});
