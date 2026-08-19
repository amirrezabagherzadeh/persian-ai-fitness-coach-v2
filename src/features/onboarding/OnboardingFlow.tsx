"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CalendarDays, Check, ChevronLeft, ChevronRight, Dumbbell, HeartPulse, LoaderCircle, PartyPopper, Ruler, Sparkles, Target, TrendingUp } from "lucide-react";
import type { BodyMeasurements, FocusArea, Goal, InjuryFlag, TrainingStyle, UserProfile } from "@/domain/types";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nf } from "@/lib/format";

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
  { id: "calisthenics", label: "کالیستنیکس", hint: "قدرت و کنترل بدن با وزن خودت" },
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
  const { ready, state, completeOnboarding, saveBodyBaseline, saveWorkoutSchedule } = useAppStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserProfile>(() => ({ ...state.user, equipment: ["commercial_gym"] }));
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [programReady, setProgramReady] = useState(false);
  const [postProgramStep, setPostProgramStep] = useState<"schedule" | "tracking" | "measurements">("schedule");
  const [scheduledDays, setScheduledDays] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [measurements, setMeasurements] = useState<Omit<BodyMeasurements, "recordedAt">>({});
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

  const toggleInjury = (id: InjuryFlag) => setDraft((current) => ({
    ...current,
    injuries: current.injuries.includes(id) ? current.injuries.filter((item) => item !== id) : [...current.injuries, id],
  }));

  const validateStep = () => {
    if (step === 0 && draft.focusAreas.length === 0) return "حداقل یک ناحیه را برای تمرکز بیشتر انتخاب کن.";
    if (step === 1 && (draft.age < 18 || draft.age > 90 || draft.heightCm < 130 || draft.heightCm > 220)) return "سن و قد را در محدوده درست وارد کن.";
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
      setGenerating(false);
      setProgramReady(true);
    }, 900);
  };

  const updateMeasurement = (field: keyof Omit<BodyMeasurements, "recordedAt">, value: string) => {
    setMeasurements((current) => ({ ...current, [field]: value ? Number(value) : undefined }));
  };

  const saveMeasurements = () => {
    saveBodyBaseline(measurements);
    router.push("/dashboard");
  };

  const toggleScheduledDay = (day: string) => {
    setScheduleError("");
    setScheduledDays((current) => {
      if (current.includes(day)) return current.filter((item) => item !== day);
      if (current.length >= draft.daysPerWeek) return current;
      return [...current, day];
    });
  };

  const saveSchedule = () => {
    if (scheduledDays.length !== draft.daysPerWeek) {
      setScheduleError(`برای هر ${nf(draft.daysPerWeek)} جلسه یک روز انتخاب کن.`);
      return;
    }
    saveWorkoutSchedule(scheduledDays, reminderTime || undefined);
    setPostProgramStep("tracking");
  };

  if (!ready || !state.auth.isAuthenticated) return <main className="onboarding-loading"><LoaderCircle className="animate-spin" /><span>در حال آماده‌سازی ارزیابی…</span></main>;

  if (programReady) {
    return (
      <main className="onboarding-shell post-program-shell">
        <section className="post-program-card" aria-live="polite">
          <span className="post-program-icon"><PartyPopper /></span>
          <span className="onboarding-kicker">برنامه اختصاصی تو آماده شد</span>
          <h1>تبریک، آماده‌ای شروع کنی!</h1>
          <p>برنامه چهار هفته‌ای ساخته شد. یک انتخاب اختیاری مانده که به ساخت برنامه ارتباطی ندارد.</p>

          {postProgramStep === "schedule" ? (
            <div className="tracking-form schedule-form">
              <div className="tracking-form-heading"><CalendarDays /><div><h2>دوست داری این {nf(draft.daysPerWeek)} جلسه را چه روزهایی انجام بدهی؟</h2><p>انتخاب روزها محتوای برنامه را تغییر نمی‌دهد؛ فقط جلسه‌ها را روی تقویم تو می‌چیند.</p></div></div>
              <div className="weekday-grid">{weekDays.map((day) => <button type="button" aria-pressed={scheduledDays.includes(day)} className={scheduledDays.includes(day) ? "selected" : ""} onClick={() => toggleScheduledDay(day)} key={day}>{day}</button>)}</div>
              <span className="helper-text">{nf(scheduledDays.length)} از {nf(draft.daysPerWeek)} روز انتخاب شده</span>
              <label className="field schedule-time">ساعت یادآوری تمرین <small>اختیاری؛ فقط برای ساخت یادآور</small><Input dir="ltr" type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} /></label>
              {scheduleError ? <p className="form-error" role="alert">{scheduleError}</p> : null}
              <div className="tracking-actions">
                <Button type="button" size="lg" onClick={saveSchedule}><Check /> ذخیره زمان‌بندی</Button>
                <Button type="button" size="lg" variant="ghost" onClick={() => setPostProgramStep("tracking")}>فعلاً برنامه‌ریزی نمی‌کنم</Button>
              </div>
            </div>
          ) : postProgramStep === "tracking" ? (
            <div className="tracking-invitation">
              <span><TrendingUp /></span>
              <div><h2>دوست داری پیشرفت بدنی‌ات را هم دنبال کنیم؟</h2><p>با ثبت یک خط پایه، تغییرات آینده را با امروز مقایسه می‌کنیم. همه اندازه‌ها اختیاری‌اند و هر زمان خواستی می‌توانی اضافه‌شان کنی.</p></div>
              <div className="tracking-actions">
                <Button type="button" size="lg" onClick={() => setPostProgramStep("measurements")}>بله، خط پایه را ثبت می‌کنم <ChevronLeft /></Button>
                <Button type="button" size="lg" variant="ghost" onClick={() => router.push("/dashboard")}>فعلاً نه؛ رفتن به امروز</Button>
              </div>
            </div>
          ) : (
            <div className="tracking-form">
              <div className="tracking-form-heading"><Ruler /><div><h2>خط پایه امروز</h2><p>فقط مواردی را وارد کن که الان در دسترس داری.</p></div></div>
              <div className="tracking-fields">
                <label className="field">وزن <small>اختیاری</small><span className="input-with-unit"><Input type="number" min={35} max={250} value={measurements.weightKg ?? ""} onChange={(event) => updateMeasurement("weightKg", event.target.value)} /><b>kg</b></span></label>
                <label className="field">دور کمر <small>اختیاری</small><span className="input-with-unit"><Input type="number" min={40} max={200} value={measurements.waistCm ?? ""} onChange={(event) => updateMeasurement("waistCm", event.target.value)} /><b>cm</b></span></label>
                <label className="field">دور بازو <small>اختیاری</small><span className="input-with-unit"><Input type="number" min={15} max={80} value={measurements.armCm ?? ""} onChange={(event) => updateMeasurement("armCm", event.target.value)} /><b>cm</b></span></label>
                <label className="field">دور سینه <small>اختیاری</small><span className="input-with-unit"><Input type="number" min={40} max={200} value={measurements.chestCm ?? ""} onChange={(event) => updateMeasurement("chestCm", event.target.value)} /><b>cm</b></span></label>
                <label className="field">دور ران <small>اختیاری</small><span className="input-with-unit"><Input type="number" min={20} max={120} value={measurements.thighCm ?? ""} onChange={(event) => updateMeasurement("thighCm", event.target.value)} /><b>cm</b></span></label>
              </div>
              <div className="tracking-actions">
                <Button type="button" size="lg" onClick={saveMeasurements}><Check /> ذخیره و دیدن برنامه</Button>
                <Button type="button" size="lg" variant="ghost" onClick={() => router.push("/dashboard")}>رد کردن و رفتن به امروز</Button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="onboarding-shell">
      <div className="onboarding-frame">
        <header className="onboarding-header">
          <div className="brand"><span className="brand-mark"><Dumbbell /></span><span>Gym Coach</span></div>
          <span className="onboarding-kicker">ارزیابی اختصاصی باشگاه</span>
          <h1>برنامه‌ای که برای بدن تو نوشته می‌شود</h1>
          <p>چند پاسخ کوتاه کمک می‌کند برنامه چهار هفته آینده با هدف، زمان و محدودیت‌های تو هماهنگ باشد.</p>
          <Progress value={((step + 1) / 6) * 100} className="mt-5 h-2" />
          <div className="onboarding-step-label"><span>مرحله {nf(step + 1)} از ۶</span><strong>{stepMeta[step].label}</strong></div>
        </header>

        <section className="assessment-card" aria-live="polite">
          {step === 0 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۱</span><h2>از تمرین چه نتیجه‌ای می‌خواهی؟</h2><p>هدف اصلی و حداکثر سه ناحیه اولویت‌دار را انتخاب کن.</p></div>
              <div className="option-grid option-grid-goals">
                {goals.map((goal) => <button type="button" aria-pressed={draft.goal === goal.id} className={`selection-card ${draft.goal === goal.id ? "selected" : ""}`} onClick={() => setDraft((current) => ({ ...current, goal: goal.id }))} key={goal.id}><strong>{goal.label}</strong><span>{goal.hint}</span>{draft.goal === goal.id ? <Check /> : null}</button>)}
              </div>
              <div className="assessment-subsection"><h3>تمرکز بیشتر روی کدام ناحیه باشد؟</h3><div className="chip-grid">{focusAreas.map((area) => <button type="button" aria-pressed={draft.focusAreas.includes(area.id)} className={`choice-chip ${draft.focusAreas.includes(area.id) ? "selected" : ""}`} onClick={() => toggleFocus(area.id)} key={area.id}>{area.label}</button>)}</div><span className="helper-text">{nf(draft.focusAreas.length)} از ۳ انتخاب شده</span></div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۲</span><h2>چند مشخصه پایه</h2><p>فعلاً فقط اطلاعات لازم را می‌گیریم؛ اندازه‌های مربوط به پیگیری پیشرفت بعد از ساخت برنامه پیشنهاد می‌شوند.</p></div>
              <div className="form-grid">
                <label className="field">سن <Input type="number" min={18} max={90} value={draft.age} onChange={(event) => setDraft({ ...draft, age: Number(event.target.value) })} /></label>
                <label className="field">جنس زیستی <Select value={draft.sex} onValueChange={(value) => setDraft({ ...draft, sex: value as UserProfile["sex"] })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">مرد</SelectItem><SelectItem value="female">زن</SelectItem></SelectContent></Select></label>
                <label className="field">قد <span className="input-with-unit"><Input type="number" min={130} max={220} value={draft.heightCm} onChange={(event) => setDraft({ ...draft, heightCm: Number(event.target.value) })} /><b>cm</b></span></label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۳</span><h2>سطح فعلی تمرین</h2><p>برنامه باید چالش‌برانگیز باشد، نه فراتر از آمادگی تو.</p></div>
              <div className="option-grid">
                {([{"id":"never","label":"تازه شروع می‌کنم","hint":"سابقه منظم ندارم","months":0},{"id":"beginner","label":"مبتدی","hint":"کمتر از ۶ ماه","months":3},{"id":"intermediate","label":"متوسط","hint":"۶ ماه تا ۲ سال","months":12},{"id":"advanced","label":"پیشرفته","hint":"بیشتر از ۲ سال","months":30}] as const).map((level) => <button type="button" aria-pressed={draft.experience === level.id} className={`selection-card ${draft.experience === level.id ? "selected" : ""}`} onClick={() => setDraft({ ...draft, experience: level.id, trainingMonths: level.months })} key={level.id}><strong>{level.label}</strong><span>{level.hint}</span></button>)}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="assessment-section">
              <div><span className="section-number">۰۴</span><h2>ظرفیت هفتگی تو</h2><p>تعداد جلسات، Split را می‌سازد و مدت هر جلسه تعداد حرکات را تعیین می‌کند.</p></div>
              <div className="number-selector">{[2, 3, 4, 5, 6].map((count) => <button type="button" aria-pressed={draft.daysPerWeek === count} className={draft.daysPerWeek === count ? "selected" : ""} onClick={() => setDraft((current) => ({ ...current, daysPerWeek: count }))} key={count}><strong>{nf(count)}</strong><span>روز</span></button>)}</div>
              <label className="field max-field">مدت هر جلسه <Select value={String(draft.sessionMinutes)} onValueChange={(value) => setDraft({ ...draft, sessionMinutes: Number(value) })}><SelectTrigger className="w-full"><SelectValue>{nf(draft.sessionMinutes)} دقیقه</SelectValue></SelectTrigger><SelectContent>{[30,45,60,75,90].map((minute) => <SelectItem value={String(minute)} key={minute}>{nf(minute)} دقیقه</SelectItem>)}</SelectContent></Select></label>
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
              <div className="review-grid"><div><span>هدف</span><strong>{goals.find((goal) => goal.id === draft.goal)?.label}</strong></div><div><span>تعداد جلسات</span><strong>{nf(draft.daysPerWeek)} روز در هفته</strong></div><div><span>زمان جلسه</span><strong>{nf(draft.sessionMinutes)} دقیقه</strong></div><div><span>سبک</span><strong>{trainingStyles.find((style) => style.id === draft.trainingStyle)?.label}</strong></div></div>
              <p className="safety-copy">این دمو تشخیص پزشکی نمی‌دهد. در صورت درد شدید، آسیب تازه یا محدودیت پزشکی، برنامه باید توسط متخصص یا مربی باشگاه بررسی شود.</p>
            </div>
          ) : null}

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <footer className="assessment-actions">
            <Button type="button" variant="ghost" className="assessment-back" disabled={step === 0 || generating} onClick={() => { setError(""); setStep((current) => Math.max(0, current - 1)); }}><ChevronRight /> قبلی</Button>
            {step < 5 ? <Button type="button" className="assessment-next" onClick={next}>ادامه <ChevronLeft /></Button> : <Button type="button" className="assessment-next" disabled={generating} onClick={finish}>{generating ? <><LoaderCircle className="animate-spin" /> در حال ساخت برنامه…</> : <><Sparkles /> ساخت برنامه اختصاصی</>}</Button>}
          </footer>
        </section>
      </div>
    </main>
  );
}
