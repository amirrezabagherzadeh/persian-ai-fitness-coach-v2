"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { MacroProgress } from "@/components/MacroProgress";
import { useAppStore } from "@/store/app-store";
import { foods } from "@/data/foods";
import { totalsForFoodLogs } from "@/domain/meal-plan";
import { nf } from "@/lib/format";

export function NutritionPage() {
  const { state, addFoodLog, removeFoodLog } = useAppStore();
  const [foodId, setFoodId] = useState(foods[0].id);
  const [servings, setServings] = useState(1);
  const totals = totalsForFoodLogs(state.foodLogs);
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="تغذیه" eyebrow="هدف امروز" description="کالری و ماکرو از فرمول و پروفایل شما محاسبه شده است." action={<Link className="btn primary" href="/nutrition/plan">دیدن برنامه غذایی</Link>} />
        <div className="grid grid-2">
          <section className="light-panel">
            <h2>{nf(totals.calories)} / {nf(state.mealPlan.target.calories)} کالری</h2>
            <MacroProgress label="پروتئین" current={totals.protein} target={state.mealPlan.target.proteinG} />
            <MacroProgress label="کربوهیدرات" current={totals.carbs} target={state.mealPlan.target.carbsG} />
            <MacroProgress label="چربی" current={totals.fat} target={state.mealPlan.target.fatG} />
            <details>
              <summary>چرا این پیشنهاد؟</summary>
              {state.mealPlan.target.explanation.map((line) => <p className="muted-dark" key={line}>{line}</p>)}
            </details>
          </section>
          <section className="light-panel">
            <h2>ثبت سریع غذا</h2>
            <div className="grid grid-2">
              <label className="field">غذا<select className="select" value={foodId} onChange={(e) => setFoodId(e.target.value)}>{foods.map((food) => <option key={food.id} value={food.id}>{food.nameFa}</option>)}</select></label>
              <label className="field">تعداد سروینگ<input className="input" type="number" min="0.25" step="0.25" value={servings} onChange={(e) => setServings(Number(e.target.value))} /></label>
            </div>
            <button className="btn dark mt-3" onClick={() => addFoodLog({ id: `food-${Date.now()}`, foodId, servings, meal: "ثبت سریع", loggedAt: new Date().toISOString() })}>ثبت وعده غذایی</button>
          </section>
        </div>
        <section className="panel mt-4">
          <h2>غذاهای ثبت‌شده</h2>
          {state.foodLogs.map((log) => {
            const food = foods.find((item) => item.id === log.foodId);
            return (
              <div className="reminder-row" key={log.id}>
                <div className="split">
                  <span>{food?.nameFa} × {nf(log.servings)}</span>
                  <button className="btn secondary" onClick={() => removeFoodLog(log.id)}>حذف</button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
