import { clamp } from "@/lib/format";
import type { ActivityLevel, Goal, NutritionTarget, Sex, UserProfile } from "@/domain/types";

export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  very_high: 1.9,
};

export function mifflinStJeor(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const sexConstant = sex === "male" ? 5 : -161;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant;
}

export function goalCalorieAdjustment(goal: Goal, tdee: number): number {
  if (goal === "fat_loss") return -clamp(tdee * 0.18, 250, 550);
  if (goal === "muscle_gain") return clamp(tdee * 0.08, 150, 350);
  if (goal === "recomposition") return -clamp(tdee * 0.06, 100, 250);
  if (goal === "strength") return clamp(tdee * 0.04, 0, 200);
  return 0;
}

export function calculateNutritionTarget(profile: UserProfile): NutritionTarget {
  const bmr = mifflinStJeor(profile.weightKg, profile.heightCm, profile.age, profile.sex);
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  const calories = Math.round(tdee + goalCalorieAdjustment(profile.goal, tdee));
  const proteinFactor = profile.goal === "fat_loss" || profile.goal === "recomposition" ? 2 : 1.8;
  const proteinG = Math.round(clamp(profile.weightKg * proteinFactor, profile.weightKg * 1.6, profile.weightKg * 2.2));
  const fatG = Math.round(clamp(profile.weightKg * 0.75, profile.weightKg * 0.6, profile.weightKg * 1));
  const proteinCalories = proteinG * 4;
  const fatCalories = fatG * 9;
  const carbsG = Math.max(80, Math.round((calories - proteinCalories - fatCalories) / 4));

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    explanation: [
      "BMR با فرمول Mifflin-St Jeor محاسبه شده است.",
      "TDEE با سطح فعالیت روزانه تنظیم شده است.",
      "کسری یا مازاد کالری با سقف محافظه‌کارانه اعمال شده است.",
      "پروتئین بر اساس وزن بدن و هدف فعلی تعیین شده است.",
    ],
  };
}
