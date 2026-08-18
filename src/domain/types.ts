export type Sex = "male" | "female";
export type Goal = "fat_loss" | "muscle_gain" | "recomposition" | "strength" | "general_fitness" | "maintenance";
export type Experience = "never" | "beginner" | "intermediate" | "advanced";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "high" | "very_high";
export type TrainingStyle = "balanced" | "machines" | "free_weights";
export type FocusArea = "chest" | "back" | "shoulders" | "arms" | "legs" | "glutes" | "core";
export type InjuryFlag = "shoulder_pain" | "knee_pain" | "back_pain" | "elbow_pain" | "wrist_pain";
export type Equipment =
  | "commercial_gym"
  | "dumbbells"
  | "barbell"
  | "bench"
  | "cable"
  | "bands"
  | "pullup_bar"
  | "machines"
  | "bodyweight";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  armCm: number;
  chestCm?: number;
  thighCm?: number;
  goal: Goal;
  targetWeightKg?: number;
  experience: Experience;
  trainingMonths: number;
  daysPerWeek: number;
  preferredDays: string[];
  sessionMinutes: number;
  preferredTime: string;
  equipment: Equipment[];
  trainingStyle: TrainingStyle;
  focusAreas: FocusArea[];
  activityLevel: ActivityLevel;
  sleepHours: number;
  stressLevel: number;
  injuries: InjuryFlag[];
  injuryNotes: string;
  medicalFlags: string[];
  dietaryStyle: "omnivore" | "vegetarian" | "vegan" | "other";
  allergies: string[];
  dislikedFoods: string[];
  favoriteFoods: string[];
  mealsPerDay: number;
  cookingTimeMinutes: number;
  budget: "low" | "medium" | "high";
};

export type Exercise = {
  id: string;
  nameFa: string;
  nameEn: string;
  slug: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  movementPattern: string;
  equipment: Equipment[];
  difficulty: Experience[];
  kind: "compound" | "isolation";
  repRange: [number, number];
  fatigueCost: 1 | 2 | 3 | 4 | 5;
  skillRequirement: 1 | 2 | 3 | 4 | 5;
  contraindications: string[];
  substitutions: string[];
  instructions: string[];
  commonMistakes: string[];
  evidenceNotes: string;
  active: boolean;
};

export type ExercisePrescription = {
  id: string;
  exerciseId: string;
  sets: number;
  reps: [number, number];
  rir: number;
  restSeconds: number;
  tempo?: string;
  order: number;
  notes: string;
};

export type TrainingDay = {
  id: string;
  title: string;
  weekday: string;
  focus: string;
  warmup: string;
  estimatedMinutes: number;
  prescriptions: ExercisePrescription[];
};

export type TrainingProgram = {
  id: string;
  userId: string;
  version: number;
  split: string;
  goal: Goal;
  methodologyId?: string;
  methodologyTitle?: string;
  days: TrainingDay[];
  rationale: string[];
  durationWeeks: 4;
  startsAt: string;
  endsAt: string;
  safetyNotice?: string;
  createdAt: string;
};

export type CoachMethodologyRules = {
  preferredSplit: "auto" | "full_body" | "upper_lower" | "ppl";
  volumeBias: "low" | "moderate" | "high";
  intensityStyle: "conservative_rir" | "moderate_rir" | "near_failure";
  progressionStyle: "double_progression" | "linear_load" | "slow_technical";
  exerciseBias: "balanced" | "machines" | "free_weights" | "bodyweight";
  weeklySetTarget: number;
};

export type CoachMethodology = {
  id: string;
  coachName: string;
  title: string;
  audience: string;
  rawMethod: string;
  wantsAiReview: boolean;
  aiReviewStatus: "not_requested" | "reviewed";
  aiReviewSummary?: string;
  reviewFindings: string[];
  normalizedRules: CoachMethodologyRules;
  approved: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSet = {
  prescriptionId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  rir: number;
  completed: boolean;
};

export type WorkoutSession = {
  id: string;
  dayId: string;
  startedAt: string;
  completedAt?: string;
  sets: WorkoutSet[];
  notes?: string;
};

export type Food = {
  id: string;
  nameFa: string;
  nameEn: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  iranianPortion: string;
  alternatives: string[];
  source: string;
  verified: boolean;
};

export type NutritionTarget = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  bmr: number;
  tdee: number;
  explanation: string[];
};

export type MealItem = {
  foodId: string;
  servings: number;
};

export type Meal = {
  id: string;
  title: string;
  items: MealItem[];
};

export type MealPlan = {
  id: string;
  userId: string;
  target: NutritionTarget;
  meals: Meal[];
};

export type FoodLog = {
  id: string;
  foodId: string;
  servings: number;
  loggedAt: string;
  meal: string;
};

export type Reminder = {
  id: string;
  type: "workout" | "meal" | "water" | "supplement" | "weigh_in" | "check_in";
  title: string;
  day: string;
  time: string;
  active: boolean;
};

export type WeeklyCheckIn = {
  id: string;
  date: string;
  weightKg: number;
  waistCm: number;
  sleepQuality: number;
  hunger: number;
  energy: number;
  performance: number;
  difficulty: number;
  adherence: number;
  summary: string;
};

export type KnowledgeItem = {
  id: string;
  topic: string;
  claim: string;
  summary: string;
  practicalImplication: string;
  source: string;
  sourceUrl?: string;
  publicationYear?: number;
  evidenceLevel: "demo" | "position_stand" | "systematic_review" | "meta_analysis" | "consensus" | "expert_review";
  dateReviewed: string;
  tags: string[];
  active: boolean;
};
