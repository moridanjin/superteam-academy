"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GoogleSignInButton,
  GitHubSignInButton,
} from "@/components/auth/sign-in-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="from-solana-purple to-solana-green mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
          <span className="text-lg font-bold text-white">S</span>
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {error && (
          <p className="rounded-md bg-red-950/50 p-2 text-center text-sm text-red-400">
            Authentication failed. Please try again.
          </p>
        )}
        <GoogleSignInButton />
        <GitHubSignInButton />
        <Separator className="my-1" />
        <p className="text-center text-xs text-neutral-500">
          Connect your Solana wallet after signing in to access on-chain
          features.
        </p>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="border-t-solana-purple h-8 w-8 animate-spin rounded-full border-2 border-neutral-700" />
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
