"use client";

import { useTranslations } from "next-intl";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/auth/wallet-connect-button";
import { Mail, Github, Chrome, Wallet } from "lucide-react";

type AccountSectionProps = {
  user: User;
  profile: Tables<"users">;
};

function getProviderIcon(provider: string) {
  switch (provider) {
    case "google":
      return <Chrome className="h-4 w-4" />;
    case "github":
      return <Github className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
}

function getProviderLabel(provider: string) {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "email":
      return "Email";
    default:
      return provider;
  }
}

export function AccountSection({ user, profile }: AccountSectionProps) {
  const t = useTranslations("settings");

  const providers = user.app_metadata?.providers as string[] | undefined;

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-neutral-200">
            {t("accountTitle")}
          </CardTitle>
          <p className="text-sm text-neutral-500">{t("accountDescription")}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-200">
              {t("email")}
            </label>
            <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <Mail className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-300">
                {user.email ?? "—"}
              </span>
            </div>
            <p className="text-xs text-neutral-600">{t("emailDescription")}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-200">
                {t("connectedAccounts")}
              </label>
              <p className="text-xs text-neutral-500">
                {t("connectedAccountsDescription")}
              </p>
            </div>
            <div className="space-y-2">
              {providers?.map((provider) => (
                <div
                  key={provider}
                  className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    {getProviderIcon(provider)}
                    <span className="text-sm text-neutral-300">
                      {getProviderLabel(provider)}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-solana-green/10 text-solana-green border-0 text-xs"
                  >
                    {t("walletConnected")}
                  </Badge>
                </div>
              ))}
              {(!providers || providers.length === 0) && (
                <p className="text-sm text-neutral-500">—</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-200">
                {t("walletTitle")}
              </label>
              <p className="text-xs text-neutral-500">
                {t("walletDescription")}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4 text-neutral-500" />
                {profile.wallet_address ? (
                  <span className="text-solana-green font-mono text-sm">
                    {profile.wallet_address.slice(0, 4)}...
                    {profile.wallet_address.slice(-4)}
                  </span>
                ) : (
                  <span className="text-sm text-neutral-500">
                    {t("walletNotConnected")}
                  </span>
                )}
              </div>
              <WalletConnectButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
