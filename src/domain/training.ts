import type { CoachMethodology, Exercise, ExercisePrescription, FocusArea, TrainingDay, TrainingProgram, UserProfile } from "@/domain/types";
import { exercises } from "@/data/exercises";
import { nf } from "@/lib/format";

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

const focusMuscles: Record<FocusArea, string[]> = {
  chest: ["chest"],
  back: ["back", "lats", "mid_back", "rear_delts"],
  shoulders: ["shoulders", "front_delts", "side_delts", "rear_delts"],
  arms: ["biceps", "triceps"],
  legs: ["quads", "hamstrings"],
  glutes: ["glutes"],
  core: ["core"],
};

function sortByProfilePreference(pool: Exercise[], profile: UserProfile): Exercise[] {
  const preferredMuscles = new Set(profile.focusAreas.flatMap((area) => focusMuscles[area]));
  const score = (exercise: Exercise) => {
    const focusScore = exercise.primaryMuscles.some((muscle) => preferredMuscles.has(muscle)) ? 4 : 0;
    const styleScore = profile.trainingStyle === "machines"
      ? exercise.equipment.some((item) => item === "machines" || item === "cable") ? 2 : 0
      : profile.trainingStyle === "free_weights"
        ? exercise.equipment.some((item) => item === "barbell" || item === "dumbbells") ? 2 : 0
        : 0;
    const calisthenicsScore = profile.trainingStyle === "calisthenics" && exercise.equipment.includes("bodyweight") ? 12 : 0;
    return focusScore + styleScore + calisthenicsScore;
  };
  return [...pool].sort((a, b) => score(b) - score(a));
}

function pickByPattern(pool: Exercise[], pattern: string, fallback: string, offset = 0): Exercise | undefined {
  const matches = pool.filter((item) => item.movementPattern === pattern);
  if (matches.length > 0) return matches[offset % matches.length];
  const fallbackMatches = pool.filter((item) => item.primaryMuscles.includes(fallback));
  return fallbackMatches[offset % fallbackMatches.length];
}

const muscleTitleGroups = [
  { label: "سینه", muscles: new Set(["chest"]) },
  { label: "پشت و زیربغل", muscles: new Set(["back", "lats", "mid_back", "rear_delts"]) },
  { label: "سرشانه", muscles: new Set(["shoulders", "front_delts", "side_delts"]) },
  { label: "بازو", muscles: new Set(["biceps", "triceps"]) },
  { label: "پا", muscles: new Set(["quads", "hamstrings"]) },
  { label: "عضلات سرینی", muscles: new Set(["glutes"]) },
  { label: "میان‌تنه", muscles: new Set(["core"]) },
];

function joinFa(items: string[]) {
  if (items.length <= 1) return items[0] ?? "تمرین کامل بدن";
  return `${items.slice(0, -1).join("، ")} و ${items.at(-1)}`;
}

export function trainingDayTitle(dayExercises: Exercise[]) {
  const primaryMuscles = new Set(dayExercises.flatMap((exercise) => exercise.primaryMuscles));
  const labels = muscleTitleGroups
    .filter((group) => [...group.muscles].some((muscle) => primaryMuscles.has(muscle)))
    .map((group) => group.label);
  const hasUpperBody = labels.some((label) => ["سینه", "پشت و زیربغل", "سرشانه", "بازو"].includes(label));
  const hasLowerBody = labels.some((label) => ["پا", "عضلات سرینی"].includes(label));
  if (hasUpperBody && hasLowerBody && labels.length >= 4) return "تمرین کامل بدن";
  return joinFa(labels);
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
  const pool = sortByProfilePreference(sortByMethodologyBias(filterExercises(profile), methodology), profile);
  const split = chooseSplitForMethodology(profile.daysPerWeek, profile.experience, methodology);
  const dayCount = Math.min(6, Math.max(2, profile.daysPerWeek));
  const exerciseLimit = profile.sessionMinutes <= 45 ? 4 : profile.sessionMinutes <= 60 ? 5 : 6;
  const compact = (items: Array<Exercise | undefined>) => items.filter((item): item is Exercise => Boolean(item));
  const selectionPool = profile.trainingStyle === "calisthenics" ? pool.filter((exercise) => exercise.equipment.includes("bodyweight")) : pool;
  const pick = (pattern: string, fallback: string, offset = 0) => pickByPattern(selectionPool, pattern, fallback, offset);
  const days: TrainingDay[] = Array.from({ length: dayCount }, (_, index) => {
    const variant = Math.floor(index / 2) % 2;
    const upper = compact([
      pick("horizontal_push", "chest", variant),
      pick("horizontal_pull", "mid_back", variant),
      pick("vertical_pull", "lats", variant),
      pick("vertical_push", "shoulders", variant),
      profile.trainingStyle === "calisthenics" ? pick("horizontal_push", "triceps", variant + 1) : pick("shoulder_abduction", "side_delts", variant),
      profile.trainingStyle === "calisthenics" ? pick("vertical_pull", "lats", variant + 1) : pick("elbow_flexion", "biceps", variant),
      profile.trainingStyle === "calisthenics" ? pick("horizontal_push", "triceps", variant + 2) : pick("elbow_extension", "triceps", variant),
    ]);
    const lower = compact([
      pick("squat", "quads", variant),
      pick("hinge", "hamstrings", variant),
      pick("squat", "glutes", variant + 1),
      pick("core_anti_extension", "core", variant),
    ]);
    const full = compact([
      pick("squat", "quads", index),
      pick("horizontal_push", "chest", index),
      pick("horizontal_pull", "mid_back", index),
      pick("hinge", "hamstrings", index),
      pick("vertical_pull", "lats", index),
      pick("core_anti_extension", "core", index),
    ]);
    const template = split.includes("Upper / Lower") ? (index % 2 === 0 ? upper : lower) : split.includes("Push") ? (index % 3 === 0 ? upper.slice(0, 5) : index % 3 === 1 ? compact([upper[1], upper[2], upper[5], lower[1]]) : lower) : full;
    const unique = [...new Map(template.map((exercise) => [exercise.id, exercise])).values()].slice(0, exerciseLimit);
    return {
      id: `day-${index + 1}`,
      title: trainingDayTitle(unique),
      weekday: `جلسه ${nf(index + 1)}`,
      focus: split,
      warmup: "۵ تا ۸ دقیقه هوازی سبک، سپس دو ست گرم‌کردنی برای حرکت اول.",
      estimatedMinutes: profile.sessionMinutes,
      prescriptions: unique.map((exercise, order) => prescription(exercise, order, profile, methodology)),
    };
  });

  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + 27);

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
      `این ساختار انتخاب شده چون شما ${nf(profile.daysPerWeek)} روز در هفته زمان تمرین دارید.`,
      "حرکات با توجه به تجهیزات، سابقه و موارد احتیاطی فیلتر شده‌اند.",
      "افزایش وزنه فقط وقتی پیشنهاد می‌شود که تکرارهای هدف با شدت مناسب کامل شوند.",
      methodology?.approved && methodology.active ? `روش فعال مربی (${methodology.title}) روی split، حجم، شدت و اولویت انتخاب حرکت اعمال شده است.` : "روش اختصاصی مربی فعالی انتخاب نشده؛ موتور از قوانین پیش‌فرض استفاده کرده است.",
    ],
    durationWeeks: 4,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    safetyNotice: pool.length === 0
      ? "برای محدودیت‌های ثبت‌شده حرکت ایمن کافی پیدا نشد؛ برنامه باید توسط مربی بررسی شود."
      : profile.medicalFlags.length > 0
        ? "به دلیل محدودیت پزشکی ثبت‌شده، قبل از شروع این برنامه آن را با مربی باشگاه یا متخصص مربوطه بررسی کن."
        : undefined,
    createdAt: new Date().toISOString(),
  };
}
