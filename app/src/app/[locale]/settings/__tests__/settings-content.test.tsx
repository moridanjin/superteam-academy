import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { SettingsContent } from "../_components/settings-content";

const mockUseAuth = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => mockUseAuth(),
}));

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

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/settings",
}));

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "pt-br", "es"] },
}));

vi.mock("@solana/wallet-adapter-react", () => ({
  useWallet: () => ({
    publicKey: null,
    connected: false,
    disconnect: vi.fn(),
  }),
}));

vi.mock("@solana/wallet-adapter-react-ui", () => ({
  useWalletModal: () => ({ setVisible: vi.fn() }),
}));

describe("SettingsContent", () => {
  // ── Positive ──
  it("renders loading skeleton when auth is loading", () => {
    mockUseAuth.mockReturnValue({ user: null, profile: null, loading: true });
    const { container } = render(<SettingsContent />);

    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });

  it("shows not authenticated message when no user", () => {
    mockUseAuth.mockReturnValue({ user: null, profile: null, loading: false });
    render(<SettingsContent />);

    expect(
      screen.getByText("Please sign in to access settings.")
    ).toBeInTheDocument();
  });

  it("renders tabs when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        email: "test@example.com",
        app_metadata: { providers: ["google"] },
        user_metadata: { full_name: "Test" },
      },
      profile: {
        id: "user-1",
        display_name: "Test User",
        bio: null,
        avatar_url: null,
        wallet_address: null,
        locale: "en",
        total_xp: 0,
        level: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      loading: false,
    });
    render(<SettingsContent />);

    expect(screen.getByRole("tab", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /account/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /preferences/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /danger zone/i })
    ).toBeInTheDocument();
  });

  it("profile tab is selected by default", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        email: "test@example.com",
        app_metadata: { providers: [] },
        user_metadata: {},
      },
      profile: {
        id: "user-1",
        display_name: "Test",
        bio: null,
        avatar_url: null,
        wallet_address: null,
        locale: "en",
        total_xp: 0,
        level: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      loading: false,
    });
    render(<SettingsContent />);

    const profileTab = screen.getByRole("tab", { name: /profile/i });
    expect(profileTab).toHaveAttribute("data-state", "active");
  });

  // ── Negative ──
  it("shows not authenticated when user exists but profile is null", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "user-1", email: "test@example.com" },
      profile: null,
      loading: false,
    });
    render(<SettingsContent />);

    expect(
      screen.getByText("Please sign in to access settings.")
    ).toBeInTheDocument();
  });

  // ── Edge ──
  it("renders profile content in default tab panel", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        email: "test@example.com",
        app_metadata: { providers: [] },
        user_metadata: { full_name: "Test User" },
      },
      profile: {
        id: "user-1",
        display_name: "Test User",
        bio: null,
        avatar_url: null,
        wallet_address: null,
        locale: "en",
        total_xp: 0,
        level: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      loading: false,
    });
    render(<SettingsContent />);

    // Profile section content is visible by default
    expect(screen.getByText("Profile Information")).toBeInTheDocument();
  });
});
