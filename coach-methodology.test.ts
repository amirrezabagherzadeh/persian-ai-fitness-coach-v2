import { describe, expect, it } from "vitest";
import { createCoachMethodology, normalizeCoachMethodology } from "@/domain/coach-methodology";

describe("coach methodology", () => {
  it("normalizes a coach method into structured rules", () => {
    const rules = normalizeCoachMethodology("Upper lower, high volume, free weights, double progression, avoid failure.");
    expect(rules.preferredSplit).toBe("upper_lower");
    expect(rules.volumeBias).toBe("high");
    expect(rules.exerciseBias).toBe("free_weights");
  });

  it("can save with AI review and require approval/activation separately", () => {
    const methodology = createCoachMethodology({
      coachName: "Coach",
      title: "PPL Method",
      audience: "Advanced",
      rawMethod: "Push pull legs, high volume, train close to failure, add recovery.",
      wantsAiReview: true,
    });
    expect(methodology.aiReviewStatus).toBe("reviewed");
    expect(methodology.approved).toBe(false);
    expect(methodology.reviewFindings.length).toBeGreaterThan(0);
  });
});
