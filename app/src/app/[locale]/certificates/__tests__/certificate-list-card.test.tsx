import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { CertificateListCard } from "../_components/certificate-list-card";
import type { Credential } from "@/lib/services";

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

const onChainCred: Credential = {
  courseId: "c0",
  courseTitle: "Intro to Solana",
  track: "Solana Fundamentals",
  issuedAt: "2025-11-23T00:00:00.000Z",
  onChain: true,
  mintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
};

const offChainCred: Credential = {
  courseId: "c2",
  courseTitle: "DeFi on Solana",
  track: "DeFi Developer",
  issuedAt: "2026-02-01T00:00:00.000Z",
  onChain: false,
  mintAddress: null,
};

describe("CertificateListCard", () => {
  // ── Positive ──
  it("renders course title", () => {
    render(<CertificateListCard credential={onChainCred} />);

    expect(screen.getByText("Intro to Solana")).toBeInTheDocument();
  });

  it("renders track name", () => {
    render(<CertificateListCard credential={onChainCred} />);

    expect(screen.getByText("Solana Fundamentals")).toBeInTheDocument();
  });

  it("shows On-Chain badge for on-chain credential", () => {
    render(<CertificateListCard credential={onChainCred} />);

    expect(screen.getByText("On-Chain")).toBeInTheDocument();
  });

  it("shows Off-Chain badge for off-chain credential", () => {
    render(<CertificateListCard credential={offChainCred} />);

    expect(screen.getByText("Off-Chain")).toBeInTheDocument();
  });

  it("links to the correct detail page", () => {
    render(<CertificateListCard credential={onChainCred} />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/certificates/c0");
  });

  it("formats the issued date", () => {
    render(<CertificateListCard credential={onChainCred} />);

    // The formatted date should contain "2025"
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  // ── Negative ──
  it("does not render track when track is null", () => {
    const noTrack: Credential = { ...onChainCred, track: null };
    render(<CertificateListCard credential={noTrack} />);

    expect(screen.queryByText("Solana Fundamentals")).not.toBeInTheDocument();
  });

  // ── Edge ──
  it("shows view certificate text", () => {
    render(<CertificateListCard credential={onChainCred} />);

    expect(screen.getByText("View Certificate")).toBeInTheDocument();
  });

  it("handles credential with long course title", () => {
    const longTitle: Credential = {
      ...onChainCred,
      courseTitle: "A".repeat(100),
    };
    render(<CertificateListCard credential={longTitle} />);

    expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
  });
});
