import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/test-utils";
import { CertificatesContent } from "../_components/certificates-content";
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
let mockLoading = false;

vi.mock("@/hooks/use-credentials", () => ({
  useCredentials: () => ({
    data: mockCredentials,
    loading: mockLoading,
    error: null,
    refetch: vi.fn(),
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
  usePathname: () => "/certificates",
}));

describe("CertificatesContent", () => {
  beforeEach(() => {
    mockCredentials = MOCK_CREDS;
    mockLoading = false;
  });

  // ── Positive ──
  it("renders credential cards when data is available", () => {
    render(<CertificatesContent />);

    expect(screen.getByText("Intro to Solana")).toBeInTheDocument();
    expect(screen.getByText("DeFi on Solana")).toBeInTheDocument();
  });

  it("shows On-Chain badge for on-chain credentials", () => {
    render(<CertificatesContent />);

    expect(screen.getByText("On-Chain")).toBeInTheDocument();
  });

  it("shows Off-Chain badge for off-chain credentials", () => {
    render(<CertificatesContent />);

    expect(screen.getByText("Off-Chain")).toBeInTheDocument();
  });

  it("renders track names for credentials", () => {
    render(<CertificatesContent />);

    expect(screen.getByText("Solana Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("DeFi Developer")).toBeInTheDocument();
  });

  // ── Negative ──
  it("shows empty state when no credentials", () => {
    mockCredentials = [];
    render(<CertificatesContent />);

    expect(
      screen.getByText(
        "No certificates yet. Complete a course to earn your first credential."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse courses/i })
    ).toBeInTheDocument();
  });

  it("shows empty state when credentials is null", () => {
    mockCredentials = null;
    render(<CertificatesContent />);

    expect(
      screen.getByText(
        "No certificates yet. Complete a course to earn your first credential."
      )
    ).toBeInTheDocument();
  });

  it("shows loading skeletons when loading", () => {
    mockLoading = true;
    const { container } = render(<CertificatesContent />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBe(3);
  });

  // ── Edge ──
  it("renders view certificate links for each card", () => {
    render(<CertificatesContent />);

    const viewLinks = screen.getAllByText("View Certificate");
    expect(viewLinks).toHaveLength(2);
  });

  it("links cards to correct detail pages", () => {
    render(<CertificatesContent />);

    const links = screen
      .getAllByRole("link")
      .filter(
        (a) =>
          a.getAttribute("href")?.includes("/certificates/c0") ||
          a.getAttribute("href")?.includes("/certificates/c2")
      );
    expect(links.length).toBeGreaterThanOrEqual(2);
  });
});
