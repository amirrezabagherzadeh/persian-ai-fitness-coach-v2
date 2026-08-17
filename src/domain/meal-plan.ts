import type { Food, Meal, MealPlan, UserProfile } from "@/domain/types";
import { foods } from "@/data/foods";
import { calculateNutritionTarget } from "@/domain/nutrition";

function findFood(id: string): Food {
  const food = foods.find((item) => item.id === id);
  if (!food) throw new Error(`Unknown food ${id}`);
  return food;
}

export function mealMacros(meal: Meal) {
  return meal.items.reduce(
    (total, item) => {
      const food = findFood(item.foodId);
      return {
        calories: total.calories + food.calories * item.servings,
        protein: total.protein + food.protein * item.servings,
        carbs: total.carbs + food.carbs * item.servings,
        fat: total.fat + food.fat * item.servings,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function generateMealPlan(profile: UserProfile): MealPlan {
  const target = calculateNutritionTarget(profile);
  const vegetarian = profile.dietaryStyle === "vegetarian" || profile.dietaryStyle === "vegan";
  const protein = vegetarian ? "lentils" : "chicken";
  const breakfastProtein = profile.dietaryStyle === "vegan" ? "beans" : "eggs";
  return {
    id: "meal-plan-demo",
    userId: profile.id,
    target,
    meals: [
      { id: "breakfast", title: "صبحانه", items: [{ foodId: breakfastProtein, servings: 1 }, { foodId: "sangak", servings: 0.6 }, { foodId: "apple", servings: 1 }] },
      { id: "lunch", title: "ناهار", items: [{ foodId: protein, servings: 1.4 }, { foodId: "rice", servings: 1.3 }, { foodId: "yogurt", servings: vegetarian ? 0 : 0.6 }] },
      { id: "snack", title: "میان‌وعده", items: [{ foodId: "banana", servings: 1 }, { foodId: "milk", servings: profile.dietaryStyle === "vegan" ? 0 : 1 }, { foodId: "nuts", servings: 0.5 }] },
      { id: "dinner", title: "شام", items: [{ foodId: vegetarian ? "beans" : "fish", servings: 1.1 }, { foodId: "potato", servings: 1 }, { foodId: "doogh", servings: profile.dietaryStyle === "vegan" ? 0 : 1 }] },
    ],
  };
}

export function totalsForFoodLogs(logs: { foodId: string; servings: number }[]) {
  return logs.reduce(
    (total, log) => {
      const food = findFood(log.foodId);
      return {
        calories: total.calories + food.calories * log.servings,
        protein: total.protein + food.protein * log.servings,
        carbs: total.carbs + food.carbs * log.servings,
        fat: total.fat + food.fat * log.servings,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
