import { describe, expect, it } from "vitest";
import { calculateReadiness } from "@/domain/adaptation";

describe("weekly adaptation", () => {
  it("reduces volume for poor recovery", () => {
    expect(calculateReadiness({ sleepQuality: 1, energy: 1, performance: 2, difficulty: 5, adherence: 2 }).volumeModifier).toBe(-1);
  });

  it("allows progression for high readiness", () => {
    expect(calculateReadiness({ sleepQuality: 5, energy: 5, performance: 5, difficulty: 2, adherence: 5 }).volumeModifier).toBe(1);
  });
});
