import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <Card className="min-h-28">
      <CardHeader className="pb-0">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>
      </CardHeader>
      {helper ? <CardContent className="text-xs text-muted-foreground">{helper}</CardContent> : null}
    </Card>
  );
}
