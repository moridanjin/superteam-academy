"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "@/hooks/use-auth";
import { linkWallet, unlinkWallet } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function WalletConnectButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { user, profile } = useAuth();
  const hasLinked = useRef(false);
  const t = useTranslations("auth");

  const handleLinkWallet = useCallback(async () => {
    if (!user || !publicKey || hasLinked.current) return;
    if (profile?.wallet_address === publicKey.toBase58()) return;

    hasLinked.current = true;
    await linkWallet(publicKey.toBase58());
  }, [user, publicKey, profile?.wallet_address]);

  useEffect(() => {
    if (connected && publicKey && user) {
      handleLinkWallet();
    }
    if (!connected) {
      hasLinked.current = false;
    }
  }, [connected, publicKey, user, handleLinkWallet]);

  if (!user) return null;

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const short = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 font-mono text-xs"
        onClick={async () => {
          await unlinkWallet();
          disconnect();
        }}
      >
        <span className="bg-solana-green h-2 w-2 rounded-full" />
        {short}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => setVisible(true)}
    >
      {t("connectWallet")}
    </Button>
  );
}
