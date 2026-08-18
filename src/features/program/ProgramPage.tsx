"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronLeft, Clock3, Dumbbell, Info, Play, Sparkles, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDetailsButton } from "@/components/ExerciseDetailsButton";
import { muscleLabel } from "@/components/MuscleMap";
import { useAppStore } from "@/store/app-store";
import { exercises } from "@/data/exercises";
import { exerciseMedia } from "@/data/exercise-media";

const goalLabels = { fat_loss: "کاهش چربی", muscle_gain: "عضله‌سازی", recomposition: "فرم‌دهی بدن", strength: "افزایش قدرت", general_fitness: "آمادگی عمومی", maintenance: "حفظ وضعیت" };
const levelLabels = { never: "تازه‌کار", beginner: "مبتدی", intermediate: "متوسط", advanced: "پیشرفته" };
const dateFormatter = new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long" });

export function ProgramPage() {
  const { state } = useAppStore();
  const [activeWeek, setActiveWeek] = useState(1);
  const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const completedDayIds = new Set(state.workouts.filter((workout) => workout.completedAt).map((workout) => workout.dayId));

  return (
    <AppShell>
      <div className="program-page page">
        <section className="program-hero">
          <div className="program-hero-copy">
            <span className="onboarding-kicker"><Sparkles /> برنامه اختصاصی {state.user.name}</span>
            <h1>چهار هفته برای قوی‌تر شدن</h1>
            <p>برنامه هر هفته ثابت می‌ماند تا روی تکنیک و پیشرفت واقعی تمرکز کنی. برای دیدن آموزش، روی هر حرکت بزن.</p>
            <div className="program-facts"><span><Target /> {goalLabels[state.user.goal]}</span><span><Dumbbell /> سطح {levelLabels[state.user.experience]}</span><span><CalendarDays /> {state.user.daysPerWeek} جلسه در هفته</span><span><Clock3 /> حدود {state.user.sessionMinutes} دقیقه</span></div>
          </div>
          <div className="program-cycle"><span>دوره فعلی</span><strong>۴ هفته</strong><small>{dateFormatter.format(new Date(state.program.startsAt))} تا {dateFormatter.format(new Date(state.program.endsAt))}</small><div className="cycle-ring"><b>{completedDayIds.size}</b><span>جلسه انجام‌شده</span></div></div>
        </section>

        {state.program.safetyNotice ? <div className="program-warning" role="alert"><Info /><span>{state.program.safetyNotice}</span></div> : null}

        <section className="program-guide"><span className="guide-icon"><Play /></span><div><strong>قبل از شروع، اجرای حرکت را ببین</strong><p>نام هر حرکت قابل کلیک است؛ ابتدا ویدیوی اجرا و سپس تصاویر شروع و پایان، عضلات درگیر و خطاهای رایج را می‌بینی.</p></div><ChevronLeft /></section>

        <section className="week-section">
          <div className="section-heading"><div><span>تقویم برنامه</span><h2>هفته {activeWeek} از ۴</h2></div><p>حرکت‌ها در تمام چهار هفته یکسان هستند.</p></div>
          <div className="week-tabs" role="tablist" aria-label="انتخاب هفته">{[1, 2, 3, 4].map((week) => <button type="button" role="tab" aria-selected={activeWeek === week} className={activeWeek === week ? "active" : ""} onClick={() => setActiveWeek(week)} key={week}><span>هفته</span><strong>{week}</strong>{week < activeWeek ? <Check /> : null}</button>)}</div>
        </section>

        <div className="training-days">
          {state.program.days.map((day, dayIndex) => {
            const completed = activeWeek === 1 && completedDayIds.has(day.id);
            return (
              <article className={`training-day-card ${completed ? "completed" : ""}`} key={day.id}>
                <header><div className="day-index"><span>{String(dayIndex + 1).padStart(2, "0")}</span></div><div><span className="day-weekday">{day.weekday}</span><h2>{day.title}</h2><p>حدود {day.estimatedMinutes} دقیقه</p></div><span className="day-volume"><b>{day.prescriptions.length}</b><span>حرکت</span></span><span className={`day-status ${completed ? "completed" : ""}`}>{completed ? <><Check /> انجام شد</> : "آماده تمرین"}</span></header>
                <div className="day-exercises">
                  {day.prescriptions.map((item) => {
                    const exercise = exerciseMap.get(item.exerciseId);
                    const media = exercise ? exerciseMedia[exercise.id] : undefined;
                    if (!exercise) return null;
                    return (
                      <ExerciseDetailsButton exercise={exercise} profile={state.user} className="program-exercise" key={item.id}>
                        <span className="exercise-thumb">{media ? <Image src={media.frames[0]} alt="" fill sizes="72px" /> : <Dumbbell />}</span>
                        <span className="exercise-identity"><strong>{exercise.nameFa}</strong><small dir="ltr" lang="en">{exercise.nameEn}</small></span>
                        <span className="exercise-muscle">{muscleLabel(exercise.primaryMuscles[0])}</span>
                        <span className="exercise-dose" aria-label={`${item.sets} ست، ${item.reps[0]} تا ${item.reps[1]} تکرار، ${item.restSeconds} ثانیه استراحت`}>
                          <span className="dose-item"><b dir="ltr">{item.sets}</b><small>ست</small></span>
                          <span className="dose-item"><b dir="ltr">{item.reps[0]}–{item.reps[1]}</b><small>تکرار</small></span>
                          <span className="dose-item"><b dir="ltr">{item.restSeconds}</b><small>ثانیه استراحت</small></span>
                        </span>
                        <span className="exercise-play"><Play /></span>
                      </ExerciseDetailsButton>
                    );
                  })}
                </div>
                <footer><div>{completed ? <span className="completed-workout-button"><Check /> تمرین انجام شد</span> : <Link className="btn primary" href={`/workout/${day.id}`}>شروع تمرین <ArrowLeft /></Link>}</div></footer>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
