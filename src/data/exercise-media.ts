export type ExerciseMedia = {
  frames: [string, string];
};

export const exerciseMedia: Record<string, ExerciseMedia> = Object.fromEntries(
  [
    "bench-press",
    "dumbbell-press",
    "lat-pulldown",
    "seated-row",
    "squat",
    "leg-press",
    "romanian-deadlift",
    "shoulder-press",
    "lateral-raise",
    "biceps-curl",
    "triceps-pushdown",
    "plank",
  ].map((id) => [
    id,
    {
      frames: [`/exercises/${id}-0.jpg`, `/exercises/${id}-1.jpg`],
    },
  ]),
);
