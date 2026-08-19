import type { Equipment, Exercise, TrainingDay, UserProfile } from "@/domain/types";

const genericEquipment = new Set<Equipment>(["commercial_gym"]);

function specificEquipment(exercise: Exercise) {
  return exercise.equipment.filter((item) => !genericEquipment.has(item));
}

export function isExerciseAvailable(exercise: Exercise, profile: UserProfile) {
  const available = new Set(profile.equipment);
  if (exercise.equipment.includes("bodyweight")) return true;
  if (available.has("commercial_gym") && exercise.equipment.includes("commercial_gym")) return true;
  return specificEquipment(exercise).some((item) => available.has(item));
}

export function createShortWorkout(day: TrainingDay, minutes = 30): TrainingDay {
  const exerciseLimit = Math.max(2, Math.min(3, Math.floor(minutes / 10)));
  return {
    ...day,
    title: `${day.title} · نسخه کوتاه`,
    estimatedMinutes: minutes,
    prescriptions: day.prescriptions.slice(0, exerciseLimit).map((item) => ({ ...item, sets: Math.min(2, item.sets) })),
  };
}

export function findExerciseAlternatives(current: Exercise, profile: UserProfile, source: Exercise[]): Exercise[] {
  const unavailableFlags = new Set([...profile.injuries, ...profile.medicalFlags]);
  const declaredOrder = new Map(current.substitutions.map((id, index) => [id, index]));
  const currentMuscles = new Set(current.primaryMuscles);
  const currentEquipment = new Set(specificEquipment(current));

  const score = (candidate: Exercise) => {
    const declaredIndex = declaredOrder.get(candidate.id);
    const sharedPrimaryMuscles = candidate.primaryMuscles.filter((muscle) => currentMuscles.has(muscle)).length;
    const sharedEquipment = specificEquipment(candidate).filter((item) => currentEquipment.has(item)).length;
    return (declaredIndex === undefined ? 0 : 100 - declaredIndex * 5)
      + sharedPrimaryMuscles * 25
      + sharedEquipment * 4
      + (candidate.kind === current.kind ? 3 : 0)
      - Math.abs(candidate.skillRequirement - current.skillRequirement)
      - Math.abs(candidate.fatigueCost - current.fatigueCost);
  };

  return source
    .filter((candidate) => {
      const safe = candidate.contraindications.every((flag) => !unavailableFlags.has(flag));
      const suitable = candidate.difficulty.includes(profile.experience) || profile.experience === "advanced";
      return candidate.active
        && candidate.id !== current.id
        && candidate.movementPattern === current.movementPattern
        && safe
        && suitable
        && isExerciseAvailable(candidate, profile);
    })
    .toSorted((a, b) => score(b) - score(a));
}
