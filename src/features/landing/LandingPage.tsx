import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, Dumbbell, Play, ShieldCheck, Sparkles, Target } from "lucide-react";

const steps = [
  { number: "۰۱", title: "شرایطت را می‌گویی", text: "هدف، سابقه، روزهای تمرین و محدودیت‌های بدنی." },
  { number: "۰۲", title: "برنامه‌ات ساخته می‌شود", text: "یک دوره چهار هفته‌ای متناسب با زمان حضور تو در باشگاه." },
  { number: "۰۳", title: "حرکت را درست اجرا می‌کنی", text: "ویدیوی بی‌صدا، تصویر شروع و پایان و نمایش دقیق عضلات هدف." },
];

export function LandingPage() {
  return (
    <main className="demo-landing">
      <nav className="landing-nav"><Link className="brand" href="/"><span className="brand-mark"><Dumbbell /></span><span>Gym Coach</span></Link><div><Link className="landing-login" href="/auth/login">ورود اعضا</Link><Link className="btn primary" href="/auth/signup">دریافت برنامه</Link></div></nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="onboarding-kicker"><Sparkles /> برنامه اختصاصی رایگان اعضای باشگاه</span>
          <h1>ثبت‌نام کن.<br /><em>برنامه خودت</em> را بگیر.</h1>
          <p>بر اساس بدن، هدف، سابقه و روزهایی که به باشگاه می‌آیی؛ همراه با آموزش تصویری تمام حرکت‌ها.</p>
          <div className="landing-actions"><Link className="btn primary landing-primary" href="/auth/signup">ساخت برنامه رایگان <ArrowLeft /></Link><a className="btn ghost" href="#how-it-works"><Play /> چطور کار می‌کند؟</a></div>
          <div className="landing-proof"><span><Check /> چهار هفته کامل</span><span><Check /> مخصوص باشگاه کامل</span><span><Check /> بدون هزینه برای عضو</span></div>
        </div>

        <div className="program-showcase" aria-label="پیش‌نمایش برنامه تمرینی">
          <div className="showcase-grid" aria-hidden="true" />
          <div className="showcase-top"><div><span>برنامه این ماه</span><strong>قدرت و فرم‌دهی</strong></div><span className="showcase-badge">هفته ۱ از ۴</span></div>
          <div className="showcase-week">{["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, index) => <span className={index === 0 || index === 2 || index === 4 ? "active" : ""} key={day + index}>{day}</span>)}</div>
          <div className="showcase-workout">
            <div className="showcase-image"><Image src="/exercises/dumbbell-press-0.jpg" alt="پرس سینه دمبل" fill sizes="(max-width: 768px) 85vw, 420px" priority /></div>
            <div className="showcase-label"><span><CalendarDays /> شنبه · بالاتنه A</span><strong>پرس سینه دمبل</strong><small dir="ltr" lang="en">Dumbbell Bench Press</small></div>
            <div className="showcase-prescription"><span><b>۳</b> ست</span><span><b>۸–۱۲</b> تکرار</span><button type="button" aria-label="پخش آموزش"><Play /></button></div>
          </div>
          <div className="showcase-footer"><Target /><div><strong>عضلات هدف</strong><span>سینه · پشت بازو · سرشانه جلویی</span></div></div>
        </div>
      </section>

      <section className="landing-steps" id="how-it-works"><header><span>مسیر ساده عضو</span><h2>از ثبت‌نام تا اولین تمرین، در چند دقیقه</h2></header><div className="steps-grid">{steps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
      <section className="landing-safety"><ShieldCheck /><div><strong>برنامه با محدودیت‌های تو هماهنگ می‌شود</strong><p>آسیب‌ها و دردهای ثبت‌شده در انتخاب حرکت‌ها لحاظ می‌شوند. این دمو جایگزین ارزیابی پزشکی یا مربی حضوری نیست.</p></div><Link className="btn primary" href="/auth/signup">شروع ارزیابی <ArrowLeft /></Link></section>
    </main>
  );
}
