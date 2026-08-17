import type { WeeklyCheckIn } from "@/domain/types";

export type Adaptation = {
  readinessScore: number;
  recommendation: string;
  volumeModifier: -1 | 0 | 1;
};

export function calculateReadiness(checkIn: Pick<WeeklyCheckIn, "sleepQuality" | "energy" | "performance" | "difficulty" | "adherence">): Adaptation {
  const score = Math.round((checkIn.sleepQuality + checkIn.energy + checkIn.performance + checkIn.adherence + (6 - checkIn.difficulty)) * 4);
  if (score < 55) {
    return { readinessScore: score, recommendation: "ریکاوری پایین است؛ این هفته حجم تمرین را کمی کاهش بده و افزایش وزنه را متوقف کن.", volumeModifier: -1 };
  }
  if (score > 82) {
    return { readinessScore: score, recommendation: "آمادگی خوب است؛ اگر ست‌ها با فرم مناسب کامل شدند می‌توانی پیشروی تدریجی داشته باشی.", volumeModifier: 1 };
  }
  return { readinessScore: score, recommendation: "وضعیت پایدار است؛ برنامه فعلی را ادامه بده و داده بیشتری جمع کن.", volumeModifier: 0 };
}
