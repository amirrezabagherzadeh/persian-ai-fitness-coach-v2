import { describe, expect, it } from "vitest";
import { intensityGuidance } from "@/lib/intensity";

describe("intensityGuidance", () => {
  it("explains the target in plain language for beginners", () => {
    expect(intensityGuidance(2)).toMatchObject({
      label: "شدت پیشنهادی: متوسط رو به سخت",
      description: "وزنه‌ای انتخاب کن که در پایان ست احساس کنی حدود ۲ تکرار دیگر هم می‌توانستی انجام بدهی.",
    });
  });

  it("uses the same plain Persian guidance for experienced trainees", () => {
    expect(intensityGuidance(2)).toMatchObject({ label: "شدت پیشنهادی: متوسط رو به سخت" });
  });
});
