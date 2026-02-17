import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signInWithGitHub(redirectTo?: string) {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function linkWallet(walletAddress: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  const { error } = await supabase
    .from("users")
    .update({ wallet_address: walletAddress })
    .eq("id", user.id);

  return { error };
}

export async function unlinkWallet() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated") };
  }

  const { error } = await supabase
    .from("users")
    .update({ wallet_address: null })
    .eq("id", user.id);

  return { error };
}
