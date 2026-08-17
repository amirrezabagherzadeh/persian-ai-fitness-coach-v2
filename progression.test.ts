import { describe, expect, it } from "vitest";
import { evaluateProgression } from "@/domain/progression";
import type { ExercisePrescription, WorkoutSet } from "@/domain/types";

const prescription: ExercisePrescription = {
  id: "p1",
  exerciseId: "bench",
  sets: 3,
  reps: [8, 10],
  rir: 2,
  restSeconds: 150,
  order: 1,
  notes: "",
};

describe("progression", () => {
  it("increases load when top reps and target RIR are met", () => {
    const sets: WorkoutSet[] = [1, 2, 3].map((setNumber) => ({ prescriptionId: "p1", setNumber, weightKg: 80, reps: 10, rir: 2, completed: true }));
    expect(evaluateProgression(prescription, sets).action).toBe("increase_load");
  });

  it("repeats when work is incomplete", () => {
    const sets: WorkoutSet[] = [{ prescriptionId: "p1", setNumber: 1, weightKg: 80, reps: 10, rir: 2, completed: true }];
    expect(evaluateProgression(prescription, sets).action).toBe("repeat");
  });
});
