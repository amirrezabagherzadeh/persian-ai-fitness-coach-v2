import type { ExercisePrescription, WorkoutSet } from "@/domain/types";

export type ProgressionDecision = {
  action: "increase_load" | "repeat" | "reduce_load";
  message: string;
  suggestedPercentChange: number;
};

export function evaluateProgression(prescription: ExercisePrescription, sets: WorkoutSet[]): ProgressionDecision {
  const completed = sets.filter((set) => set.prescriptionId === prescription.id && set.completed);
  if (completed.length < prescription.sets) {
    return { action: "repeat", message: "همه ست‌ها کامل نشده‌اند؛ جلسه بعد همین نسخه را تکرار کن.", suggestedPercentChange: 0 };
  }
  const hitTopReps = completed.every((set) => set.reps >= prescription.reps[1]);
  const rirOk = completed.every((set) => set.rir >= prescription.rir && set.rir <= prescription.rir + 1);
  const underRecovered = completed.some((set) => set.rir <= 0 || set.reps < prescription.reps[0]);
  if (hitTopReps && rirOk) {
    return { action: "increase_load", message: "تکرارهای بالای بازه با شدت هدف کامل شده؛ جلسه بعد کمی وزنه را افزایش بده.", suggestedPercentChange: 2.5 };
  }
  if (underRecovered) {
    return { action: "reduce_load", message: "شدت برای امروز بالا بوده؛ جلسه بعد وزنه یا ست را محافظه‌کارانه‌تر انتخاب کن.", suggestedPercentChange: -5 };
  }
  return { action: "repeat", message: "در بازه مناسب هستی؛ فعلاً همین نسخه را تثبیت کن.", suggestedPercentChange: 0 };
}
