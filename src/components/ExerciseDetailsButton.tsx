"use client";

import Image from "next/image";
import { AlertTriangle, ArrowLeft, BadgeCheck, Play, Target, X } from "lucide-react";
import type { Exercise, FocusArea, UserProfile } from "@/domain/types";
import { exerciseMedia } from "@/data/exercise-media";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MuscleMap, muscleLabel } from "@/components/MuscleMap";
import { cn } from "@/lib/utils";
import { beginnerExerciseGuides, simpleMistakeGuides } from "@/data/exercise-guidance";

const focusMuscles: Record<FocusArea, string[]> = {
  chest: ["chest"], back: ["back", "lats", "mid_back", "rear_delts"], shoulders: ["shoulders", "front_delts", "side_delts", "rear_delts"],
  arms: ["biceps", "triceps"], legs: ["quads", "hamstrings"], glutes: ["glutes"], core: ["core"],
};

const goalReason: Record<UserProfile["goal"], string> = {
  fat_loss: "این حرکت چند عضله را هم‌زمان درگیر می‌کند و به حفظ قدرت در دوره کاهش چربی کمک می‌کند.",
  muscle_gain: "این حرکت ظرفیت خوبی برای افزایش تدریجی فشار تمرین و عضله‌سازی دارد.",
  recomposition: "این حرکت برای حفظ و ساخت عضله در کنار بهبود ترکیب بدنی انتخاب شده است.",
  strength: "این حرکت امکان پیشرفت قابل‌اندازه‌گیری در قدرت و کنترل وزنه را فراهم می‌کند.",
  general_fitness: "این حرکت الگوی حرکتی کاربردی و کنترل بدنی را تقویت می‌کند.",
  maintenance: "این حرکت کمک می‌کند قدرت و کیفیت حرکتی فعلی را حفظ کنی.",
};

function defaultBeginnerOpening(exercise: Exercise) {
  const usesExternalResistance = exercise.equipment.some((equipment) => ["dumbbells", "barbell", "cable", "bands", "machines"].includes(equipment));
  return usesExternalResistance
    ? "با وزنه سبک شروع کن و اگر درد تیز یا غیرعادی حس کردی، حرکت را متوقف کن."
    : "با نسخه ساده‌تر حرکت شروع کن و اگر درد تیز یا غیرعادی حس کردی، حرکت را متوقف کن.";
}

function reasonForExercise(exercise: Exercise, profile?: UserProfile) {
  if (!profile) return exercise.kind === "compound" ? "یک حرکت پایه برای ساخت قدرت و هماهنگی چند عضله است." : "برای تکمیل حجم تمرین عضله هدف در برنامه قرار گرفته است.";
  const matchesFocus = profile.focusAreas.some((area) => focusMuscles[area].some((muscle) => exercise.primaryMuscles.includes(muscle)));
  return `${goalReason[profile.goal]}${matchesFocus ? " همچنین با ناحیه‌ای که برای تمرکز بیشتر انتخاب کردی هماهنگ است." : ""}`;
}

function MotionGuide({ frames, exerciseName }: { frames: [string, string]; exerciseName: string }) {
  return (
    <figure className="motion-guide" aria-label={`نمایش متحرک حالت شروع و پایان ${exerciseName}`}>
      <div className="motion-stage">
        <Image className="motion-frame motion-start" src={frames[0]} alt="" fill sizes="(max-width: 720px) 86vw, 360px" />
        <Image className="motion-frame motion-end" src={frames[1]} alt="" fill sizes="(max-width: 720px) 86vw, 360px" />
        <span className="motion-badge"><Play /> نمایش متحرک</span>
      </div>
      <figcaption>از حالت شروع، آرام به حالت پایان برو و دوباره با کنترل برگرد.</figcaption>
    </figure>
  );
}

type MediaOrientation = "square" | "portrait" | "landscape";

function VideoGuide({ src, poster, exerciseName, orientation }: { src: string; poster?: string; exerciseName: string; orientation?: MediaOrientation }) {
  return (
    <figure className="video-guide">
      <div className={`video-stage ${orientation ? `${orientation}-video` : ""}`}>
        <video autoPlay loop muted playsInline preload="metadata" poster={poster} aria-label={`ویدیوی آموزشی بی‌صدای اجرای ${exerciseName}`} controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture disableRemotePlayback tabIndex={-1} onContextMenu={(event) => event.preventDefault()}>
          <source src={src} type="video/mp4" />
          مرورگر شما امکان پخش این ویدیو را ندارد.
        </video>
        <span className="video-badge"><Play /> ویدیوی اجرای کامل</span>
      </div>
      <figcaption>حرکت را یک‌بار کامل ببین؛ بعد با وزنه سبک همان مسیر را تکرار کن.</figcaption>
    </figure>
  );
}

function AnimationGuide({ src, exerciseName, orientation }: { src: string; exerciseName: string; orientation?: MediaOrientation }) {
  return (
    <figure className="video-guide">
      <div className={`video-stage animation-stage ${orientation ? `${orientation}-video` : ""}`}>
        {/* Animated GIFs are intentionally served as-is; image optimization would freeze the animation. */}
        <img src={src} alt={`نمایش متحرک اجرای ${exerciseName}`} loading="eager" decoding="async" />
        <span className="video-badge"><Play /> ویدیوی آموزشی حرکت</span>
      </div>
      <figcaption>چند تکرار را کامل ببین و به مسیر وزنه، مفصل‌ها و سرعت برگشت توجه کن.</figcaption>
    </figure>
  );
}

export function ExerciseMediaPreview({ exercise }: { exercise: Exercise }) {
  const media = exerciseMedia[exercise.id];
  if (!media) return null;

  if (media.video) return <VideoGuide src={media.video} poster={media.frames?.[0]} exerciseName={exercise.nameFa} orientation={media.videoOrientation} />;
  if (media.animation) return <AnimationGuide src={media.animation} exerciseName={exercise.nameFa} orientation={media.animationOrientation} />;
  return media.frames ? <MotionGuide frames={media.frames} exerciseName={exercise.nameFa} /> : null;
}

export function ExerciseMediaThumbnail({ exercise }: { exercise: Exercise }) {
  const media = exerciseMedia[exercise.id];

  return (
    <span className="exercise-thumb" aria-hidden="true">
      {media?.animation ? (
        <img src={media.animation} alt="" loading="lazy" decoding="async" />
      ) : media?.video ? (
        <video autoPlay loop muted playsInline preload="metadata" poster={media.frames?.[0]} tabIndex={-1}>
          <source src={media.video} type="video/mp4" />
        </video>
      ) : media?.frames ? (
        <Image src={media.frames[0]} alt="" fill sizes="72px" />
      ) : null}
      <span className="exercise-preview-play"><Play /></span>
    </span>
  );
}

export function ExerciseDetailsButton({ exercise, profile, className, children }: { exercise: Exercise; profile?: UserProfile; className?: string; children: React.ReactNode }) {
  const media = exerciseMedia[exercise.id];
  const beginnerGuide = beginnerExerciseGuides[exercise.id] ?? { opening: defaultBeginnerOpening(exercise), steps: exercise.instructions.slice(0, 3) as [string, string, string] };
  const simpleMistakes = simpleMistakeGuides[exercise.id] ?? exercise.commonMistakes.map((mistake) => `از ${mistake} پرهیز کن.`);
  return (
    <Dialog>
      <DialogTrigger asChild><button type="button" className={cn("rounded-lg text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className ?? "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline")} aria-label={`نمایش آموزش ${exercise.nameFa}`}>{children}</button></DialogTrigger>
      <DialogContent className="exercise-dialog max-h-[calc(100dvh-1rem)] gap-0 overflow-y-auto p-0 sm:max-w-4xl" showCloseButton={false}>
        <DialogClose asChild><button type="button" className="exercise-dialog-close" aria-label="بستن راهنمای حرکت"><X /><span>بستن</span></button></DialogClose>
        <DialogHeader className="exercise-dialog-header">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Play className="size-3.5" /> راهنمای اجرای حرکت</div>
          <DialogTitle className="text-2xl font-bold">{exercise.nameFa}</DialogTitle>
          <DialogDescription className="text-start text-sm" dir="ltr" lang="en">{exercise.nameEn}</DialogDescription>
        </DialogHeader>

        {media ? <div className="exercise-visuals"><ExerciseMediaPreview exercise={exercise} />{media.frames ? <div className="exercise-frames-block"><div><span className="dialog-section-label">حالت‌های کلیدی حرکت</span><h3>شروع و پایان را مقایسه کن</h3></div><div className="exercise-frames" aria-label={`تصاویر شروع و پایان حرکت ${exercise.nameFa}`}>{media.frames.map((frame, index) => <figure key={frame}><Image src={frame} alt={`${index === 0 ? "حالت شروع" : "حالت پایان"} حرکت ${exercise.nameFa}`} fill sizes="(max-width: 720px) 43vw, 320px" priority /><figcaption>{index === 0 ? "شروع" : "پایان"}</figcaption></figure>)}<span className="frame-arrow"><ArrowLeft /></span></div></div> : null}</div> : null}

        <div className="exercise-education-grid">
          <section className="execution-guide"><span className="dialog-section-label">راهنمای ساده برای شروع</span><h3>قدم‌به‌قدم و بدون عجله</h3><p className="beginner-note">{beginnerGuide.opening}</p><ol>{beginnerGuide.steps.map((instruction) => <li key={instruction}><span>{instruction}</span></li>)}</ol>{simpleMistakes.length ? <Alert variant="destructive" className="mistake-alert"><AlertTriangle className="size-4" /><AlertTitle>حواست به این‌ها باشد</AlertTitle><AlertDescription><p>آرام حرکت کن و فرم بدنت را کنترل کن.</p><ul>{simpleMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></AlertDescription></Alert> : null}</section>
          <aside className="muscle-panel"><div><span className="dialog-section-label">نقشه عضلات</span><h3>فشار حرکت کجاست؟</h3></div><MuscleMap primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} sex={profile?.sex} /><div className="muscle-badges"><div className="muscle-badge-row"><span className="muscle-badge-label">عضله اصلی</span><span className="muscle-badge-list">{exercise.primaryMuscles.map((muscle) => <Badge key={muscle}>{muscleLabel(muscle)}</Badge>)}</span></div>{exercise.secondaryMuscles.length ? <div className="muscle-badge-row"><span className="muscle-badge-label">عضله کمکی</span><span className="muscle-badge-list">{exercise.secondaryMuscles.map((muscle) => <Badge variant="secondary" key={muscle}>{muscleLabel(muscle)}</Badge>)}</span></div> : null}</div></aside>
        </div>

        <section className="exercise-rationale"><span className="rationale-icon"><Target /></span><div><span className="dialog-section-label">دلیل حضور در برنامه تو</span><h3>چرا این حرکت را انجام می‌دهی؟</h3><p>{reasonForExercise(exercise, profile)}</p></div><BadgeCheck /></section>
      </DialogContent>
    </Dialog>
  );
}
