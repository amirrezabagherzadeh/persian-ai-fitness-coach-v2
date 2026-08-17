import type { NutritionTarget, UserProfile } from "@/domain/types";

type CoachContext = {
  profile: Pick<UserProfile, "name" | "goal" | "weightKg" | "daysPerWeek" | "injuries" | "medicalFlags">;
  program: { split: string; rationale: string[] };
  nutrition: NutritionTarget;
};

export class MockAIProvider {
  async answer(question: string, context: CoachContext): Promise<string> {
    const normalized = question.toLowerCase();
    if (context.profile.medicalFlags.length || context.profile.injuries.length) {
      return "با توجه به شرایط ثبت‌شده، تمرین را بدون درد نگه دارید و برای علائم پزشکی یا درد مداوم با متخصص مشورت کنید.";
    }
    if (normalized.includes("تمرین") || normalized.includes("باشگاه")) {
      return `برنامه فعلی شما با تقسیم ${context.program.split} و ${context.profile.daysPerWeek} جلسه در هفته تنظیم شده است. امروز طبق برنامه جلو بروید و ست‌ها را با فرم کنترل‌شده ثبت کنید.`;
    }
    if (normalized.includes("غذا") || normalized.includes("کالری") || normalized.includes("رژیم")) {
      return `هدف روزانه شما حدود ${context.nutrition.calories} کیلوکالری و ${context.nutrition.proteinG} گرم پروتئین است. وعده‌ها را در طول روز پخش کنید و با ثبت غذاها، مجموع را بررسی کنید.`;
    }
    return `${context.profile.name}، روی اجرای پایدار برنامه و ثبت واقع‌بینانه تمرین و تغذیه تمرکز کنید. ${context.program.rationale[0] ?? ""}`;
  }
}
