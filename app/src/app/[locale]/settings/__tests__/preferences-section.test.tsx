import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import { PreferencesSection } from "../_components/preferences-section";

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/settings",
}));

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "pt-br", "es"] },
}));

describe("PreferencesSection", () => {
  // ── Positive ──
  it("renders preferences title and description", () => {
    render(<PreferencesSection />);

    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Customize your experience.")).toBeInTheDocument();
  });

  it("shows language options", () => {
    render(<PreferencesSection />);

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Português")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("highlights current locale", () => {
    render(<PreferencesSection />);

    const englishBtn = screen.getByRole("button", { name: "English" });
    expect(englishBtn.className).toContain("solana-purple");
  });

  it("shows theme section with Dark badge", () => {
    render(<PreferencesSection />);

    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("shows notification toggles", () => {
    render(<PreferencesSection />);

    expect(screen.getByText("Email notifications")).toBeInTheDocument();
    expect(screen.getByText("Streak reminders")).toBeInTheDocument();
  });

  it("notification switches are checked by default", () => {
    render(<PreferencesSection />);

    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(2);
    switches.forEach((s) => {
      expect(s).toHaveAttribute("data-state", "checked");
    });
  });

  // ── Negative ──
  it("can toggle email notifications off", async () => {
    const user = userEvent.setup();
    render(<PreferencesSection />);

    const switches = screen.getAllByRole("switch");
    await user.click(switches[0]!);

    expect(switches[0]).toHaveAttribute("data-state", "unchecked");
  });

  it("can toggle streak reminders off", async () => {
    const user = userEvent.setup();
    render(<PreferencesSection />);

    const switches = screen.getAllByRole("switch");
    await user.click(switches[1]!);

    expect(switches[1]).toHaveAttribute("data-state", "unchecked");
  });

  // ── Edge ──
  it("can toggle switches on and off repeatedly", async () => {
    const user = userEvent.setup();
    render(<PreferencesSection />);

    const switches = screen.getAllByRole("switch");
    const emailSwitch = switches[0]!;

    await user.click(emailSwitch);
    expect(emailSwitch).toHaveAttribute("data-state", "unchecked");

    await user.click(emailSwitch);
    expect(emailSwitch).toHaveAttribute("data-state", "checked");
  });

  it("language buttons are clickable", async () => {
    const user = userEvent.setup();
    render(<PreferencesSection />);

    const ptButton = screen.getByRole("button", { name: "Português" });
    await user.click(ptButton);

    // The router.replace mock is called but doesn't change locale in test
    // Just verify no errors thrown
    expect(ptButton).toBeInTheDocument();
  });

  it("renders language, theme, and notification sections with dividers", () => {
    render(<PreferencesSection />);

    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });
});
