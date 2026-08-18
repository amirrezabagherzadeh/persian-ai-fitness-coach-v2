"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2, Clock3, Dumbbell, ListChecks, Pause, Play, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDetailsButton, ExerciseMediaPreview } from "@/components/ExerciseDetailsButton";
import { RestTimer } from "@/components/RestTimer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { exercises } from "@/data/exercises";
import type { TrainingDay, UserProfile, WorkoutSession, WorkoutSet } from "@/domain/types";
import { useAppStore } from "@/store/app-store";

type WorkoutPhase = "exercise" | "rest" | "transition" | "complete";

const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));

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

function GuidedWorkout({ day, profile, onSave }: { day: TrainingDay; profile: UserProfile; onSave: (session: WorkoutSession) => void }) {
  const router = useRouter();
  const [sets, setSets] = useState<WorkoutSet[]>(() => createWorkoutSets(day));
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<WorkoutPhase>("exercise");
  const [startedAt] = useState(() => new Date().toISOString());
  const [saved, setSaved] = useState(false);

  const prescription = day.prescriptions[exerciseIndex];
  const exercise = exerciseMap.get(prescription.exerciseId);
  const prescriptionSets = sets.filter((set) => set.prescriptionId === prescription.id);
  const activeSet = prescriptionSets.find((set) => !set.completed) ?? prescriptionSets[prescriptionSets.length - 1];
  const completedSets = sets.filter((set) => set.completed).length;
  const progress = Math.round((completedSets / sets.length) * 100);
  const isLastExercise = exerciseIndex === day.prescriptions.length - 1;
  const isTimedExercise = exercise?.id === "plank";

  const completeSet = () => {
    const isFinalSet = activeSet.setNumber === prescription.sets;
    setSets((current) => current.map((set) =>
      set.prescriptionId === activeSet.prescriptionId && set.setNumber === activeSet.setNumber
        ? { ...set, completed: true }
        : set,
    ));
    setPhase(isFinalSet ? "transition" : "rest");
  };

  const continueAfterRest = useCallback(() => setPhase("exercise"), []);

  const continueWorkout = () => {
    if (isLastExercise) {
      setPhase("complete");
      return;
    }
    setExerciseIndex((current) => current + 1);
    setPhase("exercise");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveAndReturn = () => {
    if (!saved) {
      onSave({ id: `session-${Date.now()}`, dayId: day.id, startedAt, completedAt: new Date().toISOString(), sets: sets.map((set) => ({ ...set, completed: true })) });
      setSaved(true);
    }
    router.push("/program");
  };

  if (phase === "complete") {
    return (
      <div className="guided-workout page">
        <section className="workout-finish-card">
          <span className="finish-icon"><Check /></span>
          <span className="guided-kicker">تمرین امروز کامل شد</span>
          <h1>آفرین {profile.name}!</h1>
          <p>تمام {day.prescriptions.length} حرکت و {sets.length} ست کامل شد. با ثبت جلسه، وضعیت «{day.weekday}» در برنامه‌ات سبز می‌شود.</p>
          <div className="finish-stats"><span><b>{sets.length}</b> ست کامل</span><span><b>{day.estimatedMinutes}</b> دقیقه برنامه</span></div>
          <Button className="guided-primary-button" size="lg" disabled={saved} onClick={saveAndReturn}>ثبت جلسه و بازگشت به برنامه <ArrowLeft /></Button>
        </section>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="guided-workout page">
      <header className="guided-header">
        <div>
          <span className="guided-kicker">تمرین هدایت‌شده · {day.weekday}</span>
          <h1>{day.title}</h1>
        </div>
        <div className="guided-progress-copy"><strong>{progress}٪</strong><span>{completedSets} از {sets.length} ست</span></div>
        <Progress className="guided-progress" value={progress} aria-label={`${progress} درصد تمرین کامل شده`} />
      </header>

      <div className="guided-layout">
        <main className="guided-main">
          <section className="guided-exercise-card">
            <div className="guided-exercise-heading">
              <div className="exercise-count"><span>حرکت</span><strong>{exerciseIndex + 1}</strong><small>از {day.prescriptions.length}</small></div>
              <div><span className="guided-kicker">الان انجام بده</span><h2>{exercise.nameFa}</h2><p dir="ltr" lang="en">{exercise.nameEn}</p></div>
            </div>

            <div className="guided-media"><ExerciseMediaPreview exercise={exercise} /></div>

            <div className="guided-tutorial-row">
              <p>قبل از شروع، مسیر حرکت را یک‌بار کامل ببین. اجرای آرام و کنترل‌شده مهم‌تر از وزنه سنگین است.</p>
              <ExerciseDetailsButton exercise={exercise} profile={profile} className="guided-tutorial-button"><Play /> آموزش کامل، تصاویر و عضلات هدف</ExerciseDetailsButton>
            </div>
          </section>

          {phase === "rest" ? (
            <section className="rest-stage" aria-live="polite">
              <span className="rest-stage-icon"><Pause /></span>
              <span className="guided-kicker">ست {activeSet.setNumber - 1} ثبت شد</span>
              <h2>کمی استراحت کن</h2>
              <RestTimer seconds={prescription.restSeconds} onComplete={continueAfterRest} />
              <p>وقتی زمان تمام شود، ست {activeSet.setNumber} همین حرکت آماده می‌شود.</p>
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
              <div className="active-set-title"><div><span className="guided-kicker">نوبت توست</span><h2>ست {activeSet.setNumber} از {prescription.sets}</h2></div><span className="set-status-dot">آماده اجرا</span></div>

              <div className="prescription-strip">
                <span><ListChecks /><b>{prescription.sets}</b><small>ست کل</small></span>
                <span><RotateCcw /><b dir="ltr">{prescription.reps[0]}–{prescription.reps[1]}</b><small>{isTimedExercise ? "ثانیه" : "تکرار"}</small></span>
                <span><Clock3 /><b>{prescription.restSeconds}</b><small>ثانیه استراحت</small></span>
              </div>

              <Button className="complete-set-button" size="lg" onClick={completeSet}><CheckCircle2 /> ست {activeSet.setNumber} را انجام دادم</Button>
              <div className="set-dots" aria-label={`${prescriptionSets.filter((set) => set.completed).length} ست از ${prescription.sets} ثبت شده`}>
                {prescriptionSets.map((set) => <span className={set.completed ? "done" : set.setNumber === activeSet.setNumber ? "active" : ""} key={set.setNumber}>{set.completed ? <Check /> : set.setNumber}</span>)}
              </div>
            </section>
          )}
        </main>

        <aside className="guided-sidebar-card">
          <span className="guided-kicker">مسیر جلسه</span>
          <h2>{day.prescriptions.length} حرکت پشت‌سرهم</h2>
          <div className="guided-exercise-list">
            {day.prescriptions.map((item, index) => {
              const itemExercise = exerciseMap.get(item.exerciseId);
              const itemDone = index < exerciseIndex || (index === exerciseIndex && phase === "transition");
              return <div className={index === exerciseIndex ? "current" : itemDone ? "done" : ""} key={item.id}><span>{itemDone ? <Check /> : index + 1}</span><div><strong>{itemExercise?.nameFa}</strong><small>{item.sets} ست · {item.reps[0]} تا {item.reps[1]}</small></div></div>;
            })}
          </div>
          <div className="guided-note"><Dumbbell /><p>هر ست را بعد از انجام ثبت کن. تا وقتی حرکت فعلی تمام نشود، حرکت بعدی باز نمی‌شود.</p></div>
        </aside>
      </div>
    </div>
  );
}

function WorkoutRouteContent({ day, profile, alreadyCompleted, onSave }: { day: TrainingDay; profile: UserProfile; alreadyCompleted: boolean; onSave: (session: WorkoutSession) => void }) {
  const router = useRouter();
  const [locked] = useState(alreadyCompleted);

  if (locked) {
    return <div className="page"><section className="workout-locked-card"><span><Check /></span><div><p className="guided-kicker">این جلسه ثبت شده است</p><h1>تمرین {day.weekday} را انجام دادی</h1><p>برای جلوگیری از ثبت دوباره، این جلسه بسته شده است. از برنامه، جلسه بعدی را شروع کن.</p></div><Button size="lg" onClick={() => router.push("/program")}>بازگشت به برنامه <ArrowLeft /></Button></section></div>;
  }

  return <GuidedWorkout day={day} profile={profile} onSave={onSave} />;
}

export function ActiveWorkoutPage({ sessionId }: { sessionId: string }) {
  const { ready, state, addWorkout } = useAppStore();
  const day = state.program.days.find((item) => item.id === sessionId);
  const completedWorkout = state.workouts.find((workout) => workout.dayId === sessionId && workout.completedAt);
  const workoutKey = `${state.program.id}-${sessionId}`;

  return (
    <AppShell>
      {!ready ? null : !day ? (
        <div className="page"><section className="light-panel"><h1>جلسه پیدا نشد</h1><p>از صفحه برنامه یک جلسه معتبر را انتخاب کن.</p></section></div>
      ) : <WorkoutRouteContent key={workoutKey} day={day} profile={state.user} alreadyCompleted={Boolean(completedWorkout)} onSave={addWorkout} />}
    </AppShell>
  );
}
