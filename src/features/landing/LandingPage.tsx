import Link from "next/link";
import { Activity, Bell, Dumbbell, Flame, LineChart, Salad, ShieldCheck, Trophy } from "lucide-react";

const benefits = [
  { title: "تمرین شخصی", text: "ساختار برنامه از قوانین تمرین، تجهیزات و سابقه شما می‌آید؛ نه حدس تصادفی AI.", icon: Dumbbell },
  { title: "تغذیه قابل اجرا", text: "کالری و ماکرو با فرمول مشخص محاسبه می‌شود و وعده‌ها به غذای واقعی تبدیل می‌شوند.", icon: Salad },
  { title: "راهنمای امروز", text: "هر روز می‌بینی امروز دقیقاً چه تمرینی، چه وعده‌ای و چه یادآوری داری.", icon: Activity },
  { title: "پیشرفت قابل فهم", text: "وزن، دور کمر، تمرین، پروتئین و پایبندی هفتگی در یک نگاه.", icon: LineChart },
  { title: "یادآوری‌ها", text: "تمرین، وعده غذایی، آب و چک‌این هفتگی با معماری آماده اعلان مرورگر.", icon: Bell },
  { title: "دانش قابل بازبینی", text: "منابع علمی و متدولوژی‌ها فقط پس از تایید مدیر وارد موتور توصیه می‌شوند.", icon: ShieldCheck },
];

export function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="grid grid-2 items-center">
            <div className="hero-copy">
              <div className="eyebrow">AI Fitness Coach</div>
              <h1>برنامه‌ای که با بدن و زندگی تو هماهنگ می‌شود.</h1>
              <p className="text-lg leading-9 text-muted-foreground">
                تمرین، تغذیه و پیگیری روزانه؛ شخصی‌سازی‌شده بر اساس شرایط واقعی تو.
              </p>
              <div className="button-row">
                <Link className="btn primary" href="/auth/signup">برنامه من را بساز</Link>
                <Link className="btn secondary" href="/dashboard">دیدن دمو</Link>
              </div>
            </div>
            <div className="rounded-3xl border bg-card p-3.5 shadow-2xl md:-rotate-3">
              <div className="light-panel min-h-[560px] rounded-3xl">
                <div className="app-topbar">
                  <div className="avatar">ج</div>
                  <div>
                    <div className="muted-dark">سلام، James</div>
                    <strong>امروز آماده‌ای؟</strong>
                  </div>
                  <Bell size={20} color="var(--accent)" />
                </div>
                <div className="pill-search">جستجوی تمرین، غذا یا هدف...</div>
                <div className="lime-progress-card mt-3.5">
                  <div className="split">
                    <div>
                      <span className="tag">Today Progress</span>
                      <h2 className="mt-2.5">۷۰٪</h2>
                    </div>
                    <Trophy color="var(--accent)" />
                  </div>
                  <div className="calorie-ring">
                    <div className="text-center"><strong>821</strong><div>kcal</div></div>
                  </div>
                </div>
                <div className="category-strip mt-3.5">
                  <span className="category-chip active"><Flame size={16} />Full Body</span>
                  <span className="category-chip"><Dumbbell size={16} />Strength</span>
                  <span className="category-chip"><Salad size={16} />Meal</span>
                </div>
                <div className="workout-media-card light-panel mt-3.5">
                  <span className="tag">تمرین امروز</span>
                  <h3>Full Body Burn</h3>
                  <p className="muted-dark">۱۵ دقیقه گرم‌کردن، ۶ حرکت اصلی</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <main className="page px-4 py-11 pb-18">
        <div className="grid grid-3">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <article className="panel" key={item.title}>
                <Icon color="var(--accent)" />
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
              </article>
            );
          })}
        </div>
        <section className="light-panel mt-5">
          <h2>سوال‌های رایج</h2>
          <div className="grid grid-2">
            <p><strong>آیا AI برنامه را می‌سازد؟</strong><br />محاسبات و ساختار تمرین deterministic است. AI فقط توضیح و مربی‌گری زبانی را کمک می‌کند.</p>
            <p><strong>آیا جایگزین پزشک است؟</strong><br />خیر. در شرایط پرخطر برنامه محافظه‌کارانه می‌شود و توصیه ارزیابی حرفه‌ای نمایش داده می‌شود.</p>
          </div>
        </section>
      </main>
    </>
  );
}
