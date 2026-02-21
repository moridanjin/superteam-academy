"use client";

import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  UserGrowthPoint,
  DailyActivePoint,
  AdminCourseAnalytics,
} from "@/lib/services/admin-service";

type TooltipPayloadItem = {
  value: number;
  name: string;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm shadow-lg">
      <p className="text-neutral-400">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{ color: entry.color }}
          className="font-medium"
        >
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

type UserGrowthChartProps = {
  data: UserGrowthPoint[];
};

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const t = useTranslations("admin");

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-400">
          {t("chartUserGrowth")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9945ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9945ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#737373", fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              name="New Users"
              stroke="#9945ff"
              fill="url(#growthGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

type DailyActiveChartProps = {
  data: DailyActivePoint[];
};

export function DailyActiveChart({ data }: DailyActiveChartProps) {
  const t = useTranslations("admin");

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-400">
          {t("chartDailyActive")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#737373", fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="count"
              name="Active Learners"
              fill="#14f195"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

type PopularCoursesChartProps = {
  data: AdminCourseAnalytics[];
};

export function PopularCoursesChart({ data }: PopularCoursesChartProps) {
  const t = useTranslations("admin");

  const chartData = data
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 8)
    .map((c) => ({
      title: c.title.length > 25 ? c.title.slice(0, 22) + "..." : c.title,
      enrollments: c.enrollmentCount,
    }));

  return (
    <Card className="border-white/[0.06] bg-white/[0.02]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-400">
          {t("chartPopularCourses")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              type="number"
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="title"
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={150}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="enrollments"
              name="Enrollments"
              fill="#00d1ff"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
