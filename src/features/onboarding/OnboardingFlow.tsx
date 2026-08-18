"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CalendarDays, Check, ChevronLeft, ChevronRight, Dumbbell, HeartPulse, LoaderCircle, Ruler, Sparkles, Target } from "lucide-react";
import type { FocusArea, Goal, InjuryFlag, TrainingStyle, UserProfile } from "@/domain/types";
import { useAppStore } from "@/store/app-store";
import { Progress } from "@/components/ui/progress";

const goals: { id: Goal; label: string; hint: string }[] = [
  { id: "fat_loss", label: "کاهش چربی", hint: "بدن متناسب‌تر و حفظ عضله" },
  { id: "muscle_gain", label: "عضله‌سازی", hint: "افزایش حجم و قدرت عضلات" },
  { id: "recomposition", label: "فرم‌دهی بدن", hint: "عضله بیشتر، چربی کمتر" },
  { id: "strength", label: "افزایش قدرت", hint: "تمرکز روی حرکات اصلی" },
  { id: "general_fitness", label: "آمادگی عمومی", hint: "انرژی، سلامت و عملکرد بهتر" },
  { id: "maintenance", label: "حفظ وضعیت", hint: "تثبیت فرم و توان فعلی" },
];

const focusAreas: { id: FocusArea; label: string }[] = [
  { id: "chest", label: "سینه" }, { id: "back", label: "پشت و زیربغل" }, { id: "shoulders", label: "سرشانه" },
  { id: "arms", label: "بازوها" }, { id: "legs", label: "پاها" }, { id: "glutes", label: "عضلات سرینی" }, { id: "core", label: "میان‌تنه" },
];

const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

const trainingStyles: { id: TrainingStyle; label: string; hint: string }[] = [
  { id: "balanced", label: "ترکیبی", hint: "تعادل دستگاه و وزنه آزاد" },
  { id: "machines", label: "دستگاه‌محور", hint: "کنترل بیشتر و یادگیری آسان‌تر" },
  { id: "free_weights", label: "وزنه آزاد", hint: "اولویت دمبل و هالتر" },
];

const injuryOptions: { id: InjuryFlag; label: string }[] = [
  { id: "shoulder_pain", label: "شانه" }, { id: "knee_pain", label: "زانو" }, { id: "back_pain", label: "کمر" },
  { id: "elbow_pain", label: "آرنج" }, { id: "wrist_pain", label: "مچ دست" },
];

const stepMeta = [
  { icon: Target, label: "هدف" }, { icon: Ruler, label: "بدن" }, { icon: Activity, label: "سابقه" },
  { icon: CalendarDays, label: "زمان‌بندی" }, { icon: Dumbbell, label: "سبک تمرین" }, { icon: HeartPulse, label: "ایمنی" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { ready, state, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserProfile>(() => ({ ...state.user, equipment: ["commercial_gym"] }));
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const draftInitialized = useRef(false);

  useEffect(() => {
    if (ready && !state.auth.isAuthenticated) router.replace("/auth/signup");
    if (ready && state.auth.isAuthenticated && !draftInitialized.current) {
      setDraft({ ...state.user, equipment: ["commercial_gym"] });
      draftInitialized.current = true;
    }
  }, [ready, router, state.auth.isAuthenticated, state.user]);

  const toggleFocus = (id: FocusArea) => setDraft((current) => {
    const selected = current.focusAreas.includes(id);
    if (!selected && current.focusAreas.length >= 3) return current;
    return { ...current, focusAreas: selected ? current.focusAreas.filter((area) => area !== id) : [...current.focusAreas, id] };
  });

  const toggleDay = (day: string) => setDraft((current) => {
    const selected = current.preferredDays.includes(day);
    if (!selected && current.preferredDays.length >= current.daysPerWeek) return current;
    return { ...current, preferredDays: selected ? current.preferredDays.filter((item) => item !== day) : [...current.preferredDays, day] };
  });

  const toggleInjury = (id: InjuryFlag) => setDraft((current) => ({
    ...current,
    injuries: current.injuries.includes(id) ? current.injuries.filter((item) => item !== id) : [...current.injuries, id],
  }));

  const validateStep = () => {
    if (step === 0 && draft.focusAreas.length === 0) return "حداقل یک ناحیه را برای تمرکز بیشتر انتخاب کن.";
    if (step === 1 && (draft.age < 18 || draft.age > 90 || draft.heightCm < 130 || draft.heightCm > 220 || draft.weightKg < 35 || draft.weightKg > 250 || draft.waistCm < 40 || draft.armCm < 15)) return "اندازه‌های بدنی را در محدوده درست وارد کن.";
    if (step === 2 && draft.trainingMonths < 0) return "سابقه تمرین نمی‌تواند منفی باشد.";
    if (step === 3 && draft.preferredDays.length !== draft.daysPerWeek) return `دقیقاً ${draft.daysPerWeek} روز تمرین را انتخاب کن.`;
    return "";
  };

  const next = () => {
    const message = validateStep();
    if (message) return setError(message);
    setError("");
    setStep((current) => Math.min(5, current + 1));
  };

  const finish = () => {
    const message = validateStep();
    if (message) return setError(message);
    setGenerating(true);
    window.setTimeout(() => {
      completeOnboarding(draft);
      router.push("/program");
    }, 900);
  };

  if (!ready || !state.auth.isAuthenticated) return <main className="onboarding-loading"><LoaderCircle className="animate-spin" /><span>در حال آماده‌سازی ارزیابی…</span></main>;

  return (
    <main className="onboarding-shell">
      <div className="onboarding-frame">
        <header className="onboarding-header">
          <div className="brand"><span className="brand-mark"><Dumbbell /></span><span>Gym Coach</span></div>
          <span className="onboarding-kicker">ارزیابی اختصاصی باشگاه</span>
          <h1>برنامه‌ای که برای بدن تو نوشته می‌شود</h1>
          <p>چند پاسخ کوتاه کمک می‌کند برنامه چهار هفته آینده با هدف، زمان و محدودیت‌های تو هماهنگ باشد.</p>
          <Progress value={((step + 1) / 6) * 100} className="mt-5 h-2" />
          <div className="onboarding-step-label"><span>مرحله {step + 1} از ۶</span><strong>{stepMeta[step].label}</strong></div>
        </header>

        <section className="assessment-card" aria-live="polite">
          {step === 0 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۱</span><h2>از تمرین چه نتیجه‌ای می‌خواهی؟</h2><p>هدف اصلی و حداکثر سه ناحیه اولویت‌دار را انتخاب کن.</p></div>
              <div className="option-grid option-grid-goals">
                {goals.map((goal) => <button type="button" aria-pressed={draft.goal === goal.id} className={`selection-card ${draft.goal === goal.id ? "selected" : ""}`} onClick={() => setDraft((current) => ({ ...current, goal: goal.id }))} key={goal.id}><strong>{goal.label}</strong><span>{goal.hint}</span>{draft.goal === goal.id ? <Check /> : null}</button>)}
              </div>
              <div className="assessment-subsection"><h3>تمرکز بیشتر روی کدام ناحیه باشد؟</h3><div className="chip-grid">{focusAreas.map((area) => <button type="button" aria-pressed={draft.focusAreas.includes(area.id)} className={`choice-chip ${draft.focusAreas.includes(area.id) ? "selected" : ""}`} onClick={() => toggleFocus(area.id)} key={area.id}>{area.label}</button>)}</div><span className="helper-text">{draft.focusAreas.length} از ۳ انتخاب شده</span></div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۲</span><h2>خط پایه بدن تو</h2><p>این اعداد برای شخصی‌سازی و مقایسه تغییرات آینده استفاده می‌شوند.</p></div>
              <div className="form-grid">
                <label className="field">سن <input className="input" type="number" min={18} max={90} value={draft.age} onChange={(event) => setDraft({ ...draft, age: Number(event.target.value) })} /></label>
                <label className="field">جنس زیستی <select className="select" value={draft.sex} onChange={(event) => setDraft({ ...draft, sex: event.target.value as UserProfile["sex"] })}><option value="male">مرد</option><option value="female">زن</option></select></label>
                <label className="field">قد <span className="input-with-unit"><input type="number" min={130} max={220} value={draft.heightCm} onChange={(event) => setDraft({ ...draft, heightCm: Number(event.target.value) })} /><b>cm</b></span></label>
                <label className="field">وزن <span className="input-with-unit"><input type="number" min={35} max={250} value={draft.weightKg} onChange={(event) => setDraft({ ...draft, weightKg: Number(event.target.value) })} /><b>kg</b></span></label>
                <label className="field">دور کمر <span className="input-with-unit"><input type="number" min={40} max={200} value={draft.waistCm} onChange={(event) => setDraft({ ...draft, waistCm: Number(event.target.value) })} /><b>cm</b></span></label>
                <label className="field">دور بازو <span className="input-with-unit"><input type="number" min={15} max={80} value={draft.armCm} onChange={(event) => setDraft({ ...draft, armCm: Number(event.target.value) })} /><b>cm</b></span></label>
                <label className="field">دور سینه <small>اختیاری</small><span className="input-with-unit"><input type="number" value={draft.chestCm ?? ""} onChange={(event) => setDraft({ ...draft, chestCm: event.target.value ? Number(event.target.value) : undefined })} /><b>cm</b></span></label>
                <label className="field">دور ران <small>اختیاری</small><span className="input-with-unit"><input type="number" value={draft.thighCm ?? ""} onChange={(event) => setDraft({ ...draft, thighCm: event.target.value ? Number(event.target.value) : undefined })} /><b>cm</b></span></label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۳</span><h2>سطح فعلی تمرین</h2><p>برنامه باید چالش‌برانگیز باشد، نه فراتر از آمادگی تو.</p></div>
              <div className="option-grid">
                {([{"id":"never","label":"تازه شروع می‌کنم","hint":"سابقه منظم ندارم"},{"id":"beginner","label":"مبتدی","hint":"کمتر از ۶ ماه"},{"id":"intermediate","label":"متوسط","hint":"۶ ماه تا ۲ سال"},{"id":"advanced","label":"پیشرفته","hint":"بیشتر از ۲ سال"}] as const).map((level) => <button type="button" aria-pressed={draft.experience === level.id} className={`selection-card ${draft.experience === level.id ? "selected" : ""}`} onClick={() => setDraft({ ...draft, experience: level.id })} key={level.id}><strong>{level.label}</strong><span>{level.hint}</span></button>)}
              </div>
              <label className="field max-field">چند ماه تمرین منظم داشته‌ای؟ <input className="input" type="number" min={0} max={360} value={draft.trainingMonths} onChange={(event) => setDraft({ ...draft, trainingMonths: Number(event.target.value) })} /></label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۴</span><h2>برنامه هفتگی تو</h2><p>تعداد جلسات را انتخاب کن؛ بعد همان تعداد روز را مشخص کن.</p></div>
              <div className="number-selector">{[2, 3, 4, 5, 6].map((count) => <button type="button" aria-pressed={draft.daysPerWeek === count} className={draft.daysPerWeek === count ? "selected" : ""} onClick={() => setDraft((current) => ({ ...current, daysPerWeek: count, preferredDays: current.preferredDays.slice(0, count) }))} key={count}><strong>{count}</strong><span>روز</span></button>)}</div>
              <div className="assessment-subsection"><h3>روزهای تمرین</h3><div className="weekday-grid">{weekDays.map((day) => <button type="button" aria-pressed={draft.preferredDays.includes(day)} className={draft.preferredDays.includes(day) ? "selected" : ""} onClick={() => toggleDay(day)} key={day}>{day}</button>)}</div><span className="helper-text">{draft.preferredDays.length} از {draft.daysPerWeek} روز انتخاب شده</span></div>
              <div className="form-grid two"><label className="field">مدت هر جلسه <select className="select" value={draft.sessionMinutes} onChange={(event) => setDraft({ ...draft, sessionMinutes: Number(event.target.value) })}>{[30,45,60,75,90].map((minute) => <option value={minute} key={minute}>{minute} دقیقه</option>)}</select></label><label className="field">زمان ترجیحی <input className="input" type="time" value={draft.preferredTime} onChange={(event) => setDraft({ ...draft, preferredTime: event.target.value })} /></label></div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۵</span><h2>سبک تمرین مورد علاقه</h2><p>باشگاه کامل در دسترس توست؛ فقط مشخص کن کدام سبک برایت جذاب‌تر است.</p></div>
              <div className="option-grid">{trainingStyles.map((style) => <button type="button" aria-pressed={draft.trainingStyle === style.id} className={`selection-card style-card ${draft.trainingStyle === style.id ? "selected" : ""}`} onClick={() => setDraft({ ...draft, trainingStyle: style.id })} key={style.id}><Dumbbell /><strong>{style.label}</strong><span>{style.hint}</span></button>)}</div>
              <div className="gym-access-note"><Sparkles /><div><strong>دسترسی کامل باشگاه ثبت شد</strong><span>دستگاه‌ها، دمبل، هالتر، نیمکت و سیم‌کش در انتخاب حرکات لحاظ می‌شوند.</span></div></div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۶</span><h2>ایمنی و مرور نهایی</h2><p>اگر دردی داری مشخص کن تا حرکات نامناسب از برنامه حذف شوند.</p></div>
              <div className="assessment-subsection"><h3>آیا در این ناحیه درد یا آسیب فعلی داری؟</h3><div className="chip-grid">{injuryOptions.map((injury) => <button type="button" aria-pressed={draft.injuries.includes(injury.id)} className={`choice-chip danger ${draft.injuries.includes(injury.id) ? "selected" : ""}`} onClick={() => toggleInjury(injury.id)} key={injury.id}>{injury.label}</button>)}</div></div>
              <div className="assessment-subsection"><h3>آیا پزشک برای تمرین سنگین محدودیتی تعیین کرده است؟</h3><div className="chip-grid"><button type="button" aria-pressed={draft.medicalFlags.length === 0} className={`choice-chip ${draft.medicalFlags.length === 0 ? "selected" : ""}`} onClick={() => setDraft({ ...draft, medicalFlags: [] })}>خیر</button><button type="button" aria-pressed={draft.medicalFlags.length > 0} className={`choice-chip danger ${draft.medicalFlags.length > 0 ? "selected" : ""}`} onClick={() => setDraft({ ...draft, medicalFlags: ["physician_restriction"] })}>بله، نیاز به بررسی دارم</button></div></div>
              <label className="field">توضیح آسیب یا محدودیت پزشک <small>اختیاری</small><textarea className="textarea" value={draft.injuryNotes} onChange={(event) => setDraft({ ...draft, injuryNotes: event.target.value })} placeholder="مثلاً هنگام بالا بردن دست، شانه راست درد می‌گیرد…" /></label>
              <div className="review-grid"><div><span>هدف</span><strong>{goals.find((goal) => goal.id === draft.goal)?.label}</strong></div><div><span>تعداد جلسات</span><strong>{draft.daysPerWeek} روز در هفته</strong></div><div><span>زمان جلسه</span><strong>{draft.sessionMinutes} دقیقه</strong></div><div><span>سبک</span><strong>{trainingStyles.find((style) => style.id === draft.trainingStyle)?.label}</strong></div></div>
              <p className="safety-copy">این دمو تشخیص پزشکی نمی‌دهد. در صورت درد شدید، آسیب تازه یا محدودیت پزشکی، برنامه باید توسط متخصص یا مربی باشگاه بررسی شود.</p>
            </div>
          ) : null}

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <footer className="assessment-actions">
            <button type="button" className="btn ghost assessment-back" disabled={step === 0 || generating} onClick={() => { setError(""); setStep((current) => Math.max(0, current - 1)); }}><ChevronRight /> قبلی</button>
            {step < 5 ? <button type="button" className="btn primary assessment-next" onClick={next}>ادامه <ChevronLeft /></button> : <button type="button" className="btn primary assessment-next" disabled={generating} onClick={finish}>{generating ? <><LoaderCircle className="animate-spin" /> در حال ساخت برنامه…</> : <><Sparkles /> ساخت برنامه اختصاصی</>}</button>}
          </footer>
        </section>
      </div>
    </main>
  );
}
