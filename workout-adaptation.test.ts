import { describe, expect, it } from "vitest";
import { demoProfile, demoProgram } from "@/data/demo";
import { exercises } from "@/data/exercises";
import { createShortWorkout, findExerciseAlternatives } from "@/domain/workout-adaptation";

describe("workout adaptation", () => {
  it("creates a real 30-minute version with fewer exercises and sets", () => {
    const original = demoProgram.days[0];
    const shortened = createShortWorkout(original);
    expect(shortened.estimatedMinutes).toBe(30);
    expect(shortened.prescriptions.length).toBeLessThan(original.prescriptions.length);
    expect(shortened.prescriptions.every((item) => item.sets <= 2)).toBe(true);
  });

  it("finds a safe replacement with the same movement pattern", () => {
    const benchPress = exercises.find((exercise) => exercise.id === "bench-press")!;
    const alternatives = findExerciseAlternatives(benchPress, demoProfile, exercises);
    expect(alternatives[0]?.id).toBe("dumbbell-press");
    expect(alternatives.every((exercise) => exercise.movementPattern === benchPress.movementPattern)).toBe(true);
  });

  it("only suggests replacements supported by the user's equipment", () => {
    const benchPress = exercises.find((exercise) => exercise.id === "bench-press")!;
    const homeProfile = { ...demoProfile, equipment: ["dumbbells", "bench"] as typeof demoProfile.equipment };
    const alternatives = findExerciseAlternatives(benchPress, homeProfile, exercises);
    expect(alternatives.map((exercise) => exercise.id)).toContain("dumbbell-press");
    expect(alternatives.map((exercise) => exercise.id)).not.toContain("machine-chest-press");
  });

  it("does not suggest an exercise that conflicts with a recorded limitation", () => {
    const plank = exercises.find((exercise) => exercise.id === "plank")!;
    const profileWithBackPain = { ...demoProfile, injuries: ["back_pain"] as typeof demoProfile.injuries };
    const alternatives = findExerciseAlternatives(plank, profileWithBackPain, exercises);
    expect(alternatives[0]?.id).toBe("dead-bug");
    expect(alternatives.every((exercise) => !exercise.contraindications.includes("back_pain"))).toBe(true);
  });

  it("has at least one usable alternative for every core workout movement", () => {
    const coreExerciseIds = exercises.slice(0, 12).map((exercise) => exercise.id);
    expect(coreExerciseIds.every((id) => {
      const current = exercises.find((exercise) => exercise.id === id)!;
      return findExerciseAlternatives(current, demoProfile, exercises).length > 0;
    })).toBe(true);
  });
});
