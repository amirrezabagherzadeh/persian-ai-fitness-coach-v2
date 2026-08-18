import { describe, expect, it } from "vitest";
import { demoProfile } from "@/data/demo";
import { demoCoachMethodology } from "@/data/coach-methodologies";
import { chooseSplit, filterExercises, generateTrainingProgram } from "@/domain/training";

describe("training engine", () => {
  it("chooses split by days", () => {
    expect(chooseSplit(2, "beginner")).toBe("Full Body A/B");
    expect(chooseSplit(4, "intermediate")).toBe("Upper / Lower");
  });

  it("filters contraindicated exercises", () => {
    const safe = filterExercises({ ...demoProfile, injuries: ["back_pain"] });
    expect(safe.some((exercise) => exercise.contraindications.includes("back_pain"))).toBe(false);
  });

  it("applies structured arm injury flags", () => {
    const safe = filterExercises({ ...demoProfile, injuries: ["elbow_pain"] });
    expect(safe.some((exercise) => exercise.contraindications.includes("elbow_pain"))).toBe(false);
  });

  it("generates prescribed training days", () => {
    const program = generateTrainingProgram(demoProfile);
    expect(program.days).toHaveLength(4);
    expect(program.days[0].prescriptions.length).toBeGreaterThan(2);
    expect(program.durationWeeks).toBe(4);
    expect(program.days.map((day) => day.weekday)).toEqual(demoProfile.preferredDays);
  });

  it("uses session length to keep short workouts concise", () => {
    const program = generateTrainingProgram({ ...demoProfile, sessionMinutes: 45 });
    expect(program.days.every((day) => day.prescriptions.length <= 4)).toBe(true);
    expect(program.days.every((day) => day.estimatedMinutes === 45)).toBe(true);
  });

  it("prioritizes the selected training style", () => {
    const program = generateTrainingProgram({ ...demoProfile, trainingStyle: "machines", focusAreas: ["back"] });
    const pullingExerciseId = program.days[0].prescriptions[1].exerciseId;
    const pullingExercise = filterExercises(demoProfile).find((exercise) => exercise.id === pullingExerciseId);
    expect(pullingExercise?.equipment.some((item) => item === "machines" || item === "cable")).toBe(true);
  });

  it("applies an approved active coach methodology", () => {
    const program = generateTrainingProgram(demoProfile, demoCoachMethodology);
    expect(program.methodologyId).toBe(demoCoachMethodology.id);
    expect(program.split).toContain("Coach");
    expect(program.days[0].prescriptions[0].notes).toContain(demoCoachMethodology.title);
  });
});
