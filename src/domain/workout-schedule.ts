import type { Reminder, TrainingProgram } from "@/domain/types";
import { nf } from "@/lib/format";

export function applyWorkoutDays(program: TrainingProgram, days: string[]): TrainingProgram {
  return {
    ...program,
    days: program.days.map((day, index) => ({ ...day, weekday: days[index] ?? `جلسه ${nf(index + 1)}` })),
  };
}

export function workoutReminders(program: TrainingProgram, days: string[], time?: string): Reminder[] {
  if (!time) return [];

  return program.days.flatMap((day, index) => {
    const weekday = days[index];
    return weekday
      ? [{ id: `workout-${day.id}`, type: "workout" as const, title: day.title, day: weekday, time, active: true }]
      : [];
  });
}
