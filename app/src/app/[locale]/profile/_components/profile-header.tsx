"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Pencil, Copy, Check, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { XPLevelBadge } from "@/components/gamification/xp-level-badge";
import type { Tables } from "@/lib/supabase/database.types";
import type { XPSummary, StreakInfo } from "@/lib/services";
import { ProfileEditDialog } from "./profile-edit-dialog";

type ProfileHeaderProps = {
  profile: Tables<"users">;
  xpSummary: XPSummary | null;
  streak: (StreakInfo & { activityDates: string[] }) | null;
  isOwnProfile: boolean;
};

export function ProfileHeader({
  profile,
  xpSummary,
  isOwnProfile,
}: ProfileHeaderProps) {
  const t = useTranslations("profile");
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const joinDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
  }).format(new Date(profile.created_at));

  const handleCopy = async () => {
    if (!profile.wallet_address) return;
    await navigator.clipboard.writeText(profile.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedWallet = profile.wallet_address
    ? `${profile.wallet_address.slice(0, 4)}...${profile.wallet_address.slice(-4)}`
    : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="from-solana-purple to-solana-green flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-bold text-white">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            (profile.display_name?.[0] ?? "?").toUpperCase()
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">
              {profile.display_name ?? "Anonymous"}
            </h2>
            {xpSummary && (
              <XPLevelBadge
                totalXp={xpSummary.totalXp}
                level={xpSummary.level}
              />
            )}
          </div>

          {profile.bio && (
            <p className="text-sm text-neutral-400">{profile.bio}</p>
          )}

          <p className="text-xs text-neutral-500">
            {t("joinedDate", { date: joinDate })}
          </p>

          {truncatedWallet && (
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3 w-3 text-neutral-500" />
              <span className="font-mono text-xs text-neutral-500">
                {truncatedWallet}
              </span>
              <button
                onClick={handleCopy}
                className="text-neutral-500 transition-colors hover:text-neutral-300"
              >
                {copied ? (
                  <Check className="text-solana-green h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="shrink-0"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            {t("editProfile")}
          </Button>
          <ProfileEditDialog
            profile={profile}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      )}
    </div>
  );
}
