"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FadeIn } from "@/components/motion";
import { LayoutDashboard, Users, BookOpen } from "lucide-react";
import type { AdminData } from "@/lib/services/admin-service";
import { OverviewTab } from "./overview-tab";
import { UsersTab } from "./users-tab";
import { CoursesTab } from "./courses-tab";

type AdminContentProps = {
  initialData: AdminData | null;
};

export function AdminContent({ initialData }: AdminContentProps) {
  const t = useTranslations("admin");

  if (!initialData) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">{t("loadError")}</p>
      </div>
    );
  }

  return (
    <FadeIn>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList
          variant="line"
          className="mb-8 w-full justify-start border-b border-white/[0.06] pb-px"
        >
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t("tabOverview")}
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            {t("tabUsers")}
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            {t("tabCourses")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            stats={initialData.stats}
            userGrowth={initialData.userGrowth}
            dailyActive={initialData.dailyActive}
            courseAnalytics={initialData.courseAnalytics}
          />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab users={initialData.users} />
        </TabsContent>

        <TabsContent value="courses">
          <CoursesTab analytics={initialData.courseAnalytics} />
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
}
