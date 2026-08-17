"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import { nf } from "@/lib/format";

export function ProfilePage() {
  const { state, resetDemo } = useAppStore();
  const risk = state.user.medicalFlags.length > 0 || state.user.injuries.length > 0;
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="پروفایل" eyebrow={state.user.email} description="داده‌های بدن و سلامت حساس هستند و باید سمت سرور با RLS محافظت شوند." action={<Link className="btn primary" href="/onboarding">ویرایش ارزیابی</Link>} />
        {risk ? <section className="panel"><strong>احتیاط ایمنی</strong><p className="muted">به دلیل آسیب یا مورد پزشکی ثبت‌شده، از توصیه‌های تهاجمی خودداری می‌شود.</p></section> : null}
        <section className="light-panel">
          <table className="table">
            <tbody>
              <tr><th>سن</th><td>{nf(state.user.age)}</td></tr>
              <tr><th>قد</th><td>{nf(state.user.heightCm)} cm</td></tr>
              <tr><th>وزن</th><td>{nf(state.user.weightKg)} kg</td></tr>
              <tr><th>هدف</th><td>{state.user.goal}</td></tr>
              <tr><th>روز تمرین</th><td>{nf(state.user.daysPerWeek)}</td></tr>
              <tr><th>تجهیزات</th><td>{state.user.equipment.join(", ")}</td></tr>
            </tbody>
          </table>
          <div className="button-row mt-4">
            <button className="btn dark" onClick={resetDemo}>بازگردانی داده دمو</button>
            <button className="btn ghost" onClick={() => window.localStorage.clear()}>حذف داده محلی</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
