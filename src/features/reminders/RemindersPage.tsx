"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import type { Reminder } from "@/domain/types";
import { browserNotificationProvider } from "@/lib/notifications/provider";

export function RemindersPage() {
  const { state, addReminder, toggleReminder } = useAppStore();
  const [title, setTitle] = useState("وعده پروتئینی");
  const [type, setType] = useState<Reminder["type"]>("meal");
  const [time, setTime] = useState("13:30");
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="یادآورها" eyebrow="Notification-ready" description="در MVP داخل برنامه و مرورگر آماده است؛ Push native بعداً با همین مدل اضافه می‌شود." action={<button className="btn primary" onClick={() => browserNotificationProvider.requestPermission()}>فعال‌سازی اعلان مرورگر</button>} />
        <div className="grid grid-2">
          <section className="light-panel">
            <h2>ساخت یادآور</h2>
            <div className="grid">
              <label className="field">عنوان<input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
              <label className="field">نوع<select className="select" value={type} onChange={(e) => setType(e.target.value as Reminder["type"])}><option value="workout">تمرین</option><option value="meal">وعده</option><option value="water">آب</option><option value="supplement">مکمل</option><option value="weigh_in">وزن‌کشی</option><option value="check_in">چک‌این</option></select></label>
              <label className="field">زمان<input className="input ltr" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
              <button className="btn dark" onClick={() => addReminder({ id: `reminder-${Date.now()}`, type, title, day: "هر روز", time, active: true })}>ثبت یادآور</button>
            </div>
          </section>
          <section className="light-panel">
            <h2>یادآورهای فعال</h2>
            {state.reminders.map((reminder) => (
              <div className="reminder-row" key={reminder.id}>
                <div className="split">
                  <div><strong>{reminder.title}</strong><p className="muted-dark">{reminder.day} - {reminder.time}</p></div>
                  <button className="btn ghost" onClick={() => toggleReminder(reminder.id)}>{reminder.active ? "فعال" : "خاموش"}</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
