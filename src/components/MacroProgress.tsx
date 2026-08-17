import { nf, percent } from "@/lib/format";
import { Progress } from "@/components/ui/progress";

export function MacroProgress({ label, current, target, unit = "g" }: { label: string; current: number; target: number; unit?: string }) {
  const ratio = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <strong>{label}</strong>
        <span className="text-sm text-muted-foreground">{nf(current)} / {nf(target)} {unit}</span>
      </div>
      <Progress value={ratio} className="h-2" />
      <small className="text-xs text-muted-foreground">{percent(ratio)} تکمیل شده</small>
    </div>
  );
}
