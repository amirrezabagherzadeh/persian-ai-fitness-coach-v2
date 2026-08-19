"use client";

import Link from "next/link";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { useAppStore } from "@/store/app-store";
import { totalsForFoodLogs } from "@/domain/meal-plan";
import { nf } from "@/lib/format";

export function ProgressPage() {
  const { state } = useAppStore();
  const chartData = state.checkIns.map((item, index) => ({ week: `هفته ${nf(index + 1)}`, weight: item.weightKg, waist: item.waistCm, adherence: item.adherence * 20 }));
  const totals = totalsForFoodLogs(state.foodLogs);
  const completed = state.workouts.filter((item) => item.completedAt).length;
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="پیشرفت" eyebrow="روندهای مهم" description="فقط داده‌هایی که به تصمیم هفته بعد کمک می‌کنند." action={<Link className="btn primary" href="/check-in">چک‌این هفتگی</Link>} />
        <div className="grid grid-3">
          <MetricCard label="وزن فعلی" value={`${nf(state.checkIns.at(-1)?.weightKg ?? state.user.weightKg)} کیلوگرم`} helper="از آخرین چک‌این" />
          <MetricCard label="دور کمر" value={`${nf(state.checkIns.at(-1)?.waistCm ?? state.user.waistCm)} سانتی‌متر`} helper="شاخص ساده تغییر ترکیب بدن" />
          <MetricCard label="پایبندی پروتئین" value={`${nf((totals.protein / state.mealPlan.target.proteinG) * 100)}٪`} helper="امروز" />
        </div>
        <div className="mt-4 grid grid-2">
          <section className="light-panel">
            <h2>روند وزن و کمر</h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={(value) => nf(Number(value))} />
                  <Tooltip formatter={(value) => nf(Number(value))} />
                  <Line type="monotone" dataKey="weight" name="وزن" stroke="var(--chart-1)" strokeWidth={3} />
                  <Line type="monotone" dataKey="waist" name="دور کمر" stroke="var(--chart-2)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="light-panel">
            <h2>ثبات تمرین و تغذیه</h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={(value) => nf(Number(value))} />
                  <Tooltip formatter={(value) => nf(Number(value))} />
                  <Bar dataKey="adherence" name="پایبندی" fill="var(--chart-1)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p>تمرین‌های کامل‌شده در این نسخه: {nf(completed)}</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
