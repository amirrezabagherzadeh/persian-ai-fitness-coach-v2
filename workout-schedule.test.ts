import { describe, expect, it } from "vitest";
import { demoProfile } from "@/data/demo";
import { generateTrainingProgram } from "@/domain/training";
import { applyWorkoutDays, workoutReminders } from "@/domain/workout-schedule";

describe("post-program workout scheduling", () => {
  const program = generateTrainingProgram({ ...demoProfile, daysPerWeek: 3 });
  const days = ["شنبه", "دوشنبه", "چهارشنبه"];

  it("assigns selected weekdays without regenerating the training plan", () => {
    const scheduled = applyWorkoutDays(program, days);
    expect(scheduled.days.map((day) => day.weekday)).toEqual(days);
    expect(scheduled.days.map((day) => day.prescriptions)).toEqual(program.days.map((day) => day.prescriptions));
  });

  it("uses preferred time only to create workout reminders", () => {
    const reminders = workoutReminders(program, days, "18:30");
    expect(reminders).toHaveLength(3);
    expect(reminders.map((reminder) => [reminder.day, reminder.time])).toEqual(days.map((day) => [day, "18:30"]));
  });
});
