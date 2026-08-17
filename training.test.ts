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

  it("generates prescribed training days", () => {
    const program = generateTrainingProgram(demoProfile);
    expect(program.days).toHaveLength(4);
    expect(program.days[0].prescriptions.length).toBeGreaterThan(2);
  });

  it("applies an approved active coach methodology", () => {
    const program = generateTrainingProgram(demoProfile, demoCoachMethodology);
    expect(program.methodologyId).toBe(demoCoachMethodology.id);
    expect(program.split).toContain("Coach");
    expect(program.days[0].prescriptions[0].notes).toContain(demoCoachMethodology.title);
  });
});
