"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Equipment, Goal, UserProfile } from "@/domain/types";
import { useAppStore } from "@/store/app-store";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/ui/progress";

const goals: { id: Goal; label: string }[] = [
  { id: "fat_loss", label: "کاهش چربی" },
  { id: "muscle_gain", label: "عضله‌سازی" },
  { id: "recomposition", label: "ریکامپ" },
  { id: "strength", label: "قدرت" },
  { id: "general_fitness", label: "سلامت عمومی" },
  { id: "maintenance", label: "حفظ وضعیت" },
];
const equipment: { id: Equipment; label: string }[] = [
  { id: "commercial_gym", label: "باشگاه کامل" },
  { id: "dumbbells", label: "دمبل" },
  { id: "barbell", label: "هالتر" },
  { id: "bench", label: "نیمکت" },
  { id: "cable", label: "سیم‌کش" },
  { id: "machines", label: "دستگاه" },
  { id: "bands", label: "کش" },
  { id: "bodyweight", label: "وزن بدن" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { state, setUser } = useAppStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserProfile>(state.user);
  const progress = ((step + 1) / 6) * 100;
  const toggleEquipment = (id: Equipment) => setDraft((current) => ({ ...current, equipment: current.equipment.includes(id) ? current.equipment.filter((x) => x !== id) : [...current.equipment, id] }));
  const finish = () => {
    setUser(draft);
    router.push("/dashboard");
  };
  return (
    <AppShell>
      <div className="page">
        <PageHeader eyebrow="ارزیابی اولیه" title="برنامه‌ات را دقیق بسازیم" description="چند مرحله کوتاه؛ بدون فرم طولانی." />
        <div className="light-panel">
          <Progress value={progress} className="h-2" />
          {step === 0 && (
            <section className="grid">
              <h2>هدفت چیه؟</h2>
              <div className="choice-grid">
                {goals.map((goal) => <button key={goal.id} className={`choice ${draft.goal === goal.id ? "selected" : ""}`} onClick={() => setDraft({ ...draft, goal: goal.id })}>{goal.label}</button>)}
              </div>
            </section>
          )}
          {step === 1 && (
            <section className="grid grid-2">
              <h2 className="col-span-full">کمی درباره بدنت بگو</h2>
              <label className="field">سن<input className="input" type="number" value={draft.age} onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })} /></label>
              <label className="field">جنس زیستی<select className="select" value={draft.sex} onChange={(e) => setDraft({ ...draft, sex: e.target.value as UserProfile["sex"] })}><option value="male">مرد</option><option value="female">زن</option></select></label>
              <label className="field">قد (cm)<input className="input" type="number" value={draft.heightCm} onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) })} /></label>
              <label className="field">وزن (kg)<input className="input" type="number" value={draft.weightKg} onChange={(e) => setDraft({ ...draft, weightKg: Number(e.target.value) })} /></label>
              <label className="field">دور کمر (cm)<input className="input" type="number" value={draft.waistCm} onChange={(e) => setDraft({ ...draft, waistCm: Number(e.target.value) })} /></label>
              <label className="field">وزن هدف<input className="input" type="number" value={draft.targetWeightKg ?? draft.weightKg} onChange={(e) => setDraft({ ...draft, targetWeightKg: Number(e.target.value) })} /></label>
            </section>
          )}
          {step === 2 && (
            <section className="grid grid-2">
              <h2 className="col-span-full">تجربه و زمان تمرین</h2>
              <label className="field">سابقه<select className="select" value={draft.experience} onChange={(e) => setDraft({ ...draft, experience: e.target.value as UserProfile["experience"] })}><option value="never">تا حالا تمرین نکردم</option><option value="beginner">مبتدی</option><option value="intermediate">متوسط</option><option value="advanced">پیشرفته</option></select></label>
              <label className="field">ماه تمرین منظم<input className="input" type="number" value={draft.trainingMonths} onChange={(e) => setDraft({ ...draft, trainingMonths: Number(e.target.value) })} /></label>
              <label className="field">روز در هفته<input className="input" min={2} max={6} type="number" value={draft.daysPerWeek} onChange={(e) => setDraft({ ...draft, daysPerWeek: Number(e.target.value) })} /></label>
              <label className="field">مدت جلسه<input className="input" type="number" value={draft.sessionMinutes} onChange={(e) => setDraft({ ...draft, sessionMinutes: Number(e.target.value) })} /></label>
            </section>
          )}
          {step === 3 && (
            <section className="grid">
              <h2>به چه تجهیزاتی دسترسی داری؟</h2>
              <div className="choice-grid">
                {equipment.map((item) => <button key={item.id} className={`choice ${draft.equipment.includes(item.id) ? "selected" : ""}`} onClick={() => toggleEquipment(item.id)}>{item.label}</button>)}
              </div>
            </section>
          )}
          {step === 4 && (
            <section className="grid grid-2">
              <h2 className="col-span-full">تغذیه و سبک زندگی</h2>
              <label className="field">سبک غذایی<select className="select" value={draft.dietaryStyle} onChange={(e) => setDraft({ ...draft, dietaryStyle: e.target.value as UserProfile["dietaryStyle"] })}><option value="omnivore">همه‌چیزخوار</option><option value="vegetarian">گیاه‌خوار</option><option value="vegan">وگان</option><option value="other">سایر</option></select></label>
              <label className="field">تعداد وعده<input className="input" type="number" value={draft.mealsPerDay} onChange={(e) => setDraft({ ...draft, mealsPerDay: Number(e.target.value) })} /></label>
              <label className="field">فعالیت روزانه<select className="select" value={draft.activityLevel} onChange={(e) => setDraft({ ...draft, activityLevel: e.target.value as UserProfile["activityLevel"] })}><option value="sedentary">کم‌تحرک</option><option value="light">سبک</option><option value="moderate">متوسط</option><option value="high">زیاد</option><option value="very_high">خیلی زیاد</option></select></label>
              <label className="field">خواب میانگین<input className="input" type="number" value={draft.sleepHours} onChange={(e) => setDraft({ ...draft, sleepHours: Number(e.target.value) })} /></label>
            </section>
          )}
          {step === 5 && (
            <section className="grid">
              <h2>غربالگری ایمنی</h2>
              <p className="muted-dark">این محصول تشخیص پزشکی نمی‌دهد. اگر محدودیت پزشکی، آسیب جدی، بیماری قلبی، دیابت، فشار خون کنترل‌نشده، بارداری یا سابقه اختلال شدید خوردن داری، قبل از برنامه سنگین با متخصص مشورت کن.</p>
              <label className="field">آسیب یا درد فعلی<textarea className="textarea" value={draft.injuries.join(", ")} onChange={(e) => setDraft({ ...draft, injuries: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></label>
              <label className="field">موارد پزشکی مهم<textarea className="textarea" value={draft.medicalFlags.join(", ")} onChange={(e) => setDraft({ ...draft, medicalFlags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></label>
            </section>
          )}
          <div className="button-row mt-6">
            <button className="btn ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>قبلی</button>
            {step < 5 ? <button className="btn dark" onClick={() => setStep(step + 1)}>بعدی</button> : <button className="btn dark" onClick={finish}>تولید برنامه</button>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
