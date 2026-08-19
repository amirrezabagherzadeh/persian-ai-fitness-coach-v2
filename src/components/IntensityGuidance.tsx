import { Gauge } from "lucide-react";
import { intensityGuidance } from "@/lib/intensity";

export function IntensityGuidance({ remainingReps, compact = false }: { remainingReps: number; compact?: boolean }) {
  const guidance = intensityGuidance(remainingReps);

  return (
    <div className={compact ? "intensity-guidance compact" : "intensity-guidance"}>
      <Gauge aria-hidden="true" />
      <div>
        <strong>{guidance.label}</strong>
        <p>{guidance.description}</p>
      </div>
    </div>
  );
}
