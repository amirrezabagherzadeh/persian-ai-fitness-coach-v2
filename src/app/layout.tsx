import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/PwaRegister";
import "@fontsource-variable/vazirmatn/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "مربی هوشمند تمرین و تغذیه",
  description: "برنامه تمرین، تغذیه و پیگیری روزانه بر اساس شرایط واقعی شما.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#101413",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
