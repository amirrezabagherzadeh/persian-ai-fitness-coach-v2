"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { useAppStore } from "@/store/app-store";
import { exercises } from "@/data/exercises";
import { foods } from "@/data/foods";
import { knowledgeItems } from "@/data/knowledge";
import { createCoachMethodology } from "@/domain/coach-methodology";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AdminPage() {
  const { state, addCoachMethodology, reviewCoachMethodologyById, approveCoachMethodology, activateCoachMethodology, regenerateProgramWithActiveMethodology } = useAppStore();
  const [coachName, setCoachName] = useState("Coach Ali");
  const [title, setTitle] = useState("Upper/Lower Hypertrophy Method");
  const [audience, setAudience] = useState("Intermediate lifters, commercial gym, 4 days/week");
  const [rawMethod, setRawMethod] = useState("Use upper lower for 4 training days. Moderate to high volume. Free weight compounds first, machines for accessories. Double progression. Keep 1-2 RIR for most sets and avoid failure for beginners. Add recovery/deload when performance drops.");
  const [wantsAiReview, setWantsAiReview] = useState(true);
  const allowed = state.user.role === "admin";
  const activeMethodology = state.coachMethodologies.find((methodology) => methodology.id === state.activeCoachMethodologyId);
  return (
    <AppShell>
      <div className="page">
        <PageHeader title="داشبورد ادمین" eyebrow="مدیریت روش مربی و دانش" description="مربی می‌تواند روش برنامه‌نویسی خودش را وارد کند، AI review اختیاری بگیرد، approve کند و برنامه‌ها را با همان سبک بسازد." />
        {!allowed ? <section className="panel"><p className="muted">دسترسی ادمین لازم است.</p></section> : (
          <>
            <div className="grid grid-3">
              <MetricCard label="کاربران" value="۱" helper="دمو" />
              <MetricCard label="برنامه‌های تولیدشده" value="۱" helper={`نسخه ${state.program.version}`} />
              <MetricCard label="روش فعال مربی" value={activeMethodology?.title ?? "ندارد"} helper={activeMethodology ? activeMethodology.coachName : "default rules"} />
            </div>
            <section className="light-panel mt-4">
              <div className="split">
                <div>
                  <span className="tag">Coach Methodology</span>
                  <h2>روش برنامه‌نویسی مربی</h2>
                </div>
                <Button variant="ghost" onClick={regenerateProgramWithActiveMethodology}>ساخت دوباره برنامه با روش فعال</Button>
              </div>
              <div className="grid grid-2">
                <div className="grid">
                  <label className="field">نام مربی<Input value={coachName} onChange={(event) => setCoachName(event.target.value)} /></label>
                  <label className="field">نام متد<Input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
                  <label className="field">مخاطب هدف<Input value={audience} onChange={(event) => setAudience(event.target.value)} /></label>
                  <label className="field">توضیح کامل روش مربی<Textarea value={rawMethod} onChange={(event) => setRawMethod(event.target.value)} /></label>
                  <label className="choice selected flex items-center gap-2.5">
                    <Checkbox checked={wantsAiReview} onCheckedChange={(checked) => setWantsAiReview(checked === true)} />
                    AI روش را review و به rules ساختاری تبدیل کند
                  </label>
                  <Button
                    onClick={() => {
                      addCoachMethodology(createCoachMethodology({ coachName, title, audience, rawMethod, wantsAiReview }));
                    }}
                  >
                    اضافه کردن روش مربی
                  </Button>
                </div>
                <div className="panel">
                  <h3>روش فعال در برنامه فعلی</h3>
                  <p className="muted">{activeMethodology?.title ?? "هیچ روش مربی فعال نیست."}</p>
                  {activeMethodology ? (
                    <table className="table">
                      <tbody>
                        <tr><th>Split</th><td>{activeMethodology.normalizedRules.preferredSplit}</td></tr>
                        <tr><th>Volume</th><td>{activeMethodology.normalizedRules.volumeBias}</td></tr>
                        <tr><th>Intensity</th><td>{activeMethodology.normalizedRules.intensityStyle}</td></tr>
                        <tr><th>Progression</th><td>{activeMethodology.normalizedRules.progressionStyle}</td></tr>
                        <tr><th>Exercise bias</th><td>{activeMethodology.normalizedRules.exerciseBias}</td></tr>
                      </tbody>
                    </table>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 grid">
                {state.coachMethodologies.map((methodology) => (
                  <article className="panel" key={methodology.id}>
                    <div className="split">
                      <div>
                        <h3>{methodology.title}</h3>
                        <p className="muted">{methodology.coachName} | {methodology.audience}</p>
                      </div>
                      <span className="tag">{methodology.active ? "فعال" : methodology.approved ? "approved" : "draft"}</span>
                    </div>
                    <p className="muted">{methodology.aiReviewSummary ?? "AI review درخواست نشده است. قوانین اولیه مستقیم از متن مربی استخراج شده‌اند."}</p>
                    {methodology.reviewFindings.map((finding) => <p className="muted" key={finding}>• {finding}</p>)}
                    <div className="button-row">
                      <Button variant="secondary" onClick={() => reviewCoachMethodologyById(methodology.id)}>AI review</Button>
                      <Button variant="secondary" onClick={() => approveCoachMethodology(methodology.id)}>Approve</Button>
                      <Button onClick={() => activateCoachMethodology(methodology.id)} disabled={!methodology.approved}>Activate + regenerate</Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <div className="mt-4 grid grid-2">
              <section className="light-panel">
                <h2>Exercises</h2>
                <Input placeholder="جستجو..." />
                {exercises.slice(0, 8).map((exercise) => <div className="exercise-row" key={exercise.id}><div className="split"><strong>{exercise.nameFa}</strong><span className="tag">{exercise.movementPattern}</span></div></div>)}
              </section>
              <section className="light-panel">
                <h2>Foods</h2>
                <Input placeholder="جستجو..." />
                {foods.slice(0, 8).map((food) => <div className="meal-row" key={food.id}><div className="split"><strong>{food.nameFa}</strong><span>{food.calories} kcal</span></div></div>)}
              </section>
              <section className="light-panel">
                <h2>Knowledge Review</h2>
                {knowledgeItems.map((item) => <div className="reminder-row" key={item.id}><strong>{item.topic}</strong><p className="muted-dark">{item.claim}</p><span className="tag">{item.evidenceLevel}</span></div>)}
              </section>
              <section className="light-panel">
                <h2>Program Rules</h2>
                <table className="table"><tbody><tr><th>Protein min</th><td>1.6 g/kg</td></tr><tr><th>Max deficit</th><td>550 kcal</td></tr><tr><th>Beginner sets</th><td>2 per exercise</td></tr><tr><th>Progression</th><td>top reps + target RIR</td></tr></tbody></table>
              </section>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
