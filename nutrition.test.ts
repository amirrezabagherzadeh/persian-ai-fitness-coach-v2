import { describe, expect, it } from "vitest";
import { demoProfile } from "@/data/demo";
import { calculateNutritionTarget, mifflinStJeor } from "@/domain/nutrition";

describe("nutrition engine", () => {
  it("calculates Mifflin-St Jeor BMR", () => {
    expect(Math.round(mifflinStJeor(82, 178, 27, "male"))).toBe(1803);
  });

  it("creates conservative macro targets", () => {
    const target = calculateNutritionTarget(demoProfile);
    expect(target.calories).toBeGreaterThan(2200);
    expect(target.proteinG).toBeGreaterThanOrEqual(Math.round(demoProfile.weightKg * 1.6));
    expect(target.fatG).toBeGreaterThanOrEqual(Math.round(demoProfile.weightKg * 0.6));
    expect(target.carbsG).toBeGreaterThan(80);
  });
});
