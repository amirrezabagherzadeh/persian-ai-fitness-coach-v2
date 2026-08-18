"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import { calculateReadiness } from "@/domain/adaptation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckInPage() {
  const router = useRouter();
  const { state, addCheckIn } = useAppStore();
  const [weightKg, setWeightKg] = useState(state.checkIns.at(-1)?.weightKg ?? state.user.weightKg);
  const [waistCm, setWaistCm] = useState(state.checkIns.at(-1)?.waistCm ?? state.user.waistCm);
  const [sleepQuality, setSleepQuality] = useState(4);
  const [hunger, setHunger] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [performance, setPerformance] = useState(4);
  const [difficulty, setDifficulty] = useState(3);
  const [adherence, setAdherence] = useState(4);
  const adaptation = calculateReadiness({ sleepQuality, energy, performance, difficulty, adherence });
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="چک‌این هفتگی" eyebrow="تنظیم برنامه" description="برنامه را کامل از نو نمی‌سازیم؛ بر اساس داده هفته، توصیه نسخه بعدی مشخص می‌شود." />
        <section className="light-panel grid grid-2">
          <label className="field">وزن<Input type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} /></label>
          <label className="field">دور کمر<Input type="number" value={waistCm} onChange={(e) => setWaistCm(Number(e.target.value))} /></label>
          {[
            ["کیفیت خواب", sleepQuality, setSleepQuality],
            ["گرسنگی", hunger, setHunger],
            ["انرژی", energy, setEnergy],
            ["عملکرد تمرین", performance, setPerformance],
            ["سختی برنامه", difficulty, setDifficulty],
            ["پایبندی رژیم", adherence, setAdherence],
          ].map(([label, value, setter]) => (
            <label className="field" key={label as string}>{label as string}<Input type="range" min={1} max={5} value={value as number} onChange={(e) => (setter as (v: number) => void)(Number(e.target.value))} /></label>
          ))}
          <div className="col-span-full grid gap-3">
            <h2>خلاصه مربی‌گری</h2>
            <p>{adaptation.recommendation}</p>
            <Button onClick={() => { addCheckIn({ id: `checkin-${Date.now()}`, date: new Date().toISOString(), weightKg, waistCm, sleepQuality, hunger, energy, performance, difficulty, adherence, summary: adaptation.recommendation }); router.push("/progress"); }}>ثبت چک‌این</Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
