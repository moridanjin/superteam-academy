import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/app-shell";
import { FadeIn } from "@/components/motion";
import { AdminProtectedRoute } from "@/components/auth/admin-protected-route";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  AdminService,
  getMockAdminData,
  type AdminData,
} from "@/lib/services/admin-service";
import { AdminContent } from "./_components/admin-content";

export const metadata = {
  title: "Admin | Superteam Academy",
  description: "Platform administration and analytics.",
};

async function fetchAdminData(): Promise<AdminData | null> {
  const client = createServiceRoleClient();
  if (!client) return getMockAdminData();

  try {
    const service = new AdminService(client);
    const [stats, users, courseAnalytics, userGrowth, dailyActive] =
      await Promise.all([
        service.getOverviewStats(),
        service.getUsers(),
        service.getCourseAnalytics(),
        service.getUserGrowth(30),
        service.getDailyActive(14),
      ]);

    return { stats, users, courseAnalytics, userGrowth, dailyActive };
  } catch {
    return getMockAdminData();
  }
}

function PageHeader() {
  const t = useTranslations("admin");

  return (
    <div className="relative border-b border-white/5 pt-12 pb-10 md:pt-16 md:pb-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-solana-purple/10 absolute -top-20 left-1/4 h-[300px] w-[500px] rounded-full blur-[100px]" />
        <div className="bg-solana-blue/8 absolute -top-10 right-1/4 h-[250px] w-[400px] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <FadeIn>
          <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-500">
            {t("subtitle")}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await fetchAdminData();

  return (
    <AppShell>
      <AdminProtectedRoute>
        <PageHeader />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <AdminContent initialData={data} />
        </div>
      </AdminProtectedRoute>
    </AppShell>
  );
}
