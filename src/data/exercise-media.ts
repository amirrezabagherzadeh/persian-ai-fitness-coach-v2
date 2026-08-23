import { exercises } from "@/data/exercises";

export type ExerciseMedia = {
  frames?: [string, string];
  video?: string;
  videoOrientation?: "square" | "portrait" | "landscape";
  animation?: string;
  animationOrientation?: "square" | "portrait" | "landscape";
};

const exerciseVideos: Partial<Record<string, string>> = {
  "bench-press": "https://ymove.app/api/free/dd7e706c-2086-4f4b-867f-d7fece2f720d",
  "lat-pulldown": "https://ymove.app/api/free/9302ad5d-b97a-4b27-afae-611b6ce70a06",
  "seated-row": "https://ymove.app/api/free/499ccaa4-719d-40bd-b441-511291482471",
  squat: "https://ymove.app/api/free/fd0eaa34-d14b-4421-b41c-1669f93253b3",
  "lateral-raise": "https://ymove.app/api/free/a16f0235-20eb-4306-b9cc-c01ae51b3b9b",
  "triceps-pushdown": "https://ymove.app/api/free/9a550e2c-c55e-495d-b59e-b676c3d48a41",
};

const exerciseAnimations: Record<string, string> = {
  "bench-press": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif",
  "dumbbell-press": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-bench-press.gif",
  "lat-pulldown": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-lat-pulldown-full-range-of-motion.gif",
  "seated-row": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/cable-seated-row.gif",
  squat: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-full-squat.gif",
  "leg-press": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/sled-45-leg-press.gif",
  "romanian-deadlift": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-romanian-deadlift.gif",
  "shoulder-press": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-seated-shoulder-press.gif",
  "lateral-raise": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-lateral-raise.gif",
  "biceps-curl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-biceps-curl.gif",
  "triceps-pushdown": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/cable-pushdown.gif",
  plank: "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/weighted-front-plank.gif",
  "machine-chest-press": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/lever-chest-press.gif",
  "push-up": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/push-up.gif",
  "pull-up": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/pull-up.gif",
  "band-pulldown": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/band-close-grip-pulldown.gif",
  "one-arm-dumbbell-row": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/dumbbell-one-arm-bent-over-row.gif",
  "band-row": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/resistance-band-seated-straight-back-row.gif",
  "goblet-squat": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/dumbbell-goblet-squat.gif",
  "hip-thrust": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge-two-legs-on-bench-male.gif",
  "leg-curl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/lever-lying-leg-curl.gif",
  "machine-shoulder-press": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/lever-shoulder-press.gif",
  "machine-lateral-raise": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/lever-lateral-raise.gif",
  "cable-curl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/cable-curl.gif",
  "band-pushdown": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/band-side-triceps-extension.gif",
  "dumbbell-triceps-extension": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/dumbbell-standing-triceps-extension.gif",
  "assisted-pull-up": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/assisted-pull-up.gif",
  "inverted-row": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/inverted-row.gif",
  "bodyweight-squat": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/squat-to-overhead-reach.gif",
  "split-squat": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/split-squats.gif",
  "walking-lunge": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/walking-lunge.gif",
  "glute-bridge": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/low-glute-bridge-on-floor.gif",
  "pike-push-up": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/pike-to-cobra-push-up.gif",
  "chest-dip": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/chest-dip.gif",
  "diamond-push-up": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/diamond-push-up.gif",
  "bench-dip": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/bench-dip-knees-bent.gif",
  "dead-bug": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/dead-bug.gif",
};

export const exerciseMedia: Record<string, ExerciseMedia> = Object.fromEntries(
  exercises.map(({ id }) => {
    const hasFrames = ["bench-press", "dumbbell-press", "lat-pulldown", "seated-row", "squat", "leg-press", "romanian-deadlift", "shoulder-press", "lateral-raise", "biceps-curl", "triceps-pushdown", "plank"].includes(id);
    return [
      id,
      {
        ...(hasFrames ? { frames: [`/exercises/${id}-0.jpg`, `/exercises/${id}-1.jpg`] as [string, string] } : {}),
        ...(exerciseVideos[id] ? { video: exerciseVideos[id], videoOrientation: "square" as const } : {}),
        animation: exerciseAnimations[id],
        animationOrientation: "square" as const,
      },
    ];
  }),
);
