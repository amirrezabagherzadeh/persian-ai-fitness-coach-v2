import { describe, expect, it } from "vitest";
import { nextReminder } from "@/domain/reminders";
import type { Reminder } from "@/domain/types";

describe("reminders", () => {
  it("finds the next active reminder today", () => {
    const reminders: Reminder[] = [
      { id: "1", type: "meal", title: "ناهار", day: "هر روز", time: "13:00", active: true },
      { id: "2", type: "workout", title: "تمرین", day: "هر روز", time: "18:00", active: true },
    ];
    expect(nextReminder(reminders, new Date("2026-08-15T14:00:00"))?.id).toBe("2");
  });
});
