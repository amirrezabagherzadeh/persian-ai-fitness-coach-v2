"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, LogOut, RotateCcw, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

const mainLinks = [
  { href: "/program", label: "برنامه من", icon: Dumbbell },
  { href: "/profile", label: "اطلاعات من", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, state, logout, resetDemo } = useAppStore();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!ready) return;
    if (!state.auth.isAuthenticated) router.replace("/auth/signup");
    else if (!state.auth.onboardingCompleted && pathname !== "/onboarding") router.replace("/onboarding");
  }, [pathname, ready, router, state.auth.isAuthenticated, state.auth.onboardingCompleted]);

  if (!ready || !state.auth.isAuthenticated || !state.auth.onboardingCompleted) {
    return <main className="app-loading"><span className="brand-mark"><Dumbbell /></span><p>در حال آماده‌سازی برنامه تو…</p></main>;
  }

  const handleLogout = () => { logout(); router.push("/auth/login"); };
  const handleReset = () => { resetDemo(); router.push("/auth/signup"); };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="demo-sidebar" aria-label="ناوبری اصلی">
        <Link className="brand" href="/program"><span className="brand-mark"><Dumbbell /></span><span>Gym Coach</span></Link>
        <div className="member-card"><span className="member-avatar">{state.user.name.slice(0, 1)}</span><div><strong>{state.user.name}</strong><span>برنامه چهار هفته‌ای</span></div></div>
        <nav className="demo-nav">{mainLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} className={cn("demo-nav-link", isActive(link.href) && "active")} href={link.href}><Icon /><span>{link.label}</span></Link>; })}</nav>
        <div className="sidebar-actions"><button type="button" onClick={handleReset}><RotateCcw /><span>شروع دوباره دمو</span></button><button type="button" onClick={handleLogout}><LogOut /><span>خروج</span></button></div>
      </aside>
      <main className="min-w-0 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      <nav className="demo-mobile-nav" aria-label="ناوبری موبایل">
        {mainLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} className={cn(isActive(link.href) && "active")} href={link.href}><Icon /><span>{link.label}</span></Link>; })}
        <button type="button" onClick={handleLogout}><LogOut /><span>خروج</span></button>
      </nav>
    </div>
  );
}
