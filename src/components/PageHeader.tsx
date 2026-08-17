import { Badge } from "@/components/ui/badge";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div className="grid gap-1.5">
        {eyebrow ? <Badge variant="secondary" className="w-fit text-primary">{eyebrow}</Badge> : null}
        <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
