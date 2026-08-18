"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // A service worker can keep an old demo shell alive while developing.
    // Keep localhost fresh; the worker is only useful for production installs.
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
        await Promise.all(registrations.map((registration) => registration.unregister()));
        if ("caches" in window) {
          const cacheNames = await window.caches.keys();
          await Promise.all(cacheNames.filter((name) => name.startsWith("gym-coach-shell-")).map((name) => window.caches.delete(name)));
        }
      });
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}
