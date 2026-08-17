"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoachMethodology, FoodLog, MealPlan, Reminder, TrainingProgram, UserProfile, WeeklyCheckIn, WorkoutSession } from "@/domain/types";
import { demoCheckIns, demoFoodLogs, demoMealPlan, demoProfile, demoProgram, demoReminders, demoWorkouts } from "@/data/demo";
import { demoCoachMethodology } from "@/data/coach-methodologies";
import { generateTrainingProgram } from "@/domain/training";
import { generateMealPlan } from "@/domain/meal-plan";
import { reviewCoachMethodology } from "@/domain/coach-methodology";

export type AppState = {
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

const STORAGE_KEY = "persian-gym-coach-state-v1";

function initialState(): AppState {
  return {
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

function normalizeState(parsed: Partial<AppState>): AppState {
  const fallback = initialState();
  const coachMethodologies = parsed.coachMethodologies && parsed.coachMethodologies.length > 0 ? parsed.coachMethodologies : fallback.coachMethodologies;
  const activeCoachMethodologyId = parsed.activeCoachMethodologyId ?? coachMethodologies.find((methodology) => methodology.active)?.id;
  return {
    ...fallback,
    ...parsed,
    coachMethodologies,
    activeCoachMethodologyId,
  };
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) setState(normalizeState(JSON.parse(raw) as Partial<AppState>));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  return useMemo(() => ({
    ready,
    state,
    setUser: (user: UserProfile) =>
      setState((current) => {
        const activeMethodology = current.coachMethodologies.find((methodology) => methodology.id === current.activeCoachMethodologyId && methodology.active);
        const program = generateTrainingProgram(user, activeMethodology);
        const mealPlan = generateMealPlan(user);
        return { ...current, user, program, mealPlan };
      }),
    resetDemo: () => setState(initialState()),
    addCoachMethodology: (methodology: CoachMethodology) =>
      setState((current) => ({ ...current, coachMethodologies: [methodology, ...current.coachMethodologies] })),
    reviewCoachMethodologyById: (id: string) =>
      setState((current) => ({ ...current, coachMethodologies: current.coachMethodologies.map((methodology) => methodology.id === id ? reviewCoachMethodology(methodology) : methodology) })),
    approveCoachMethodology: (id: string) =>
      setState((current) => ({ ...current, coachMethodologies: current.coachMethodologies.map((methodology) => methodology.id === id ? { ...methodology, approved: true, updatedAt: new Date().toISOString() } : methodology) })),
    activateCoachMethodology: (id: string) =>
      setState((current) => {
        const coachMethodologies = current.coachMethodologies.map((methodology) => ({ ...methodology, active: methodology.id === id }));
        const activeMethodology = coachMethodologies.find((methodology) => methodology.id === id && methodology.approved);
        return {
          ...current,
          coachMethodologies,
          activeCoachMethodologyId: id,
          program: generateTrainingProgram(current.user, activeMethodology),
        };
      }),
    regenerateProgramWithActiveMethodology: () =>
      setState((current) => {
        const activeMethodology = current.coachMethodologies.find((methodology) => methodology.id === current.activeCoachMethodologyId && methodology.active && methodology.approved);
        return { ...current, program: generateTrainingProgram(current.user, activeMethodology) };
      }),
    addFoodLog: (log: FoodLog) => setState((current) => ({ ...current, foodLogs: [log, ...current.foodLogs] })),
    removeFoodLog: (id: string) => setState((current) => ({ ...current, foodLogs: current.foodLogs.filter((log) => log.id !== id) })),
    addReminder: (reminder: Reminder) => setState((current) => ({ ...current, reminders: [reminder, ...current.reminders] })),
    toggleReminder: (id: string) => setState((current) => ({ ...current, reminders: current.reminders.map((r) => r.id === id ? { ...r, active: !r.active } : r) })),
    addWorkout: (workout: WorkoutSession) => setState((current) => ({ ...current, workouts: [workout, ...current.workouts] })),
    addCheckIn: (checkIn: WeeklyCheckIn) => setState((current) => ({ ...current, checkIns: [...current.checkIns, checkIn] })),
  }), [ready, state]);
}
