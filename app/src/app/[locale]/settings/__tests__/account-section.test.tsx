import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { AccountSection } from "../_components/account-section";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@/lib/supabase/database.types";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: null, profile: null, loading: false }),
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

const mockUser = {
  id: "user-1",
  email: "test@example.com",
  app_metadata: { providers: ["google", "github"] },
  user_metadata: { full_name: "Alex Chen" },
} as unknown as User;

const mockProfile = {
  id: "user-1",
  display_name: "Alex Chen",
  bio: null,
  avatar_url: null,
  wallet_address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  locale: "en",
  total_xp: 0,
  level: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
} as unknown as Tables<"users">;

describe("AccountSection", () => {
  // ── Positive ──
  it("renders account title and description", () => {
    render(<AccountSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your email, connected accounts, and wallet.")
    ).toBeInTheDocument();
  });

  it("displays user email", () => {
    render(<AccountSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("shows connected providers with badges", () => {
    render(<AccountSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    const badges = screen.getAllByText("Connected");
    expect(badges).toHaveLength(2);
  });

  it("displays truncated wallet address", () => {
    render(<AccountSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("7xKX...gAsU")).toBeInTheDocument();
  });

  it("shows wallet section title", () => {
    render(<AccountSection user={mockUser} profile={mockProfile} />);

    expect(screen.getByText("Solana Wallet")).toBeInTheDocument();
  });

  // ── Negative ──
  it("shows no wallet message when wallet is null", () => {
    const noWalletProfile = {
      ...mockProfile,
      wallet_address: null,
    } as unknown as Tables<"users">;
    render(<AccountSection user={mockUser} profile={noWalletProfile} />);

    expect(screen.getByText("No wallet connected")).toBeInTheDocument();
  });

  it("handles user with no email", () => {
    const noEmailUser = { ...mockUser, email: null } as unknown as User;
    render(<AccountSection user={noEmailUser} profile={mockProfile} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("handles empty providers array", () => {
    const noProvidersUser = {
      ...mockUser,
      app_metadata: { providers: [] },
    } as unknown as User;
    render(<AccountSection user={noProvidersUser} profile={mockProfile} />);

    expect(screen.queryByText("Google")).not.toBeInTheDocument();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });

  // ── Edge ──
  it("handles single provider", () => {
    const singleProviderUser = {
      ...mockUser,
      app_metadata: { providers: ["google"] },
    } as unknown as User;
    render(<AccountSection user={singleProviderUser} profile={mockProfile} />);

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.getAllByText("Connected")).toHaveLength(1);
  });

  it("handles unknown provider gracefully", () => {
    const unknownProviderUser = {
      ...mockUser,
      app_metadata: { providers: ["discord"] },
    } as unknown as User;
    render(<AccountSection user={unknownProviderUser} profile={mockProfile} />);

    expect(screen.getByText("discord")).toBeInTheDocument();
  });
});
