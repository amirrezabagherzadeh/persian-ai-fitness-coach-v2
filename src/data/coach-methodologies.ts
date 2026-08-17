import type { CoachMethodology } from "@/domain/types";

export const demoCoachMethodology: CoachMethodology = {
  id: "method-demo-hypertrophy",
  coachName: "Coach Demo",
  title: "Hypertrophy Upper/Lower With Technical Progression",
  audience: "Intermediate gym users with 3-5 training days",
  rawMethod: "Use upper lower when the user has at least 4 days. Moderate to high volume, mostly free weights for compounds, machines for accessories, double progression, avoid aggressive failure for beginners, include recovery and deload when performance drops.",
  wantsAiReview: true,
  aiReviewStatus: "reviewed",
  aiReviewSummary: "Demo reviewed methodology. It is structured into split, volume, intensity, progression and exercise-selection rules.",
  reviewFindings: [
    "Split preference: upper/lower when schedule allows.",
    "Volume bias: high for intermediate users, still bounded by safety guardrails.",
    "Progression: double progression with technical quality before load increases.",
  ],
  normalizedRules: {
    preferredSplit: "upper_lower",
    volumeBias: "high",
    intensityStyle: "moderate_rir",
    progressionStyle: "double_progression",
    exerciseBias: "free_weights",
    weeklySetTarget: 16,
  },
  approved: true,
  active: true,
  createdAt: "2026-08-15T00:00:00.000Z",
  updatedAt: "2026-08-15T00:00:00.000Z",
};
