"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore } from "@/store/app-store";
import { MockAIProvider } from "@/lib/ai/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const provider = new MockAIProvider();

export function CoachPage() {
  const { state } = useAppStore();
  const [question, setQuestion] = useState("امروز چی تمرین دارم؟");
  const [messages, setMessages] = useState<{ role: "user" | "coach"; text: string }[]>([]);
  const ask = async () => {
    const answer = await provider.answer(question, {
      profile: {
        name: state.user.name,
        goal: state.user.goal,
        weightKg: state.user.weightKg,
        daysPerWeek: state.user.daysPerWeek,
        injuries: state.user.injuries,
        medicalFlags: state.user.medicalFlags,
      },
      program: { split: state.program.split, rationale: state.program.rationale },
      nutrition: state.mealPlan.target,
    });
    setMessages((current) => [...current, { role: "user", text: question }, { role: "coach", text: answer }]);
    setQuestion("");
  };
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="مربی AI" eyebrow="توضیح و راهنمایی" description="AI فقط زمینه لازم را دریافت می‌کند و جایگزین تشخیص پزشکی نیست." />
        <section className="panel grid">
          <div className="grid">
            {messages.length === 0 ? <p className="muted">مثلاً بپرس: «اگر امروز باشگاه نرسم چه کنم؟»</p> : messages.map((message, index) => (
              <div key={index} className={message.role === "coach" ? "light-panel" : "panel"}>
                <strong>{message.role === "coach" ? "مربی" : "شما"}</strong>
                <p className={message.role === "coach" ? "muted-dark" : "muted"}>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-2">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="سوالت را بنویس..." />
            <Button onClick={ask} disabled={!question.trim()}>ارسال</Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
