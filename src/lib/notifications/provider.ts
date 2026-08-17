import type { Reminder } from "@/domain/types";

export interface NotificationProvider {
  requestPermission(): Promise<NotificationPermission | "unsupported">;
  schedule(reminder: Reminder): Promise<void>;
}

export const browserNotificationProvider: NotificationProvider = {
  async requestPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.requestPermission();
  },
  async schedule(reminder) {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(reminder.title, { body: `${reminder.day} - ${reminder.time}` });
    }
  },
};
