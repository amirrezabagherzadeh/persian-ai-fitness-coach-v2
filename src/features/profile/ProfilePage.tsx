"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { nf } from "@/lib/format";

const goalLabels = { fat_loss: "کاهش چربی", muscle_gain: "عضله‌سازی", recomposition: "فرم‌دهی بدن", strength: "افزایش قدرت", general_fitness: "آمادگی عمومی", maintenance: "حفظ وضعیت" };
const styleLabels = { balanced: "ترکیبی", machines: "دستگاه‌محور", free_weights: "وزنه آزاد", calisthenics: "کالیستنیکس" };

export function ProfilePage() {
  const router = useRouter();
  const { state, resetDemo } = useAppStore();
  const risk = state.user.medicalFlags.length > 0 || state.user.injuries.length > 0;
  const baseline = state.user.bodyBaseline;
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="اطلاعات من" eyebrow={state.user.email} description="پاسخ‌هایی که برنامه چهار هفته‌ای بر اساس آن‌ها ساخته شده است." action={<Button asChild><Link href="/onboarding">ویرایش ارزیابی</Link></Button>} />
        {risk ? <section className="panel"><strong>احتیاط ایمنی</strong><p className="muted">به دلیل آسیب یا مورد پزشکی ثبت‌شده، از توصیه‌های تهاجمی خودداری می‌شود.</p></section> : null}
        <section className="light-panel">
          <table className="table">
            <tbody>
              <tr><th>سن</th><td>{nf(state.user.age)}</td></tr>
              <tr><th>قد</th><td>{nf(state.user.heightCm)} cm</td></tr>
              <tr><th>وزن خط پایه</th><td>{baseline?.weightKg ? `${nf(baseline.weightKg)} kg` : "ثبت نشده"}</td></tr>
              <tr><th>دور کمر</th><td>{baseline?.waistCm ? `${nf(baseline.waistCm)} cm` : "ثبت نشده"}</td></tr>
              <tr><th>دور بازو</th><td>{baseline?.armCm ? `${nf(baseline.armCm)} cm` : "ثبت نشده"}</td></tr>
              <tr><th>دور سینه</th><td>{baseline?.chestCm ? `${nf(baseline.chestCm)} cm` : "ثبت نشده"}</td></tr>
              <tr><th>دور ران</th><td>{baseline?.thighCm ? `${nf(baseline.thighCm)} cm` : "ثبت نشده"}</td></tr>
              <tr><th>هدف</th><td>{goalLabels[state.user.goal]}</td></tr>
              <tr><th>روز تمرین</th><td>{nf(state.user.daysPerWeek)}</td></tr>
              <tr><th>روزهای انتخابی</th><td>{state.user.preferredDays.length ? state.user.preferredDays.join("، ") : "هنوز زمان‌بندی نشده"}</td></tr>
              <tr><th>سبک تمرین</th><td>{styleLabels[state.user.trainingStyle]}</td></tr>
              <tr><th>محل تمرین</th><td>باشگاه کامل</td></tr>
            </tbody>
          </table>
          <div className="button-row mt-4">
            <Button variant="ghost" onClick={() => { resetDemo(); router.push("/auth/signup"); }}>شروع دوباره دمو</Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
