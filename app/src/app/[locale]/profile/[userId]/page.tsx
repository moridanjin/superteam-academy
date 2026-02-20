import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/app-shell";
import { FadeIn } from "@/components/motion";
import { ProfileContent } from "../_components/profile-content";

export const metadata = {
  title: "User Profile | Superteam Academy",
  description: "View a learner's profile, achievements, and credentials.",
};

function PageHeader() {
  const t = useTranslations("profile");

  return (
    <div className="relative border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-solana-purple/10 absolute -top-20 left-1/4 h-[300px] w-[500px] rounded-full blur-[100px]" />
        <div className="bg-solana-blue/8 absolute -top-10 right-1/4 h-[250px] w-[400px] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <FadeIn>
          <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            {t("title")}
          </h1>
        </FadeIn>
      </div>
    </div>
  );
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;
  setRequestLocale(locale);

  return (
    <AppShell>
      <PageHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ProfileContent userId={userId} isOwnProfile={false} />
      </div>
    </AppShell>
  );
}
