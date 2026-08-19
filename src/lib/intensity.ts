import { nf } from "@/lib/format";

export type IntensityGuidance = {
  label: string;
  description: string;
};

export function intensityGuidance(remainingReps: number): IntensityGuidance {
  if (remainingReps <= 1) {
    return {
      label: "شدت پیشنهادی: سخت",
      description: "وزنه‌ای انتخاب کن که در پایان ست حس کنی فقط حدود ۱ تکرار دیگر با فرم درست می‌توانستی انجام بدهی.",
    };
  }

  if (remainingReps >= 3) {
    return {
      label: "شدت پیشنهادی: متوسط",
      description: `وزنه‌ای انتخاب کن که در پایان ست حس کنی حدود ${nf(remainingReps)} تکرار دیگر هم می‌توانستی انجام بدهی.`,
    };
  }

  return {
    label: "شدت پیشنهادی: متوسط رو به سخت",
    description: "وزنه‌ای انتخاب کن که در پایان ست احساس کنی حدود ۲ تکرار دیگر هم می‌توانستی انجام بدهی.",
  };
}
