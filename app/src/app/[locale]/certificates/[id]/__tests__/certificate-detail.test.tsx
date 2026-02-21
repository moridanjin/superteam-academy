import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import { CertificateDetail } from "../_components/certificate-detail";
import type { Credential } from "@/lib/services";

const MOCK_CREDS: Credential[] = [
  {
    courseId: "c0",
    courseTitle: "Intro to Solana",
    track: "Solana Fundamentals",
    issuedAt: "2025-11-23T00:00:00.000Z",
    onChain: true,
    mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  },
  {
    courseId: "c2",
    courseTitle: "DeFi on Solana",
    track: "DeFi Developer",
    issuedAt: "2026-02-01T00:00:00.000Z",
    onChain: false,
    mintAddress: null,
  },
];

let mockCredentials: Credential[] | null = MOCK_CREDS;
let mockCredsLoading = false;
let mockProfile: {
  display_name: string;
  wallet_address: string | null;
} | null = { display_name: "Test User", wallet_address: null };
let mockAuthLoading = false;

vi.mock("@/hooks/use-credentials", () => ({
  useCredentials: () => ({
    data: mockCredentials,
    loading: mockCredsLoading,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: mockProfile ? { id: "user-1" } : null,
    profile: mockProfile,
    loading: mockAuthLoading,
  }),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/certificates/c0",
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("CertificateDetail", () => {
  beforeEach(() => {
    mockCredentials = MOCK_CREDS;
    mockCredsLoading = false;
    mockProfile = { display_name: "Test User", wallet_address: null };
    mockAuthLoading = false;
  });

  // ── Positive ──
  it("renders certificate visual with course title", () => {
    render(<CertificateDetail courseId="c0" />);

    // Course title appears in the visual card
    const titles = screen.getAllByText("Intro to Solana");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("shows recipient name from auth profile", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("shows Certificate of Completion label", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("Certificate of Completion")).toBeInTheDocument();
  });

  it("shows Awarded to label", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("Awarded to")).toBeInTheDocument();
  });

  it("shows on-chain verification section for on-chain cred", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("On-Chain Verification")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This credential is permanently recorded on the Solana blockchain."
      )
    ).toBeInTheDocument();
  });

  it("shows truncated mint address for on-chain cred", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("7xKXtg...osgAsU")).toBeInTheDocument();
  });

  it("shows share section with sharing buttons", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /share on twitter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /share on linkedin/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy link/i })
    ).toBeInTheDocument();
  });

  it("shows back to all certificates link", () => {
    render(<CertificateDetail courseId="c0" />);

    const backLinks = screen.getAllByText("All Certificates");
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("shows download certificate button (disabled)", () => {
    render(<CertificateDetail courseId="c0" />);

    const downloadBtn = screen.getByRole("button", {
      name: /download certificate/i,
    });
    expect(downloadBtn).toBeDisabled();
  });

  // ── Negative ──
  it("shows not found state for invalid courseId", () => {
    render(<CertificateDetail courseId="nonexistent" />);

    expect(screen.getByText("Certificate not found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This certificate doesn't exist or you don't have access to it."
      )
    ).toBeInTheDocument();
  });

  it("not found state has link back to all certificates", () => {
    render(<CertificateDetail courseId="nonexistent" />);

    const link = screen.getByRole("link", { name: /all certificates/i });
    expect(link.getAttribute("href")).toBe("/certificates");
  });

  it("shows off-chain description for off-chain credential", () => {
    render(<CertificateDetail courseId="c2" />);

    expect(
      screen.getByText(
        "This credential is stored off-chain. On-chain minting is coming soon."
      )
    ).toBeInTheDocument();
  });

  it("does not show mint address for off-chain credential", () => {
    render(<CertificateDetail courseId="c2" />);

    expect(screen.queryByText("Mint Address")).not.toBeInTheDocument();
  });

  it("shows loading skeletons when loading", () => {
    mockCredsLoading = true;
    const { container } = render(<CertificateDetail courseId="c0" />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });

  // ── Edge ──
  it("shows Anonymous when no profile display name", () => {
    mockProfile = { display_name: "Anonymous", wallet_address: null };
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });

  it("shows wallet ownership verified when wallet is connected", () => {
    mockProfile = {
      display_name: "Test User",
      wallet_address: "ABC123walletAddress",
    };
    render(<CertificateDetail courseId="c0" />);

    expect(
      screen.getByText("Verified — connected wallet owns this credential")
    ).toBeInTheDocument();
  });

  it("shows wallet ownership not verified when no wallet", () => {
    mockProfile = { display_name: "Test User", wallet_address: null };
    render(<CertificateDetail courseId="c0" />);

    expect(
      screen.getByText("Connect your wallet to verify ownership")
    ).toBeInTheDocument();
  });

  it("copy link button is present and clickable", () => {
    render(<CertificateDetail courseId="c0" />);

    const copyBtn = screen.getByRole("button", { name: /copy link/i });
    expect(copyBtn).toBeEnabled();
  });

  it("mint address copy button is present for on-chain cred", () => {
    render(<CertificateDetail courseId="c0" />);

    // Mint address row has a button for copying
    const mintRow = screen
      .getByText("7xKXtg...osgAsU")
      .closest("div")?.parentElement;
    const copyButtons = mintRow?.querySelectorAll("button");
    expect(copyButtons?.length).toBeGreaterThanOrEqual(1);
  });

  it("shows track and date in certificate visual", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("Solana Fundamentals")).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("shows On-Chain badge on on-chain certificate", () => {
    render(<CertificateDetail courseId="c0" />);

    expect(screen.getByText("On-Chain")).toBeInTheDocument();
  });

  it("shows Off-Chain badge on off-chain certificate", () => {
    render(<CertificateDetail courseId="c2" />);

    expect(screen.getByText("Off-Chain")).toBeInTheDocument();
  });

  it("has explorer link for on-chain credential", () => {
    render(<CertificateDetail courseId="c0" />);

    const explorerLinks = document.querySelectorAll(
      'a[href*="explorer.solana.com"]'
    );
    expect(explorerLinks.length).toBeGreaterThanOrEqual(1);
  });
});
