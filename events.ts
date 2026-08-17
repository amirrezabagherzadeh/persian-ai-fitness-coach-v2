export type AnalyticsEvent =
  | "signup_completed"
  | "onboarding_completed"
  | "program_generated"
  | "workout_started"
  | "workout_completed"
  | "meal_logged"
  | "weekly_checkin_completed"
  | "reminder_created"
  | "exercise_replaced";

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void;
}

export const consoleAnalytics: AnalyticsProvider = {
  track(event, properties) {
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics]", event, properties ?? {});
    }
  },
};
