import type { FoodLog, Reminder, UserProfile, WeeklyCheckIn, WorkoutSession } from "@/domain/types";
import { generateTrainingProgram } from "@/domain/training";
import { generateMealPlan } from "@/domain/meal-plan";
import { demoCoachMethodology } from "@/data/coach-methodologies";

export const demoProfile: UserProfile = {
  id: "demo-user",
  name: "کاربر دمو",
  email: "demo@gymcoach.local",
  role: "admin",
  age: 27,
  sex: "male",
  heightCm: 178,
  weightKg: 82,
  waistCm: 88,
  goal: "recomposition",
  targetWeightKg: 79,
  experience: "intermediate",
  trainingMonths: 30,
  daysPerWeek: 4,
  preferredDays: ["شنبه", "دوشنبه", "چهارشنبه", "پنجشنبه"],
  sessionMinutes: 70,
  preferredTime: "18:00",
  equipment: ["commercial_gym", "barbell", "dumbbells", "bench", "cable", "machines"],
  activityLevel: "moderate",
  sleepHours: 7,
  stressLevel: 3,
  injuries: [],
  medicalFlags: [],
  dietaryStyle: "omnivore",
  allergies: [],
  dislikedFoods: ["جگر"],
  favoriteFoods: ["مرغ", "برنج", "ماست"],
  mealsPerDay: 4,
  cookingTimeMinutes: 30,
  budget: "medium",
};

export const demoProgram = generateTrainingProgram(demoProfile, demoCoachMethodology);
export const demoMealPlan = generateMealPlan(demoProfile);

export const demoWorkouts: WorkoutSession[] = [
  {
    id: "session-1",
    dayId: "day-1",
    startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(),
    sets: demoProgram.days[0].prescriptions.flatMap((p) =>
      Array.from({ length: p.sets }, (_, index) => ({
        prescriptionId: p.id,
        setNumber: index + 1,
        weightKg: p.order <= 2 ? 60 + index * 2.5 : 18,
        reps: p.reps[1] - (index === p.sets - 1 ? 1 : 0),
        rir: p.rir,
        completed: true,
      })),
    ),
  },
];

export const demoFoodLogs: FoodLog[] = [
  { id: "fl-1", foodId: "eggs", servings: 1, meal: "صبحانه", loggedAt: new Date().toISOString() },
  { id: "fl-2", foodId: "sangak", servings: 0.5, meal: "صبحانه", loggedAt: new Date().toISOString() },
  { id: "fl-3", foodId: "chicken", servings: 1, meal: "ناهار", loggedAt: new Date().toISOString() },
  { id: "fl-4", foodId: "rice", servings: 1, meal: "ناهار", loggedAt: new Date().toISOString() },
];

export const demoReminders: Reminder[] = [
  { id: "r-1", type: "workout", title: "تمرین بالاتنه", day: "شنبه", time: "18:00", active: true },
  { id: "r-2", type: "meal", title: "ناهار پرپروتئین", day: "هر روز", time: "13:30", active: true },
  { id: "r-3", type: "water", title: "آب", day: "هر روز", time: "16:00", active: true },
  { id: "r-4", type: "check_in", title: "چک‌این هفتگی", day: "جمعه", time: "10:00", active: true },
];

export const demoCheckIns: WeeklyCheckIn[] = [
  { id: "c-1", date: new Date(Date.now() - 86400000 * 21).toISOString(), weightKg: 83.1, waistCm: 89.5, sleepQuality: 3, hunger: 3, energy: 3, performance: 3, difficulty: 3, adherence: 3, summary: "شروع برنامه دمو." },
  { id: "c-2", date: new Date(Date.now() - 86400000 * 14).toISOString(), weightKg: 82.7, waistCm: 89, sleepQuality: 4, hunger: 3, energy: 4, performance: 4, difficulty: 3, adherence: 4, summary: "وزن کمی کاهش داشته و عملکرد حفظ شده است." },
  { id: "c-3", date: new Date(Date.now() - 86400000 * 7).toISOString(), weightKg: 82.2, waistCm: 88.3, sleepQuality: 4, hunger: 2, energy: 4, performance: 4, difficulty: 3, adherence: 4, summary: "روند مناسب است؛ فعلاً نیازی به کاهش کالری نیست." },
];
