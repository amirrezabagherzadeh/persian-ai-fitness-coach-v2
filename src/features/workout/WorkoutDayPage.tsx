"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Dumbbell, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ExerciseDetailsButton } from "@/components/ExerciseDetailsButton";
import { useAppStore } from "@/store/app-store";
import { exercises } from "@/data/exercises";

export function WorkoutDayPage({ id }: { id: string }) {
  const { state } = useAppStore();
  const day = state.program.days.find((item) => item.id === id) ?? state.program.days[0];
  const find = (exerciseId: string) => exercises.find((item) => item.id === exerciseId);
  return (
    <AppShell>
      <div className="page">
        <Link className="back-link" href="/program"><ArrowRight /> بازگشت به برنامه چهار هفته‌ای</Link>
        <PageHeader title={day.title} eyebrow={`${day.weekday} · ${day.prescriptions.length} حرکت`} description={day.warmup} action={<Link className="btn primary" href={`/workout/${day.id}`}><Dumbbell /> شروع این جلسه</Link>} />
        <div className="session-summary"><span><Clock3 /> حدود {day.estimatedMinutes} دقیقه</span><span><Dumbbell /> باشگاه کامل</span><span><Play /> آموزش تصویری هر حرکت</span></div>
        <section className="light-panel">
          {day.prescriptions.map((item) => {
            const exercise = find(item.exerciseId);
            return (
              <article className="exercise-row" key={item.id}>
                <div className="split">
                  <div>
                    {exercise ? (
                      <ExerciseDetailsButton exercise={exercise} profile={state.user} className="exercise-title-button">
                        <span><h3>{item.order}. {exercise.nameFa}</h3><small dir="ltr" lang="en">{exercise.nameEn}</small></span><span>دیدن آموزش</span>
                      </ExerciseDetailsButton>
                    ) : <h3>{item.order}. {item.exerciseId}</h3>}
                    <p className="muted-dark">{exercise?.instructions.join(" ")}</p>
                  </div>
                  <span className="tag">{item.sets} ست</span>
                </div>
                <p>{item.reps[0]} تا {item.reps[1]} تکرار، {item.rir} RIR، استراحت {item.restSeconds} ثانیه</p>
                <details>
                  <summary>مبنای علمی و خطاهای رایج</summary>
                  <p className="muted-dark">{exercise?.evidenceNotes}</p>
                  <p className="muted-dark">{exercise?.commonMistakes.join("، ")}</p>
                </details>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
