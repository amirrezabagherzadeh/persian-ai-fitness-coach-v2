"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Dumbbell, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { ready, state, createLocalAccount, loginLocalAccount } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim()) return setError("ایمیل را وارد کن.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("فرمت ایمیل درست نیست.");
    if (password.length < 6) return setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    if (mode === "signup") {
      if (!name.trim()) return setError("نامت را وارد کن تا برنامه با نام خودت ساخته شود.");
      createLocalAccount(name, email, password);
      router.push("/onboarding");
      return;
    }
    if (!ready) return setError("یک لحظه صبر کن تا حساب این مرورگر آماده شود.");
    if (!loginLocalAccount(email, password)) return setError("ایمیل یا رمز عبور درست نیست؛ یا ابتدا ثبت‌نام کن.");
    router.push(state.auth.onboardingCompleted ? "/program" : "/onboarding");
  };

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="مزایای برنامه اختصاصی">
        <Link className="brand auth-brand" href="/"><span className="brand-mark"><Dumbbell /></span><span>Gym Coach</span></Link>
        <div className="auth-story-copy">
          <span className="onboarding-kicker">هدیه باشگاه برای اعضا</span>
          <h1>برنامه رایگان تو، آماده برای اجرا در باشگاه</h1>
          <p>شرایط بدنی و زمانت را می‌گیریم، برنامه چهار هفته‌ای می‌سازیم و اجرای هر حرکت را همان‌جا نشانت می‌دهیم.</p>
          <ul>
            <li><Check /> متناسب با هدف و سطح تمرین</li>
            <li><Check /> هماهنگ با روزهای حضور در باشگاه</li>
            <li><Check /> همراه آموزش تصویری و نقشه عضلات</li>
          </ul>
        </div>
        <div className="auth-trust"><ShieldCheck /><span>اطلاعات این دموی تعاملی فقط روی همین مرورگر ذخیره می‌شود.</span></div>
      </section>

      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-form-heading"><span className="auth-icon"><Sparkles /></span><div><p>{mode === "signup" ? "شروع برنامه اختصاصی" : "خوش برگشتی"}</p><h2>{mode === "signup" ? "حساب رایگان بساز" : "وارد حساب شو"}</h2></div></div>
          {mode === "signup" ? <div className="grid gap-2"><Label htmlFor="name">نام و نام خانوادگی</Label><Input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="مثلاً امیر رضایی" /></div> : null}
          <div className="grid gap-2"><Label htmlFor="email">ایمیل</Label><Input className="text-left" dir="ltr" id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required /></div>
          <div className="grid gap-2"><Label htmlFor="password">رمز عبور</Label><div className="password-field"><Input className="text-left pe-12" dir="ltr" id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required /><Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}>{showPassword ? <EyeOff /> : <Eye />}</Button></div><span className="helper-text">حداقل ۶ کاراکتر</span></div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <Button className="auth-submit" size="lg" type="submit" disabled={mode === "login" && !ready}>{mode === "signup" ? "ادامه به ارزیابی" : "ورود به برنامه"}<ArrowLeft /></Button>
          <p className="auth-switch">{mode === "signup" ? "قبلاً حساب ساخته‌ای؟ " : "هنوز حساب نداری؟ "}<Link href={mode === "signup" ? "/auth/login" : "/auth/signup"}>{mode === "signup" ? "وارد شو" : "ثبت‌نام کن"}</Link></p>
        </form>
      </section>
    </main>
  );
}
