export type ExerciseMedia = {
  frames: [string, string];
  video?: string;
};

const exerciseVideos: Partial<Record<string, string>> = {
  "bench-press": "https://ymove.app/api/free/dd7e706c-2086-4f4b-867f-d7fece2f720d",
  "lat-pulldown": "https://ymove.app/api/free/9302ad5d-b97a-4b27-afae-611b6ce70a06",
  "seated-row": "https://ymove.app/api/free/499ccaa4-719d-40bd-b441-511291482471",
  squat: "https://ymove.app/api/free/fd0eaa34-d14b-4421-b41c-1669f93253b3",
  "lateral-raise": "https://ymove.app/api/free/a16f0235-20eb-4306-b9cc-c01ae51b3b9b",
  "triceps-pushdown": "https://ymove.app/api/free/9a550e2c-c55e-495d-b59e-b676c3d48a41",
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
      ...(exerciseVideos[id] ? { video: exerciseVideos[id] } : {}),
    },
  ]),
);
