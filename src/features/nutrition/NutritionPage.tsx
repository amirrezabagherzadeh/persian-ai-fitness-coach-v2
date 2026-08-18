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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NutritionPage() {
  const { state, addFoodLog, removeFoodLog } = useAppStore();
  const [foodId, setFoodId] = useState(foods[0].id);
  const [servings, setServings] = useState(1);
  const totals = totalsForFoodLogs(state.foodLogs);
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="تغذیه" eyebrow="هدف امروز" description="کالری و ماکرو از فرمول و پروفایل شما محاسبه شده است." action={<Button asChild><Link href="/nutrition/plan">دیدن برنامه غذایی</Link></Button>} />
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
              <label className="field">غذا<Select value={foodId} onValueChange={setFoodId}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{foods.map((food) => <SelectItem key={food.id} value={food.id}>{food.nameFa}</SelectItem>)}</SelectContent></Select></label>
              <label className="field">تعداد سروینگ<Input type="number" min="0.25" step="0.25" value={servings} onChange={(e) => setServings(Number(e.target.value))} /></label>
            </div>
            <Button className="mt-3" onClick={() => addFoodLog({ id: `food-${Date.now()}`, foodId, servings, meal: "ثبت سریع", loggedAt: new Date().toISOString() })}>ثبت وعده غذایی</Button>
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
                  <Button variant="secondary" onClick={() => removeFoodLog(log.id)}>حذف</Button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
