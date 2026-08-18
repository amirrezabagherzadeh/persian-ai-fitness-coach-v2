import { MuscleMap as AnatomyMuscleMap } from "@musclemap/react";
import type { MuscleGroup, MuscleMapValues } from "@musclemap/core";
import maleFront from "@musclemap/assets/bodies/male-front.webp";
import maleBack from "@musclemap/assets/bodies/male-back.webp";
import femaleFront from "@musclemap/assets/bodies/female-front.webp";
import femaleBack from "@musclemap/assets/bodies/female-back.webp";

const muscleNames: Record<string, string> = {
  back: "پشت", biceps: "جلو بازو", chest: "سینه", core: "میان‌تنه", front_delts: "سرشانه جلویی", glutes: "سرینی",
  hamstrings: "پشت ران", lats: "زیربغل", mid_back: "پشت میانی", quads: "جلوی ران", rear_delts: "سرشانه پشتی",
  shoulders: "سرشانه", side_delts: "سرشانه میانی", triceps: "پشت بازو",
};

export function muscleLabel(muscle: string) {
  return muscleNames[muscle] ?? muscle;
}

const anatomyGroups: Record<string, MuscleGroup[]> = {
  back: ["BACK_UPPER", "BACK_LOWER"],
  biceps: ["BICEPS"],
  chest: ["CHEST"],
  core: ["CORE"],
  front_delts: ["SHOULDERS_FRONT"],
  glutes: ["GLUTES"],
  hamstrings: ["HAMSTRINGS"],
  lats: ["LATS"],
  mid_back: ["RHOMBOIDS", "BACK_UPPER"],
  quads: ["QUADS"],
  rear_delts: ["SHOULDERS_REAR"],
  shoulders: ["SHOULDERS_FRONT", "SHOULDERS_SIDE"],
  side_delts: ["SHOULDERS_SIDE"],
  triceps: ["TRICEPS"],
};

function addMuscles(values: MuscleMapValues, muscles: string[], score: number) {
  muscles.flatMap((muscle) => anatomyGroups[muscle] ?? []).forEach((group) => {
    values[group] = { score: Math.max(values[group]?.score ?? 0, score) };
  });
}

export function MuscleMap({ primary, secondary, sex = "male" }: { primary: string[]; secondary: string[]; sex?: "male" | "female" | "prefer_not" }) {
  const primaryLabels = primary.map(muscleLabel);
  const secondaryLabels = secondary.map(muscleLabel);
  const values: MuscleMapValues = {};
  addMuscles(values, secondary, 45);
  addMuscles(values, primary, 100);
  const isFemale = sex === "female";

  return (
    <div className="muscle-map">
      <div className="anatomy-art" aria-hidden="true" inert>
        <AnatomyMuscleMap
          values={values}
          sex={isFemale ? "FEMALE" : "MALE"}
          view="BOTH"
          monochromeColor="#f36f21"
          monochromeBaseColor="#6f4938"
          glow={false}
          showLegend={false}
          tooltipFields={[]}
          figureWidth={154}
          backgroundImageFront={isFemale ? femaleFront : maleFront}
          backgroundImageBack={isFemale ? femaleBack : maleBack}
          backgroundGrayscale
          backgroundBrightness={0.72}
          backgroundOpacity={0.78}
        />
      </div>
      <div className="muscle-legend">
        <span><i className="primary" /> اصلی: {primaryLabels.join("، ")}</span>
        {secondaryLabels.length ? <span><i className="secondary" /> کمکی: {secondaryLabels.join("، ")}</span> : null}
      </div>
    </div>
  );
}
