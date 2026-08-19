"use client";

import { useEffect, useState } from "react";
import { faDigits } from "@/lib/format";

export function RestTimer({ seconds, onComplete }: { seconds: number; onComplete?: () => void }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => setLeft(seconds), [seconds]);

  useEffect(() => {
    if (left === 0) {
      onComplete?.();
      return;
    }
    const timer = window.setTimeout(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [left, onComplete]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return <span className="font-mono tabular-nums" dir="ltr">{faDigits(`${mm}:${ss}`)}</span>;
}
