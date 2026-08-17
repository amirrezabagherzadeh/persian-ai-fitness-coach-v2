import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="grid place-items-center gap-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">{title}</p>
        {action}
      </CardContent>
    </Card>
  );
}
