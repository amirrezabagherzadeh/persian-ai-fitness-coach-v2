"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Dumbbell, LockKeyhole, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nf } from "@/lib/format";
import { Label } from "@/components/ui/label";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { ready, state, createLocalAccount, loginLocalAccount } = useAppStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [error, setError] = useState("");

  const normalizePhone = (value: string) => value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[\s-]/g, "")
    .replace(/^\+98/, "0")
    .replace(/^98/, "0");

  const requestCode = () => {
    setError("");
    if (mode === "signup" && !name.trim()) return setError("نام و نام خانوادگی را وارد کن.");
    const normalizedPhone = normalizePhone(phone);
    if (!/^09\d{9}$/.test(normalizedPhone)) return setError("شماره موبایل را به شکل ۰۹۱۲۱۲۳۴۵۶۷ وارد کن.");
    setPhone(normalizedPhone);
    setStep("code");
  };

  const updateCodeDigit = (index: number, value: string) => {
    const digit = normalizePhone(value).replace(/\D/g, "").slice(-1);
    const digits = Array.from({ length: 4 }, (_, digitIndex) => code[digitIndex] ?? "");
    digits[index] = digit;
    setCode(digits.join(""));
    if (digit && index < 3) document.getElementById(`code-${index + 1}`)?.focus();
  };

  const pasteCode = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = normalizePhone(event.clipboardData.getData("text")).replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    setCode(pasted);
    document.getElementById(`code-${Math.min(pasted.length, 4) - 1}`)?.focus();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (step === "phone") return requestCode();
    if (normalizePhone(code) !== "1323") return setError("کد تأیید درست نیست. برای این نسخه، کد ۱۳۲۳ است.");
    if (mode === "signup") {
      createLocalAccount(name, phone);
      router.push("/onboarding");
      return;
    }
    if (!ready) return setError("یک لحظه صبر کن تا حساب این مرورگر آماده شود.");
    if (!loginLocalAccount(phone)) return setError("برای این شماره حسابی پیدا نشد. ابتدا ثبت‌نام کن.");
    router.push(state.auth.onboardingCompleted ? "/dashboard" : "/onboarding");
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
          <div className="auth-form-heading"><span className="auth-icon">{step === "code" ? <LockKeyhole /> : <MessageSquareText />}</span><div><p>{mode === "signup" ? "شروع برنامه اختصاصی" : "خوش برگشتی"}</p><h2>{step === "code" ? "کد تأیید را وارد کن" : mode === "signup" ? "با شماره موبایل ثبت‌نام کن" : "با شماره موبایل وارد شو"}</h2></div></div>
          <div className="auth-progress" aria-label={step === "phone" ? "مرحله ورود شماره" : "مرحله تأیید کد"}><span className={step === "phone" ? "active" : "done"}>۱</span><i /><span className={step === "code" ? "active" : ""}>۲</span></div>
          {step === "phone" ? <>
            {mode === "signup" ? <div className="grid gap-2"><Label htmlFor="name">نام و نام خانوادگی</Label><Input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="مثلاً امیر رضایی" /></div> : null}
            <div className="grid gap-2"><Label htmlFor="phone">شماره موبایل</Label><Input className="auth-phone-input" dir="ltr" id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="۰۹۱۲۱۲۳۴۵۶۷" required /><span className="helper-text">کد ورود را به همین شماره می‌فرستیم.</span></div>
          </> : <div className="auth-code-stage">
            <p>کد تأیید ارسال شد. کد ارسال‌شده به <b dir="ltr">{phone}</b> را وارد کنید.</p>
            <div className="grid gap-2">
              <Label>کد ۴ رقمی</Label>
              <div className="auth-code-inputs" dir="ltr">
                {Array.from({ length: 4 }, (_, index) => (
                  <Input
                    key={index}
                    className="auth-code-box"
                    id={`code-${index}`}
                    aria-label={`رقم ${nf(index + 1)} کد تأیید`}
                    style={{ textAlign: "center", direction: "ltr" }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    autoFocus={index === 0}
                    value={code[index] ?? ""}
                    onPaste={pasteCode}
                    onChange={(event) => updateCodeDigit(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !code[index] && index > 0) document.getElementById(`code-${index - 1}`)?.focus();
                    }}
                    required
                  />
                ))}
              </div>
            </div>
            <Button type="button" variant="ghost" className="auth-edit-phone" onClick={() => { setStep("phone"); setCode(""); }}><ChevronRight /> ویرایش شماره</Button>
          </div>}
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <Button className="auth-submit" size="lg" type="submit" disabled={!ready || (mode === "login" && step === "phone" && !phone)}>{step === "phone" ? "ارسال کد ورود" : mode === "signup" ? "تأیید و ادامه به ارزیابی" : "ورود به برنامه"}<ArrowLeft /></Button>
          <p className="auth-switch">{mode === "signup" ? "قبلاً حساب ساخته‌ای؟ " : "هنوز حساب نداری؟ "}<Link href={mode === "signup" ? "/auth/login" : "/auth/signup"}>{mode === "signup" ? "وارد شو" : "ثبت‌نام کن"}</Link></p>
        </form>
      </section>
    </main>
  );
}
