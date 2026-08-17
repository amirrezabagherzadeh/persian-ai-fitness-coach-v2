"use client";

import Image from "next/image";
import { AlertTriangle, ArrowLeft, ExternalLink, Play } from "lucide-react";
import type { Exercise } from "@/domain/types";
import { exerciseMedia } from "@/data/exercise-media";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const muscleNames: Record<string, string> = {
  back: "پشت",
  biceps: "جلو بازو",
  chest: "سینه",
  core: "میان‌تنه",
  front_delts: "سرشانه جلویی",
  glutes: "سرینی",
  hamstrings: "پشت ران",
  lats: "زیر بغل",
  mid_back: "پشت میانی",
  quads: "جلوی ران",
  rear_delts: "سرشانه پشتی",
  shoulders: "سرشانه",
  side_delts: "سرشانه میانی",
  triceps: "پشت بازو",
};

export function ExerciseDetailsButton({ exercise, className, children }: { exercise: Exercise; className?: string; children: React.ReactNode }) {
  const media = exerciseMedia[exercise.id];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            className ?? "text-sm font-medium text-primary hover:underline",
          )}
          aria-label={`نمایش نحوه اجرای ${exercise.nameFa}`}
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        <DialogHeader className="sticky top-0 z-20 border-b bg-popover/95 px-5 py-4 pe-14 backdrop-blur">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Play className="size-3.5" aria-hidden="true" />
            راهنمای اجرای حرکت
          </div>
          <DialogTitle className="text-xl font-bold">{exercise.nameFa}</DialogTitle>
          <DialogDescription className="text-start" dir="ltr" lang="en">{exercise.nameEn}</DialogDescription>
        </DialogHeader>

        {media ? (
          <div className="relative grid grid-cols-2 gap-0.5 bg-muted p-0.5" aria-label={`تصاویر شروع و پایان حرکت ${exercise.nameFa}`}>
            {media.frames.map((frame, index) => (
              <figure className="relative m-0 aspect-square overflow-hidden bg-muted sm:aspect-[3/2]" key={frame}>
                <Image src={frame} alt={`${index === 0 ? "حالت شروع" : "حالت پایان"} حرکت ${exercise.nameFa}`} fill sizes="(max-width: 720px) 46vw, 360px" loading="eager" className="object-cover" />
                <figcaption className="absolute bottom-3 start-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                  {index === 0 ? "شروع" : "پایان"}
                </figcaption>
              </figure>
            ))}
            <span className="absolute top-1/2 start-1/2 z-10 grid size-10 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border-2 border-popover bg-primary text-primary-foreground" aria-hidden="true">
              <ArrowLeft className="size-4" />
            </span>
          </div>
        ) : null}

        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1.35fr)_minmax(220px,.65fr)]">
          <section className="grid content-start gap-3">
            <h3 className="font-semibold">اجرای صحیح</h3>
            <ol className="grid list-decimal gap-2 pe-5 text-sm leading-7 marker:font-bold marker:text-primary">
              {exercise.instructions.map((instruction) => <li className="pe-1" key={instruction}>{instruction}</li>)}
            </ol>
          </section>

          <aside className="grid content-start gap-4">
            <div className="grid gap-2">
              <span className="text-xs text-muted-foreground">عضلات اصلی</span>
              <div className="flex flex-wrap gap-1.5">
                {exercise.primaryMuscles.map((muscle) => <Badge variant="secondary" key={muscle}>{muscleNames[muscle] ?? muscle}</Badge>)}
              </div>
            </div>
            {exercise.commonMistakes.length ? (
              <Alert variant="destructive">
                <AlertTriangle className="size-4" aria-hidden="true" />
                <AlertTitle>خطاهای رایج</AlertTitle>
                <AlertDescription>{exercise.commonMistakes.join("، ")}</AlertDescription>
              </Alert>
            ) : null}
          </aside>
        </div>

        {media ? (
          <footer className="flex flex-wrap items-center gap-1 border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
            تصویر از <a className="inline-flex items-center gap-1 text-primary hover:underline" href={media.sourceUrl} target="_blank" rel="noreferrer">{media.sourceName} <ExternalLink className="size-3" aria-hidden="true" /></a>
            <span>· {media.license}</span>
          </footer>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
