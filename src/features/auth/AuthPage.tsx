"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { state, setUser } = useAppStore();
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
        <form
          className="w-full max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            setUser({ ...state.user, name: name || "کاربر", email, role: email.includes("admin") ? "admin" : state.user.role });
            router.push(mode === "signup" ? "/onboarding" : "/dashboard");
          }}
        >
          <Card>
            <CardHeader>
              <div className="mb-3 flex items-center gap-2.5 font-bold">
                <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Dumbbell className="size-5" /></span>
                <span>Gym Coach</span>
              </div>
              <CardTitle className="text-3xl font-bold">{mode === "signup" ? "ساخت حساب" : "ورود"}</CardTitle>
              <CardDescription className="leading-6">در نسخه MVP احراز هویت به صورت محلی شبیه‌سازی شده و برای Supabase آماده است.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {mode === "signup" ? (
                <div className="grid gap-2">
                  <Label htmlFor="name">نام</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input className="text-left" dir="ltr" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input className="text-left" dir="ltr" id="password" type="password" minLength={6} defaultValue="demo1234" required />
              </div>
              <Button className="mt-1 w-full" size="lg" type="submit">
                {mode === "signup" ? "ادامه به ارزیابی" : "ورود به داشبورد"}
              </Button>
              <p className="text-sm text-muted-foreground">
                {mode === "signup" ? "حساب داری؟ " : "حساب نداری؟ "}
                <Link className="font-medium text-primary hover:underline" href={mode === "signup" ? "/auth/login" : "/auth/signup"}>{mode === "signup" ? "وارد شو" : "ثبت‌نام کن"}</Link>
              </p>
            </CardContent>
          </Card>
        </form>
    </main>
  );
}
