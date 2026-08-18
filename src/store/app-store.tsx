"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoachMethodology, FoodLog, MealPlan, Reminder, TrainingProgram, UserProfile, WeeklyCheckIn, WorkoutSession } from "@/domain/types";
import { demoCheckIns, demoFoodLogs, demoMealPlan, demoProfile, demoProgram, demoReminders, demoWorkouts } from "@/data/demo";
import { demoCoachMethodology } from "@/data/coach-methodologies";
import { generateTrainingProgram } from "@/domain/training";
import { generateMealPlan } from "@/domain/meal-plan";
import { reviewCoachMethodology } from "@/domain/coach-methodology";

type DemoAuthState = {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  account?: { email: string; password: string };
};

export type AppState = {
  auth: DemoAuthState;
  user: UserProfile;
  program: TrainingProgram;
  mealPlan: MealPlan;
  foodLogs: FoodLog[];
  workouts: WorkoutSession[];
  reminders: Reminder[];
  checkIns: WeeklyCheckIn[];
  coachMethodologies: CoachMethodology[];
  activeCoachMethodologyId?: string;
};

const STORAGE_KEY = "persian-gym-coach-state-v2";
const LEGACY_STORAGE_KEY = "persian-gym-coach-state-v1";

function initialState(): AppState {
  return {
    auth: { isAuthenticated: false, onboardingCompleted: false },
    user: demoProfile,
    program: demoProgram,
    mealPlan: demoMealPlan,
    foodLogs: demoFoodLogs,
    workouts: demoWorkouts,
    reminders: demoReminders,
    checkIns: demoCheckIns,
    coachMethodologies: [demoCoachMethodology],
    activeCoachMethodologyId: demoCoachMethodology.id,
  };
}

function normalizeUser(user?: Partial<UserProfile>): UserProfile {
  return {
    ...demoProfile,
    ...user,
    role: user?.role ?? "user",
    armCm: user?.armCm ?? demoProfile.armCm,
    trainingStyle: user?.trainingStyle ?? "balanced",
    focusAreas: user?.focusAreas ?? [],
    injuries: user?.injuries ?? [],
    injuryNotes: user?.injuryNotes ?? "",
    equipment: ["commercial_gym"],
  };
}

function normalizeState(parsed: Partial<AppState>, isLegacy = false): AppState {
  const fallback = initialState();
  const user = normalizeUser(parsed.user);
  const coachMethodologies = parsed.coachMethodologies?.length ? parsed.coachMethodologies : fallback.coachMethodologies;
  const activeCoachMethodologyId = parsed.activeCoachMethodologyId ?? coachMethodologies.find((methodology) => methodology.active)?.id;
  const activeMethodology = coachMethodologies.find((methodology) => methodology.id === activeCoachMethodologyId && methodology.active && methodology.approved);
  const program = parsed.program?.durationWeeks === 4 ? parsed.program : generateTrainingProgram(user, activeMethodology);
  return { ...fallback, ...parsed, auth: parsed.auth ?? { isAuthenticated: isLegacy, onboardingCompleted: isLegacy }, user, program, coachMethodologies, activeCoachMethodologyId };
}

function freshLocalAccount(name: string, email: string, password: string): AppState {
  const normalizedEmail = email.trim().toLowerCase();
  const user = normalizeUser({
    ...demoProfile,
    id: `local-${Date.now()}`,
    name: name.trim() || "عضو باشگاه",
    email: normalizedEmail,
    role: "user",
    focusAreas: [],
    injuries: [],
    injuryNotes: "",
  });
  return {
    auth: { isAuthenticated: true, onboardingCompleted: false, account: { email: normalizedEmail, password } },
    user,
    program: generateTrainingProgram(user, demoCoachMethodology),
    mealPlan: generateMealPlan(user),
    foodLogs: [],
    workouts: [],
    reminders: [],
    checkIns: [],
    coachMethodologies: [demoCoachMethodology],
    activeCoachMethodologyId: demoCoachMethodology.id,
  };
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = window.localStorage.getItem(STORAGE_KEY);
    const legacy = current ? null : window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const raw = current ?? legacy;
    if (raw) {
      try {
        setState(normalizeState(JSON.parse(raw) as Partial<AppState>, Boolean(legacy)));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const commit = (updater: (current: AppState) => AppState) => {
    setState((current) => {
      const next = updater(current);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return useMemo(() => ({
    ready,
    state,
    createLocalAccount: (name: string, email: string, password: string) => {
      const next = freshLocalAccount(name, email, password);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setState(next);
    },
    loginLocalAccount: (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const storedAccount = state.auth.account;
      const matches = storedAccount
        ? storedAccount.email === normalizedEmail && storedAccount.password === password
        : state.user.email.toLowerCase() === normalizedEmail;
      if (matches) {
        const next = { ...state, auth: { ...state.auth, isAuthenticated: true } };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setState(next);
      }
      return matches;
    },
    completeOnboarding: (user: UserProfile) => commit((current) => {
      const activeMethodology = current.coachMethodologies.find((methodology) => methodology.id === current.activeCoachMethodologyId && methodology.active && methodology.approved);
      const completedUser = { ...user, equipment: ["commercial_gym"] as UserProfile["equipment"] };
      return { ...current, auth: { isAuthenticated: true, onboardingCompleted: true }, user: completedUser, program: generateTrainingProgram(completedUser, activeMethodology), mealPlan: generateMealPlan(completedUser) };
    }),
    setUser: (user: UserProfile) => commit((current) => {
      const activeMethodology = current.coachMethodologies.find((methodology) => methodology.id === current.activeCoachMethodologyId && methodology.active);
      return { ...current, user, program: generateTrainingProgram(user, activeMethodology), mealPlan: generateMealPlan(user) };
    }),
    logout: () => commit((current) => ({ ...current, auth: { ...current.auth, isAuthenticated: false } })),
    resetDemo: () => commit(() => initialState()),
    addCoachMethodology: (methodology: CoachMethodology) => commit((current) => ({ ...current, coachMethodologies: [methodology, ...current.coachMethodologies] })),
    reviewCoachMethodologyById: (id: string) => commit((current) => ({ ...current, coachMethodologies: current.coachMethodologies.map((methodology) => methodology.id === id ? reviewCoachMethodology(methodology) : methodology) })),
    approveCoachMethodology: (id: string) => commit((current) => ({ ...current, coachMethodologies: current.coachMethodologies.map((methodology) => methodology.id === id ? { ...methodology, approved: true, updatedAt: new Date().toISOString() } : methodology) })),
    activateCoachMethodology: (id: string) => commit((current) => {
      const coachMethodologies = current.coachMethodologies.map((methodology) => ({ ...methodology, active: methodology.id === id }));
      const activeMethodology = coachMethodologies.find((methodology) => methodology.id === id && methodology.approved);
      return { ...current, coachMethodologies, activeCoachMethodologyId: id, program: generateTrainingProgram(current.user, activeMethodology) };
    }),
    regenerateProgramWithActiveMethodology: () => commit((current) => {
      const activeMethodology = current.coachMethodologies.find((methodology) => methodology.id === current.activeCoachMethodologyId && methodology.active && methodology.approved);
      return { ...current, program: generateTrainingProgram(current.user, activeMethodology) };
    }),
    addFoodLog: (log: FoodLog) => commit((current) => ({ ...current, foodLogs: [log, ...current.foodLogs] })),
    removeFoodLog: (id: string) => commit((current) => ({ ...current, foodLogs: current.foodLogs.filter((log) => log.id !== id) })),
    addReminder: (reminder: Reminder) => commit((current) => ({ ...current, reminders: [reminder, ...current.reminders] })),
    toggleReminder: (id: string) => commit((current) => ({ ...current, reminders: current.reminders.map((reminder) => reminder.id === id ? { ...reminder, active: !reminder.active } : reminder) })),
    addWorkout: (workout: WorkoutSession) => commit((current) => ({ ...current, workouts: [workout, ...current.workouts] })),
    addCheckIn: (checkIn: WeeklyCheckIn) => commit((current) => ({ ...current, checkIns: [...current.checkIns, checkIn] })),
  }), [ready, state]);
}
