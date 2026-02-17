"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletConnectButton } from "./wallet-connect-button";

export function UserMenu() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-800" />
    );
  }

  if (!user) {
    return (
      <Button variant="default" size="sm" asChild>
        <a href="/auth/sign-in">Sign In</a>
      </Button>
    );
  }

  const displayName =
    profile?.display_name ??
    user.user_metadata?.full_name ??
    user.email ??
    "User";
  const avatarUrl =
    profile?.avatar_url ?? user.user_metadata?.avatar_url ?? undefined;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <WalletConnectButton />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-neutral-800 text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{displayName}</p>
              {user.email && (
                <p className="text-xs text-neutral-400">{user.email}</p>
              )}
              {profile?.wallet_address && (
                <p className="text-solana-green font-mono text-xs">
                  {profile.wallet_address.slice(0, 4)}...
                  {profile.wallet_address.slice(-4)}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              router.push("/");
              router.refresh();
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
