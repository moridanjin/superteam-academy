"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Award,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Download,
  ShieldCheck,
  ShieldX,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion";
import { useCredentials } from "@/hooks/use-credentials";
import { useAuth } from "@/hooks/use-auth";
import type { Credential } from "@/lib/services";

type CertificateDetailProps = {
  courseId: string;
};

function CertificateVisual({
  credential,
  recipientName,
}: {
  credential: Credential;
  recipientName: string;
}) {
  const t = useTranslations("certificates");

  const issuedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(credential.issuedAt));

  return (
    <Card className="relative overflow-hidden border-white/[0.06] bg-white/[0.02]">
      {/* Gradient border glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="from-solana-purple/20 via-solana-blue/10 to-solana-green/20 absolute inset-0 bg-gradient-to-br opacity-30" />
        <div className="bg-solana-purple/10 absolute -top-20 -left-20 h-60 w-60 rounded-full blur-[80px]" />
        <div className="bg-solana-green/10 absolute -right-20 -bottom-20 h-60 w-60 rounded-full blur-[80px]" />
      </div>

      <CardContent className="relative z-10 flex flex-col items-center gap-6 px-6 py-10 text-center md:px-12 md:py-14">
        {/* Icon */}
        <div className="from-solana-purple to-solana-green flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br">
          <Award className="h-8 w-8 text-white" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
            {t("certificateTitle")}
          </p>
          <h2 className="from-solana-purple to-solana-green bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent md:text-2xl">
            {credential.courseTitle}
          </h2>
        </div>

        {/* Divider */}
        <div className="from-solana-purple/40 via-solana-blue/40 to-solana-green/40 h-px w-full max-w-xs bg-gradient-to-r" />

        {/* Awarded to */}
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">{t("awardedTo")}</p>
          <p className="text-lg font-semibold text-white">{recipientName}</p>
        </div>

        {/* Course info */}
        <div className="space-y-1">
          <p className="text-xs text-neutral-500">{t("forCompleting")}</p>
          <p className="text-sm font-medium text-neutral-300">
            {credential.courseTitle}
          </p>
        </div>

        {/* Track + Date */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
          {credential.track && (
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {credential.track}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {issuedDate}
          </span>
        </div>

        {/* On-chain badge */}
        <Badge
          variant={credential.onChain ? "default" : "secondary"}
          className={
            credential.onChain
              ? "bg-solana-green/10 text-solana-green border-0"
              : ""
          }
        >
          {credential.onChain ? t("onChain") : t("offChain")}
        </Badge>
      </CardContent>
    </Card>
  );
}

function OnChainVerificationCard({ credential }: { credential: Credential }) {
  const t = useTranslations("certificates");
  const { profile } = useAuth();
  const [mintCopied, setMintCopied] = useState(false);

  const handleCopyMint = async () => {
    if (!credential.mintAddress) return;
    await navigator.clipboard.writeText(credential.mintAddress);
    setMintCopied(true);
    setTimeout(() => setMintCopied(false), 2000);
  };

  const truncatedMint = credential.mintAddress
    ? `${credential.mintAddress.slice(0, 6)}...${credential.mintAddress.slice(-6)}`
    : null;

  // Simplified ownership check: user has wallet connected
  const walletConnected = !!profile?.wallet_address;

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          {credential.onChain ? (
            <ShieldCheck className="text-solana-green h-5 w-5" />
          ) : (
            <ShieldX className="h-5 w-5 text-neutral-500" />
          )}
          <h3 className="text-sm font-semibold text-neutral-200">
            {t("onChainVerification")}
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-neutral-500">
          {credential.onChain
            ? t("onChainDescription")
            : t("offChainDescription")}
        </p>

        {credential.onChain && truncatedMint && (
          <div className="space-y-3">
            {/* Mint address */}
            <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
              <div>
                <p className="text-[10px] tracking-wider text-neutral-600 uppercase">
                  {t("mintAddress")}
                </p>
                <p className="font-mono text-xs text-neutral-300">
                  {truncatedMint}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyMint}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-white/[0.05] hover:text-neutral-300"
                >
                  {mintCopied ? (
                    <Check className="text-solana-green h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <a
                  href={`https://explorer.solana.com/address/${credential.mintAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-white/[0.05] hover:text-neutral-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Ownership status */}
            <div className="flex items-center gap-2 text-xs">
              {walletConnected ? (
                <>
                  <ShieldCheck className="text-solana-green h-3.5 w-3.5" />
                  <span className="text-solana-green">
                    {t("ownershipVerified")}
                  </span>
                </>
              ) : (
                <>
                  <ShieldX className="h-3.5 w-3.5 text-neutral-500" />
                  <span className="text-neutral-500">
                    {t("ownershipNotVerified")}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ShareAndDownload({ credential }: { credential: Credential }) {
  const t = useTranslations("certificates");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText = `I just earned a certificate for completing "${credential.courseTitle}" on Superteam Academy!`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success(t("linkCopied"));
  };

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Share2 className="text-solana-purple h-5 w-5" />
          <h3 className="text-sm font-semibold text-neutral-200">
            {t("share")}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTwitterShare}
            className="border-white/[0.06] bg-white/[0.02] text-xs"
          >
            {t("shareOnTwitter")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLinkedInShare}
            className="border-white/[0.06] bg-white/[0.02] text-xs"
          >
            {t("shareOnLinkedIn")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="border-white/[0.06] bg-white/[0.02] text-xs"
          >
            <Copy className="mr-1.5 h-3 w-3" />
            {t("copyLink")}
          </Button>
        </div>

        <Button
          variant="outline"
          className="border-white/[0.06] bg-white/[0.02]"
          disabled
        >
          <Download className="mr-1.5 h-4 w-4" />
          {t("download")}
        </Button>
      </CardContent>
    </Card>
  );
}

export function CertificateDetail({ courseId }: CertificateDetailProps) {
  const t = useTranslations("certificates");
  const { profile, loading: authLoading } = useAuth();
  const { data: credentials, loading: credsLoading } = useCredentials();

  const loading = authLoading || credsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-80 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  const credential = credentials?.find((c) => c.courseId === courseId);

  if (!credential) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Award className="h-12 w-12 text-neutral-600" />
        <h2 className="text-lg font-semibold text-neutral-300">
          {t("notFound")}
        </h2>
        <p className="max-w-sm text-center text-sm text-neutral-500">
          {t("notFoundDescription")}
        </p>
        <Button asChild variant="outline" className="border-white/[0.06]">
          <Link href="/certificates">{t("backToAll")}</Link>
        </Button>
      </div>
    );
  }

  const recipientName = profile?.display_name ?? "Anonymous";

  return (
    <div className="space-y-6">
      {/* Back link */}
      <FadeIn>
        <Link
          href="/certificates"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToAll")}
        </Link>
      </FadeIn>

      {/* Certificate visual */}
      <FadeIn delay={0.1}>
        <CertificateVisual
          credential={credential}
          recipientName={recipientName}
        />
      </FadeIn>

      {/* Verification + Share */}
      <FadeInStagger className="grid gap-4 md:grid-cols-2">
        <FadeInItem>
          <OnChainVerificationCard credential={credential} />
        </FadeInItem>
        <FadeInItem>
          <ShareAndDownload credential={credential} />
        </FadeInItem>
      </FadeInStagger>
    </div>
  );
}
