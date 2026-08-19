"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarClock, CalendarDays, Check, CheckCircle2, Circle, Clock3, Dumbbell, RotateCcw, Sparkles, TimerReset } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { exercises } from "@/data/exercises";
import { useAppStore } from "@/store/app-store";
import { faDigits, nf, todayFa } from "@/lib/format";

const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));

export function DashboardPage() {
  const { state, rescheduleWorkout } = useAppStore();
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState("");
  const completedDayIds = new Set(state.workouts.filter((workout) => workout.completedAt).map((workout) => workout.dayId));
  const nextWorkout = state.program.days.find((day) => !completedDayIds.has(day.id));
  const todayWorkout = nextWorkout ?? state.program.days.at(-1);
  const weekComplete = !nextWorkout;
  const occupiedWeekdays = new Set(state.program.days.filter((day) => day.id !== todayWorkout?.id).map((day) => day.weekday));
  const availableTransferDays = weekDays.filter((day) => !occupiedWeekdays.has(day));
  const activeDraft = state.activeWorkout;
  const draftDay = activeDraft ? state.program.days.find((day) => day.id === activeDraft.dayId) : undefined;
  const draftPrescription = draftDay && activeDraft ? draftDay.prescriptions[activeDraft.exerciseIndex] : undefined;
  const draftExercise = draftPrescription && activeDraft ? exerciseMap.get(activeDraft.exerciseOverrides[draftPrescription.id] ?? draftPrescription.exerciseId) : undefined;
  const draftSets = draftPrescription && activeDraft ? activeDraft.sets.filter((set) => set.prescriptionId === draftPrescription.id) : [];
  const resumeSet = draftSets.find((set) => !set.completed)?.setNumber ?? draftSets.at(-1)?.setNumber;

  if (!todayWorkout) return null;

  return (
    <AppShell>
      <div className="today-page page">
        <header className="today-header">
          <div><span>{todayFa()}</span><h1>سلام {state.user.name}</h1></div>
          <span className="today-progress"><b>{nf(completedDayIds.size)}</b> از {nf(state.program.days.length)} جلسه این هفته</span>
        </header>

        {activeDraft && draftDay && draftPrescription && draftExercise ? (
          <section className="resume-workout-card" aria-label="تمرین نیمه‌تمام">
            <span className="resume-workout-icon"><RotateCcw /></span>
            <div className="resume-workout-copy">
              <span>ادامه تمرین قبلی؟</span>
              <h2>{draftExercise.nameFa}</h2>
              <p>{activeDraft.phase === "complete" ? "تمرین تمام شده؛ جمع‌بندی و ثبت شدت باقی مانده است." : `ست ${nf(resumeSet ?? 1)} از ${nf(draftSets.length || draftPrescription.sets)} · ${draftDay.title}`}</p>
            </div>
            <Link className="btn resume-workout-button" href={`/workout/${activeDraft.dayId}${activeDraft.compact ? "?duration=30" : ""}`}>ادامه تمرین <ArrowLeft /></Link>
          </section>
        ) : null}

        <section className={`today-workout-card ${weekComplete ? "complete" : ""}`}>
          <div className="today-card-copy">
            <span className="today-label">{weekComplete ? <CheckCircle2 /> : <Sparkles />}{weekComplete ? "این هفته کامل شد" : "امروز"}</span>
            <span className="today-weekday">{faDigits(todayWorkout.weekday)}</span>
            <h2>{weekComplete ? "همه جلسه‌ها را انجام دادی" : todayWorkout.title}</h2>
            <div className="today-workout-facts">
              <span><Dumbbell /><b>{nf(todayWorkout.prescriptions.length)}</b> حرکت</span>
              <span><Clock3 />حدود <b>{nf(todayWorkout.estimatedMinutes)}</b> دقیقه</span>
            </div>
            {weekComplete ? (
              <p>آفرین؛ برنامه این هفته کامل است. برنامه کامل را ببین یا برای هفته بعد آماده شو.</p>
            ) : (
              <p>همه‌چیز آماده است؛ داخل تمرین، هر حرکت و ست قدم‌به‌قدم نمایش داده می‌شود.</p>
            )}
          </div>
          <div className="today-card-action">
            {weekComplete ? <span className="week-complete-mark"><Check /></span> : <Link className="btn today-start-button" href={`/workout/${todayWorkout.id}`}><Dumbbell /> شروع تمرین <ArrowLeft /></Link>}
          </div>
        </section>

        {!weekComplete ? (
          <section className="workout-rescue-card">
            <div><span>برنامه امروز با زندگی‌ات جور نیست؟</span><h2>تمرین را با امروز هماهنگ کن</h2></div>
            <div className="workout-rescue-actions">
              <Link href={`/workout/${todayWorkout.id}?duration=30`}><TimerReset /><span><strong>فقط ۳۰ دقیقه وقت دارم</strong><small>نسخه کوتاه با حرکات اصلی</small></span><ArrowLeft /></Link>
              <button type="button" onClick={() => { setRescheduling((current) => !current); setRescheduleMessage(""); }}><CalendarClock /><span><strong>امروز نمی‌رسم یا باشگاه بسته است</strong><small>انتقال همین جلسه به یک روز دیگر</small></span><ArrowLeft /></button>
            </div>
            {rescheduling ? (
              <div className="reschedule-panel" aria-live="polite">
                <p>این جلسه را به کدام روز منتقل کنیم؟</p>
                <div>{availableTransferDays.map((day) => <button type="button" onClick={() => { rescheduleWorkout(todayWorkout.id, day); setRescheduleMessage(`جلسه به ${day} منتقل شد.`); setRescheduling(false); }} key={day}>{day}</button>)}</div>
              </div>
            ) : null}
            {rescheduleMessage ? <p className="reschedule-success"><Check /> {rescheduleMessage}</p> : null}
          </section>
        ) : null}

        <section className="week-overview-card">
          <header><div><span>این هفته</span><h2>مسیر تمرین‌ها</h2></div><CalendarDays /></header>
          <div className="week-session-list">
            {state.program.days.map((day) => {
              const completed = completedDayIds.has(day.id);
              const current = day.id === nextWorkout?.id;
              return (
                <div className={completed ? "completed" : current ? "current" : ""} key={day.id}>
                  <span className="week-session-status">{completed ? <Check /> : <Circle />}</span>
                  <div><strong>{faDigits(day.weekday)}</strong><small>{day.title}</small></div>
                  <span>{completed ? "انجام شد" : current ? "جلسه بعد" : "در انتظار"}</span>
                </div>
              );
            })}
          </div>
        </section>

        <Link className="full-program-link" href="/program"><span><strong>مشاهده برنامه کامل</strong><small>همه هفته‌ها، حرکات و جزئیات ست‌ها</small></span><ArrowLeft /></Link>
      </div>
    </AppShell>
  );
}
