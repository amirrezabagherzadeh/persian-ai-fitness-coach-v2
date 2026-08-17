"use client";

import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import { foods } from "@/data/foods";
import { mealMacros } from "@/domain/meal-plan";
import { nf } from "@/lib/format";

export function MealPlanPage() {
  const { state } = useAppStore();
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="برنامه غذایی" eyebrow={`${nf(state.mealPlan.target.calories)} کالری`} description="وعده‌ها نمونه عملی هستند و می‌توانند با جایگزین‌های نزدیک تعویض شوند." />
        <div className="grid grid-2">
          {state.mealPlan.meals.map((meal) => {
            const macros = mealMacros(meal);
            return (
              <section className="light-panel" key={meal.id}>
                <div className="split">
                  <h2>{meal.title}</h2>
                  <span className="tag">{nf(macros.protein)}g پروتئین</span>
                </div>
                {meal.items.filter((item) => item.servings > 0).map((item) => {
                  const food = foods.find((x) => x.id === item.foodId);
                  return <div className="meal-row" key={item.foodId}><div className="split"><strong>{food?.nameFa}</strong><span>{nf(item.servings)} سروینگ</span></div><small className="muted-dark">{food?.iranianPortion} | جایگزین: {food?.alternatives.join("، ")}</small></div>;
                })}
                <p>{nf(macros.calories)} کالری | P {nf(macros.protein)} | C {nf(macros.carbs)} | F {nf(macros.fat)}</p>
                <button className="btn ghost">جایگزین غذا</button>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
