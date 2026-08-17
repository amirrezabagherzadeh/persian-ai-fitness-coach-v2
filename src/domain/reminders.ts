import type { Reminder } from "@/domain/types";

export function nextReminder(reminders: Reminder[], now = new Date()): Reminder | undefined {
  const active = reminders.filter((item) => item.active);
  if (active.length === 0) return undefined;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return active
    .map((item) => {
      const [hour, minute] = item.time.split(":").map(Number);
      const minutes = hour * 60 + minute;
      return { item, delta: minutes >= currentMinutes ? minutes - currentMinutes : minutes + 24 * 60 - currentMinutes };
    })
    .sort((a, b) => a.delta - b.delta)[0]?.item;
}
