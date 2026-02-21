"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in");
    } else if (!loading && user && !profile?.is_admin) {
      router.push("/dashboard");
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-t-solana-purple h-8 w-8 animate-spin rounded-full border-2 border-neutral-700" />
      </div>
    );
  }

  if (!user || !profile?.is_admin) return null;

  return <>{children}</>;
}
