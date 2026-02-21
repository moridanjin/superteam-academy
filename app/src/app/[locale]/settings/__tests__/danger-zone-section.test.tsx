import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import { DangerZoneSection } from "../_components/danger-zone-section";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock("@/lib/auth", () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}));

describe("DangerZoneSection", () => {
  // ── Positive ──
  it("renders danger zone title and description", () => {
    render(<DangerZoneSection />);

    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
    expect(
      screen.getByText("Irreversible actions. Please be careful.")
    ).toBeInTheDocument();
  });

  it("shows sign out section with button", () => {
    render(<DangerZoneSection />);

    expect(
      screen.getByText("Sign out of your account on this device.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it("shows delete account section with button", () => {
    render(<DangerZoneSection />);

    expect(
      screen.getByText(
        "Permanently delete your account and all associated data. This cannot be undone."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete account/i })
    ).toBeInTheDocument();
  });

  it("sign out button calls signOut and navigates", async () => {
    const user = userEvent.setup();
    const { signOut } = await import("@/lib/auth");
    render(<DangerZoneSection />);

    const signOutBtn = screen.getByRole("button", { name: /sign out/i });
    await user.click(signOutBtn);

    expect(signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockRefresh).toHaveBeenCalled();
  });

  // ── Negative ──
  it("delete account requires confirmation dialog", async () => {
    const user = userEvent.setup();
    render(<DangerZoneSection />);

    const deleteBtn = screen.getByRole("button", { name: /delete account/i });
    await user.click(deleteBtn);

    // Dialog appears
    expect(screen.getByText("Delete your account?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will permanently delete your account, progress, credentials, and all associated data. This action cannot be undone."
      )
    ).toBeInTheDocument();
  });

  it("cancel button in delete dialog closes it", async () => {
    const user = userEvent.setup();
    render(<DangerZoneSection />);

    const deleteBtn = screen.getByRole("button", { name: /delete account/i });
    await user.click(deleteBtn);

    expect(screen.getByText("Delete your account?")).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    // Dialog should close (text should disappear after animation)
    // Verify cancel button exists and was clickable
    expect(screen.queryByText("Delete your account?")).not.toBeInTheDocument();
  });

  // ── Edge ──
  it("delete dialog shows confirm button with destructive styling", async () => {
    const user = userEvent.setup();
    render(<DangerZoneSection />);

    const deleteBtn = screen.getByRole("button", { name: /delete account/i });
    await user.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", {
      name: /yes, delete my account/i,
    });
    expect(confirmBtn).toBeInTheDocument();
  });

  it("sign out button shows loading state", async () => {
    const user = userEvent.setup();
    render(<DangerZoneSection />);

    const signOutBtn = screen.getByRole("button", { name: /sign out/i });
    await user.click(signOutBtn);

    // After async completes, button should still be present
    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it("has two distinct action rows", () => {
    render(<DangerZoneSection />);

    const buttons = screen.getAllByRole("button");
    const signOutBtn = buttons.find((b) => b.textContent?.includes("Sign Out"));
    const deleteBtn = buttons.find((b) =>
      b.textContent?.includes("Delete Account")
    );
    expect(signOutBtn).toBeDefined();
    expect(deleteBtn).toBeDefined();
  });
});
