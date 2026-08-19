import type { CoachMethodology, CoachMethodologyRules } from "@/domain/types";

const defaultRules: CoachMethodologyRules = {
  preferredSplit: "auto",
  volumeBias: "moderate",
  intensityStyle: "moderate_rir",
  progressionStyle: "double_progression",
  exerciseBias: "balanced",
  weeklySetTarget: 12,
};

function includesAny(text: string, terms: string[]): boolean {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

export function normalizeCoachMethodology(rawMethod: string): CoachMethodologyRules {
  const preferredSplit = includesAny(rawMethod, ["push pull legs", "ppl", "پوش", "پول", "لگ"])
    ? "ppl"
    : includesAny(rawMethod, ["upper lower", "بالاتنه پایین", "بالا پایین"])
      ? "upper_lower"
      : includesAny(rawMethod, ["full body", "کل بدن", "فول بادی"])
        ? "full_body"
        : "auto";

  const volumeBias = includesAny(rawMethod, ["high volume", "حجم بالا", "ست زیاد", "زیاد"])
    ? "high"
    : includesAny(rawMethod, ["low volume", "حجم کم", "کم‌حجم", "مبتدی", "آسیب"])
      ? "low"
      : "moderate";

  const intensityStyle = includesAny(rawMethod, ["failure", "ناتوانی", "تا خستگی کامل"])
    ? "near_failure"
    : includesAny(rawMethod, ["conservative", "محافظه", "مبتدی", "درد"])
      ? "conservative_rir"
      : "moderate_rir";

  const progressionStyle = includesAny(rawMethod, ["linear", "خطی", "هر هفته وزنه"])
    ? "linear_load"
    : includesAny(rawMethod, ["technique", "تکنیک", "فرم"])
      ? "slow_technical"
      : "double_progression";

  const exerciseBias = includesAny(rawMethod, ["machine", "دستگاه"])
    ? "machines"
    : includesAny(rawMethod, ["barbell", "dumbbell", "هالتر", "دمبل", "free weight"])
      ? "free_weights"
      : includesAny(rawMethod, ["bodyweight", "وزن بدن", "کالیستنیک"])
        ? "bodyweight"
        : "balanced";

  const weeklySetTarget = volumeBias === "high" ? 16 : volumeBias === "low" ? 8 : defaultRules.weeklySetTarget;

  return {
    preferredSplit,
    volumeBias,
    intensityStyle,
    progressionStyle,
    exerciseBias,
    weeklySetTarget,
  };
}

export function reviewCoachMethodology(methodology: CoachMethodology): CoachMethodology {
  const rules = normalizeCoachMethodology(methodology.rawMethod);
  const intensityLabel = rules.intensityStyle === "near_failure"
    ? "بسیار سخت"
    : rules.intensityStyle === "conservative_rir"
      ? "محافظه‌کارانه"
      : "متوسط رو به سخت";
  const findings = [
    `ساختار تشخیص‌داده‌شده: ${rules.preferredSplit === "auto" ? "انتخاب خودکار بر اساس کاربر" : rules.preferredSplit}.`,
    `سطح حجم: ${rules.volumeBias}، هدف حدودی ${rules.weeklySetTarget} ست هفتگی برای عضله اصلی.`,
    `سبک شدت: ${intensityLabel}.`,
  ];

  if (rules.intensityStyle === "near_failure") {
    findings.push("هشدار: استفاده مداوم از ناتوانی برای مبتدی‌ها یا کاربران با ریکاوری ضعیف باید محدود شود.");
  }
  if (!includesAny(methodology.rawMethod, ["deload", "ریکاوری", "استراحت", "recovery"])) {
    findings.push("پیشنهاد AI: یک قانون ریکاوری/هفته سبک برای افت عملکرد یا درد مفصل اضافه شود.");
  }
  if (!includesAny(methodology.rawMethod, ["injury", "درد", "آسیب", "contraindication"])) {
    findings.push("پیشنهاد AI: قوانین جایگزینی حرکت برای درد شانه، زانو و کمر روشن‌تر نوشته شود.");
  }

  return {
    ...methodology,
    wantsAiReview: true,
    aiReviewStatus: "reviewed",
    aiReviewSummary: "روش مربی به rules قابل استفاده برای موتور برنامه‌سازی تبدیل شد. موارد پرریسک به عنوان هشدار باقی مانده‌اند و داده تاییدنشده مستقیم جایگزین guardrailهای ایمنی نمی‌شود.",
    reviewFindings: findings,
    normalizedRules: rules,
    updatedAt: new Date().toISOString(),
  };
}

export function createCoachMethodology(input: {
  coachName: string;
  title: string;
  audience: string;
  rawMethod: string;
  wantsAiReview: boolean;
}): CoachMethodology {
  const methodology: CoachMethodology = {
    id: `method-${Date.now()}`,
    coachName: input.coachName,
    title: input.title,
    audience: input.audience,
    rawMethod: input.rawMethod,
    wantsAiReview: input.wantsAiReview,
    aiReviewStatus: "not_requested",
    reviewFindings: [],
    normalizedRules: normalizeCoachMethodology(input.rawMethod),
    approved: !input.wantsAiReview,
    active: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return input.wantsAiReview ? reviewCoachMethodology(methodology) : methodology;
}
