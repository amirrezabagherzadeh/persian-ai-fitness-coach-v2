"use client";

import Link from "next/link";
import { Bell, Dumbbell, Flame, Play, Plus, Salad, Search, Trophy, Waves } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExerciseDetailsButton } from "@/components/ExerciseDetailsButton";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { MacroProgress } from "@/components/MacroProgress";
import { useAppStore } from "@/store/app-store";
import { totalsForFoodLogs } from "@/domain/meal-plan";
import { nextReminder } from "@/domain/reminders";
import { nf, todayFa } from "@/lib/format";
import { exercises } from "@/data/exercises";
import { Progress } from "@/components/ui/progress";

export function DashboardPage() {
  const { state } = useAppStore();
  const todayWorkout = state.program.days[0];
  const totals = totalsForFoodLogs(state.foodLogs);
  const reminder = nextReminder(state.reminders);
  const completedThisWeek = state.workouts.filter((workout) => workout.completedAt).length;
  return (
    <AppShell>
      <div className="page">
        <div className="app-topbar">
          <div className="avatar">{state.user.name.slice(0, 1)}</div>
          <div className="flex-1">
            <div className="muted">{todayFa()}</div>
            <h1 className="text-3xl font-bold tracking-tight">سلام {state.user.name}</h1>
          </div>
          <Link className="btn secondary" href="/reminders" aria-label="یادآورها"><Bell size={19} /></Link>
        </div>
        <div className="pill-search"><Search size={18} /> جستجوی تمرین، غذا یا سوال از مربی...</div>
        <div className="mt-4 grid grid-2">
          <section className="lime-progress-card">
            <div className="split">
              <div>
                <span className="tag">Today Progress</span>
                <h2 className="mt-2.5">کالری و فعالیت امروز</h2>
              </div>
              <Trophy color="var(--accent)" />
            </div>
            <div className="calorie-ring">
              <div className="text-center">
                <strong>{nf(totals.calories)}</strong>
                <div>kcal</div>
              </div>
            </div>
            <div className="grid grid-3">
              <div className="mini-stat"><span className="muted-dark">پروتئین</span><strong>{nf(totals.protein)}g</strong></div>
              <div className="mini-stat"><span className="muted-dark">آب</span><strong>۲.۵L</strong></div>
              <div className="mini-stat"><span className="muted-dark">تمرین</span><strong>{nf(completedThisWeek)}/{nf(state.user.daysPerWeek)}</strong></div>
            </div>
          </section>
          <section className="panel">
            <h2>دسته‌ها</h2>
            <div className="category-strip">
              <Link className="category-chip active" href="/program"><Dumbbell size={16} />برنامه</Link>
              <Link className="category-chip" href="/nutrition"><Salad size={16} />تغذیه</Link>
              <Link className="category-chip" href="/progress"><Flame size={16} />پیشرفت</Link>
              <Link className="category-chip" href="/reminders"><Waves size={16} />آب</Link>
            </div>
            <div className="workout-media-card panel mt-3.5">
              <span className="tag">{todayWorkout.weekday}</span>
              <h2>{todayWorkout.title}</h2>
              <p className="muted">تمرین امروز با {todayWorkout.prescriptions.length} حرکت و RIR هدف آماده است.</p>
              <Link className="btn primary" href={`/workout/${todayWorkout.id}`}><Dumbbell size={18} />شروع تمرین امروز</Link>
            </div>
          </section>
        </div>
        <div className="mt-4 grid grid-3">
          <MetricCard label="کالری امروز" value={`${nf(totals.calories)} / ${nf(state.mealPlan.target.calories)}`} helper="ثبت‌شده در وعده‌های امروز" />
          <MetricCard label="پروتئین" value={`${nf(totals.protein)} / ${nf(state.mealPlan.target.proteinG)} g`} helper={`${nf(Math.max(0, state.mealPlan.target.proteinG - totals.protein))} گرم باقی مانده`} />
          <MetricCard label="استریک تمرین" value={`${nf(completedThisWeek)} جلسه`} helper="بر اساس تاریخچه محلی دمو" />
        </div>
        <div className="mt-4 grid grid-2">
          <section className="light-panel">
            <div className="split">
              <div>
                <span className="tag">تمرین امروز</span>
                <h2>{todayWorkout.title}</h2>
              </div>
              <Dumbbell />
            </div>
            <p className="muted-dark">{todayWorkout.warmup}</p>
            {todayWorkout.prescriptions.slice(0, 4).map((item) => {
              const exercise = exercises.find((candidate) => candidate.id === item.exerciseId);
              return exercise ? (
              <ExerciseDetailsButton exercise={exercise} className="exercise-row exercise-row-button" key={item.id}>
                <div className="split">
                  <span className="exercise-row-name"><Play size={15} aria-hidden="true" /><strong>{item.order}. {exercise.nameFa}</strong></span>
                  <span>{item.sets} × {item.reps[0]}-{item.reps[1]}</span>
                </div>
              </ExerciseDetailsButton>
              ) : null;
            })}
            <div className="button-row mt-3">
              <Link className="btn dark" href={`/workout/${todayWorkout.id}`}>شروع تمرین</Link>
              <Link className="btn ghost" href={`/program/day/${todayWorkout.id}`}>جزئیات</Link>
            </div>
          </section>
          <section className="light-panel">
            <div className="split">
              <div>
                <span className="tag">تغذیه امروز</span>
                <h2>هدف ماکرو</h2>
              </div>
              <Salad />
            </div>
            <MacroProgress label="پروتئین" current={totals.protein} target={state.mealPlan.target.proteinG} />
            <MacroProgress label="کربوهیدرات" current={totals.carbs} target={state.mealPlan.target.carbsG} />
            <MacroProgress label="چربی" current={totals.fat} target={state.mealPlan.target.fatG} />
            <Link className="btn dark mt-3" href="/nutrition"><Plus size={17} />ثبت وعده غذایی</Link>
          </section>
        </div>
        <div className="mt-4 grid grid-2">
          <section className="panel">
            <div className="split">
              <h2>پیشرفت هفته</h2>
              <Link className="btn secondary" href="/check-in">چک‌این</Link>
            </div>
            <p className="muted">تمرین‌های کامل‌شده: {nf(completedThisWeek)} از {nf(state.user.daysPerWeek)}</p>
            <Progress value={Math.min(100, completedThisWeek / state.user.daysPerWeek * 100)} className="h-2" />
          </section>
          <section className="panel">
            <div className="split">
              <h2>یادآور بعدی</h2>
              <Bell color="var(--accent)" />
            </div>
            <p className="muted">{reminder ? `${reminder.title}، ${reminder.day} ساعت ${reminder.time}` : "یادآور فعالی نداری."}</p>
            <Link className="btn secondary" href="/reminders">مدیریت یادآورها</Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
