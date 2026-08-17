"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Dumbbell, LineChart, Salad, User, Shield, Bell, Bot } from "lucide-react";
import { fa } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/dashboard", label: fa.nav.today, icon: Activity },
  { href: "/program", label: fa.nav.program, icon: Dumbbell },
  { href: "/nutrition", label: fa.nav.nutrition, icon: Salad },
  { href: "/progress", label: fa.nav.progress, icon: LineChart },
  { href: "/profile", label: fa.nav.profile, icon: User },
];

const secondaryLinks = [
  { href: "/reminders", label: "یادآورها", icon: Bell },
  { href: "/coach", label: "مربی AI", icon: Bot },
  { href: "/admin", label: "ادمین", icon: Shield },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen border-s border-sidebar-border bg-sidebar px-4 py-6 lg:block" aria-label="ناوبری اصلی">
        <Link className="flex items-center gap-2.5 font-bold" href="/dashboard">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm"><Dumbbell className="size-5" /></span>
          <span>Gym Coach</span>
        </Link>
        <nav className="mt-8 grid gap-1">
          {[...mainLinks, ...secondaryLinks].map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", isActive(link.href) && "bg-sidebar-accent text-primary")} href={link.href}>
                <Icon className="size-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="ناوبری موبایل">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className={cn("grid min-h-16 place-items-center gap-0.5 text-[11px] text-muted-foreground", isActive(link.href) && "text-primary")}>
              <Icon className="size-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
