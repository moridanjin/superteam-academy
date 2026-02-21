import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { UsersTab } from "../_components/users-tab";
import type { AdminUserRow } from "@/lib/services/admin-service";

const mockUsers: AdminUserRow[] = [
  {
    id: "u1-abcd-efgh",
    displayName: "Alice Admin",
    totalXp: 5000,
    level: 12,
    isAdmin: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "u2-ijkl-mnop",
    displayName: "Bob User",
    totalXp: 1200,
    level: 5,
    isAdmin: false,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "u3-qrst-uvwx",
    displayName: "Anonymous",
    totalXp: 0,
    level: 1,
    isAdmin: false,
    createdAt: "2026-02-01T00:00:00Z",
  },
];

describe("UsersTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Positive ──
  it("renders user list with names, XP, levels, and admin badges", () => {
    render(<UsersTab users={mockUsers} />);

    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(screen.getByText("Bob User")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();

    // 2 non-admin users + 1 column header "User" = 3 total
    const userBadges = screen.getAllByText("User");
    expect(userBadges.length).toBe(3);
  });

  // ── Negative ──
  it("shows empty message when users list is empty", () => {
    render(<UsersTab users={[]} />);

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  it("shows empty message when search yields no results", async () => {
    const user = userEvent.setup();
    render(<UsersTab users={mockUsers} />);

    const searchInput = screen.getByPlaceholderText("Search users...");
    await user.type(searchInput, "Nonexistent");

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  // ── Edge ──
  it("search filters by name", async () => {
    const user = userEvent.setup();
    render(<UsersTab users={mockUsers} />);

    const searchInput = screen.getByPlaceholderText("Search users...");
    await user.type(searchInput, "Alice");

    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(screen.queryByText("Bob User")).not.toBeInTheDocument();
  });

  it("clearing search restores full list", async () => {
    const user = userEvent.setup();
    render(<UsersTab users={mockUsers} />);

    const searchInput = screen.getByPlaceholderText("Search users...");
    await user.type(searchInput, "Alice");
    expect(screen.queryByText("Bob User")).not.toBeInTheDocument();

    await user.clear(searchInput);
    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(screen.getByText("Bob User")).toBeInTheDocument();
  });

  it("displays Anonymous for users with that displayName", () => {
    render(<UsersTab users={mockUsers} />);

    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });
});
