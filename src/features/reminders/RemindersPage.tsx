"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import type { Reminder } from "@/domain/types";
import { browserNotificationProvider } from "@/lib/notifications/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RemindersPage() {
  const { state, addReminder, toggleReminder } = useAppStore();
  const [title, setTitle] = useState("وعده پروتئینی");
  const [type, setType] = useState<Reminder["type"]>("meal");
  const [time, setTime] = useState("13:30");
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="یادآورها" eyebrow="Notification-ready" description="در MVP داخل برنامه و مرورگر آماده است؛ Push native بعداً با همین مدل اضافه می‌شود." action={<Button onClick={() => browserNotificationProvider.requestPermission()}>فعال‌سازی اعلان مرورگر</Button>} />
        <div className="grid grid-2">
          <section className="light-panel">
            <h2>ساخت یادآور</h2>
            <div className="grid">
              <label className="field">عنوان<Input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
              <label className="field">نوع<Select value={type} onValueChange={(value) => setType(value as Reminder["type"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="workout">تمرین</SelectItem><SelectItem value="meal">وعده</SelectItem><SelectItem value="water">آب</SelectItem><SelectItem value="supplement">مکمل</SelectItem><SelectItem value="weigh_in">وزن‌کشی</SelectItem><SelectItem value="check_in">چک‌این</SelectItem></SelectContent></Select></label>
              <label className="field">زمان<Input className="text-left" dir="ltr" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
              <Button onClick={() => addReminder({ id: `reminder-${Date.now()}`, type, title, day: "هر روز", time, active: true })}>ثبت یادآور</Button>
            </div>
          </section>
          <section className="light-panel">
            <h2>یادآورهای فعال</h2>
            {state.reminders.map((reminder) => (
              <div className="reminder-row" key={reminder.id}>
                <div className="split">
                  <div><strong>{reminder.title}</strong><p className="muted-dark">{reminder.day} - {reminder.time}</p></div>
                  <Button variant="ghost" onClick={() => toggleReminder(reminder.id)}>{reminder.active ? "فعال" : "خاموش"}</Button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
