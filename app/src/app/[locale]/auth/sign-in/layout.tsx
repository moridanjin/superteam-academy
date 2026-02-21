import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Superteam Academy",
  description:
    "Sign in to Superteam Academy with Google, GitHub, or your Solana wallet.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
