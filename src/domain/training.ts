import type { CoachMethodology, Exercise, ExercisePrescription, TrainingDay, TrainingProgram, UserProfile } from "@/domain/types";
import { exercises } from "@/data/exercises";

const weekdayFa = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];

export function chooseSplit(daysPerWeek: number, experience: UserProfile["experience"]): string {
  if (daysPerWeek <= 2) return "Full Body A/B";
  if (daysPerWeek === 3) return experience === "advanced" ? "Upper / Lower / Full" : "Full Body";
  if (daysPerWeek === 4) return "Upper / Lower";
  return "Push / Pull / Legs";
}

function chooseSplitForMethodology(daysPerWeek: number, experience: UserProfile["experience"], methodology?: CoachMethodology): string {
  if (!methodology?.approved || !methodology.active || methodology.normalizedRules.preferredSplit === "auto") {
    return chooseSplit(daysPerWeek, experience);
  }
  if (methodology.normalizedRules.preferredSplit === "full_body") return daysPerWeek <= 4 ? "Coach Full Body" : "Coach Full Body Rotation";
  if (methodology.normalizedRules.preferredSplit === "upper_lower") return daysPerWeek >= 3 ? "Coach Upper / Lower" : "Coach Full Body A/B";
  if (methodology.normalizedRules.preferredSplit === "ppl") return daysPerWeek >= 5 ? "Coach Push / Pull / Legs" : chooseSplit(daysPerWeek, experience);
  return chooseSplit(daysPerWeek, experience);
}

export function filterExercises(profile: UserProfile, source: Exercise[] = exercises): Exercise[] {
  const equipment = new Set(profile.equipment);
  const contraindications = new Set([...profile.injuries, ...profile.medicalFlags]);
  return source.filter((exercise) => {
    const hasEquipment = exercise.equipment.some((item) => equipment.has(item) || item === "bodyweight" || equipment.has("commercial_gym"));
    const matchesLevel = exercise.difficulty.includes(profile.experience) || profile.experience === "advanced";
    const safe = exercise.contraindications.every((flag) => !contraindications.has(flag));
    return exercise.active && hasEquipment && matchesLevel && safe;
  });
}

function sortByMethodologyBias(pool: Exercise[], methodology?: CoachMethodology): Exercise[] {
  if (!methodology?.approved || !methodology.active) return pool;
  const bias = methodology.normalizedRules.exerciseBias;
  return [...pool].sort((a, b) => {
    const score = (exercise: Exercise) => {
      if (bias === "machines") return exercise.equipment.includes("machines") || exercise.equipment.includes("cable") ? 1 : 0;
      if (bias === "free_weights") return exercise.equipment.includes("barbell") || exercise.equipment.includes("dumbbells") ? 1 : 0;
      if (bias === "bodyweight") return exercise.equipment.includes("bodyweight") ? 1 : 0;
      return 0;
    };
    return score(b) - score(a);
  });
}

function pickByPattern(pool: Exercise[], pattern: string, fallback: string): Exercise {
  return pool.find((item) => item.movementPattern === pattern) ?? pool.find((item) => item.primaryMuscles.includes(fallback)) ?? pool[0];
}

function prescription(exercise: Exercise, index: number, profile: UserProfile, methodology?: CoachMethodology): ExercisePrescription {
  const baseSets = profile.experience === "never" || profile.experience === "beginner" ? 2 : 3;
  const setBonus = profile.goal === "strength" && exercise.kind === "compound" ? 1 : 0;
  const volumeAdjustment = methodology?.approved && methodology.active
    ? methodology.normalizedRules.volumeBias === "high"
      ? 1
      : methodology.normalizedRules.volumeBias === "low"
        ? -1
        : 0
    : 0;
  const rir = methodology?.approved && methodology.active
    ? methodology.normalizedRules.intensityStyle === "near_failure"
      ? profile.experience === "advanced" ? 0.5 : 1
      : methodology.normalizedRules.intensityStyle === "conservative_rir"
        ? 3
        : profile.experience === "advanced" ? 1 : 2
    : profile.experience === "advanced" ? 1 : 2;
  const methodologyNote = methodology?.approved && methodology.active ? ` سبک مربی: ${methodology.title}.` : "";
  return {
    id: `${exercise.id}-${index}`,
    exerciseId: exercise.id,
    sets: Math.min(5, Math.max(1, baseSets + setBonus + volumeAdjustment)),
    reps: exercise.repRange,
    rir,
    restSeconds: exercise.kind === "compound" ? (methodology?.normalizedRules.progressionStyle === "slow_technical" ? 180 : 150) : 75,
    order: index + 1,
    notes: exercise.kind === "compound" ? `حرکت اصلی؛ کیفیت تکنیک مهم‌تر از افزایش سریع وزنه است.${methodologyNote}` : `کنترل کامل و دامنه بدون درد.${methodologyNote}`,
  };
}

export function generateTrainingProgram(profile: UserProfile, methodology?: CoachMethodology): TrainingProgram {
  const pool = sortByMethodologyBias(filterExercises(profile), methodology);
  const split = chooseSplitForMethodology(profile.daysPerWeek, profile.experience, methodology);
  const dayCount = Math.min(6, Math.max(2, profile.daysPerWeek));
  const days: TrainingDay[] = Array.from({ length: dayCount }, (_, index) => {
    const upper = [
      pickByPattern(pool, "horizontal_push", "chest"),
      pickByPattern(pool, "horizontal_pull", "mid_back"),
      pickByPattern(pool, "vertical_pull", "lats"),
      pickByPattern(pool, "vertical_push", "shoulders"),
      pickByPattern(pool, "elbow_flexion", "biceps"),
      pickByPattern(pool, "elbow_extension", "triceps"),
    ];
    const lower = [
      pickByPattern(pool, "squat", "quads"),
      pickByPattern(pool, "hinge", "hamstrings"),
      pickByPattern(pool, "squat", "glutes"),
      pickByPattern(pool, "core_anti_extension", "core"),
    ];
    const full = [
      pickByPattern(pool, "squat", "quads"),
      pickByPattern(pool, "horizontal_push", "chest"),
      pickByPattern(pool, "horizontal_pull", "mid_back"),
      pickByPattern(pool, "hinge", "hamstrings"),
      pickByPattern(pool, "vertical_pull", "lats"),
      pickByPattern(pool, "core_anti_extension", "core"),
    ];
    const template = split.includes("Upper / Lower") ? (index % 2 === 0 ? upper : lower) : split.includes("Push") ? (index % 3 === 0 ? upper.slice(0, 4) : index % 3 === 1 ? [upper[1], upper[2], upper[4], lower[1]] : lower) : full;
    const unique = [...new Map(template.map((exercise) => [exercise.id, exercise])).values()].slice(0, 6);
    return {
      id: `day-${index + 1}`,
      title: split.includes("Upper / Lower") ? (index % 2 === 0 ? "بالاتنه" : "پایین‌تنه") : `تمرین ${index + 1}`,
      weekday: profile.preferredDays[index] ?? weekdayFa[index],
      focus: split,
      warmup: "۵ تا ۸ دقیقه هوازی سبک، سپس دو ست گرم‌کردنی برای حرکت اول.",
      prescriptions: unique.map((exercise, order) => prescription(exercise, order, profile, methodology)),
    };
  });

  return {
    id: "program-demo",
    userId: profile.id,
    version: 1,
    split,
    goal: profile.goal,
    methodologyId: methodology?.approved && methodology.active ? methodology.id : undefined,
    methodologyTitle: methodology?.approved && methodology.active ? methodology.title : undefined,
    days,
    rationale: [
      `این ساختار انتخاب شده چون شما ${profile.daysPerWeek} روز در هفته زمان تمرین دارید.`,
      "حرکات با توجه به تجهیزات، سابقه و موارد احتیاطی فیلتر شده‌اند.",
      "پیشروی وزنه فقط وقتی پیشنهاد می‌شود که تکرارهای هدف با RIR مناسب کامل شوند.",
      methodology?.approved && methodology.active ? `روش فعال مربی (${methodology.title}) روی split، حجم، شدت و اولویت انتخاب حرکت اعمال شده است.` : "روش اختصاصی مربی فعالی انتخاب نشده؛ موتور از قوانین پیش‌فرض استفاده کرده است.",
    ],
    createdAt: new Date().toISOString(),
  };
}
