"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RestTimer } from "@/components/RestTimer";
import { ExerciseDetailsButton } from "@/components/ExerciseDetailsButton";
import { useAppStore } from "@/store/app-store";
import { exercises } from "@/data/exercises";
import type { WorkoutSet } from "@/domain/types";
import { evaluateProgression } from "@/domain/progression";

export function ActiveWorkoutPage({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { state, addWorkout } = useAppStore();
  const day = state.program.days.find((item) => item.id === sessionId) ?? state.program.days[0];
  const [sets, setSets] = useState<WorkoutSet[]>(() => day.prescriptions.flatMap((p) => Array.from({ length: p.sets }, (_, index) => ({ prescriptionId: p.id, setNumber: index + 1, weightKg: 0, reps: p.reps[0], rir: p.rir, completed: false }))));
  const [restSeconds, setRestSeconds] = useState(0);
  const totalCompleted = sets.filter((set) => set.completed).length;
  const totalVolume = sets.reduce((sum, set) => sum + (set.completed ? set.weightKg * set.reps : 0), 0);
  const prescriptions = useMemo(() => day.prescriptions, [day]);
  const updateSet = (target: WorkoutSet, patch: Partial<WorkoutSet>) => setSets((current) => current.map((set) => set.prescriptionId === target.prescriptionId && set.setNumber === target.setNumber ? { ...set, ...patch } : set));
  return (
    <AppShell>
      <div className="page">
        <PageHeader eyebrow="حالت تمرین" title={day.title} description={`ست‌های کامل‌شده: ${totalCompleted} از ${sets.length}`} />
        <div className="grid">
          {prescriptions.map((p, index) => {
            const exercise = exercises.find((item) => item.id === p.exerciseId);
            const decision = evaluateProgression(p, sets);
            return (
              <section className="light-panel" key={p.id}>
                <div className="split">
                  <div>
                    <span className="tag">حرکت {index + 1} از {prescriptions.length}</span>
                    {exercise ? (
                      <ExerciseDetailsButton exercise={exercise} className="exercise-title-button">
                        <h2>{exercise.nameFa}</h2><span>دیدن اجرا</span>
                      </ExerciseDetailsButton>
                    ) : <h2>{p.exerciseId}</h2>}
                  </div>
                  <span>{p.reps[0]}-{p.reps[1]} @ {p.rir} RIR</span>
                </div>
                <div className="grid">
                  {sets.filter((set) => set.prescriptionId === p.id).map((set) => (
                    <div className="grid grid-3" key={`${set.prescriptionId}-${set.setNumber}`}>
                      <label className="field">ست {set.setNumber}<input className="input" type="number" value={set.weightKg} onChange={(e) => updateSet(set, { weightKg: Number(e.target.value) })} /></label>
                      <label className="field">تکرار<input className="input" type="number" value={set.reps} onChange={(e) => updateSet(set, { reps: Number(e.target.value) })} /></label>
                      <label className="field">RIR<input className="input" type="number" value={set.rir} onChange={(e) => updateSet(set, { rir: Number(e.target.value) })} /></label>
                      <button className={`btn ${set.completed ? "dark" : "ghost"}`} onClick={() => { updateSet(set, { completed: !set.completed }); setRestSeconds(p.restSeconds); }}>
                        {set.completed ? "کامل شد" : "ثبت ست"}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="muted-dark">{decision.message}</p>
              </section>
            );
          })}
          <section className="panel">
            <div className="split">
              <h2>استراحت</h2>
              {restSeconds > 0 ? <RestTimer seconds={restSeconds} /> : <span className="muted">بعد از ثبت ست شروع می‌شود</span>}
            </div>
            <p className="muted">حجم تمرین ثبت‌شده: {Math.round(totalVolume)} کیلوگرم-تکرار</p>
            <button className="btn primary" onClick={() => { addWorkout({ id: `session-${Date.now()}`, dayId: day.id, startedAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date().toISOString(), sets }); router.push("/progress"); }}>
              پایان تمرین
            </button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
