"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, CheckCircle2, Clock3, Dumbbell, ListChecks, Pause, Play, RefreshCw, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDetailsButton, ExerciseMediaPreview } from "@/components/ExerciseDetailsButton";
import { IntensityGuidance } from "@/components/IntensityGuidance";
import { muscleLabel } from "@/components/MuscleMap";
import { RestTimer } from "@/components/RestTimer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { exercises } from "@/data/exercises";
import type { ActiveWorkoutDraft, Equipment, Exercise, TrainingDay, UserProfile, WorkoutSession, WorkoutSet } from "@/domain/types";
import { createShortWorkout, findExerciseAlternatives } from "@/domain/workout-adaptation";
import { useAppStore } from "@/store/app-store";
import { faDigits, nf } from "@/lib/format";

type WorkoutPhase = "exercise" | "rest" | "transition" | "complete";

const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
const equipmentLabels: Partial<Record<Equipment, string>> = {
  dumbbells: "دمبل", barbell: "هالتر", bench: "نیمکت", cable: "سیم‌کش", bands: "کش تمرینی",
  pullup_bar: "میله بارفیکس", machines: "دستگاه", bodyweight: "وزن بدن",
};

function exerciseEquipment(exercise: Exercise) {
  const labels = exercise.equipment.flatMap((item) => equipmentLabels[item] ? [equipmentLabels[item]] : []);
  return labels.length ? labels.join("، ") : "تجهیزات باشگاه";
}

function createWorkoutSets(day: TrainingDay): WorkoutSet[] {
  return day.prescriptions.flatMap((prescription) =>
    Array.from({ length: prescription.sets }, (_, index) => ({
      prescriptionId: prescription.id,
      setNumber: index + 1,
      weightKg: 0,
      reps: prescription.reps[0],
      rir: prescription.rir,
      completed: false,
    })),
  );
}

function GuidedWorkout({ day, nextDay, profile, compact, draft, onSave, onAutosave, onClearDraft }: {
  day: TrainingDay;
  nextDay?: TrainingDay;
  profile: UserProfile;
  compact: boolean;
  draft?: ActiveWorkoutDraft;
  onSave: (session: WorkoutSession) => void;
  onAutosave: (draft: ActiveWorkoutDraft) => void;
  onClearDraft: () => void;
}) {
  const router = useRouter();
  const [sets, setSets] = useState<WorkoutSet[]>(() => draft?.sets ?? createWorkoutSets(day));
  const [exerciseIndex, setExerciseIndex] = useState(() => Math.min(draft?.exerciseIndex ?? 0, day.prescriptions.length - 1));
  const [phase, setPhase] = useState<WorkoutPhase>(draft?.phase ?? "exercise");
  const [startedAt] = useState(() => draft?.startedAt ?? new Date().toISOString());
  const [saved, setSaved] = useState(false);
  const [adaptationOpen, setAdaptationOpen] = useState(false);
  const [exerciseOverrides, setExerciseOverrides] = useState<Record<string, string>>(() => draft?.exerciseOverrides ?? {});
  const [adaptationMessage, setAdaptationMessage] = useState("");
  const [difficultyFeedback, setDifficultyFeedback] = useState<WorkoutSession["difficultyFeedback"]>(draft?.difficultyFeedback);
  const [completedAt, setCompletedAt] = useState<string | undefined>(draft?.completedAt);

  const prescription = day.prescriptions[exerciseIndex];
  const exercise = exerciseMap.get(exerciseOverrides[prescription.id] ?? prescription.exerciseId);
  const prescriptionSets = sets.filter((set) => set.prescriptionId === prescription.id);
  const activeSet = prescriptionSets.find((set) => !set.completed) ?? prescriptionSets[prescriptionSets.length - 1];
  const completedSets = sets.filter((set) => set.completed).length;
  const progress = Math.round((completedSets / sets.length) * 100);
  const isLastExercise = exerciseIndex === day.prescriptions.length - 1;
  const isTimedExercise = exercise?.id === "plank";
  const alternatives = exercise ? findExerciseAlternatives(exercise, profile, exercises) : [];
  const completedExerciseCount = new Set(sets.map((set) => set.prescriptionId)).size;
  const durationMinutes = completedAt ? Math.max(1, Math.round((Date.parse(completedAt) - Date.parse(startedAt)) / 60000)) : 0;

  const persistDraft = (
    nextSets: WorkoutSet[],
    nextExerciseIndex: number,
    nextPhase: WorkoutPhase,
    nextOverrides = exerciseOverrides,
    nextCompletedAt = completedAt,
    nextFeedback = difficultyFeedback,
  ) => onAutosave({
    dayId: day.id,
    startedAt,
    updatedAt: new Date().toISOString(),
    sets: nextSets,
    exerciseIndex: nextExerciseIndex,
    phase: nextPhase,
    exerciseOverrides: nextOverrides,
    compact,
    completedAt: nextCompletedAt,
    difficultyFeedback: nextFeedback,
  });

  const completeSet = () => {
    const isFinalSet = activeSet.setNumber === prescription.sets;
    const nextSets = sets.map((set) =>
      set.prescriptionId === activeSet.prescriptionId && set.setNumber === activeSet.setNumber
        ? { ...set, completed: true }
        : set,
    );
    const nextPhase = isFinalSet ? "transition" : "rest";
    setSets(nextSets);
    setPhase(nextPhase);
    persistDraft(nextSets, exerciseIndex, nextPhase);
  };

  const continueAfterRest = () => {
    setPhase("exercise");
    persistDraft(sets, exerciseIndex, "exercise");
  };

  const finishWorkout = () => {
    const finishedAt = new Date().toISOString();
    setCompletedAt(finishedAt);
    setPhase("complete");
    persistDraft(sets, exerciseIndex, "complete", exerciseOverrides, finishedAt);
  };

  const continueWorkout = () => {
    if (isLastExercise) {
      finishWorkout();
      return;
    }
    const nextIndex = exerciseIndex + 1;
    setExerciseIndex(nextIndex);
    setPhase("exercise");
    persistDraft(sets, nextIndex, "exercise");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const replaceExercise = (alternative: Exercise) => {
    const nextOverrides = { ...exerciseOverrides, [prescription.id]: alternative.id };
    setExerciseOverrides(nextOverrides);
    persistDraft(sets, exerciseIndex, phase, nextOverrides);
    setAdaptationMessage(`حرکت با «${alternative.nameFa}» جایگزین شد؛ تعداد ست و تکرارهای این بخش حفظ شده است.`);
    setAdaptationOpen(false);
  };

  const skipExercise = (painful = false) => {
    const nextSets = sets.filter((set) => set.prescriptionId !== prescription.id);
    setSets(nextSets);
    setAdaptationOpen(false);
    setAdaptationMessage(painful ? "این حرکت حذف شد. درد را با فشار بیشتر امتحان نکن." : "این حرکت از جلسه امروز کنار گذاشته شد.");
    if (isLastExercise) {
      const finishedAt = new Date().toISOString();
      setCompletedAt(finishedAt);
      setPhase("complete");
      persistDraft(nextSets, exerciseIndex, "complete", exerciseOverrides, finishedAt);
    }
    else {
      const nextIndex = exerciseIndex + 1;
      setExerciseIndex(nextIndex);
      setPhase("exercise");
      persistDraft(nextSets, nextIndex, "exercise");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveAndReturn = () => {
    if (!difficultyFeedback) return;
    if (!saved) {
      onSave({
        id: `session-${Date.now()}`,
        dayId: day.id,
        startedAt,
        completedAt: completedAt ?? new Date().toISOString(),
        durationMinutes,
        difficultyFeedback,
        sets: sets.map((set) => ({ ...set, completed: true })),
      });
      onClearDraft();
      setSaved(true);
    }
    router.push("/dashboard");
  };

  if (phase === "complete") {
    return (
      <div className="guided-workout page">
        <section className="workout-finish-card">
          <span className="finish-icon"><Check /></span>
          <span className="finish-celebration"><Sparkles /> عالی بود، {profile.name}!</span>
          <h1>تمرین امروز کامل شد</h1>
          <div className="finish-stats">
            <span><b>{nf(durationMinutes)}</b> دقیقه</span>
            <span><b>{nf(completedExerciseCount)}</b> حرکت</span>
            <span><b>{nf(sets.length)}</b> ست</span>
          </div>
          {nextDay ? <div className="next-workout-card"><CalendarDays /><span><small>جلسه بعدی</small><strong>{faDigits(nextDay.weekday)} · {nextDay.title}</strong></span></div> : null}
          <fieldset className="workout-difficulty-feedback">
            <legend>شدت تمرین امروز چطور بود؟</legend>
            <p>پاسخت کمک می‌کند جلسه‌های بعدی متناسب‌تر شوند.</p>
            <div>
              {([
                ["easy", "آسان"],
                ["appropriate", "مناسب"],
                ["too_hard", "خیلی سخت"],
              ] as const).map(([value, label]) => (
                <button type="button" className={difficultyFeedback === value ? "selected" : ""} aria-pressed={difficultyFeedback === value} key={value} onClick={() => { setDifficultyFeedback(value); persistDraft(sets, exerciseIndex, "complete", exerciseOverrides, completedAt, value); }}>{label}</button>
              ))}
            </div>
          </fieldset>
          <Button className="guided-primary-button" size="lg" disabled={saved || !difficultyFeedback} onClick={saveAndReturn}>{difficultyFeedback ? "ثبت و بازگشت به امروز" : "ابتدا شدت تمرین را انتخاب کن"} <ArrowLeft /></Button>
        </section>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="guided-workout page">
      <header className="guided-header">
        <div>
          <span className="guided-kicker">تمرین هدایت‌شده · {faDigits(day.weekday)}</span>
          <h1>{day.title}</h1>
        </div>
        <div className="guided-progress-copy"><strong>{nf(progress)}٪</strong><span>{nf(completedSets)} از {nf(sets.length)} ست</span></div>
        <Progress className="guided-progress" value={progress} aria-label={`${nf(progress)} درصد تمرین کامل شده`} />
      </header>

      <div className="guided-layout">
        <main className="guided-main">
          <section className="guided-exercise-card">
            <div className="guided-exercise-heading">
              <div className="exercise-count"><span>حرکت</span><strong>{nf(exerciseIndex + 1)}</strong><small>از {nf(day.prescriptions.length)}</small></div>
              <div><span className="guided-kicker">الان انجام بده</span><h2>{exercise.nameFa}</h2><p dir="ltr" lang="en">{exercise.nameEn}</p></div>
            </div>

            <div className="guided-media"><ExerciseMediaPreview exercise={exercise} /></div>

            <div className="guided-tutorial-row">
              <p>قبل از شروع، مسیر حرکت را یک‌بار کامل ببین. اجرای آرام و کنترل‌شده مهم‌تر از وزنه سنگین است.</p>
              <div className="guided-exercise-actions">
                <ExerciseDetailsButton exercise={exercise} profile={profile} className="guided-tutorial-button"><Play /> آموزش کامل، تصاویر و عضلات هدف</ExerciseDetailsButton>
                <Button type="button" variant="outline" className="replace-exercise-button" aria-expanded={adaptationOpen} onClick={() => { setAdaptationOpen((current) => !current); setAdaptationMessage(""); }}><RefreshCw /> جایگزین حرکت</Button>
              </div>
            </div>
            {adaptationOpen ? (
              <div className="exercise-adaptation-panel" aria-live="polite">
                <div><RefreshCw /><span><strong>جایگزین‌های مناسب {exercise.nameFa}</strong><small>این گزینه‌ها با توجه به عضله هدف، الگوی حرکتی، تجهیزات و محدودیت‌های تو مرتب شده‌اند.</small></span></div>
                {alternatives.length ? (
                  <div className="exercise-alternative-list">
                    {alternatives.slice(0, 3).map((alternative) => (
                      <button className="exercise-alternative-option" type="button" key={alternative.id} onClick={() => replaceExercise(alternative)}>
                        <span className="alternative-icon"><Dumbbell /></span>
                        <span className="alternative-copy">
                          <strong>{alternative.nameFa}</strong>
                          <small>{alternative.primaryMuscles.map(muscleLabel).join(" و ")} · {exerciseEquipment(alternative)}</small>
                          <span className="alternative-badges"><b>همان الگوی حرکتی</b>{alternative.primaryMuscles.some((muscle) => exercise.primaryMuscles.includes(muscle)) ? <b>همان عضله هدف</b> : null}</span>
                        </span>
                        <ArrowLeft />
                      </button>
                    ))}
                  </div>
                ) : <p className="no-exercise-alternative">با تجهیزات و محدودیت‌های فعلی، جایگزین مطمئنی پیدا نشد.</p>}
                <div className="exercise-adaptation-actions exercise-adaptation-secondary-actions">
                  <Button type="button" variant="outline" className="pain-action" onClick={() => skipExercise(true)}><ShieldAlert /> امروز با این حرکت درد دارم</Button>
                  <Button type="button" variant="outline" onClick={() => skipExercise()}><ArrowLeft /> فعلاً از این حرکت عبور می‌کنم</Button>
                </div>
              </div>
            ) : null}
            {adaptationMessage ? <p className="exercise-adaptation-message"><Check /> {adaptationMessage}</p> : null}
          </section>

          {phase === "rest" ? (
            <section className="rest-stage" aria-live="polite">
              <span className="rest-stage-icon"><Pause /></span>
              <span className="guided-kicker">ست {nf(activeSet.setNumber - 1)} ثبت شد</span>
              <h2>کمی استراحت کن</h2>
              <RestTimer seconds={prescription.restSeconds} onComplete={continueAfterRest} />
              <p>وقتی زمان تمام شود، ست {nf(activeSet.setNumber)} همین حرکت آماده می‌شود.</p>
              <Button variant="outline" size="lg" onClick={continueAfterRest}>آماده‌ام؛ شروع ست بعدی <ArrowLeft /></Button>
            </section>
          ) : phase === "transition" ? (
            <section className="movement-complete-stage" aria-live="polite">
              <span><Check /></span>
              <div><small>همه ست‌ها ثبت شد</small><h2>{exercise.nameFa} تمام شد</h2><p>{isLastExercise ? "آخرین حرکت هم انجام شد؛ حالا تمرین امروز را کامل کن." : `حرکت بعدی: ${exerciseMap.get(day.prescriptions[exerciseIndex + 1].exerciseId)?.nameFa}`}</p></div>
              <Button className="guided-primary-button" size="lg" onClick={continueWorkout}>{isLastExercise ? "پایان تمرین" : "رفتن به حرکت بعدی"} <ArrowLeft /></Button>
            </section>
          ) : (
            <section className="active-set-card">
              <div className="active-set-title"><div><span className="guided-kicker">نوبت توست</span><h2>ست {nf(activeSet.setNumber)} از {nf(prescription.sets)}</h2></div><span className="set-status-dot">آماده اجرا</span></div>

              <div className="prescription-strip">
                <span><ListChecks /><b>{nf(prescription.sets)}</b><small>ست کل</small></span>
                <span><RotateCcw /><b dir="ltr">{nf(prescription.reps[0])}–{nf(prescription.reps[1])}</b><small>{isTimedExercise ? "ثانیه" : "تکرار"}</small></span>
                <span><Clock3 /><b>{nf(prescription.restSeconds)}</b><small>ثانیه استراحت</small></span>
              </div>
              <IntensityGuidance remainingReps={prescription.rir} />

              <Button className="complete-set-button" size="lg" onClick={completeSet}><CheckCircle2 /> ست {nf(activeSet.setNumber)} را انجام دادم</Button>
              <div className="set-dots" aria-label={`${nf(prescriptionSets.filter((set) => set.completed).length)} ست از ${nf(prescription.sets)} ثبت شده`}>
                {prescriptionSets.map((set) => <span className={set.completed ? "done" : set.setNumber === activeSet.setNumber ? "active" : ""} key={set.setNumber}>{set.completed ? <Check /> : nf(set.setNumber)}</span>)}
              </div>
            </section>
          )}
        </main>

        <aside className="guided-sidebar-card">
          <span className="guided-kicker">مسیر جلسه</span>
          <h2>{nf(day.prescriptions.length)} حرکت پشت‌سرهم</h2>
          <div className="guided-exercise-list">
            {day.prescriptions.map((item, index) => {
              const itemExercise = exerciseMap.get(exerciseOverrides[item.id] ?? item.exerciseId);
              const itemDone = index < exerciseIndex || (index === exerciseIndex && phase === "transition");
              return <div className={index === exerciseIndex ? "current" : itemDone ? "done" : ""} key={item.id}><span>{itemDone ? <Check /> : nf(index + 1)}</span><div><strong>{itemExercise?.nameFa}</strong><small>{nf(item.sets)} ست · {nf(item.reps[0])} تا {nf(item.reps[1])}</small></div></div>;
            })}
          </div>
          <div className="guided-note"><Dumbbell /><p>هر ست را بعد از انجام ثبت کن. تا وقتی حرکت فعلی تمام نشود، حرکت بعدی باز نمی‌شود.</p></div>
        </aside>
      </div>
    </div>
  );
}

function WorkoutRouteContent({ day, nextDay, profile, compact, draft, alreadyCompleted, onSave, onAutosave, onClearDraft }: {
  day: TrainingDay;
  nextDay?: TrainingDay;
  profile: UserProfile;
  compact: boolean;
  draft?: ActiveWorkoutDraft;
  alreadyCompleted: boolean;
  onSave: (session: WorkoutSession) => void;
  onAutosave: (draft: ActiveWorkoutDraft) => void;
  onClearDraft: () => void;
}) {
  const router = useRouter();
  const [locked] = useState(alreadyCompleted);

  if (locked) {
    return <div className="page"><section className="workout-locked-card"><span><Check /></span><div><p className="guided-kicker">این جلسه ثبت شده است</p><h1>تمرین {faDigits(day.weekday)} را انجام دادی</h1><p>برای جلوگیری از ثبت دوباره، این جلسه بسته شده است. در صفحه امروز، جلسه بعدی آماده است.</p></div><Button size="lg" onClick={() => router.push("/dashboard")}>بازگشت به امروز <ArrowLeft /></Button></section></div>;
  }

  return <GuidedWorkout day={day} nextDay={nextDay} profile={profile} compact={compact} draft={draft} onSave={onSave} onAutosave={onAutosave} onClearDraft={onClearDraft} />;
}

export function ActiveWorkoutPage({ sessionId, compact = false }: { sessionId: string; compact?: boolean }) {
  const { ready, state, addWorkout, saveActiveWorkout, clearActiveWorkout } = useAppStore();
  const day = state.program.days.find((item) => item.id === sessionId);
  const completedWorkout = state.workouts.find((workout) => workout.dayId === sessionId && workout.completedAt);
  const workoutDay = compact && day ? createShortWorkout(day) : day;
  const dayIndex = state.program.days.findIndex((item) => item.id === sessionId);
  const nextDay = dayIndex >= 0 && state.program.days.length > 1 ? state.program.days[(dayIndex + 1) % state.program.days.length] : undefined;
  const workoutKey = `${state.program.id}-${sessionId}-${compact ? "short" : "full"}`;
  const matchingDraft = state.activeWorkout?.dayId === sessionId && state.activeWorkout.compact === compact ? state.activeWorkout : undefined;

  return (
    <AppShell>
      {!ready ? null : !workoutDay ? (
        <div className="page"><section className="light-panel"><h1>جلسه پیدا نشد</h1><p>از صفحه برنامه یک جلسه معتبر را انتخاب کن.</p></section></div>
      ) : <WorkoutRouteContent key={workoutKey} day={workoutDay} nextDay={nextDay} profile={state.user} compact={compact} draft={matchingDraft} alreadyCompleted={Boolean(completedWorkout)} onSave={addWorkout} onAutosave={saveActiveWorkout} onClearDraft={clearActiveWorkout} />}
    </AppShell>
  );
}
