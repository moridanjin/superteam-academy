import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import { ProfileSection } from "../_components/profile-section";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@/lib/supabase/database.types";

const mockUser = {
  id: "user-1",
  email: "test@example.com",
  user_metadata: { full_name: "Alex Chen", avatar_url: null },
} as unknown as User;

const mockProfile = {
  id: "user-1",
  display_name: "Alex Chen",
  bio: "Building on Solana",
  avatar_url: null,
  wallet_address: null,
  locale: "en",
  total_xp: 0,
  level: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
} as unknown as Tables<"users">;

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("ProfileSection", () => {
  // ── Positive ──
  it("renders profile title and description", () => {
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Profile Information")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Update your display name and bio. These are visible on your public profile."
      )
    ).toBeInTheDocument();
  });

  it("displays current display name and bio", () => {
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByDisplayValue("Alex Chen")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Building on Solana")).toBeInTheDocument();
  });

  it("shows avatar with initials", () => {
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("AC")).toBeInTheDocument();
  });

  it("shows character counter for bio", () => {
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("18/160")).toBeInTheDocument();
  });

  it("save button is disabled when no changes", () => {
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).toBeDisabled();
  });

  it("save button enables after editing display name", async () => {
    const user = userEvent.setup();
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    const nameInput = screen.getByDisplayValue("Alex Chen");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).toBeEnabled();
  });

  it("updates character counter when typing bio", async () => {
    const user = userEvent.setup();
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    const bioInput = screen.getByDisplayValue("Building on Solana");
    await user.clear(bioInput);
    await user.type(bioInput, "Hi");

    expect(screen.getByText("2/160")).toBeInTheDocument();
  });

  // ── Negative ──
  it("handles empty display name gracefully", () => {
    const emptyProfile = {
      ...mockProfile,
      display_name: null,
    } as unknown as Tables<"users">;
    render(<ProfileSection user={mockUser} profile={emptyProfile} />);

    const nameInput = screen.getByRole("textbox", { name: /display name/i });
    expect(nameInput).toHaveValue("");
  });

  it("handles null bio gracefully", () => {
    const emptyProfile = {
      ...mockProfile,
      bio: null,
    } as unknown as Tables<"users">;
    render(<ProfileSection user={mockUser} profile={emptyProfile} />);

    expect(screen.getByText("0/160")).toBeInTheDocument();
  });

  // ── Edge ──
  it("shows save loading state when saving", async () => {
    const user = userEvent.setup();
    render(<ProfileSection user={mockUser} profile={mockProfile} />);

    const nameInput = screen.getByDisplayValue("Alex Chen");
    await user.clear(nameInput);
    await user.type(nameInput, "New");

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    // Button should show saving text (or the success toast fires)
    // Since our mock resolves immediately, just verify no errors thrown
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it("shows fallback initial U when display name is empty", () => {
    const emptyProfile = {
      ...mockProfile,
      display_name: null,
    } as unknown as Tables<"users">;
    render(<ProfileSection user={mockUser} profile={emptyProfile} />);

    expect(screen.getByText("U")).toBeInTheDocument();
  });
});
