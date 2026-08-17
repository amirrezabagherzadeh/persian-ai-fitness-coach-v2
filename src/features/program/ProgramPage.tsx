"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ExerciseDetailsButton } from "@/components/ExerciseDetailsButton";
import { useAppStore } from "@/store/app-store";
import { exercises } from "@/data/exercises";

export function ProgramPage() {
  const { state } = useAppStore();
  const find = (id: string) => exercises.find((item) => item.id === id);
  return (
    <AppShell>
      <div className="page">
        <PageHeader eyebrow={`نسخه ${state.program.version}`} title="برنامه تمرین" description={`ساختار فعلی: ${state.program.split}${state.program.methodologyTitle ? ` | سبک مربی: ${state.program.methodologyTitle}` : ""}`} />
        <section className="panel">
          <h2>چرا این پیشنهاد؟</h2>
          {state.program.rationale.map((line) => <p className="muted" key={line}>{line}</p>)}
        </section>
        <div className="mt-4 grid grid-2">
          {state.program.days.map((day) => (
            <article className="light-panel" key={day.id}>
              <div className="split">
                <div>
                  <span className="tag">{day.weekday}</span>
                  <h2>{day.title}</h2>
                </div>
                <Link className="btn dark" href={`/program/day/${day.id}`}>باز کردن</Link>
              </div>
              {day.prescriptions.slice(0, 5).map((item) => {
                const exercise = find(item.exerciseId);
                return exercise ? (
                <ExerciseDetailsButton exercise={exercise} className="exercise-row exercise-row-button" key={item.id}>
                  <div className="split">
                    <span className="exercise-row-name"><Play size={16} aria-hidden="true" /><strong>{exercise.nameFa}</strong></span>
                    <span>{item.sets} × {item.reps[0]}-{item.reps[1]} @ {item.rir} RIR</span>
                  </div>
                </ExerciseDetailsButton>
                ) : null;
              })}
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
